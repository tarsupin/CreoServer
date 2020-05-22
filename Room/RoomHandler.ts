import Activity from "../Lobby/Activity.ts";
import RoomTracker from "./RoomTracker.ts";
import Room from "./Room.ts";
import { League, PlayerRank } from "../Engine/GameTypes.ts";
import Lobby from "../Lobby/Lobby.ts";
import GameClass from "../Engine/GameClass.ts";
import Mapper from "../Engine/Mapper.ts";
import PlayerTracker from "../Player/PlayerTracker.ts";
import Player from "../Player/Player.ts";


export default abstract class RoomHandler {
    
	static lastRoomGenTime: number = 0;				// The last timestamp of room creation.
	
	// Creation Rules
	static roomSize: number;
	static leagueMin: League = League.Unrated;
	static leagueMax: League = League.Grandmaster;
	
	// Method contacts a server and instructs it to create a new room.
	// When the room is created, it gives instructions to players to join.
	static addRoom(gameClass: GameClass, levelId: string) {
		
		// Identify a Room Server to play on:
		let room = RoomTracker.getAvailableRoom();
		
		// Verify that the room is valid:
		if(room.roomId == 0) {
			return;
		}
		
		// Setup Room
		room.prepareRoom(gameClass, levelId);
		
		// Instruct players to join room, and treat them as having done so.
		
    }
	
	// Load Players into a Room
	static prepareRoomPlayers( room: Room ) {
		
		let remainingPlayerCount = RoomHandler.roomSize;
		
		room.players = new Array<Player>(remainingPlayerCount);
		
		// Loop through all players for paid users.
		PlayerTracker.playerList.forEach((player: Player, index: number) => {
			
			if(remainingPlayerCount <= 0) { return; }
			
			// Skip any player that isn't available.
			if(!player.isEnabled || !player.isIdle) { return; }
			
			// Skip users that aren't paid.
			if(player.rank < PlayerRank.PaidUser) { return; }
			
			// Skip any player that isn't in the correct league.
			if(player.league < room.leagueMin && player.league > room.leagueMax) { return; }
			
			// Attach Player
			remainingPlayerCount--;
			RoomHandler.attachPlayerToRoom(room, player);
		});
		
		// Loop through guest players.
		PlayerTracker.playerList.forEach((player: Player, index: number) => {
			
			if(remainingPlayerCount <= 0) { return; }
			
			// Skip any player that isn't available.
			if(!player.isEnabled || !player.isIdle) { return; }
			
			// Skip any player that isn't in the correct league.
			if(player.league < room.leagueMin && player.league > room.leagueMax) { return; }
			
			// Attach Player
			remainingPlayerCount--;
			RoomHandler.attachPlayerToRoom(room, player);
		});
	}
	
	static attachPlayerToRoom(room: Room, player: Player) {
		player.roomId = room.roomId;
		room.players?.push(player);
	}
	
	/*
		This method determines if it is time to create a new room.
		
		Frequency of Creation:
			1. If Idle Players >= 16, create game instantly.
			2. If Idle Players >= 10, create game every 10s.
			3. If Idle Players >= 5, create game every 15s.
	*/
	static attemptRoomGenerate() {
		const idle = Activity.playersIdle;
		const last = Date.now() - RoomHandler.lastRoomGenTime;
		
		if(idle >= 16) { return RoomHandler.generateRoom(); };
		if(idle >= 10 && last > 9000) { return RoomHandler.generateRoom(); }
		if(idle >= 5 && last > 14000) { return RoomHandler.generateRoom(); }
		if(last > 19000) { return RoomHandler.generateRoom(); }
		
		// If there are less than 5 idle, start considering queued players to be idle.
		if(idle > 5) { return; }
		
		const queued = Activity.playersQueued;
		
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
			- Player Leagues
		
		Order of Decisions:
			1. Priority: Loading Groups Together
				- Choose Random Preference among group (weighted by favorites).
			2. Secondary Priority: Player Preferences
				- Choose Random Preference (weighted by favorites).
	*/
	static generateRoom( forceQueued: boolean = false ) {
		
		const last = Date.now() - RoomHandler.lastRoomGenTime;
		
		// Identify Idle Players
		const idleCount = Activity.playersIdle;
		// Activity.playersIdlePaid;
		// Activity.playersIdleGuest;
		
		// Update Recent Activity
		RoomHandler.lastRoomGenTime = Date.now();
		RoomHandler.roomSize = RoomHandler.determineNextRoomSize();
		
		// Determine League Allowances
		if(Lobby.leagueMin == League.Unrated) {
			RoomHandler.determineLeagues();
		} else {
			RoomHandler.leagueMin = Lobby.leagueMin;
			RoomHandler.leagueMax = Lobby.leagueMax;
		}
		
		// Determine Game Type
		let gameClass = RoomHandler.determineGameClass();
		
		// Determine Level ID
		let levelId = RoomHandler.determineLevelId(gameClass);
		
		// Create New Room
		RoomHandler.addRoom(gameClass, levelId);
		
		// Load the PAID players first. They get priority.
		// PlayerTracker.idlePaid; // The collection of idle paid players to choose from.
		
		// Then load the GUEST players.
		// PlayerTracker.idleGuests; // The collection of idle guest players to choose from.
		
	}
	
	// Determine Game Type
	// Choose based on Room Size + Preferences
	static determineLevelId( gameClass: GameClass ) {
		
		// TODO: Determine Level ID
		
		return "QCALQOD16";
	}
	
	// Determine Game Type
	// Choose based on Room Size + Preferences
	static determineGameClass(): GameClass {
		
		// TODO: implement decision based on room size.
		
		return Mapper.GameClasses.Deathmatch;
	}
	
	// Determine League Allowances for the Room
	static determineLeagues() {
		
		// Determine a random league to begin with.
		let levelMin = Math.floor((Math.random() * (League.Grandmaster + 1)));
		let levelMax = levelMin;
		
		let leagues = Activity.leaguesIdle;
		
		// Once the 'fulfilled' value is 
		let fulfilled = leagues[levelMin];
		
		// Loop until a satisfactory result is found. Should always expire before 20.
		for(let i = 0; i < 20; i++) {
			
			// Check if this limit is acceptable:
			if(fulfilled >= RoomHandler.roomSize) { break; }
			
			// Increase Level Maximum
			if(levelMax < League.Grandmaster) {
				levelMax++;
				fulfilled += leagues[levelMax];
			}
			
			// Increase Level Minimum
			else if(levelMin > League.Unrated) {
				levelMin--;
				fulfilled += leagues[levelMin];
			}
			
			// If no change took place, end the loop.
			else { break; }
		}
		
		// Update the League Min + Max
		RoomHandler.leagueMin = levelMin;
		RoomHandler.leagueMax = levelMax;
	}
	
	/*
		This method determines the size of the room to create based on lobby activity.
		The result is randomized to an extent, but can create higher-sized rooms during high ppm.
	*/
	static determineNextRoomSize( forceQueued: boolean = false ): number {
		
		const ppm = Activity.ppm;
		const available = forceQueued ? Activity.playersIdle + Activity.playersQueued : Activity.playersIdle;
		
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
