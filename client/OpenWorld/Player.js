OW.player = Object.create(IB.player);

/////////////////////////////////////

OW.gameNoticeList.push(OW.player);

OW.player.pc = {};

OW.player.DEFAULT_PC = OW.pc;

//////////////////////////////////////

OW.player.preGameStart = function () {
	this.pc = OW.world.spawn(this.DEFAULT_PC, null, null, this);

    this.pc.initPlayerController();
};