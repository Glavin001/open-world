var MapRenderer = function(){
    
    var mapBuffer = document.createElement("canvas");
    var backgroundLayer = document.createElement("canvas");
    var spritesLayer = document.createElement("canvas");
    var buf = mapBuffer.getContext("2d");
    var backgroundLayerContext = backgroundLayer.getContext("2d");
    var spritesLayerContext = spritesLayer.getContext("2d");
    
    var panLat = 44.6488720;
    var panLon = -63.5792540;
    var minlat, minlon;
    
    var CANVAS_WIDTH = 1024;
    var CANVAS_HEIGHT = 768;
    var CANVAS_BUF_WIDTH = 3*CANVAS_HEIGHT;
    var CANVAS_BUF_HEIGHT = 3*CANVAS_WIDTH;
    var MAX_SCALE = 100000;
    var LAT_WIDTH = CANVAS_BUF_WIDTH / MAX_SCALE;
    var LON_HEIGHT = CANVAS_BUF_HEIGHT / MAX_SCALE;
    var PADDING_LAT = (CANVAS_BUF_WIDTH - CANVAS_WIDTH)/2 / MAX_SCALE;
    var PADDING_LON = (CANVAS_BUF_HEIGHT - CANVAS_HEIGHT)/2 / MAX_SCALE;
    
    // Map data
    var nodes = {};
    var ways = {};
    
    var mapRenderer = function(container, callback) {
        this.container = container;
        this.setupCanvas(backgroundLayer);
        this.setupCanvas(spritesLayer);
        this.setupBuffer(mapBuffer);
        var self = this;
        var lo = panLon - PADDING_LON;
        var la = panLat - PADDING_LAT;
        $.ajax({ url: "/proxy?bbox="+(lo)+","+(la)+","+(lo+LON_HEIGHT)+","+(la+LAT_WIDTH) , method: "GET" })
                .done(function(data) {
            self.loadBuffer(buf, data);
            //self.drawMap(spritesLayerContext, panLat, panLon, 5000);
            callback.call();
        });
        
    };
    
    (function() {
        this.panTo = function(la, lo) {
            this.panLat = la;
            this.panLon = lo;
        };
        
        this.testDraw = function() {
            backgroundLayerContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            this.drawMap(backgroundLayerContext, this.panLat, this.panLon, 5000);
        };
        
        this.setupCanvas = function(canvasEl) {
            canvasEl.width = CANVAS_WIDTH;
            canvasEl.height = CANVAS_HEIGHT;
            canvasEl.style.left = 0;
            canvasEl.style.top = 0;
            $(canvasEl).css( { position:"absolute" } );
            this.container.append(canvasEl);
        };

        this.setupBuffer = function(canvasEl){
            canvasEl.width = CANVAS_BUF_WIDTH;
            canvasEl.height = CANVAS_BUF_HEIGHT;
        };
        
        this.loadBuffer = function(g, xmlDoc) {
            
            //  <bounds minlat="44.6488720" minlon="-63.5792540" maxlat="44.6496050" maxlon="-63.5725590"/>
            var bounds = $(xmlDoc).find("bounds");
            minlat = bounds.attr('minlat');
            minlon = bounds.attr('minlon');
            var maxlat = bounds.attr('maxlat');
            var maxlon = bounds.attr('maxlon');
            
            for (var c=0, length=xmlDoc.documentElement.childNodes.length; c<length; c++)
            {
                var child = xmlDoc.documentElement.childNodes[c];
                var tag = child.tagName;
                var func = this['handle' + tag];
                typeof func === 'function' && func(child);
            }
            
            g.save();
            
            // Iterate throught the ways
            for (var key in ways) {
                if (ways.hasOwnProperty(key)) {
                    var way = ways[key];
                    
                    g.beginPath();
                    g.lineWidth = 10;
                    
                    var startPoint = true;
                    $(way).each(function() {
                        var currNode = nodes[this];
                        g.fillStyle = "#000";
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
                        }
                        else
                        {
                            g.lineTo(lon, lat);
                        }
                    });
                    //g.closePath();
                    g.stroke();
                }
            }     
            
            g.restore();

        };
        
        this.drawMap = function(g, lat, lon, scale)
        {
            var s = scale / MAX_SCALE;
            var bufLat = (lat - minlat) * MAX_SCALE;
            var bufLon = (lon - minlon) * MAX_SCALE;
            var bufferImage = buf.getImageData(bufLon, bufLat, CANVAS_WIDTH / s, CANVAS_HEIGHT / s);
            g.save();
            
            g.scale(s, s);
            g.putImageData(bufferImage, 0, 0);
            
            g.restore();
        };
        
        this.handlenode = function (node) {
            var id = node.attributes['id'].nodeValue;
            var lon = node.attributes['lon'].nodeValue;
            var lat = node.attributes['lat'].nodeValue;
            //console.log("node:",id,lon,lat);
            nodes[id] = {'lon':lon,'lat':lat};
        };
        
        this.handleway = function(way) {
            var id = way.attributes['id'].nodeValue;


            if ( !$(way).find("tag[k='highway']").length)
            {
                //console.log("Not highway");
                return;
            }

            ways[id] = $(way).find("nd").map( function () { return $(this).attr('ref'); } );
        };

    }).call(mapRenderer.prototype);

    return mapRenderer;
}();