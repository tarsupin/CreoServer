import Activity from "./Activity.ts";
import PlayerTracker from "../Player/PlayerTracker.ts";
import Player from "../Player/Player.ts";

export default abstract class LobbyFuncUsers {
    
	// Purge all players from this hub.
	static disconnectAllUsers() {
		
        // Loop through all players online and disconnect them.
        PlayerTracker.playerList.forEach((player: Player, index: number) => {
            player.disconnectFromServer();
        });
		
		// Final Cleanup
		PlayerTracker.runPlayerScan();
	}
	
	static addUser(): number {
        
        // Prepare the new player:
        let player = PlayerTracker.getAvailablePlayer();
        
		// Make sure the player isn't already in the hub.
		if(player.id == 0) { return 0; }
		
		PlayerTracker.playerList[player.id] = player;
		Activity.playerJoined();
		
		return player.id;
    }
    
	static dropUser( pid: number ): boolean {
		let player = PlayerTracker.playerList[pid];
		
		// Make sure the player is recognized in this hub.
		if(!player.isEnabled) { return false; }
		
		player.disconnectFromServer();
		Activity.playerDisconnected();
		delete PlayerTracker.playerList[pid];
		
		return true;
    }
    
}
