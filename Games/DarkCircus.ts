import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

/*
	The goal in Dark Circus is to collect as many coins as possible before your opponents do.
	Battling and damaging others is allowed and encouraged, but doesn't score points.
    Coins will slowly reappear in the level after collection, so stay alert.
*/

export default class DarkCircus extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = ArenaType.Battle;
		this.gameClassFlag = GameClassFlag.DarkCircus;
        this.title = "Dark Circus";
        this.description = "Collect the most gems while surviving battle to achieve victory.";
        
        // Players Allowed
        this.minPlayersAllowed = 3;
        this.maxPlayersAllowed = 4;
        
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
        this.timeLimit = 180;
		this.playDelay = 300;
        
        // Arena Games
        this.arena = true;
        this.arenaAllowHorizontal = true;
        this.arenaAllowVertical = true;
        this.arenaAllowFields = true;
        this.arenaAllowRect = true;
    }
    
}
