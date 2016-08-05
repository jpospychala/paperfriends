var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var render = function () {
  requestAnimationFrame( render );

  renderer.render(scene, camera);
};

var sync = {
  start: function(channel) {
    console.log("start")
    setInterval(function() {
      if (isLeading) {
        channel.push("new_msg", {body: {x: cube.rotation.x, y: cube.rotation.y}});
      }
    }, 1000/25);

    channel.on("new_msg", payload => {
      if (!isLeading) {
        cube.rotation.x = payload.body.x;
        cube.rotation.y = payload.body.y;
      }
    });
  }
}

let isLeading = false;
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
}

let onDocumentMouseDown = function(event) {
  isLeading = true;
}

let onDocumentMouseUp = function(event) {
  isLeading = false;
  lastX = 0;
  lastY = 0;
}


renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

render();

export default sync
