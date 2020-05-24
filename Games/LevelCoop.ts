import GameClass from "../Engine/GameClass.ts";
import { GameType, RespawnType } from "../Engine/GameTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

export default class LevelCoop extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = GameType.CoopLevel;
		this.gameClassFlag = GameClassFlag.LevelCoop;
        this.title = "Cooperative Level";
        this.description = "Traditional level playthrough, with cooperative partners.";
        
        // Players Allowed
        this.minPlayersAllowed = 2;
        this.maxPlayersAllowed = 4;
        
        // Game Behaviors
        this.cooperative = true;
        this.competitive = false;
        this.battle = false;
        this.survival = false;
        
        // Team Behaviors
        this.teams = 0;
        
        // Respawns
        this.respawn = true;
        this.respawnFrames = 30;
        this.respawnInvincible = 30;
        this.respawnUntouchable = false;
        this.respawnType = RespawnType.Standard;
        
        // Timer Limits
        this.timeLimit = 600;
		this.playDelay = 300;
        
        // Arena Games
        this.arena = false;
        this.arenaAllowHorizontal = false;
        this.arenaAllowVertical = false;
        this.arenaAllowFields = false;
        this.arenaAllowRect = false;
    }
    
}
