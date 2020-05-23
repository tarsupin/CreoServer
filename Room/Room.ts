import Player from "../Player/Player.ts";
import GameClass from "../Engine/GameClass.ts";
import { League } from "../Engine/GameTypes.ts";
import Timer from "../Engine/Timer.ts";
import RoomHandler from "./RoomHandler.ts";
import VerboseLog from "../Engine/VerboseLog.ts";
import BroadcastData from "../Engine/BroadcastData.ts";
import { SocketFlags, EmoteFlag } from "../Engine/SocketFlags.ts";
import Mapper from "../Engine/Mapper.ts";

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
	playerCount: number = 0;
	players: Array<Player | null> = new Array<Player | null>(16);
	
    // Play Data
    levelId!: string;                   // The level ID (game map) that everyone must download to play in this room.
    startTime: number = 0;              // Date.now() of when the game begins.
    startFrame: number = 0;             // The frame that the room started on, base on the global timer.
    
    gameClass!: GameClass;              // The GameClass associated with the room.
    
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
		
		// Prepare the Broadcast Data
		BroadcastData.newBroadcast();
		BroadcastData.addCurrentFrameFlag(gameFrame);
		
		// Loop through Players in Room. Gather Input to add to Broadcast data.
		for(let pNum = 0; pNum < this.players.length; pNum++) {
			let player = this.players[pNum];
			if(!player) { continue; }
			BroadcastData.addPlayerInput( player, pNum );
		}
		
		// Send Broadcast
		this.broadcastToPlayersInRoom();
	}
	
	// Loop through Players in Room. Send out Broadcast data to each.
	private broadcastToPlayersInRoom() {
		for(let pNum = 0; pNum < this.playerCount; pNum++) {
			let player = this.players[pNum];
			if(!player) { continue; }
			
			// Send Broadcast to each player
			player.socket?.send(BroadcastData.data.slice(0, BroadcastData.index));
			// VerboseLog.verbose("Sent broadcast to Player " + player.id);
			
			// See Broadcast Data
			if(player.socket && player.socket.webSocket && !player.socket.isClosed) {
				VerboseLog.verbose(BroadcastData.data);
			}
		}
	}
	
	// Initiate the Room's Game. Send Broadcast to Players.
	initiateGame() {
		
		// Prepare Instructions for Players
		BroadcastData.newBroadcast();
		
		// Add Game Class
		BroadcastData.addFlag(SocketFlags.GameClass, this.gameClass.gameClassFlag);
		
		// Add Level Flag
		BroadcastData.addStringFlag(SocketFlags.LoadLevel, this.levelId, true);
		
		// Add Players
		for(let pNum = 0; pNum < this.playerCount; pNum++) {
			let player = this.players[pNum];
			if(!player) { continue; }
			
			BroadcastData.addFlag( SocketFlags.PlayerJoined, pNum );
			BroadcastData.addString(player.username, true);
		}
		
		this.initiationBroadcast();
	}
    
	// Special Broadcast Sequence that only occurs during game initation.
	private initiationBroadcast() {
		
		// Add WhoAmI Flag, to tell the player who they are.
		// This value will be edited for each player, indicating which 
		BroadcastData.addFlag(SocketFlags.WhoAmI, 0);
		let whoIndex = BroadcastData.index - 1;
		
		for(let pNum = 0; pNum < this.playerCount; pNum++) {
			let player = this.players[pNum];
			if(!player) { continue; }
			
			// Update WhoAmI Number
			BroadcastData.data[whoIndex] = pNum;
			
			// Send Broadcast to each player
			player.socket?.send(BroadcastData.data.slice(0, BroadcastData.index));
		}
	}
	
	prepareRoom(gameClass: GameClass, levelId: string, playerCount: number) {
		
		// Reset Players
		this.resetPlayersInRoom();
		this.playerCount = playerCount;
		
    	// Play Data
        this.levelId = levelId;
        this.startFrame = Timer.frame;
        this.startTime = Date.now();
        this.gameClass = gameClass;
        this.leagueMin = RoomHandler.leagueMin;
		this.leagueMax = RoomHandler.leagueMax;
		
		// Enable Room
		this.isEnabled = true;
	}
    
    private resetRoom() {
		
		this.isEnabled = false;
		this.resetPlayersInRoom();
		
    	// Play Data
        this.levelId = "";
        this.startFrame = 0;
        this.startTime = 0;
        this.gameClass = Mapper.GameClasses.LevelCoop;
        this.leagueMin = League.Training;
        this.leagueMax = League.Grandmaster;
	}
	
    private resetPlayersInRoom() {
		this.playerCount = 0;
		
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
		for(let pNum = 0; pNum < this.playerCount; pNum++) {
			let player = this.players[pNum];
			if(!player || player.id != playerId) { continue; }
			return pNum;
		}
		
		return -1;
	}
}
