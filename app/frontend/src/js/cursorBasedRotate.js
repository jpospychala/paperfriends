function CursorBasedRotate() {
  var lastX = 0;
  var lastY = 0;
  var mesh;
  var that = this;
  var enabled = true;

  this.enable = function(newVal) {
    enabled = newVal;
  }

  this.attach = function(domElement) {
    lastX = 0;
    lastY = 0;
    domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
    domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
  };
  
  this.setTarget = function(newmesh) {
    mesh = newmesh;
  }

  let onDocumentMouseMove = function(event) {
    event.preventDefault();
    if (event.buttons != /*LMB*/1) {
      return;
    }

    if (!enabled) {
      return;
    }

    let newX = event.clientX / window.innerWidth;
    mesh.rotation.y += 10*(newX - (lastX || newX));
    lastX = newX;

    let newY = event.clientY / window.innerHeight;
    mesh.rotation.x += 10*(newY - (lastY || newY));
    lastY = newY;
  };


  let onDocumentMouseUp = function(event) {
    lastX = 0;
    lastY = 0;
  };
}

export default CursorBasedRotate;