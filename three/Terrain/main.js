var scene, camera, renderer;
var clock, deltaTime;
var width, height;
var mouseX, mouseY;
var cameraMovement;

var backColor;
var terrain;
var stone;

window.onload = function(){
	init();
	render();
}

function init() {
	width = window.innerWidth;
	height = window.innerHeight;
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xFF5500, 0.011 );
	camera = new THREE.PerspectiveCamera( 70, width/height, 0.1, 1000 );
	camera.eulerOrder = 'YXZ';
	clock = new THREE.Clock();

	mouseX = 0; mouseY = 0;
	cameraMovement = new THREE.Vector2();

	renderer = new THREE.WebGLRenderer({antialiasing: true});
	renderer.setSize( width, height );
	renderer.setClearColor( 0xFF5500 );
	document.body.appendChild( renderer.domElement );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 0, 50, 50 );
	scene.add( directionalLight );


	terrain = new Terrain(400, 400, 80, 80, 0, 0);
	stone = new Stone(0, terrain.getHeight(10, 10)+2.6, -10, 1.4, 1.8);

	createParticles();

	window.addEventListener( 'keydown', onKeyPress, false);
	window.addEventListener( 'keyup', onKeyRelease, false);
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
}

function render() {
	requestAnimationFrame( render );
	deltaTime = clock.getDelta();
	updateCamera();
	terrain.update();
	stone.update();
	updateParticles();
	renderer.render(scene, camera);
}

var left, right, up, down;
left = right = up = down = false;

function onKeyPress( e ) {
	e = e || window.event;
    if (e.keyCode == '87' || e.keyCode == '38') {
        up = true;
    }
    else if (e.keyCode == '83' || e.keyCode == '40') {
        down = true;
    }
    else if (e.keyCode == '68' || e.keyCode == '39') {
       left = true;
    }
    else if (e.keyCode == '65' || e.keyCode == '37') {
       right = true;
    }
    if (e.keyCode == '71'){
    	generate();
    }
} 

function onKeyRelease( e ) {
	e = e || window.event;
    if (e.keyCode == '87' || e.keyCode == '38') {
        up = false;
    }
    else if (e.keyCode == '83' || e.keyCode == '40') {
        down = false;
    }
    else if (e.keyCode == '68' || e.keyCode == '39') {
       left = false;
    }
    else if (e.keyCode == '65' || e.keyCode == '37') {
       right = false;
    }
} 

function onMouseMove( event ) {
	mouseX = event.clientX - width/2;
	mouseY = event.clientY - height/2;
}

function onWindowResize() {
	width = window.innerWidth;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize( width, height );
}

function generate() {
	var colours = [0xFF5500, 0xFF3355, 0x68FFC8, 0xFFDC17, 0x7133FF];
	backColor = colours[parseInt(Math.random()*colours.length)];
	scene.fog = new THREE.FogExp2( backColor, 0.011 );
	renderer.setClearColor( backColor );
    
    terrain.randParam();	

    var dist = 30 + Math.random()*60;
    var angle = Math.random()*Math.PI*2;
    var x = camera.position.x + Math.cos(angle)*dist;
    var z = camera.position.z + Math.sin(angle)*dist;
    var y = terrain.getHeight(x, z)+2.6;
    stone.setPosition(x, y, z);

}

