OW.pc = Object.create(IB.pc);

//////////////////////////////////////////

OW.pc.initPlayerController = function () {
	this.camera = OW.requestPerspectiveCamera();

	this.camera.position.z = 300;
};