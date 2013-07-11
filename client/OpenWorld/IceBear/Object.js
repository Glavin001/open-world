/***************************************************
*Root class in the IB engine, except for interfaces*
*TODO: Everything***********************************
***************************************************/

var IB = IB || new Object();

IB.object = IB.object || new Object();

//////////////////////////////////////

IB.object.owner = null;

IB.object.name = "Object";

IB.object.date = new Date();

//////////////////////////////////////////

IB.object.setOwner = function (newOwner) {
	this.owner = newOwner;
};

IB.object.setName = function (newName) {
	this.name = newName;
};