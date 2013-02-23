var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(80);

function handler (req, res) {
	var url = req.url;
	if (url === "/")
		url = "/index.html";
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

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
