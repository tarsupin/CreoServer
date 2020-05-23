
// Most socket exchanges are sent as byte arrays. To read them, you begin with the first byte, which is a SocketFlag.
// After each SocketFlag, there will be a sequence of bytes that follows based on it's type of instruction.
export const enum SocketFlags {
	
	TerminationFlag = 0,			// Ends an instruction, often one that involves string characters.
	
	// Basic Flags
	CurrentFrame = 1,				// Next Sequence: [Frame byte[0], Frame byte[1], Frame byte[2], Frame byte[3]]
	WhoAmI = 2,						// Next Sequence: [PlayerNum]
	
	// Input
	InputPress = 10,				// Next Sequence: [PlayerNum, IKey Pressed]
	InputPressTwo = 11,				// Next Sequence: [PlayerNum, IKey Pressed, IKey Pressed]
	InputPressThree = 12,			// Next Sequence: [PlayerNum, IKey Pressed, IKey Pressed, IKey Pressed]
	InputPressFour = 13,			// Next Sequence: [PlayerNum, IKey Pressed, IKey Pressed, IKey Pressed, IKey Pressed]
	InputPressFive = 14,			// Next Sequence: [PlayerNum, IKey Pressed, IKey Pressed, IKey Pressed, IKey Pressed, IKey Pressed]
	
	InputRelease = 15,				// Next Sequence: [PlayerNum, IKey Released]
	InputReleaseTwo = 16,			// Next Sequence: [PlayerNum, IKey Released, IKey Released]
	InputReleaseThree = 17,			// Next Sequence: [PlayerNum, IKey Released, IKey Released, IKey Released]
	InputReleaseFour = 18,			// Next Sequence: [PlayerNum, IKey Released, IKey Released, IKey Released, IKey Released]
	InputReleaseFive = 19,			// Next Sequence: [PlayerNum, IKey Released, IKey Released, IKey Released, IKey Released, IKey Released]
	
	// Essential Game + Room Flags
	GameClass = 20,					// Next Sequence: [GameClassFlag]
	LoadLevel = 21,					// Next Sequence: [...LevelId Characters, <TerminationFlag>]
	TimerAddMult10 = 22,			// Next Sequence: [Timer Addition x 10s]
	TimerSubtractMult10 = 23,		// Next Sequence: [Timer Subtraction x 10s]
	VictoryFlagToTeam = 24,			// Next Sequence: [TeamId, VictoryFlag]
	VictoryFlagToPlayer = 25,		// Next Sequence: [PlayerNum, VictoryFlag]
	
	// Player Assignment Flags
	PlayerJoined = 30,				// Next Sequence: [PlayerNum, ...Username Characters, <TerminationFlag>]
	PlayerIs = 31,					// Next Sequence: [PlayerNum, PlayerIsFlag]
	PlayerTeam = 32,				// Next Sequence: [PlayerNum, TeamId]
	PlayerGameRole = 33,			// Next Sequence: [PlayerNum, Player Game Role]
	
	// Communication
	ChatMessage = 80,				// Next Sequence: [...Message Characters, <TerminationFlag>]
	AdminMessage = 81,				// Next Sequence: [AdminMessageFlag, AdminMessageFlag ExtraVar]
	Emote = 82,						// Next Sequence: [PlayerNum, EmoteFlag]
	
	// User Sockets
	UserConnected = 90,				// Next Sequence: [PlayerNum]
	UserDisconnected = 91,			// Next Sequence: [PlayerNum]
	
	// GAME FLAGS
	// RESERVED. DO NOT USE FLAGS 100 to 200.
	// If a flag of 100 to 200 is used, it means there are special flags for the game class being played.
	
	// Admin Instructions
	DropUser = 210,					// Next Sequence: [PlayerNum]
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

export const enum PlayerIsFlag {
	Player = 0,
	Spectator = 1,
}

export const enum GameClassFlag {
	
	// Cooperative Traditional (Single Team)
	LevelCoop = 1,
	Safari = 2,
	
	// Friendly Traditional (No PVP)
	LevelRace = 11,
	
	// Competitive Traditional
	LevelVersus = 20,
	
	// Cooperative Arena (Single Team)
	TowerDefense = 31,
	
	// Friendly Arena (No PVP)
	TreasureHunt = 40,
	
	// Team Arena
	TeamDeathmatch = 50,
	GhostTown = 51,
	CaptureTheFlag = 52,
	NinjaBall = 53,
	
	// Competitive Arena
	Deathmatch = 60,
	DarkCircus = 61,
	BossBattle = 62,
	BattleRoyale = 63,
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
