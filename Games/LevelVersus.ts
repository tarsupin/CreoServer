import GameClass from "../Engine/GameClass.ts";
import { ArenaType, RespawnType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

export default class LevelVersus extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.Level;
		this.gameClassFlag = GameClassFlag.LevelVersus;
        this.title = "Versus Level";
        this.description = "Traditional level playthrough, but with competition and battling.";
        
        // Players Allowed
        this.minPlayersAllowed = 2;
        this.maxPlayersAllowed = 4;
        
        // Game Behaviors
        this.teams = 0;
        this.pvp = true;
        
        // Timer Limits
        this.timeLimit = 600;
		this.playDelay = 300;
    }
}
