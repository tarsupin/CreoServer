import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

/*
	Play as one of four superheroes (randomly selected) and play through a traditional level cooperatively.
*/

export default class Superheroes extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.TeamLevel;
		this.gameClassFlag = GameClassFlag.Superheroes;
        this.title = "Superheroes";
        this.description = "Traditional level, but everyone is a superhero.";
        
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
