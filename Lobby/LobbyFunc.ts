import { config } from "../config.ts";

export default abstract class LobbyFunc {
    
    static GetServerPort(): number {
        
         // Prepare Server Setup
        let port = config.lobbies[0].port;
        
        // Retrieve CLI Arguments
        for( let j = 0; j < Deno.args.length; j++ ) {
            
            const last = Deno.args[j - 1];
            const val = Deno.args[j];
            
            // Retrieve Port
            if(last === "-port") {
                const valInt = parseInt(val);
                
                if(valInt >= port) {
                    port = parseInt(val);
                }
            }
        }
        
        return port;
    }
}