import Player from "./Player.ts";
import PlayerTracker from "./PlayerTracker.ts";
import { PlayerRank, PlayerKarma, GamePreference } from "../Engine/GameTypes.ts";
import { WebSocket } from "../Engine/WebSocket.ts";

export default abstract class PlayerHandler {
    
    static resetToNewPlayer( player: Player ) {
        
        // Initialize Default Player Values
        player.isEnabled = false;
        player.socket = undefined;
        
        // Lobby
		player.waitStartTime = Date.now();
        
        // Room Values
        player.roomId = 0;
        player.spectate = false;
        
        // Player Details
		player.rank = PlayerRank.Guest;
		player.pingAvg = 5;
		player.karma = PlayerKarma.None;
        player.cheating = 0;
        
        // Player Settings
		player.gamePref = GamePreference.Battle;
		player.faction = "";
		player.group = "";
        player.rival = "";
    }
    
    static addWebSocket( player: Player, ws: WebSocket ) {
        player.socket = ws;
        ws.data.playerId = player.id;
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
