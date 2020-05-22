import { GamePreference, PlayerRank, PlayerKarma, League } from "../Engine/GameTypes.ts";
import { WebSocket } from "../Engine/WebSocket.ts";

export default class Player {
	
    // Identification
    isEnabled!: boolean;         // TRUE if the player is online, active, etc. FALSE if this player can be overwritten.
	id!: number;				 // The Player ID, as assigned by the server.
    socket?: WebSocket;          // The connection to user's websocket.
    
    // Game Data
    roomId!: number;			 // The Room that a user is assigned to.
    
    // Important Settings
	gamePref!: GamePreference;	// Which type of games / rooms you want to play.
	faction!: string;			// The faction of choice. Few options available; displays in game?
	group!: string;				// Which group you assign yourself to. These allies play beside you / load games together.
	rival!: string;				// Which group you rival against. These play against you / load games together.
	spectate!: boolean;			// If true, enter games in spectate mode. Doesn't add to player count. Max 4 spectators.
	
	// Lobby Details
	waitStartTime!: number;	// The timestamp of the player's most recent game, or lobby entrance.
	
	// Player Details
	rank!: PlayerRank;			// The player's rank: Guest, Member, Paid, VIP, Admin, etc.
	league!: League;		    // The player's rank: Guest, Member, Paid, VIP, Admin, etc.
	pingAvg!: number;			// How fast (ms) the player's connection seems to be.
	karma!: PlayerKarma;		// The level of karma the player has.
	cheating!: number;			// 0 is not cheater; 1+ is level of cheating karma.
	
	constructor( playerId: number ) {
		this.id = playerId;
        this.resetToNewPlayer();
    }
    
    // Idle Detection
	get isIdle() { return this.roomId == 0; }
	get isIdleGuest() { return this.roomId == 0 && this.rank < PlayerRank.PaidUser; }
	get isIdlePaid() { return this.roomId == 0 && this.rank >= PlayerRank.PaidUser; }
    get isQueued() { return false; }
	
	setGroup( group: string ) { this.group = group; }
	setRival( rival: string ) { this.rival = rival; }
    
    resetToNewPlayer() {
        
        // Initialize Default Player Values
        this.isEnabled = false;
        this.socket = undefined;
        
        // Lobby
		this.waitStartTime = Date.now();
        
        // Room Values
        this.roomId = 0;
        this.spectate = false;
        
        // Player Details
        this.rank = PlayerRank.Guest;
        this.league = League.Unrated;
		this.pingAvg = 5;
		this.karma = PlayerKarma.None;
        this.cheating = 0;
        
        // Player Settings
		this.gamePref = GamePreference.Undeclared;
		this.faction = "";
		this.group = "";
        this.rival = "";
    }
    
	disconnectFromRoom() {
        this.roomId = 0;
        this.waitStartTime = Date.now();
        
        // TODO: Send socket message that indicates they should switch to a playground lobby.
	}
    
	disconnectFromServer() {
        
        // Close the Socket Connection
        if(this.socket instanceof WebSocket) {
            this.socket.close();
        }
        
        if(!this.isEnabled) { return; }
        
        this.resetToNewPlayer();
	}
}
