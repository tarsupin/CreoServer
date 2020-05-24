import GameClass from "../Engine/GameClass.ts";
import { ArenaType } from "../Engine/ArenaTypes.ts";
import { GameClassFlag } from "../Engine/SocketFlags.ts";

/*
    Defend a tower from enemies with your team.
*/

export default class TowerDefense extends GameClass {
    
    constructor() {
        super();
        
        // Game Details
        this.arenaType = ArenaType.TeamArena;
		this.gameClassFlag = GameClassFlag.TowerDefense;
        this.title = "Tower Defense";
        this.description = "Protect your tower against an onslaught of enemies.";
        
        // Players Allowed
        this.minPlayersAllowed = 4;
        this.maxPlayersAllowed = 4;
        
        // Game Behaviors
        this.teams = 1;
        this.pvp = false;
        
        // Timer Limits
        this.timeLimit = 180;
		this.playDelay = 300;
    }
}
