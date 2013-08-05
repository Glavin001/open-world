OW.overpassMap = Object.create(IB.map);

///////////////////////////////////////

OW.overpassMap.startLoad = function (worldRef, info) {
	//...
	
	this.finishInitialLoad(worldRef, info);
};

OW.overpassMap.tick = function (deltaTime) {
	//might want reference OW.player.pc.pawn.position
	//...
};

OW.overpassMap.addMapGeo = function (geometry) {
	this.world.sceneAdd(geometry);
};

OW.overpassMap.addMapChunk = function (overpassData) {
	//...
	
	this.addMapGeo(processedGeometry);
};