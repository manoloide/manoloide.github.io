var synthA, synthB;

var time, changeTime;
var vel1, vel2;

function preload(){
	var pan1 = new Tone.Panner(-1).toMaster();
	var rev1 = new p5.Reverb();

	synthA = new Tone.MonoSynth({
		"portamento" : 0.1,
		"oscillator" : {
			"type" : "square"
		},
		"envelope" : {
			"attack" : 0.005,
			"decay" : 0.2,
			"sustain" : 0.4,
			"release" : 1.4,
		},
		"volume" : -10
	}).connect(rev1).connect(pan1);

	var pan2 = new Tone.Panner(1).toMaster();
	var rev2 = new p5.Reverb();
	synthB = new Tone.MonoSynth({
		"portamento" : 0.1,
		"oscillator" : {
			"type" : "square"
		},
		"envelope" : {
			"attack" : 0.005,
			"decay" : 0.2,
			"sustain" : 0.4,
			"release" : 1.4,
		},
		"volume" : -10
	}).connect(rev2).connect(pan2);

	reverb = new p5.Reverb();
  // sonnects soundFile to reverb with a
  // reverbTime of 6 seconds, decayRate of 0.2%
  reverb.process(soundFile, 6, 0.2);

  reverb.amp(4); // turn it up!
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	changeTime = 0;
}

function draw() {

	var time = millis()/1000.;

	if(time >= changeTime){
		vel1 = random(180)*random(1)*random(1);
		vel2 = random(180)*random(1)*random(1);
		changeTime = time+pow(2, int(random(8))*0.5)*0.5;
		synthA.triggerAttack(vel1);
		synthB.triggerAttack(vel2);
	}

	var sub = 1+min(int(vel1*4), height);
	var h = height*1./sub;
	for(var i = 0; i < sub; i++) {
		noStroke();
		fill(map(pow(cos(vel1*time+i*0.5), 20), 0, 1, 0, 255));
		rect(0, h*i, width/2, h);
	}

	var sub = 1+min(int(vel2*4), height);
	var h = height*1./sub;
	for(var i = 0; i < sub; i++) {
		fill(map(pow(cos(vel2*time+i*0.5), 20), 0, 1, 0, 255));
		rect(width/2, h*i, width/2, h);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
