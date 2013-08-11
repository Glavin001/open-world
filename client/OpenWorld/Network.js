OW.network = Object.create(IB.network);

///////////////////////////////////////////////

OW.network.server_address = "http://localhost";

///////////////////////////////////////////////

OW.subEngines.push(OW.network);

/////////////////////////////////////////

OW.network.connectToServer = function() {
	this.__proto__.connectToServer.apply(this);

	this.server.on("connect", function () {
		OW.network.server.emit("init", {id: OW.player.id, username: OW.player.username, willServe: true});
	});
	
	this.server.on("init", function (data) {console.log(data);});
};