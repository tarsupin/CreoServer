import Lobby from "./Lobby.ts";
import { League } from "../Engine/GameTypes.ts";

/*
	The Activity Tracker tracks recent activity in the lobby, such as PPM (Players Per Minute)
		- Players Per Minute (PPM) is how fast players are re-joining the lobby. A good metric for activity.
			- The number is based on recent activity, not full-time activity to keep it relevant.
		- As activity increases, the lobby will speed up room creation and create larger rooms.
*/

export default abstract class Activity {
    
    // Activity Tracking
	static timeStarted: number = Date.now();	// The timestamp of when the lobby's activity tracker was first created.
	static minuteInt: number = 0;			    // The current minute, as an incrementing integer.
	static minuteJoined: number = 0;		    // The number of players that have joined Activity minute.
	static ppm: number = 0;					    // Players Per Minute Score.
	
    // Player Counters
	static playersOnline: number = 0;			// All players connected to the server. Includes those in rooms.
	static playersIdle: number = 0;				// Players that are not in a room. Includes playerQueued.
	static playersIdlePaid: number = 0;			// Idle Paid players.
	static playersIdleGuest: number = 0;		// Idle Guest players.
	static playersQueued: number = 0;			// Queued Players are waiting for Group or Rival assignments, if any are present.
	
	// Listing of League Ranks Idle
	static leaguesIdle: {
		[League.Unrated]: number,
		[League.Training]: number,
		[League.Bronze]: number,
		[League.Silver]: number,
		[League.Gold]: number,
		[League.Platinum]: number,
		[League.Diamond]: number,
		[League.Master]: number,
		[League.Grandmaster]: number,
		[index: number]: any,
	} = {
		[League.Unrated]: 0,
		[League.Training]: 0,
		[League.Bronze]: 0,
		[League.Silver]: 0,
		[League.Gold]: 0,
		[League.Platinum]: 0,
		[League.Diamond]: 0,
		[League.Master]: 0,
		[League.Grandmaster]: 0,
	};
	
    // Reset Player Counters (Runs every 5 seconds during player scan)
    static resetPlayerCounts() {
		
		// Reset Player Counts
		Activity.playersOnline = 0;
		Activity.playersIdle = 0;
		Activity.playersIdleGuest = 0;
		Activity.playersIdlePaid = 0;
		Activity.playersQueued = 0;
		
		// Reset League Detection
		Activity.leaguesIdle[League.Unrated] = 0;
		Activity.leaguesIdle[League.Training] = 0;
		Activity.leaguesIdle[League.Bronze] = 0;
		Activity.leaguesIdle[League.Silver] = 0;
		Activity.leaguesIdle[League.Gold] = 0;
		Activity.leaguesIdle[League.Platinum] = 0;
		Activity.leaguesIdle[League.Diamond] = 0;
		Activity.leaguesIdle[League.Master] = 0;
		Activity.leaguesIdle[League.Grandmaster] = 0;
		
		// Run Simulations (For Debugging Only)
		if(Lobby.simulate.active) {
			Activity.ppm = Lobby.simulate.ppm;
			Activity.playersIdleGuest = Lobby.simulate.guests;
			Activity.playersIdlePaid = Lobby.simulate.paid;
			Activity.playersQueued = Lobby.simulate.queued;
			Activity.playersIdle = Activity.playersIdleGuest + Activity.playersIdlePaid;
			Activity.playersOnline = Activity.playersIdle + Activity.playersQueued;
		}
    }
    
	// Activity Update (Runs every 5 seconds)
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
