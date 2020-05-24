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
    
    // Respawns
    respawn: boolean = true;                            // Whether or not respawns are allowed.
    respawnFrames: number = 300;                        // How many frames before someone respawns.
    respawnInvincible: number = 60;                     // How many frames is the player invulnerable for after respawn?
    respawnUntouchable: boolean = false;                // If TRUE, cannot be affected until you move.
    respawnType: RespawnType = RespawnType.Standard;    // The type of respawn behavior.
    
    // Timer Limits
	timeLimit: number = 0;                      // If set, game expires at this duration.
	playDelay: number = 300;					// The number of frames that the game will wait before starting.
    
    // Arena Games
    arena: boolean = false;                     // Arena matches are played on arena fields.
    arenaAllowHorizontal: boolean = false;      // Allow "Horizontal" Arenas
    arenaAllowVertical: boolean = false;        // Allow "Vertical" Arenas
    arenaAllowFields: boolean = false;          // Allow "Field" Arenas
    arenaAllowRect: boolean = false;            // Allow "Rectangular" Arenas
    
}
