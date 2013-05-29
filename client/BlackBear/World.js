/*******************************************************
*World keeps track of the whole world and actors in it.*
*******************************************************/

var BLACKBEAR = BLACKBEAR || new Object();

BLACKBEAR.world = BLACKBEAR.world || new Object(BLACKBEAR.object);

//////////////////////////////////////////////////////////////////

BLACKBEAR.world.actors;

BLACKBEAR.world.tick = function() {
	for (target in this.actors) {
		target.callTick();
	}
};

BLACKBEAR.world.spawn = function(template,location,rotation,owner) {
	if (typeof template === "object") {
		var actor = template;
		actor.setLocation(location);
		actor.setRotation(rotation);
		actor.setOwner(owner);
		this.actors[actors.length] = actor;
		return actor;
	}
};