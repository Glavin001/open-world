OW.world = Object.create(IB.world);

///////////////////////////////////////////////

OW.world.loadMap = function(caller, callBack) {
	callBack.apply(caller);
};