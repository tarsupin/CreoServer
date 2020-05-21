import Player from "./Player.ts";
import PlayerTracker from "./PlayerTracker.ts";

export default abstract class PlayerHandler {
    
    static assignPlayer( playerId: number ) {
        
    }
    
    static disablePlayer( playerId: number ) {
        
        // Set as Inactive (allows it to be used for a new system)
        PlayerTracker.playerList[playerId].isEnabled = false;
    }
    
    // Generate the empty players, so that they can be looped through.
    static buildPlayerPlaceholders() {
        for(let playerId = 0; playerId <= PlayerTracker.playersAllowedOnServer; playerId++) {
            PlayerTracker.playerList[playerId] = new Player(playerId);
        }
    }
}
