import { config } from "../config.ts";
import LobbyServer from "./LobbyServer.ts";
import { WebSocket } from "../WebServer/WebSocket.ts";

export default abstract class LobbyFuncRoomServers {
    
    // isRoomServerActive()
    // addRoomServer()
    // disconnectFromRoomServer()
    // restartRoomServer()
    // disableRoomServer()
    
	// Returns an available Room Server
	static getAvailableRoomServer() {
		
		// For now, just randomize the room server selection.
		// TODO LOW PRIORITY: Optimize room server selection.
		const ports = config.ports;
		const start = ports.RoomServerStart;
		const end = ports.RoomServerEnd
		
		return Math.floor(Math.random() * (end - start)) + start;
	}
    
    // Loops through available Room Servers and makes sure they're online.
    // Attempts to initialize Room Servers if they're not available.
	static async setupAllRoomServers() {
		const ports = config.ports as any;
        
		for( let port = ports.RoomServerStart; port <= ports.RoomServerEnd; port++ ) {
			LobbyFuncRoomServers.setupRoomServer(port);
		}
    }
    
    static async setupRoomServer( port: number ) {
		const ports = config.ports as any;
        const roomName = ports.RoomServers[port];
        
        // Verify the Room Server has been configured (named).
        if(!roomName) { return; }
        
        // Prepare Room Server Data
        let roomServer = LobbyServer.roomServers[port];
        if(!roomServer || !roomServer.name || !roomServer.conn) {
            
            LobbyServer.roomServers[port] = {
                name: roomName,
                isOnline: false,
                conn: await new WebSocket(roomName, 'ws://' + config.server.local + ':' + port),
                process: undefined,
                roomsOpen: 0,
                playerCount: 0,
                rooms: {},
            };
            
            console.log("Attempting to connect to Room Server `" + roomName + "` on port " + port + ".");
            
            // Build Commands for the Room Server, if it's online:
            await LobbyFuncRoomServers.buildRoomServerCommands(port);
        }
        
        // Initiate Room Server, if unavailable
        if(LobbyServer.roomServers[port].conn.isConnected == false) {
            await LobbyFuncRoomServers.initiateLocalRoomServer(port);
        }
    }
	
	// Builds Commands for Room Server Connection
	static buildRoomServerCommands( port: number ) {
		let roomServer = LobbyServer.roomServers[port];
		if(!roomServer || !roomServer.name || !roomServer.conn.isConnected) { return; }
        
        roomServer.conn.on("connection", (ws: WebSocket) => {
            
            // // Create New Player
            // let pid = LobbyFuncPlayers.addPlayer();
            // // TODO: Need to add session data to link the client and server, so it can remember the session.
            
            // ws.data.playerId = pid;
            
            // When User Sends Binary Data
            ws.on("bytes", (bytes: Uint8Array) => {
                // LobbyFuncCommands.ReceiveByteCommand(ws, bytes);
            });
            
            ws.on("open", () => {
                ws.send("LobbyServer Welcomes RoomServer " + roomServer.name + ".");
            });
            
            ws.on("message", (message: string) => {
                console.log("RoomServer " + roomServer.name + " Says: " + message);
            });
            
			// When User Disconnects
			ws.on("close", () => {
				// console.log("Connection Closed");
			});
        });   
    }
    
    // Trying to start sub-process with Deno, but so far it doesn't seem capable.
    // For now, will need to start on my own.
    static async initiateLocalRoomServer(port: number) {
        let roomServer = LobbyServer.roomServers[port];
		if(!roomServer || !roomServer.name || !roomServer.conn.isConnected) { return; }
        
        const process = Deno.run({
            cmd: [
                "deno",
                "run",
                "--allow-write",
                "--allow-read",
                "--allow-net",
                "server.ts",
                "-port",
                port.toString()
            ],
        });
        
        const { code } = await process.status();
        
        // Success
        if(code == 0) {
            console.log("Launched Room Server `" + roomServer.name + "` on port " + port + ". PID: " + process.pid);
            roomServer.process = process;
        }
        
        // Failure
        else {
            console.log("Failed to launch Room Server `" + roomServer.name + "` on port " + port + ".");
        }
        
        // Attempt to Build Server Commands for this new Server
        await LobbyFuncRoomServers.buildRoomServerCommands(port);
    }
}
