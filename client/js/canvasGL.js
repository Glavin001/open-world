var MapRenderer = function() {

    var panLat = 44.6488720;
    var panLon = -63.5792540;
    var scaleXY = 100000;
    var minlat, minlon, maxlat, maxlon;

    var CANVAS_WIDTH = 1024;
    var CANVAS_HEIGHT = 768;
    var CANVAS_BUF_WIDTH = 8 * CANVAS_WIDTH;
    var CANVAS_BUF_HEIGHT = 8 * CANVAS_HEIGHT;
    var MAX_SCALE = 100000;
    var LON_WIDTH = CANVAS_BUF_WIDTH / MAX_SCALE;
    var LAT_HEIGHT = CANVAS_BUF_HEIGHT / MAX_SCALE;
    var PADDING_LON = (CANVAS_BUF_WIDTH - CANVAS_WIDTH) / 2 / MAX_SCALE;
    var PADDING_LAT = (CANVAS_BUF_HEIGHT - CANVAS_HEIGHT) / 2 / MAX_SCALE;

    // Map data
    var sceneBuffer = [];  // Stores all objects before pushing them to the scene
    var streetSignBuffer = [];
    var nodes = {};
    var highways = {};
    var buildings = {};
    var otherWays = {};
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

            var bounds = $(xmlDoc).find("bounds");
            minlat = parseFloat(bounds.attr('minlat'));
            minlon = parseFloat(bounds.attr('minlon'));
            maxlat = parseFloat(bounds.attr('maxlat'));
            maxlon = parseFloat(bounds.attr('maxlon'));
            console.log("Bounds:", minlon, minlat, maxlon, maxlat);
    		
            var geo = osm2geo(xmlDoc);
            console.log("Done parsing to GeoJSON.");
            console.log(geo);
			console.log(geo.features.length);

            for (var c = 0, length = geo.features.length; c < length; c++)
            {
				var typeCheck = geo.features[c].properties;
				
				if(typeCheck.hasOwnProperty('building') || typeCheck.hasOwnProperty('amenity')) {
					buildings[c] = geo.features[c];
				}
            }
            console.log("Bounds:", minlon, minlat, maxlon, maxlat);
            panLat = (maxlat - minlat) / 2;
            panLon = (maxlon - minlon) / 2;

				for (var key in otherWays) {
                if (otherWays.hasOwnProperty(key)) {
                    var way = otherWays[key];

                    // Draw highway blacktop
                    var startPoint = true;
                    var prevLon = 0;
                    var prevLat = 0;
                    var elevation = 0;
                    var buildingHeight = 10;
                    var roadWidth = 1;

                    var startPoint = true;
                    $(way).each(function() {
                        var currNode = nodes[this];
                        var lat = currNode.lat;
                        var lon = currNode.lon;
                        if (lon < minlon)
                            console.log("Out of Bounds:", lon, minlon);
                        if (lat < minlat)
                            console.log("Out of Bounds:", lat, minlat);
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

                            var geometry = new THREE.Geometry();
                            geometry.vertices.push(new THREE.Vector3(prevLon, elevation, prevLat));
                            geometry.vertices.push(new THREE.Vector3(prevLon, elevation + buildingHeight, prevLat));
                            geometry.vertices.push(new THREE.Vector3(lon, elevation + buildingHeight, lat));
                            geometry.vertices.push(new THREE.Vector3(lon, elevation, lat));
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

                            sceneBuffer.push(unknownObj);
                            prevLon = lon;
                            prevLat = lat;
                        }
                    });

                }
            }
            var combined = new THREE.Geometry();
            while (sceneBuffer.length !== 0)
            {
                var current = sceneBuffer.pop();
                THREE.GeometryUtils.merge(combined, current);
            }
            var material = new THREE.MeshPhongMaterial({
                color: 0x0000bb,
                shininess: 100.0,
                ambient: 0xff0000,
                emissive: 0x111111,
                specular: 0xbbbbbb
            });
            var mesh = new THREE.Mesh(combined, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);

			console.log("Highways:", highways);
            for (var key in highways) {
                if (highways.hasOwnProperty(key)) {
                    var way = highways[key];

                    // Draw highway blacktop
                    var startPoint = true;
                    var prevLon = 0;
                    var prevLat = 0;
                    var elevation = 0;
                    var roadWidth = 10;

                    var startPoint = true;
                    $(way.nd).each(function() {
                        var currNode = nodes[this];
                        var lat = currNode.lat;
                        var lon = currNode.lon;
                        // Scale lat and lon
                        if (lon < minlon)
                            console.log("Out of Bounds:", lon, minlon);
                        if (lat < minlat)
                            console.log("Out of Bounds:", lat, minlat);
                        lon = (lon - minlon) * MAX_SCALE;
                        lat = (lat - minlat) * MAX_SCALE;
                        //console.log(lat,lon);

                        if (startPoint)
                        {
                            startPoint = false;
                            prevLon = lon;
                            prevLat = lat;
                        }
                        else
                        {

                            var geometry = new THREE.Geometry();
                            geometry.vertices.push(new THREE.Vector3(prevLon, elevation, prevLat));
                            geometry.vertices.push(new THREE.Vector3(prevLon, elevation, prevLat - roadWidth));
                            geometry.vertices.push(new THREE.Vector3(lon, elevation, lat - roadWidth));
                            geometry.vertices.push(new THREE.Vector3(lon, elevation, lat));
                            geometry.faces.push(new THREE.Face4(0, 1, 2, 3));
                            geometry.faces.push(new THREE.Face4(3, 2, 1, 0));
                            geometry.computeBoundingSphere();
                            var asphalt = new THREE.MeshBasicMaterial({color: 0x000000, lineWidth: 10});
							var road = new THREE.Mesh(geometry, asphalt);
                            road.matrixAutoUpdate = false;
                            sceneBuffer.push(road);
							
                            prevLon = lon;
                            prevLat = lat;
                        }
                    });

						var theText = 'Unknown Street';
                        console.log(way);
                        theText = (way.name) ? way.name : theText;
                        var text3d = new THREE.TextGeometry(theText, {
                            size: 3,
                            height: 1,
                            curveSegments: 1,
                            font: "helvetiker"
                        });
                        text3d.computeBoundingBox();
                        var centerOffset = -0.5 * (text3d.boundingBox.max.x - text3d.boundingBox.min.x);
                        var textMaterial = new THREE.MeshPhongMaterial({color: Math.random() * 0xffffff, overdraw: true});
                        var text = new THREE.Mesh(text3d, textMaterial);
                        text.position.x = prevLon + centerOffset;
                        text.position.y = elevation + 10;
                        text.position.z = prevLat;
                        text.rotation.x = 0;
                        text.rotation.y = Math.PI * 2;
                        streetSignBuffer.push(text);
                        console.log("Street Sign");
						}
            }
            var combined = new THREE.Geometry();
            while (sceneBuffer.length !== 0)
            {
                var current = sceneBuffer.pop();
                THREE.GeometryUtils.merge(combined, current);
            }
            var asphalt = new THREE.MeshBasicMaterial({color: 0x000000, lineWidth: 10});
            var mesh = new THREE.Mesh(combined, asphalt);
            scene.add(mesh);

            var combinedStreets = new THREE.Geometry();
            while (streetSignBuffer.length !== 0)
            {
                console.log("Street Buff");
                var current = streetSignBuffer.pop();
                THREE.GeometryUtils.merge(combinedStreets, current);
            }
            var mesh2 = new THREE.Mesh(combinedStreets, asphalt);
            scene.add(mesh2);


            // Iterate throught the buildings
            console.log("Buildings:", buildings);
            for (var key in buildings) {
                if (buildings.hasOwnProperty(key)) {
                    var way = buildings[key];

                    // Draw highway blacktop
                    var startPoint = true;
                    var prevLon = 0;
                    var prevLat = 0;
                    var elevation = 0;
                    var buildingHeight = 50;
                    var roadWidth = 1;

                    var startPoint = true;
                    var buildingPoints = [];

                    $(way.geometry.coordinates[0]).each(function(index) {
						//Gets lat and lon from array
						if(isNaN(way.geometry.coordinates[0]))
						{
                        	var lon = way.geometry.coordinates[0][index][0];
                        	var lat = way.geometry.coordinates[0][index][1];
						} else {
							var lon = way.geometry.coordinates[0];
							var lat = way.geometry.coordinates[1];
						}
												
                        // Scale lat and lon
                        if (lon < minlon)
                            console.log("Out of Bounds:", lon, minlon);
                        if (lat < minlat)
                            console.log("Out of Bounds:", lat, minlat);
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
                            
                            var geometry = new THREE.Geometry();
                            geometry.vertices.push(new THREE.Vector3(prevLon, elevation, prevLat));
                            geometry.vertices.push(new THREE.Vector3(prevLon, elevation + buildingHeight, prevLat));
                            geometry.vertices.push(new THREE.Vector3(lon, elevation + buildingHeight, lat));
                            geometry.vertices.push(new THREE.Vector3(lon, elevation, lat));
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
                            sceneBuffer.push(building);

                            prevLon = lon;
                            prevLat = lat;
                        }

                    });
                }
            }
			var combined = new THREE.Geometry();
            while (sceneBuffer.length !== 0)
            {
                var current = sceneBuffer.pop();
                THREE.GeometryUtils.merge(combined, current);
            }
			
            var material = new THREE.MeshPhongMaterial({
                color: 0x0000bb,
                shininess: 100.0,
                ambient: 0xff0000,
                emissive: 0x111111,
                specular: 0xbbbbbb
            });
            var material = new THREE.MeshLambertMaterial({color: 0x000000, shading: THREE.FlatShading});
            var mesh = new THREE.Mesh(combined, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);

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
