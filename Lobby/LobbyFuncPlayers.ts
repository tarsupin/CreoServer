import Player from "../Player/Player.ts";
import Lobby from "./Lobby.ts";
import Activity from "./Activity.ts";

export default abstract class LobbyFuncPlayers {
    
    static playerNextId: number = 0;            // Tracks the next available ID for the user.
	static playersOnline: number = 0;			// All players connected to the server. Includes those in rooms.
	static playersIdle: number = 0;				// Players that are not in a room. Includes playerQueued.
	static playersQueued: number = 0;			// Queued Players are waiting for Group or Rival assignments, if any are present.
	
    static getNextPlayerId() {
        LobbyFuncPlayers.playerNextId++;
        return LobbyFuncPlayers.playerNextId;
    }
    
	static runPlayerLoop() {
		
		LobbyFuncPlayers.resetPlayerCount();
		Lobby.resetGroups();
		Lobby.resetPrefs();
		
		let earliestWait = Date.now(); // Player with earliest waiting timestamp.
		
		// Player Loop
		for( let i in Lobby.players ) {
			let player = Lobby.players[i];
			
			// Update Players Counts
			LobbyFuncPlayers.playersOnline++;
			
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
				LobbyFuncPlayers.playersIdle++;
				
				if(player.isQueued) {
					LobbyFuncPlayers.playersQueued++;
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
	
	// Purge all players from this hub.
	static purgeAllPlayers() {
		
		// Loop through all players in the hub.
		for( let pid in Lobby.players ) {
			Lobby.players[pid].disconnect();
		}
		
		// Final Cleanup
		Lobby.players = {};
		LobbyFuncPlayers.runPlayerLoop();
	}
	
	static addPlayer(): number {
        
        // Prepare the new player:
        let pid = LobbyFuncPlayers.getNextPlayerId();
        let player = new Player(pid);
        
		// Make sure the player isn't already in the hub.
		if(!player || !(player instanceof Player)) { return 0; }
		
		Lobby.players[player.pid] = player;
		Activity.playerJoined();
		
		return player.pid;
    }
    
	static dropPlayer( pid: number ): boolean {
		
		let player = Lobby.players[pid];
		
		// Make sure the player is recognized in this hub.
		if(!player || !(player instanceof Player)) { return false; }
		
		player.disconnect();
		Activity.playerDisconnected();
		delete Lobby.players[pid];
		
		return true;
    }
    
	static resetPlayerCount() {
		LobbyFuncPlayers.playersOnline = 0;
		LobbyFuncPlayers.playersIdle = 0;
		LobbyFuncPlayers.playersQueued = 0;
		
		// Run Simulations (For Debugging Only)
		if(Lobby.simulate.active) {
			LobbyFuncPlayers.playersIdle = Lobby.simulate.idle;
			LobbyFuncPlayers.playersQueued = Lobby.simulate.queued;
			LobbyFuncPlayers.playersOnline = LobbyFuncPlayers.playersIdle + LobbyFuncPlayers.playersQueued;
		}
	}
	
}
