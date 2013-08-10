var IB = IB || new Object();

IB.network = IB.network || Object.create(IB.object);

////////////////////////////////////////////////////

IB.network.server = {};

IB.network.server_address = null;

/////////////////////////////////////////

IB.network.connectToServer = function() {
	this.server = io.connect(this.server_address);;
};

IB.network.connectToPeer = function() {
	;
};
