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
        this.arenaType = ArenaType.TeamArena;
		this.gameClassFlag = GameClassFlag.Dodgeball;
        this.title = "Dodgeball";
        this.description = "Dodge ball projectiles while knocking out your opponents.";
        
        // Players Allowed
        this.minPlayersAllowed = 6;
        this.maxPlayersAllowed = 16;
        
        // Game Behaviors
        this.teams = 2;
        this.pvp = true;
        
        // Timer Limits
        this.timeLimit = 300;
		this.playDelay = 300;
    }
}
