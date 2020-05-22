import Player from "./Player.ts";
import PlayerTracker from "./PlayerTracker.ts";

export default abstract class PlayerHandler {
    
    // Generate the empty players, so that they can be looped through.
    static buildPlayerPlaceholders() {
        for(let playerId = 0; playerId <= PlayerTracker.playersAllowedOnServer; playerId++) {
            PlayerTracker.playerList[playerId] = new Player(playerId);
        }
    }
}
