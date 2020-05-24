import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

/*
	Standard Level, but everyone is racing to complete it first.
*/

export default class LevelRace extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.gameType = ArenaType.Trial;
		this.gameClassFlag = GameClassFlag.LevelRace;
        this.title = "Race";
        this.description = "Race through a level. You have competitors, but they can't hurt you.";
        
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
        this.respawnFrames = 0;
        this.respawnInvincible = 90;
        this.respawnUntouchable = true;
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
