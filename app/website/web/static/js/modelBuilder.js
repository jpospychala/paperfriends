const PI = Math.PI;

function ModelBuilder() {
  var materials = new Materials();
  var that = this;

  this.buildMesh = function(model) {
    var group = new THREE.Group();
    model.parts.forEach(part => {
      var shape = shapes[part.type];
      var partMesh = shape.mesh(part, materials, that);
      shape.position(partMesh, part);
      group.add(partMesh);
    });
    return group;
  };

  this.center = function(group) {
    var center = new THREE.Group();
    centerGroup(group);
    center.add(group);
    return center;
  },

  this.traverse = function(mesh, model) {
    if (model && model.parts) {
      var group = this.buildMesh(model);
      group.add(mesh);
      return group;
    }

    return mesh;
  }
}


const shapes = {
  wheel: {
    mesh: (model, materials) => {
      var geometry = new THREE.CircleGeometry(model.r, 32);
      var material = materials.get(model.texture);
      return new THREE.Mesh(geometry, material);
    },
    position: (mesh, model) => {
      mesh.translateX(model.x);
      mesh.translateY(model.y);
      mesh.translateZ(model.z);
    }
  },
  extruded: {
    mesh: (model, materials, modelBuilder) => {
      var outline = svgPathToPoints(model.outlinePoints);
      outline = connectLastToFirst(outline);
      var shape = pointsToShape(outline);
      var geometry = shape.makeGeometry();
      rescaleUvs(geometry);

      materials.setDefaultColor(model.color);

      var group = new THREE.Group();
      group.userData.outline = outline;
      var leftSideModel = model.sides[0];
      var lmesh = new THREE.Mesh(geometry, materials.get(path("texture", leftSideModel)));
      lmesh = modelBuilder.traverse(lmesh, leftSideModel);
      group.add(lmesh);

      var rightSideModel = model.sides[1];
      var rmesh = new THREE.Mesh(geometry, materials.get(path("texture", rightSideModel)));
      rmesh = modelBuilder.traverse(rmesh, rightSideModel);
      group.add(rmesh);

      var front = new THREE.Group();
      for (var i = 0; i < outline.length; i++) {
        var p1 = outline[i];
        var sideShape = rect(p1.dx, p1.dy, model.width);
        var shapeGeometry = sideShape.makeGeometry();
        rescaleUvs(shapeGeometry);
        var sideModel = model.sides[i + 2];
        var sideMesh = new THREE.Mesh(shapeGeometry, materials.get(path("texture", sideModel)));
        sideMesh = modelBuilder.traverse(sideMesh, sideModel);
        front.add(sideMesh);
      }
      group.add(front);
      return group;
    },
    position2: (mesh, model) => {
      var rmesh = mesh.children[1];
      rmesh.position.z = -model.width;

      var front = mesh.children[2];
      front.rotateY(PI/2);

      for (var i = 0; i < front.children.length; i++) {
        var sideMesh = front.children[i];
        var p1 = mesh.userData.outline[i];
        sideMesh.position.set(0, p1.y, p1.x);
        var upright = p1.dx >= 0 && p1.dy < 0 ? -1 : 0;
        var horizright = p1.dy === 0 && p1.dx > 0 ? PI/2 : 0;
        var horizleft = p1.dy === 0 && p1.dx <= 0 ? -PI/2 : 0;
        var downright = p1.dx >= 0 && p1.dy > 0 ? 1 : 0;
        var atan =  Math.atan(p1.dx/p1.dy);
        sideMesh.rotateX(PI + upright * atan + horizright + horizleft + downright * (PI - atan));
      }
    },

    position: (mesh, model) => {
      var lmesh = mesh.children[0];
      var bbox = boundingBox(lmesh);

      var rmesh = mesh.children[1];
      var front = mesh.children[2];
      var y = 0;
      var x = 0;
      var stickySide = Math.floor(front.children.length / 2);
      for (var i = 0; i < front.children.length; i++) {
        var sideMesh = front.children[i];
        var sideBbox = boundingBox(sideMesh);
        var h = sideBbox.max.y;

        sideMesh.position.set(0, y, 0);

        if (i == stickySide) {
          var modelheight = bbox.max.y;
          var p1 = mesh.userData.outline[i-1];
          var l = p1.x;

          rmesh.position.set(-modelheight, y - l, 0);
          rmesh.rotateZ(PI/2);
          rmesh.rotateX(PI);
          lmesh.position.set(model.width + modelheight, y - l, 0);
          lmesh.rotateZ(PI/2);
        }

        y += h;
      }
    }
  }
};

function centerGroup(group) {
  group.updateMatrixWorld();
  var bbox = boundingBox(group);
  var xOfs = Math.abs(bbox.max.x-bbox.min.x)/2;
  var zOfs = Math.abs(bbox.max.z-bbox.min.z)/2;
  group.translateX(-xOfs);
  group.translateZ(zOfs);
}

function boundingBox (obj, box) {
  if (!box) {
    box = new THREE.Box3();
  }

  if (obj.geometry) {
    if (!obj.geometry.boundingBox) {
      obj.geometry.computeBoundingBox();
    }
    var trsf = obj.geometry.boundingBox.clone();
    obj.localToWorld(trsf);
    box.union(trsf);
  }

  if (obj.children) {
    obj.children.forEach(child => boundingBox(child, box));
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

let path = (path, obj) => {
  return obj && obj[path];
}

export default ModelBuilder;
