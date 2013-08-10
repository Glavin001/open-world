OW.player = Object.create(IB.player);

/////////////////////////////////////

OW.gameNoticeList.push(OW.player);

OW.player.pc = {};

OW.player.name = "OpenWorldPlayer";

OW.player.username = null;

////////////////////////////

OW.player.DEFAULT_PC = "pc";

////////////////////////////////////////////

OW.player.initPlayer = function (id, name) {
	this.id = id;
	this.username = name;
};

OW.player.preGameStart = function () {
	this.pc = OW.world.spawn(this.getDefault("DEFAULT_PC"), undefined, undefined, this, {mesh: new THREE.Mesh(new THREE.CubeGeometry(16, 16, 50), new THREE.MeshLambertMaterial({color: 0xCC0000}))});

    this.pc.initPlayerController();
};

OW.player.getDefault = function (def) {
	return OW[this[def]];
};