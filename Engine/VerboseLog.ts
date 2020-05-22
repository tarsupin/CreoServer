import { config } from "../config.ts";

export default abstract class VerboseLog {
    
    static isLogging: boolean = config.debug.active;
    static isVerbose: boolean = config.debug.active && config.debug.verbose;
    
    static log(text: string) {
        if(VerboseLog.isLogging) {
            console.log(text);
        }
    }
    
    static verbose(text: string) {
        if(VerboseLog.isVerbose) {
            console.log(text);
        }
    }
}
