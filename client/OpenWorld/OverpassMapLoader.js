OW.overpassMap = Object.create(IB.map);

///////////////////////////////////////

OW.overpassMap.startLoad = function (worldRef, info) {
	//...
	var self = this;
	// Create Map Chunk Handler
	self.mapRenderer = new self.MapRenderer();
	
	// Create Mini Map
	console.log('Create Mini Map');
	var geoPt = new IB.map.LatLonPoint(); // OW.player.pc.pawn.position
	console.log(geoPt);
	var miniMap = L.map('miniMap').setView([geoPt.getLatitude(), geoPt.getLongitude()], 18);
	L.tileLayer('http://{s}.tile.cloudmade.com/cef413c62be14a7e9cfe439e97bde4a1/997/256/{z}/{x}/{y}.png', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
	    maxZoom: 18
	}).addTo(miniMap);
	self.miniMap = miniMap;

	self.finishInitialLoad(worldRef, info);
};

OW.overpassMap.tick = function (deltaTime) {
	var self = this;
	//might want reference OW.player.pc.pawn.position
	//...
	// console.log(OW.player.pc.pawn.position);
	var cpos = OW.player.pc.pawn.position;
	var gpos = new IB.map.LatLonPoint();
	gpos.setToThreePosition(cpos.x, cpos.y, cpos.z);
	//console.log(cpos, gpos, gpos.fromLatLonToThreePosition());
	/*
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
	*/
	// Load Map

	// Create Map Chunk Handler
	self.mapRenderer = self.mapRenderer || new self.MapRenderer();

	// Move mini map
	self.miniMap.panTo({lat: gpos.getLatitude(), lng: gpos.getLongitude() });

	// Render at the current player position
	self.mapRenderer.renderAtLatLonPoint(gpos);


};

OW.overpassMap.addMapGeo = function (geometry) {
	this.world.sceneAdd(geometry);
};

OW.overpassMap.addMapChunk = function (overpassData) {
	//...
	this.mapRenderer.rendererOverpassMapData(overpassMap);

	this.addMapGeo(processedGeometry);
};

/*
OW.overpassMap.queriesPerSecond = 3, OW.overpassMap.pendingQueries = [], OW.overpassMap.lastQueryTime = null; // Max is 5 requests per second, and then errors occur.
OW.overpassMap.loadMapChunkAtLatLonPoint = function(latLonPoint, options, callback) {
	var self = this;
	
	// Add to pending
	if (latLonPoint && latLonPoint instanceof IB.map.LatLonPoint) {
		
		options = options || { };
	    options.radius = options.radius || 0.01; // In lon/lat
	    var centerLat = latLonPoint.getLatitude(), centerLon = latLonPoint.getLongitude();
	    var minlat = centerLat - options.radius,
	    minlon = centerLon - options.radius,
	    maxlat = centerLat + options.radius,
	    maxlon = centerLon + options.radius;
	    var outputFormat = options.out || "json"; // "xml";
	    var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=[out:'+outputFormat+'];(node('+minlat+','+minlon+','+maxlat+','+maxlon+');%3C;%3E;);out%20meta;';
	    console.log(url);
	   	
	    var newPending = {'url':url, 'callback':callback};

		self.pendingQueries.push(newPending);
	}

	// Check if available to query
	var currTime = +new Date(),
	diffTime = currTime - self.lastQueryTime;

	if ( diffTime > (1000 / self.queriesPerSecond) ) {
	    // Remove from pending
	    var curr = self.pendingQueries.shift();
		
		self.lastQueryTime = +new Date(); // Record this time

	    $.ajax({ url: curr.url , method: "GET", dataType:"text/"+outputFormat })
	    .done(function(mapData) {
	        //console.log("Done: Have Map Data");
	        //console.dir(mapData);
	        return curr.callback && curr.callback(mapData); // self.addMapChunk(mapData);
	    })
	    .fail(function(event) {
	    	console.error( event.error() );
	    	return curr.callback && curr.callback(false);
	    })
	    .always(function(){
	    	// console.log('Finished loading map data from Overpass.');

	    });
	    return url;

	}
};
*/

