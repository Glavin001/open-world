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
    var xml = osm.documentElement;
    // Initialize the empty GeoJSON object
    var geo = {
        "type" : "FeatureCollection",
        "features" : []
    };
    // setting the bounding box [minX,minY,maxX,maxY]; x -> long, y -> lat
    function getBounds(bounds){
        var bbox = new Array;
        bbox.push(parseFloat(bounds.getAttribute("minlon")));
        bbox.push(parseFloat(bounds.getAttribute("minlat")));
        bbox.push(parseFloat(bounds.getAttribute("maxlon")));
        bbox.push(parseFloat(bounds.getAttribute("maxlat")));
        return bbox;
    }
    geo["bbox"] = getBounds(xml.getElementsByTagName("bounds")[0]);
    
    // Function to set props for a feature
    function setProps(element){
        var properties = {};
        var tags = element.getElementsByTagName("tag");
        for (var t=0; t<tags.length; t++ ) {
            var tag = tags[t];
            properties[tag.getAttribute("k")] = tag.getAttribute("v");
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
        var way = ways[w];
        var feature = new Object;
        // List all the nodes
        var nodes = way.getElementsByTagName("nd");
        // If first and last nd are same, then its a polygon
        if(nodes[0].getAttribute("ref") === nodes[nodes.length-1].getAttribute("ref")) {
            feature = getFeature(way, "Polygon");
            feature.geometry.coordinates.push([]);
        }else{
            feature = getFeature(way, "LineString");
        }
        for (var n=0; n < nodes.length; n++ ){
            var nd = nodes[n];
            var node = undefined;
            for (var i=0, nods=xml.getElementsByTagName("node"); i<nods.length; i++) {
              // find the node with id ref'ed in way
              if (nods[i].getAttribute("id")===nd.getAttribute("ref")) {
                node = nods[i];
                break;
              }  
            }
            var cords = [parseFloat(node.getAttribute("lon")), parseFloat(node.getAttribute("lat"))]; // get the lat,lon of the node
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
        if ( ps[p].getElementsByTagName("tag").length !== 0  )
            points.push( ps[p] );
    }
    for (var p=0; p<points.length; p++) {
        var ele = points[p];
        var feature = getFeature(ele, "Point");
        feature.geometry.coordinates.push(parseFloat(ele.getAttribute('lon')));
        feature.geometry.coordinates.push(parseFloat(ele.getAttribute('lat')));
       // Save the point in Main object
        geo.features.push(feature);
    }
    
    // Finally return the GeoJSON object
    return geo;

};
