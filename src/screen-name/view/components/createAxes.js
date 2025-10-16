export default function createAxes(material) {
  // All axes start from the same point (0,0,0) and extend outward
  const origin = new THREE.Vector3(0, 0, 0);

  // // X-axis - from origin extending in positive X direction
  // const xGeometry = new THREE.BufferGeometry().setFromPoints([
  //   origin,
  //   new THREE.Vector3(material.axisLength, 0, 0),
  // ]);
  // const xMaterial = new THREE.LineBasicMaterial({
  //   color: "black",
  //   linewidth: 5,
  // });
  // const xAxis = new THREE.Line(xGeometry, xMaterial);
  // // material.scene.add(xAxis);
  // material.group.add(xAxis);
  const xGeometry = new THREE.CylinderGeometry(
    0.04,
    0.04,
    material.axisLength,
    8,
  );
  const xMaterial = new THREE.MeshBasicMaterial({ color: "black" });
  const xAxis = new THREE.Mesh(xGeometry, xMaterial);

  // Position and rotate cylinder to align with X axis
  xAxis.position.set(material.axisLength / 2, 0, 0);
  xAxis.rotation.z = -Math.PI / 2; // Rotate to point along X
  material.group.add(xAxis);

  // // Y-axis - from origin extending in positive Y direction
  // const yGeometry = new THREE.BufferGeometry().setFromPoints([
  //   origin,
  //   new THREE.Vector3(0, material.axisLength, 0),
  // ]);
  // const yMaterial = new THREE.LineBasicMaterial({
  //   color: "black",
  //   linewidth: 5,
  // });
  // const yAxis = new THREE.Line(yGeometry, yMaterial);
  // // material.scene.add(yAxis);
  // material.group.add(yAxis);

   // Y-axis - using cylinder
  const yGeometry = new THREE.CylinderGeometry(
    0.04,
    0.04,
    material.axisLength,
    8
  );
  const yMaterial = new THREE.MeshBasicMaterial({ color: "black" });
  const yAxis = new THREE.Mesh(yGeometry, yMaterial);
  
  // Y axis is already vertical, just position it
  yAxis.position.set(0, material.axisLength / 2, 0);
  material.group.add(yAxis);

  // // Z-axis - from origin extending in positive Z direction
  // const zGeometry = new THREE.BufferGeometry().setFromPoints([
  //   origin,
  //   new THREE.Vector3(0, 0, material.axisLength),
  // ]);
  // const zMaterial = new THREE.LineBasicMaterial({
  //   color: "black",
  //   linewidth: 7,
  // });
  // const zAxis = new THREE.Line(zGeometry, zMaterial);
  // // material.scene.add(zAxis);
  // material.group.add(zAxis);
  // Z-axis - using cylinder (slightly thicker)
  const zAxisRadius = 0.025; // Slightly thicker for Z
  const zGeometry = new THREE.CylinderGeometry(
    0.04,
    0.04,
    material.axisLength,
    8
  );
  const zMaterial = new THREE.MeshBasicMaterial({ color: "black" });
  const zAxis = new THREE.Mesh(zGeometry, zMaterial);
  
  // Position and rotate cylinder to align with Z axis
  zAxis.position.set(0, 0, material.axisLength / 2);
  zAxis.rotation.x = Math.PI / 2; // Rotate to point along Z
  material.group.add(zAxis);

  // Add arrow heads for axes
  // material.createArrowHeads();
  // material.createArrowHeads(this);

  material.createAxisEndLabels(this);
  // Add tick marks and numbers
  // material.createAxisTicksAndNumbers();
  // material.createAxisTicksAndNumbers(this);
}
