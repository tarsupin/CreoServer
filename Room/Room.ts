import PlayerLobby from "../Lobby/PlayerLobby.ts";

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
	
	// Players
	players: { [pid: number]: PlayerLobby; }
	
	constructor( roomId: number ) {
		this.players = {};
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
