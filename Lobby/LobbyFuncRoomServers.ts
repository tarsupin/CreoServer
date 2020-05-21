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
	
	static setupRoomServers() {
		const ports = config.ports as any;
		
		for( let port = ports.RoomServerStart; port <= ports.RoomServerEnd; port++ ) {
			const roomName = ports.RoomServers[port];
			
			// Verify the Room Server has been configured (named).
			if(!roomName) { continue; }
			
			LobbyServer.roomServers[port] = {
				name: roomName,
				isOnline: false,
				conn: null,
				roomsOpen: 0,
				playerCount: 0,
				rooms: {},
			};
			
			this.connectRoomServer(port);
		}
	}
	
	// Pings a Room Server; updates data if appropriate.
	static pingRoomServer( port: number ) {
		let roomServer = LobbyServer.roomServers[port];
		if(!roomServer || !roomServer.name || !roomServer.conn) { return; }
		
		const conn = roomServer.conn;
		if(conn.readyState !== conn.OPEN) { return; }
		
		// Ping the Room Server
		conn.ping(true, true, () => {
			console.log("Received Ping Response from Room Server " + roomServer.name);
			roomServer.isOnline = true;
		});
	}
	
	// Attempt to Create Room Server Connection
	static connectRoomServer( port: number ) {
		let roomServer = LobbyServer.roomServers[port];
		if(!roomServer || !roomServer.name) { return; }
        
        console.log("Attempting to connect to Room Server `" + roomServer.name + "` on port " + port);
        
		// Create WebSocket Client
        roomServer.conn = new WebSocket('ws://' + config.server.local + ':' + port);
        
        roomServer.conn.on("error", (error: any) => {
			if(config.local) {
				if(error.code === "ECONNREFUSED") {
					console.log("RoomServer " + roomServer.name + " (Port " + port + ") refused connection.");
					roomServer.conn = null;
				} else {
					console.log("----------- WebSocket Error -----------");
					console.log(error);
				}
			}
        });
        
        roomServer.conn.on("open", () => {
            roomServer.conn.send("LobbyServer Welcomes RoomServer " + roomServer.name + ".");
        });
        
        roomServer.conn.on("message", (message: string) => {
            console.log("RoomServer " + roomServer.name + " Says: " + message);
        });
	}
	
}
