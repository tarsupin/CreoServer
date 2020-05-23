import Player from "../Player/Player.ts";
import GameClass from "../Engine/GameClass.ts";
import { League } from "../Engine/GameTypes.ts";
import Timer from "../Engine/Timer.ts";
import RoomHandler from "./RoomHandler.ts";
import PlayerTracker from "../Player/PlayerTracker.ts";
import VerboseLog from "../Engine/VerboseLog.ts";

/*
	Players join into Rooms to play a Game.
	Each Room has a GameType associated with it.
	
	// Player Interaction
	Rooms can track 'Player Interaction' for some Game Types.
		- "Standard" allows standard interaction with other Players.
		- "Ghost" prevents other allies from interacting with Player. (No effect on opponents)
		- "GhostExclusive" assigns the next ally touched to be interactive; none others.
*/

export default class Room {
    
    // Core Details
    roomId: number = 0;
    isEnabled: boolean = false;         // TRUE if room is enabled. FALSE if disabled (can be overwritten).
	roomLoopFrame: number = 0;			// The frame ID of the room loop to process.
	
    // Players in the Room
	players: Array<Player | null> = new Array<Player | null>(16);
	
    // Play Data
    levelId!: string;                   // The level ID (game map) that everyone must download to play in this room.
    startTime: number = 0;              // Date.now() of when the game begins.
    startFrame: number = 0;             // The frame that the room started on, base on the global timer.
    
    gameClass?: GameClass;              // The GameClass associated with the room.
    
    // Miscellaneous
    leagueMin: League = League.Training;        // Minimum League Allowance
    leagueMax: League = League.Grandmaster;     // Highest League Allowance
    
	constructor( roomId: number ) {
        this.roomId = roomId;
		this.isEnabled = false;
        this.resetRoom();
	}
	
	// Loops through the Room's Behaviors
	roomLoop( frame: number ) {
		
		// If the room is not valid, skip it.
		if(this.roomId == 0) { return; }
		
		// If this frame has already been processed, skip it:
		if(this.roomLoopFrame >= frame || this.startFrame > frame) { return; }
		this.roomLoopFrame = frame;
		
		// Game Frame
		let gameFrame = frame - this.startFrame;
		
		// Broadcast all known frames:
		let broadcast = new Uint8Array([5, 5, 5]);
		
		// Loop through Players in Room
		for(let i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			
			// If we're dealing with the default "empty" player #0, no need to continue.
			if(!player || player.id == 0) { continue; }
			
			// Send Broadcast to each player
			player.socket?.send(broadcast);
			VerboseLog.verbose("Sent broadcast to " + player.id);
		}
		
		// Clear out Broadcast Flags for Next Frame
		
	}
	
	// Initiate the Room's Game
	async initiateGame() {
		
		// Prepare Instructions for Players
		let instructions = {
			"levelId": this.levelId,
			"playFrame": this.gameClass?.playDelay,
			"players": [
			]
		};
		
		// Send Game Instructions to Players
		
	}
    
    resetRoom() {
		
		this.isEnabled = false;
		this.resetPlayersInRoom();
		
    	// Play Data
        this.levelId = "";
        this.startFrame = 0;
        this.startTime = 0;
        this.gameClass = undefined;
        this.leagueMin = League.Training;
        this.leagueMax = League.Grandmaster;
	}
	
	prepareRoom(gameClass: GameClass, levelId: string) {
		
    	// Play Data
        this.levelId = levelId;
        this.startFrame = Timer.frame;
        this.startTime = Date.now();
        this.gameClass = gameClass;
        this.leagueMin = RoomHandler.leagueMin;
		this.leagueMax = RoomHandler.leagueMax;
		
		this.resetPlayersInRoom();
		
		// Enable Room
		this.isEnabled = true;
	}
    
    resetPlayersInRoom() {
		
		// Loop through each player in the room and disconnect them.
		for(let i = 0; i < 16; i++) {
			let player = this.players[i];
			if(!player || player.id == 0) { continue; }
			
			player.disconnectFromRoom();
			
			// Reset all Players to "Empty" Player #0
			this.players[i] = null;
		}
	}
	
	removePlayerByNum( playerNum: number ) {
		if(playerNum >= 0 && playerNum < 16) {
			this.players[playerNum] = null;
		}
	}
	
	getPlayerNumById( playerId: number ) {
		
		// Loop through each player in the room and disconnect them.
		for(let i = 0; i < 16; i++) {
			let player = this.players[i];
			if(!player || player.id != playerId) { continue; }
			return i;
		}
		
		return -1;
	}
}
