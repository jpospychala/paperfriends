import ModelBuilder from "./modelBuilder";
import CursorBasedRotate from "./cursorBasedRotate";

function Scene() {
  var scene;
  var camera;
  var renderer;

  var render = function () {
    requestAnimationFrame( render );

    renderer.render(scene, camera);
  };

  var modelBuilder = new ModelBuilder();
  var rotate = new CursorBasedRotate();

  this.init = (element) => {
    var width = element.clientWidth;
    var height = window.innerHeight *0.6;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 50, width/height, 0.1, 1000 );
    camera.position.z = 300;
    camera.position.y = 50;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    renderer.setClearColor(0xffffff, 1);
    rotate.attach(renderer.domElement);
    element.appendChild( renderer.domElement );
  };

  this.loadModel = function(model) {
    scene.children.length > 0 ? scene.remove(scene.children[0]) : undefined;

    var cube = modelBuilder.buildMesh(model);
    cube = modelBuilder.center(cube);
    modelBuilder.setDefaultPosition(cube);
    scene.add(cube);
    rotate.setTarget(cube);
    render();
  };

  this.setViewStyle = function(newStyle) {
    modelBuilder.setViewStyle(newStyle);
  }
};

export default Scene;
