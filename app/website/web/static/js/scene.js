var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let svgPathToShape = function(str) {
  var pts = str.split(/[ ,]/);
  var x = 0, y = 0;
  var shape = new THREE.Shape();
  for (var i = 0; i < pts.length; i+= 2) {
    var dx = pts[i]*0.01;
    var dy = pts[i+1]*0.01;
    x += dx;
    y -= dy;
    shape.lineTo(x, y);
  }
  return shape;
}
let drawCar = function() {
  var shape = svgPathToShape("0,-30 70,-10 20,-50 110,0 30,50 0,40");
  var extrudeSettings = { amount: 1.5, bevelEnabled: false, steps: 1 };
  var geometry = shape.extrude(extrudeSettings);

  var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  var mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

//var cube = drawCube();
var cube = drawCar();
scene.add(cube);

camera.position.z = 5;

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
    console.log('refresh');
    cube.rotation.x = newState.x;
    cube.rotation.y = newState.y;
  },
  capture: () => {
    console.log('caputre');
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
