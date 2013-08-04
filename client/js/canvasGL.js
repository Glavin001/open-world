var MapRenderer = function() {
	//Sets ?
    var panLat = 44.6488720;
    var panLon = -63.5792540;
    var scaleXY = 100000;
    var minlat, minlon, maxlat, maxlon;
    
    //Sets constants for canvas rendering
    var CANVAS_WIDTH = 1024;
    var CANVAS_HEIGHT = 768;
    var CANVAS_BUF_WIDTH = 8 * CANVAS_WIDTH;
    var CANVAS_BUF_HEIGHT = 8 * CANVAS_HEIGHT;
    //Sets constants for scaling coordinates from lon/lat
    var MAX_SCALE = 100000;
    var LON_WIDTH = CANVAS_BUF_WIDTH / MAX_SCALE;
    var LAT_HEIGHT = CANVAS_BUF_HEIGHT / MAX_SCALE;
    var PADDING_LON = (CANVAS_BUF_WIDTH - CANVAS_WIDTH) / 2 / MAX_SCALE;
    var PADDING_LAT = (CANVAS_BUF_HEIGHT - CANVAS_HEIGHT) / 2 / MAX_SCALE;

    //Map data
    var highways = []; //Holds all unrendered highways
    var buildings = []; //Holds all unrendered builds
    var otherWays = []; //Holds all unrendered elements which are not yet supported
    var geo = {};
	
	//Rendering constants
	var chunk_size = 0;

    var mapRenderer = function(callback) {
		
        var self = this;
        console.log("Padding", PADDING_LON, PADDING_LAT);

        LON_WIDTH = 0.04;
        LAT_HEIGHT = 0.04;
        PADDING_LON = 0.02;
        PADDING_LAT = 0.02;

        var lo = panLon - PADDING_LON;
        var la = panLat - PADDING_LAT;
        console.log(LON_WIDTH, LAT_HEIGHT);

        console.log("bbox=" + (lo) + "," + (la) + "," + (lo + LON_WIDTH) + "," + (la + LAT_HEIGHT));
        
        //Retrieves the XML data from the server; Each XML is a different map, so only one is uncommented while testing
        //$.ajax({ url: "/proxy?bbox="+(lo)+","+(la)+","+(lo+LON_WIDTH)+","+(la+LAT_HEIGHT) , method: "GET" })
        var minlat = 44.6488720, // 44.6288720,  
        minlon = -63.5792540,  // -63.5992540, 
        maxlat = 44.6496050, // 44.6688720, 
        maxlon = -63.5725590; // -63.5592540; 
        var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=(node('+minlat+','+minlon+','+maxlat+','+maxlon+');%3C;%3E;);out%20meta;';
        // var url = "halifax1.xml";
        console.log(url);
        $.ajax({ url: url , method: "GET", dataType:"text" })
        //$.ajax({url: "germany1.xml", method: "GET"})
        //$.ajax({url: "halifax2_large.xml", method: "GET"})
        //$.ajax({url: "halifax3_large.xml", method: "GET"})
        //$.ajax({url: "halifax4_super_large.xml", method: "GET"})
                .done(function(mapData) {
            console.log("Done: Have Map Data");
            console.dir(mapData);
            self.loadMap(mapData);
            callback.call();
        });

    };

    (function() {

        this.loadMap = function(xmlDoc) {
			var buildingHolder = new THREE.Object3D();
			var otherWayHolder = new THREE.Object3D();
			var highwayHolder  = new THREE.Object3D();
			
			//Function which processes a rendering web worker's messages and adds to the map
			var processMessage = function(message) {
				switch(message.type) {
					//Logs an object to the console
					case 'log_obj':
						console.log(message.element + ":", JSON.parse(message.post));
						break;
			
					//Logs text to the console
					case 'log_txt':
						console.log(message.element + ":", message.post);
						break;
			
					//Renders roads onto the map
					case 'render_plane':
						var geometry = new THREE.Geometry();
						
						geometry.vertices.push(new THREE.Vector3(message.x_1,
							message.z_1, message.y_1));
						geometry.vertices.push(new THREE.Vector3(message.x_2,
							message.z_2, message.y_2));
						geometry.vertices.push(new THREE.Vector3(message.x_3, 
							message.z_3, message.y_3));
						geometry.vertices.push(new THREE.Vector3(message.x_4,
							message.z_4, message.y_4));
						geometry.faces.push(new THREE.Face4(0, 1, 2, 3));
						geometry.faces.push(new THREE.Face4(3, 2, 1, 0));
						geometry.computeBoundingSphere();
						
						var texture = new THREE.MeshBasicMaterial({
							color: message.color,
							lineWidth: message.lineWidth
						});
						var feature = new THREE.Mesh(geometry, texture);
						feature.matrixAutoUpdate = false;
						if (message.shadows)
						{
							feature.castShadow = true;
							feature.receiveShadow = true;
						}
						
						console.log(message.element + " added");
						
						switch(message.element) 
						{
							case 'Building':
								buildingHolder.add(feature);
								if(message.renderNow)
								{
									scene.add(buildingHolder);
								}
								break;
							case 'Highways':
								highwayHolder.add(feature);
								if(message.renderNow)
								{
									scene.add(highwayHolder);
								}
								break;
							case 'Misc':
								otherWayHolder.add(feature);
								if(message.renderNow)
								{
									scene.add(otherWayHolder);
								}
								break;
						}
						break;
			
					//Renders names on top of roads (for testing purposes?)
					case 'render_sign':
						var text3d = new THREE.TextGeometry(message.theText, {
							size: 3,
							height: 1,
							curveSegments: 1,
							font: "helvetiker"
						});
						text3d.computeBoundingBox();
						var centerOffset = -0.5 * (text3d.boundingBox.max.x - text3d.boundingBox.min.x);
						var textMaterial = new THREE.MeshPhongMaterial({
							color: message.color,
							overdraw: true});
						var text = new THREE.Mesh(text3d, textMaterial);
						text.position.x = message.prevLon + centerOffset;
						text.position.y = message.elevation + 10;
						text.position.z = message.prevLat;
						text.rotation.x = 0;
						text.rotation.y = Math.PI * 2;
						scene.add(text);
						console.log("Street Sign");
						break;
				}
			}
			
			var ready = function() {
			
				//Finds the boundaries of the scene
				minlon = geo.bbox[0];
				minlat = geo.bbox[1];
				maxlon = geo.bbox[2];
				maxlat = geo.bbox[3];
				console.log("Bounds:", minlon, minlat, maxlon, maxlat);
	
				//Sorts GeoJSON elements into usable groups
				for (var c = 0, length = geo.features.length; c < length; c++)
				{
					var typeCheck = geo.features[c].properties;
	
					//Moves a building into the building holder
					if(typeCheck.hasOwnProperty('building'))
						buildings.push(geo.features[c]);
					//Moves a street into the street holder
					else if(typeCheck.hasOwnProperty('highway') && typeCheck.highway != 'traffic_signals')
						highways.push(geo.features[c]);
					//Deals with all map elements not yet addressed
					else
						otherWays.push(geo.features[c]);
				}
	
				panLat = (maxlat - minlat) / 2;
				panLon = (maxlon - minlon) / 2;
	
				//Creates a web worker for rendering unsupported elements
				//Sends all data required for rendering
				var otherWayGen = new Worker('js/otherWays.js');
				otherWayGen.postMessage({'otherWays': JSON.stringify(otherWays),
					'minlon': minlon, 'minlat': minlat, "MAX_SCALE": MAX_SCALE,
					'chunk_size': chunk_size});
	
				//Creates a web worker for rending highways
				//Sends all data required for rendering
				var highwayGen = new Worker('js/highways.js');
				highwayGen.postMessage({'highways': JSON.stringify(highways),
					'minlon': minlon, 'minlat': minlat, "MAX_SCALE": MAX_SCALE,
					'chunk_size': chunk_size});
	
				//Creates a web worker for rendering buidlings
				//Sends all data required for rendering
				var buildingsGen = new Worker('js/buildings.js');
				buildingsGen.postMessage({'buildings': JSON.stringify(buildings),
					'minlon': minlon, 'minlat': minlat, "MAX_SCALE": MAX_SCALE,
					'chunk_size': chunk_size});
	
				//Handles messages from the otherWayGen web worker
				otherWayGen.onmessage = function(e) {
					setTimeout(processMessage(e.data), 0);
				}
	
				//Handles messages from highwayGen web worker
				highwayGen.onmessage = function(e) {
					setTimeout(processMessage(e.data), 0);
				}
					
				//Handles messages from buildingsGen web worker
				buildingsGen.onmessage = function(e) {
					setTimeout(processMessage(e.data), 0);
				}
	
				console.log(panLon, minlon, panLat, minlat, MAX_SCALE);
				camera.position.x = (panLon) * MAX_SCALE;
				camera.position.z = (panLat) * MAX_SCALE;
				camera.position.y = 10;
				console.log(camera.position);
			}
			
		    //Creates the GeoJSON from XML
			//geo = osm2geo(xmlDoc);
			var converter = new Worker('js/converter.js');
			//console.log(xmlDoc)
			converter.postMessage(xmlDoc);
			
			//converter.postMessage((new XMLSerializer()).serializeToString(xmlDoc));
			/*
			var test_1 = (new XMLSerializer()).serializeToString(xmlDoc);
			var parser = new DOMImplementation();
			var test_2 = parser.loadXML(xmlDoc);
			console.log(test_2);
			*/
			//window.xmlGeo = test_2;
			//console.log((new XMLSerializer()).serializeToString(xmlDoc));
			//console.log(xmlDoc);
			
			converter.onmessage = function(e) {
				geo = e.data;
				console.log("Done parsing to GeoJSON.");				
				ready();
			}
			
        };
    }).call(mapRenderer.prototype);

    return mapRenderer;
}();