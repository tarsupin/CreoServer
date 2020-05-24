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
        this.gameType = ArenaType.Trial;
		this.gameClassFlag = GameClassFlag.Safari;
        this.title = "Safari";
        this.description = "Collect all of them gems while surviving against elemental hazards.";
        
        // Players Allowed
        this.minPlayersAllowed = 2;
        this.maxPlayersAllowed = 4;
        
        // Game Behaviors
        this.cooperative = true;
        this.competitive = false;
        this.battle = false;
        this.survival = true;
        
        // Team Behaviors
        this.teams = 0;
        
        // Respawns
        this.respawn = true;
        this.respawnFrames = 300;
        this.respawnInvincible = 120;
        this.respawnUntouchable = true;
        this.respawnType = RespawnType.Standard;
        
        // Timer Limits
        this.timeLimit = 150;
		this.playDelay = 300;
        
        // Arena Games
        this.arena = true;
        this.arenaAllowHorizontal = true;
        this.arenaAllowVertical = true;
        this.arenaAllowFields = true;
        this.arenaAllowRect = true;
    }
    
}
