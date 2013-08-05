var IB = IB || new Object();

IB.map = IB.map || Object.create(IB.actor);

///////////////////////////////////////////

IB.map.startLoad = function (worldRef, info) {
	//...
	this.finishInitialLoad(worldRef, info);
};

IB.map.finishInitialLoad = function (worldRef, info) {
	worldRef.finishLoadMap(info);
};

