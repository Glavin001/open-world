define(function(require, exports, module) {
  /*******************************************************************************
NAME                            LAMBERT CONFORMAL CONIC

PURPOSE:  Transforms input longitude and latitude to Easting and
    Northing for the Lambert Conformal Conic projection.  The
    longitude and latitude must be in radians.  The Easting
    and Northing values will be returned in meters.


ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
*******************************************************************************/


  //<2104> +proj=lcc +lat_1=10.16666666666667 +lat_0=10.16666666666667 +lon_0=-71.60561777777777 +k_0=1 +x0=-17044 +x0=-23139.97 +ellps=intl +units=m +no_defs  no_defs

  // Initialize the Lambert Conformal conic projection
  // -----------------------------------------------------------------

  //proj4.Proj.lcc = Class.create();
  var common = require('../common');

  module.exports = {
    init: function() {

      // array of:  r_maj,r_min,lat1,lat2,c_lon,c_lat,false_east,false_north
      //double c_lat;                   /* center latitude                      */
      //double c_lon;                   /* center longitude                     */
      //double lat1;                    /* first standard parallel              */
      //double lat2;                    /* second standard parallel             */
      //double r_maj;                   /* major axis                           */
      //double r_min;                   /* minor axis                           */
      //double false_east;              /* x offset in meters                   */
      //double false_north;             /* y offset in meters                   */

      if (!this.lat2) {
        this.lat2 = this.lat1;
      } //if lat2 is not defined
      if (!this.k0) {
        this.k0 = 1;
      }

      // Standard Parallels cannot be equal and on opposite sides of the equator
      if (Math.abs(this.lat1 + this.lat2) < common.EPSLN) {
        //proj4.reportError("lcc:init: Equal Latitudes");
        return;
      }

      var temp = this.b / this.a;
      this.e = Math.sqrt(1 - temp * temp);

      var sin1 = Math.sin(this.lat1);
      var cos1 = Math.cos(this.lat1);
      var ms1 = common.msfnz(this.e, sin1, cos1);
      var ts1 = common.tsfnz(this.e, this.lat1, sin1);

      var sin2 = Math.sin(this.lat2);
      var cos2 = Math.cos(this.lat2);
      var ms2 = common.msfnz(this.e, sin2, cos2);
      var ts2 = common.tsfnz(this.e, this.lat2, sin2);

      var ts0 = common.tsfnz(this.e, this.lat0, Math.sin(this.lat0));

      if (Math.abs(this.lat1 - this.lat2) > common.EPSLN) {
        this.ns = Math.log(ms1 / ms2) / Math.log(ts1 / ts2);
      }
      else {
        this.ns = sin1;
      }
      this.f0 = ms1 / (this.ns * Math.pow(ts1, this.ns));
      this.rh = this.a * this.f0 * Math.pow(ts0, this.ns);
      if (!this.title) {
        this.title = "Lambert Conformal Conic";
      }
    },


    // Lambert Conformal conic forward equations--mapping lat,long to x,y
    // -----------------------------------------------------------------
    forward: function(p) {

      var lon = p.x;
      var lat = p.y;

      // singular cases :
      if (Math.abs(2 * Math.abs(lat) - common.PI) <= common.EPSLN) {
        lat = common.sign(lat) * (common.HALF_PI - 2 * common.EPSLN);
      }

      var con = Math.abs(Math.abs(lat) - common.HALF_PI);
      var ts, rh1;
      if (con > common.EPSLN) {
        ts = common.tsfnz(this.e, lat, Math.sin(lat));
        rh1 = this.a * this.f0 * Math.pow(ts, this.ns);
      }
      else {
        con = lat * this.ns;
        if (con <= 0) {
          //proj4.reportError("lcc:forward: No Projection");
          return null;
        }
        rh1 = 0;
      }
      var theta = this.ns * common.adjust_lon(lon - this.long0);
      p.x = this.k0 * (rh1 * Math.sin(theta)) + this.x0;
      p.y = this.k0 * (this.rh - rh1 * Math.cos(theta)) + this.y0;

      return p;
    },

    // Lambert Conformal Conic inverse equations--mapping x,y to lat/long
    // -----------------------------------------------------------------
    inverse: function(p) {

      var rh1, con, ts;
      var lat, lon;
      var x = (p.x - this.x0) / this.k0;
      var y = (this.rh - (p.y - this.y0) / this.k0);
      if (this.ns > 0) {
        rh1 = Math.sqrt(x * x + y * y);
        con = 1;
      }
      else {
        rh1 = -Math.sqrt(x * x + y * y);
        con = -1;
      }
      var theta = 0;
      if (rh1 !== 0) {
        theta = Math.atan2((con * x), (con * y));
      }
      if ((rh1 !== 0) || (this.ns > 0)) {
        con = 1 / this.ns;
        ts = Math.pow((rh1 / (this.a * this.f0)), con);
        lat = common.phi2z(this.e, ts);
        if (lat === -9999) {
          return null;
        }
      }
      else {
        lat = -common.HALF_PI;
      }
      lon = common.adjust_lon(theta / this.ns + this.long0);

      p.x = lon;
      p.y = lat;
      return p;
    }
  };

});
