import WebServer from "../WebServer/WebServer.ts";
import { config } from "../config.ts";
import Lobby from "./Lobby.ts";

interface RoomServerInfo {
	name: string,					// Name of the Room Server
	isOnline: boolean,				// TRUE if the server is online; FALSE if not.
	conn: any,						// The Socket Connection (ws)
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
export default class LobbyServer extends WebServer {
	
	lobby: Lobby;
	
	roomServers: {
		[port: number]: RoomServerInfo
	}
	
	constructor() {
		super( config.ports.Lobby );
		
		// Prepare Rooms
		this.roomServers = {};
		this.setupRoomServers();

		// Build Server
		this.buildServer();
		this.lobby = new Lobby( this );
		
		// Run Server Loop
		setInterval(() => this.serverLoop(), 4);
	}
	
	private serverLoop() {
		this.timer.update();
		
		if(this.timer.slowTick) {
			
			// Run Lobby
			this.lobby.slowTick();
		}
		
		// Benchmarking
		// const rnd = Math.random();
		// if(rnd > 0.999999) {
		// 	console.log("ms: " + this.timer.delta + ", frame: " + this.timer.frame + ", rnd: " + rnd + ", count: " + count);
		// }
	}
	
	private setupRoomServers() {
		const ports = config.ports as any;
		
		for( let port = ports.RoomServerStart; port <= ports.RoomServerEnd; port++ ) {
			const roomName = ports.RoomServers[port];
			
			// Verify the Room Server has been configured (named).
			if(!roomName) { continue; }
			
			this.roomServers[port] = {
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
	private pingRoomServer( port: number ) {
		let roomServer = this.roomServers[port];
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
	private connectRoomServer( port: number ) {
		let roomServer = this.roomServers[port];
		if(!roomServer || !roomServer.name) { return; }
		
		// Create WebSocket Server
		const WebSocket = require('ws');
		roomServer.conn = new WebSocket('ws://' + config.server.local + ':' + port);
		
		roomServer.conn.on('error', (error: any) => {
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
		
		roomServer.conn.on('open', () => {
			roomServer.conn.send("LobbyServer Welcomes RoomServer " + roomServer.name + ".");
		});
		
		roomServer.conn.on('message', (message: any) => {
			console.log("RoomServer " + roomServer.name + " Says: " + message);
		});
	}
	
	private buildServer(): void {
		
		this.wss.on('connection', ( ws: any, req: any ) => {
			const ip = this.getIPFromConnection( req );
			console.log("Connection From " + ip);
			
			// When User Receives a Message
			// Automatically converts message to string (including from Binary Data).
			ws.on('message', ( message: any ) => {
				console.log('Received: %s', message);
				
			});
			
			// When User Disconnects
			ws.on('close', () => {
				console.log("Connection From " + ip + " Closed");
			});
			
			// Example of Sending to User
			// ws.send('something');
		});
	}
}
