OW.overpassMap = Object.create(IB.map);

///////////////////////////////////////

OW.overpassMap.chunks = {  };

OW.overpassMap.startLoad = function (worldRef, info) {
	//...
	
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

OW.overpassMap.loadMapChunkAtLonLatPoint = function(lonLatPoint, radius) {
	var self = this;
	/*
	var minlat = 44.6468720, // 44.6488720, // 44.6288720,  
    minlon = -63.5812540,  // -63.5792540,  // -63.5992540, 
    maxlat = 44.6516050,  // 44.6496050, // 44.6688720, 
    maxlon = -63.5705590;  // -63.5725590; // -63.5592540; 
    */
    radius = radius || 0.001; // In lon/lat
    var centerLat = lonLatPoint.getLatitude(), centerLon = lonLatPoint.getLongitude();
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
      return new OW.overpassMap.MapChunkHandler());
    }

    // Properties
    self.chunks = chunkRef;
	var maxLat = 100.0, maxLon = 100.0; // Maximum size of chunk, in meters

    // Functions
    self.chunkNameFromLonLatPoint = function(lonLatPoint) {
    	
    };

};

// Map Chunk
OW.overpassMap.MapChunk = function( minLonLatPoint, maxLonLatPoint ) { // Bounding box
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
			OW.overpassMap.loadMapChunkAtLonLatPoint
		} else {
			// Already loaded
			return callback && callback();
		}
	};

    return self;
};
