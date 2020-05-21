import LobbyFuncPlayers from "../Lobby/LobbyFuncPlayers.ts";
import { PlayerRank } from "../Engine/GameTypes.ts";
import Activity from "../Lobby/Activity.ts";
import RoomTracker from "./RoomTracker.ts";
import Room from "./Room.ts";
import PlayerTracker from "../Player/PlayerTracker.ts";


export default abstract class RoomHandler {
    
	static lastRoomGenTime: number = 0;				// The last timestamp of room creation.
    
	// Method contacts a server and instructs it to create a new room.
	// When the room is created, it gives instructions to players to join.
	static addRoom() {
		
		// Identify a Room Server to play on:
		
		// Communicate with the Room Server (to create the room)
		
		// Instruct players to join room, and treat them as having done so.
		
    }
    
    static disableRoom( roomId: number ) {
        
        // Purge players in room:
        RoomHandler.purgeAllPlayersFromRoom(roomId);
        
        // Set as Inactive (allows it to be used for a new system)
        RoomTracker.roomList[roomId].isEnabled = false;
    }
    
    static purgeAllPlayersFromRoom( roomId: number ) {
        var room = RoomTracker.roomList[roomId];
        
    }
    
    static removePlayerFromRoom( roomId: number, playerId: number ) {
        var room = RoomTracker.roomList[roomId];
        var players = room.players;
        
    }
    
	/*
		This method determines if it is time to create a new room.
		
		Frequency of Creation:
			1. If Idle Players >= 16, create game instantly.
			2. If Idle Players >= 10, create game every 10s.
			3. If Idle Players >= 5, create game every 15s.
			4. Create game every 20s (or at least attempt to).
	*/
	static attemptRoomGenerate() {
		const idle = LobbyFuncPlayers.playersIdle;
		const last = Date.now() - RoomHandler.lastRoomGenTime;
		
		if(idle > 16) { return RoomHandler.generateRoom(); };
		if(idle >= 10 && last > 9000) { return RoomHandler.generateRoom(); }
		if(idle >= 5 && last > 14000) { return RoomHandler.generateRoom(); }
		if(last > 19000) { return RoomHandler.generateRoom(); }
		
		// If there are less than 5 idle, start considering queued players to be idle.
		if(idle > 5) { return; }
		
		const queued = LobbyFuncPlayers.playersQueued;
		
		if(queued > 16 && last > 9000) { return RoomHandler.generateRoom( true ); }
		if(queued + idle > 10 && last > 14000) { return RoomHandler.generateRoom( true ); }
		if(queued + idle > 5 && last > 19000) { return RoomHandler.generateRoom( true ); }
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
	static generateRoom( forceQueued: boolean = false ) {
		const playerCount = LobbyFuncPlayers.playersOnline;
		const last = Date.now() - RoomHandler.lastRoomGenTime;
		
		// Update Recent Activity
		RoomHandler.lastRoomGenTime = Date.now();
		const roomSize = RoomHandler.determineNextRoomSize();
		
		// Identify the PAID players first. They get priority.
		let paidUsers = [];
		
		for( let pid in PlayerTracker.playerList ) {
			let player = PlayerTracker.playerList[pid];
			
			if(player.rank >= PlayerRank.PaidUser) {
				
				// TODO: Make sure the user WANTS to start a new room. May be part of group, waiting.
				
				paidUsers.push(pid);
			}
		}
		
		// Then identify the GUEST players.
		let guests = [];
		
		for( let pid in PlayerTracker.playerList ) {
			let player = PlayerTracker.playerList[pid];
			
			if(player.rank < PlayerRank.PaidUser) {
				guests.push(pid);
			}
		}
		
		// TODO: If there are more than enough guest players, select ones that have waited longest.
		// for( let pid in guests ) {
		// 	let guest = PlayerTracker.playerList[pid];
		// }
		
		// Create New Room
	}
	
	/*
		This method determines the size of the room to create based on lobby activity.
		The result is randomized to an extent, but can create higher-sized rooms during high ppm.
	*/
	static determineNextRoomSize( forceQueued: boolean = false ): number {
		
		const ppm = Activity.ppm;
		const available = forceQueued ? LobbyFuncPlayers.playersIdle + LobbyFuncPlayers.playersQueued : LobbyFuncPlayers.playersIdle;
		
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
    
    // Generate the empty rooms, so that they can be looped through.
    static buildRoomPlaceholders() {
        for(let roomId = 0; roomId <= RoomTracker.roomsAllowedOnServer; roomId++) {
            RoomTracker.roomList[roomId] = new Room(roomId);
        }
    }
}
