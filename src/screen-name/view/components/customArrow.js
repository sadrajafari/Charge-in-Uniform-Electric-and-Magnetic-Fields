export default function createCustomArrow(length, shaftRadius, headRadius, headLength, color) {
  // Create a group to hold the arrow
  const arrowGroup = new THREE.Group();

  // 1. Create the LINE (shaft) using a cylinder
  const shaftLength = length * 0.8; // 80% of total length is the shaft
  const shaftGeometry = new THREE.CylinderGeometry(
    shaftRadius,
    shaftRadius,
    shaftLength,
    8,
  );
  const shaftMaterial = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
  const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);

  // Position shaft
  shaft.position.set(0, shaftLength / 2, 0);

  // 2. Create the ARROWHEAD (cone)
  const headGeometry = new THREE.ConeGeometry(headRadius, headLength, 8);
  const headMaterial = new THREE.MeshBasicMaterial({ color: color });
  const head = new THREE.Mesh(headGeometry, headMaterial);

  // Position arrowhead at the end of shaft
  head.position.set(0, shaftLength + headLength / 2, 0);

  // Add both to the arrow group
  arrowGroup.add(shaft);
  arrowGroup.add(head);

  return arrowGroup;
}