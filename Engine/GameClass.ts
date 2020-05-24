import { ArenaType, ArenaSize, RespawnType } from "./ArenaTypes.ts";
import { GameClassFlag } from "./SocketFlags.ts";

export default class GameClass {
    
    // Game Details
	arenaType!: ArenaType;
	gameClassFlag!: GameClassFlag;
    title!: string;
    description!: string;
    
    // Players Allowed
    minPlayersAllowed: number = 2;      // Number of players that MUST be in the game.
    maxPlayersAllowed: number = 4;      // Maximum number of players allowed in the game.
    
    // Game Behaviors
    teams: number = 0;                  // 2+ means there are teams that play against each other.
    pvp: boolean = false;            	// Players are capable of damaging each other.
    
    // Timer Limits
	timeLimit: number = 0;                      // If set, game expires at this duration.
	playDelay: number = 300;					// The number of frames that the game will wait before starting.
}
