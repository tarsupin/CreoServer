import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

export default class CaptureTheFlag extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.TeamArena;
		this.gameClassFlag = GameClassFlag.CaptureTheFlag;
        this.title = "Capture The Flag";
        this.description = "Capture the enemy's flag while defending your own.";
        
        // Players Allowed
        this.minPlayersAllowed = 4;
        this.maxPlayersAllowed = 12;
        
        // Game Behaviors
        this.teams = 2;
        this.pvp = true;
        
        // Timer Limits
        this.timeLimit = 300;
		this.playDelay = 300;
    }
}
