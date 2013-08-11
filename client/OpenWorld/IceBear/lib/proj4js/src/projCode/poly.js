define(function(require, exports, module) {
  /* Function to compute, phi4, the latitude for the inverse of the
   Polyconic projection.
------------------------------------------------------------*/
  /*
function phi4z (eccent,e0,e1,e2,e3,a,b,c,phi) {
  var sinphi, sin2ph, tanphi, ml, mlp, con1, con2, con3, dphi, i;

  phi = a;
  for (i = 1; i <= 15; i++) {
    sinphi = Math.sin(phi);
    tanphi = Math.tan(phi);
    c = tanphi * Math.sqrt (1 - eccent * sinphi * sinphi);
    sin2ph = Math.sin (2 * phi);
    /*
    ml = e0 * *phi - e1 * sin2ph + e2 * sin (4 *  *phi);
    mlp = e0 - 2 * e1 * cos (2 *  *phi) + 4 * e2 *  cos (4 *  *phi);
    */
  /*
    ml = e0 * phi - e1 * sin2ph + e2 * Math.sin (4 *  phi) - e3 * Math.sin (6 * phi);
    mlp = e0 - 2 * e1 * Math.cos (2 *  phi) + 4 * e2 * Math.cos (4 *  phi) - 6 * e3 * Math.cos (6 *  phi);
    con1 = 2 * ml + c * (ml * ml + b) - 2 * a *  (c * ml + 1);
    con2 = eccent * sin2ph * (ml * ml + b - 2 * a * ml) / (2 *c);
    con3 = 2 * (a - ml) * (c * mlp - 2 / sin2ph) - 2 * mlp;
    dphi = con1 / (con2 + con3);
    phi += dphi;
    if (Math.abs(dphi) <= .0000000001 ) return(phi);   
  }
  proj4.reportError("phi4z: No convergence");
  return null;
}
/*


/* Function to compute the constant e4 from the input of the eccentricity
   of the spheroid, x.  This constant is used in the Polar Stereographic
   projection.
--------------------------------------------------------------------*/
  /*function e4fn(x) {
  var con, com;
  con = 1 + x;
  com = 1 - x;
  return (Math.sqrt((Math.pow(con, con)) * (Math.pow(com, com))));
}

*/



  /*******************************************************************************
NAME                             POLYCONIC 

PURPOSE:  Transforms input longitude and latitude to Easting and
    Northing for the Polyconic projection.  The
    longitude and latitude must be in radians.  The Easting
    and Northing values will be returned in meters.

PROGRAMMER              DATE
----------              ----
T. Mittan    Mar, 1993

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

    /* Initialize the POLYCONIC projection
    ----------------------------------*/
    init: function() {
      /* Place parameters in static storage for common use
      -------------------------------------------------*/
      this.temp = this.b / this.a;
      this.es = 1 - Math.pow(this.temp, 2); // devait etre dans tmerc.js mais n y est pas donc je commente sinon retour de valeurs nulles
      this.e = Math.sqrt(this.es);
      this.e0 = common.e0fn(this.es);
      this.e1 = common.e1fn(this.es);
      this.e2 = common.e2fn(this.es);
      this.e3 = common.e3fn(this.es);
      this.ml0 = this.a * common.mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0); //si que des zeros le calcul ne se fait pas
    },


    /* Polyconic forward equations--mapping lat,long to x,y
    ---------------------------------------------------*/
    forward: function(p) {
      var lon = p.x;
      var lat = p.y;
      var x, y, el;
      var dlon = common.adjust_lon(lon - this.long0);
      el = dlon * Math.sin(lat);
      if (this.sphere) {
        if (Math.abs(lat) <= common.EPSLN) {
          x = this.a * dlon;
          y = -1 * this.a * this.lat0;
        }
        else {
          x = this.a * Math.sin(el) / Math.tan(lat);
          y = this.a * (common.adjust_lat(lat - this.lat0) + (1 - Math.cos(el)) / Math.tan(lat));
        }
      }
      else {
        if (Math.abs(lat) <= common.EPSLN) {
          x = this.a * dlon;
          y = -1 * this.ml0;
        }
        else {
          var nl = common.gN(this.a, this.e, Math.sin(lat)) / Math.tan(lat);
          x = nl * Math.sin(el);
          y = this.a * common.mlfn(this.e0, this.e1, this.e2, this.e3, lat) - this.ml0 + nl * (1 - Math.cos(el));
        }

      }
      p.x = x + this.x0;
      p.y = y + this.y0;
      return p;
    },


    /* Inverse equations
  -----------------*/
    inverse: function(p) {
      var lon, lat, x, y, i;
      var al, bl;
      var phi, dphi;
      x = p.x - this.x0;
      y = p.y - this.y0;

      if (this.sphere) {
        if (Math.abs(y + this.a * this.lat0) <= common.EPSLN) {
          lon = common.adjust_lon(x / this.a + this.long0);
          lat = 0;
        }
        else {
          al = this.lat0 + y / this.a;
          bl = x * x / this.a / this.a + al * al;
          phi = al;
          var tanphi;
          for (i = common.MAX_ITER; i; --i) {
            tanphi = Math.tan(phi);
            dphi = -1 * (al * (phi * tanphi + 1) - phi - 0.5 * (phi * phi + bl) * tanphi) / ((phi - al) / tanphi - 1);
            phi += dphi;
            if (Math.abs(dphi) <= common.EPSLN) {
              lat = phi;
              break;
            }
          }
          lon = common.adjust_lon(this.long0 + (Math.asin(x * Math.tan(phi) / this.a)) / Math.sin(lat));
        }
      }
      else {
        if (Math.abs(y + this.ml0) <= common.EPSLN) {
          lat = 0;
          lon = common.adjust_lon(this.long0 + x / this.a);
        }
        else {

          al = (this.ml0 + y) / this.a;
          bl = x * x / this.a / this.a + al * al;
          phi = al;
          var cl, mln, mlnp, ma;
          var con;
          for (i = common.MAX_ITER; i; --i) {
            con = this.e * Math.sin(phi);
            cl = Math.sqrt(1 - con * con) * Math.tan(phi);
            mln = this.a * common.mlfn(this.e0, this.e1, this.e2, this.e3, phi);
            mlnp = this.e0 - 2 * this.e1 * Math.cos(2 * phi) + 4 * this.e2 * Math.cos(4 * phi) - 6 * this.e3 * Math.cos(6 * phi);
            ma = mln / this.a;
            dphi = (al * (cl * ma + 1) - ma - 0.5 * cl * (ma * ma + bl)) / (this.es * Math.sin(2 * phi) * (ma * ma + bl - 2 * al * ma) / (4 * cl) + (al - ma) * (cl * mlnp - 2 / Math.sin(2 * phi)) - mlnp);
            phi -= dphi;
            if (Math.abs(dphi) <= common.EPSLN) {
              lat = phi;
              break;
            }
          }

          //lat=phi4z(this.e,this.e0,this.e1,this.e2,this.e3,al,bl,0,0);
          cl = Math.sqrt(1 - this.es * Math.pow(Math.sin(lat), 2)) * Math.tan(lat);
          lon = common.adjust_lon(this.long0 + Math.asin(x * cl / this.a) / Math.sin(lat));
        }
      }

      p.x = lon;
      p.y = lat;
      return p;
    }
  };

});
