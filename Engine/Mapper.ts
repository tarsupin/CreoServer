import BattleRoyale from "../Games/BattleRoyale.ts";
import BossBattle from "../Games/BossBattle.ts";
import CaptureTheFlag from "../Games/CaptureTheFlag.ts";
import Deathmatch from "../Games/Deathmatch.ts";
import LevelCoop from "../Games/LevelCoop.ts";
import LevelVersus from "../Games/LevelVersus.ts";
import TeamDeathmatch from "../Games/TeamDeathmatch.ts";
import NinjaBall from "../Games/NinjaBall.ts";
import TowerDefense from "../Games/TowerDefense.ts";
import DarkCircus from "../Games/DarkCircus.ts";
import GhostTown from "../Games/GhostTown.ts";
import LevelRace from "../Games/LevelRace.ts";
import Safari from "../Games/Safari.ts";
import TreasureHunt from "../Games/TreasureHunt.ts";
import Superheroes from "../Games/Superheroes.ts";
import Dodgeball from "../Games/Dodgeball.ts";
import NinjaAcademy from "../Games/NinjaAcademy.ts";

export default abstract class Mapper {
	
	static GameClasses = {
		BattleRoyale: new BattleRoyale(),
		BossBattle: new BossBattle(),
		CaptureTheFlag: new CaptureTheFlag(),
		DarkCircus: new DarkCircus(),
		Deathmatch: new Deathmatch(),
		Dodgeball: new Dodgeball(),
		GhostTown: new GhostTown(),
		LevelCoop: new LevelCoop(),
		LevelRace: new LevelRace(),
		LevelVersus: new LevelVersus(),
		NinjaAcademy: new NinjaAcademy(),
		NinjaBall: new NinjaBall(),
		Safari: new Safari(),
		Superheroes: new Superheroes(),
		TeamDeathmatch: new TeamDeathmatch(),
		TowerDefense: new TowerDefense(),
		TreasureHunt: new TreasureHunt(),
	}
}
