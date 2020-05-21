import { WebSocket, WebSocketServer } from "../Engine/WebSocket.ts";
import LobbyFuncCommands from "./LobbyFuncCommands.ts";
import { config } from "../config.ts";
import LobbyFuncPlayers from "./LobbyFuncPlayers.ts";
import Timer from "../Engine/Timer.ts";
import Player from "../Player/Player.ts";
import { GamePreference } from "../Engine/GameTypes.ts";
import Activity from "./Activity.ts";
import RoomHandler from "../Room/RoomHandler.ts";

/*
	The Lobby Server is where all Players (on the linode) will identify the servers / rooms to join.
	When Players are not in a room, they are set to "idle" (considered to have "re-joined" the lobby).
	
	The Lobby will generate rooms for the other servers, and assign players accordingly.
	The Lobby determines room size and speed of room creation based on recent activity.
	
	Rooms created can be influenced by player's game preferences.
	
	PAYING MEMBERS can set game preferences, which affect the rooms that a lobby will create.
	GUEST players cannot choose their game preferences.
	
	GROUPS and RIVALS play together, which affects room creation.
		- If there are other grouped members online, you will not join games until your group returns to lobby.
		- Cannot play until 100% of group is back in lobby. Or, if 9+ group members, at least 3 others must be available.
		- Group rooms are created immediately when group returns to lobby if 4+ group members online.
	
	When a room is "finished", the lobby will remove the room from the listing and update players accordingly.
	
	If players disconnects a match prematurely, they cannot load a new match for 30s.
		- This addresses the "poor sport" issue where people refuse to play.
*/

interface GroupData { online: number, idle: number }

// Always Exists on Port 8000
export default abstract class Lobby {
    
    // Connection Details
    static serverPort: number = 0;          // The port for this server.
    static wss: any;
	
	static tickCounter: number = 0;			// Track the number of ticks with modulus of 120.
	static longestWait: number = 0;			// The duration in miliseconds of the longest idle time in the lobby.
	
    // Players, Groups
	static players: { [pid: number]: Player; } = {};
	static groups: { [gid: string]: GroupData } = {}	// Groups; tracks how many group players are active, idle, etc.
	
	// Preferences; tracks which game preferences are desired.
	static prefs: {
		[GamePreference.Coop]: number,
		[GamePreference.Versus]: number,
		[GamePreference.Battle]: number,
		[GamePreference.Team]: number,
	}
	
	// Simulatations (For Debugging Purposes)
	static simulate: {
		active: boolean;
		idle: number,
		queued: number,
	}
	
	static initializeLobby() {
        
		RoomHandler.lastRoomGenTime = Date.now();
		
		Lobby.prefs = {
			[GamePreference.Coop]: 0,
			[GamePreference.Versus]: 0,
			[GamePreference.Battle]: 0,
			[GamePreference.Team]: 0,
		}
		
        Lobby.resetSimulations();
        
        // Prepare Socket Server
        Lobby.wss = new WebSocketServer(Lobby.serverPort);
        
        // Prepare Arena Lobby & Rooms
        RoomHandler.buildRoomPlaceholders();
		Lobby.buildServer();
		
		// Run Server Loop
        setInterval(() => Lobby.serverLoop(), 4);
	}
	
	static serverLoop() {
		Timer.update();
		
		if(Timer.slowTick) {
			Lobby.slowTick();
		}
		
		// Benchmarking
		// const rnd = Math.random();
		// if(rnd > 0.999999) {
		// 	console.log("ms: " + Timer.delta + ", frame: " + Timer.frame + ", rnd: " + rnd + ", count: " + count);
		// }
	}
	
	static buildServer(): void {
        
        Lobby.wss.on("connection", (ws: WebSocket) => {
            
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
    
    // Runs every 30 frames (0.5 seconds)
	static slowTick() {
        
        // Run Activity Tracker (every 5 seconds; 1st cycle)
        if(Lobby.tickCounter == 1) {
            Activity.activityTick();
        }
        
        // Run Player Loop (every 5 seconds; 3rd cycle)
        // Counts players, identifies eligible players, etc.
        if(Lobby.tickCounter == 3) {
            LobbyFuncPlayers.runPlayerLoop();
        }
		
        // Attempt Room Creation (every 5 seconds; 5th cycle)
        // Will only create a room if all tests check.
        if(Lobby.tickCounter == 5) {
            RoomHandler.attemptRoomGenerate();
        }
        
        // Update Tick Counter
        if(Lobby.tickCounter < 10) { Lobby.tickCounter++; } else { Lobby.tickCounter = 0; }
	}
    
	static resetGroups() {
		for( let i in Lobby.groups ) {
			let group = Lobby.groups[i];
			
			// Reset Group Counters
			group.online = 0;
			group.idle = 0;
		}
	}
	
	static resetPrefs() {
		Lobby.prefs[GamePreference.Coop] = 0;
		Lobby.prefs[GamePreference.Versus] = 0;
		Lobby.prefs[GamePreference.Battle] = 0;
		Lobby.prefs[GamePreference.Team] = 0;
	}
	
	static resetSimulations() {
        
		Lobby.simulate = {
			active: false,
			idle: 0,
			queued: 0,
        }
        
        const sim = config.debug ? config.debug.simulate : null;
        if(sim != null && config.environment === 'local' && config.debug.active) {
            Lobby.simulate.active = true;
            Lobby.simulate.idle = sim.idle;
            Lobby.simulate.queued = sim.queued;
        }
	}
}
