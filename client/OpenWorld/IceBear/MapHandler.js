var IB = IB || new Object();

IB.map = IB.map || Object.create(IB.actor);

IB.map.threeToMetersScale = 0.5; // For every unit in Three.js scene there is X meters

///////////////////////////////////////////

IB.map.startLoad = function (worldRef, info) {
	//...
	this.finishInitialLoad(worldRef, info);
};

IB.map.finishInitialLoad = function (worldRef, info) {
	worldRef.finishLoadMap(info);
};

IB.map.getPlayerGeoLocation = function(callback, errorCallback) {
	// In case of error
	errorCallback = errorCallback || function errorCallback(error) {
		switch(error.code) {
		case error.PERMISSION_DENIED:
			console.warn("User denied the request for Geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			console.warn("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			console.warn("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			console.warn("An unknown error occurred.");
			break;
		}
	}
	// 
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(callback, errorCallback);
	} else {
		return callback && callback(null);
	}
};

IB.map.currentPlayerLatLon = function(callback) {
	var self = this;
	self.getPlayerGeoLocation(function(geoposition){
		var p = self.LatLonPoint(geoposition.coords.latitude, geoposition.coords.longitude, geoposition.coords.altitude);
		return callback && callback(p);
	}, function(data) {
		console.log(data);
		return callback && callback(false);
	});
};

IB.map.geocoding = function(address, callback) {
	if (typeof address === "string") {
		var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+encodeURIComponent(address)+"&sensor=false";
		$.getJSON(url, function(data) {
			return callback && callback(data);
		});
	} else {
		return callback && callback(null);
	}
};

IB.map.reverseGeocoding = function(latLonPoint, callback) {
	if (latLonPoint instanceof IB.map.LatLonPoint) {
		var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+latLonPoint.getLatitude()+","+latLonPoint.getLongitude()+"&sensor=false"; 
		$.getJSON(url, function(data) {
			return callback && callback(data);
		});
	} else {
		return callback && callback(null);
	}
};

// Points
IB.map.LatLonPoint = function(lat, lon, altitude) {
	if (!(this instanceof IB.map.LatLonPoint)) {
      return new IB.map.LatLonPoint(lat, lon, altitude);
    }

	if (!lon && !altitude && lat instanceof THREE.Vector3) {
		this.setToThreePosition(lat); 
	} else {
		this.latitude = lat || 0.0;
		this.longitude = lon || 0.0;
	  	this.altitude = altitude || 0.0;
	  	return this;
	 }
};

IB.map.LatLonPoint.prototype.toString = function() {
	return "(Latitude:"+this.getLatitude()+", Longitude:"+this.getLongitude()+", Altitude:"+this.getAltitude()+")";
};

IB.map.LatLonPoint.prototype.setLatLon = function(lat, lon) {
	if (typeof lat === "number") this.latitude = lat || 0.0;
	if (typeof lon === "number") this.longitude = lon || 0.0;
	return this;
};

IB.map.LatLonPoint.prototype.setAltitude = function(altitude) {
	this.altitude = altitude;
	return this;
};
IB.map.LatLonPoint.prototype.distance = function(otherLatLonPoint) {

	return 0.0;
};

IB.map.LatLonPoint.prototype.getLatitude = function() {
	return this.latitude;
};

IB.map.LatLonPoint.prototype.getLongitude = function() {
	return this.longitude;
};

IB.map.LatLonPoint.prototype.getAltitude = function() {
	return this.altitude;
};

IB.map.LatLonPoint.prototype.fromLatLonToMeters = function() {
	
	// Source: http://stackoverflow.com/a/2689261/2578205 

	// creating source and destination Proj4js objects
	// once initialized, these may be re-used as often as needed
	var source = new Proj4js.Proj('EPSG:4326');    //source coordinates will be in Longitude/Latitude, WGS84
	var dest = new Proj4js.Proj('EPSG:3785');     //destination coordinates in meters, global spherical mercators projection, see http://spatialreference.org/ref/epsg/3785/

	// transforming point coordinates
	var p = new Proj4js.Point(this.getLatitude(), this.getLongitude());   //any object will do as long as it has 'x' and 'y' properties
	Proj4js.transform(source, dest, p);      //do the transformation.  x and y are modified in place

	// Set altitude
	p.z = this.getAltitude();

	//p.x and p.y are now EPSG:3785 in meters
	return p;
};

IB.map.LatLonPoint.prototype.fromLatLonToThreePosition = function() {
	var m = this.fromLatLonToMeters();
	var threeToMetersScale = IB.map.threeToMetersScale;
	return { x: m.y/threeToMetersScale, y: m.z/threeToMetersScale, z: m.x/threeToMetersScale  };
};

IB.map.LatLonPoint.prototype.setToMeters = function(x,y,z) {
	/*
	x = latitude/vertical
	y = longitude/horizontal
	z = Altitude
	*/

	// creating source and destination Proj4js objects
	// once initialized, these may be re-used as often as needed
	var source = new Proj4js.Proj('EPSG:3785');    //source coordinates will be in Longitude/Latitude, WGS84
	var dest = new Proj4js.Proj('EPSG:4326');     //destination coordinates in meters, global spherical mercators projection, see http://spatialreference.org/ref/epsg/3785/

	// transforming point coordinates
	var p = new Proj4js.Point(x,y);   //any object will do as long as it has 'x' and 'y' properties
	Proj4js.transform(source, dest, p);      //do the transformation.  x and y are modified in place

	// Set
	this.setLatLon(p.x, p.y);
	this.setAltitude(z);

	return this;
};

IB.map.LatLonPoint.prototype.setToThreePosition = function(x,y,z) {
	// Take in only a THREE.Vector3 (position)
	if (!y && !z && x instanceof THREE.Vector3) {
		z = x.z;
		y = x.y;
		x = x.x;
	}
	/*
	z = latitude/vertical/forward/backwards
	x = longitude/horizontal/left/right
	y = Altitude/up/down
	*/
	var threeToMetersScale = IB.map.threeToMetersScale;
	this.setToMeters( 
		z*threeToMetersScale, 		// Latitude/vertical
		x*threeToMetersScale, 		// Longitude/horizontal
		y*threeToMetersScale ); 	// Altitude

	return this;
};

IB.map.LatLonPoint.prototype.getAddress = function(callback) {
	IB.map.reverseGeocoding(this, function(data) {
		return callback && callback(data);
	});
};
