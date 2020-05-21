
export const enum GameType {
	Coop = 1,				// Players cooperate to finish. Traditional gameplay.
	Roles = 2,				// Players cooperate, but have different roles, abilities, etc.
	Survival = 3,			// Players cooperate to survive. Swarms or waves come.
	
	Versus = 10,			// Players compete to finish. Traditional gameplay.
	VersusRoles = 11,		// Players compete, but have different roles to play. May be asymmetric.
	Battle = 12,			// Players battle each other. Free for all.
	BattleRoyale = 13,		// Players battle with a scene that slowly collapses to the center.
	
	TeamBattle = 20,		// Players battle each other on teams. Work with allies, defeat enemies.
	BossBattle = 21,		// Boss Battle challenge. One team is a single boss player with major advantage.
	CTF = 22,				// Two teams play capture the flag.
	Football = 23,			// Two teams play soccer against each other. Score goals to win. Time limit.
	
	Playtest = 50,			// Author of level spectates while players play. Earn Playtesting Credits.
	
	// TERRITORY			// World Map where you compete over territories. Persistent Game.
	// GM Modes				// GM plays against players.
	// Tournaments			// Tournament Games
}

// Game Type Groups contain multiple game types. Users can indicate these as preferences for what rooms are created.
export const enum GamePreference {
	Undeclared = 0,
	Coop = 1,				// Coop, Roles, Survival
	Versus = 2,				// Versus, Versus Roles
	Battle = 3,				// Battle, Battle Royale
	Team = 4,				// Team Battle, Boss Battle, CTF, Football
}

export const enum RoomType {
	Standard = 1,		// Standard Room that gets generated automatically.
	Managed = 2,		// A managed room; one that was specifically created by intention. Player-created and managed.
	Persistent = 3,		// A persistent room. One that intends to remain persistent for some time.
}

export const enum PlayerKarma {
	Awful = -4,
	VeryLow = -3,
	Low = -2,
	Reduced = -1,
	None = 0,
	Known = 1,
	High = 2,
	VeryHigh = 3,
	Trusted = 4,
}

export const enum PlayerRank {
	Banned = -10,
	TemporarilyBanned = -5,
	Distrusted = -2,
	Unregistered = 0,
	Guest = 1,
	User = 2,
	PaidUser = 3,
	VIP = 4,
	Moderator = 6,
	Creator = 7,
	Admin = 8,
	Superuser = 10,
}
