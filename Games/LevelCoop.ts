import GameClass from "../Engine/GameClass.ts";
import { ArenaType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

export default class LevelCoop extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.TeamLevel;
		this.gameClassFlag = GameClassFlag.LevelCoop;
        this.title = "Cooperative Level";
        this.description = "Traditional level playthrough, with cooperative partners.";
        
        // Players Allowed
        this.minPlayersAllowed = 2;
        this.maxPlayersAllowed = 4;
        
        // Game Behaviors
        this.teams = 1;
        this.pvp = false;
        
        // Timer Limits
        this.timeLimit = 600;
		this.playDelay = 300;
    }
}
