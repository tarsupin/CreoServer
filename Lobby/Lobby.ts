import PlayerLobby from "./PlayerLobby.ts";
import Activity from "./Activity.ts";
import { GamePreference, PlayerRank } from "../WebServer/GameTypes.ts";
import { config } from "../config.ts";
import LobbyServer from "./LobbyServer.ts";

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

export default class Lobby {
	
	readonly server: LobbyServer;				// Reference to the LobbyServer class.
	readonly activity: Activity;				// Tracks the recent activity of the lobby.
	private tickCounter: number;				// Track the number of ticks with modulus of 120.
	
	// Room Creation
	private lastRoom: number;					// The last timestamp of room creation.
	private longestWait: number;				// The duration in miliseconds of the longest idle time in the lobby.
	
	// Players
	private players: { [pid: number]: PlayerLobby; }
	
	private playersOnline: number;				// All players connected to the server. Includes those in rooms.
	private playersIdle: number;				// Players that are not in a room. Includes playerQueued.
	private playersQueued: number;				// Queued Players are waiting for Group or Rival assignments, if any are present.
	
	// Groups; tracks how many group players are active, idle, etc.
	private groups: { [gid: string]: GroupData }	// A Dictionary of Groups, and their # of users online.
	
	// Preferences; tracks which game preferences are desired.
	private prefs: {
		[GamePreference.Coop]: number,
		[GamePreference.Versus]: number,
		[GamePreference.Battle]: number,
		[GamePreference.Team]: number,
	}
	
	// Simulatations (For Debugging Purposes)
	private simulate: {
		active: boolean;
		idle: number,
		queued: number,
	}
	
	constructor( server: LobbyServer ) {
		
		// Systems
		this.server = server;
		this.activity = new Activity();
		
		// Initialize Values
		this.longestWait = 0;
		this.playersOnline = 0;
		this.playersIdle = 0;
		this.playersQueued = 0;

		// Objects
		this.lastRoom = Date.now();
		this.tickCounter = 0;
		this.players = {};
		this.groups = {};
		
		this.prefs = {
			[GamePreference.Coop]: 0,
			[GamePreference.Versus]: 0,
			[GamePreference.Battle]: 0,
			[GamePreference.Team]: 0,
		}
		
		this.simulate = {
			active: false,
			idle: 0,
			queued: 0,
		}
		this.resetSimulations();
	}
	
	slowTick() {
		this.tickCounter++;
		
		// Run Every 2.5 Seconds.
		if(this.tickCounter % 5 === 0) {
			this.tickCounter = 0;
			
			// Run Activity Tracker
			this.activity.activityTick();
			
			// Run Player Loop (counts players, identifies eligible players, etc).
			this.runPlayerLoop();
		}
		
		// Attempt to create a room (will only create one if all tests check).
		this.attemptRoomGenerate();
	}
	
	// Purge all players from this hub.
	public purgePlayers() {
		
		// Loop through all players in the hub.
		for( let pid in this.players ) {
			this.players[pid].disconnect();
		}
		
		// Final Cleanup
		this.players = {};
		this.runPlayerLoop();
	}
	
	private runPlayerLoop() {
		
		this.resetPlayerCount();
		this.resetGroups();
		this.resetPrefs();
		
		let earliestWait = Date.now();
		
		// Player Loop
		for( let i in this.players ) {
			let player = this.players[i];
			
			// Update Players Counts
			this.playersOnline++;
			
			// Check Group
			if(player.group) {
				
				// Add the group if it does not exist.
				if(!this.groups[player.group]) {
					this.groups[player.group] = { online: 0, idle: 0 };
				}
				
				// Increment the number of players in the group.
				this.groups[player.group].online++;
				
				if(player.isIdle) {
					this.groups[player.group].idle++;
				}
			}
			
			// Update Idle & Queued Players
			if(player.isIdle) {
				this.playersIdle++;
				
				if(player.isQueued) {
					this.playersQueued++;
				} else {
					
					// Determine Longest Wait Time
					// Only applies if the player is idle, and not queuing for any specific games.
					if(player.waitTime < earliestWait) {
						earliestWait = player.waitTime;
					}
				}
			}
			
			// Update Game Preferences
			if(player.gamePref) {
				this.prefs[player.gamePref]++;
			}
		}
		
		// Set Longest Wait Duration
		this.longestWait = Date.now() - earliestWait;
	}
	
