const PI = Math.PI;

function ModelBuilder() {
  var materials = new Materials();

  this.buildMesh = function(model) {
    var group = new THREE.Group();
    model.parts.forEach(part => {
      var partMesh = shapes[part.type](part, materials);
      group.add(partMesh);
    });

    var center = new THREE.Group();
    centerGroup(group);
    center.add(group);
    return center;
  };
}


const shapes = {
  wheel: function(model, materials) {
    var geometry = new THREE.CircleGeometry(model.r, 32);
    var material = materials.get(model.face);
    var circle = new THREE.Mesh(geometry, material);
    circle.translateX(model.x);
    circle.translateY(model.y);
    circle.translateZ(model.z);
    return circle;
  },
  extruded: function(model, materials) {
    var outline = svgPathToPoints(model.outlinePoints);
    outline = connectLastToFirst(outline);
    var shape = pointsToShape(outline);
    var geometry = shape.makeGeometry();
    rescaleUvs(geometry);

    materials.setDefaultColor(model.color);

    var group = new THREE.Group();
    var lmesh = new THREE.Mesh(geometry, materials.get(model.faces[0]));
    group.add(lmesh);

    var rmesh = new THREE.Mesh(geometry, materials.get(model.faces[1]));
    rmesh.position.z = -model.width;
    group.add(rmesh);

    var front = new THREE.Group();
    front.rotateY(PI/2);
    for (var i = 0; i < outline.length; i++) {
      var p1 = outline[i];
      var sideShape = rect(p1.dx, p1.dy, model.width);
      var shapeGeometry = sideShape.makeGeometry();
      rescaleUvs(shapeGeometry);
      var sideMesh = new THREE.Mesh(shapeGeometry, materials.get(model.faces[i + 2]));
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
};

function centerGroup(group) {
  group.updateMatrixWorld();
  var boundingBox = maxBoundingBox(group, new THREE.Box3());
  var xOfs = Math.abs(boundingBox.max.x-boundingBox.min.x)/2;
  var zOfs = Math.abs(boundingBox.max.z-boundingBox.min.z)/2;
  group.translateX(-xOfs);
  group.translateZ(zOfs);
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

let connectLastToFirst = function(points) {
  var last = points[points.length - 1];
  points.push({x: 0, y: 0, dx: -last.x, dy: -last.y});
  return points;
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


export default ModelBuilder;
