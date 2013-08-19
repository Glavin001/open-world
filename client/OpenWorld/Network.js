OW.network = Object.create(IB.network);

///////////////////////////////////////////////

OW.network.server_address = "http://localhost";

///////////////////////////////////////////////

OW.subEngines.push(OW.network);

/////////////////////////////////////////

OW.network.connectToServer = function() {
	var self = this;
	self.__proto__.connectToServer.apply(self);

	self.server.on("connect", function () {
		OW.network.server.emit("init", {id: OW.player.id, username: OW.player.username, willServe: true});
	});
	
	self.server.on("init", function (data) {console.log(data);});

	// Connect to PeerJS, have server assign an ID instead of providing one
    var peer = new Peer({key: 'lwjd5qra8257b9', debug: true});
	//var peer = new Peer({host:'localhost', port:9000, debug: true});

	// Show this peer's ID.
	peer.on('open', function(id){
	  	console.log('Peer Connection Id:', id);
		self.server.emit('publishPeer', id);

		self.peer = peer;
	});

	// Handle connection to new peer
	var connectToPeer = function(newPeerId) {
		var c = peer.connect(newPeerId);
		addPeerConnection(c);
	};
	var addPeerConnection = function(c) {
		var pc = OW.world.spawn(OW.pc.getDefault("DEFAULT_PAWN"), undefined, undefined, OW.player, {mesh: new THREE.Mesh(new THREE.CubeGeometry(16, 16, 50), new THREE.MeshLambertMaterial({color: 0xCC0000}))});
		console.log(pc);
		var pos = pc.position;

		c.on('open', function(e) {
			console.log('Connected to ', e);
		});
		c.on('data', function(data) {
			//console.log('Data:', data);
			if (data.position) {
				pos.x = data.position.x;
				pos.y = data.position.y;
				pos.z = data.position.z;
			}
		});
	};

	// Await connections from others
	peer.on('connection', function(conn) {
		console.log(conn);
		// Connect back
		addPeerConnection(conn);
		
		// Notification
		var options = {
		    title: "Peer Connected",
		    html: "Connected to new Peer "+conn.peer+".",
		    id: "ConnectedToPeer-"+conn.peer+"", // optional, a unique identifier for this notification
		    delay: 3000 // optional (default to 3000), number of milliseconds until notification auto-closes. If set to 0, the notification persists until manually closed
		};
		Clay.UI.createNotification( options );

	});

	self.server.on('publishedPeer', function(newPeerId) {
		connectToPeer(newPeerId);
	});


};