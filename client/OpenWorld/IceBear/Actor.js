/************************************************
*Root class for all classes visible in the scene*
*TODO: Everything********************************
************************************************/

var IB = IB || new Object();

IB.actor = IB.actor || Object.create(IB.object);

////////////////////////////////////////////////

IB.actor.lastTick = 0;

IB.actor.deltaTime = 0;

IB.actor.position = new THREE.Vector3();

IB.actor.lastPosition = new THREE.Vector3();

IB.actor.rotation = new THREE.Vector3();

IB.actor.lastRotation = new THREE.Vector3();

IB.actor.velocity = new THREE.Vector3();

IB.actor.lastVelocity = new THREE.Vector3();

IB.actor.acceleration = new THREE.Vector3();

IB.actor.components = [];

//////////////////////////////////////

IB.actor.tick = function (deltaTime) {
	var i;
	
	var deltaDistance = new THREE.Vector3().distanceToSquared(new THREE.Vector3(this.getX() - this.lastPosition.getX(), this.getY() - this.lastPosition.getY(), this.getZ() - this.lastPosition.getZ()));
	
	var deltaRotation = new THREE.Vector3().distanceToSquared(new THREE.Vector3(this.getRotX() - this.lastRotation.getX(), this.getRotY() - this.lastRotation.getY(), this.getRotZ() - this.lastRotation.getZ()));
	
	var deltaPosition = new THREE.Vector3(this.getX() - this.lastPosition.getx(), this.getY() - this.lastPosition.getY(), this.getZ() - this.lastPosition.getZ());
	
	//needs to be tied in with physics
	
	//if deltaDistance > max speed sq, position = last position + deltaPosition.setLength(max speed)
	
	if (deltaDistance) {
		if (this.components.length) {
			for (i = 0; i < this.components.length; i++) {
				this.components[i].position = this.position;
			}
		}
	}
	
	if (deltaRotation) {
		if (this.components.length) {
			for (i = 0; i < this.components.length; i++) {
				this.components[i].rotation = this.rotation;
			}
		}
	}
	
	this.lastPosition = this.position;
	this.lastRotation = this.rotation;
};

IB.actor.callTick = function () {
	var currentTick = new Date().getTime();
	
	this.deltaTime = (currentTick - this.lastTick) / 1000;
	
	this.lastTick = currentTick;
	
	this.tick(this.deltaTime);
};

IB.actor.setPosition = function (newPosition) {
	var i;
	
	if (typeof newPosition === "object") {
		this.position = newPosition;
		if (this.components.length) {
			for (i = 0; i < this.components.length; i++) {
				if (!this.components[i].hasOffset) {
					this.components[i].setPosition(newPosition);
				}
				else {
					this.components[i].setPosition(newPosition.addSelf(this.components[i].positionOffset));
				}
			}
		}
	}
};

IB.actor.setPos = function (newPosition) {
	var i;
	
	if (typeof newPosition === "object") {
		this.position = newPosition;
		if (this.components.length) {
			for (i = 0; i < this.components.length; i++) {
				if (!this.components[i].hasOffset) {
					this.components[i].setPos(newPosition);
				}
				else {
					this.components[i].setPos(newPosition.addSelf(this.components[i].positionOffset));
				}
			}
		}
	}
};

IB.actor.setRotation = function (newRotation) {
	var i;
	
	if (typeof newRotation === "object") {
		this.rotation = newRotation;
		if (this.components.length) {
			for (i = 0; i < this.components.length; i++) {
				if (!this.components[i].hasRotOffset) {
					this.components[i].setRot(newRotation);
				}
				else {
					this.components[i].setRot(newRotation.addSelf(this.components[i].rotationOffset));
				}
			}
		}
	}
};

IB.actor.setRot = function (newRotation) {
	var i;
	
	if (typeof newRotation === "object") {
		this.rotation = newRotation;
		if (this.components.length) {
			for (i = 0; i < this.components.length; i++) {
				if (!this.components[i].hasRotOffset) {
					this.components[i].setRot(newRotation);
				}
				else {
					this.components[i].setRot(newRotation.addSelf(this.components[i].rotationOffset));
				}
			}
		}
	}
};

IB.actor.setX = function (newX) {
	var i;
	this.position.setX(newX);
	if (this.components.length) {
		for (i = 0; i < this.components.length; i++) {
			if (!this.components[i].hasOffset) {
				this.components[i].setX(newX);
			}
			else {
				this.components[i].setX(newX + this.components[i].positionOffset.getX());
			}
		}
	}
};

IB.actor.setY = function (newY) {
	var i;
	this.position.setY(newY);
	if (this.components.length) {
		for (i = 0; i < this.components.length; i++) {
			if (!this.components[i].hasOffset) {
				this.components[i].setY(newY);
			}
			else {
				this.components[i].setY(newY + this.components[i].positionOffset.getY());
			}
		}
	}
};

IB.actor.setZ = function (newZ) {
	var i;
	this.position.setZ(newZ);
	if (this.components.length) {
		for (i = 0; i < this.components.length; i++) {
			if (!this.components[i].hasOffset) {
				this.components[i].setZ(newZ);
			}
			else {
				this.components[i].setZ(newZ + this.components[i].positionOffset.getZ());
			}
		}
	}
};

IB.actor.getX = function () {
	return this.position.getX();
};

IB.actor.getY = function () {
	return this.position.getY();
};

IB.actor.getZ = function () {
	return this.position.getZ();
};

IB.actor.getRotX = function () {
	return this.rotation.getX();
};

IB.actor.getRotY = function () {
	return this.rotation.getY();
};

IB.actor.getRotZ = function () {
	return this.rotation.getZ();
};

IB.actor.gameStart = function () {
	//called to all objects when game starts
};

//Object.freeze(IB.actor);

//Object.seal(IB.actor);