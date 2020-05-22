import GameClass from "../Engine/GameClass.ts";
import { GameType, RespawnType } from "../Engine/GameTypes.ts";

export default class Deathmatch extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = GameType.Battle;
        this.title = "Deathmatch";
        this.description = "Score points by defeating your enemies.";
        
        // Players Allowed
        this.minPlayersAllowed = 2;
        this.maxPlayersAllowed = 16;
        
        // Game Behaviors
        this.cooperative = false;
        this.competitive = true;
        this.battle = true;
        this.survival = false;
        
        // Team Behaviors
        this.teams = 0;
        
        // Respawns
        this.respawn = true;
        this.respawnFrames = 300;
        this.respawnInvincible = 120;
        this.respawnUntouchable = true;
        this.respawnType = RespawnType.Standard;
        
        // Timer Limits
        this.timeLimit = 300;
        
        // Arena Games
        this.arena = true;
        this.arenaAllowHorizontal = true;
        this.arenaAllowVertical = true;
        this.arenaAllowFields = true;
        this.arenaAllowRect = true;
    }
    
}
