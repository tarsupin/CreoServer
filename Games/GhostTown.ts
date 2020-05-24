import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

/*
	The goal in Ghost Town is for your team to collect as many coins as possible before the opposing team does.
	Battling and damaging others is allowed and encouraged, but doesn't score points.
    Coins will slowly reappear in the level after collection, so stay alert.
*/

export default class GhostTown extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = ArenaType.TeamBattle;
		this.gameClassFlag = GameClassFlag.GhostTown;
        this.title = "Ghost Town";
        this.description = "Collect gems while surviving team battle and environmental hazards.";
        
        // Players Allowed
        this.minPlayersAllowed = 6;
        this.maxPlayersAllowed = 12;
        
        // Game Behaviors
        this.cooperative = true;
        this.competitive = true;
        this.battle = true;
        this.survival = true;
        
        // Team Behaviors
        this.teams = 2;
        
        // Respawns
        this.respawn = true;
        this.respawnFrames = 600;
        this.respawnInvincible = 60;
        this.respawnUntouchable = true;
        this.respawnType = RespawnType.Standard;
        
        // Timer Limits
        this.timeLimit = 240;
		this.playDelay = 300;
        
        // Arena Games
        this.arena = true;
        this.arenaAllowHorizontal = true;
        this.arenaAllowVertical = true;
        this.arenaAllowFields = true;
        this.arenaAllowRect = true;
    }
    
}
