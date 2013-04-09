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
        //$.ajax({ url: "halifax1.xml" , method: "GET" })
        //$.ajax({url: "germany1.xml", method: "GET"})
        //$.ajax({url: "halifax2_large.xml", method: "GET"})
        //$.ajax({url: "halifax3_large.xml", method: "GET"})
        $.ajax({url: "halifax4_super_large.xml", method: "GET"})
                .done(function(mapData) {
            console.log("Done: Have Map Data");
            self.loadMap(mapData);
            //self.drawMap(spritesLayerContext, panLat, panLon, 5000);
            callback.call();
        });

    };

    (function() {

        this.loadMap = function(xmlDoc) {

            //  <bounds minlat="44.6488720" minlon="-63.5792540" maxlat="44.6496050" maxlon="-63.5725590"/>
            var bounds = $(xmlDoc).find("bounds");
            minlat = parseFloat(bounds.attr('minlat'));
            minlon = parseFloat(bounds.attr('minlon'));
            maxlat = parseFloat(bounds.attr('maxlat'));
            maxlon = parseFloat(bounds.attr('maxlon'));
            console.log("Bounds:", minlon, minlat, maxlon, maxlat);

            for (var c = 0, length = xmlDoc.documentElement.childNodes.length; c < length; c++)
            {
                var child = xmlDoc.documentElement.childNodes[c];
                var tag = child.tagName;
                var func = this['handle' + tag];
                typeof func === 'function' && func(child);
            }
            console.log("Bounds:", minlon, minlat, maxlon, maxlat);
            panLat = (maxlat - minlat) / 2;
            panLon = (maxlon - minlon) / 2;

            // 

            /*
             // Iterate throught the otherWays
             console.log("otherWays:",otherWays);
             for (var key in otherWays) {
             if (otherWays.hasOwnProperty(key)) {
             var way = otherWays[key];
             
             // Draw highway blacktop
             var startPoint = true;
             var prevLon = 0;
             var prevLat = 0;
             var elevation = 0;
             
             var startPoint = true;
             $(way).each(function() {
             var currNode = nodes[this];
             var lat = currNode.lat;
             var lon = currNode.lon;
             // Scale lat and lon
             if (lon < minlon)
             console.log("Out of Bounds:", lon, minlon);
             if (lat < minlat)
             console.log("Out of Bounds:", lat, minlat);
             lon = ( lon - minlon ) * MAX_SCALE; 
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
             geometry.vertices.push( new THREE.Vector3( prevLon, elevation, prevLat ) ); // top left
             geometry.vertices.push( new THREE.Vector3( lon, elevation, lat ) ); // bottom right
             var asphalt = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.7, lineWidth: 10});
             var otherWay = new THREE.Line(geometry, asphalt);
             otherWay.matrixAutoUpdate = false;
             scene.add(otherWay);
             //console.log("Add road", road, lon, lat);
             
             prevLon = lon;
             prevLat = lat;
             }
             });
             
             }
             }     
             */

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
                            geometry.vertices.push(new THREE.Vector3(prevLon, elevation + buildingHeight, prevLat));
                            geometry.vertices.push(new THREE.Vector3(lon, elevation + buildingHeight, lat));
                            geometry.vertices.push(new THREE.Vector3(lon, elevation, lat));
                            geometry.faces.push(new THREE.Face4(0, 1, 2, 3));
                            geometry.faces.push(new THREE.Face4(3, 2, 1, 0));
                            geometry.computeBoundingSphere();

                            var material = new THREE.MeshPhongMaterial({
                                color: 0x0000bb
                            });
                            //var wall = new THREE.MeshNormalMaterial();
                            var unknownObj = new THREE.Mesh(geometry, material);
                            unknownObj.matrixAutoUpdate = false;
                            //scene.add(building);
                            unknownObj.castShadow = true;
                            unknownObj.receiveShadow = true;

                            sceneBuffer.push(unknownObj);
                            /*
                             setTimeout(function( ) {
                             scene.add(building);
                             }, 10);
                             */
                            /*
                             geometry.vertices.push( new THREE.Vector3( prevLon, elevation, prevLat ) ); // top left
                             geometry.vertices.push( new THREE.Vector3( lon, elevation, lat ) ); // bottom right
                             var asphalt = new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.5, lineWidth: 1});
                             var road = new THREE.Line(geometry, asphalt);
                             scene.add(road);
                             //console.log("Add road", road, lon, lat);
                             */

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
            /*
             var material = new THREE.MeshPhongMaterial({
             ambient: 0x444444,
             color: 0x8844AA,
             shininess: 300,
             specular: 0x33AA33,
             shading: THREE.SmoothShading
             //, map	: texture
             });*/
            var material = new THREE.MeshPhongMaterial({
                color: 0x0000bb,
                shininess: 100.0,
                ambient: 0xff0000,
                emissive: 0x111111,
                specular: 0xbbbbbb
            });
            //var material = new THREE.MeshLambertMaterial( { color: 0x000000, shading: THREE.FlatShading } );
            // var wall = new THREE.MeshNormalMaterial();
            var mesh = new THREE.Mesh(combined, material);
            //var group = new THREE.Object3D();
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            //group.add(mesh);
            //group.castShadow = true;
            //group.receiveShadow = true;
            scene.add(mesh);



            // Iterate throught the highways
            //var asphalt = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("img/asphalt.jpg") });  
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
                            //var asphalt = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("img/asphalt.jpg") });
                            var road = new THREE.Mesh(geometry, asphalt);
                            road.matrixAutoUpdate = false;
                            sceneBuffer.push(road);
                            /*
                             setTimeout(function( ) {
                             scene.add(road);
                             }, 10);
                             */

                            /*
                             geometry.vertices.push( new THREE.Vector3( prevLon, elevation, prevLat ) ); // top left
                             geometry.vertices.push( new THREE.Vector3( lon, elevation, lat ) ); // bottom right
                             var asphalt = new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.5, lineWidth: 1});
                             var road = new THREE.Line(geometry, asphalt);
                             scene.add(road);
                             //console.log("Add road", road, lon, lat);
                             */

                            prevLon = lon;
                            prevLat = lat;
                        }
                    });

                   // if (streetSignBuffer.length < 30) { // Limit the amount of Street Signs to be drawn
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
                        //var parent = new THREE.Object3D();
                        //parent.add(text);
                        //parent.receiveShadow = true;
                        //parent.doubleSided = true;
                        //parent.matrixAutoUpdate = false;
                        streetSignBuffer.push(text);
                        console.log("Street Sign");
                        //scene.add(parent);
                    // }

                    /*
                     // Draw highway dotted while line
                     g.beginPath();
                     g.lineWidth = 1;
                     g.strokeStyle = "rgba(255,255,255,0.9)";
                     var startPoint = true;
                     var prevLon = 0;
                     var prevLat = 0;
                     $(way).each(function() {
                     var currNode = nodes[this];
                     var lat = currNode.lat;
                     var lon = currNode.lon;
                     // Scale lat and lon
                     lon = ( lon - minlon ) * MAX_SCALE; 
                     lat = ( lat - minlat ) * MAX_SCALE;
                     
                     //console.log(lat,lon);
                     //g.fillRect(lon, lat, 2, 2);
                     if (startPoint)
                     {
                     startPoint = false;
                     g.moveTo(lon, lat);
                     prevLon = lon;
                     prevLat = lat;
                     }
                     else
                     {
                     //g.lineTo(lon, lat);
                     g.dashedLineTo(prevLon,prevLat,lon,lat,[3,3]);
                     prevLon = lon;
                     prevLat = lat;
                     }
                     });
                     g.stroke();
                     */

                }
            }
            var combined = new THREE.Geometry();
            while (sceneBuffer.length !== 0)
            {
                var current = sceneBuffer.pop();
                THREE.GeometryUtils.merge(combined, current);
            }
            //var asphalt = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("img/asphalt.jpg")});
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
            //var asphalt = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("img/asphalt.jpg")});
            //var asphalt = new THREE.MeshBasicMaterial({color: 0x000000, lineWidth: 10});
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

                    $(way).each(function() {
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

                            buildingPoints.push(new THREE.Vector2(lon, lat));

                        }
                        else
                        {

                            buildingPoints.push(new THREE.Vector2(lon, lat));
                            /*
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
                            //var wall = new THREE.MeshNormalMaterial();
                            var building = new THREE.Mesh(geometry, material);
                            building.matrixAutoUpdate = false;
                            //scene.add(building);
                            building.castShadow = true;
                            building.receiveShadow = true;
                            sceneBuffer.push(building);
                            */
                           
                            /*
                             setTimeout(function( ) {
                             scene.add(building);
                             }, 10);
                             */
                            /*
                             geometry.vertices.push( new THREE.Vector3( prevLon, elevation, prevLat ) ); // top left
                             geometry.vertices.push( new THREE.Vector3( lon, elevation, lat ) ); // bottom right
                             var asphalt = new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.5, lineWidth: 1});
                             var road = new THREE.Line(geometry, asphalt);
                             scene.add(road);
                             //console.log("Add road", road, lon, lat);
                             */

                            prevLon = lon;
                            prevLat = lat;
                        }
                    });
                    
                     var buildingShape = new THREE.Shape(buildingPoints);
                     
                     var extrusionSettings = {
                     size: 1, height: 1, curveSegments: 3,
                     bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
                     material: 0, extrudeMaterial: 1
                     };
                     
                     var buildingGeometry = new THREE.ExtrudeGeometry(buildingShape, extrusionSettings);
                     
                     var materialFront = new THREE.MeshBasicMaterial({color: 0xffff00});
                     var materialSide = new THREE.MeshBasicMaterial({color: 0xff8800});
                     var materialArray = [materialFront, materialSide];
                     var buildingMaterial = new THREE.MeshFaceMaterial(materialArray);
                     
                     var building = new THREE.Mesh(buildingGeometry, buildingMaterial);
                     building.position.set(0, -1500, 0);
                     //scene.add(building);
                     sceneBuffer.push(building);
                     

                }
            }
            var combined = new THREE.Geometry();
            while (sceneBuffer.length !== 0)
            {
                var current = sceneBuffer.pop();
                THREE.GeometryUtils.merge(combined, current);
            }
            /*
             var material = new THREE.MeshPhongMaterial({
             ambient: 0x444444,
             color: 0x8844AA,
             shininess: 300,
             specular: 0x33AA33,
             shading: THREE.SmoothShading
             //, map	: texture
             });*/
            var material = new THREE.MeshPhongMaterial({
                color: 0x0000bb,
                shininess: 100.0,
                ambient: 0xff0000,
                emissive: 0x111111,
                specular: 0xbbbbbb
            });
            var material = new THREE.MeshLambertMaterial({color: 0x000000, shading: THREE.FlatShading});
            // var wall = new THREE.MeshNormalMaterial();
            var mesh = new THREE.Mesh(combined, material);
            //var group = new THREE.Object3D();
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            //group.add(mesh);
            //group.castShadow = true;
            //group.receiveShadow = true;
            scene.add(mesh);


            /*for (var key in buildings) {
             if (buildings.hasOwnProperty(key)) {
             var way = buildings[key];
             
             g.beginPath();
             //g.lineWidth = 10;
             g.fillStyle = "rgba(255,0,0,0.7)";
             
             var startPoint = true;
             $(way).each(function() {
             var currNode = nodes[this];
             var lat = currNode.lat;
             var lon = currNode.lon;
             // Scale lat and lon
             if (lon < minlon)
             console.log("Out of Bounds:", lon, minlon);
             if (lat < minlat)
             console.log("Out of Bounds:", lat, minlat);
             lon = ( lon - minlon ) * MAX_SCALE; 
             lat = (lat - minlat) * MAX_SCALE;
             //console.log(lat,lon);
             //g.fillRect(lon, lat, 2, 2);
             if (startPoint)
             {
             startPoint = false;
             g.moveTo(lon, lat);
             }
             else
             {
             g.lineTo(lon, lat);
             }
             });
             //g.closePath();
             //g.stroke();
             g.fill();
             }
             } 
             */


            console.log(panLon, minlon, panLat, minlat, MAX_SCALE);
            camera.position.x = (panLon) * MAX_SCALE;
            camera.position.z = (panLat) * MAX_SCALE;
            camera.position.y = 300;
            console.log(camera.position);

            // camera.lookAt( { x: camera.position.x + 0, y: camera.position.y - 10 , z: camera.position.z } );

            setTimeout(this.processSceneBuffer, 1);

        };

        this.processSceneBuffer = function processSceneBuffer() {
            console.log(sceneBuffer.length);
            /*
             var i = 0;
             var max = 100;
             while (sceneBuffer.length !== 0 && i < max)
             {
             i++;
             var current = sceneBuffer.pop();
             scene.add(current);
             }
             if (sceneBuffer.length === 0)
             {
             renderer.render(scene, camera);
             console.log("Done drawing.");
             }
             else
             {
             setTimeout(processSceneBuffer, 10);
             }
             */
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

            //console.log("Bounds:",minlon,minlat,maxlon,maxlat);

            minlat = Math.min(lat, minlat);
            minlon = Math.min(lon, minlon);
            maxlat = Math.max(lat, maxlat);
            maxlon = Math.max(lon, maxlon);

            //console.log("node:",id,lon,lat);
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
                /*
                 highways[id].tag = $(way).find("tag").map(function() {
                 //var obj = {};
                 //obj[$(this).attr('k')] = $(this).attr('v');
                 console.log($(this));
                 //console.log("k:",$(this).attr('k'),"v:",$(this).attr('v'));
                 //highways[id].tag[$(this).attr('k')] = $(this).attr('v');
                 return 0; //$(this).attr('v');
                 });
                 */
                if ($(way).find("tag[k='name']").length)
                    highways[id].name = $(way).find("tag[k='name']").attr('v');
            }
            else if ($(way).find("tag[k='building']").length)
            {
                //console.log("Is Building");
                buildings[id] = $(way).find("nd").map(function() {
                    return $(this).attr('ref');
                });
            }
            else
            {
                //console.log("Is Other");
                //$(way).find("tag").each( function () { console.log(this); } );
                otherWays[id] = $(way).find("nd").map(function() {
                    return $(this).attr('ref');
                });
            }

        };

    }).call(mapRenderer.prototype);

    return mapRenderer;
}();


