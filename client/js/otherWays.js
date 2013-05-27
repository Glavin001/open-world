onmessage = function(e) {
	var otherWays = JSON.parse(e.data.otherWays);
	var minlon = e.data.minlon;
	var minlat = e.data.minlat;
	var MAX_SCALE = e.data.MAX_SCALE;
	var element = 'Misc';
	var elevation = 0;
	var buildingHeight = 10;
	var lineWidth = 1;
	var color = 0x000000;
	var shadows = true;
	var chunkSize = e.data.chunk_size;
	var counter = 0;
	
	for (var i = 0, number = otherWays.length; i < number; i++) {
		var way = otherWays[i];
	
		// Draw highway blacktop
		var startPoint = true;
		var prevLon = 0;
		var prevLat = 0;
		var renderNow = false;
		
		for(var c = 0, length = way.geometry.coordinates.length; c < length; c++) {
			counter++;
			
			if((i + 1 === number && c + 1 === length) || counter === chunkSize)
			{
				counter = 0;
				renderNow = true;
			}
			
			//Gets lat and lon from array
			if(isNaN(way.geometry.coordinates[0]))
			{
				var lon = way.geometry.coordinates[0][c][0];
				var lat = way.geometry.coordinates[0][c][1];
			} else {
				var lon = way.geometry.coordinates[0];
				var lat = way.geometry.coordinates[1];
			}
			
			postMessage({
				'type': 'log_txt',
				'post': lat + " " + lon,
				'element': element
			});
			
			// Scale lat and lon
			if (lon < minlon)
				postMessage({
					'type': 'log_txt',
					'post': "Out of Bounds lon: " + " " + lon + " " + minlon,
					'element': element
				});
			if (lat < minlat)
				postMessage({
					'type': 'log_txt',
					'post': "Out of Bounds lon: " + " " + lon + " " + minlon,
					'element': element
					});
					
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
				if(renderNum = 40) {
				}
				
				postMessage({
					'type': 'render_plane',
					'element': element,
					'x_1': prevLon,
					'y_1': prevLat,
					'z_1': elevation,
					'x_2': prevLon,
					'y_2': prevLat,
					'z_2': elevation + buildingHeight,
					'x_3': lon,
					'y_3': lat,
					'z_3': elevation + buildingHeight,
					'x_4': lon,
					'y_4': lat,
					'z_4': elevation,
					'lineWidth': lineWidth,
					'shadows': shadows,
					'color': color,
					'renderNow': renderNow
				});
				prevLon = lon;
				prevLat = lat;
			}
		}
	}
	
	close();
	
}
