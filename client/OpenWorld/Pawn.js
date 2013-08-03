OW.pawn = Object.create(IB.pawn);

OW.pawn.name = "OpenWorldPawn";

OW.pawn.components = [new THREE.Mesh(new THREE.CubeGeometry(2, 2, 6), new THREE.MeshLambertMaterial({color: 0xCC0000}))];

OW.pawn.MAX_SPEED = 50;

OW.pawn.MAX_SPEED_SQ = 2500;

OW.pawn.tick = function (deltaTime) {
	var i;
	
	this.__proto__.__proto__.tick.apply(this, [deltaTime]);
	
	for (i = 0; i < this.components.length; i++) {
		this.components[i].position = this.position; // + offset; also check to see if its set to follow
	}
};