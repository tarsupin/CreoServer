import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

export default class NinjaBall extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.TeamArena;
		this.gameClassFlag = GameClassFlag.NinjaBall;
        this.title = "Ninja Ball";
        this.description = "Kick the ball into the opponent's goal to score.";
        
        // Players Allowed
        this.minPlayersAllowed = 4;
        this.maxPlayersAllowed = 12;
        
        // Game Behaviors
        this.teams = 2;
        this.pvp = true;
        
        // Respawns
        this.respawn = true;
        this.respawnFrames = 60;
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