	private resetPlayerCount() {
		this.playersOnline = 0;
		this.playersIdle = 0;
		this.playersQueued = 0;
		
		// Run Simulations (For Debugging Only)
		if(this.simulate.active) {
			this.playersIdle = this.simulate.idle;
			this.playersQueued = this.simulate.queued;
			this.playersOnline = this.playersIdle + this.playersQueued;
		}
	}
	
	private resetGroups() {
		for( let i in this.groups ) {
			let group = this.groups[i];
			
			// Reset Group Counters
			group.online = 0;
			group.idle = 0;
		}
	}
	
	private resetPrefs() {
		this.prefs[GamePreference.Coop] = 0;
		this.prefs[GamePreference.Versus] = 0;
		this.prefs[GamePreference.Battle] = 0;
		this.prefs[GamePreference.Team] = 0;
	}
	
	dropPlayer( pid: number ): boolean {
		
		let player = this.players[pid];
		
		// Make sure the player is recognized in this hub.
		if(!player || !(player instanceof PlayerLobby)) { return false; }
		
		player.disconnect();
		this.activity.playerDisconnected();
		delete this.players[pid];
		
		return true;
	}
	
	addPlayer( player: PlayerLobby ): boolean {
		
		// Make sure the player isn't already in the hub.
		if(!player || !(player instanceof PlayerLobby) || !this.players[player.pid]) { return false; }
		
		this.players[player.pid] = player;
		this.activity.playerJoined();
		
		return true;
	}
	
	// TODO: Update addRoom(), removeRoom(), newRoomId(); need update since HUB removed.
	// TODO: Update addRoom(), removeRoom(), newRoomId(); need update since HUB removed.
	// TODO: Update addRoom(), removeRoom(), newRoomId(); need update since HUB removed.
	// TODO: Update addRoom(), removeRoom(), newRoomId(); need update since HUB removed.
	// TODO: Update addRoom(), removeRoom(), newRoomId(); need update since HUB removed.
	
	// Method contacts a server and instructs it to create a new room.
	// When the room is created, it gives instructions to players to join.
	public addRoom() {
		
		// Identify a Room Server to play on:
		const port = this.getAvailableRoomServer();
		
		// Communicate with the Room Server (to create the room)
		
		// Instruct players to join room, and treat them as having done so.
		
	}
	
	// Returns a Room Server
	private getAvailableRoomServer() {
		
		// For now, just randomize the room server selection.
		// TODO LOW PRIORITY: Optimize room server selection.
		const ports = config.ports;
		const start = ports.RoomServerStart;
		const end = ports.RoomServerEnd
		
		return Math.floor(Math.random() * (end - start)) + start;
	}
	
	// public removeRoom( roomId: number ): boolean {
		
	// 	// Verify Room Exists.
	// 	if(!this.rooms[roomId]) { return false; }
		
	// 	// Purge all Players in Room.
	// 	this.rooms[roomId].purgePlayers();
		
	// 	// Delete Room
	// 	delete this.rooms[roomId];
		
	// 	return true;
	// }
	
	// private newRoomId(): number {
	// 	const lastID = Object.keys(this.rooms).length + 1;
		
	// 	// Loop through every room ID until one is available.
	// 	for( let i = 1; i <= lastID; i++ ) {
	// 		if(!this.rooms[i]) {
	// 			return i;
	// 		}
	// 	}
		
	// 	return null;
	// }
	
	
	/*
		This method determines if it is time to create a new room.
		
		Frequency of Creation:
			1. If Idle Players >= 16, create game instantly.
			2. If Idle Players >= 10, create game every 10s.
			3. If Idle Players >= 5, create game every 15s.
			4. Create game every 20s (or at least attempt to).
	*/
	private attemptRoomGenerate() {
		const idle = this.playersIdle;
		const last = Date.now() - this.lastRoom;
		
		if(idle > 16) { return this.generateRoom(); };
		if(idle >= 10 && last > 9000) { return this.generateRoom(); }
		if(idle >= 5 && last > 14000) { return this.generateRoom(); }
		if(last > 19000) { return this.generateRoom(); }
		
		// If there are less than 5 idle, start considering queued players to be idle.
		if(idle > 5) { return; }
		
		const queued = this.playersQueued;
		
		if(queued > 16 && last > 9000) { return this.generateRoom( true ); }
		if(queued + idle > 10 && last > 14000) { return this.generateRoom( true ); }
		if(queued + idle > 5 && last > 19000) { return this.generateRoom( true ); }
	}
	
