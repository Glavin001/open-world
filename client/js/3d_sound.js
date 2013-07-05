var context;
var soundList = [];

function initSound() {
	try {
		// Fix up for prefixing
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		context = new AudioContext();
		console.log('Web Audio API loaded');
	}
	catch(e) {
		alert('Web Audio API is not supported in this browser');
		console.log('Web Audio API is not supported in this browser');
	}
}

function soundRequest(url, number) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		soundList[number] = context.createBufferSource();
		context.decodeAudioData(request.response, function(buffer) {
			soundList[number].buffer = buffer;
		});
		soundList[number].connect(context.destination);
		console.log('Sound ' + number  + ' loaded');
	}
	request.send();
}

function loadSound(soundReq, callback) {
	var length = soundReq.length;
	
	for(i = 0; i < length; i++) {
		soundRequest(soundReq[i], i);
	}
}

function sound_3d(location_x, location_y, location_z, reference_intensity, reference_distance, sound_num) {
	this.x = location_x;
	this.y = location_y;
	this.z = location_z;
	this.reference_intensity = reference_intensity;
	this.reference_distance = reference_distance;
	this.sound = soundList[sound_num];
	
	this.settings = settings;
	function settings() {
	}
	
	this.updateVolume = updateVolume;
	function updateVolume(current_x, current_y, current_z) {
		//Calculates distance from player to sound source
		var distance = Math.sqrt( Math.pow(current_x - this.x, 2) + Math.pow(current_y - this.y, 2) + Math.pow(current_z - this.z, 2) );
		
		if(distance < 1)
			distance = 1;
		
		//Calculates volume based on distance
		var volume = Math.pow(this.reference_distance / distance, 2) * reference_intensity;
		
		if(volume > 1)
			volume = 1;
		
		//Pans the sound based on angle from sound source to player
		
		
		//Sets the volume and pan of sound
		//this.sound.volume = volume; (Replace with Web Audio API)
	}
	
	this.play = play;
	function play() {
		this.sound.start(0);
	}
}