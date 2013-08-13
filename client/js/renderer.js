//Creats object to store all scene data
var sceneSetup = sceneSetup || new Object();

//Adds the scene to the object
var scene = new THREE.Scene();

//Addes fog to the scene
scene.fog = new THREE.FogExp2(0x9AFFFF, 0.0008);

//Adds the camera to the object
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColorHex(0x1BD3E0, 0.5);
renderer.shadowCameraNear = .2;
renderer.shadowCameraFar = 200;
renderer.shadowCameraFov = 200; //50;
renderer.shadowMapBias = 1;
renderer.shadowMapDarkness = 1;
renderer.shadowMapWidth = 32768; // 1024;
renderer.shadowMapHeight = 32768; //1024;
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;