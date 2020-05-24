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
        
        // Timer Limits
        this.timeLimit = 300;
		this.playDelay = 300;
    }
}
