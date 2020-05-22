/*
	Timer Terms:
		
		Cycle: Means it runs as soon as possible.
		Tick: Means it runs when the next frame has triggered.
		
	Conventions:
		
		update() methods run every cycle, as fast as humanly possible.
		tick() methods run every tick.
		slowTick() methods run every 30 ticks; 2 times per second.
*/

export default abstract class Timer {
	
	static frameMs: number = 1000 / 60;			// The number of ms per frame.
	
	static start: number = Date.now();;				                // The Date.now() when this timer started.
	static last: number = 0;				                        // The Date.now() of the last cycle.
	static prevFrameTime: number = 0;;		                        // The previous timestamp that a frame ticked.
	static nextFrameTime: number = Timer.start + Timer.frameMs;		// The next timestamp that a frame ticks.
	
	static delta: number = 0;				    // ms since the last cycle.
	static frame: number = 0;				    // Tracks the current global frame.
	static frameTick: boolean = false;			// TRUE if this cycle incremented the next frame.
	static slowTick: boolean = false;			// TRUE on every 30th frame.
    static slowerTick: boolean = false;			// TRUE on every 1500th frame.
	
	static update() {
		const curTime = Date.now();
		
		Timer.delta = curTime - Timer.last;
        Timer.last = curTime;
		
		// If we've triggered the next frame:
		if(curTime > Timer.nextFrameTime) {
			Timer.frameTick = true;
			Timer.frame++;
			Timer.prevFrameTime = Timer.nextFrameTime;
            Timer.nextFrameTime = Timer.start + (Timer.frame * Timer.frameMs);
            
            // Identify Slow Ticks
            Timer.slowTick = Timer.frame % 30 === 0;
            if(Timer.slowTick) { Timer.slowerTick = Timer.frame % 1500 === 0; }
			
		// If we just exited the last frame:
		} else if(Timer.frameTick) {
			Timer.frameTick = false;
			Timer.slowTick = false;
			Timer.slowerTick = false;
		}
	}
}
