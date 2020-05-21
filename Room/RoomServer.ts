import Timer from "../WebServer/Timer.ts";
import { WebSocketServer } from "../WebServer/WebSocket.ts";

export default class RoomServer {
    readonly wss: any;
	
	constructor( port: number ) {
        
        // Prepare Socket Server
        this.wss = new WebSocketServer(port);
        
		this.buildServer();
		setInterval(() => this.serverLoop(), 4);
	}
	
	private serverLoop() {
		Timer.update();
		
		// Benchmarking
		// const rnd = Math.random();
		// if(rnd > 0.999999) {
		// 	console.log("ms: " + Timer.delta + ", frame: " + Timer.frame + ", rnd: " + rnd + ", count: " + count);
		// }
	}
	
	private buildServer(): void {
		console.log("Building Room");
		
		this.wss.on('connection', ( ws: any, req: any ) => {
			// const ip = this.getIPFromConnection( req );
			// console.log("connection from " + ip);
			
			// When User Receives a Message
			// Automatically converts message to string (including from Binary Data).
			ws.on('message', ( message: any ) => {
				console.log('received: %s', message);
				
			});
			
			// When User Disconnects
			ws.on('close', () => {
				console.log('whatever, closed now');
			});
			
			// Example of Sending to User
			// ws.send('something');
		});
	}
}
