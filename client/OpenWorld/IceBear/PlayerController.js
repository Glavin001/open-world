var IB = IB || {};

IB.pc = IB.pc || Object.create(IB.controller);

//////////////////////////////////////////////

IB.pc.pawn = {};

IB.pc.camera = {};

IB.pc.input = {};

///////////////////////////////////////

IB.pc.name = "IceBearPlayerController";

IB.pc.modeTemplate = {
	start: function (lastMode) {},
	tick: function (deltaTime) {},
	end: function (nextMode) {}
};

IB.pc.walking = Object.create(IB.pc.modeTemplate);

IB.pc.running = Object.create(IB.pc.modeTemplate);

IB.pc.flying = Object.create(IB.pc.modeTemplate);

IB.pc.jumping = Object.create(IB.pc.modeTemplate);

IB.pc.driving = Object.create(IB.pc.modeTemplate);

IB.pc.swimming = Object.create(IB.pc.modeTemplate);

IB.pc.piloting = Object.create(IB.pc.modeTemplate);

IB.pc.modes = ["walking", "running", "flying", "jumping", "driving", "swimming", "piloting"];

IB.pc.mode = null;

////////////////////////////

IB.pc.DEFAULT_PAWN = "pawn";

IB.pc.DEFAULT_INPUT = "input";

IB.pc.START_MODE = "walking";

//////////////////////////////////////////

IB.pc.initPlayerController = function () {
	this.setMode(this.START_MODE);
	
	this.getCam();

	this.input = IB.util.newNew(this.getDefault("DEFAULT_INPUT"));
	this.getPawn();
};

IB.pc.getDefault = function (def) {
	return IB[this[def]];
};

IB.pc.setMode = function (newMode) {
	var oldMode;
	
	if (this.modes.indexOf(newMode) !== -1) {
		if (this.mode) {
			this[mode].end(newMode);
			oldMode = this.mode;
		}
		else {
			oldMode = null;
		}
		this.mode = newMode;
		this[newMode].start(oldMode);
	}
};

IB.pc.getPawn = function () {
};

IB.pc.tick = function (deltaTime) {
	IB.pc.__proto__.tick.apply(this, [deltaTime]);

	this[this.mode].tick(deltaTime);
};

IB.pc.getCam = function (cam) {
	if (typeof cam === "object") {
		//steal camera
	}
	else {
		//get a camera
	}
};