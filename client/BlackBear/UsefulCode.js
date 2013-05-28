for (var name in object) {
	//checks to make sure the member isn't being inherited; otherwise would give all members of higher objects
	if (object.hasOwnProperty(name)) {
		
	}
}

ZParenizor.inherits(Parenizor);

//calls toString in inherited object, similar to super
this.uber('toString');

//run code through JS Lint