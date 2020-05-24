import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

/*
	Play as one of four ninjas (randomly selected) and play through a traditional level cooperatively.
*/

export default class NinjaAcademy extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = ArenaType.CoopLevel;
		this.gameClassFlag = GameClassFlag.NinjaAcademy;
        this.title = "Ninja Academy";
        this.description = "Traditional level, but everyone is a ninja. Collect all the gems.";
        
        // Players Allowed
        this.minPlayersAllowed = 4;
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
        this.respawnFrames = 600;
        this.respawnInvincible = 120;
        this.respawnUntouchable = true;
        this.respawnType = RespawnType.Standard;
        
        // Timer Limits
        this.timeLimit = 300;
		this.playDelay = 300;
        
        // Arena Games
        this.arena = true;
        this.arenaAllowHorizontal = true;
        this.arenaAllowVertical = true;
        this.arenaAllowFields = true;
        this.arenaAllowRect = true;
    }
    
}
