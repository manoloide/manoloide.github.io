var scene, camera, renderer;
var clock;
var width, height;
var mouseX, mouseY;
var cameraMovement;

var terrain;

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
	clock = new THREE.Clock();

	mouseX = 0; mouseY = 0;
	cameraMovement = new THREE.Vector2();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( width, height );
	renderer.setClearColor( 0xFF5500 );
	document.body.appendChild( renderer.domElement );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( -0.5, -0.8, 0 );
	scene.add( directionalLight );

	terrain = new Terrain(400, 400, 80, 80, 0, 0);


	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 0, 50, 50 );
	scene.add( directionalLight );

	//camera.position.z = 5;

	createParticles();

	window.addEventListener( 'keydown', onKeyPress, false);
	window.addEventListener( 'keyup', onKeyRelease, false);
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
}

function render() {
	requestAnimationFrame( render );

	updateCamera();
	terrain.update();
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
    else if (e.keyCode == '68' || e.keyCode == '37') {
       left = true;
    }
    else if (e.keyCode == '65' || e.keyCode == '39') {
       right = true;
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
    else if (e.keyCode == '68' || e.keyCode == '37') {
       left = false;
    }
    else if (e.keyCode == '65' || e.keyCode == '39') {
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

function updateCamera () {

	camera.position.y = terrain.getHeight(camera.position.x, camera.position.z, 20)+3;

	var my = 0;
	var mx = mouseX*0.00008*((Math.abs(mouseX) < width/6)? 0 : (Math.abs(mouseX)-width/6)/width);
	cameraMovement.add(new THREE.Vector2(my, mx));
	cameraMovement.multiplyScalar(0.8);

	camera.rotation.y -= cameraMovement.y;
	camera.rotation.x -= cameraMovement.x;

	var angle = 0;
	var velocity = 0;
	var camVel = 0.2;
	if(up) {
		angle = -Math.PI/2;
		velocity = camVel;
	}
	if(down) {
		angle = Math.PI/2;
		velocity = camVel;
	}
	if(left) {
		angle = 0;
		velocity = camVel;
	}
	if(right) {
		angle = Math.PI;
		velocity = camVel;
	}

	camera.translateX(Math.cos(angle)*velocity);
	camera.translateZ(Math.sin(angle)*velocity);
}

function createParticles () {
	var geometry = new THREE.Geometry();
	for ( i = 0; i < 1000; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 200 - 100;
		vertex.y = Math.random() * 200 - 100;
		vertex.z = Math.random() * 200 - 100;
		geometry.vertices.push( vertex );
	}

	var color = [1, 1, 1];
	var size  = 0.1;
	var  materials = [];
	for ( i = 0; i < 10; i ++ ) {
		materials[i] = new THREE.PointsMaterial( { size: size } );
		particles = new THREE.Points( geometry, materials[i] );
		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;
		scene.add( particles );
	}
}

function updateParticles () {
	var time = Date.now() * 0.00002;

	for ( i = 0; i < scene.children.length; i ++ ) {
		var object = scene.children[ i ];
		if ( object instanceof THREE.Points ) {
			object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
		}
	}
}



class Terrain {
	constructor(w, h, cw, ch) {
		this.geometryTerrain = this.createTerrain(w, h, cw, ch, 0, 0);
		this.geometryTerrain.verticesNeedUpdate = true;
		this.terrainStroke = new THREE.Mesh( this.geometryTerrain, new THREE.MeshBasicMaterial( { color: 0x242424, wireframe: true, wireframeLinewidth: 2} ));
		scene.add( this.terrainStroke );
		this.terrainStroke.position.y += 0.005;
		this.terrain = new THREE.Mesh( this.geometryTerrain, new THREE.MeshPhongMaterial( { color: 0x3F3F3F, shininess: 30} ));
		this.terrainNoise(this.geometryTerrain);
		scene.add( this.terrain );
	}

	createTerrain(w, h, cw, ch, x, z) {
		var geometry = new THREE.Geometry();

		this.dx = w*1./cw;
		this.dy = h*1./ch;
		for(var j = 0; j <= ch; j++){
			for(var i = 0; i <= cw; i++){
				var vert = new THREE.Vector3( this.dx*i-w/2.+x,  0, this.dy*j-h/2.+z);
				geometry.vertices.push(vert);
			}
		}

		var dx = cw+1;
		var dy = ch+1;
		for(var j = 0; j < ch; j++){
			for(var i = 0; i < cw; i++){
				geometry.faces.push( new THREE.Face3( i+j*dx, i+1+j*dx, i+1+(j+1)*dx) );
				geometry.faces.push( new THREE.Face3( i+j*dx, i+1+(j+1)*dx,  i+(j+1)*dx) );
			}
		}

		geometry.rotateX(Math.PI);
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
			var p = this.getHeight(v.x+dx, v.z+dz, 20);
			v.y = p;//Math.cos(v.x+v.z+time)*2; 
		}

		geo.verticesNeedUpdate = true;
		geo.computeFaceNormals();
		geo.normalsNeedUpdate = true;
	}

	getHeight(x, z, h) {
		var det = 0.05;
		return Math.pow(PerlinNoise.noise(x*det, 0, z*det), 4)*20;
	}
}