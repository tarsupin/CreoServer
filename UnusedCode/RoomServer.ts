import { WebSocketServer } from "../Engine/WebSocket.ts";
import Timer from "../Engine/Timer.ts";

export default class RoomServer {
    wss: any;
	
	constructor( port: number ) {
        
        // Prepare Socket Server
        this.wss = new WebSocketServer(port);
        this.buildServer();
        
        // Run Server Loop
        // Timer.reset();
		setInterval(() => this.serverLoop(), 4);
	}
	
	private serverLoop() {
		// Timer.update();
        
		// Benchmarking
		// const rnd = Math.random();
		// if(rnd > 0.999999) {
		// 	console.log("ms: " + Timer.delta + ", frame: " + Timer.frame + ", rnd: " + rnd + ", count: " + count);
		// }
	}
	
	private async buildServer() {
        
        this.wss.on('connection', ( ws: any, req: any ) => {
            // const ip = this.getIPFromConnection( req );
            // console.log("connection from " + ip);
            
            // When User Receives a Message
            // Automatically converts message to string (including from Binary Data).
            ws.on('message', ( message: any ) => {
                console.log('received: %s', message);
                
            });
            
            // When Lobby Connects
            ws.on('open', () => {
                console.log('opened to this room');
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
