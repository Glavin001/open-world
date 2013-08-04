importScripts('tinyxmlsax.js', 'tinyxmlw3cdom.js');

// Web worker and XML-JS version of OSM2GeoJSON

/**************************************************************************
 *                 OSM2GEO - OSM to GeoJSON converter
 * OSM to GeoJSON converter takes in a .osm XML file as input and produces
 * corresponding GeoJSON object.
 *
 * AUTHOR: Glavin Wiechert
 * CREATION DATE: Sunday, May 26, 2013
 * SPECIAL THANKS TO: P.Arunmozhi <aruntheguy@gmail.com>
 * 
 * DEPENDENCY: OSM2GEO does not depend on jQuery :).
 *
 * USAGE: This script contains a single function -> geojson osm2geo(osmXML)
 * It takes in a .osm (xml) as parameter and returns the corresponding 
 * GeoJson object.
 *
 * ***********************************************************************/
var osm2geo = function(osm){    
    var xml = osm.getDocumentElement();
    // Initialize the empty GeoJSON object
    var geo = {
        "type" : "FeatureCollection",
        "bbox": [-63.6092540,44.6088720,-63.5592540,44.6688720],
        "features" : []
    };
    // setting the bounding box [minX,minY,maxX,maxY]; x -> long, y -> lat
    function getBounds(bounds){
        if (!bounds)
            return geo["bbox"];
        var bbox = new Array;
        bbox.push(parseFloat( obj2Str (bounds.getAttribute("minlon"))));
        bbox.push(parseFloat( obj2Str (bounds.getAttribute("minlat"))));
        bbox.push(parseFloat( obj2Str (bounds.getAttribute("maxlon"))));
        bbox.push(parseFloat( obj2Str (bounds.getAttribute("maxlat"))));
        return bbox;
    }
    geo["bbox"] = getBounds(xml.getElementsByTagName("bounds").item(0));
    
    // Function to set props for a feature
    function setProps(element){
        var properties = {};
        var tags = element.getElementsByTagName("tag");
        for (var t=0; t<tags.length; t++ ) {
            var tag = tags.item(t);
            properties[tag.getAttribute("k")] = obj2Str(tag.getAttribute("v"));
        }
        return properties;
    }
    // Generic function to create a feature of given type
    function getFeature(element, type){
        return {
            "geometry" : {
                "type" : type,
                "coordinates" : []
            },
            "type" : "Feature",
            "properties" : setProps(element)
        };
    }
    // Ways
    var ways = xml.getElementsByTagName("way");
    for (var w=0; w < ways.length; w++ ) {
        var way = ways.item(w);
        var feature = new Object;
        // List all the nodes
        var nodes = way.getElementsByTagName("nd");
        // If first and last nd are same, then its a polygon
        if(obj2Str(nodes.item(0).getAttribute("ref")) === obj2Str(nodes.item(nodes.length-1).getAttribute("ref"))) {
            feature = getFeature(way, "Polygon");
            feature.geometry.coordinates.push([]);
        }else{
            feature = getFeature(way, "LineString");
        }
        for (var n=0; n < nodes.length; n++ ){
            var nd = nodes.item(n);
            var node = undefined;
            for (var i=0, nods=xml.getElementsByTagName("node"); i<nods.length; i++) {
              // find the node with id ref'ed in way
              if (obj2Str(nods.item(i).getAttribute("id"))===obj2Str(nd.getAttribute("ref"))) {
                node = nods.item(i);
                break;
              }  
            }
            var cords = [parseFloat( obj2Str (node.getAttribute("lon"))), parseFloat( obj2Str (node.getAttribute("lat")))]; // get the lat,lon of the node
            // If polygon push it inside the cords[[]]
            if(feature.geometry.type === "Polygon"){
                feature.geometry.coordinates[0].push(cords);
            }// if just Line push inside cords[]
            else{
                feature.geometry.coordinates.push(cords);
            }
        }
       // Save the LineString in the Main object
        geo.features.push(feature);
    }
    
    // Points (POI)
    var points = new Array;
    for (var p=0, ps=xml.getElementsByTagName("node"); p<ps.length; p++) {
        if ( ps.item(p).getElementsByTagName("tag").length !== 0  )
            points.push( ps.item(p) );
    }
    for (var p=0; p<points.length; p++) {
        var ele = points[p];
        var feature = getFeature(ele, "Point");
        feature.geometry.coordinates.push(parseFloat( obj2Str (ele.getAttribute('lon'))));
        feature.geometry.coordinates.push(parseFloat( obj2Str (ele.getAttribute('lat'))));
       // Save the point in Main object
        geo.features.push(feature);
    }
    
    // Finally return the GeoJSON object
    return geo;

};

var obj2Str = function (d) {
  var s = "";
  for (var p in d) {
    s+=d[p];
  }
  return s;
}

onmessage = function(e) {
	var parser = new DOMImplementation();
	var xml = parser.loadXML(e.data);
	geo = osm2geo(xml);
	postMessage(geo);
	close();
}