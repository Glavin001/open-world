mocha.setup({
      ui: "bdd",
      globals: ["console"],
      timeout: 300000,
       ignoreLeaks: true
    });
// Start the main app logic.


    
    var assert = chai.assert;
    proj4.defs([
   ["EPSG:102018", "+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"]//,
]);


describe('proj4', function () {
    describe('core',function(){
  testPoints.forEach(function(testPoint){
        describe(testPoint.code,function(){
          var xyAcc=2,llAcc=6;
          if('acc' in testPoint){
            if('xy' in testPoint.acc){
              xyAcc = testPoint.acc.xy;
            }
            if('ll' in testPoint.acc){
              llAcc = testPoint.acc.ll;
            }
          }
          var xyEPSLN = Math.pow(10,-1*xyAcc);
           var llEPSLN = Math.pow(10,-1*llAcc);
            describe('traditional',function(){
		        it('should work with forwards', function () {
			        var proj = new proj4.Proj(testPoint.code);
			        var xy = proj4.transform(proj4.WGS84, proj, new proj4.Point(testPoint.ll));
			        assert.closeTo(xy.x, testPoint.xy[0],xyEPSLN, 'x is close');
			        assert.closeTo(xy.y, testPoint.xy[1],xyEPSLN, 'y is close');
		        });
		        it('should work with backwards', function () {
			        var proj = new proj4.Proj(testPoint.code);
			        var ll = proj4.transform(proj,proj4.WGS84, new proj4.Point(testPoint.xy));
			        assert.closeTo(ll.x, testPoint.ll[0],llEPSLN, 'lng is close');
			        assert.closeTo(ll.y, testPoint.ll[1],llEPSLN, 'lat is close');
		        });
            });
            describe('new method 2 param',function(){
                it('shortcut method should work with an array', function(){
                    var xy = proj4(testPoint.code,testPoint.ll);
                    assert.closeTo(xy[0], testPoint.xy[0],xyEPSLN, 'x is close');
  		            assert.closeTo(xy[1], testPoint.xy[1],xyEPSLN, 'y is close');
                });
                it('shortcut method should work with an object', function(){
                    var pt = {x:testPoint.ll[0],y:testPoint.ll[1]};
                    var xy = proj4(testPoint.code,pt);
                    assert.closeTo(xy.x, testPoint.xy[0],xyEPSLN, 'x is close');
    	            assert.closeTo(xy.y, testPoint.xy[1],xyEPSLN, 'y is close');
                });
                it('shortcut method should work with a point object', function(){
                    var pt = new proj4.Point(testPoint.ll);
                    var xy = proj4(testPoint.code,pt);
                    assert.closeTo(xy.x, testPoint.xy[0],xyEPSLN, 'x is close');
                    assert.closeTo(xy.y, testPoint.xy[1],xyEPSLN, 'y is close');
                });
            });
            describe('new method 3 param',function(){
                it('shortcut method should work with an array', function(){
                    var xy = proj4(proj4.WGS84,testPoint.code,testPoint.ll);
                    assert.closeTo(xy[0], testPoint.xy[0],xyEPSLN, 'x is close');
      	            assert.closeTo(xy[1], testPoint.xy[1],xyEPSLN, 'y is close');
                });
                it('shortcut method should work with an object', function(){
                    var pt = {x:testPoint.ll[0],y:testPoint.ll[1]};
                    var xy = proj4(proj4.WGS84,testPoint.code,pt);
                    assert.closeTo(xy.x, testPoint.xy[0],xyEPSLN, 'x is close');
    	            assert.closeTo(xy.y, testPoint.xy[1],xyEPSLN, 'y is close');
                });
                it('shortcut method should work with a point object', function(){
                    var pt = new proj4.Point(testPoint.ll);
                    var xy = proj4(proj4.WGS84,testPoint.code,pt);
                    assert.closeTo(xy.x, testPoint.xy[0],xyEPSLN, 'x is close');
                    assert.closeTo(xy.y, testPoint.xy[1],xyEPSLN, 'y is close');
                });
            });
            describe('new method 3 param other way',function(){
                it('shortcut method should work with an array', function(){
                    var ll = proj4(testPoint.code,proj4.WGS84,testPoint.xy);
                    assert.closeTo(ll[0], testPoint.ll[0],llEPSLN, 'x is close');
                    assert.closeTo(ll[1], testPoint.ll[1],llEPSLN, 'y is close');
                });
                it('shortcut method should work with an object', function(){
                    var pt = {x:testPoint.xy[0],y:testPoint.xy[1]};
                    var ll = proj4(testPoint.code,proj4.WGS84,pt);
                    assert.closeTo(ll.x, testPoint.ll[0],llEPSLN, 'x is close');
                    assert.closeTo(ll.y, testPoint.ll[1],llEPSLN, 'y is close');
                });
                it('shortcut method should work with a point object', function(){
                    var pt = new proj4.Point(testPoint.xy);
                    var ll = proj4(testPoint.code,proj4.WGS84,pt);
                    assert.closeTo(ll.x, testPoint.ll[0],llEPSLN, 'x is close');
                    assert.closeTo(ll.y, testPoint.ll[1],llEPSLN, 'y is close');
                });
            });
            describe('1 param',function(){
              it('forwards',function(){
                var xy = proj4(testPoint.code).forward(testPoint.ll);
                assert.closeTo(xy[0], testPoint.xy[0],xyEPSLN, 'x is close');
                assert.closeTo(xy[1], testPoint.xy[1],xyEPSLN, 'y is close');
              });
              it('inverse',function(){
                var ll = proj4(testPoint.code).inverse(testPoint.xy);
                assert.closeTo(ll[0], testPoint.ll[0],llEPSLN, 'x is close');
                assert.closeTo(ll[1], testPoint.ll[1],llEPSLN, 'y is close');
              });
            });
            describe('proj object',function(){
            	it('should work with a 2 element array', function(){
                    var xy = proj4(new proj4.Proj(testPoint.code),testPoint.ll);
                    assert.closeTo(xy[0], testPoint.xy[0],xyEPSLN, 'x is close');
  		            assert.closeTo(xy[1], testPoint.xy[1],xyEPSLN, 'y is close');
                });
                it('should work on element',function(){
                var xy = proj4(new proj4.Proj(testPoint.code)).forward(testPoint.ll);
                assert.closeTo(xy[0], testPoint.xy[0],xyEPSLN, 'x is close');
                assert.closeTo(xy[1], testPoint.xy[1],xyEPSLN, 'y is close');
              });
               it('should work 3 element ponit object', function(){
                    var pt = new proj4.Point(testPoint.xy);
                    var ll = proj4(new proj4.Proj(testPoint.code),proj4.WGS84,pt);
                    assert.closeTo(ll.x, testPoint.ll[0],llEPSLN, 'x is close');
                    assert.closeTo(ll.y, testPoint.ll[1],llEPSLN, 'y is close');
                });
            });
	    });
	});
	});
	describe('errors',function(){
		it('should throw an error for an unknown ref',function(){
			assert.throws(function(){
				new proj4.Proj('fake one');
			},'unknown projection','should work');
		});
	})
	describe('utility',function(){
		it('should have MGRS available in the proj4.util namespace',function(){
			assert.typeOf(proj4.mgrs, "object", "MGRS available in the proj4.util namespace");
		});
	 	it('should have fromMGRS method added to proj4.Point prototype',function(){
			assert.typeOf(proj4.Point.fromMGRS, "function", "fromMGRS method added to proj4.Point prototype");
		});
	 it('should have toMGRS method added to proj4.Point prototype',function(){
			assert.typeOf(proj4.Point.prototype.toMGRS, "function", "toMGRS method added to proj4.Point prototype");
		});
	 
  describe('First MGRS set',function(){
  	var mgrs = "33UXP04";
    var point = proj4.Point.fromMGRS(mgrs);
    it('Longitude of point from MGRS correct.',function(){
    	assert.equal(point.x.toPrecision(7), "16.41450", "Longitude of point from MGRS correct.");
    });
    it('Latitude of point from MGRS correct.',function(){
    	assert.equal(point.y.toPrecision(7), "48.24949", "Latitude of point from MGRS correct.");
    });
    it('MGRS reference with highest accuracy correct.',function(){
    	assert.equal(point.toMGRS(), "33UXP0500444998", "MGRS reference with highest accuracy correct.");
    });
    it('MGRS reference with 1-digit accuracy correct.',function(){
    	assert.equal(point.toMGRS(1), mgrs, "MGRS reference with 1-digit accuracy correct.");
    });
  });
  describe('Second MGRS set',function(){
  	var mgrs = "24XWT783908"; // near UTM zone border, so there are two ways to reference this
    var point = proj4.Point.fromMGRS(mgrs);
    it("Longitude of point from MGRS correct.",function(){
    	assert.equal(point.x.toPrecision(7), "-32.66433", "Longitude of point from MGRS correct.");
    });
    it("Latitude of point from MGRS correct.",function(){
    	assert.equal(point.y.toPrecision(7), "83.62778", "Latitude of point from MGRS correct.");
    });
    it("MGRS reference with 3-digit accuracy correct.",function(){
    	assert.equal(point.toMGRS(3), "25XEN041865", "MGRS reference with 3-digit accuracy correct.");
    });
  })
	
	});
	describe('wkt',function(){
		aWKT.forEach(function(wkt){
			it('should work with '+wkt.name,function(){
				var testProj = new proj4.Proj(wkt.wkt);
				assert.equal(testProj.srsCode,wkt.name,'correct name');
				assert.equal(testProj.units,wkt.units,'correct units');
				assert.equal(testProj.projName,wkt.proj,'correct type')
			});
		});
	});
});

   if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
      else { mocha.run(); }

