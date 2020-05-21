import { EventEmitter } from "https://deno.land/std/node/events.ts";
import { serve } from "https://deno.land/std/http/server.ts";
import { acceptWebSocket, isWebSocketCloseEvent, isWebSocketPingEvent, isWebSocketPongEvent, connectWebSocket, WebSocket as STDWebSocket } from "https://deno.land/std/ws/mod.ts";

export class WebSocketServer extends EventEmitter {
    clients: Set<WebSocket> = new Set<WebSocket>();
    
    constructor(private port: Number) {
        super();
        this.connect();
    }
    
    async connect() {
        for await (const req of serve(`:${this.port}`)) {
            const { conn, r: bufReader, w: bufWriter, headers } = req;
            
            try {
                
                const sock = await acceptWebSocket({
                    conn,
                    bufReader,
                    bufWriter,
                    headers,
                });
                
                const ws: WebSocket = new WebSocket("Lobby");
                ws.open(sock);
                this.clients.add(ws);
                this.emit("connection", ws);
            
            } catch (err) {
                console.error(`Failed to accept websocket: ${err}`);
                await req.respond({ status: 400 });
            }
        }
    }
}

export class WebSocket extends EventEmitter {
    webSocket?: STDWebSocket;
    
    endpoint?: string;
    name: string;
    isConnected: boolean;
    
    data: any;
    
    constructor(name: string, endpoint?: string) {
        super();
        
        this.endpoint = endpoint;
        this.name = name;
        this.isConnected = false;
        
        this.data = {};
        
        if(endpoint != undefined) {
            this.createSocket(endpoint);
        }
    }
    
    async createSocket(endpoint: string) {
        try {
            const webSocket = await connectWebSocket(this.endpoint!);
            this.open(webSocket);
            this.isConnected = true;
            console.log("Connected to `" + this.name + "` at " + endpoint);
        } catch {
            this.isConnected = false;
            console.log("Unable to connect to `" + this.name + "` at " + endpoint);
        }
    }
    
    async open(sock: STDWebSocket) {
        this.webSocket = sock;
        this.emit("open");
        
        try {
            for await (const ev of sock) {
                
                // Binary Message
                if (ev instanceof Uint8Array) {
                    this.emit("bytes", ev);
                }
                
                // Text Message
                else if (typeof ev === "string") {
                    this.emit("message", ev);
                }
                
                // Ping
                else if (isWebSocketPingEvent(ev)) {
                    const [, body] = ev;
                    this.emit("ping", body);
                }
                
                // Pong
                else if (isWebSocketPongEvent(ev)) {
                    const [, body] = ev;
                    this.emit("pong", body);
                }
                
                // Close
                else if (isWebSocketCloseEvent(ev)) {
                    const { code, reason } = ev;
                    this.isConnected = false;
                    this.emit("close", code);
                }
            }
            
        } catch (err) {
            this.emit("close", err);
            this.isConnected = false;
            if (!sock.isClosed) {
                await sock.close(1000).catch(console.error);
            }
        }
    }
    
    async ping(message?: string | Uint8Array) { return this.webSocket!.ping(message); }
    async send(message: string | Uint8Array) { return this.webSocket!.send(message); }
    async close(code = 1000, reason?: string): Promise<void> { this.isConnected = false; return this.webSocket!.close(code, reason!); }
    async closeForce() { this.isConnected = false; return this.webSocket!.closeForce(); }
    get isClosed(): boolean | undefined { return this.webSocket!.isClosed; }
}
