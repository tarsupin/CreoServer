import GameClass from "../Engine/GameClass.ts";
import { GameType, RespawnType } from "../Engine/GameTypes.ts";

/*
    The goal in Circus is to collect as many coins as possible before your opponents do.
    Coins will slowly reappear in the level after collection, so stay alert.
*/

export default class TowerDefense extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = GameType.Survival;
        this.title = "Tower Defense";
        this.description = "Protect your tower against an onslaught of enemies.";
        
        // Players Allowed
        this.minPlayersAllowed = 1;
        this.maxPlayersAllowed = 16;
        
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
        this.arenaAllowVertical = false;
        this.arenaAllowFields = true;
        this.arenaAllowRect = false;
    }
    
}
