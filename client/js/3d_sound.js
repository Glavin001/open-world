/*****************************************************************
	UTILITY FUNCTIONS
*****************************************************************/
checkRange = function(value, min, max) {
	if(value > max)
		value = max;
	else if(value < min)
		value = min;
	
	return value;
}

/*****************************************************************
	CORE SOUND OBJECT
*****************************************************************/

var IB = IB || new Object();
IB.sound = IB.sound || {};

IB.sound.context = null;
IB.sound.soundList = [];
IB.sound.pointList = [];
IB.sound.loadCount = 0;
IB.sound.sfxVolume = 1;
IB.sound.bgVolume = 1;

try {
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	IB.sound.context = new AudioContext();
	console.log('Web Audio API loaded');
}
catch(e) {
	alert('Web Audio API is not supported in this browser');
	console.log('Web Audio API failed to load');
}

IB.sound.tick = function(coordinates, angle) {
	var length = this.pointList.length;
	
	for(i = 0; i < length; i++) {
		this.pointList[i].updateLevels(coordinates, angle);
	}
}

function soundRequest(url, total, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		IB.sound.loadCount++;
		
		IB.sound.context.decodeAudioData(request.response, function(buffer) {
			IB.sound.soundList[url] = buffer;
			
			console.log('Sound loaded:', url);
			
			if(IB.sound.loadCount >= total) {
				console.log('All sounds preloaded');
				callback();
			}
		});
	}
	request.send();
}

IB.sound.loadSound = function(soundReq, callback) {
	var length = soundReq.length;
	
	for(i = 0; i < length; i++) {
		soundRequest(soundReq[i], length, callback);
	}
}

IB.sound.setSfxVolume = function(newVolume) {
	newVolume = checkRange(newVolume, 0, 1);
	
	this.sfxVolume = newVolume;
}

IB.sound.setBgVolume = function(newVolume) {
	newVolume = checkRange(newVolume, 0, 1);
	
	this.bgVolume = newVolume;
}

/*****************************************************************
	REGULAR SOUND OBJECT
*****************************************************************/

function Sound_Reg(sound_url, canLoop) {
	this.sound;
	this.sound_url = sound_url;
	this.volume = IB.sound.context.createGain();
	this.pan = IB.sound.context.createPanner();
	
	if(canLoop === undefined)
		canLoop = false;
		
	this.canLoop = canLoop;
}

Sound_Reg.prototype.create = function() {
	this.sound = IB.sound.context.createBufferSource();
	this.sound.buffer = IB.sound.soundList[this.sound_url];
	this.sound.connect(this.volume);
	this.sound.loop = this.canLoop;
	this.volume.connect(this.pan);
	this.pan.connect(IB.sound.context.destination);
}

Sound_Reg.prototype.play = function() {
	this.sound.noteOn(0);
};

Sound_Reg.prototype.stop = function() {
	this.sound.noteOff(0);
};

Sound_Reg.prototype.setPan = function(pan_x, pan_y, pan_z) {
	pan_x = checkRange(pan_x, -1, 1);
	
	pan_y = checkRange(pan_y, -1, 1);
	
	pan_z = checkRange(pan_z, -1, 1);
	
	this.pan.setPosition(pan_x, pan_y, pan_z);
};

Sound_Reg.prototype.setVolume = function(newVolume) {
	newVolume = checkRange(newVolume, 0, 1);
	
	newVolume = newVolume * IB.sound.sfxVolume;
	
	this.volume.gain.value = newVolume;
};

Sound_Reg.prototype.settings = function() {
};

IB.sound.createSound = function(sound_url, canLoop) {
	var temp = new Sound_Reg(sound_url, canLoop);
	
	temp.create();
	
	return temp;
}

/*****************************************************************
	3D SOUND OBJECT
*****************************************************************/

function deletePointSound(object) {
	var array = Sound.pointList;
	var index = object.index;
	console.log(index);
	var limit = array - 1;
	
	for(i = index; i < limit; i++) {
		array[i] = array[i + 1]
		array[i].index = i;
	}
	
	array.pop();
}

function Sound_3d(sound_url, location, reference_intensity, reference_distance, canLoop) {
	this.x = location.x;
	this.y = location.y;
	this.z = location.z;
	this.index;
	this.reference_intensity = reference_intensity;
	this.reference_distance = reference_distance;
	this.sound;
	this.sound_url = sound_url;
	
	if(canLoop === undefined)
		canLoop = false;
}

Sound_3d.prototype = new Sound_Reg();

Sound_3d.prototype.updateLevels = function(current, theta) {
	var distance = Math.sqrt( Math.pow(current.x - this.x, 2) + Math.pow(current.y - this.y, 2) + Math.pow(current.z - this.z, 2) );
	
	if(distance < 1)
		distance = 1;
		
	var newVolume = Math.pow(this.reference_distance / distance, 2) * this.reference_intensity;
	
	var pan_x;
	var pan_y;
	var mod_x = this.x - current.x;
	var mod_y = this.y - current.y;
	var mod_z = this.z - current.z;
	var radius =  Math.sqrt( Math.pow(mod_x, 2) + Math.pow(mod_z, 2) );
	
	if(radius === 0) {
		pan_x = 0;
		pan_y = 0;
		pan_z = 0;
	} else {
		pan_x = mod_x / radius;
		pan_y = mod_z / radius;
		pan_z = mod_y / radius;
	}
	
	this.setVolume(newVolume);
	this.setPan(pan_x, pan_y, pan_z);
};

IB.sound.createSound3D = function(sound_url, location, reference_intensity, reference_distance, canLoop) {
	IB.sound.pointList[length] = new Sound_3d(sound_url, location, reference_intensity, reference_distance, canLoop);
	
	IB.sound.pointList[length].index = length;
	IB.sound.pointList[length].create();
	IB.sound.pointList[length].play(0);
}

/*****************************************************************
	BACKGROUND SOUND OBJECT
*****************************************************************/

IB.background_music = IB.background_music || {};
IB.background_music.prototype = new Sound_Reg();
IB.background_music.isRandom = true;
IB.background_music.count = 0;
IB.background_music.playlist = [];

IB.background_music.setVolume = function(newVolume) {
	newVolume = checkRange(newVolume, 0, 1);
	
	newVolume = newVolume * IB.sound.bgVolume;
	
	this.volume.gain.value = newVolume;
};

IB.background_music.loadPlaylist = function(songNames, setRandom) {
	var length = songNames.length;
	this.playlist = [];
	
	if(setRandom === undefine)
		this.isRandom = true;
	else
		this.isRandom = setRandom;
	
	for(i = 0; i < length; i++) {
		this.playlist[i] = IB.sound.soundList[songNames[i]];
	}
}

IB.background_music.selectSong = function() {
	var length = this.playlist.length;
	var selection;
	
	if(this.isRandom) {		
		selection = Math.ceil(Math.random() * length) - 1;
		
		if(selection === this.count)
			selection++;
	} else {
		selection = count++;
	}
	
	if(selection > this.playlist.length - 1)
		selection = 0;
	
	return selection;
}

IB.background_music.forceChange = function() {
	this.count = this.selectSong();
}