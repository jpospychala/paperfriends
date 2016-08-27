var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var PI = Math.PI;
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff, 1);
document.body.appendChild( renderer.domElement );

let svgPathToPoints = function(str) {
  var pts = str.split(/[ ,]/);
  var x = 0, y = 0;
  var result = [];
  for (var i = 0; i < pts.length; i+= 2) {
    var dx = pts[i]*0.01;
    var dy = pts[i+1]*0.01;
    x += dx;
    y -= dy;
    result.push({dx, dy, x, y});
  }
  return result;
};

let pointsToShape = function(pts) {
  var shape = new THREE.Shape();
  for (var i = 0; i < pts.length; i++) {
    shape.lineTo(pts[i].x, pts[i].y);
  }
  return shape;
};

let rect = function(dx, dy, z) {
  var shape = new THREE.Shape();
  var dxy = Math.sqrt(dx*dx+dy*dy);
  shape.lineTo(z, 0);
  shape.lineTo(z, dxy);
  shape.lineTo(0, dxy);
  return shape;
};

let drawCar = function() {
  var width = 1;
  var boxMaterials = [
     new THREE.MeshBasicMaterial({color:0xFF0000}),
     new THREE.MeshBasicMaterial({color:0x00FF00}),
     new THREE.MeshBasicMaterial({color:0x0000FF}),
     new THREE.MeshBasicMaterial({color:0xFFFF00}),
     new THREE.MeshBasicMaterial({color:0x00FFFF}),
     new THREE.MeshBasicMaterial({color:0xFF00FF})
  ];
  boxMaterials.forEach(function(m) {m.side = THREE.DoubleSide; });
  var points = svgPathToPoints("0,-30 70,-10 20,-50 110,0 30,50 0,40");
  var shape = pointsToShape(points);
  var geometry = shape.makeGeometry();

  var group = new THREE.Group();

  var lmesh = new THREE.Mesh(geometry, boxMaterials[0]);
  group.add(lmesh);

  var rmesh = new THREE.Mesh(geometry, boxMaterials[1]);
  rmesh.position.z = -width;
  group.add(rmesh);
  var front = new THREE.Group();
  front.rotateY(PI/2);
  for (var i = 0; i < points.length; i++) {
    var p1 = points[i];
    var sideShape = rect(p1.dx, p1.dy, width);
    var shapeGeometry = sideShape.makeGeometry();
    var sideMesh = new THREE.Mesh(shapeGeometry, boxMaterials[2 + (i % (boxMaterials.length -2))]);
    sideMesh.position.set(0, p1.y, p1.x);

    var upright = p1.dx >= 0 && p1.dy < 0 ? -1 : 0;
    var horiz = p1.dy === 0 ? PI/2 : 0;
    var downright = p1.dx >= 0 && p1.dy > 0 ? 1 : 0;
    var atan =  Math.atan(p1.dx/p1.dy);
    sideMesh.rotateX(PI + upright * atan + horiz + downright * (PI - atan));
    front.add(sideMesh);
  }
  group.add(front);

  return group;
};
var cube = drawCar();
scene.add(cube);

camera.position.z = 4;

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
