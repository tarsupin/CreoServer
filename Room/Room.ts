import Player from "../Player/Player.ts";
import GameClass from "../Engine/GameClass.ts";
import { League } from "../Engine/GameTypes.ts";

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
    
    // Players
	players: Array<Player>;             // The players in the room.
	
    // Play Data
    levelId!: string;                   // The level ID (game map) that everyone must download to play in this room.
    startTime: number = 0;              // Date.now() of when the game begins.
    startFrame: number = 0;             // The frame that the room started on, base on the global timer.
    playFrame: number = 0;              // The frame that players will begin playing on.
    
    gameClass?: GameClass;              // The GameClass associated with the room.
    
    // Miscellaneous
    leagueMin: League = League.Training;        // Minimum League Allowance
    leagueMax: League = League.Grandmaster;     // Highest League Allowance
    
	constructor( roomId: number ) {
        
        // Initialize Room Details
        this.isEnabled = true;
        this.roomId = roomId;
        
        // TODO: Change number of players based on room rules.
		this.players = new Array<Player>(8);
	}
	
}
