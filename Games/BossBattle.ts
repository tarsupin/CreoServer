import GameClass from "../Engine/GameClass.ts";
import { GameType, RespawnType } from "../Engine/GameTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

export default class BossBattle extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = GameType.BossBattle;
		this.gameClassFlag = GameClassFlag.BossBattle;
        this.title = "Boss Battle";
        this.description = "A superior force faces off against multiple opponents.";
        
        // Players Allowed
        this.minPlayersAllowed = 4;
        this.maxPlayersAllowed = 4;
        
        // Game Behaviors
        this.cooperative = false;
        this.competitive = true;
        this.battle = true;
        this.survival = false;
        
        // Team Behaviors
        this.teams = 2;
        
        // Respawns
        this.respawn = true;
        this.respawnFrames = 150;
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
