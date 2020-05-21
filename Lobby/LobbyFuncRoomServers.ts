import { config } from "../config.ts";
import Lobby from "./Lobby.ts";
import { WebSocket } from "../WebServer/WebSocket.ts";

export default abstract class LobbyFuncRoomServers {
    
    // isRoomServerActive()
    // addRoomServer()
    // disconnectFromRoomServer()
    // restartRoomServer()
    // disableRoomServer()
    
	// Returns an available Room Server
	static getAvailableRoomServer() {
        
	}
    
    // Loops through available Room Servers and attempts to initialize them and connect to them.
	static async setupAllRoomServers() {
		const rsConfigList = config.roomServers;
        
        // Loop through all room servers listed in the config.
        for(let roomServerId = 0; roomServerId < rsConfigList.length; roomServerId++) {
            let rsConfig = rsConfigList[roomServerId];
            
            // Prepare Lobby Tracker
            Lobby.roomServers[roomServerId] = {
                id: roomServerId,
                name: rsConfig.name,
                port: rsConfig.port,
                isOnline: false,
                conn: undefined,
                process: undefined,
                roomsOpen: 0,
                playerCount: 0,
                rooms: {},
            };
            
            // Build Local Room Server
            if(rsConfigList[roomServerId].endpoint == null) {
                LobbyFuncRoomServers.initiateLocalRoomServer(roomServerId);
                
                // We attempt to connect right away because the RoomServer async is %#@*ing !@#!$
                // The {code } = await process.status() that worked perfectly before just suddenly wont't return anything.
                // LobbyFuncRoomServers.connectToRoomServer(roomServerId);
            }
        }
    }
    
    // Trying to start sub-process with Deno, but so far it doesn't seem capable.
    // For now, will need to start on my own.
    static async initiateLocalRoomServer(roomServerId: number) {
        let roomServer = Lobby.roomServers[roomServerId];
		if(!roomServer || !roomServer.name || !roomServer.port) { return; }
        
        const process = Deno.run({
            cmd: [
                "deno",
                "run",
                "--allow-write",
                "--allow-read",
                "--allow-net",
                "server.ts",
                "-port",
                roomServer.port.toString()
            ]
        });
        
        const { code } = await process.status();
        
        // Success
        if(code == 0) {
            console.log("Launched Room Server `" + roomServer.name + "` on port " + roomServer.port + ". PID: " + process.pid);
            roomServer.process = process;
            
            // Attempt to Build Server Commands for this New Server
            LobbyFuncRoomServers.connectToRoomServer(roomServerId);
        }
        
        // Failure
        else {
            console.log("Failed to launch Room Server `" + roomServer.name + "` on port " + roomServer.port + ".");
        }
    }
    
    static async connectToRoomServer( roomServerId: number ) {
        let roomServer = Lobby.roomServers[roomServerId];
        
        roomServer.conn = await new WebSocket(roomServer.name, 'ws://' + config.server.local + ':' + roomServer.port);
        
        // Build Commands for the Room Server, if it's online:
        if(roomServer.conn.isConnected == true) {
            
            roomServer.conn.send("Test This to port" + roomServer.port);
            LobbyFuncRoomServers.buildRoomServerCommands(roomServerId);
        }
    }
	
	// Builds Commands for Room Server Connection
	static async buildRoomServerCommands( roomServerId: number ) {
		let roomServer = Lobby.roomServers[roomServerId];
		if(!roomServer || !roomServer.name || !roomServer.conn) { return; }
        
        roomServer.conn.on("connection", (ws: WebSocket) => {
            
            // ws.data.SOMETHING = "SOMETHING";
            
            // When Lobby Sends Binary Data
            ws.on("bytes", (bytes: Uint8Array) => {
                // LobbyFuncCommands.ReceiveByteCommand(ws, bytes);
            });
            
            ws.on("message", (message: string) => {
                console.log("RoomServer " + roomServer.name + " Says: " + message);
            });
            
            ws.on("open", () => {
                ws.send("Lobby Server Welcomes RoomServer " + roomServer.name + ".");
            });
            
			// When User Disconnects
			ws.on("close", () => {
				// console.log("Connection Closed");
			});
        });   
    }
}
