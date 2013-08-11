define(function(require, exports, module) { /* similar to equi.js FIXME proj4 uses eqc */
  var common = require('../common');

  module.exports = {
    init: function() {

      this.x0 = this.x0 || 0;
      this.y0 = this.y0 || 0;
      this.lat0 = this.lat0 || 0;
      this.long0 = this.long0 || 0;
      this.lat_ts = this.lat_t || 0;
      this.title = this.title || "Equidistant Cylindrical (Plate Carre)";

      this.rc = Math.cos(this.lat_ts);
    },


    // forward equations--mapping lat,long to x,y
    // -----------------------------------------------------------------
    forward: function(p) {

      var lon = p.x;
      var lat = p.y;

      var dlon = common.adjust_lon(lon - this.long0);
      var dlat = common.adjust_lat(lat - this.lat0);
      p.x = this.x0 + (this.a * dlon * this.rc);
      p.y = this.y0 + (this.a * dlat);
      return p;
    },

    // inverse equations--mapping x,y to lat/long
    // -----------------------------------------------------------------
    inverse: function(p) {

      var x = p.x;
      var y = p.y;

      p.x = common.adjust_lon(this.long0 + ((x - this.x0) / (this.a * this.rc)));
      p.y = common.adjust_lat(this.lat0 + ((y - this.y0) / (this.a)));
      return p;
    }

  };

});
