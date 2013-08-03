/************************************************
*Root class for all classes visible in the scene*
*TODO: Everything********************************
************************************************/

var IB = IB || new Object();

IB.actor = IB.actor || Object.create(IB.object);

////////////////////////////////////////////////

IB.actor.lastTick = 0;

IB.actor.deltaTime = 0;

IB.actor.position = THREE.Vector3();

IB.actor.rotation = THREE.Vector3();

IB.actor.velocity = null;

IB.actor.acceleration = null;

IB.actor.components = [];

/////////////////////////////////////

IB.actor.tick = function(deltaTime) {
	
};

IB.actor.callTick = function() {
	var currentTick = new Date().getTime();
	
	this.deltaTime = (currentTick - this.lastTick) / 1000;
	
	this.lastTick = currentTick;
	
	this.tick(this.deltaTime);
};

IB.actor.setPosition = function(newPosition) {
	if (typeof newPosition === "object") {
		this.position = newPosition;
	}
};

IB.actor.setRotation = function(newRotation) {
	if (typeof newRotation === "object") {
		this.rotation = newRotation;
	}
};

IB.actor.gameStart = function() {
	//called to all objects when game starts
};

//Object.freeze(IB.actor);

//Object.seal(IB.actor);