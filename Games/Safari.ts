import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

/*
	The goal in Safari is to collect all of the level's coins.
	There are environmental hazards (standard level), so cooperate with your team to pass.
*/

export default class Safari extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.TeamLevel;
		this.gameClassFlag = GameClassFlag.Safari;
        this.title = "Safari";
        this.description = "Collect all of them gems while surviving against elemental hazards.";
        
        // Players Allowed
        this.minPlayersAllowed = 2;
        this.maxPlayersAllowed = 4;
        
        // Game Behaviors
        this.teams = 1;
        this.pvp = false;
        
        // Timer Limits
        this.timeLimit = 150;
		this.playDelay = 300;
    }
}
