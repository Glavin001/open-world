var IB = IB || new Object();

IB.input = IB.input || Object.create(IB.object);

////////////////////////////////////////////////

IB.input.useBool = false;

IB.input.mappings = {};

////////////////////////////////////////////

IB.input.keydownHandler = function (event) {
	if (typeof this[this.mappings[IB.util.keys[event.keyCode]]] === "number") {
		if (!this.useBool) {
			this[this.mappings[IB.util.keys[event.keyCode]]] = 1;
		}
		else {
			this[this.mappings[IB.util.keys[event.keyCode]]] = true;
		}
		return;
	}
	else if (typeof this[this.mappings[IB.util.keys[event.keyCode]]] === "function") {
		this[this.mappings[IB.util.keys[event.keyCode]]].apply(this, [event]);
		//look in event to see if keyup or keydown, and look at modifier keys in to decide what to do
		return;
	}
	else if (typeof this[this.mappings[IB.util.keys[event.keyCode]]] === "boolean") {
		if (this.useBool) {
			this[this.mappings[IB.util.keys[event.keyCode]]] = true;
		}
		else {
			this[this.mappings[IB.util.keys[event.keyCode]]] = 1;
		}
		return;
	}
};

IB.input.keyupHandler = function (event) {
	if (typeof this[this.mappings[IB.util.keys[event.keyCode]]] === "number") {
		if (!this.useBool) {
			this[this.mappings[IB.util.keys[event.keyCode]]] = 0;
		}
		else {
			this[this.mappings[IB.util.keys[event.keyCode]]] = false;
		}
		return;
	}
	else if (typeof this[this.mappings[IB.util.keys[event.keyCode]]] === "function") {
		this[this.mappings[IB.util.keys[event.keyCode]]].apply(this, [event]);
		return;
	}
	else if (typeof this[this.mappings[IB.util.keys[event.keyCode]]] === "boolean") {
		if (this.useBool) {
			this[this.mappings[IB.util.keys[event.keyCode]]] = false;
		}
		else {
			this[this.mappings[IB.util.keys[event.keyCode]]] = 0;
		}
		return;
	}
};