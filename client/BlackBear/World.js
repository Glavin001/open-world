/*******************************************************
*World keeps track of the whole world and actors in it.*
*******************************************************/

var BLACKBEAR = BLACKBEAR || new Object();

BLACKBEAR.world = BLACKBEAR.world || new Object(BLACKBEAR.object);

//////////////////////////////////////////////////////////////////

BLACKBEAR.world.actors;

BLACKBEAR.world.tick = function() {
	for (target in actors) {
		target.callTick();
	}
};

BLACKBEAR.world.spawn = function(templateObject,location,rotation,owner) {
	if (typeof class === "object") {
		var actor = template;
		actor.setLocation(location);
		actor.setRotation(rotation);
		actor.setOwner(owner);
		actors[actors.length] = actor;
		return actor;
	}
};