#!/usr/bin/env deno

/*
    deno run --allow-env --allow-write --allow-read --allow-plugin --allow-net server.ts -port 8000
    deno run --allow-env --allow-write --allow-read --allow-plugin --allow-net server.ts -port 8001
    
	// Start Node Server with 2GB, 4GB, 8GB of Memory
	node --max-old-space-size=2048 server.js
	node --max-old-space-size=4096 server.js
	node --max-old-space-size=8192 server.js
*/

import Lobby from './Lobby/Lobby.ts';
import LobbyFunc from './Lobby/LobbyFunc.ts';
import RoomTracker from './Room/RoomTracker.ts';

// Prepare Server Setup
Lobby.serverPort = LobbyFunc.GetServerPort();

 // Run WebServer
if(Lobby.serverPort >= 8000) {
    console.log("Arena Server Started on Port " + Lobby.serverPort + ".");
    Lobby.initializeLobby();
    
    var b = RoomTracker.getAvailableRoom();
    console.log("findAvailableRoomId ", b);
    
    var a = RoomTracker.isRoomActive(5);
    console.log("is room valid ", a);
}

else {
    console.log("The Port used (" + Lobby.serverPort + ") was not valid.");
}