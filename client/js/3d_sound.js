var APILoaded = false;
var context;
var soundList = {};
var masterVolume = 1;

/*****************************************************************
	BASE SOUND OBJECT
*****************************************************************/

function Sound() {
	if(!APILoaded) {
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
		
		APILoaded = true;
	}
}

/*****************************************************************
	SOUND CONTROLLER
*****************************************************************/

function SoundController() {
}

SoundController.prototype = new Sound();

function soundRequest(url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		soundList[url] = context.createBufferSource();
		context.decodeAudioData(request.response, function(buffer) {
			soundList[url].buffer = buffer;
		});
		console.log('Sound loaded:', url);
		
		callback();
	}
	request.send();
}

SoundController.prototype.loadSound = function(soundReq, callback) {
	var length = soundReq.length;
	
	for(i = 0; i < length; i++) {
		soundRequest(soundReq[i], callback);
	}
}

SoundController.prototype.setMasterVolume = function(newVolume) {
	if(newVolume > 1)
		newVolume = 1;
	else if(newVolume < 0)
		newVolume = 0;
	
	masterVolume = newVolume;
}

/*****************************************************************
	REGULAR SOUND OBJECT
*****************************************************************/

function Sound_Reg(sound_url) {
	//Creates variables for source and nodes
	this.sound = soundList[sound_url];
	this.volume = context.createGain();
	this.pan = context.createPanner();
}

Sound.prototype = new Sound();

Sound_Reg.prototype.create = function() {
	//Connects nodes
	this.sound.connect(this.volume);
	this.volume.connect(this.pan);
	this.pan.connect(context.destination);
}

Sound_Reg.prototype.play = function(delay) {
	if(delay === undefined) {
		delay = 0;
	}
	
	this.sound.noteOn(delay);
};

Sound_Reg.prototype.pause = function(delay) {
	if(delay === undefined) {
		delay = 0;
	}
	
	this.sound.noteOff(delay);
};

Sound_Reg.prototype.setPan = function(pan_x, pan_y, pan_z) {
	if(pan_x > 1)
		pan_x = 1;
	else if (pan_x < -1)
		pan_x = -1;
	
	if(pan_y > 1)
		pan_y = 1;
	else if (pan_y < -1)
		pan_y = -1;
	
	if(pan_z > 1)
		pan_y = 1;
	else if (pan_x < -1)
		pan_z = -1;
	
	this.pan.setPosition(pan_x, pan_y, pan_z);
};

Sound_Reg.prototype.setVolume = function(newVolume) {
	if(newVolume > 1)
		newVolume = 1;
	else if(newVolume < 0)
		newVolume = 0;
	
	newVolume = newVolume * masterVolume;
	
	this.volume.gain.value = newVolume;
};

Sound_Reg.prototype.settings = function() {
};

/*****************************************************************
	3D SOUND OBJECT
*****************************************************************/

function Sound_3d(sound_url, location, reference_intensity, reference_distance) {
	//Creates variables to control location and intensity
	this.x = location.x;
	this.y = location.y;
	this.z = location.z;
	this.reference_intensity = reference_intensity;
	this.reference_distance = reference_distance;
	this.sound = soundList[sound_url];
}

Sound_3d.prototype = new Sound_Reg();

Sound_3d.prototype.updateLevels = function(current, theta) {
	//Calculates volume based on distance
	var distance = Math.sqrt( Math.pow(current.x - this.x, 2) + Math.pow(current.y - this.y, 2) + Math.pow(current.z - this.z, 2) );
	
	if(distance < 1)
		distance = 1;
		
	var newVolume = Math.pow(this.reference_distance / distance, 2) * this.reference_intensity;
	
	//Pans the sound based on angle from sound source to player
	var cos_angle;
	var sin_angle;
	var mod_x = this.x - current.x;
	var mod_z = this.z - current.z;
	var radius =  Math.sqrt( Math.pow(mod_x, 2) + Math.pow(mod_z, 2) );
	
	if(radius === 0) {
		cos_angle = 0;
		sin_angle = 0;
	} else {
		cos_angle = mod_x / radius;
		sin_angle = mod_z / radius;
	}
	
	var pan_x = -Math.cos( Math.acos(cos_angle) + theta );
	var pan_z = -Math.sin( Math.asin(sin_angle) + theta );
	
	//Sets the volume and pan of sound
	this.setVolume(newVolume);
	this.setPan(pan_x, 0, pan_z);
};