define(function(require, exports, module) {
  var common = require('./common');
  module.exports = function(source, dest, point) {
    var wp, i, l;

    function checkParams(fallback) {
      return (fallback === common.PJD_3PARAM || fallback === common.PJD_7PARAM);
    }
    // Short cut if the datums are identical.
    if (source.compare_datums(dest)) {
      return point; // in this case, zero is sucess,
      // whereas cs_compare_datums returns 1 to indicate TRUE
      // confusing, should fix this
    }

    // Explicitly skip datum transform by setting 'datum=none' as parameter for either source or dest
    if (source.datum_type === common.PJD_NODATUM || dest.datum_type === common.PJD_NODATUM) {
      return point;
    }

    //DGR: 2012-07-29 : add nadgrids support (begin)
    var src_a = source.a;
    var src_es = source.es;

    var dst_a = dest.a;
    var dst_es = dest.es;

    var fallback = source.datum_type;
    // If this datum requires grid shifts, then apply it to geodetic coordinates.
    if (fallback === common.PJD_GRIDSHIFT) {
      if (this.apply_gridshift(source, 0, point) === 0) {
        source.a = common.SRS_WGS84_SEMIMAJOR;
        source.es = common.SRS_WGS84_ESQUARED;
      }
      else {
        // try 3 or 7 params transformation or nothing ?
        if (!source.datum_params) {
          source.a = src_a;
          source.es = source.es;
          return point;
        }
        wp = 1;
        for (i = 0, l = source.datum_params.length; i < l; i++) {
          wp *= source.datum_params[i];
        }
        if (wp === 0) {
          source.a = src_a;
          source.es = source.es;
          return point;
        }
        if (source.datum_params.length > 3) {
          fallback = common.PJD_7PARAM;
        }
        else {
          fallback = common.PJD_3PARAM;
        }
      }
    }
    if (dest.datum_type === common.PJD_GRIDSHIFT) {
      dest.a = common.SRS_WGS84_SEMIMAJOR;
      dest.es = common.SRS_WGS84_ESQUARED;
    }
    // Do we need to go through geocentric coordinates?
    if (source.es !== dest.es || source.a !== dest.a || checkParams(fallback) || checkParams(dest.datum_type)) {
      //DGR: 2012-07-29 : add nadgrids support (end)
      // Convert to geocentric coordinates.
      source.geodetic_to_geocentric(point);
      // CHECK_RETURN;
      // Convert between datums
      if (checkParams(source.datum_type)) {
        source.geocentric_to_wgs84(point);
        // CHECK_RETURN;
      }
      if (checkParams(dest.datum_type)) {
        dest.geocentric_from_wgs84(point);
        // CHECK_RETURN;
      }
      // Convert back to geodetic coordinates
      dest.geocentric_to_geodetic(point);
      // CHECK_RETURN;
    }
    // Apply grid shift to destination if required
    if (dest.datum_type === common.PJD_GRIDSHIFT) {
      this.apply_gridshift(dest, 1, point);
      // CHECK_RETURN;
    }

    source.a = src_a;
    source.es = src_es;
    dest.a = dst_a;
    dest.es = dst_es;

    return point;
  };
});
