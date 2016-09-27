import ModelBuilder from "./modelBuilder";
import CursorBasedRotate from "./cursorBasedRotate";

var tscene;
var camera;
var renderer;

var render = function () {
  requestAnimationFrame( render );

  renderer.render(tscene, camera);
};

var modelBuilder = new ModelBuilder();
var rotate = new CursorBasedRotate();
var scene = {
  cube: undefined,
  init: (element) => {
    var width = element.clientWidth;
    var height = window.innerHeight *0.6;
    tscene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 50, width/height, 0.1, 1000 );
    camera.position.z = 300;
    camera.position.y = 50;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    renderer.setClearColor(0xffffff, 1);
    rotate.attach(renderer.domElement);
    element.appendChild( renderer.domElement );
  },
  loadModel: function(model) {
    tscene.children.length > 0 ? tscene.remove(tscene.children[0]) : undefined;

    var cube = modelBuilder.buildMesh(model);
    scene.cube = modelBuilder.center(cube);
    scene.cube.rotateY(Math.PI/3);
    tscene.add(scene.cube);
    rotate.setTarget(scene.cube);
    render();
  },
  setViewStyle: function(newStyle) {
    modelBuilder.setViewStyle(newStyle);
  }
};

export default scene;
