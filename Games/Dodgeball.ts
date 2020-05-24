import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

/*
	Try to knock out your opponents with ball projectiles, while also dodging balls.
	Team with the most knockouts win.
*/

export default class Dodgeball extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = ArenaType.TeamArena;
		this.gameClassFlag = GameClassFlag.Dodgeball;
        this.title = "Dodgeball";
        this.description = "Dodge ball projectiles while knocking out your opponents.";
        
        // Players Allowed
        this.minPlayersAllowed = 6;
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
        this.respawnFrames = 300;
        this.respawnInvincible = 60;
        this.respawnUntouchable = true;
        this.respawnType = RespawnType.Standard;
        
        // Timer Limits
        this.timeLimit = 300;
		this.playDelay = 300;
        
        // Arena Games
        this.arena = true;
        this.arenaAllowHorizontal = true;
        this.arenaAllowVertical = false;
        this.arenaAllowFields = true;
        this.arenaAllowRect = false;
    }
    
}
