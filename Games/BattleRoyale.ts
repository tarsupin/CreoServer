import GameClass from "../Engine/GameClass.ts";
import { GameType, RespawnType } from "../Engine/GameTypes.ts";

export default class BattleRoyale extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = GameType.BattleRoyale;
        this.title = "Battle Royale";
        this.description = "Survive the longest. Defeat your enemies for supplies.";
        
        // Players Allowed
        this.minPlayersAllowed = 4;
        this.maxPlayersAllowed = 16;
        
        // Game Behaviors
        this.cooperative = false;
        this.competitive = true;
        this.battle = true;
        this.survival = false;
        
        // Team Behaviors
        this.teams = 0;
        
        // Respawns
        this.respawn = false;
        this.respawnFrames = 0;
        this.respawnInvincible = 0;
        this.respawnUntouchable = false;
        this.respawnType = RespawnType.Spectator;
        
        // Timer Limits
        this.timeLimit = 150;
        
        // Arena Games
        this.arena = true;
        this.arenaAllowHorizontal = false;
        this.arenaAllowVertical = false;
        this.arenaAllowFields = true;
        this.arenaAllowRect = true;
    }
    
}
