import { GamePreference, PlayerRank, PlayerKarma } from "../Engine/GameTypes.ts";

export default class Player {
	
	// Identification & Assignment
	pid: number;				// The Player ID, as assigned by the server.
    roomServerId: number;		// The Room Server that a user is assigned to.
    roomId: number;				// The Room that a user is assigned to.
    
	// Important Settings
	gamePref: GamePreference;	// Which type of games / rooms you want to play.
	faction: string;			// The faction of choice. Few options available; displays in game?
	group: string;				// Which group you assign yourself to. These allies play beside you / load games together.
	rival: string;				// Which group you rival against. These play against you / load games together.
	spectate: boolean;			// If true, enter games in spectate mode. Doesn't add to player count. Max 4 spectators.
	
	// Lobby Details
	waitTime: number;			// The timestamp of the player's most recent game, or lobby entrance.
	
	// Player Details
	rank: PlayerRank;			// The player's rank: Guest, Member, Paid, VIP, Admin, etc.
	pingAvg: number;			// How fast (ms) the player's connection seems to be.
	karma: PlayerKarma;			// The level of karma the player has.
	cheating: number;			// 0 is not cheater; 1+ is level of cheating karma.
	
	constructor( pid: number ) {
        
		// Initialize Default Player Values
		this.pid = pid;
		this.waitTime = Date.now();
        
        // Room Values
        this.roomServerId = 0;
        this.roomId = 0;
        this.spectate = false;
        
        // Player Details
		this.rank = PlayerRank.Guest;
		this.pingAvg = 5;
		this.karma = PlayerKarma.None;
        this.cheating = 0;
        
        // Player Settings
		this.gamePref = GamePreference.Battle;
		this.faction = "";
		this.group = "";
        this.rival = "";
	}
	
	// TODO: Set isIdle and isQueued to valid values.
	get isIdle() { return false; }
	get isQueued() { return false; }
	
	setGroup( group: string ) { this.group = group; }
	setRival( rival: string ) { this.rival = rival; }
	
	// DISCONNECT
	disconnect() {
		console.log("MUST DISCONNECT PLAYER");
	}
}