function updateCamera () {

	camera.position.y -= (camera.position.y-(terrain.getHeight(camera.position.x, camera.position.z, 20)+3))*0.9;

	var my = deltaTime*2.2*(mouseY/height)*((Math.abs(mouseY) < height/8)? 0 : (Math.abs(mouseY)-height/8)/height);
	var mx = deltaTime*2.2*(mouseX/width)*((Math.abs(mouseX) < width/8)? 0 : (Math.abs(mouseX)-width/8)/width);
	var mv = deltaTime*0.3;
	cameraMovement.add(new THREE.Vector2(Math.min(Math.abs(my), mv)*Math.sign(my), Math.min(Math.abs(mx), mv)*Math.sign(mx)));
	cameraMovement.multiplyScalar(0.88);

	camera.rotation.x -= cameraMovement.x;
	camera.rotation.x = Math.min(Math.max(camera.rotation.x, Math.PI*-0.4), Math.PI*0.4);
	camera.rotation.y -= cameraMovement.y;

	var movement = new THREE.Vector2(0, 0);
	if(up) {
		movement.y -= 1;
	}
	if(down) {
		movement.y += 1;
	}
	if(left) {
		movement.x += 1;
	}
	if(right) {
		movement.x -= 1;
	}

	movement.normalize();
	movement.multiplyScalar(7*deltaTime);

	camera.translateX(movement.x);
	camera.translateZ(movement.y);
}

var particles;
function createParticles () {
	var geometry = new THREE.Geometry();
	var amp = 200;
	for ( i = 0; i < 10000; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * amp - amp/2;
		vertex.y = Math.random() * amp/2;// - 100;
		vertex.z = Math.random() * amp - amp/2;
		geometry.vertices.push( vertex );
	}

	var color = [1, 1, 1];
	var size  = 0.08;
	material = new THREE.PointsMaterial( { size: size, color: color} );
	particles = new THREE.Points( geometry, material );
	scene.add( particles );
}

function updateParticles () {

	var dx = camera.position.x-particles.position.x;
	var dz = camera.position.z-particles.position.z;
	particles.position.x = camera.position.x;
	particles.position.z = camera.position.z;
	var pd = 200;
	for(var j = 0; j < particles.geometry.vertices.length; j++) {
		v = particles.geometry.vertices[j];
		v.x -= dx;
		v.z -= dz;

		v.x += 5.2*deltaTime;
		v.y += Math.random()*deltaTime*0.5;
		v.z += Math.random()*deltaTime*0.5;

		if(v.y > pd/2 || v.y < 0){
			v.y -= pd*Math.sign(v.y)/2;
		}
		//
		if(v.x > pd/2) {
			v.x -= pd;
		}
		if(v.x < -pd/2){
			v.x += pd;
		}
		//
		if(v.z > pd/2) {
			v.z -= pd;
		}
		if(v.z < -pd/2){
			v.z += pd;
		}
	}
	particles.geometry.verticesNeedUpdate = true;	
}



class Terrain {
	constructor(w, h, cw, ch) {
		this.geometryTerrain = this.createTerrain(w, h, cw, ch, 0, 0);
		this.geometryTerrain.verticesNeedUpdate = true;
		this.terrainStroke = new THREE.Mesh(this.geometryTerrain, new THREE.MeshBasicMaterial({color: 0x242424, wireframe: true, wireframeLinewidth: 2}));
		scene.add( this.terrainStroke );
		this.terrainStroke.position.y += 0.004;
		this.terrain = new THREE.Mesh(this.geometryTerrain, new THREE.MeshPhongMaterial({color: 0x3F3F3F, shininess: 30}));
		//this.terrain = new THREE.Mesh(this.geometryTerrain, new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors}));
		this.terrainNoise(this.geometryTerrain);
		scene.add( this.terrain );
		this.height = 20;
		this.detail = 0.05;
		this.power = 4;
	}

	createTerrain(w, h, cw, ch, x, z) {
		var geometry = new THREE.Geometry();

		this.dx = w*1./cw;
		this.dy = h*1./ch;
		for(var j = 0; j <= ch; j++){
			for(var i = 0; i <= cw; i++){
				var vert = new THREE.Vector3( this.dx*i-w/2.+x,  0, this.dy*j-h/2.+z);
				geometry.vertices.push(vert);
				//geometry.colors.push(new THREE.Color(0xFF0000));
			}
		}

		var dx = cw+1;
		var dy = ch+1;
		for(var j = 0; j < ch; j++){
			for(var i = 0; i < cw; i++){
				geometry.faces.push(new THREE.Face3( i+j*dx, i+1+j*dx, i+1+(j+1)*dx));
				geometry.faces.push(new THREE.Face3( i+j*dx, i+1+(j+1)*dx,  i+(j+1)*dx));
			}
		}

		geometry.rotateX(Math.PI);
		geometry.colorsNeedUpdate = true;
		geometry.computeMorphNormals();
		geometry.computeFaceNormals();

		return geometry;
	}

