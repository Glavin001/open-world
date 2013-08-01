OW.world = Object.create(IB.world);

///////////////////////////////////

OW.gameNoticeList.push(OW.world);

OW.world.name = "OpenWorldWorld";

OW.world.loadMap = function(caller, callBack) {
	callBack.apply(caller);
};