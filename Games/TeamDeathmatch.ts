import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

export default class TeamDeathmatch extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.TeamBattle;
		this.gameClassFlag = GameClassFlag.TeamDeathmatch;
        this.title = "Team Deathmatch";
        this.description = "Score points for your team by defeating your enemies.";
        
        // Players Allowed
        this.minPlayersAllowed = 6;
        this.maxPlayersAllowed = 16;
        
        // Game Behaviors
        this.teams = 2;
        this.pvp = true;
        
        // Respawns
        this.respawn = true;
        this.respawnFrames = 300;
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
