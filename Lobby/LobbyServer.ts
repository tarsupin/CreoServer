import { WebSocket, WebSocketServer } from "../WebServer/WebSocket.ts";
import LobbyFuncCommands from "./LobbyFuncCommands.ts";
import { config } from "../config.ts";
import Lobby from "./Lobby.ts";
import LobbyFuncPlayers from "./LobbyFuncPlayers.ts";
import Timer from "../WebServer/Timer.ts";
import LobbyFuncRoomServers from "./LobbyFuncRoomServers.ts";

interface RoomServerInfo {
	name: string,					// Name of the Room Server
	isOnline: boolean,				// TRUE if the server is online; FALSE if not.
    conn: WebSocket,				// The Socket Connection (ws)
    process?: Deno.Process,         // The child process of the room server.
	roomsOpen: number,				// # of Rooms on Room Server
	playerCount: number,			// # of players in the Room Server (may be estimated)
	
	// List of Rooms
	rooms: { [id: number]: RoomInfo },
}

interface RoomInfo {
	playerCount: number,		// # of Players Assigned to Room
	players: any,				// List of Players in Room
}

// Always Exists on Port 8000
export default class LobbyServer {

    static wss: any;
	static roomServers: {
		[port: number]: RoomServerInfo
	}
	
	constructor() {
        
        // Prepare Socket Server
        LobbyServer.wss = new WebSocketServer(config.ports.Lobby);
        
		// Prepare Lobby
        Lobby.prepareLobby( this );
        
        // Prepare Room Servers
		LobbyServer.roomServers = {};
		LobbyFuncRoomServers.setupAllRoomServers();

		// Build Lobby Server
		this.buildServer();
		
		// Run Server Loop
        setInterval(() => this.serverLoop(), 4);
	}
	
	private serverLoop() {
		Timer.update();
		
		if(Timer.slowTick) {
			
			// Run Lobby
			Lobby.slowTick();
		}
		
		// Benchmarking
		// const rnd = Math.random();
		// if(rnd > 0.999999) {
		// 	console.log("ms: " + Timer.delta + ", frame: " + Timer.frame + ", rnd: " + rnd + ", count: " + count);
		// }
	}
	
	private buildServer(): void {
        
        LobbyServer.wss.on("connection", (ws: WebSocket) => {
            
            // Create New Player
            let pid = LobbyFuncPlayers.addPlayer();
            // TODO: Need to add session data to link the client and server, so it can remember the session.
            
            ws.data.playerId = pid;
            
            // When User Sends Binary Data
            ws.on("bytes", (bytes: Uint8Array) => {
                LobbyFuncCommands.ReceiveByteCommand(ws, bytes)
            });
            
			// When User Sends a Message
            // Automatically converts message to string (including from Binary Data).
            // ws.on("message", function (message: string) {});
            ws.on("message", (message: string) => {
                LobbyFuncCommands.ReceiveTextCommand(ws, message)
            });
            
			// When User Disconnects
			ws.on("close", () => {
				// console.log("Connection Closed");
			});
        });
	}
}
