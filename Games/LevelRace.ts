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
        this.arenaType = ArenaType.Level;
		this.gameClassFlag = GameClassFlag.LevelRace;
        this.title = "Race";
        this.description = "Race through a level. You have competitors, but they can't hurt you.";
        
        // Players Allowed
        this.minPlayersAllowed = 2;
        this.maxPlayersAllowed = 4;
        
        // Game Behaviors
        this.teams = 0;
        this.pvp = false;
        
        // Timer Limits
        this.timeLimit = 600;
		this.playDelay = 300;
    }
}
