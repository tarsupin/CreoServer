import { EventEmitter } from "https://deno.land/std/node/events.ts";
import { serve } from "https://deno.land/std/http/server.ts";
import { acceptWebSocket, isWebSocketCloseEvent, isWebSocketPingEvent, isWebSocketPongEvent, connectWebSocket, WebSocket as STDWebSocket } from "https://deno.land/std/ws/mod.ts";

export class WebSocketServer extends EventEmitter {
    clients: Set<WebSocket> = new Set<WebSocket>();
    
    constructor(private port: Number) {
        super();
        this.connect();
    }
    
    // async scanForDisconnects() {
    //     console.log(this.clients);
        
    //     this.clients.forEach((ws: WebSocket, ws2: WebSocket) => {
            
    //         // If the websocket is closed, register it as being disconnected.
    //         if(!ws.webSocket || ws.webSocket.isClosed) {
    //             ws.close();
    //         }
            
    //         // If the socket has been inactive for too long.
            
    //         // In all other cases, ping the client to see if it's still around.
    //         else {
    //             ws.ping();
    //         }
    //     });
    // }
    
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
    
    // Socket Data
    playerId: number = 0;               // If set, it is attached to a player.
    
    constructor(name: string, endpoint?: string) {
        super();
        
        this.endpoint = endpoint;
        this.name = name;
        
        if(endpoint != undefined) {
            this.createSocket(endpoint);
        }
    }
    
    async createSocket(endpoint: string) {
        try {
            const webSocket = await connectWebSocket(this.endpoint!);
            this.open(webSocket);
            console.log("Connected to `" + this.name + "` at " + endpoint);
        } catch {
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
                
                // Close
                else if (isWebSocketCloseEvent(ev)) {
                    const { code, reason } = ev;
                    this.emit("close", code);
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
            }
            
        } catch (err) {
            this.emit("close", err);
            if (!sock.isClosed) {
                await sock.close(1000).catch(console.error);
            }
        }
    }
    
	async send(message: string | Uint8Array) {
		
		// If the socket is closed, don't send anything.
		// This may run a few times in rapid succession if a socket is lost mid-game, but it will self-correct within a few seconds.
		if(this.isClosed) { return; }
		
		return this.webSocket!.send(message);
	}
	
    async ping(message?: string | Uint8Array) { return this.webSocket!.ping(message); }
    async close(code = 1000, reason?: string): Promise<void> { return this.webSocket!.close(code, reason!); }
    async closeForce() { return this.webSocket!.closeForce(); }
    get isClosed(): boolean | undefined { return this.webSocket!.isClosed; }
}
