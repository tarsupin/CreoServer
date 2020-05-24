import GameClass from "../Engine/GameClass.ts";
import { ArenaType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

/*
	Play as one of four ninjas (randomly selected) and play through a traditional level cooperatively.
*/

export default class NinjaAcademy extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.TeamLevel;
		this.gameClassFlag = GameClassFlag.NinjaAcademy;
        this.title = "Ninja Academy";
        this.description = "Traditional level, but everyone is a ninja. Collect all the gems.";
        
        // Players Allowed
        this.minPlayersAllowed = 4;
        this.maxPlayersAllowed = 4;
        
        // Game Behaviors
        this.teams = 1;
        this.pvp = false;
        
        // Timer Limits
        this.timeLimit = 300;
		this.playDelay = 300;
    }
}
