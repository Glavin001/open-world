OW.network = Object.create(IB.network);

///////////////////////////////////////////////

OW.network.server_address = "http://localhost";

///////////////////////////////////////////////

OW.subEngines.push(OW.network);

/////////////////////////////////////////

OW.network.connectToServer = function() {
	this.__proto__.connectToServer.apply(this);
	//IB.network.connectToServer.apply(this);
	var self = this;
	console.log(self.server);
	self.server.on("connect", function () {
		console.log(self.server);
		self.server.emit("init", {id: OW.player.id, username: OW.player.username, willServe: true});
	});
	self.server.on("init", function (data) {console.log(data);});
};