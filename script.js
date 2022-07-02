document.body.style.margin = "0px";
document.body.style.overflow = "hidden";

const h_scr = window.innerWidth;
const v_scr = window.innerHeight; 

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, h_scr / v_scr, 0.1, 100);
camera.position.y = 2;

var light = new THREE.PointLight( );
light.position.set( 50, 50, 50 );
scene.add( light );

var renderer = new THREE.WebGLRenderer();
renderer.setSize(h_scr, v_scr);
document.body.appendChild(renderer.domElement);

var box = new THREE.Mesh( 
  new THREE.BoxBufferGeometry( 1, 1, 1 ),
  new THREE.MeshLambertMaterial( {
    color: 0xff7f00
  } )
);
box.position.z = 4;
scene.add(box);

scene.background = new THREE.CubeTextureLoader()
.setPath( './skybox/' )
.load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );

var listener = new THREE.AudioListener();
camera.add( listener );

var sound = new THREE.PositionalAudio( listener );

var loader = new THREE.AudioLoader();
loader.load('./sounds/my_song.mp3',
  function( buffer ) { 
    sound.setBuffer( buffer ); 
    sound.setLoop( true ); 
    box.add(sound);
    document.getElementById("playbutton").innerText = "Click To Play Music";
    document.getElementById("playbutton").addEventListener("click", soundon, false);
  },
  function(per){
    document.getElementById("loadPer").innerText = ((per.loaded/4700000)*100).toFixed(1);
  }
);

function soundon(){
  sound.play();
  document.getElementById("playbutton").innerHTML = "playing";
  document.getElementById("playbutton").removeEventListener("click", soundon, false);
  document.getElementById("playbutton").style.backgroundColor = "rgba(255,255,255,0)";
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = h_scr / v_scr;
  camera.updateProjectionMatrix();
  renderer.setSize(h_scr, v_scr);
}

function animate() {
  requestAnimationFrame(animate);

  var speed = Date.now() * 0.0003;
  camera.position.x = Math.cos(speed) * 5;
  camera.position.z = Math.sin(speed) * 5;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();