/************************************************
*Root class for all classes visible in the scene*
*TODO: Everything********************************
************************************************/

var BLACKBEAR = BLACKBEAR || new Object();

BLACKBEAR.actor = BLACKBEAR.actor || new Object(BLACKBEAR.object);

//////////////////////////////////////////////////////////////////

BLACKBEAR.actor.lastTick;

BLACKBEAR.actor.deltaTime;

BLACKBEAR.actor.location;

BLACKBEAR.actor.rotation;

BLACKBEAR.actor.velocity;

BLACKBEAR.actor.acceleration;

BLACKBEAR.actor.owner;

//////////////////////

BLACKBEAR.actor.tick = function(deltaTime) {
	
};

BLACKBEAR.actor.callTick = function() {
	var currentTick = this.date.getTime();
	
	this.deltaTime = currentTick - this.lastTick;
	
	this.lastTick = currentTick;
	
	this.tick(deltaTime);
};

BLACKBEAR.actor.setLocation = function(newLocation) {
	
};

BLACKBEAR.actor.setRotation = function(newRotation) {
	
};

BLACKBEAR.actor.setOwner = function(newOwner) {
	
};