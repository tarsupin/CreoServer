import { config } from "../config.ts";

export default abstract class VerboseLog {
    
    static isLogging: boolean = config.debug.logging;
    static isVerbose: boolean = config.debug.logging && config.debug.verbose;
    
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
