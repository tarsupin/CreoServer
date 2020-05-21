import { WebSocket, WebSocketServer } from "../WebServer/WebSocket.ts";
import { config } from "../config.ts";

export default abstract class LobbyFuncCommands {
    
    static ReceiveTextCommand(ws: WebSocket, message: string): void {
        
        // Logging (Local Only)
        if(config.debug.active) {
            console.log("Player " + ws.data.playerId + " Sent: %s", message);
            // ws.send(message);     // Echo Server
        }
        
        if(message == ":listServers") {
            
        }
    }
    
    static ReceiveByteCommand(ws: WebSocket, bytes: Uint8Array): void {
        
        // Logging (Local Only)
        if(config.debug.active) {
            console.log("Player " + ws.data.playerId + " Sent Bytes: %s", bytes.toString());
            // ws.send(message);     // Echo Server
        }
        
    }
}