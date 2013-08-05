OW.world = Object.create(IB.world);

///////////////////////////////////

OW.gameNoticeList.push(OW.world);

/////////////////////////////////

OW.world.name = "OpenWorldWorld";

OW.world.map = {};

///////////////////////////////////////////////

OW.world.loadMap = function(caller, callBack) {
	this.map = Object.create(OW.game.getDefault("DEFAULT_MAP"));
	
	this.actors.push(this.map);
	
	this.map.startLoad(this, {caller: caller, callBack: callBack});
};

OW.world.finishLoadMap = function (info) {
	info.callBack.apply(info.caller);
};