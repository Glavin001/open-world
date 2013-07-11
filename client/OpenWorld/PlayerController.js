OW.pc = Object.create(IB.pc);

//////////////////////////////////////////

OW.pc.initPlayerController = function () {
	this.camera = OW.requestPerspectiveCamera();
	
	this.input = IB.util.newNew(OW.Input);

	this.camera.position.z = 300;
};