OW.overpassMap.loadMapChunkWithBoundingBox = function (minLatLonPoint, maxLatLonPoint, callback, options) {
	if ( !(minLatLonPoint instanceof IB.map.LatLonPoint && maxLatLonPoint instanceof IB.map.LatLonPoint ) ) 
		return callback && callback(false);

	options = options || { };
    var outputFormat = options.out || "json"; // "xml";

	var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=[out:'+outputFormat+'];(node('+minLatLonPoint.getLatitude()+','+minLatLonPoint.getLongitude()+','+maxLatLonPoint.getLatitude()+','+maxLatLonPoint.getLongitude()+');%3C;%3E;);out%20meta;';
	$.ajax({ url: url , method: "GET", dataType:"text" })
	.done(function(mapData) {
		//console.log("Done: Have Map Data");
		//console.dir(mapData);
		return callback && callback(mapData); // self.addMapChunk(mapData);
	})
	.fail(function(event) {
		console.log(arguments);
		console.error( event.error() );
		return callback && callback(false);
	})
	.always(function(){
		// console.log('Finished loading map data from Overpass.');

	});
	return url;
};

OW.overpassMap.MapRenderer = function(chunkRef) {
	var self = this;
	if (!(self instanceof OW.overpassMap.MapRenderer)) {
      return new OW.overpassMap.MapRenderer();
    }

    // Properties
    self.chunks = chunkRef || {  }; // { Lat : { Lon Chunk,... },..}
	var maxLat = 100.0, maxLon = 100.0, // Maximum size of chunk, in meters
	pendingLoads = 0, maxPendingLoads = 1, // IMPORTANT: Currently only supports one pending load. See how code works below, with loader setTimeout, etc.
	loadedChunkIds = [ ], lastLoadedChunkId = null,
	loaderId = null, loaderInterval = 100;
    
    // Functions
    self.renderAtLatLonPoint = function(latLonPoint) {
		var mainChunkId = self.chunkIdFromLatLonPoint(latLonPoint),
		mainChunkIdStr = JSON.stringify(mainChunkId);

		/*
    	//if (pendingLoads >= maxPendingLoads) {
    	//	console.log('Currently loading...');
    	//} else 
    	if ( loadedChunkIds.indexOf(mainChunkIdStr) === -1 ) {
    		// Has not already been loaded.

    		// Check if already prepped to be loaded 
    		if ( lastLoadedChunkId !== mainChunkIdStr ) {
    			// New chunk to be loaded.
	    		clearTimeout(loaderId);	    	
	    		setTimeout( function() {
		    		pendingLoads++;
			    	loadedChunkIds.push(mainChunkIdStr);
			    	console.log(loadedChunkIds);

			    	var overpassQueryUrl = OW.overpassMap.loadMapChunkAtLatLonPoint(latLonPoint, undefined, function(mapData) {
			    		pendingLoads--;
			    		if (mapData) {
				    		// Process Map Data	
			    			console.log("Map data for chunkId:", mainChunkId);
			    			console.log(mapData);
			    			// Ensure is added to loaded list
			    			if (loadedChunkIds.indexOf(mainChunkIdStr) === -1) {
			    				loadedChunkIds.push(mainChunkIdStr); 
			    			}
				    	} else {
				    		// Error occured: No map data
				    		loadedChunkIds.splice( loadedChunkIds.indexOf( mainChunkIdStr ), 1 ); // Remove from loaded chunks
				    	}
			    	});
					
				}, loaderInterval);

	    	}

	    	lastLoadedChunkId = mainChunkIdStr;

    	} else {
    		// console.log('Already loaded.');
    		// console.log(mainChunkId);
    	}
    	*/

    	var chunk = self.getChunkWithId(mainChunkId);

    };

    self.chunkIdFromLatLonPoint = function(latLonPoint) {
    	// Number is fastest Object property name for retrieval (see JSPerfs below) 
		var latChunkId, lonChunkId;

		var p = latLonPoint.fromLatLonToMeters();

    	// Calculate (in meters)
    	latChunkId = parseInt(p.x / maxLat )*maxLat;
    	lonChunkId = parseInt(p.y / maxLon )*maxLon;

		return {lat: latChunkId, lon: lonChunkId }; // In meters
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
	    		latChunks[chunkId.lon] = self.createMapChunkAtChunkId(chunkId);
	    		var lonChunk = latChunks[chunkId.lon];
	    		return lonChunk;
    		}
    	} else {
    		// Does not exist
    		// Create chunk!
    		self.chunks[chunkId.lat] = { };
    		var latChunks = self.chunks[chunkId.lat];
    		latChunks[chunkId.lon] = self.createMapChunkAtChunkId(chunkId);
    		var lonChunk = latChunks[chunkId.lon];
    		return lonChunk;
    	}
    };

    self.createMapChunkAtChunkId = function(chunkId) {
    	// Create points 
    	var minLatLonPoint = new IB.map.LatLonPoint(), maxLatLonPoint = new IB.map.LatLonPoint();
    	//  Calculate bounding box in meters and convert to LatLonPoint
    	minLatLonPoint.setToMeters(chunkId.lat - maxLat/2, chunkId.lon - maxLon/2, 0.0);
    	maxLatLonPoint.setToMeters(chunkId.lat + maxLat/2, chunkId.lon + maxLon/2, 0.0);
    	// Create chunk with LatLonPoints
		var chunk = new OW.overpassMap.MapChunk(minLatLonPoint, maxLatLonPoint);
		return chunk;
    }

};

