
// Lobby To Player
export const enum LobbyInstructions {
	
	// Server-Player Instructions
	roomInfo = 1,			// IP, Port
}

// Lobby To Room
export const enum LobbyToRoomInstructions {
	createRoom = 10,		// Room ID, Game Type, Player Count, [Player IDs, ...], Team #1 Count [Player IDs, ...]
}

// Player To Lobby
export const enum ToLobbyInstructions {
	disconnect = 0,			// Player wants to disconnect.
	setSetting = 1,			// Setting Type (alias, group, rival, etc), Setting Value
}

// Player To Room
export const enum ToRoomInstructions {
	
	// Input
	iKeyOn0 = 1,			// All are iKey OFF
	iKeyOn1 = 2,			// #1 is iKey ON, all remaining are iKey OFF
	iKeyOn2 = 3,			// #1 and #2 are iKey ON, all remaining are iKey OFF
	iKeyOnX = 4,			// iKey Count, [iKeys On, ...until count], [iKeys Off, ...]
	
	// Player Communication
	chatMessage = 20,		// #1 is message; [1, "Hello"]
	emote = 21,				// #1
}

// Room To Player
export const enum RoomInstructions {
	
	// Input Relay (from Server)
	// All Input Relay starts with Frame #
	inputAll = 1,			// # Players, [Player IDs, ...], [::Player] iKeyOn Count, [iKeyOn, ...], [iKeyOff, ...], DELIMETER (goto ::Player)
	inputP1On = 2,			// "1 Player, iKeyOn" : Player ID, iKeyOn Count, [iKeyOn, iKeyOn, ...until count], [iKeyOff, ...]
	inputP1On0 = 3,			// "1 Player, iKeyOn0" : Player ID, [iKey Off, iKeyOff, ...]
	inputP1On1 = 4,			// "1 Player, iKeyOn1" : Player ID, iKey On, [iKey Off, iKeyOff, ...]
	inputP1On2 = 5,			// "1 Player, iKeyOn2" : Player ID, iKey On, iKey On, [iKey Off, iKeyOff, ...]
	
	// 16x16 Chunks / Maps
	// All Chunks start with Chunk X, Chunk Y
	chunkAll = 10,			// 256 Entries of Tile State (ordered from 0,0 to 15,15)
	chunkRow = 11,			// Row ID (0 to 15), 16 Entries of Tile State
	chunkTiles = 12,		// Tile ID, Tile State, ... (repeated)
	
	// Objects
	
	// Message
	message = 30,			// Message (all players will receive)
	
	// Game Instructions
	gameStart = 40,			// Time Now, Time Start
	
	// Single-Flag Commands
	sendFlag = 50,			// Sends a Flag Instruction (See `RoomFlags`)
}

export const enum RoomFlags {
	gameStarted = 1,		// Indicates the game has started, likely accompanied by frame inputs.
	gameEnd = 2,			// Ends the game. Players will see victory screen, etc.
	kickAll = 3,			// Kicks all users from room. Forcible kick, such as for server-ending purposes.
}
