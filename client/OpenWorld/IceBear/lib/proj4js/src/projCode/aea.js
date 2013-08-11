define(function(require, exports, module) {
  /*******************************************************************************
NAME                     ALBERS CONICAL EQUAL AREA 

PURPOSE:  Transforms input longitude and latitude to Easting and Northing
    for the Albers Conical Equal Area projection.  The longitude
    and latitude must be in radians.  The Easting and Northing
    values will be returned in meters.

PROGRAMMER              DATE
----------              ----
T. Mittan,         Feb, 1992

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/
  var common = require('../common');

  module.exports = {
    init: function() {

      if (Math.abs(this.lat1 + this.lat2) < common.EPSLN) {
        //proj4.reportError("aeaInitEqualLatitudes");
        return;
      }
      this.temp = this.b / this.a;
      this.es = 1 - Math.pow(this.temp, 2);
      this.e3 = Math.sqrt(this.es);

      this.sin_po = Math.sin(this.lat1);
      this.cos_po = Math.cos(this.lat1);
      this.t1 = this.sin_po;
      this.con = this.sin_po;
      this.ms1 = common.msfnz(this.e3, this.sin_po, this.cos_po);
      this.qs1 = common.qsfnz(this.e3, this.sin_po, this.cos_po);

      this.sin_po = Math.sin(this.lat2);
      this.cos_po = Math.cos(this.lat2);
      this.t2 = this.sin_po;
      this.ms2 = common.msfnz(this.e3, this.sin_po, this.cos_po);
      this.qs2 = common.qsfnz(this.e3, this.sin_po, this.cos_po);

      this.sin_po = Math.sin(this.lat0);
      this.cos_po = Math.cos(this.lat0);
      this.t3 = this.sin_po;
      this.qs0 = common.qsfnz(this.e3, this.sin_po, this.cos_po);

      if (Math.abs(this.lat1 - this.lat2) > common.EPSLN) {
        this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1);
      }
      else {
        this.ns0 = this.con;
      }
      this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1;
      this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0;
    },

    /* Albers Conical Equal Area forward equations--mapping lat,long to x,y
  -------------------------------------------------------------------*/
    forward: function(p) {

      var lon = p.x;
      var lat = p.y;

      this.sin_phi = Math.sin(lat);
      this.cos_phi = Math.cos(lat);

      var qs = common.qsfnz(this.e3, this.sin_phi, this.cos_phi);
      var rh1 = this.a * Math.sqrt(this.c - this.ns0 * qs) / this.ns0;
      var theta = this.ns0 * common.adjust_lon(lon - this.long0);
      var x = rh1 * Math.sin(theta) + this.x0;
      var y = this.rh - rh1 * Math.cos(theta) + this.y0;

      p.x = x;
      p.y = y;
      return p;
    },


    inverse: function(p) {
      var rh1, qs, con, theta, lon, lat;

      p.x -= this.x0;
      p.y = this.rh - p.y + this.y0;
      if (this.ns0 >= 0) {
        rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
        con = 1;
      }
      else {
        rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
        con = -1;
      }
      theta = 0;
      if (rh1 !== 0) {
        theta = Math.atan2(con * p.x, con * p.y);
      }
      con = rh1 * this.ns0 / this.a;
      if (this.sphere) {
        lat = Math.asin((this.c - con * con) / (2 * this.ns0));
      }
      else {
        qs = (this.c - con * con) / this.ns0;
        lat = this.phi1z(this.e3, qs);
      }

      lon = common.adjust_lon(theta / this.ns0 + this.long0);
      p.x = lon;
      p.y = lat;
      return p;
    },

    /* Function to compute phi1, the latitude for the inverse of the
   Albers Conical Equal-Area projection.
-------------------------------------------*/
    phi1z: function(eccent, qs) {
      var sinphi, cosphi, con, com, dphi;
      var phi = common.asinz(0.5 * qs);
      if (eccent < common.EPSLN) {
        return phi;
      }

      var eccnts = eccent * eccent;
      for (var i = 1; i <= 25; i++) {
        sinphi = Math.sin(phi);
        cosphi = Math.cos(phi);
        con = eccent * sinphi;
        com = 1 - con * con;
        dphi = 0.5 * com * com / cosphi * (qs / (1 - eccnts) - sinphi / com + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
        phi = phi + dphi;
        if (Math.abs(dphi) <= 1e-7) {
          return phi;
        }
      }
      //proj4.reportError("aea:phi1z:Convergence error");
      return null;
    }

  };

});
