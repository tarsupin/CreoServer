import GameClass from "../Engine/GameClass.ts";
import { GameType, RespawnType } from "../Engine/GameTypes.ts";

/*
    The goal in Circus is to collect as many coins as possible before your opponents do.
    Coins will slowly reappear in the level after collection, so stay alert.
*/

export default class Circus extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = GameType.Battle;
        this.title = "Circus";
        this.description = "Collect the most gems while surviving battle to achieve victory.";
        
        // Players Allowed
        this.minPlayersAllowed = 2;
        this.maxPlayersAllowed = 6;
        
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
        this.timeLimit = 150;
        
        // Arena Games
        this.arena = true;
        this.arenaAllowHorizontal = true;
        this.arenaAllowVertical = true;
        this.arenaAllowFields = true;
        this.arenaAllowRect = true;
    }
    
}
