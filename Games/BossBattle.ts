import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

export default class BossBattle extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.TeamBattle;
		this.gameClassFlag = GameClassFlag.BossBattle;
        this.title = "Boss Battle";
        this.description = "Defeat a powerful boss with your team.";
        
        // Players Allowed
        this.minPlayersAllowed = 4;
        this.maxPlayersAllowed = 12;
        
        // Game Behaviors
        this.teams = 1;
        this.pvp = false;
        
        // Respawns
        this.respawn = true;
        this.respawnFrames = 150;
        this.respawnInvincible = 120;
        this.respawnUntouchable = true;
        this.respawnType = RespawnType.Standard;
        
        // Timer Limits
        this.timeLimit = 300;
		this.playDelay = 300;
        
        // Arena Games
        this.arena = true;
        this.arenaAllowHorizontal = true;
        this.arenaAllowVertical = true;
        this.arenaAllowFields = true;
        this.arenaAllowRect = true;
    }
    
}
