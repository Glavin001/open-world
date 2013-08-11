OW.overpassMap = Object.create(IB.map);

///////////////////////////////////////

OW.overpassMap.chunks = {  }; // { Lat : { chunk },  }

OW.overpassMap.startLoad = function (worldRef, info) {
	//...

	// Create Map Chunk Handler

	
	this.finishInitialLoad(worldRef, info);
};

OW.overpassMap.tick = function (deltaTime) {
	//might want reference OW.player.pc.pawn.position
	//...
	// console.log(OW.player.pc.pawn.position);
	var cpos = OW.player.pc.pawn.position;
	var gpos = new IB.map.LatLonPoint();
	gpos.setToThreePosition(cpos.x, cpos.y, cpos.z);
	//console.log(cpos, gpos, gpos.fromLatLonToThreePosition());

	var msg = OW.player.username+" "+gpos;
	var text3d = new THREE.TextGeometry(msg, {
		size: 0.5,
		height: 0.1,
		curveSegments: 3,
		font: "helvetiker"
	});
	text3d.computeBoundingBox();

	var textMaterial = new THREE.MeshPhongMaterial({
		color: 0xFFFFFF,
		overdraw: true});
	var newNameTag = new THREE.Mesh(text3d, textMaterial);
	OW.world.scene.remove( OW.player.pc.nameTag );
	OW.player.pc.nameTag = newNameTag;
	OW.world.sceneAdd( newNameTag );

};

OW.overpassMap.addMapGeo = function (geometry) {
	this.world.sceneAdd(geometry);
};

OW.overpassMap.addMapChunk = function (overpassData) {
	//...
	
	this.addMapGeo(processedGeometry);
};

OW.overpassMap.loadMapChunkAtLatLonPoint = function(latLonPoint, radius) {
	var self = this;
	/*
	var minlat = 44.6468720, // 44.6488720, // 44.6288720,  
    minlon = -63.5812540,  // -63.5792540,  // -63.5992540, 
    maxlat = 44.6516050,  // 44.6496050, // 44.6688720, 
    maxlon = -63.5705590;  // -63.5725590; // -63.5592540; 
    */
    radius = radius || 0.001; // In lon/lat
    var centerLat = latLonPoint.getLatitude(), centerLon = latLonPoint.getLongitude();
    var minlat = centerLat - radius,
    minlon = centerLon - radius,
    maxlat = centerLat + radius,
    maxlon = centerLon + radius;
    var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=(node('+minlat+','+minlon+','+maxlat+','+maxlon+');%3C;%3E;);out%20meta;';
    console.log(url);
    $.ajax({ url: url , method: "GET", dataType:"text" })
            .done(function(mapData) {
        console.log("Done: Have Map Data");
        console.dir(mapData);
        self.addMapChunk(mapData);
    });

};

OW.overpassMap.MapChunkHandler = function(chunkRef) {
	var self = this;
	if (!(self instanceof OW.overpassMap.MapChunkHandler)) {
      return new OW.overpassMap.MapChunkHandler();
    }

    // Properties
    self.chunks = chunkRef || { };
	var maxLat = 100.0, maxLon = 100.0; // Maximum size of chunk, in meters

    // Functions
    self.chunkIdFromLatLonPoint = function(latLonPoint) {
    	// Number is fastest Object property name for retrieval (see JSPerfs below) 
		var latChunkId, lonChunkId;

		var p = latLonPoint.fromLatLonToMeters();

    	// Calculate
    	latChunkId = parseInt(p.x / maxLat )*maxLat;
    	lonChunkId = parseInt(p.y / maxLon )*maxLon;

		return {lat: latChunkId, lon: lonChunkId };    	
    };

    self.getChunkWithId = function(chunkId) {
    	// Check to see if exists
    	// See JSPerf for performance: http://jsperf.com/property-lookup-vs-linear-scan 
    	if (chunkId.lat in self.chunks ) {
    		// Exists
    		// Retrieve it
    		// See JSPerf: http://jsperf.com/performance-of-array-vs-object/3 and http://jsperf.com/string-vs-integer-object-indices 
    		var latChunks = self.chunks[chunkId.lat];
    		// Check to see if lonChunk exists
    		if (chunkId.lon in latChunks) {
    			// Exists
    			var lonChunk = latChunks[chunkId.lon];
    			return lonChunk;
    		} else {
	    		// Does not exist
	    		// Create chunk!
	    		latChunks[chunkId.lon] = { };
	    		var lonChunk = latChunks[chunkId.lon];
	    		return lonChunk;
    		}
    	} else {
    		// Does not exist
    		// Create chunk!
    		self.chunks[chunkId.lat] = { };
    		var latChunks = self.chunks[chunkId.lat];
    		latChunks[chunkId.lon] = { };
    		var lonChunk = latChunks[chunkId.lon];
    		return lonChunk;
    	}
    };

};

// Map Chunk
OW.overpassMap.MapChunk = function( minLatLonPoint, maxLatLonPoint ) { // Bounding box
	var self = this;
	if (!(self instanceof OW.overpassMap.MapChunk)) {
      return new OW.overpassMap.MapChunk(options);
    }

    // Properties
    self.dirtyChunk = false; // 
    self.loaded = false; // If loaded or not
    self.object3d = new THREE.Object3d;

    // Load
    self.load();

    // Methods
	self.prototype.render = function(callback) {
		// Load all of the 
		self.load(function() {
			// Render all objects that are not currently being rendered.

		});
	};

	self.prototype.load = function(callback) {
		// Check if already loaded
		if (dirtyChunk || loaded) {
			// Requires loading
			OW.overpassMap.loadMapChunkAtLatLonPoint
		} else {
			// Already loaded
			return callback && callback();
		}
	};

    return self;
};
