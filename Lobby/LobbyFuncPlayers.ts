import Lobby from "./Lobby.ts";
import PlayerTracker from "../Player/PlayerTracker.ts";
import Activity from "./Activity.ts";

export default abstract class LobbyFuncPlayers {
    
	static runPlayerLoop() {
		
		LobbyFuncPlayers.resetPlayerCount();
		Lobby.resetGroups();
		Lobby.resetPrefs();
		
		let earliestWait = Date.now(); // Player with earliest waiting timestamp.
		
		// Player Loop
		for( let i in PlayerTracker.playerList ) {
			let player = PlayerTracker.playerList[i];
			
			// Update Players Counts
			Activity.playersOnline++;
			
			// Check Group
			if(player.group) {
				
				// Add the group if it does not exist.
				if(!Lobby.groups[player.group]) {
					Lobby.groups[player.group] = { online: 0, idle: 0 };
				}
				
				// Increment the number of players in the group.
				Lobby.groups[player.group].online++;
				
				if(player.isIdle) {
					Lobby.groups[player.group].idle++;
				}
			}
			
			// Update Idle & Queued Players
			if(player.isIdle) {
				Activity.playersIdle++;
				
				if(player.isQueued) {
					Activity.playersQueued++;
				} else {
					
					// Determine Longest Wait Time
					// Only applies if the player is idle, and not queuing for any specific games.
					if(player.waitTime < earliestWait) {
						earliestWait = player.waitTime;
					}
				}
			}
			
			// Update Game Preferences
			if(player.gamePref) {
				Lobby.prefs[player.gamePref]++;
			}
		}
		
		// Set Longest Wait Duration
		Lobby.longestWait = Date.now() - earliestWait;
	}
	
	static resetPlayerCount() {
		Activity.playersOnline = 0;
		Activity.playersIdle = 0;
		Activity.playersQueued = 0;
		
		// Run Simulations (For Debugging Only)
		if(Lobby.simulate.active) {
			Activity.playersIdle = Lobby.simulate.idle;
			Activity.playersQueued = Lobby.simulate.queued;
			Activity.playersOnline = Activity.playersIdle + Activity.playersQueued;
		}
	}
	
}
