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

OW.Input.prototype.controls = {
	forward: 0,
	lstrafe: 0,
	backward: 0,
	rstrafe: 0,
	down: 0,
	up: 0,
	boost: 0
};