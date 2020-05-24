import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

/*
	The goal in Treasure Hunt is to collect as many coins as possible before your opponents do.
	No Battles. This is a friendly competition.
    Coins will slowly reappear in the level after collection, so stay alert.
*/

export default class TreasureHunt extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = ArenaType.Trial;
		this.gameClassFlag = GameClassFlag.TreasureHunt;
        this.title = "Treasure Hunt";
        this.description = "Collect the most gems to achieve victory.";
        
        // Players Allowed
        this.minPlayersAllowed = 2;
        this.maxPlayersAllowed = 4;
        
        // Game Behaviors
        this.cooperative = false;
        this.competitive = true;
        this.battle = false;
        this.survival = false;
        
        // Team Behaviors
        this.teams = 0;
        
        // Respawns
        this.respawn = true;
        this.respawnFrames = 60;
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
