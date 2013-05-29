/**********************************************************
*Root class in the BlackBear engine, except for interfaces*
*TODO: Everything******************************************
**********************************************************/

var BLACKBEAR = BLACKBEAR || new Object();

BLACKBEAR.object = BLACKBEAR.object || new Object();

////////////////////////////////////////////////////

BLACKBEAR.object.date = new Date();

BLACKBEAR.object.bacon = ' baconstring test';

BLACKBEAR.object.strips;

BLACKBEAR.object.test = function() {
	console.log(date.getTime());
	
	test2('not self');
	self.test2('self');
};

BLACKBEAR.object.test2 = function(message) {
	console.log(message);
	
	console.log(bacon);
	console.log(self.bacon);
	
	strips = ' stripsstring test';
	console.log(strips);
	
	strips = ' stripstring self test';
	console.log(self.strips);
};