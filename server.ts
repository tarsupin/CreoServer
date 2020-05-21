#!/usr/bin/env node

/*
	// Start server with 2GB, 4GB, 8GB of Memory
	node --max-old-space-size=2048 server.js
	node --max-old-space-size=4096 server.js
	node --max-old-space-size=8192 server.js
*/

import Lobby from './Lobby/Lobby.ts';
import RoomServer from './Room/RoomServer.ts';
import { config } from './config.ts';

// Prepare Server Setup
let port = config.lobby.port;

// Retrieve CLI Arguments
for( let j = 0; j < Deno.args.length; j++ ) {
	
	const last = Deno.args[j - 1];
	const val = Deno.args[j];
	
	// Retrieve Port
	if(last === "-port") {
		const valInt = parseInt(val);
		
		if(valInt >= port) {
			port = parseInt(val);
		}
	}
}

// Server Start Message
const isLobby = port === config.lobby.port;
console.log((isLobby ? "Lobby" : "Room") + " Server Started on Port " + port + ".");

// Run WebServer
let webServer = isLobby ? new Lobby() : new RoomServer( port );
