import { config } from "../config.ts";

export default abstract class VerboseLog {
    
    static isLogging: boolean = config.debug.logging;
    static isVerbose: boolean = config.debug.logging && config.debug.verbose;
    
    static log(logData: any) {
        if(VerboseLog.isLogging) {
            console.log(logData);
        }
    }
    
    static verbose(logData: any) {
        if(VerboseLog.isVerbose) {
            console.log(logData);
        }
    }
}
