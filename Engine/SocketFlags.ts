
// Most socket exchanges are sent as byte arrays. To read them, you begin with the first byte, which is a SocketFlag.
// After each SocketFlag, there will be a sequence of bytes that follows based on it's type of instruction.
export const enum SocketFlags {
	
	TerminationFlag = 0,			// Ends an instruction, often one that involves string characters.
	
	// Input
	InputPress = 10,				// Next Sequence: [PlayerId, IKey Pressed]
	InputPressTwo = 11,				// Next Sequence: [PlayerId, IKey Pressed, IKey Pressed]
	InputPressThree = 12,			// Next Sequence: [PlayerId, IKey Pressed, IKey Pressed, IKey Pressed]
	InputPressFour = 13,			// Next Sequence: [PlayerId, IKey Pressed, IKey Pressed, IKey Pressed, IKey Pressed]
	InputPressFive = 14,			// Next Sequence: [PlayerId, IKey Pressed, IKey Pressed, IKey Pressed, IKey Pressed, IKey Pressed]
	
	InputRelease = 15,				// Next Sequence: [PlayerId, IKey Released]
	InputReleaseTwo = 16,			// Next Sequence: [PlayerId, IKey Released, IKey Released]
	InputReleaseThree = 17,			// Next Sequence: [PlayerId, IKey Released, IKey Released, IKey Released]
	InputReleaseFour = 18,			// Next Sequence: [PlayerId, IKey Released, IKey Released, IKey Released, IKey Released]
	InputReleaseFive = 19,			// Next Sequence: [PlayerId, IKey Released, IKey Released, IKey Released, IKey Released, IKey Released]
	
	// Communication
	ChatMessage = 20,				// Next Sequence: [...Message Characters, <TerminationFlag>]
	AdminMessage = 21,				// Next Sequence: [AdminMessageFlag, AdminMessageFlag ExtraVar]
	Emote = 22,						// Next Sequence: [PlayerId, EmoteFlag]
	
	// Room Flags
	PlayerJoined = 30,				// Next Sequence: [PlayerRoomNum, PlayerServerID [0-256]XX, PlayerServerID XXX[0-99], ...Username Characters, <TerminationFlag>]
	LoadWorld = 31,					// Next Sequence: [...WorldId Characters, <TerminationFlag>]
	LoadLevel = 32,					// Next Sequence: [...LevelId Characters, <TerminationFlag>]
	
	// Game Flags
	TimerAddMult5 = 50,				// Next Sequence: [Timer Addition x 5]
	TimerSubtractMult5 = 51,		// Next Sequence: [Timer Subtraction x 5]
	VictoryFlagToTeam = 52,			// Next Sequence: [TeamId, VictoryFlag]
	
	// Player Flags
	AssignToTeam = 60,				// Next Sequence: [PlayerId, TeamId]
	VictoryFlagToPlayer = 61,		// Next Sequence: [PlayerId, VictoryFlag]
	
	// User Connections
	UserDisconnected = 120,			// Next Sequence: [PlayerId]
	
	// Admin Instructions
	DropUser = 200,					// Next Sequence: [PlayerId]
}

// IKey - Input Keys
export const enum IKey {
	Up = 1,
	Down = 2,
	Left = 3,
	Right = 4,
	XButton = 5,
	YButton = 6,
	AButton = 7,
	BButton = 8,
	L1 = 9,
	R1 = 10,
	L2 = 11,
	R2 = 12,
	Select = 13,
	Start = 14,
	AxisLeftPress = 15,
	AxisRightPress = 16,
	Other = 17,
}

export const enum VictoryFlag {
	Loss = 0,
	Victory = 1,
	Tie = 2,
}

// Admin Message Flags have a follow-up sequence:
export const enum AdminMessageFlag {
	
	// Server Restart
	ServerWillRestartInXHours = 1,				// Next Sequence: [Hours]
	ServerWillRestartInXMinutes = 2,			// Next Sequence: [Minutes]
	ServerWillRestartInXSeconds = 3,			// Next Sequence: [Seconds]
}

export const enum EmoteFlag {
	
	// Basic Commands
	Hello = 1,
	Look = 2,
	Come = 3,
	Woot = 4,
	Oops = 5,
	
	// Emotes
	Apologize = 11,
	Applaud = 12,
	Bow = 13,
	Cheer = 14,
	Clap = 15,
	Congrat = 16,
	Cry = 17,
	Dance = 18,
	Doubt = 19,
	Encourage = 20,
	Facepalm = 21,
	Flex = 22,
	Frown = 23,
	Gasp = 24,
	Greet = 25,
	Grin = 26,
	Highfive = 27,
	Hug = 28,
	Laugh = 29,
	Mourn = 30,
	Panic = 31,
	Party = 32,
	Praise = 33,
	Pray = 34,
	Salute = 35,
	Shrug = 36,
	Sigh = 37,
	Smile = 38,
	Surrender = 39,
	Taunt = 40,
	Thank = 41,
	Wave = 42,
	Wink = 43,
}
