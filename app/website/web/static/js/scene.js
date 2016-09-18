import Car from "./car";

var scene;
var camera;
var renderer;
var cube;

var init = (element) => {
  var width = element.clientWidth;
  var height = window.innerHeight *0.6;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 50, width/height, 0.1, 1000 );
  camera.position.z = 300;
  camera.position.y = 50;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( width, height );
  renderer.setClearColor(0xffffff, 1);

  renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
  renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
  renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

  element.appendChild( renderer.domElement );
};


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
  isChanging: false,
  init: init,
  loadModel: function(model) {
    scene.children.length > 0 ? scene.remove(scene.children[0]) : undefined;

    var car = new Car(model);
    cube = car.mesh();
    cube.rotateY(Math.PI/3);
    scene.add(cube);
    render();
  }
};

export default state;
