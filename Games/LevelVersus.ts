import GameClass from "../Engine/GameClass.ts";
import { GameType, RespawnType } from "../Engine/GameTypes.ts";

export default class LevelVersus extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = GameType.Versus;
        this.title = "Versus Level";
        this.description = "Traditional level playthrough, but with competition.";
        
        // Players Allowed
        this.minPlayersAllowed = 2;
        this.maxPlayersAllowed = 8;
        
        // Game Behaviors
        this.cooperative = false;
        this.competitive = true;
        this.battle = true;
        this.survival = false;
        
        // Team Behaviors
        this.teams = 0;
        
        // Respawns
        this.respawn = true;
        this.respawnFrames = 150;
        this.respawnInvincible = 90;
        this.respawnUntouchable = true;
        this.respawnType = RespawnType.Standard;
        
        // Timer Limits
        this.timeLimit = 600;
		this.playDelay = 300;
        
        // Arena Games
        this.arena = false;
        this.arenaAllowHorizontal = false;
        this.arenaAllowVertical = false;
        this.arenaAllowFields = false;
        this.arenaAllowRect = false;
    }
    
}
