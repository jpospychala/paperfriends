const PI = Math.PI;

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

function Car() {
  this.width = 1;
  this.outline = svgPathToPoints("0,-30 70,-10 20,-50 110,0 30,50 0,40");

  var boxMaterials = [
     new THREE.MeshBasicMaterial({color:0xFF0000}),
     new THREE.MeshBasicMaterial({color:0x00FF00}),
     new THREE.MeshBasicMaterial({color:0x0000FF}),
     new THREE.MeshBasicMaterial({color:0xFFFF00}),
     new THREE.MeshBasicMaterial({color:0x00FFFF}),
     new THREE.MeshBasicMaterial({color:0xFF00FF})
  ];
  boxMaterials.forEach(function(m) {m.side = THREE.DoubleSide; });

  this.mesh = function() {
    var shape = pointsToShape(this.outline);
    var geometry = shape.makeGeometry();

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
    group.translateX(-this.outline[this.outline.length - 1].x/2)
    group.translateZ(this.width/2);

    var center = new THREE.Group();
    center.add(group);

    return center;
  };
}

export default Car;
