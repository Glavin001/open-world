onmessage = function(e) {
  var buildings = JSON.parse(e.data.buildings);
	var minlon = e.data.minlon;
	var minlat = e.data.minlat;
	var MAX_SCALE = e.data.MAX_SCALE;
	
	for (var key in buildings) {
		if (buildings.hasOwnProperty(key)) {
			var way = buildings[key];

			// Draw highway blacktop
			var startPoint = true;
			var prevLon = 0;
			var prevLat = 0;
			var elevation = 0;
			var buildingHeight = 50;

			for(var c = 0, length = way.geometry.coordinates[0].length; c < length; c++) {
				//Gets lat and lon from array
				if(isNaN(way.geometry.coordinates[0]))
				{
					var lon = way.geometry.coordinates[0][c][0];
					var lat = way.geometry.coordinates[0][c][1];
				} else {
					var lon = way.geometry.coordinates[0];
					var lat = way.geometry.coordinates[1];
				}
										
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
					postMessage({'type': 'render_building', 'prevLon': prevLon, 'prevLat': prevLat,
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
