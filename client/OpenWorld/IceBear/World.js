/*******************************************************
*World keeps track of the whole world and actors in it.*
*******************************************************/

var IB = IB || new Object();

IB.world = IB.world || Object.create(IB.object);

////////////////////////////////////////////////

IB.world.actors = [];

IB.world.scene = {};

IB.world.tick = function () {
	for (target in this.actors) {
		target.callTick();
	}
};

IB.world.spawn = function (template, location, rotation, owner, extras, newName) {
	"use strict";

	if (typeof template === "object") {
		this.actors.push(Object.create(template, (extras || {})));
		var actor = this.actors[this.actors.length - 1];
		if (typeof location === "object") actor.setLocation(location);
		if (typeof rotation === "object") actor.setRotation(rotation);
		if (typeof owner === "object") actor.setOwner(owner);
		if (typeof newName === "string") {
			actor.setName(newName);
		}
		else {
			actor.setName(template.name + "_" + (this.actors.length - 1));
		}
		//do stuff with sceneAdd
		return actor;
	}
};

IB.world.createScene = function() {
	this.scene = new THREE.Scene();
};

IB.world.loadMap = function(caller, callBack) {
	;
};

IB.world.sceneAdd = function (component) {
	this.scene.add(component);
};