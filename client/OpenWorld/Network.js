OW.network = Object.create(IB.network);

///////////////////////////////////////////////

OW.network.server_address = "http://localhost";

///////////////////////////////////////////////

OW.subEngines.push(OW.network);

/////////////////////////////////////////

OW.network.connectToServer = function() {
	this.__proto__.connectToServer.apply(this);
	console.log(this.server);
	this.server.on("connect", function () {
		console.log(this.server);
		this.server.emit("init", {id: OW.player.id, username: OW.player.username, willServe: true});
	});
	this.server.on("init", function (data) {console.log(data);});
};