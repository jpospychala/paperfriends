import ModelBuilder from "./modelBuilder";
import CursorBasedRotate from "./cursorBasedRotate";

function Scene() {
  var scene;
  var camera;
  var cameraHelper;
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
    cameraHelper = new THREE.CameraHelper(camera);
    cameraHelper.visible = true;
 
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
    

    if (viewStyle == "view3d") {
      var centeredCube = new THREE.Group();
      modelBuilder.alignCenter(cube, centeredCube);
      centeredCube.add(cube);
      cube = centeredCube;

      camera.position.z = 300;
      camera.position.y = 50;
      cube.rotateY(Math.PI/3);
    } else {
      camera.position.x = 0;
      camera.position.y = 0;

      var cubeSize = modelBuilder.boundingBox(cube).size();
      modelBuilder.alignCenter(cube, camera);
      zoomToFit(camera,cubeSize);
    }
    rotate.setTarget(viewStyle == "view3d" ? cube : undefined);

    scene.add(cube);
    scene.add(cameraHelper);
    render();
  };

  this.setViewStyle = function(newStyle) {
    viewStyle = newStyle;
  }

  function zoomToFit(camera, cubeSize) {
    if (cubeSize.x/width > cubeSize.y/height) {
      var wTh = width/height;
      camera.position.z =wTh*cubeSize.x/Math.tan(camera.fov*0.5*THREE.Math.DEG2RAD)
    } else {
      camera.position.z = 0.5*cubeSize.y/Math.tan(camera.fov*0.5*THREE.Math.DEG2RAD)
    }
  }
};

export default Scene;
