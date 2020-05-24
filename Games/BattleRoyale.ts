import GameClass from "../Engine/GameClass.ts";
import { ArenaType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

export default class BattleRoyale extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
		this.arenaType = ArenaType.Battle;
		this.gameClassFlag = GameClassFlag.BattleRoyale;
        this.title = "Battle Royale";
        this.description = "Survive the longest. Defeat your enemies for supplies.";
        
        // Players Allowed
        this.minPlayersAllowed = 4;
        this.maxPlayersAllowed = 16;
        
        // Game Behaviors
        this.teams = 0;
        this.pvp = true;
        
        // Timer Limits
		this.timeLimit = 150;
		this.playDelay = 300;
    }
}
