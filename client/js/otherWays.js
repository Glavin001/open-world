onmessage = function(e) {
  var otherWays = JSON.parse(e.data.otherWays);
	var minlon = e.data.minlon;
	var minlat = e.data.minlat;
	var MAX_SCALE = e.data.MAX_SCALE;
	
	for (var key in otherWays) {
		if (otherWays.hasOwnProperty(key)) {
			var way = otherWays[key];
		
			// Draw highway blacktop
			var startPoint = true;
			var prevLon = 0;
			var prevLat = 0;
			var elevation = 0;
			var buildingHeight = 10;
			var roadWidth = 1;
		
			for(var c = 0, length = way.geometry.coordinates.length; c < length; c++) {
				//Gets lat and lon from array
				if(isNaN(way.geometry.coordinates[0]))
				{
					var lon = way.geometry.coordinates[0][c][0];
					var lat = way.geometry.coordinates[0][c][1];
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
							'post': "Out of Bounds lon: " + " " + lon + " " + minlon});
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
					postMessage({'type': 'render_misc', 'prevLon': prevLon, 'prevLat': prevLat,
						'elevation': elevation, 'buildingHeight': buildingHeight, 'lat': lat,
						'lon': lon});
					prevLon = lon;
					prevLat = lat;
				}
			}
		}
	}
	
	close();
	
}
