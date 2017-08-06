var reeverb;
var synth;

function preload(){
	/*
	var reeverb = new Tone.Freeverb().toMaster();
	reeverb.roomSize.value = 0.7;
	reeverb.dampening.value = 1000;
	reeverb.wet.value = 0.1;
	*/
	synth = new Tone.MonoSynth({
		"portamento" : 0.0,
		"oscillator" : {
			"type" : "sine"
		},
		"envelope" : {
			"attack" : 0.005,
			"decay" : 0.1,
			"sustain" : 0.0,
			"release" : 0.01,
		},
		"volume" : -10
	}).toMaster();//.connect(reeverb);
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	Tone.Transport.start();
	generate();
}

var cc, ss;
var actual = -1;
var values = [];

function draw() {
	//var time = millis()/1000.;


	if(actual == cc*cc) generate();

	background(10);

	strokeWeight(1);
	stroke(140);
	noFill();
	rectMode(CENTER);
	var dx = (width-ss*(cc-1))*0.5;
	var dy = (height-ss*(cc-1))*0.5;
	for(var j = 0; j < cc; j++){
		for(var i = 0; i < cc; i++){
			if(values[i+j*cc] == 1) fill(140);
			else noFill();
			if(i+j*cc == actual) fill(0);
			rect(dx+i*ss, dy+j*ss, ss*0.8, ss*0.8, 1);
		}
	}
}

function keyPressed(){
	generate();
}

var seq;
function generate() {
	cc = int(pow(2, int(random(1, 4))));
	ss = min(width*0.8, height*0.8)*1./(cc);

	values = [];
	var max = 0.05+Math.random()*(0.5+Math.random()*0.5);
	for(var i = 0; i < cc*cc+1; i++){
		var val = (Math.random() > max)? 0 : 1;
		values.push(val);
	}

	if(seq) seq.stop();
	actual = -1;
	seq = new Tone.Sequence(function(time, note){
		actual++;
		if(note != 0 && actual != cc*cc) synth.triggerAttack("C7");
	}, values, "32n");
	seq.loop = false;
	seq.start();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}