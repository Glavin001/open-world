var IB = IB || new Object();

IB.util = IB.util || Object.create(IB.object);

//////////////////////////////////////////////

IB.util.newNew = function(func, arguments) {
	var that = Object.create(func.prototype),
		result = func.apply(that, arguments);
	return (typeof result === "object" && result) || that;
};

IB.util.loadScript = function(identifier, source, callback) {
	console.log('Loading "'+identifier+'" ('+source+")");
	//  Ensure their is a valid identifier
	identifier = identifier || source;  
	// Async load external JavaScript file
	(function(d, s, id, src){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return callback && callback(true);}
     js = d.createElement(s); js.id = id;
     js.type = "text/javascript";
     js.src = src;
     js.async = true;
     js.onload = function(event) {
     	//console.log('Finished loading', event);
     	return callback && callback({'successful':true});
     };
     js.onerror = function(event) {
     	console.error('An error occured loading script.', event);
     	return callback && callback({'successful':false});
     };
     /*
     js.onprogress = function(event) {
     	console.log("Progress", event);
     };
     */
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', identifier, source));
};

/*
scripts = [ ["identifier", "source"],... ] or [ "source", ...] or [ {id:"identifier", "source" }]
progressCallback = function( {'successful': isSuccessful, 'pending': pendingScripts, 'total': totalScripts)
*/
IB.util.loadScripts = function(scripts, progressCallback) {
	// Verify that scripts is an array
	if (scripts instanceof Array) {
		var completed=0, errors=0, total=scripts.length;
		var onCompletion = function() {
			if ( (completed+errors) <= total ) {
				return progressCallback && progressCallback({'successful':true, 'completed': completed, 'total': total});
			}
		}
		// Iterate thru all scripts
		for (var i=0; i<total; i++) {
			var curr = scripts[i];
			var s = {'id':null, 'src':null};
			// Validate formatting
			if (typeof curr === "string") {
				s.id = curr;
				s.src = curr;
			} else if (curr instanceof Array) {
				s.id = curr[0];
				s.src = curr[1] || curr[0];			
			} else if (curr instanceof Object) {
				s.id = curr.id || curr.src;
				s.src = curr.src;
			} else {
				console.warn && console.warn('Invalid script to load: ',curr, "Must be in Array format [identifier, source].");
			 	progressCallback && progressCallback({'successful':false, 'completed': completed, 'total': total});
			 	errors++;
			 	continue; // Skip the rest of the for loop iteration
			}
			// Load
			IB.util.loadScript(s.id, s.src, function(result) {
				//if (result.successful) {} // Doesn't matter
				completed++;
				onCompletion();
			});

		}
		onCompletion();
	} else {
		return progressCallback && progressCallback({'successful':false, 'completed': null, 'total': null});
	}
};



IB.util.keys = {
		a: "65",
		b: "66",
		c: "67",
		d: "68",
		e: "69",
		f: "70",
		g: "71",
		h: "72",
		i: "73",
		j: "74",
		k: "75",
		l: "76",
		m: "77",
		n: "78",
		o: "79",
		p: "80",
		q: "81",
		r: "82",
		s: "83",
		t: "84",
		u: "85",
		v: "86",
		w: "87",
		x: "88",
		y: "89",
		z: "90",
		
		0: "48",
		1: "49",
		2: "50",
		3: "51",
		4: "52",
		5: "53",
		6: "54",
		7: "55",
		8: "56",
		9: "57",
		
		LEFT: "37",
		UP: "38",
		RIGHT: "39",
		DOWN: "40",
		
		8: "BACK",
		9: "TAB",
		13: "ENTER",
		16: "SHIFT",
		17: "CTRL",
		18: "ALT",
		19: "PAUSE/BREAK",
		20: "CAPS",
		27: "ESC",
		33: "PAGEUP",
		34: "PAGEDOWN",
		35: "END",
		36: "HOME",
		37: "LEFT",
		38: "UP",
		39: "RIGHT",
		40: "DOWN",
		45: "INSERT",
		46: "DELETE",
		48: "0",
		49: "1",
		50: "2",
		51: "3",
		52: "4",
		53: "5",
		54: "6",
		55: "7",
		56: "8",
		57: "9",
		65: "a",
		66: "b",
		67: "c",
		68: "d",
		69: "e",
		70: "f",
		71: "g",
		72: "h",
		73: "i",
		74: "j",
		75: "k",
		76: "l",
		77: "m",
		78: "n",
		79: "o",
		80: "p",
		81: "q",
		82: "r",
		83: "s",
		84: "t",
		85: "u",
		86: "v",
		87: "w",
		88: "x",
		89: "y",
		90: "z"
		//http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes dont have all of them yet
};

