import { WebSocket, WebSocketServer } from "./WebSocket.ts";
import { config } from "../config.ts";
import Timer from "./Timer.ts";

/*
    // TODO: Deno may have changed all the req.XXX values. Update the list here:
    
	// Request Object On Initial HTTP Connection for WebSocket
	
	req.connection
		.authorized
		.encrypted
		.remoteAddress			// IP of User
	
	req.headers
		.user-agent				// websocket-sharp/1.0
		.host					// 127.0.0.1:8010
		.upgrade				// websocket
		.connection				// 'Upgrade'
		sec-websocket-key		// 'kTQ0KTjZFYf4Nn4GTIbXSQ==',
		sec-websocket-version	// '13'
		x-forwarded-for			// The actual IP of the user, if behind a proxy (like NGINX).
	
	req.url			// '/'
	req.method		// GET
*/

export default class WebServer {
	readonly timer: Timer;
	readonly wss: any;
	
	constructor( port: number ) {
		
		// Prepare Systems
		this.timer = new Timer();
		
		// Create WebSocket Server
        this.wss = new WebSocketServer(port);
	}
	
	public getIPFromConnection( req: any ) {
		
		// If behind a proxy like NGINX, need to use the X-Forwarded-For header.
		let forwardedFor = req.headers['x-forwarded-for'];
		
		// Retrieve IP
		const ip = forwardedFor ? forwardedFor.split(/\s*,\s*/)[0] : req.connection.remoteAddress;
		
		if(config.environment === "local") {
			console.log("Connection Made By Client: " + ip);
		}
		
		return ip;
	}
}
