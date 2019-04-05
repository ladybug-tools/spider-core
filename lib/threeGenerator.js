const THREE = require('three');

/**
 * threeGenerator
 * @module threeGenerator
 */

/**
 * colorsDefault for use with gbXML data
 * @constant
 * @type {object}
 * @default
 */
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

/**
 * Returns three.js vertices from a jsonified gbXML polyloop object
 * @alias module:threeGenerator.getVertices
 * @param {Object} polyloop gbXML polyloop object
 * @returns {Array} An array of points
 */
const getVertices = (polyloop) => {
  const points = polyloop.CartesianPoint.map(CartesianPoint => new THREE.Vector3().fromArray(CartesianPoint.Coordinate));
  return points;
};

/**
 * Returns a three.js plane from an array of points. If points are in straight line there is no plane, therefore travel one index down the array and try again
 * @alias module:threeGenerator.getPlane
 * @param {Array} points An array of points 
 * @param {Number} start An integer value
 * @returns {Object} A ThreeJS plane object
 */
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

/**
 * Returns a three.js shape mesh (2D) from vertices, materials and holes. All vertices must be co-planar on the X-Y plane
 * @alias module:threeGenerator.get2DShape
 * @param {Array} vertices An array of vertices
 * @param {Object} material A ThreeJS Material object
 * @param {Array} holes An array of hole objects
 * @returns {Object} A ThreeJS Mesh object
 */
const get2DShape = (vertices, material, holes = []) => {
  const shape = new THREE.Shape(vertices);
  shape.holes = holes;
  const geometryShape = new THREE.ShapeGeometry(shape);
  const shapeMesh = new THREE.Mesh(geometryShape, material);
  return shapeMesh;
};

/**
 * Returns a 3D shape mesh from vertices, materials and holes. Takes the vertices, rotates them to the X-Y plane, creates a shape, rotates new shapa back to plane of original vertices.
 * @alias module:threeGenerator.get3dShape
 * @param {Array} vertices An array of vertices
 * @param {Object} material A ThreeJS Material object
 * @param {Array} holes An array of hole objects
 * @returns {Object} A ThreeJS Mesh object
 */
const get3dShape = (vertices, material, holes = []) => {
  const plane = getPlane(vertices);

  const referenceObject = new THREE.Object3D();
  // copy the rotation of the plane
  referenceObject.lookAt(plane.normal);
  // figure out the angle it takes to rotate the vertices so they lie on the XY plane
  referenceObject.quaternion.conjugate();
  referenceObject.updateMatrixWorld();

  // What does this line do? If it is modifying inline then forEach() is preferable to map() << Theo: will check. looks like error
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

/**
 * Returns three.js Meshes from an array of jsonified gbXML surfaces
 * @alias module:threeGenerator.getSurfaceMeshes
 * @param {Array} surfaces An array of surface object
 * @returns {Array} An array of ThreeJS Meshes
 */
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

/**
 * Returns the edges of an array of three.js Meshes
 * @alias module:threeGenerator.getSurfaceEdges
 * @param {Array} surfaceMeshes An array of ThreeJS Meshes
 * @returns {Array} An array of edge objects
 */
const getSurfaceEdges = (surfaceMeshes) => {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
  console.log(surfaceMeshes);
  const surfaceEdges = surfaceMeshes.children.map((mesh) => {
    // The line below doesn't look right. What is it doing? << Theo: ostensibly giving the edges a link to their parent. Will need checking
    mesh.userData.edges = mesh;
    const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry);
    const surfaceEdge = new THREE.LineSegments(edgesGeometry, lineMaterial);
    surfaceEdge.rotation.copy(mesh.rotation);
    surfaceEdge.position.copy(mesh.position);
    return surfaceEdge;
  });

  return surfaceEdges;
};

/**
 * Returns the openings as three.js meshes from a jsonified gbXML surface
 * @alias module:threeGenerator.getOpenings
 * @param {Object} surfacesJson A surface object
 * @returns {Array} An array of surface opening objects
 */
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
