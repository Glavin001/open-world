var http = require('http'),
app = http.createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs'),
staticHeaders = { host: 'localhost',
  connection: 'keep-alive',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.4 (KHTML, like Gecko) Ubuntu/12.10 Chromium/22.0.1229.94 Chrome/22.0.1229.94 Safari/537.4',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-encoding': 'gzip,deflate,sdch',
  'accept-language': 'en-GB,en-US;q=0.8,en;q=0.6',
  'accept-charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3' };

app.listen(80);

function handler (req, res) {
	var url = req.url;
	if (url === "/")
		url = "/index.html";
	else if (url.substr(0, 6) === '/proxy') {
		handleProxy(req, res);
		return;
	}
	var fullPath = __dirname + '/../client' + url;
	fs.stat(fullPath, function (err, stats) {
		if (!err) {
			fs.readFile(fullPath,
  				function (err, data) {
					if (err) {
						res.writeHead(500);
						return res.end('Error loading index.html');
					}

					res.writeHead(200);
					res.end(data);
  				}
			);
		} else {
			res.writeHead(404);
			return res.end('Error loading ' + fullPath + ' - Does not exist on server!');
		}
	}); 
}

function handleProxy(request, response) {
	//  http://api.openstreetmap.org/api/0.6/map
	console.log("PROXY REQ: " + request.method);
	console.dir(request.headers);
	var proxy = http.createClient(80, 'api.openstreetmap.org')
	var proxy_request = proxy.request(request.method, '/api/0.6/map' + request.url.substr(6), request.headers);
	  proxy_request.addListener('response', function (proxy_response) {
		proxy_response.addListener('data', function(chunk) {
		  response.write(chunk, 'binary');
		});
		proxy_response.addListener('end', function() {
		  response.end();
		});
		response.writeHead(proxy_response.statusCode, proxy_response.headers);
	  });
	  request.addListener('data', function(chunk) {
		proxy_request.write(chunk, 'binary');
	  });
	  request.addListener('end', function() {
		proxy_request.end();
	  });
}

function fetchMapData(query, callback) {
	console.log("URL /api/0.6/map?" + query);
	var client = http.createClient(80, 'api.openstreetmap.org'),
		req = client.request('GET', '/api/0.6/map?' + query, staticHeaders),
		data = '',
		calledBack = false;

	req.addListener('response', function (res) {
		res.addListener('data', function(chunk) {
	    	data += chunk;
		});
		res.addListener('end', function() {
			if (!calledBack)
	    		callback(null, data);
			calledBack = true;
		});
		res.addListener('error', function(error) {
			if (!calledBack)
	    		callback(error, data);
			calledBack = true;
		});
    });
	req.end();
}


var players = 0,
	playerSockets = {};


function genInitData(playerId) {
	var tPlayerData = {
			you : {
				playerId: playerId,
				playerName: playerSockets[playerId].playerName,
				lastKnownLocation: playerSockets[playerId].lastKnownLocation
			},
			otherPlayers : {}
		};
	for (var pid in playerSockets) {
		if (pid !== playerId) {
			tPlayerData.otherPlayers[pid] = {
				playerName: playerSockets[pid].playerName,
				lastKnownLocation: playerSockets[pid].lastKnownLocation
			}
		}
	}
	return tPlayerData;
}

io.sockets.on('connection', function (socket) {
  	
	// Create a player object for this socket
	// TODO: Re-Link old players
	var playerId = "Player " + (++players);
	playerSockets[playerId] = {
		playerName: playerId, // Player name is the id by default
		socket: socket,
		lastKnownLocation: {
			latitude: 44.644193,
			longitude: -63.572541
		}
	};
	socket.playerId = playerId;

	// Send the player data of themselves and others
	socket.emit('init', genInitData(playerId));

	socket.on('setName', function(data) {
		// Update the player's name
		playerSockets[socket.playerId].playerName = data.playerName;
		// Send it out to everyone
		socket.broadcast.emit('setName', {
			playerName: data.playerName,
			playerId: socket.playerId
		});
	});

	socket.on('update', function(data) {
		// Tell everyone else this player's new location
		socket.broadcast.emit('update', {
			playerId: socket.playerId,
			location: data.location
		});
	});
	


/// BREAKS THE SOCKET
	socket.on('query', function (data) {
    	console.log(data);
		fetchMapData(data.query, function(error, data) {
			socket.emit('query_data', { error: error, data: data });
		});
	});

});
