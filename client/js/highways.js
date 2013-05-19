onmessage = function(e) {
  var highways = JSON.parse(e.data.highways);
	var minlon = e.data.minlon;
	var minlat = e.data.minlat;
	var MAX_SCALE = e.data.MAX_SCALE;
	
	postMessage({'type': 'log_obj', 'post': JSON.stringify(highways)});

	for (var key in highways) {
		if (highways.hasOwnProperty(key)) {
			var way = highways[key];
			
			// Draw highway blacktop
			var startPoint = true;
			var prevLon = 0;
			var prevLat = 0;
			var elevation = 0.3;
			var roadWidth = 10;
			
			var startPoint = true;
			for(var c = 0, length = way.geometry.coordinates.length; c < length; c++) {
				//Gets lat and lon from array
				if(isNaN(way.geometry.coordinates[0]))
				{
					var lon = way.geometry.coordinates[c][0];
					var lat = way.geometry.coordinates[c][1];
				} else {
					var lon = way.geometry.coordinates[0];
					var lat = way.geometry.coordinates[1];
				}
				
				postMessage({'type': 'log_txt', 'post': lat + " " + lon});
				
				// Scale lat and lon
				if (lon < minlon)
					postMessage({'type': 'log_txt',
						'post': "Out of Bounds lon: " + " " + lon + " " + minlon});
				if (lat < minlat)
					postMessage({'type': 'log_txt',
						'post': "Out of Bounds lat: " + " " + lat + " " + minlat});
					
				lon = (lon - minlon) * MAX_SCALE;
				lat = (lat - minlat) * MAX_SCALE;
				
				if (startPoint)
				{
					startPoint = false;
					prevLon = lon;
					prevLat = lat;
				}
				else
				{
					postMessage({'type': 'render_road', 'prevLon': prevLon, 'prevLat': prevLat,
						'elevation': elevation, 'roadWidth': roadWidth, 'lat': lat, 'lon': lon});
					prevLon = lon;
					prevLat = lat;
				}
			}
			
			var theText = 'Unknown Street';
			theText = (way.properties.name) ? way.properties.name : theText;
			
			postMessage({'type': 'log_txt', 'post': theText});
				
			var color = Math.random() * 0xffffff;
			
			postMessage({'type': 'render_sign', 'prevLat': prevLat, 'prevLon': prevLon,
				'elevation': elevation, 'theText': theText, 'color': color});
		}
	}
	
	close();
	
}
