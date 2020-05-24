import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

/*
	The goal in Ghost Town is for your team to collect as many coins as possible before the opposing team does.
	Battling and damaging others is allowed and encouraged, but doesn't score points.
    Coins will slowly reappear in the level after collection, so stay alert.
*/

export default class GhostTown extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.TeamBattle;
		this.gameClassFlag = GameClassFlag.GhostTown;
        this.title = "Ghost Town";
        this.description = "Collect gems while surviving team battle and environmental hazards.";
        
        // Players Allowed
        this.minPlayersAllowed = 6;
        this.maxPlayersAllowed = 12;
        
        // Game Behaviors
        this.teams = 2;
        this.pvp = true;
        
        // Timer Limits
        this.timeLimit = 240;
		this.playDelay = 300;
    }
}
