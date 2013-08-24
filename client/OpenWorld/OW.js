var OW = Object.create(IB.engine);

//////////////////////////////////

OW.FOV = 75;

OW.NEAR = 0.01;

OW.FAR = 1000;

/////////////////////////////////////////////////////////////////////////////

OW.customStartupFunctions0.push(function () {OW.network.connectToServer();});

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
	//this.world.sceneAdd(circle);

	
	// Hemisphere Light
	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	this.hemiLight = hemiLight;
	this.world.sceneAdd( hemiLight );
	
	this.world.sceneAdd(new THREE.AmbientLight(0x555555));
	
	// Set Threejs Renderer background colour
	this.renderer.setClearColorHex( 0x000000, 1 ); // Default is black

	OW.daQuat = function (a, b, c, d) {circle.quaternion.x = a; circle.quaternion.y = b; circle.quaternion.z = c; circle.quaternion.w = d; console.log("quat called");};
	OW.daRot = function (a, b, c) {circle.rotation.x = a;circle.rotation.y = b;circle.rotation.z = c;console.log("rot called");};
	OW.temRot = new THREE.Quaternion(-1,1,1,1);
	
	/*$.ajax({ url: "", method: "GET", dataType: "text"}).done(function(mapData) {
        console.log("Done: Have Map Data");
        console.dir(mapData);
	});*/

    // Handle window resize
    console.log('Setup');
    var onWindowResize = function() {
	    var camera = OW.player.pc.camera, renderer = OW.renderer;
	    //console.log(camera,renderer);
	    camera.aspect = window.innerWidth / window.innerHeight;
	    camera.updateProjectionMatrix();
	    renderer.setSize( window.innerWidth, window.innerHeight );
	};
    window.addEventListener('resize', onWindowResize, false);
	
});

OW.tickLoop = function () {
    IB.engine.stats.begin();

	requestAnimFrame(OW.tickLoop);
	OW.world.tick();
	OW.renderer.render(OW.world.scene, OW.player.pc.camera);

    IB.engine.stats.end();

};