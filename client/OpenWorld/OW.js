var OW = Object.create(IB.engine);

//////////////////////////////

OW.FOV = 75;

OW.NEAR = 0.01;

OW.FAR = 1000;

/////////////////////////////////////////////////////////////////////////////////

OW.customStartupFunctions0.push(function () {OW.network.connectToMainServer();});

OW.customStartupFunctions3.push(function () {
	var pointLight = new THREE.PointLight(0xFFFFFF);
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;
	this.world.sceneAdd(pointLight);
	this.world.sceneAdd(new THREE.Mesh(new THREE.SphereGeometry(50, 16, 16), new THREE.MeshLambertMaterial({color: 0xCC0000})));
});
