// export default function showMagneticFieldVector(material, Bx = material.Bx, By = material.By, Bz = material.Bz) {
//     // Remove previous arrow if it exists
//     if (material.bFieldArrow) {
//       material.group.remove(material.bFieldArrow);
//       material.bFieldArrow = null;
//     }
//     // Only create arrow if at least one component is nonzero
//     if (Bx === 0 && By === 0 && Bz === 0) return;

//     // Calculate the center of the axes in visual coordinates
//     const centerX = material.axisLength / 2;
//     const centerY = material.axisLength / 2;
//     const centerZ = material.axisLength / 2;

//     // Create direction vector (normalize for ArrowHelper)
//     const dir = new THREE.Vector3(Bx, By, Bz).normalize();

//     // Set arrow length proportional to field magnitude
//     // const length = Math.max(1, Math.sqrt(Bx * Bx + By * By + Bz * Bz) * 0.1);
//     const length = 1;

//     // Create the arrow
//     material.bFieldArrow = new THREE.ArrowHelper(
//       dir,
//       new THREE.Vector3(centerX, centerY, centerZ),
//       length,
//       "purple",
//       0.3,
//       0.2,
//     );
//     material.bFieldArrow.visible = material.showMagneticField;
//     material.group.add(material.bFieldArrow);
//   }

export default function showMagneticFieldVector(
  material,
  Bx = material.Bx,
  By = material.By,
  Bz = material.Bz,
  x = null,
  y = null,
  z = null,
) {
  // Remove previous arrows if they exist
  if (material.bFieldArrows && material.bFieldArrows.length > 0) {
    material.bFieldArrows.forEach((arrow) => material.group.remove(arrow));
    material.bFieldArrows = [];
  }

  // Only create arrows if at least one component is nonzero
  if (Bx === 0 && By === 0 && Bz === 0) return;

  // Initialize array to hold all arrows
  material.bFieldArrows = [];

  // Get particle position in visual coordinates
  let centerX, centerY, centerZ;

  if (x !== null && y !== null && z !== null) {
    const xScale =
      material.axisLength / (material.xRange.max - material.xRange.min);
    const yScale =
      material.axisLength / (material.yRange.max - material.yRange.min);
    const zScale =
      material.axisLength / (material.zRange.max - material.zRange.min);
    centerX = (x - material.xRange.min) * xScale;
    centerY = (y - material.yRange.min) * yScale;
    centerZ = (z - material.zRange.min) * zScale;
  } else {
    centerX = material.axisLength / 2;
    centerY = material.axisLength / 2;
    centerZ = material.axisLength / 2;
  }

  // Create direction vector (normalized)
  const dir = new THREE.Vector3(Bx, By, Bz).normalize();

  // Arrow properties
  const length = 0.5;
  const spacing = 0.8; // Distance between arrows

  // Define 8 positions: 4 on top plane (k=1), 4 on bottom plane (k=-1)
  const positions = [
    // Top 4 corners (k = 1)
    { i: -1, j: 1, k: 1 }, // top-left-front
    { i: 1, j: 1, k: 1 }, // top-right-front
    { i: -1, j: -1, k: 1 }, // top-left-back
    { i: 1, j: -1, k: 1 }, // top-right-back

    // Bottom 4 corners (k = -1)
    { i: -1, j: 1, k: -1 }, // bottom-left-front
    { i: 1, j: 1, k: -1 }, // bottom-right-front
    { i: -1, j: -1, k: -1 }, // bottom-left-back
    { i: 1, j: -1, k: -1 }, // bottom-right-back
  ];

  // Create arrow at each position
  positions.forEach(({ i, j, k }) => {
    const arrowX = centerX + i * spacing;
    const arrowY = centerY + j * spacing;
    const arrowZ = centerZ + k * spacing;

    const arrow = new THREE.ArrowHelper(
      dir,
      new THREE.Vector3(arrowX, arrowY, arrowZ),
      length,
      "#0072B2", // purple for magnetic field
      0.15, // small headLength
      0.1, // small headWidth
    );

    // arrow.visible = material.showMagneticField;
    material.group.add(arrow);
    material.bFieldArrows.push(arrow);
  });
}
