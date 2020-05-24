import GameClass from "../Engine/GameClass.ts";
import { GameType, RespawnType } from "../Engine/GameTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

export default class CaptureTheFlag extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = GameType.TeamArena;
		this.gameClassFlag = GameClassFlag.CaptureTheFlag;
        this.title = "Capture The Flag";
        this.description = "Capture the enemy's flag while defending your own.";
        
        // Players Allowed
        this.minPlayersAllowed = 4;
        this.maxPlayersAllowed = 12;
        
        // Game Behaviors
        this.cooperative = true;
        this.competitive = true;
        this.battle = true;
        this.survival = false;
        
        // Team Behaviors
        this.teams = 2;
        
        // Respawns
        this.respawn = true;
        this.respawnFrames = 600;
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
