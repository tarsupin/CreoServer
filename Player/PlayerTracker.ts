import Player from "./Player.ts";
import Activity from "../Lobby/Activity.ts";
import Lobby from "../Lobby/Lobby.ts";

/*
    Player Tracker keeps track of all the players on the server.
*/

export default abstract class PlayerTracker {
    
    static playersOfficialCap = 300;            // The official maximum number of players supposed to be on the server.
    static playersAllowedOnServer = 400;        // The true amount of players that could be on the server, if bypassing cap.
    static playerScanId: number = 1;            // Loops through the players, using this as a scan ID.
    
    static playerList: Array<Player> = new Array(PlayerTracker.playersAllowedOnServer + 1);
    
    // Indexes
    static idlePaid: Array<Player> = new Array<Player>(16);         // Updates every 5 seconds (Player Scan)
    static idleGuests: Array<Player> = new Array<Player>(16);       // Updates every 5 seconds (Player Scan)
    
	static getAvailablePlayer(): Player {
        
        // Loop from `playerScanId` to `playersAllowedOnServer`.
		for(let nextId = PlayerTracker.playerScanId; nextId <= PlayerTracker.playersAllowedOnServer; nextId++) {
            
            // Check if the player is active. If it isn't, return it's value:
            if(!PlayerTracker.isPlayerEnabled(nextId)) {
                PlayerTracker.playerScanId = nextId + 1;
                return PlayerTracker.playerList[nextId];
            }
        }
        
        // If we haven't found an available ID, it means playerScanId looped to the maximum amount.
        // Now we need to reset back to 1, so it will loop around again
		for(let nextId = 1; nextId < PlayerTracker.playerScanId; nextId++) {
            
            // Check if the player is active. If it isn't, return it's value:
            if(!PlayerTracker.isPlayerEnabled(nextId)) {
                PlayerTracker.playerScanId = nextId + 1;
                return PlayerTracker.playerList[nextId];
            }
        }
        
        // If every player is somehow filled, return the default player.
        return PlayerTracker.playerList[0];
	}
	
	static getPlayer( playerId: number ): Player {
        return PlayerTracker.playerList[playerId];
    }
    
    static isPlayerEnabled( playerId: number ): boolean {
        return PlayerTracker.playerList[playerId].isEnabled;
    }
    
    static runPlayerScan() {
        
        // Resets
        Activity.resetPlayerCounts();
		Lobby.resetGroups();
		Lobby.resetPrefs();
        
        let idleVIPCount = 0;
        let idleGuestCount = 0;
        
        let curTimestamp = Date.now(); // Player with earliest waiting timestamp.
        
		for(let nextId = 0; nextId <= PlayerTracker.playersAllowedOnServer; nextId++) {
            
            // Skip this player if it isn't enabled.
            if(!PlayerTracker.isPlayerEnabled(nextId)) { continue; }
            
            let player = PlayerTracker.playerList[nextId];
            
			// Update Players Counts
			Activity.playersOnline++;
			
            // Idle Players
            if(player.isIdle) {
                Activity.playersIdle++;
                
                // Idle Paid
                if(player.isIdlePaid) {
                    Activity.playersIdlePaid++;
                    
                    if(idleVIPCount < 16) {
                        PlayerTracker.idlePaid[idleVIPCount] = player;
                        idleVIPCount++;
                    }
                }
                
                // Idle Guests
                if(player.isIdleGuest) {
                    Activity.playersIdleGuest++;
                    
                    if(idleGuestCount < 16) {
                        PlayerTracker.idleGuests[idleGuestCount] = player;
                        idleGuestCount++;
                    }
                }
                
			    // Update Queued Players
				if(player.isQueued) {
					Activity.playersQueued++;
				} else {
					
					// Determine Longest Wait Time
					// Only applies if the player is idle, and not queuing for any specific games.
					if(player.waitStartTime < curTimestamp) {
						curTimestamp = player.waitStartTime;
					}
				}
            }
            
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
			
			// Update Game Preferences
			if(player.gamePref) {
				Lobby.prefs[player.gamePref]++;
			}
        }
        
		// Set Longest Wait Duration
		Lobby.longestWait = Date.now() - curTimestamp;
    }
}
