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

	//  
	self.broadcast = function(data) {
		if (OW.network.peer) {
			var p = OW.network.peer;
			for (var c in p.connections) { 
				var conns = p.connections[c];
				var labels = Object.keys(conns);
		      	for (var i = 0, ii = labels.length; i < ii; i += 1) {
		        	var conn = conns[labels[i]];
		        	if (conn.open)
		        		conn.send(data);
		      	}	      	
			}
		}
	};

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
			self.broadcast( { type:'clay', 'name': OW.player.clayPlayer.data.name, 'username': OW.player.clayPlayer.data.username })
		});
		c.on('data', function(data) {
			//console.log('Data:', data);
			switch (data.type) {
				case 'pos': {
					if (data.position) {
						var p = new IB.map.LatLonPoint(data.position.latitude, data.position.longitude, data.position.altitude);
						var m = p.fromLatLonToThreePosition();
						//console.log(p);
						pos.x = m.x;
						pos.y = m.y;
						pos.z = m.z;
					}
				}
				break;
				case 'clay': {
					console.log('Clay:', data);
			
					// Notification
					var options = {
					    title: "Peer Connected",
					    html: "Connected to "+data.username+" ("+data.name+").",
					    id: "ConnectedToPeer-"+data.username+"", // optional, a unique identifier for this notification
					    delay: 3000 // optional (default to 3000), number of milliseconds until notification auto-closes. If set to 0, the notification persists until manually closed
					};
					Clay.UI.createNotification( options );

				}
				break;
				default: {
					//console.log('Default:', data);
				}
				break;
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