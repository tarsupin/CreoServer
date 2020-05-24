import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

export default class Deathmatch extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.Battle;
		this.gameClassFlag = GameClassFlag.Deathmatch;
        this.title = "Deathmatch";
        this.description = "Score points by defeating your enemies.";
        
        // Players Allowed
        this.minPlayersAllowed = 2;
        this.maxPlayersAllowed = 16;
        
        // Game Behaviors
        this.teams = 0;
        this.pvp = true;
        
        // Timer Limits
        this.timeLimit = 300;
		this.playDelay = 300;
    }
}
