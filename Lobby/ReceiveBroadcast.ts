import { WebSocket, WebSocketServer } from "../Engine/WebSocket.ts";
import VerboseLog from "../Engine/VerboseLog.ts";
import PlayerTracker from "../Player/PlayerTracker.ts";
import { SocketFlags } from "../Engine/SocketFlags.ts";

export default abstract class ReceiveBroadcast {
    
    static ReceiveByteCommand(ws: WebSocket, bytes: Uint8Array): void {
		
		VerboseLog.log("Receiving Bytes from player.");
		
		// Verify that there are sufficient bytes to review:
		if(bytes.length < 2) { return; }
		
		// Identify the Player Responsible
		let player = PlayerTracker.getPlayer(ws.playerId);
		
		if(player.id == 0) {
			VerboseLog.log("Invalid Player or WebSocket. Returned with Player 0.");
			return;
		}
		
        // Logging (Local Only)
        VerboseLog.log("Player " + player.id + " Sent Bytes: " + bytes.toString());
		
		let primeFlag = bytes[0];
		
		// Check if Player is in a Game:
		if(player.inGame) {
			
			// Pressed Key
			if(primeFlag == SocketFlags.InputPress) {
				player.pressedKey( bytes[1] );
			}
			
			// Released Key
			else if(primeFlag == SocketFlags.InputRelease) {
				player.releasedKey( bytes[1] );
			}
		}
	}
	
    static ReceiveTextCommand(ws: WebSocket, message: string): void {
        
        // Logging (Local Only)
        VerboseLog.log("Player " + ws.playerId + " Sent Message: " + message);
        
    }
}

