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
	console.log(this.date.getTime());
	
	this.test2('self');
};

BLACKBEAR.object.test2 = function(message) {
	console.log(message);
	
	console.log(bacon);
	console.log(this.bacon);
	
	strips = ' stripsstring test';
	console.log(strips);
	
	this.strips = ' stripstring self test';
	console.log(this.strips);
};