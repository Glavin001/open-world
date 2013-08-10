var IB = IB || {};

IB.player = IB.player || Object.create(IB.object);

//////////////////////////////////////////////////

IB.player.DEFAULT_PC = "pc";

IB.player.id = null;

IB.player.name = "Player";

//////////////////////////////////////

IB.player.preGameStart = function () {
	;
};

IB.player.getDefault = function (def) {
	return IB[this[def]];
};