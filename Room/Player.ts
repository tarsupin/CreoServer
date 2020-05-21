import Room from "./Room.ts";
import { PlayerRank, PlayerKarma } from "../WebServer/GameTypes.ts";

export default class Player {
	
	// Identification & Assignment
	pid: number;				// The Player ID, as assigned by the server.
	roomId: number;				// The Room that a user is assigned to.
	
	// Important Settings
	spectate: boolean;			// If true, enter games in spectate mode. Doesn't add to player count. Max 4 spectators.
	
	// Player Details
	rank: PlayerRank;			// The player's rank: Guest, Member, Paid, VIP, Admin, etc.
	pingAvg: number;			// How fast (ms) the player's connection seems to be.
	karma: PlayerKarma;			// The level of karma the player has.
	cheating: number;			// 0 is not cheater; 1+ is level of cheating karma.
	
	constructor( pid: number ) {
		this.pid = pid;
		
		// Initialize Player Values
		this.roomId = 0;
		this.spectate = false;
		this.rank = PlayerRank.Guest;
		this.pingAvg = 5;
		this.karma = PlayerKarma.None;
		this.cheating = 0;
	}
}
