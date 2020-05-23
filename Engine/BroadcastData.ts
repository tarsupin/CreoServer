import Player from "../Player/Player.ts";
import { SocketFlags } from "./SocketFlags.ts";

/*
	This class helps build byte[] data to send to the players.
	
	BroadcastData.newBroadcast();
	BroadcastData.addFlag( SocketFlags.Emote, EmoteFlag.Look );
	BroadcastData.addPlayerInput( playerId );
	BroadcastData.addStringFlag( SocketFlags.LoadLevel, levelId );
*/

export default abstract class BroadcastData {
	
	static data: Uint8Array = new Uint8Array(300);
	static index: number = 0;
	
	static newBroadcast() {
		BroadcastData.index = 0;
	}
	
	static addFlag( flag: number, val1: number ) {
		BroadcastData.data[BroadcastData.index] = flag;
		BroadcastData.data[BroadcastData.index + 1] = val1;
		BroadcastData.index += 2;
	}
	
	static addFlagTwo( flag: number, val1: number, val2: number ) {
		BroadcastData.data[BroadcastData.index] = flag;
		BroadcastData.data[BroadcastData.index + 1] = val1;
		BroadcastData.data[BroadcastData.index + 2] = val2;
		BroadcastData.index += 3;
	}
	
	static addValue( val: number ) {
		BroadcastData.data[BroadcastData.index] = val;
		BroadcastData.index++;
	}
	
	static addString( str: string, withTermination: boolean = false ) {
		let len = str.length;
		
		for(let i = 0; i < len; i++) {
			BroadcastData.data[BroadcastData.index + i] = str.charCodeAt(i);
		}
		
		BroadcastData.index += len;
		
		if(withTermination) {
			BroadcastData.data[BroadcastData.index] = SocketFlags.TerminationFlag;
			BroadcastData.index++;
		}
	}
	
	static addStringFlag( flag: number, str: string, withTermination: boolean = false ) {
		BroadcastData.data[BroadcastData.index] = flag;
		BroadcastData.index += 1;
		BroadcastData.addString(str, withTermination);
	}
	
	static addPlayerInput( player: Player, pNum: number ) {
		
		// Keys Pressed
		if(player.kpCount > 0) {
			BroadcastData.data[BroadcastData.index + 1] = pNum;
			BroadcastData.data[BroadcastData.index + 2] = player.keysPressed[0];
			
			if(player.kpCount >= 2) {
				BroadcastData.data[BroadcastData.index + 3] = player.keysPressed[1];
				
				if(player.kpCount >= 3) {
					BroadcastData.data[BroadcastData.index + 4] = player.keysPressed[2];
					
					if(player.kpCount >= 4) {
						BroadcastData.data[BroadcastData.index + 5] = player.keysPressed[3];
						
						if(player.kpCount >= 5) {
							BroadcastData.data[BroadcastData.index + 6] = player.keysPressed[4];
							BroadcastData.data[BroadcastData.index] = SocketFlags.InputPressFive;
						}
						else {
							BroadcastData.data[BroadcastData.index] = SocketFlags.InputPressFour;
						}
					}
					else {
						BroadcastData.data[BroadcastData.index] = SocketFlags.InputPressThree;
					}
				} else {
					BroadcastData.data[BroadcastData.index] = SocketFlags.InputPressTwo;
				}
			} else {
				BroadcastData.data[BroadcastData.index] = SocketFlags.InputPress;
			}
			
			BroadcastData.index += player.kpCount + 2;
		}
		
		// Keys Released
		if(player.krCount > 0) {
			BroadcastData.data[BroadcastData.index + 1] = pNum;
			BroadcastData.data[BroadcastData.index + 2] = player.keysReleased[0];
			
			if(player.krCount >= 2) {
				BroadcastData.data[BroadcastData.index + 3] = player.keysReleased[1];
				
				if(player.krCount >= 3) {
					BroadcastData.data[BroadcastData.index + 4] = player.keysReleased[2];
					
					if(player.krCount >= 4) {
						BroadcastData.data[BroadcastData.index + 5] = player.keysReleased[3];
						
						if(player.krCount >= 5) {
							BroadcastData.data[BroadcastData.index + 6] = player.keysReleased[4];
							BroadcastData.data[BroadcastData.index] = SocketFlags.InputReleaseFive;
						}
						else {
							BroadcastData.data[BroadcastData.index] = SocketFlags.InputReleaseFour;
						}
					}
					else {
						BroadcastData.data[BroadcastData.index] = SocketFlags.InputReleaseThree;
					}
				} else {
					BroadcastData.data[BroadcastData.index] = SocketFlags.InputReleaseTwo;
				}
			} else {
				BroadcastData.data[BroadcastData.index] = SocketFlags.InputRelease;
			}
			
			BroadcastData.index += player.krCount + 2;
		}
	}
	
	static addCurrentFrameFlag( curFrame: number ) {
		
		// Prepare a Uint8Array for the current Frame, so that it can be converted to an int.
		let gFrame = new Uint8Array(4);
		// gFrame[0] = 0;
		gFrame[1] = Math.floor(curFrame / 65536);
		gFrame[2] = Math.floor(curFrame / 256);
		gFrame[3] = curFrame % 256;
		
		BroadcastData.data[BroadcastData.index] = SocketFlags.CurrentFrame;
		BroadcastData.data[BroadcastData.index + 1] = gFrame[0];
		BroadcastData.data[BroadcastData.index + 2] = gFrame[1];
		BroadcastData.data[BroadcastData.index + 3] = gFrame[2];
		BroadcastData.data[BroadcastData.index + 4] = gFrame[3];
		
		BroadcastData.index += 5;
	}
}