// Map Chunk
OW.overpassMap.MapChunk = function( minLatLonPoint, maxLatLonPoint ) { // Bounding box
	var self = this;
	if (!(self instanceof OW.overpassMap.MapChunk)) {
      return new OW.overpassMap.MapChunk( minLatLonPoint, maxLatLonPoint );
    }

    // Properties
    self.dirtyChunk = false; // 
    self.loaded = false; // If loaded or not
    self.reloadInterval = 1000; 
    self.reloadAttempts=0;
    self.maxReloadAttempts=10;
    self.object3D = new THREE.Object3D();



    // Methods
	self.render = function(callback) {
		// Load all of the 
		self.load(function(successfullyLoaded) {
			// Render all objects that are not currently being rendered.
			if (successfullyLoaded) {
				console.log('Ready to render', self);

				var msg = "Loaded!";
				var text3d = new THREE.TextGeometry(msg, {
					size: 1.5,
					height: 0.1,
					curveSegments: 3,
					font: "helvetiker"
				});
				text3d.computeBoundingBox();

				var textMaterial = new THREE.MeshPhongMaterial({
					color: 0xFFFFFF,
					overdraw: true});
				var obj = new THREE.Mesh(text3d, textMaterial);
				
				// Get position in Three.js units
				var minPos = minLatLonPoint.fromLatLonToThreePosition();
				var maxPos = maxLatLonPoint.fromLatLonToThreePosition();
				var centerPos = { x: ( (maxPos.x - minPos.x) / 2 + minPos.x), y: 0, z: ( (maxPos.y - minPos.y) / 2 + minPos.y) };
				// Re-Position
				obj.position.x = minPos.x;
				obj.position.y = 1.0; //minPos.y || 0.0;
				obj.position.z = minPos.z;
				obj.rotation.y = -Math.PI / 2;
				// Merge
				// THREE.GeometryUtils.merge(self.object3D, obj);
				self.object3D = obj;
				// Add to scene
				OW.world.sceneAdd( self.object3D );

				var grassTex = THREE.ImageUtils.loadTexture('img/Grass_1.png');
			    grassTex.wrapS = THREE.RepeatWrapping;
			    grassTex.wrapT = THREE.RepeatWrapping;
			    grassTex.repeat.x = 256;
			    grassTex.repeat.y = 256;
			    var groundMat = new THREE.MeshLambertMaterial({/*color: 0x2133BF*/map:grassTex});
			    var groundGeo = new THREE.PlaneGeometry(Math.abs(maxPos.x-minPos.x), Math.abs(maxPos.z-minPos.z));
			    var ground = new THREE.Mesh(groundGeo, groundMat);
			    console.log(minPos,maxPos);
			    ground.position.x = minPos.x;
			    ground.position.z = minPos.z;
			    ground.position.y = -0.0; // -1.9; //lower it 
			    console.log(ground.position);
			    ground.rotation.x = -Math.PI / 2; //-90 degrees around the xaxis 
			    ////IMPORTANT, draw on both sides 
			    ground.doubleSided = true;
			    ground.receiveShadow = true;
			    OW.world.sceneAdd(ground);

			} else {
				// Error occured
				console.error('Could not render chunk because load failed.');
			}
		});
	};

	self.load = function(callback) {
		// Check if already loaded
		if (self.dirtyChunk || !self.loaded) {
			// Requires loading
			OW.overpassMap.loadMapChunkWithBoundingBox(minLatLonPoint, maxLatLonPoint, function (mapData) {
				if (mapData) {
					//console.log(mapData);
					self.loaded = true;
					return callback && callback(true);
				} else {
					// Failed, reload
					setTimeout( function() {
						self.reloadAttempts++;
						if (self.maxReloadAttempts > self.reloadAttempts) {
							self.load(callback);
						} else {
							self.reloadAttempts = 0; // Reset
							return callback && callback(false);
						}
					}, self.reloadInterval * self.reloadAttempts);
				}
			});

		} else {
			// Already loaded
			return callback && callback(true);
		}
	};

    // Load & Render
    self.render();

    return self;
};

OW.overpassMap.Way = function(parentMapChunk) {
	var self = this;
	if (!(self instanceof OW.overpassMap.Way)) {
      return new OW.overpassMap.Way( );
    }

	self.parentMapChunk = parentMapChunk;

};

OW.overpassMap.Node = function() {

};

