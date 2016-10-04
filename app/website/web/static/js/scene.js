import ModelBuilder from "./modelBuilder";
import CursorBasedRotate from "./cursorBasedRotate";

function Scene() {
  var scene;
  var camera;
  var renderer;
  var width;
  var height;
  var viewStyle = "view3d";

  var render = function () {
    requestAnimationFrame( render );

    renderer.render(scene, camera);
  };

  var modelBuilder = new ModelBuilder();
  var rotate = new CursorBasedRotate();

  this.init = (element) => {
    width = element.clientWidth;
    height = width*Math.sqrt(2); //window.innerHeight; // *0.6;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 50, width/height, 0.1, 1000 );
 
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    renderer.setClearColor(0xffffff, 1);
    rotate.attach(renderer.domElement);
    element.appendChild( renderer.domElement );
  };

  this.loadModel = function(model) {
    scene.children.length > 0 ? scene.remove(scene.children[0]) : undefined;

    modelBuilder.setViewStyle(viewStyle);
    var cube = modelBuilder.buildMesh(model);
    
    cube = modelBuilder.center(cube);

    if (viewStyle == "view3d") {
      camera.position.z = 300;
      camera.position.y = 50;
      cube.rotateY(Math.PI/3);
    } else {
      
    }
    rotate.setTarget(viewStyle == "view3d" ? cube : undefined);

    scene.add(cube);
    render();
  };

  this.setViewStyle = function(newStyle) {
    viewStyle = newStyle;
  }
};

export default Scene;
