import BattleRoyale from "../Games/BattleRoyale.ts";
import BossBattle from "../Games/BossBattle.ts";
import CaptureTheFlag from "../Games/CaptureTheFlag.ts";
import Circus from "../Games/Circus.ts";
import Deathmatch from "../Games/Deathmatch.ts";
import LevelCoop from "../Games/LevelCoop.ts";
import LevelVersus from "../Games/LevelVersus.ts";
import TeamDeathmatch from "../Games/TeamDeathmatch.ts";
import NinjaBall from "../Games/NinjaBall.ts";
import TowerDefense from "../Games/TowerDefense.ts";

export default abstract class Mapper {
	
	static GameClasses = {
		BattleRoyale: new BattleRoyale(),
		BossBattle: new BossBattle(),
		CaptureTheFlag: new CaptureTheFlag(),
		Circus: new Circus(),
		Deathmatch: new Deathmatch(),
		LevelCoop: new LevelCoop(),
		LevelVersus: new LevelVersus(),
		NinjaBall: new NinjaBall(),
		TeamDeathmatch: new TeamDeathmatch(),
		TowerDefense: new TowerDefense(),
	}
}
