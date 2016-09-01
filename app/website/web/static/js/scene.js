import Car from "./car";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff, 1);
document.body.appendChild( renderer.domElement );

var pizzaCar = {
  width: 100,
  outlinePoints: "0,-30 70,-10 20,-50 110,0 30,50 0,40 -230,0",
  faces: [
    "pizza-left.png",
    "pizza-right.png",
    "pizza-mid1.png",
    null,
    "pizza-mid3.png",
    null,
    "pizza-mid5.png",
    "pizza-mid6.png",
    null
  ],
  wheels: [
    {x: 40, y: 0, z: 1, r: 20},
    {x: 180, y: 0, z: 1, r: 20},
    {x: 40, y: 0, z: -101, r: 20},
    {x: 180, y: 0, z: -101, r: 20},
  ],
  color: 0xe6e6e6
};

var car = new Car(pizzaCar);
var cube = car.mesh();
cube.rotateY(Math.PI/3);
scene.add(cube);

camera.position.z = 300;
camera.position.y = 50;

var render = function () {
  requestAnimationFrame( render );

  renderer.render(scene, camera);
};

let lastX = 0;
let lastY = 0;

let onDocumentMouseMove = function(event) {
	event.preventDefault();
  if (event.buttons != /*LMB*/1) {
    return;
  }

  let newX = event.clientX / window.innerWidth;
  cube.rotation.y += 10*(newX - (lastX || newX));
  lastX = newX;

  let newY = event.clientY / window.innerHeight;
  cube.rotation.x += 10*(newY - (lastY || newY));
  lastY = newY;
};

let onDocumentMouseDown = function(event) {
  state.isChanging = true;
};

let onDocumentMouseUp = function(event) {
  state.isChanging = false;
  lastX = 0;
  lastY = 0;
};


var state = {
  refresh: newState => {
    cube.rotation.x = newState.x;
    cube.rotation.y = newState.y;
  },
  capture: () => {
    return {
    x: cube.rotation.x,
    y: cube.rotation.y
  }; },
  isChanging: false
};

renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

render();

export default state;
