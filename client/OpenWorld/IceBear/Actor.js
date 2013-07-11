/************************************************
*Root class for all classes visible in the scene*
*TODO: Everything********************************
************************************************/

var IB = IB || new Object();

IB.actor = IB.actor || Object.create(IB.object);

//////////////////////////////////////////////////////////////////

IB.actor.lastTick = null;

IB.actor.deltaTime = null;

IB.actor.location = THREE.Vector3();

IB.actor.rotation = null;

IB.actor.velocity = null;

IB.actor.acceleration = null;

////////////////////////////////////////////

IB.actor.tick = function(deltaTime) {
	
};

IB.actor.callTick = function() {
	var currentTick = this.date.getTime();
	
	this.deltaTime = currentTick - this.lastTick;
	
	this.lastTick = currentTick;
	
	this.tick(deltaTime);
};

IB.actor.setLocation = function(newLocation) {
	
};

IB.actor.setRotation = function(newRotation) {
	
};

IB.actor.gameStart = function() {
	//called to all objects when game starts
};

IB.actor.construct = function() {
	//register for messages etc.
};