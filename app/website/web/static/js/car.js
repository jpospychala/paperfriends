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

function Car(model) {
  this.model = model;

  var materials = new Materials();

  this.mesh = function() {
    var group = new THREE.Group();
    this.model.parts.forEach(part => {
      var partMesh = shapes[part.type](part, materials);
      group.add(partMesh);
    });

    var center = new THREE.Group();
    group.updateMatrixWorld();
    var boundingBox = maxBoundingBox(group, new THREE.Box3());
    console.log(boundingBox);
    var xOfs = Math.abs(boundingBox.max.x-boundingBox.min.x)/2;
    var zOfs = Math.abs(boundingBox.max.z-boundingBox.min.z)/2;
    console.log(xOfs, zOfs);
    group.translateX(-xOfs);
    group.translateZ(zOfs);
    center.add(group);

    return center;
  };
}

function maxBoundingBox (obj, box) {
  if (obj.geometry) {
    if (!obj.geometry.boundingBox) {
      obj.geometry.computeBoundingBox();
    }
    var trsf = obj.geometry.boundingBox.clone();
    obj.localToWorld(trsf);
    box.union(trsf);
  }

  if (obj.children) {
    obj.children.forEach(child => maxBoundingBox(child, box));
  }
  return box;
}

const shapes = {
  wheel: function(wheel, materials) {
    var geometry = new THREE.CircleGeometry(wheel.r, 32);
    var material = materials.get(wheel.face);
    var circle = new THREE.Mesh(geometry, material);
    circle.translateX(wheel.x);
    circle.translateY(wheel.y);
    circle.translateZ(wheel.z);
    return circle;
  },
  car: function(car, materials) {
    var outline = svgPathToPoints(car.outlinePoints);
    var shape = pointsToShape(outline);
    var geometry = shape.makeGeometry();
    rescaleUvs(geometry);

    materials.setDefaultColor(car.color);

    var group = new THREE.Group();
    var lmesh = new THREE.Mesh(geometry, materials.get(car.faces[0]));
    group.add(lmesh);

    var rmesh = new THREE.Mesh(geometry, materials.get(car.faces[1]));
    rmesh.position.z = -car.width;
    group.add(rmesh);

    var front = new THREE.Group();
    front.rotateY(PI/2);
    for (var i = 0; i < outline.length; i++) {
      var p1 = outline[i];
      var sideShape = rect(p1.dx, p1.dy, car.width);
      var shapeGeometry = sideShape.makeGeometry();
      rescaleUvs(shapeGeometry);
      var sideMesh = new THREE.Mesh(shapeGeometry, materials.get(car.faces[i + 2]));
      sideMesh.position.set(0, p1.y, p1.x);

      var upright = p1.dx >= 0 && p1.dy < 0 ? -1 : 0;
      var horizright = p1.dy === 0 && p1.dx > 0 ? PI/2 : 0;
      var horizleft = p1.dy === 0 && p1.dx <= 0 ? -PI/2 : 0;
      var downright = p1.dx >= 0 && p1.dy > 0 ? 1 : 0;
      var atan =  Math.atan(p1.dx/p1.dy);
      sideMesh.rotateX(PI + upright * atan + horizright + horizleft + downright * (PI - atan));
      front.add(sideMesh);
    }
    group.add(front);
    return group;
  }
}

let rescaleUvs = geometry => {
  if (!geometry.boundingBox) {
    geometry.computeBoundingBox();
  }
  let dx = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
  let dy = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
  geometry.faceVertexUvs.forEach(face => {
    face.forEach(triangle => {
      triangle.forEach(vertex => {
        vertex.x = vertex.x / dx;
        vertex.y = vertex.y / dy;
      });
    });
  });
};

function Materials() {
  var txl = new THREE.TextureLoader();
  txl.setPath("images/");
  this.defaultColor = undefined;
  this.cache = {};

  this.get = (path) => {
    if (! this.cache[path]) {
      this.cache[path] = load(path);
    }
    return this.cache[path];
  };

  this.setDefaultColor = newColor => {
    this.defaultColor = newColor;
  };

  var load = (path) => {
    var opts = {color: this.defaultColor, side: THREE.DoubleSide };
    if (path) {
      opts.map = txl.load(path);
    }
    return new THREE.MeshBasicMaterial(opts);
  };
}

export default Car;
