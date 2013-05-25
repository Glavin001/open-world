onmessage = function(e) {
  var highways = JSON.parse(e.data.highways);
	var minlon = e.data.minlon;
	var minlat = e.data.minlat;
	var MAX_SCALE = e.data.MAX_SCALE;
	var element = 'Highways';
	var elevation = 1;
	var roadWidth = 10;
	var color = 0x000000;
	var shadows = false;
	
	postMessage({
		'type': 'log_obj', 
		'post': JSON.stringify(highways),
		'element': element
	});

	for (var i = 0, number = highways.length; i < number; i++) {
		var way = highways[i];
		
		// Draw highway blacktop
		var startPoint = true;
		var prevLon = 0;
		var prevLat = 0;
		var renderNow = false;

		
		var startPoint = true;
		for(var c = 0, length = way.geometry.coordinates.length; c < length; c++) {
			if(i + 1 === number)
				renderNow = true;
			
			
			//Gets lat and lon from array
			if(isNaN(way.geometry.coordinates[0]))
			{
				var lon = way.geometry.coordinates[c][0];
				var lat = way.geometry.coordinates[c][1];
			} else {
				var lon = way.geometry.coordinates[0];
				var lat = way.geometry.coordinates[1];
			}
			
			//Logs data to console
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
					'post': "Out of Bounds lat: " + " " + lat + " " + minlat,
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
				postMessage({
					'type': 'render_plane',
					'element': element,
					'x_1': prevLon,
					'y_1': prevLat,
					'z_1': elevation,
					'x_2': prevLon,
					'y_2': prevLat - roadWidth,
					'z_2': elevation,
					'x_3': lon,
					'y_3': lat - roadWidth,
					'z_3': elevation,
					'x_4': lon,
					'y_4': lat,
					'z_4': elevation,
					'lineWidth': roadWidth,
					'shadows': shadows,
					'color': color,
					'renderNow': renderNow
				});
				prevLon = lon;
				prevLat = lat;
			}
		}
		
		var theText = 'Unknown Street';
		theText = (way.properties.name) ? way.properties.name : theText;
		
		postMessage({
			'type': 'log_txt', 
			'post': theText,
			'element': element
		});
			
		var sign_color = Math.random() * 0xffffff;
		
		postMessage({
			'type': 'render_sign',
			'prevLat': prevLat,
			'prevLon': prevLon,
			'elevation': elevation,
			'theText': theText,
			'color': sign_color
		});
	}
	
	close();
	
}
