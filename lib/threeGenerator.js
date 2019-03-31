const THREE = require('three');

const colorsDefault = {

  InteriorWall: 0x008000,
  ExteriorWall: 0xFFB400,
  Roof: 0x800000,
  InteriorFloor: 0x80FFFF,
  ExposedFloor: 0x40B4FF,
  Shade: 0xFFCE9D,
  UndergroundWall: 0xA55200,
  UndergroundSlab: 0x804000,
  Ceiling: 0xFF8080,
  Air: 0xFFFF00,
  UndergroundCeiling: 0x408080,
  RaisedFloor: 0x4B417D,
  SlabOnGrade: 0x804000,
  FreestandingColumn: 0x808080,
  EmbeddedColumn: 0x80806E,
  Undefined: 0x88888888,

};

const getVertices = (polyloop) => {
  const points = polyloop.CartesianPoint.map(CartesianPoint => new THREE.Vector3().fromArray(CartesianPoint.Coordinate));
  return points;
};

const getPlane = (points, start = 0) => {
  const triangle = new THREE.Triangle();
  triangle.set(points[start], points[start + 1], points[start + 2]);
  let plane = triangle.getPlane(new THREE.Plane());

  if (triangle.getArea() === 0) { // looks like points are colinear therefore try next set
    const next = start + 1;
    plane = getPlane(points, next);
  }
  return plane;
};

const get2DShape = (vertices, material, holes = []) => {
  const shape = new THREE.Shape(vertices);
  shape.holes = holes;
  const geometryShape = new THREE.ShapeGeometry(shape);
  const shapeMesh = new THREE.Mesh(geometryShape, material);
  return shapeMesh;
};

const get3dShape = (vertices, material, holes = []) => {
  const plane = getPlane(vertices);

  const referenceObject = new THREE.Object3D();
  // copy the rotation of the plane
  referenceObject.lookAt(plane.normal);
  // figure out the angle it takes to rotate the vertices so they lie on the XY plane
  referenceObject.quaternion.conjugate();
  referenceObject.updateMatrixWorld();

  // What does this line do? If it is modifying inline then forEach() is preferable to map()
  vertices.map(vertex => referenceObject.localToWorld(vertex));

  const holeVertices = holes.map((verticesHoles) => {
    // TODO: Clarify what the line below does...
    verticesHoles.map(vertex => referenceObject.localToWorld(vertex));
    const hole = new THREE.Path();
    hole.setFromPoints(verticesHoles);
    return hole;
  });

  const shapeMesh = get2DShape(vertices, material, holeVertices);
  shapeMesh.lookAt(plane.normal);
  const center = plane.coplanarPoint(new THREE.Vector3());
  shapeMesh.position.copy(center);

  return shapeMesh;
};

const getSurfaceMeshes = (surfaces) => {
  const surfaceMeshes = [];

  surfaces.forEach((surface) => {
    const holes = [];
    let openings = surface.Opening;
    if (openings) {
      openings = Array.isArray(openings) ? openings : [openings];
      openings.forEach((opening) => {
        const polyloop = opening.PlanarGeometry.PolyLoop;
        const vertices = getVertices(polyloop);
        holes.push(vertices);
      });
    }

    const polyloop = surface.PlanarGeometry.PolyLoop;
    const vertices = getVertices(polyloop);
    // eslint-disable-next-line max-len
    const color = colorsDefault[surface.surfaceType] ? colorsDefault[surface.surfaceType] : colorsDefault.Undefined;
    const material = new THREE.MeshPhongMaterial({
      color, side: 2, opacity: 0.85, transparent: true,
    });

    const shape = get3dShape(vertices, material, holes);
    shape.userData.data = surface;
    shape.castShadow = true;
    shape.receiveShadow = true;
    surfaceMeshes.push(shape);
  });


  return surfaceMeshes;
};

const getSurfaceEdges = (surfaceMeshes) => {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
  console.log(surfaceMeshes);
  const surfaceEdges = surfaceMeshes.children.map((mesh) => {
    // The line below doesn't look right. What is it doing?
    mesh.userData.edges = mesh;
    const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry);
    const surfaceEdge = new THREE.LineSegments(edgesGeometry, lineMaterial);
    surfaceEdge.rotation.copy(mesh.rotation);
    surfaceEdge.position.copy(mesh.position);
    return surfaceEdge;
  });

  return surfaceEdges;
};

const getOpenings = (surfacesJson) => {
  const surfaceOpenings = [];
  const material = new THREE.MeshBasicMaterial({
    color: 0x000000, opacity: 0.5, side: 2, transparent: true,
  });

  surfacesJson.forEach((surfJson) => {
    let openings = surfJson.Opening ? surfJson.Opening : [];
    openings = Array.isArray(openings) ? openings : [openings];

    openings.forEach((opening) => {
      const points = getVertices(opening.PlanarGeometry.PolyLoop);
      const shapeMesh = get3dShape(points, material);
      shapeMesh.userData.data = opening;
      surfaceOpenings.push(shapeMesh);
    });
  });

  return surfaceOpenings;
};

module.exports = {
  getVertices,
  getPlane,
  get2DShape,
  get3dShape,
  getSurfaceMeshes,
  getSurfaceEdges,
  getOpenings,
};
