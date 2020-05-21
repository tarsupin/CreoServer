import Player from "../Player/Player.ts";

/*
	Players join into Rooms to play a Game.
	Each Room has a GameType associated with it.
	
	// Player Interaction
	Rooms can track 'Player Interaction' for some Game Types.
		- "Standard" allows standard interaction with other Players.
		- "Ghost" prevents other allies from interacting with Player. (No effect on opponents)
		- "GhostExclusive" assigns the next ally touched to be interactive; none others.
*/

export default class Room {
    
    // Core Details
    roomId: number = 0;
    isEnabled: boolean = false;         // TRUE if room is enabled. FALSE if disabled (can be overwritten).
    
    // Players
	players: Array<Player>;
	
	constructor( roomId: number ) {
        
        // Initialize Room Details
        this.isEnabled = true;
        this.roomId = roomId;
        
        // TODO: Change number of players based on room rules.
		this.players = new Array<Player>(8);
	}
	
	// TODO: Go through purgePlayers, dropPlayers, and AddPlayers. May need to change this.
	// TODO: Go through purgePlayers, dropPlayers, and AddPlayers. May need to change this.
	// TODO: Go through purgePlayers, dropPlayers, and AddPlayers. May need to change this.
	// TODO: Go through purgePlayers, dropPlayers, and AddPlayers. May need to change this.
	// TODO: Go through purgePlayers, dropPlayers, and AddPlayers. May need to change this.
	// TODO: Go through purgePlayers, dropPlayers, and AddPlayers. May need to change this.
	// TODO: Go through purgePlayers, dropPlayers, and AddPlayers. May need to change this.
	// TODO: Go through purgePlayers, dropPlayers, and AddPlayers. May need to change this.
	
}
