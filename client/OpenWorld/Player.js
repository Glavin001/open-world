OW.player = Object.create(IB.player);

/////////////////////////////////////

OW.gameNoticeList.push(OW.player);

OW.player.pc = {};

OW.player.name = "OpenWorldPlayer";

OW.player.username = null;

////////////////////////////

OW.player.DEFAULT_PC = "pc";

////////////////////////////////////////////

OW.player.initPlayer = function (clayPlayer) {
	this.clayPlayer = clayPlayer;
	this.id = clayPlayer.identifier;
	this.username = clayPlayer.data.username;
};

OW.player.preGameStart = function () {
	var self = this;
	self.pc = OW.world.spawn(this.getDefault("DEFAULT_PC"), undefined, undefined, this, {mesh: new THREE.Mesh(new THREE.CubeGeometry(16, 16, 50), new THREE.MeshLambertMaterial({color: 0xCC0000}))});

    self.pc.initPlayerController();

	/*
    // Move player to current Geolocation
    IB.map.currentPlayerLatLon( function(lonLatPoint) {
		// *lonLatPoint* variable is now an instance of LonLatPoint with the values of the Geolocation
		console.log(lonLatPoint);
		console.log(self.pc);

		var m = lonLatPoint.fromLatLonToMeters();
		console.log(m);

		var pos = self.pc.pawn.position;
		pos.x = m.x;
		pos.y = m.z;
		pos.z = m.y;

	});
	*/
};

OW.player.getDefault = function (def) {
	return OW[this[def]];
};