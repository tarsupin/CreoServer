
/*
	The Activity Tracker tracks recent activity in the lobby, such as PPM (Players Per Minute)
		- Players Per Minute (PPM) is how fast players are re-joining the lobby. A good metric for activity.
			- The number is based on recent activity, not full-time activity to keep it relevant.
		- As activity increases, the lobby will speed up room creation and create larger rooms.
*/

export default abstract class Activity {
	
	static timeStarted: number = Date.now();	// The timestamp of when the lobby's activity tracker was first created.
	static minuteInt: number = 0;			    // The current minute, as an incrementing integer.
	static minuteJoined: number = 0;		    // The number of players that have joined Activity minute.
	static ppm: number = 0;					    // Players Per Minute Score.
	
	// Five Second Tick
	static activityTick() {
		const last = Date.now() - Activity.timeStarted;
		const minuteNum = Math.floor(last / 60000);     // Date.now() returns in ms, so 60000 = 60 seconds.
		
		// If the next minute has passed, increment the counter, and update the PPM.
		if(minuteNum !== Activity.minuteInt) {
			Activity.minuteInt = minuteNum;
			Activity.minuteJoined = 0;
			Activity.updatePPM();
		}
	}
	
	// A player is considered to "Join" every time they return to the lobby.
	static playerJoined() {
		Activity.minuteJoined++;
	}
	
	// A player is ONLY considered to disconnect when they are removed from the lobby. NOT when they enter a room.
	// Activity reduces the minuteJoined property because players that leave the lobby can't be considered in the PPM.
	static playerDisconnected() {
		Activity.minuteJoined--;
	}
	
	static updatePPM() {
		const currentPPM = Activity.minuteInt / Activity.minuteJoined;
		Activity.ppm = Math.round((Activity.ppm + currentPPM) / 2);
		
		// If the current PPM was 0, lobby could be disabled. Repeat the update for extra tolerance.
		if(currentPPM === 0) {
			Activity.ppm = Math.round((Activity.ppm + currentPPM) / 2);
		}
	}
}
