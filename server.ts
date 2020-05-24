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
import { NaturePVP, NatureAllies, NatureLevel, League } from './Engine/ArenaTypes.ts';

// Prepare Server Setup
Lobby.serverPort = LobbyFunc.GetServerPort();

// Assign Lobby Natures
for( let i = 0; i < Deno.args.length; i++ ) {
	const last = Deno.args[i - 1];
	const arg = Deno.args[i];
	
	if(last === "-leagueMin") {
		const val = parseInt(arg);
		if(val >= League.Unrated && val <= League.Grandmaster) { Lobby.leagueMin = val; }
	}
	
	else if(last === "-leagueMax") {
		const val = parseInt(arg);
		if(val >= League.Unrated && val <= League.Grandmaster) { Lobby.leagueMax = val; }
	}
	
	else if(arg == "-pvp") { Lobby.naturePVP = NaturePVP.PVP; }
	else if(arg == "-nopvp") { Lobby.naturePVP = NaturePVP.NoPVP; }
	else if(arg == "-solo") { Lobby.natureAllies = NatureAllies.Solo; }
	else if(arg == "-teams") { Lobby.natureAllies = NatureAllies.Teams; }
	else if(arg == "-levels") { Lobby.natureLevel = NatureLevel.Level; }
	else if(arg == "-arena") { Lobby.natureLevel = NatureLevel.Arena; }
	else if(arg == "-test") { Lobby.natureTest = true; }
}

 // Run WebServer
if(Lobby.serverPort >= 8000) {
    console.log("Arena Server Started on Port " + Lobby.serverPort + ".");
    Lobby.initializeLobby();
}

else {
    console.log("The Port used (" + Lobby.serverPort + ") was not valid.");
}