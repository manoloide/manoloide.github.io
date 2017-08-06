var canvas;
var sandbox;

var synthA, synthB;

var time, changeTime; 
var vel1, vel2, frq1, frq2; 

var scene = 1;

function preload(){
	canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	sandbox = new GlslCanvas(canvas);

	var code = "#ifdef GL_ES\n"+
		"precision mediump float;\n"+
		"#endif\n"+
		"uniform vec2 u_resolution;\n"+
		"uniform vec2 u_mouse;\n"+
		"uniform float u_time;uniform float frq1;\n"+
		"uniform float frq2;\n"+
		"uniform float vel1;\n"+
		"uniform float vel2;\n"+
		"uniform float pwr;\n"+
		"void main() {\n"+
		"    vec2 st = gl_FragCoord.xy/u_resolution.xy;\n"+
		"    float val = 0.0;\n"+
		"    if(st.x < 0.5) {\n"+
		"    	val = cos(st.y*vel1+u_time*frq1)*0.5+0.5;\n"+
		"    }\n"+
		"	else {\n"+
		"    	val = cos(st.y*vel2+u_time*frq2)*0.5+0.5;\n"+
		"    }\n"+
		"    \n"+
		"    val = pow(val, pwr);\n"+
		"    \n"+
		"    gl_FragColor = vec4(vec3(val),1.0);\n"+
		"}";
	code = "#ifdef GL_ES\n"+
	    "precision mediump float;\n"+
	    "#endif\n"+
	    "uniform vec2 u_resolution;\n"+
	    "uniform vec2 u_mouse;\n"+
	    "uniform float u_time;\n"+
	    "uniform sampler2D u_tex;\n"+
	    "uniform vec2 u_texResolution;\n"+
	    "float random (vec2 st) {\n"+
	    "    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);\n"+
	    "}\n"+
	    "void main() {\n"+
	    "    vec2 st = gl_FragCoord.xy;\n"+
	    "    st = floor(st*0.5)+0.5;\n"+
	    "    float rnd = floor(u_time*40.0);\n"+
	    "    if(mod(u_time, 6.0) > 2.0) {\n"+
	    "        rnd = floor(u_time/6.0); \n"+
	    "    } \n"+
	    "    \n"+
	    "    float val = floor(random(vec2(floor(st.x/4.0), floor(st.y/6.0))+rnd*vec2(0.000032, 0.0014))*10.0);\n"+
	    "    \n"+
	    "    float xx = mod((st.x+val*4.0)/u_texResolution.x, 1.0);\n"+
	    "    float yy = mod(st.y/u_texResolution.y, 1.0);\n"+
	    "    val = texture2D(u_tex, vec2(xx, yy)).r;\n"+
	    "    \n"+
	    "    vec3 color = vec3(val);//texture2D(u_tex, st).rgb;//\n"+
	    "    gl_FragColor = vec4(color,1.0);\n"+
	    "}"

	sandbox.load(code);
	sandbox.setUniform("frq1",8.0); 
	sandbox.setUniform("frq2",7.4); 
	sandbox.setUniform("vel1",1.0); 
	sandbox.setUniform("vel2",1.0); 
	sandbox.setUniform("pwr",1.0); 

	var pan1 = new Tone.Panner(-1).toMaster();
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
		"volume" : -40
	}).connect(pan1);

	var pan2 = new Tone.Panner(1).toMaster();
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
		"volume" : -40
	}).connect(pan2);
}

function setup() {
	changeTime = 0;
}

function draw() {

	var time = millis()/1000.;
	if(time >= changeTime){
		if(scene == 0) {
			frq1 = random(160)*random(1);
			frq2 = random(160)*random(1);
			vel1 = frq1*random(-1, 1);
			vel2 = frq2*random(-1, 1);
			changeTime = time+pow(2, int(random(4))*0.5);
			synthA.triggerAttack(frq1);
			synthB.triggerAttack(frq2);

			sandbox.setUniform("frq1", frq1); 
			sandbox.setUniform("frq2", frq2); 
			sandbox.setUniform("vel1", vel1); 
			sandbox.setUniform("vel2", vel2); 
			sandbox.setUniform("pwr", 1);
		}
		else if(scene == 1) {
			sandbox.setUniform("u_tex","numbers.png");
		}
	}

	/*
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
	*/
}

