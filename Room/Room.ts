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
    
    // Players in the Room
	players: Array<Player> = new Array<Player>(16);
	
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
        this.roomId = roomId;
        this.isEnabled = false;
        this.resetRoom();
	}
    
    resetRoom() {
        this.disableRoom();
        this.levelId = "";
        this.startFrame = 0;
        this.startTime = 0;
        this.playFrame = 0;
        this.gameClass = undefined;
        this.leagueMin = League.Training;
        this.leagueMax = League.Grandmaster;
    }
    
    disableRoom() {
        if(!this.isEnabled) { return; }
        
        this.isEnabled = false;
        
        // Purge players in room:
        this.purgeAllPlayersFromRoom();
    }
    
    purgeAllPlayersFromRoom() {
        
        // Loop through each player in the room and disconnect them.
        this.players.forEach((player:Player, index: number) => {
            player.disconnectFromRoom();
        });
    }
}
