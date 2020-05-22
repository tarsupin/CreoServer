import { GameType, ArenaSize, RespawnType } from "./GameTypes.ts";

export default abstract class GameClass {
    
    // Game Details
    gameType!: GameType;
    title!: string;
    description!: string;
    
    // Players Allowed
    minPlayersAllowed: number = 2;      // Number of players that MUST be in the game.
    maxPlayersAllowed: number = 4;      // Maximum number of players allowed in the game.
    
    // Game Behaviors
    cooperative: boolean = false;       // Players are working together.
    competitive: boolean = false;       // Players are working against each other.
    battle: boolean = false;            // Players are capable of damaging each other.
    survival: boolean = false;          // Players survive against environment.
    
    // Team Behaviors
    teams: number = 0;                  // 2+ means there are teams that play against each other.
    
    // Respawns
    respawn: boolean = true;                            // Whether or not respawns are allowed.
    respawnFrames: number = 300;                        // How many frames before someone respawns.
    respawnInvincible: number = 60;                     // How many frames is the player invulnerable for after respawn?
    respawnUntouchable: boolean = false;                // If TRUE, cannot be affected until you move.
    respawnType: RespawnType = RespawnType.Standard;    // The type of respawn behavior.
    
    // Timer Limits
    timeLimit: number = 0;                      // If set, game expires at this duration.
    
    // Arena Games
    arena: boolean = false;                     // Arena matches are played on arena fields.
    arenaAllowHorizontal: boolean = false;      // Allow "Horizontal" Arenas
    arenaAllowVertical: boolean = false;        // Allow "Vertical" Arenas
    arenaAllowFields: boolean = false;          // Allow "Field" Arenas
    arenaAllowRect: boolean = false;            // Allow "Rectangular" Arenas
    
    constructor() {
        
    }
}
