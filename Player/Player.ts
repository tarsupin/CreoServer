import { GamePreference, PlayerRank, PlayerKarma, League } from "../Engine/GameTypes.ts";
import { WebSocket } from "../Engine/WebSocket.ts";
import { IKey } from "../Engine/SocketFlags.ts";
import RoomTracker from "../Room/RoomTracker.ts";
import VerboseLog from "../Engine/VerboseLog.ts";

export default class Player {
	
    // Identification
    isEnabled!: boolean;         	// TRUE if the player is online, active, etc. FALSE if this player can be overwritten.
	id!: number;				 	// The Player ID, as assigned by the server.
    socket?: WebSocket;          	// The connection to user's websocket.
	
	// Character
	username!: string;				// The player's username.
	
    // Game Data
	roomId!: number;			 	// The Room that a user is assigned to.
	gameFrame: number = 0;
	
	// Input Tracking
	keysPressed: Array<IKey> = new Array<IKey>(5);
	keysReleased: Array<IKey> = new Array<IKey>(5);
	kpIndex: number = 0;
	krIndex: number = 0;
	
    // Important Settings
	gamePref!: GamePreference;		// Which type of games / rooms you want to play.
	faction!: string;				// The faction of choice. Few options available; displays in game?
	group!: string;					// Which group you assign yourself to. These allies play beside you / load games together.
	rival!: string;					// Which group you rival against. These play against you / load games together.
	spectate!: boolean;				// If true, enter games in spectate mode. Doesn't add to player count. Max 4 spectators.
	
	// Lobby Details
	waitStartTime!: number;			// The timestamp of the player's most recent game, or lobby entrance.
	
	// Player Details
	rank!: PlayerRank;				// The player's rank: Guest, Member, Paid, VIP, Admin, etc.
	league!: League;		    	// The player's rank: Guest, Member, Paid, VIP, Admin, etc.
	pingAvg!: number;				// How fast (ms) the player's connection seems to be.
	karma!: PlayerKarma;			// The level of karma the player has.
	cheating!: number;				// 0 is not cheater; 1+ is level of cheating karma.
	
	constructor( playerId: number ) {
		this.id = playerId;
        this.resetToEmptyPlayer();
    }
	
	get isAvailable() { return this.roomId == 0; }
	get inGame() { return this.roomId != 0; }
	
    // Idle Detection
	get isIdle() { return this.roomId == 0; }
	get isIdleGuest() { return this.roomId == 0 && this.rank < PlayerRank.PaidUser; }
	get isIdlePaid() { return this.roomId == 0 && this.rank >= PlayerRank.PaidUser; }
    get isQueued() { return false; }
	
	setGroup( group: string ) { this.group = group; }
	setRival( rival: string ) { this.rival = rival; }
    
    resetToEmptyPlayer() {
        
        // Initialize Default Player Values
        this.isEnabled = false;
		this.socket = undefined;
		
		// Identification
		this.username = "";
        
        // Lobby
		this.waitStartTime = Date.now();
        
        // Room Data
		this.roomId = 0;
		this.gameFrame = 0;
		this.resetKeyInputs();
		
        // Player Settings
		this.gamePref = GamePreference.Undeclared;
		this.faction = "";
		this.group = "";
        this.rival = "";
		this.spectate = false;
		
        // Player Details
        this.rank = PlayerRank.Guest;
        this.league = League.Unrated;
		this.pingAvg = 5;
		this.karma = PlayerKarma.None;
        this.cheating = 0;
	}
	
    assignNewPlayer( socket: WebSocket ) {
        
        this.resetToEmptyPlayer();
        this.isEnabled = true;
        
        // Socket Connections
        this.socket = socket;
        socket.playerId = this.id;
        
        // Load Session Data
        // TODO: Load any specifics this player has stored in their session or details.
    }
	
	pressedKey( key: number ) {
		if(key <= 0 || key > IKey.Other || this.kpIndex >= 5) { return; }
		this.keysPressed[this.kpIndex] = key;
		this.kpIndex++;
	}
	
	releasedKey( key: number ) {
		if(key <= 0 || key > IKey.Other || this.krIndex >= 5) { return; }
		this.keysReleased[this.krIndex] = key;
		this.krIndex++;
	}
	
	disconnectFromRoom() {
		
		VerboseLog.verbose("Player " + this.id + " is attempting to disconnect from Room " + this.roomId);
		
		// Leave Room
		if(this.roomId != 0) {
			let room = RoomTracker.roomList[this.roomId];
			let pNum = room.getPlayerNumById(this.id);
			
			if(pNum > -1) {
				room.removePlayerByNum(pNum);
			}
			
			this.roomId = 0;
			VerboseLog.verbose("Player " + this.id + " has successfully disconnected from Room " + this.roomId);
		}
		
        this.waitStartTime = Date.now();
        
        // TODO: Send socket message that indicates they should switch to a playground lobby.
	}
    
	disconnectFromServer() {
		
		this.disconnectFromRoom();
		
		VerboseLog.verbose("Player " + this.id + " is attempting to disconnect from the Server.");
		
        // Close the Socket Connection
        if(this.socket instanceof WebSocket) {
			this.socket.playerId = 0;
			
            if(!this.socket.isClosed) {
				this.socket.close();
				VerboseLog.verbose("Player " + this.id + " has closed a Socket connection to the Server.");
			}
			
			this.socket = undefined;
			
			VerboseLog.verbose("Player " + this.id + "'s access to Socket has been removed.");
        }
        
        if(!this.isEnabled) { return; }
        
        this.resetToEmptyPlayer();
	}
	
	resetKeyInputs() {
		this.kpIndex = 0;
		this.krIndex = 0;
		for(let i = 0; i < 5; i++) {
			this.keysPressed[i] = 0;
			this.keysReleased[i] = 0;
		}
	}
}
