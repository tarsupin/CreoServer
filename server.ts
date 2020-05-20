#!/usr/bin/env node

/*
	// Start server with 2GB, 4GB, 8GB of Memory
	node --max-old-space-size=2048 server.js
	node --max-old-space-size=4096 server.js
	node --max-old-space-size=8192 server.js
*/

import LobbyServer from './Lobby/LobbyServer.ts';
import RoomServer from './Room/RoomServer.ts';
import { config } from './config.ts';

// Prepare Server Setup
let port = config.ports.Lobby;

// Retrieve CLI Arguments
for( let j = 3; j < process.argv.length; j++ ) {
	
	const last = process.argv[j - 1];
	const val = process.argv[j];
	
	// Retrieve Port
	if(last === "-port") {
		const valInt = parseInt(val);
		
		if(valInt >= port) {
			port = parseInt(val);
		}
	}
}

const isLobby = port === config.ports.Lobby;

// Server Start Message
console.log((isLobby ? "Lobby" : "Room") + " Server Started on Port " + port + ".");

// Run WebServer
let webServer = isLobby ? new LobbyServer() : new RoomServer( port );
