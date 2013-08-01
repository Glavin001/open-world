//api.jquery.com/category/events

OW.Input = function () {
	//needs to be expanded for other the options menu
	$(document).keydown({that: this}, function (event) {
		event.data.that.keydownHandler(event);
	});
	$(document).keyup({that: this}, function (event) {
		event.data.that.keyupHandler(event);
	});
};

/////////////////////////////////////////////

OW.Input.prototype = Object.create(IB.input);

OW.Input.prototype.name = "OpenWorldPlayerInput";

/////////////////////////////////////////////

OW.Input.prototype.mappings = {
	w: "forward",
	a: "lstrafe",
	s: "backward",
	d: "rstrafe",
	q: "down",
	e: "up",
	SHIFT: "boost"
};

OW.Input.prototype.forward = 0;

OW.Input.prototype.lstrafe = 0;

OW.Input.prototype.backward = 0;

OW.Input.prototype.rstrafe = 0; 

OW.Input.prototype.down = 0;

OW.Input.prototype.up = 0;

OW.Input.prototype.boost = 0;