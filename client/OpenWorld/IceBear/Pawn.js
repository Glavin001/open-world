var IB = IB || new Object();

IB.pawn = IB.pawn || Object.create(IB.actor);

IB.pawn.tick = function (deltaTime) {
	this.__proto__.__proto__.__proto__.tick.apply(this, [deltaTime]);
};