	update() {
		this.terrainNoise(this.geometryTerrain);
	}

	terrainNoise(geo){
		var dx = camera.position.x;
		var dz = camera.position.z;

		var dx = dx-dx%this.dx;
		var dz = dz-dz%this.dy;

		this.terrainStroke.position.x = dx;
		this.terrainStroke.position.z = dz;
		this.terrain.position.x = dx;
		this.terrain.position.z = dz;

		for(var i = 0; i < geo.vertices.length; i++) {
			var v = geo.vertices[i];
			var p = this.getHeight(v.x+dx, v.z+dz);
			v.y = p;//Math.cos(v.x+v.z+time)*2; 
		}

		geo.verticesNeedUpdate = true;
		geo.computeFaceNormals();
		geo.normalsNeedUpdate = true;
	}

	getHeight(x, z) {
		var hh = PerlinNoise.noise(x*this.detail*0.1+32, 0, z*this.detail*0.1+983)*this.height*0.3;
		return hh+Math.pow(PerlinNoise.noise(x*this.detail, 0, z*this.detail), this.power)*this.height;
	}

	randParam() {
		this.height = 10*Math.random()+Math.random()*30;
		this.detail = Math.random()*0.02+Math.random()*0.06;
		this.power = Math.random()*1+Math.random()*Math.random()*4;
	}
}


class Stone {
	constructor(x, y, z, w, h){
		this.w = w;
		this.h = h;

		var geometry = this.create();
		var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, emissive: 0xE9E9E9});
		this.mesh = new THREE.Mesh( geometry,  material);
		scene.add(this.mesh);

		this.light = new THREE.PointLight( 0xFFFFFF, 1, 6 );
		scene.add(this.light);

		this.setPosition(x, y, z);
	}

	create(){
		var geometry = new THREE.Geometry();
		var mw = this.w*0.5;
		var mh = this.h*0.5;
		geometry.vertices.push(new THREE.Vector3(0, -mh, 0));
		geometry.vertices.push(new THREE.Vector3(0, mh, 0));
		var da = Math.PI*0.5;
		for(var i = 0; i < 4; i++){
			geometry.vertices.push(new THREE.Vector3(Math.cos(da*i)*mw, 0, Math.sin(da*i)*mw));
		}
		
		for(var i = 0; i < 4; i++){
			geometry.faces.push(new THREE.Face3(0, 2+i, 2+(i+1)%4));
			geometry.faces.push(new THREE.Face3(2+i, 1, 2+(i+1)%4));
		}

        geometry.computeFaceNormals();
		geometry.computeVertexNormals();  

		return geometry;
	}

	setPosition(x, y, z) {
		this.x = x; 
		this.y = y; 
		this.z = z;
		this.mesh.position.set(this.x, this.y, this.z);
		this.light.position.set(this.x, this.y, this.z);
	}

	update() {
		var t = Date.now()*0.0016;
		var color = "hsl("+(t*20)%360+", 100%, 94%)";
		this.mesh.position.set(this.x, this.y+Math.cos(t)*0.2, this.z);
		this.mesh.material.color.set(color);
		this.mesh.material.emissive.set(color);
		this.light.position.set(this.x, this.y+Math.cos(t)*0.2, this.z);
		this.light.color.set(color);

		var dx = Math.abs(this.x-camera.position.x);
		var dz = Math.abs(this.z-camera.position.z);

		if(dx+dz < 2) {
			generate();
		}
	}
}