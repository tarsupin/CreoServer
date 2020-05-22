import Player from "./Player.ts";

/*
    Player Tracker keeps track of all the players on the server.
*/

export default abstract class PlayerTracker {
    
    static playersOfficialCap = 300;            // The official maximum number of players supposed to be on the server.
    static playersAllowedOnServer = 400;        // The true amount of players that could be on the server, if bypassing cap.
    static playerScanId: number = 1;            // Loops through the players, using this as a scan ID.
    
    static playerList: Array<Player> = new Array(PlayerTracker.playersAllowedOnServer + 1);
    
	static getAvailablePlayer(): Player {
        
        // Loop from `playerScanId` to `playersAllowedOnServer`.
		for(let nextId = PlayerTracker.playerScanId; nextId <= PlayerTracker.playersAllowedOnServer; nextId++) {
            
            // Check if the player is active. If it isn't, return it's value:
            if(!PlayerTracker.isPlayerActive(nextId)) {
                PlayerTracker.playerScanId = nextId + 1;
                return PlayerTracker.playerList[nextId];
            }
        }
        
        // If we haven't found an available ID, it means playerScanId looped to the maximum amount.
        // Now we need to reset back to 1, so it will loop around again
		for(let nextId = 1; nextId < PlayerTracker.playerScanId; nextId++) {
            
            // Check if the player is active. If it isn't, return it's value:
            if(!PlayerTracker.isPlayerActive(nextId)) {
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
    
    static isPlayerActive( playerId: number ): boolean {
        return PlayerTracker.playerList[playerId].isEnabled;
    }
}
