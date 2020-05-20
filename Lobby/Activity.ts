import PlayerLobby from "./PlayerLobby.ts";

/*
	The Activity Tracker tracks recent activity in the lobby, such as PPM (Players Per Minute)
		- Players Per Minute (PPM) is how fast players are re-joining the lobby. A good metric for activity.
			- The number is based on recent activity, not full-time activity to keep it relevant.
		- As activity increases, the lobby will speed up room creation and create larger rooms.
*/

export default class Activity {
	
	readonly timeStarted: number;		// The timestamp of when the lobby's activity tracker was first created.
	private minuteInt: number;			// The current minute, as an incrementing integer.
	private minuteJoined: number;		// The number of players that have joined this minute.
	
	public ppm: number;					// Players Per Minute Score.
	
	constructor() {
		this.timeStarted = Date.now();
		this.ppm = 0;
		this.minuteInt = 0;
		this.minuteJoined = 0;
	}
	
	// Five Second Tick
	activityTick() {
		const last = Date.now() - this.timeStarted;
		const minuteNum = Math.floor(last / 60000);
		
		// If the next minute has passed, increment the counter, and update the PPM.
		if(minuteNum !== this.minuteInt) {
			this.minuteInt = minuteNum;
			this.minuteJoined = 0;
			this.updatePPM();
		}
	}
	
	// A player is considered to "Join" every time they return to the lobby.
	public playerJoined() {
		this.minuteJoined++;
	}
	
	// A player is ONLY considered to disconnect when they are removed from the lobby. NOT when they enter a room.
	// This reduces the minuteJoined property because players that leave the lobby can't be considered in the PPM.
	public playerDisconnected() {
		this.minuteJoined--;
	}
	
	public updatePPM() {
		const currentPPM = this.minuteInt / this.minuteJoined;
		this.ppm = Math.round((this.ppm + currentPPM) / 2);
		
		// If the current PPM was 0, lobby could be disabled. Repeat the update for extra tolerance.
		if(currentPPM === 0) {
			this.ppm = Math.round((this.ppm + currentPPM) / 2);
		}
	}
}
