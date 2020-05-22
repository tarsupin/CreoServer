import Player from "./Player.ts";
import PlayerTracker from "./PlayerTracker.ts";
import { PlayerRank, PlayerKarma, GamePreference } from "../Engine/GameTypes.ts";
import { WebSocket } from "../Engine/WebSocket.ts";

export default abstract class PlayerHandler {
    
    static addWebSocket( player: Player, ws: WebSocket ) {
        player.socket = ws;
        ws.data.playerId = player.id;
    }
    
    // Generate the empty players, so that they can be looped through.
    static buildPlayerPlaceholders() {
        for(let playerId = 0; playerId <= PlayerTracker.playersAllowedOnServer; playerId++) {
            PlayerTracker.playerList[playerId] = new Player(playerId);
        }
    }
}
