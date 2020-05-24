import GameClass from "../Engine/GameClass.ts";
import Mapper from "../Engine/Mapper.ts";
import Lobby from "./Lobby.ts";
import { NaturePVP, NatureAllies, NatureLevel, ArenaType } from "../Engine/ArenaTypes.ts";

export default abstract class LobbyFuncGames {
	
	static isGameAllowedWithUserCount( game: GameClass, userCount: number ): boolean {
		
		// Check Min & Max Players
		if(userCount > game.maxPlayersAllowed) { return false; }
		if(userCount < game.minPlayersAllowed) { return false; }
		
		// Check Team Equality
		if(game.teams > 1 && userCount % game.teams != 0) { return false; }
		
		return true;
	}
	
	// Build an array of games allowed on the server.
	static initializeListOfGamesAllowed( rerun: boolean = false ) {
		let gameCount = 0;
		let listOfGames = Array<GameClass>(Object.keys(Mapper.GameClasses).length);
		
		Object.values(Mapper.GameClasses).forEach((gameClass) => {
			if(LobbyFuncGames.isGameAllowedOnServer(gameClass)) {
				listOfGames[gameCount] = gameClass;
				gameCount++;
			}
		});
		
		// If there are no games allowed on this server due to extreme restrictions, eliminiate restrictions and re-run.
		if(gameCount == 0 && rerun == false) {
			Lobby.natureAllies = NatureAllies.Any;
			Lobby.natureLevel = NatureLevel.Any;
			LobbyFuncGames.initializeListOfGamesAllowed(true);
			return;
		}
		
		// Update Games On Server:
		Lobby.gamesAllowed = listOfGames.slice(0, gameCount);
		
		// Determine the minimum & maximum number of players for room generation:
		let minReq = 16;
		let maxAllow = 2;
		
		for(let i = 0; i < Lobby.gamesAllowed.length; i++) {
			let gameClass = Lobby.gamesAllowed[i];
			
			if(gameClass.minPlayersAllowed < minReq) {
				minReq = gameClass.minPlayersAllowed;
				maxAllow = gameClass.maxPlayersAllowed;
			}
		}
		
		Lobby.minPlayersForRoomGen = minReq;
		Lobby.maxPlayersForRoomGen = maxAllow;
	}
	
	static isGameAllowedOnServer( game: GameClass ): boolean {
		
		// PVP Allowance
		if(Lobby.naturePVP == NaturePVP.PVP && game.pvp == false) { return false; }
		if(Lobby.naturePVP == NaturePVP.NoPVP && game.pvp == true) { return false; }
		
		// Allies Allowance
		if(Lobby.natureAllies == NatureAllies.Solo && game.teams != 0) { return false; }
		if(Lobby.natureAllies == NatureAllies.Teams && game.teams == 0) { return false; }
		
		// Level Allowance
		if(Lobby.natureLevel == NatureLevel.Level) {
			if(game.arenaType != ArenaType.Level && game.arenaType != ArenaType.TeamLevel) { return false; }
		}
		
		if(Lobby.natureLevel == NatureLevel.Arena) {
			if(game.arenaType == ArenaType.Level || game.arenaType == ArenaType.TeamLevel) { return false; }
		}
		
		return true;
	}
}
