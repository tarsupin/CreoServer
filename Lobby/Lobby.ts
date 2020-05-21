import PlayerLobby from "./PlayerLobby.ts";
import Activity from "./Activity.ts";
import { GamePreference, PlayerRank } from "../WebServer/GameTypes.ts";
import { config } from "../config.ts";
import LobbyServer from "./LobbyServer.ts";
import LobbyFuncPlayers from "./LobbyFuncPlayers.ts";
import LobbyFuncRooms from "./LobbyFuncRooms.ts";

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

interface GroupData {
	online: number,
	idle: number,
}

export default abstract class Lobby {
	
	static server: LobbyServer;				// Reference to the LobbyServer class.
	static tickCounter: number;				// Track the number of ticks with modulus of 120.
	static longestWait: number;				// The duration in miliseconds of the longest idle time in the lobby.
	
    // Players
	static players: { [pid: number]: PlayerLobby; }
	
	// Groups; tracks how many group players are active, idle, etc.
	static groups: { [gid: string]: GroupData }	// A Dictionary of Groups, and their # of users online.
	
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
	
	static prepareLobby( server: LobbyServer ) {
		
		// Systems
		Lobby.server = server;
		
		// Initialize Values
        Lobby.longestWait = 0;
        
		// Objects
		LobbyFuncRooms.lastRoom = Date.now();
		Lobby.tickCounter = 0;
		Lobby.players = {};
		Lobby.groups = {};
		
		Lobby.prefs = {
			[GamePreference.Coop]: 0,
			[GamePreference.Versus]: 0,
			[GamePreference.Battle]: 0,
			[GamePreference.Team]: 0,
		}
		
		Lobby.simulate = {
			active: false,
			idle: 0,
			queued: 0,
        }
        
		Lobby.resetSimulations();
    }
    
	static slowTick() {
		Lobby.tickCounter++;
		
		// Run Every 2.5 Seconds.
		if(Lobby.tickCounter % 5 === 0) {
			Lobby.tickCounter = 0;
			
			// Run Activity Tracker
			Activity.activityTick();
			
			// Run Player Loop (counts players, identifies eligible players, etc).
			LobbyFuncPlayers.runPlayerLoop();
		}
		
		// Attempt to create a room (will only create one if all tests check).
		LobbyFuncRooms.attemptRoomGenerate();
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
        const sim = config.debug ? config.debug.simulate : null;
        if(sim != null && config.environment === 'local' && config.debug.active) {
            Lobby.simulate.active = true;
            Lobby.simulate.idle = sim.idle;
            Lobby.simulate.queued = sim.queued;
        }
	}
}
