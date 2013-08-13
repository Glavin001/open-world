OW.pc = Object.create(IB.pc);

/////////////////////////////////////////

OW.pc.name = "OpenWorldPlayerController";

OW.pc.mode = null;

OW.pc.camDistance = 10;

OW.pc.camAngle = 35;

OW.pc.rotateDistance = 100;

////////////////////////////

OW.pc.DEFAULT_PAWN = "pawn";

OW.pc.DEFAULT_INPUT = "Input";

OW.pc.START_MODE = "flying";

//////////////////////////////////////////

OW.pc.initPlayerController = function () {
	//WATCH OUT!!!!! OW.pc gets used as the __proto__ for the player controller, so IB.pc is two protos back
	this.__proto__.__proto__.initPlayerController.apply(this);
};

OW.pc.getDefault = function (def) {
	return OW[this[def]];
};

OW.pc.getPawn = function () {
	this.pawn = OW.world.spawn(this.getDefault("DEFAULT_PAWN"), undefined, undefined, this);
	var text3d = new THREE.TextGeometry(this.owner.username, {
		size: 0.5,
		height: 0.1,
		curveSegments: 3,
		font: "helvetiker"
	});
	text3d.computeBoundingBox();

	var textMaterial = new THREE.MeshPhongMaterial({
		color: 0xFFFFFF,
		overdraw: true});
	this.nameTag = new THREE.Mesh(text3d, textMaterial);
	OW.world.sceneAdd(this.nameTag);
};

OW.pc.tick = function (deltaTime) {
	this.__proto__.__proto__.tick.apply(this, [deltaTime]);
	
	this.processControls.apply(this, [deltaTime]);
	
	this.nameTag.position.x = this.pawn.position.x + 0.5 * (this.nameTag.geometry.boundingBox.max.x - this.nameTag.geometry.boundingBox.min.x);
	this.nameTag.position.y = this.pawn.position.y + 3;
	this.nameTag.position.z = this.pawn.position.z - 3;
	this.nameTag.rotation.x = 0;
	this.nameTag.rotation.y = Math.PI;

	OW.hemiLight.position.x = this.pawn.position.x;
	//OW.hemiLight.position.y = this.pawn.position.y;
	OW.hemiLight.position.z = this.pawn.position.z;

};

OW.pc.processControls = function (deltaTime) {
	var middleX = $(window).width() / 2;
	var middleY = $(window).height() / 2;
	
	if (this.input.mousePos.x > middleX + this.rotateDistance) {
		this.pawn.rotation.y += ((this.input.mousePos.x - middleX - this.rotateDistance) / middleX) * deltaTime;
		console.log(((this.input.mousePos.x - middleX - this.rotateDistance) / middleX));
	}
	else if (this.input.mousePos.x < middleX - this.rotateDistance) {
		this.pawn.rotation.y += ((this.input.mousePos.x - middleX + this.rotateDistance) / middleX) * deltaTime;
		console.log(((this.input.mousePos.x - middleX + this.rotateDistance) / middleX));
	}
	
	if (this.input.forward) {
		this.pawn.position.z += ((50 * deltaTime) + (50 * deltaTime * this.input.boost)) * Math.cos(this.pawn.rotation.y);
		this.pawn.position.x += ((50 * deltaTime) + (50 * deltaTime * this.input.boost)) * Math.sin(this.pawn.rotation.y);
	}
	else if (this.input.backward) {
		this.pawn.position.z -= ((50 * deltaTime) + (50 * deltaTime * this.input.boost)) * Math.cos(this.pawn.rotation.y);
		this.pawn.position.x -= ((50 * deltaTime) + (50 * deltaTime * this.input.boost)) * Math.sin(this.pawn.rotation.y);
	}
	
	if (this.input.lstrafe) {
		this.pawn.position.z += ((50 * deltaTime) + (50 * deltaTime * this.input.boost)) * Math.cos(this.pawn.rotation.y + Math.PI / 2);
		this.pawn.position.x += ((50 * deltaTime) + (50 * deltaTime * this.input.boost)) * Math.sin(this.pawn.rotation.y + Math.PI / 2);
	}
	else if (this.input.rstrafe) {
		this.pawn.position.z -= ((50 * deltaTime) + (50 * deltaTime * this.input.boost)) * Math.cos(this.pawn.rotation.y + Math.PI / 2);
		this.pawn.position.x -= ((50 * deltaTime) + (50 * deltaTime * this.input.boost)) * Math.sin(this.pawn.rotation.y + Math.PI / 2);
	}
	
	this.camera.position.y = this.pawn.position.y + (this.camDistance * Math.sin(this.camAngle*Math.PI/180));
	
	this.camera.position.z = this.pawn.position.z - (this.camDistance * Math.cos(this.camAngle*Math.PI/180));
	
	this.camera.position.x = this.pawn.position.x;
	
	this.camera.lookAt(this.pawn.position);
};

OW.pc.getCam = function (cam) {
	if (typeof cam === "object") {
		//possess cam
	}
	else {
		this.camera = OW.requestPerspectiveCamera();
	}
};