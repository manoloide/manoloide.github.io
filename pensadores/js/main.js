var camera, scene, renderer, controls;
var geometry, material, mesh;

var materials = [];
var indexMaterial = 0;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 8000 );
	//camera.position.z = 10;
  //camera.position.y = -3.5;
	camera.position.set( 0, 0, 40 );
  controls = new THREE.OrbitControls( camera );
  controls.enableKeys = false;
	controls.enablePan = false;
  controls.target.set( 0, 0, 0 );
  controls.minDistance = 10;
  controls.maxDistance = 80;

  controls.enableDamping = true;
  controls.dampingFactor = 0.2;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 1.2;

	scene = new THREE.Scene();
  scene.background = 0x000000;

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	createMaterials();
  createLigths();
  createScene();

}

function createLigths(){

	/*
  var ambient = new THREE.AmbientLight( 0xFFFFFF, 10.5 );
  scene.add( ambient );
	*/

  var light1 = new THREE.DirectionalLight( 0xffffff, 1.8 );
  light1.position.set( 1, 1, 1 );
  //light.target = new THREE.Vector3( 0, 0, 0 );
  scene.add( light1 );

  var light2 = new THREE.DirectionalLight( 0xeeeeff,  0.5);
  light2.position.set( -1, -1, -1 );
  //light.target = new THREE.Vector3( 0, 0, 0 );
  scene.add( light2 );


}

function createMaterials(){
	var map = new THREE.TextureLoader().load( "models/thinker/textures/METAL_TEX/thinker_Base_Color.jpg" );
	var normal = new THREE.TextureLoader().load( "models/thinker/textures/METAL_TEX/thinker_Normal_OpenGL.jpg" );
	var roughness = new THREE.TextureLoader().load( "models/thinker/textures/METAL_TEX/thinker_Roughness.jpg" );
	var material1 = new THREE.MeshStandardMaterial({
		color: 0xFFEEAA,
		emissive: 0x080808,
		map: map,
		normalMap: normal,
		metalnessMap: roughness,
		metalness: 1
	});

	var map = new THREE.TextureLoader().load( "models/thinker/textures/MARMOL_TEX/thinker_Base_Color.jpg" );
	var normal = new THREE.TextureLoader().load( "models/thinker/textures/MARMOL_TEX/thinker_Normal_OpenGL.jpg" );
	var roughness = new THREE.TextureLoader().load( "models/thinker/textures/MARMOL_TEX/thinker_Roughness.jpg" );
	var material2 = new THREE.MeshStandardMaterial({
		color: 0xFFFFFF,
		map: map,
		normalMap: normal,
		roughnessMap: roughness,
		roughness: 0.4,
		metalness: 0
	});

	var map = new THREE.TextureLoader().load( "models/thinker/textures/MADERA_TEX/thinker_Base_Color.jpg" );
	var normal = new THREE.TextureLoader().load( "models/thinker/textures/MADERA_TEX/thinker_Normal_OpenGL.jpg" );
	var roughness = new THREE.TextureLoader().load( "models/thinker/textures/MADERA_TEX/thinker_Roughness.jpg" );
	var material3 = new THREE.MeshStandardMaterial({
		color: 0xFFFFFF,
		map: map,
		normalMap: normal,
		roughnessMap: roughness,
		roughness: 0.3,
		metalness: 0
	});

  var material4 = new THREE.MeshPhongMaterial( {
		color: 0x440b0b,
		transparent: true,
		opacity: 0.96,
		shininess: 70,
		specular: 0x392121
	});

  materials.push(material1);
  materials.push(material2);
  materials.push(material3);
  materials.push(material4);
}

var model;

function createScene() {

  var loader = new THREE.GLTFLoader();
    loader.load( 'models/thinker/scene.gltf',
    function ( gltf ) {

      var mesh = gltf.scene.children[ 0 ];
      model = mesh;

		  model.scale.set( 0.01, 0.01, 0.01 );
      model.position.set( 0, -8.8, 0.5 );

			model.traverse((node) => {
        if (node.isMesh) {
          node.material = materials[ indexMaterial ];
        }
      });

      scene.add( model );

    }
  );

}

function animate() {

  controls.update();

	requestAnimationFrame( animate );
	renderer.render( scene, camera );

}

window.addEventListener("dblclick", function(){

  indexMaterial++;
  if(indexMaterial >= materials.length) indexMaterial = 0;


  model.traverse((node) => {
    if (node.isMesh) {
      node.material = materials[indexMaterial];
    }
  });

  /* ray eleminar
  x = (event.clientX / window.innerWidth) * 2 - 1;
  y = -(event.clientY / window.innerHeight) * 2 + 1;
  dir = new THREE.Vector3(x, y, -1)
  dir.unproject(camera)

  ray = new THREE.Raycaster(camera.position, dir.sub(camera.position).normalize())
  var intersects = ray.intersectObject(model);
  if ( intersects.length > 0 ){
    console.log("hit");
  }
  */
});

window.onresize = function() {

	renderer.setSize(window.innerWidth,window.innerHeight);
	var aspectRatio = window.innerWidth/window.innerHeight;
	camera.aspect = aspectRatio;
	camera.updateProjectionMatrix();

}
