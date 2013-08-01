var OW = Object.create(IB.engine);

//////////////////////////////////

OW.FOV = 75;

OW.NEAR = 0.01;

OW.FAR = 1000;

/////////////////////////////////////////////////////////////////////////////////

OW.customStartupFunctions0.push(function () {OW.network.connectToMainServer();});

OW.customStartupFunctions3.push(function () {
	var grassTex = THREE.ImageUtils.loadTexture('img/Grass_1.png');
    grassTex.wrapS = THREE.RepeatWrapping;
    grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.x = 256;
    grassTex.repeat.y = 256;
    var groundMat = new THREE.MeshLambertMaterial({/*color: 0x2133BF*/map:grassTex});
    var groundGeo = new THREE.PlaneGeometry(10000, 10000);
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -50; //-1.9; //lower it 
    ground.rotation.x = -Math.PI / 2; //-90 degrees around the xaxis 
    ////IMPORTANT, draw on both sides 
    ground.doubleSided = true;
    ground.receiveShadow = true;
    this.world.sceneAdd(ground);

	var pointLight = new THREE.PointLight(0xFFFFFF);
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;
	pointLight.intensity = 1;
	this.world.sceneAdd(pointLight);
	var circle = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 6), new THREE.MeshLambertMaterial({color: 0xCC0000}));
	circle.useQuaternion = false;
	OW.daCirc = circle;
	console.log(circle);
	this.world.sceneAdd(circle);
	this.world.sceneAdd(new THREE.AmbientLight(0x555555));
	OW.daQuat = function (a, b, c, d) {circle.quaternion.x = a; circle.quaternion.y = b; circle.quaternion.z = c; circle.quaternion.w = d; console.log("quat called");};
	OW.daRot = function (a, b, c) {circle.rotation.x = a;circle.rotation.y = b;circle.rotation.z = c;console.log("rot called");};
	OW.temRot = new THREE.Quaternion(-1,1,1,1);
});

OW.startTickLoop = function () {
	setInterval(function () {OW.renderer.render(OW.world.scene, OW.player.pc.camera);/*OW.temRot.w = (OW.temRot.w > 1)? OW.temRot.w % 1 + 0.05 : OW.temRot.w + 0.05;OW.temRot.x += 0.1;OW.temRot.z += Math.PI*0.125/2;
	OW.daCirc.quaternion = OW.temRot; OW.daCirc.quaternion.normalize();*/OW.world.tick();}, 10);
};