var IB = IB || new Object();

IB.map = IB.map || Object.create(IB.actor);

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

IB.map.geocoding = function(address, callback) {
	var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+encodeURIComponent(address)+"&sensor=false";
	$.getJSON(url, function(data) {
		return callback && callback(data);
	});
};

IB.map.reverseGeocoding = function(latLonPoint, callback) {
	var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+latLonPoint.getLatitude()+","+latLonPoint.getLongitude()+"&sensor=false"; 
	$.getJSON(url, function(data) {
		return callback && callback(data);
	});
};

// Points
var LatLonPoint = function(lat, lon, altitude) {
	if (!(this instanceof LatLonPoint)) {
      return new LatLonPoint(lat, lon, altitude);
    }
	this.latitude = lat || 0.0;
	this.longitude = lon || 0.0;
  	this.altitude = altitude || 0.0;
};
IB.map.LatLonPoint = LatLonPoint;

LatLonPoint.prototype.setLatLon = function(lat, lon) {
	this.latitude = lat;
	this.longitude = lon;
};

LatLonPoint.prototype.setAltitude = function(altitude) {
	this.altitude = altitude;
};
LatLonPoint.prototype.distance = function(otherLatLonPoint) {

	return 0.0;
};

LatLonPoint.prototype.getLatitude = function() {
	return this.latitude;
};

LatLonPoint.prototype.getLongitude = function() {
	return this.longitude;
};

LatLonPoint.prototype.getAltitude = function() {
	return this.altitude;
};

LatLonPoint.prototype.fromLatLonToMeters = function() {
	
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
