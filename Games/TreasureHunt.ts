import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

/*
	The goal in Treasure Hunt is to collect as many coins as possible before your opponents do.
	No Battles. This is a friendly competition.
    Coins will slowly reappear in the level after collection, so stay alert.
*/

export default class TreasureHunt extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.SoloArena;
		this.gameClassFlag = GameClassFlag.TreasureHunt;
        this.title = "Treasure Hunt";
        this.description = "Collect the most gems to achieve victory.";
        
        // Players Allowed
        this.minPlayersAllowed = 2;
        this.maxPlayersAllowed = 4;
        
        // Game Behaviors
        this.teams = 0;
        this.pvp = false;
        
        // Timer Limits
        this.timeLimit = 150;
		this.playDelay = 300;
    }
}
