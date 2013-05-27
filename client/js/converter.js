importScripts('osm2geo.js', 'tinyxmlsax.js', 'tinyxmlw3cdom.js');

onmessage = function(e) {
	var parser = new DOMImplementation();
	var xml = parser.loadXML(e.data);
	geo = osm2geo(xml);
	postMessage(geo);
	close();
}