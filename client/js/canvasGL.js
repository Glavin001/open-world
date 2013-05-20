var MapRenderer = function() {

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

    // Map data
    var sceneBuffer = [];
    var streetSignBuffer = [];
    var highways = {};  //Holds all unrendered highways
    var buildings = {}; //Holds all unrendered builds
    var otherWays = {}; //Holds all unrendered elements which are not yet supported
    var geo = {};

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
        $.ajax({ url: "halifax1.xml" , method: "GET" })
        //$.ajax({url: "germany1.xml", method: "GET"})
        //$.ajax({url: "halifax2_large.xml", method: "GET"})
        //$.ajax({url: "halifax3_large.xml", method: "GET"})
        //$.ajax({url: "halifax4_super_large.xml", method: "GET"})
                .done(function(mapData) {
            console.log("Done: Have Map Data");
            self.loadMap(mapData);
            callback.call();
        });

    };

    (function() {

        this.loadMap = function(xmlDoc) {
			
	    //Creates the GeoJSON from XML
            var geo = osm2geo(xmlDoc);
            console.log("Done parsing to GeoJSON.");
            console.log(geo);
			
	    //Finds the boundaries of the scene
            var bounds = $(xmlDoc).find("bounds");
            minlat = parseFloat(bounds.attr('minlat'));
            minlon = parseFloat(bounds.attr('minlon'));
            maxlat = parseFloat(bounds.attr('maxlat'));
            maxlon = parseFloat(bounds.attr('maxlon'));
            console.log("Bounds:", minlon, minlat, maxlon, maxlat);
			
	    //Sorts GeoJSON elements into usable groups
            for (var c = 0, length = geo.features.length; c < length; c++)
            {
				var typeCheck = geo.features[c].properties;
				
				//Moves a building into the building holder
				if(typeCheck.hasOwnProperty('building') || typeCheck.hasOwnProperty('amenity'))
					buildings[c] = geo.features[c];
				//Moves a street into the street holder
				else if(typeCheck.hasOwnProperty('highway') && typeCheck.highway != 'traffic_signals')
					highways[c] = geo.features[c];
				//Deals with all map elements not yet addressed
				else
					otherWays[c] = geo.features[c];
            }
			
            panLat = (maxlat - minlat) / 2;
            panLon = (maxlon - minlon) / 2;
			
			//Creates a web worker for rendering unsupported elements
			//Sends all data required for rendering
			var otherWayGen = new Worker('js/otherWays.js');
			otherWayGen.postMessage({'otherWays': JSON.stringify(otherWays),
				'minlon': minlon, 'minlat': minlat, "MAX_SCALE": MAX_SCALE});
			
			//Creates a web worker for rending highways
			//Sends all data required for rendering
			var highwayGen = new Worker('js/highways.js');
			highwayGen.postMessage({'highways': JSON.stringify(highways),
				'minlon': minlon, 'minlat': minlat, "MAX_SCALE": MAX_SCALE});
			
			//Creates a web worker for rendering buidlings
			//Sends all data required for rendering
			var buildingsGen = new Worker('js/buildings.js');
			buildingsGen.postMessage({'buildings': JSON.stringify(buildings),
				'minlon': minlon, 'minlat': minlat, "MAX_SCALE": MAX_SCALE});
			
			//Handles messages from the otherWayGen web worker
			otherWayGen.onmessage = function(e) {
				switch(e.data.type) {
					//Logs an object to the console
					case 'log_obj':
						console.log("OtherWays:", JSON.parse(e.data.post));
						break;
					
					//Logs text to the console
					case 'log_txt':
						console.log("OtherWays:", e.data.post);
						break;
					
					//Renders the position of unsupported objects
					case 'render_misc':
						var geometry = new THREE.Geometry();
						geometry.vertices.push(new THREE.Vector3(e.data.prevLon, e.data.elevation,
							e.data.prevLat));
						geometry.vertices.push(new THREE.Vector3(e.data.prevLon, e.data.elevation +
							e.data.buildingHeight, e.data.prevLat));
						geometry.vertices.push(new THREE.Vector3(e.data.lon, e.data.elevation + 
							e.data.buildingHeight, e.data.lat));
						geometry.vertices.push(new THREE.Vector3(e.data.lon, e.data.elevation, 
							e.data.lat));
						geometry.faces.push(new THREE.Face4(0, 1, 2, 3));
						geometry.faces.push(new THREE.Face4(3, 2, 1, 0));
						geometry.computeBoundingSphere();
			
						var material = new THREE.MeshPhongMaterial({
							color: 0x0000bb
						});
						var unknownObj = new THREE.Mesh(geometry, material);
						unknownObj.matrixAutoUpdate = false;
						unknownObj.castShadow = true;
						unknownObj.receiveShadow = true;
			
						scene.add(unknownObj);
						console.log("Misc added");
						break;
				}
			}
			
			//Handles messages from highwayGen web worker
			highwayGen.onmessage = function(e) {
				switch(e.data.type) {
					//Logs an object to the console
					case 'log_obj':
						console.log("Highways:", JSON.parse(e.data.post));
						break;
					
					//Logs text to the console
					case 'log_txt':
						console.log("Highways:", e.data.post);
						break;
					
					//Renders roads onto the map
					case 'render_road':
						var geometry = new THREE.Geometry();
						geometry.vertices.push(new THREE.Vector3(e.data.prevLon,
							e.data.elevation, e.data.prevLat));
						geometry.vertices.push(new THREE.Vector3(e.data.prevLon,
							e.data.elevation, e.data.prevLat - e.data.roadWidth));
						geometry.vertices.push(new THREE.Vector3(e.data.lon, 
							e.data.elevation, e.data.lat - e.data.roadWidth));
						geometry.vertices.push(new THREE.Vector3(e.data.lon,
							e.data.elevation, e.data.lat));
						geometry.faces.push(new THREE.Face4(0, 1, 2, 3));
						geometry.faces.push(new THREE.Face4(3, 2, 1, 0));
						geometry.computeBoundingSphere();
						var asphalt = new THREE.MeshBasicMaterial({color: 0x000000, lineWidth: 10});
						var road = new THREE.Mesh(geometry, asphalt);
						road.matrixAutoUpdate = false;
						scene.add(road);
						console.log("Road segment added");
						break;
					
					//Renders names on top of roads (for testing purposes?)
					case 'render_sign':
						var text3d = new THREE.TextGeometry(e.data.theText, {
							size: 3,
							height: 1,
							curveSegments: 1,
							font: "helvetiker"
						});
						text3d.computeBoundingBox();
						var centerOffset = -0.5 * (text3d.boundingBox.max.x - text3d.boundingBox.min.x);
						var textMaterial = new THREE.MeshPhongMaterial({color: e.data.color,
							overdraw: true});
						var text = new THREE.Mesh(text3d, textMaterial);
						text.position.x = e.data.prevLon + centerOffset;
						text.position.y = e.data.elevation + 10;
						text.position.z = e.data.prevLat;
						text.rotation.x = 0;
						text.rotation.y = Math.PI * 2;
						scene.add(text);
						console.log("Street Sign");
						break;
				}
			}
			
			//Handles messages from buildingsGen web worker
			buildingsGen.onmessage = function(e) {
				switch(e.data.type) {
					//Logs objects to the console
					case 'log_obj':
						console.log("Buildings:", JSON.parse(e.data.post));
						break;
					
					//Logs text to the console
					case 'log_txt':
						console.log("Buildings:", e.data.post);
						break;
					
					//Renders builds onto the map
					case 'render_building':
						var geometry = new THREE.Geometry();
						geometry.vertices.push(new THREE.Vector3(e.data.prevLon, e.data.elevation,
							e.data.prevLat));
						geometry.vertices.push(new THREE.Vector3(e.data.prevLon, e.data.elevation +
							e.data.buildingHeight, e.data.prevLat));
						geometry.vertices.push(new THREE.Vector3(e.data.lon, e.data.elevation +
							e.data.buildingHeight, e.data.lat));
						geometry.vertices.push(new THREE.Vector3(e.data.lon, e.data.elevation, e.data.lat));
						geometry.faces.push(new THREE.Face4(0, 1, 2, 3));
						geometry.faces.push(new THREE.Face4(3, 2, 1, 0));
						geometry.computeBoundingSphere();
						
						var material = new THREE.MeshPhongMaterial({
							color: 0x0000bb
						});
						var building = new THREE.Mesh(geometry, material);
						building.matrixAutoUpdate = false;
						building.castShadow = true;
						building.receiveShadow = true;
						scene.add(building);
						console.log("Building added");
						break;
				}
			}

            console.log(panLon, minlon, panLat, minlat, MAX_SCALE);
            camera.position.x = (panLon) * MAX_SCALE;
            camera.position.z = (panLat) * MAX_SCALE;
            camera.position.y = 10;
            console.log(camera.position);
			
            setTimeout(this.processSceneBuffer, 1);

        };

        this.processSceneBuffer = function processSceneBuffer() {
            console.log(sceneBuffer.length);
            var combined = new THREE.Geometry();
            while (sceneBuffer.length !== 0)
            {
                var current = sceneBuffer.pop();
                THREE.GeometryUtils.merge(combined, current);
            }
            var material = new THREE.MeshPhongMaterial({
                color: 0x0000bb
            });
            var mesh = new THREE.Mesh(combined, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
        };

        this.handlenode = function(node) {
            var id = node.attributes['id'].nodeValue;
            var lon = parseFloat(node.attributes['lon'].nodeValue);
            var lat = parseFloat(node.attributes['lat'].nodeValue);
            minlat = Math.min(lat, minlat);
            minlon = Math.min(lon, minlon);
            maxlat = Math.max(lat, maxlat);
            maxlon = Math.max(lon, maxlon);
            nodes[id] = {'lon': lon, 'lat': lat};
        };

        this.handleway = function(way) {
            var id = way.attributes['id'].nodeValue;


            if ($(way).find("tag[k='highway']").length)
            {
                console.log("Is Highway", $(way).find("tag[k='name']").attr('v'));

                highways[id] = {};
                highways[id].nd = $(way).find("nd").map(function() {
                    return $(this).attr('ref');
                });
                if ($(way).find("tag[k='name']").length)
                    highways[id].name = $(way).find("tag[k='name']").attr('v');
            }
            else if ($(way).find("tag[k='building']").length)
            {
                buildings[id] = $(way).find("nd").map(function() {
                    return $(this).attr('ref');
                });
            }
            else
            {
                otherWays[id] = $(way).find("nd").map(function() {
                    return $(this).attr('ref');
                });
            }

        };

    }).call(mapRenderer.prototype);

    return mapRenderer;
}();
