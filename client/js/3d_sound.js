/*****************************************************************
	UTILITY FUNCTIONS
*****************************************************************/
checkVolume = function(newVolume) {
	if(newVolume > 1)
		newVolume = 1;
	else if(newVolume < 0)
		newVolume = 0;
	
	return newVolume;
}

/*****************************************************************
	CORE SOUND OBJECT
*****************************************************************/

Sound = {};
Sound.context = null;
Sound.soundList = [];
Sound.pointList = [];
Sound.loadCount = 0;
Sound.sfxVolume = 1;
Sound.bgVolume = 1;

try {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	Sound.context = new AudioContext();
	console.log('Web Audio API loaded');
}
catch(e) {
	alert('Web Audio API is not supported in this browser');
	console.log('Web Audio API failed to load');
}

Sound.tick = function() {
	var length = this.pointList.length;
	
	for(i = 0; i < length; i++) {
		
	}
}

function soundRequest(url, total, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		Sound.loadCount++;
		
		Sound.soundList[url] = Sound.context.createBufferSource();
		Sound.context.decodeAudioData(request.response, function(buffer) {
			Sound.soundList[url].buffer = buffer;
		});
		
		console.log('Sound loaded:', url);
		
		if(Sound.loadCount >= total) {
			console.log('All sounds preloaded');
			callback();
		}
	}
	request.send();
}

Sound.loadSound = function(soundReq, callback) {
	var length = soundReq.length;
	
	for(i = 0; i < length; i++) {
		soundRequest(soundReq[i], length, callback);
	}
}

Sound.setMasterVolume = function(newVolume) {
	if(newVolume > 1)
		newVolume = 1;
	else if(newVolume < 0)
		newVolume = 0;
	
	masterVolume = newVolume;
}

/*****************************************************************
	REGULAR SOUND OBJECT
*****************************************************************/

function Sound_Reg(sound_url, canLoop) {
	//Creates variables for source and nodes
	this.sound = Sound.soundList[sound_url];
	this.volume = Sound.context.createGain();
	this.pan = Sound.context.createPanner();
	
	if(canLoop === undefined)
		canLoop = false;
		
	this.canLoop = canLoop;
}

Sound_Reg.prototype.create = function() {
	//Connects nodes
	this.sound.connect(this.volume);
	this.sound.loop = this.canLoop;
	this.volume.connect(this.pan);
	this.pan.connect(Sound.context.destination);
}

Sound_Reg.prototype.play = function(delay) {
	var time;
	
	if(delay === undefined) {
		time = 0;
	} else {
		time = delay / 1000;
	}
	
	this.sound.noteOn(time);
};

Sound_Reg.prototype.pause = function(delay) {
	var time;
	
	if(delay === undefined) {
		time = 0;
	} else {
		time = delay / 1000;
	}
	
	this.sound.noteOff(time);
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
	
	newVolume = newVolume * Sound.sfxVolume;
	
	this.volume.gain.value = newVolume;
};

Sound_Reg.prototype.settings = function() {
};

/*****************************************************************
	3D SOUND OBJECT
*****************************************************************/

function Sound_3d(sound_url, location, reference_intensity, reference_distance, canLoop, position) {
	//Creates variables to control location and intensity
	this.x = location.x;
	this.y = location.y;
	this.z = location.z;
	this.reference_intensity = reference_intensity;
	this.reference_distance = reference_distance;
	this.sound = Sound.soundList[sound_url];
	this.position = position;
	
	if(canLoop === undefined)
		canLoop = false;
		
	this.sound.loop = canLoop;
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

function createSound3D(sound_url, location, reference_intensity, reference_distance, canLoop) {
	var length = Sound.pointList.length;
	
	//Adds a new Sound_3d object to the list of Sound_3d objects
	Sound.pointList[length] = new Sound_3d(sound_url, location, reference_intensity, reference_distance, canLoop, length);
	
	//Sets up and activates the Sound_3d
	Sound.pointList[length].create();
	Sound.pointList[length].play(0);
}

/*****************************************************************
	BACKGROUND SOUND OBJECT
*****************************************************************/

Background_Music = {};
Background_Music.prototype = new Sound_Reg();
Background_Music.isRandom = true;
Background_Music.count = 0;
Background_Music.playlist = [];

Background_Music.setVolume = function(newVolume) {
	if(newVolume > 1)
		newVolume = 1;
	else if(newVolume < 0)
		newVolume = 0;
	
	newVolume = newVolume * Sound.bgVolume;
	
	this.volume.gain.value = newVolume;
};

Background_Music.loadPlaylist = function(songNames, setRandom) {
	var length = songNames.length;
	this.playlist = [];
	
	if(setRandom === undefine)
		this.isRandom = true;
	else
		this.isRandom = setRandom;
	
	for(i = 0; i < length; i++) {
		this.playlist[i] = Sound.soundList[songNames[i]];
	}
}