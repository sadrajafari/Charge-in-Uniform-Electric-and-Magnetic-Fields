import * as THREE from "three";

/**
 * Creates clipping planes for the simulation box
 */
export function createClippingPlanes(): THREE.Plane[] {
  return [
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), 6), // +X
    new THREE.Plane(new THREE.Vector3(1, 0, 0), 6),  // -X
    new THREE.Plane(new THREE.Vector3(0, -1, 0), 6), // +Y
    new THREE.Plane(new THREE.Vector3(0, 1, 0), 6),  // -Y
    new THREE.Plane(new THREE.Vector3(0, 0, -1), 6), // +Z
    new THREE.Plane(new THREE.Vector3(0, 0, 1), 6),  // -Z
  ];
}

/**
 * Creates a box with transparent faces to contain the simulation
 */
export function createAxisBox(size: number, clippingPlanes: THREE.Plane[]): THREE.Group {
  // Create a group to hold everything
  const boxGroup = new THREE.Group();

  // Create the inner wireframe box
  const innerBoxGeometry = new THREE.BoxGeometry(size, size, size);
  const innerEdges = new THREE.EdgesGeometry(innerBoxGeometry);
  const innerBoxMaterial = new THREE.LineBasicMaterial({
    color: 0x888888,
    opacity: 0.5,
    transparent: true,
  });

  // Create the inner box
  const innerBox = new THREE.LineSegments(innerEdges, innerBoxMaterial);
  boxGroup.add(innerBox);

  // Create faces for the outer box
  const faces = [
    // Front face
    new THREE.PlaneGeometry(size, size),
    // Back face
    new THREE.PlaneGeometry(size, size),
    // Top face
    new THREE.PlaneGeometry(size, size),
    // Bottom face
    new THREE.PlaneGeometry(size, size),
    // Right face
    new THREE.PlaneGeometry(size, size),
    // Left face
    new THREE.PlaneGeometry(size, size),
  ];

  const faceMaterial = new THREE.MeshBasicMaterial({
    opacity: 0.1,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    clippingPlanes: clippingPlanes,
  });

  // Position and add each face
  const halfSize = size / 2;

  // Front face
  const frontFace = new THREE.Mesh(faces[0], faceMaterial);
  frontFace.position.set(0, 0, halfSize);
  boxGroup.add(frontFace);

  // Back face
  const backFace = new THREE.Mesh(faces[1], faceMaterial);
  backFace.position.set(0, 0, -halfSize);
  boxGroup.add(backFace);

  // Top face
  const topFace = new THREE.Mesh(faces[2], faceMaterial);
  topFace.rotation.x = Math.PI / 2;
  topFace.position.set(0, halfSize, 0);
  boxGroup.add(topFace);

  // Bottom face
  const bottomFace = new THREE.Mesh(faces[3], faceMaterial);
  bottomFace.rotation.x = Math.PI / 2;
  bottomFace.position.set(0, -halfSize, 0);
  boxGroup.add(bottomFace);

  // Right face
  const rightFace = new THREE.Mesh(faces[4], faceMaterial);
  rightFace.rotation.y = Math.PI / 2;
  rightFace.position.set(halfSize, 0, 0);
  boxGroup.add(rightFace);

  // Left face
  const leftFace = new THREE.Mesh(faces[5], faceMaterial);
  leftFace.rotation.y = Math.PI / 2;
  leftFace.position.set(-halfSize, 0, 0);
  boxGroup.add(leftFace);

  return boxGroup;
}