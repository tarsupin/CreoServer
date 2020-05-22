import GameClass from "../Engine/GameClass.ts";
import { GameType, RespawnType } from "../Engine/GameTypes.ts";

export default class NinjaBall extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = GameType.NinjaBall;
        this.title = "Ninja Ball";
        this.description = "Kick the ball into the opponent's goal to score.";
        
        // Players Allowed
        this.minPlayersAllowed = 4;
        this.maxPlayersAllowed = 16;
        
        // Game Behaviors
        this.cooperative = false;
        this.competitive = true;
        this.battle = false;
        this.survival = false;
        
        // Team Behaviors
        this.teams = 2;
        
        // Respawns
        this.respawn = true;
        this.respawnFrames = 60;
        this.respawnInvincible = 60;
        this.respawnUntouchable = true;
        this.respawnType = RespawnType.Standard;
        
        // Timer Limits
        this.timeLimit = 300;
        
        // Arena Games
        this.arena = true;
        this.arenaAllowHorizontal = true;
        this.arenaAllowVertical = false;
        this.arenaAllowFields = true;
        this.arenaAllowRect = false;
    }
    
}