	/*
		This method generates a new room for players.
		
		Information Available:
			- Time Since Last Room Generated
			- Players Online
			- Players Idle (in Lobby, waiting for game)
			- Players Queued (waiting on a specific game, or for group)
			- Player Groups & Group Activity
			- Players Per Minute (average # of players joining lobby each minute)
			- Longest Idle Time on Lobby (only counts idle players; ignores players waiting for specific games)
			- Game Preferences Chosen by Players
		
		Order of Decisions:
			1. Priority: Loading Groups Together
				- Choose Random Preference among group (weighted by favorites).
			2. Secondary Priority: Player Preferences
				- Choose Random Preference (weighted by favorites).
	*/
	private generateRoom( forceQueued: boolean = false ) {
		const playerCount = this.playersOnline;
		const last = Date.now() - this.lastRoom;
		
		// Update Recent Activity
		this.lastRoom = Date.now();
		const roomSize = this.determineNextRoomSize();
		
		// Identify the PAID players first. They get priority.
		let paidUsers = [];
		
		for( let pid in this.players ) {
			let player = this.players[pid];
			
			if(player.rank >= PlayerRank.PaidUser) {
				
				// TODO: Make sure the user WANTS to start a new room. May be part of group, waiting.
				
				paidUsers.push(pid);
			}
		}
		
		// Then identify the GUEST players.
		let guests = [];
		
		for( let pid in this.players ) {
			let player = this.players[pid];
			
			if(player.rank < PlayerRank.PaidUser) {
				guests.push(pid);
			}
		}
		
		// TODO: If there are more than enough guest players, select ones that have waited longest.
		// for( let pid in guests ) {
		// 	let guest = this.players[pid];
		// }
		
		// Create New Room
	}
	
	/*
		This method determines the size of the room to create based on lobby activity.
		The result is randomized to an extent, but can create higher-sized rooms during high ppm.
	*/
	private determineNextRoomSize( forceQueued: boolean = false ): number {
		
		const ppm = this.activity.ppm;
		const available = forceQueued ? this.playersIdle + this.playersQueued : this.playersIdle;
		
		// If there aren't enough players available, cannot create a room.
		if(available <= 1) { return 0; }
		if(available <= 3) { return available; }
		
		const rnd = Math.floor(Math.random() * 100);
		
		// If PPM is high, provide opportunities for larger rooms.
		if(ppm >= 40 && available >= 8) {
			if(rnd >= 95) { return Math.floor(Math.random() * 3) + 1; } // 5% (2 to 4)
			if(rnd >= 75) { return 4; } // 20%
			if(rnd >= 60) { return 6; } // 15%
			if(rnd >= 40) { return 8; } // 20%
			if(rnd >= 25 && available >= 10) { return 10; } // 15%
			if(rnd >= 10 && available >= 12) { return 12; } // 15%
			if(available >= 16) { return 16; } // 10% 
			
			// Equal Chance of 4, 6, or 8
			return Math.floor((Math.random() * 3) + 1) * 2 + 2;
		}
		
		// If PPM is modest, keep rooms to modest sizes (typically 4 to 8, when available)
		if(ppm >= 15) {
			if(rnd >= 80) { return Math.floor(Math.random() * 3) + 1; } // 20% (2 to 4)
			if(rnd >= 50) { return 4; } // 30% (4)
			if(rnd >= 30 && available >= 6) { return 6; } // 20% (6)
			if(rnd >= 10 && available >= 8) { return 8; } // 20% (8)
			if(rnd >= 0 && available >= 10) { return 10; } // 10% (10)
		}
		
		// If PPM is low (below 15), keep rooms small (2 to 4).
		return Math.min(available, Math.floor(Math.random() * 3) + 1);
	}
	
	private resetSimulations() {
        const sim = config.debug ? config.debug.simulate : null;
        if(sim != null && config.environment === 'local' && config.debug.active) {
            this.simulate.active = true;
            this.simulate.idle = sim.idle;
            this.simulate.queued = sim.queued;
        }
	}
}
