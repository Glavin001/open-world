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

	var newThreePos = new IB.map.LatLonPoint(36.1076068, -115.1797258).fromLatLonToThreePosition();
	var pos = self.pc.pawn.position;
	pos.x = newThreePos.x;
	pos.y= newThreePos.y;
	pos.z = newThreePos.z;


    // Move player to current Geolocation
    IB.map.currentPlayerLatLon( function(latLonPoint) {
		// *latLonPoint* variable is now an instance of LatLatPoint with the values of the Geolocation
		//console.log(latLonPoint);
		//console.log(self.pc);

		//var m = latLonPoint.fromLatLonToMeters();
		//console.log(m);

		/*
		pos.x = m.x;
		pos.y = m.z;
		pos.z = m.y;
		*/
		if (false && latLonPoint) {
			var newPos = latLonPoint.fromLatLonToThreePosition();
			pos.x = newPos.x;
			pos.y= newPos.y;
			pos.z = newPos.z;
		} else {
			// var newThreePos = new IB.map.LatLonPoint(36.1076068, -115.1797258).fromLatLonToThreePosition(); // Las Vegas
			var newThreePos = new IB.map.LatLonPoint(48.57224, 13.45527).fromLatLonToThreePosition();
			//var newPos = new IB.map.LatLonPoint(44.664206,-63.56874299999999).fromLatLonToThreePosition(); // Halifax/Dartmouth
			pos.x = newThreePos.x;
			pos.y= newThreePos.y;
			pos.z = newThreePos.z;
		}

	});
	
};

OW.player.getDefault = function (def) {
	return OW[this[def]];
};