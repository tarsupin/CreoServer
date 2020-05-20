/*
	Timer Terms:
		
		Cycle: Means it runs as soon as possible.
		Tick: Means it runs when the next frame has triggered.
		
	Conventions:
		
		update() methods run every cycle, as fast as humanly possible.
		tick() methods run every tick.
		slowTick() methods run every 30 ticks; 2 times per second.
*/

export default class Timer {
	
	readonly frameMs: number;			// The number of ms per frame.
	
	private start!: number;				// The Date.now() when this timer started.
	private last!: number;				// The Date.now() of the last cycle.
	private prevFrameTime!: number;		// The previous timestamp that a frame ticked.
	private nextFrameTime!: number;		// The next timestamp that a frame ticks.
	
	public delta: number;				// ms since the last cycle.
	public frame: number;				// Tracks the current global frame.
	public frameTick: boolean;			// TRUE if this cycle incremented the next frame.
	public slowTick: boolean;			// TRUE on every 30th frame.
	
	constructor() {
		this.frameMs = 1000 / 60;		// 16.6667
		this.reset();
		
		// Initialize
		this.delta = 0;
		this.frame = 0;
		this.frameTick = false;
		this.slowTick = false;
	}
	
	update() {
		const curTime = Date.now();
		
		this.delta = curTime - this.last;
		this.last = curTime;
		
		// If we've triggered the next frame:
		if(curTime > this.nextFrameTime) {
			this.frameTick = true;
			this.frame++;
			this.slowTick = this.frame % 30 === 0;
			this.prevFrameTime = this.nextFrameTime;
			this.nextFrameTime = this.start + (this.frame * this.frameMs);
			
		// If we just exited the last frame:
		} else if(this.frameTick) {
			this.frameTick = false;
			this.slowTick = false;
		}
	}
	
	reset() {
		this.start = Date.now();
		this.frame = 0;
		this.frameTick = false;
		this.prevFrameTime = 0;
		this.nextFrameTime = this.start + this.frameMs;
	}
}
