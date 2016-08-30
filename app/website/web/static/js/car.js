const PI = Math.PI;

let svgPathToPoints = function(str) {
  var pts = str.split(/[ ,]/);
  var x = 0, y = 0;
  var result = [];
  for (var i = 0; i < pts.length; i+= 2) {
    var dx = +pts[i];
    var dy = +pts[i+1];
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

function Car() {
  this.width = 100;
  this.outline = svgPathToPoints("0,-30 70,-10 20,-50 110,0 30,50 0,40");

  var boxMaterials = loadMaterials();

  this.mesh = function() {
    var shape = pointsToShape(this.outline);
    var geometry = shape.makeGeometry();
    rescaleUvs(geometry);

    var group = new THREE.Group();

    var lmesh = new THREE.Mesh(geometry, boxMaterials[0]);
    group.add(lmesh);

    var rmesh = new THREE.Mesh(geometry, boxMaterials[1]);
    rmesh.position.z = -this.width;
    group.add(rmesh);
    var front = new THREE.Group();
    front.rotateY(PI/2);
    for (var i = 0; i < this.outline.length; i++) {
      var p1 = this.outline[i];
      var sideShape = rect(p1.dx, p1.dy, this.width);
      var shapeGeometry = sideShape.makeGeometry();
      rescaleUvs(shapeGeometry);
      var sideMesh = new THREE.Mesh(shapeGeometry, boxMaterials[2 + i]);
      sideMesh.position.set(0, p1.y, p1.x);

      var upright = p1.dx >= 0 && p1.dy < 0 ? -1 : 0;
      var horiz = p1.dy === 0 ? PI/2 : 0;
      var downright = p1.dx >= 0 && p1.dy > 0 ? 1 : 0;
      var atan =  Math.atan(p1.dx/p1.dy);
      sideMesh.rotateX(PI + upright * atan + horiz + downright * (PI - atan));
      front.add(sideMesh);
    }
    group.add(front);
    group.translateX(-this.outline[this.outline.length - 1].x/2);
    group.translateZ(this.width/2);

    var center = new THREE.Group();
    center.add(group);

    return center;
  };
}

let rescaleUvs = geometry => {
  if (!geometry.boundingBox) {
    geometry.computeBoundingBox();
  }
  let dx = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
  let dy = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
  geometry.faceVertexUvs.map(face => {
    face.map(triangle => {
      triangle.map(vertex => {
        vertex.x = vertex.x / dx;
        vertex.y = vertex.y / dy;
      });
    });
  });
};

let loadMaterials = () => {
  var txl = new THREE.TextureLoader();
  var tx1 = txl.load( "images/pizza-left.png" );
  var tx2 = txl.load( "images/pizza-right.png" );
  var tx3 = txl.load( "images/pizza-mid1.png" );
  var tx4 = txl.load( "images/pizza-mid3.png" );
  var tx5 = txl.load( "images/pizza-mid5.png" );
  var tx6 = txl.load( "images/pizza-mid6.png" );

  var materials = [
     new THREE.MeshBasicMaterial({map: tx1, side: THREE.DoubleSide }),
     new THREE.MeshBasicMaterial({map: tx2, side: THREE.DoubleSide}),
     new THREE.MeshBasicMaterial({map: tx3, side: THREE.DoubleSide }),
     new THREE.MeshBasicMaterial({color:0xe6e6e6, side: THREE.DoubleSide}),
     new THREE.MeshBasicMaterial({map: tx4, side: THREE.DoubleSide}),
     new THREE.MeshBasicMaterial({color:0xe6e6e6, side: THREE.DoubleSide}),
     new THREE.MeshBasicMaterial({map: tx5, side: THREE.DoubleSide}),
     new THREE.MeshBasicMaterial({map: tx6, side: THREE.DoubleSide})
  ];
  return materials;
};

export default Car;
