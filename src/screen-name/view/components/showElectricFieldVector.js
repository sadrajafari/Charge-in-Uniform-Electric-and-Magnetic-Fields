// export default function showElectricFieldVector(material, Ex = material.Ex, Ey = material.Ey, Ez = material.Ez) {
//     // Remove previous arrow if it exists
//     if (material.eFieldArrow) {
//       material.group.remove(material.eFieldArrow);
//       material.eFieldArrow = null;
//     }
//     // Only create arrow if at least one component is nonzero
//     if (Ex === 0 && Ey === 0 && Ez === 0) return;

//     // Calculate the center of the axes in visual coordinates
//     const centerX = material.axisLength / 2;
//     const centerY = material.axisLength / 2;
//     const centerZ = material.axisLength / 2;

//     // Create direction vector (normalize for ArrowHelper)
//     const dir = new THREE.Vector3(Ex, Ey, Ez).normalize();

//     // Set arrow length proportional to field magnitude
//     const length = 1;

//     // Create the arrow
//     material.eFieldArrow = new THREE.ArrowHelper(
//       dir,
//       new THREE.Vector3(centerX, centerY, centerZ),
//       length,
//       0x0000ff, // color (blue)
//       0.3, // headLength
//       0.2, // headWidth
//     );
//     material.eFieldArrow.visible = material.showElectricField;
//     material.group.add(material.eFieldArrow);
//   }


export default function showElectricFieldVector(material, Ex = material.Ex, Ey = material.Ey, Ez = material.Ez, x = null, y = null, z = null) {
    // Remove previous arrows if they exist
    if (material.eFieldArrows && material.eFieldArrows.length > 0) {
      material.eFieldArrows.forEach(arrow => material.group.remove(arrow));
      material.eFieldArrows = [];
    }
    
    // Only create arrows if at least one component is nonzero
    if (Ex === 0 && Ey === 0 && Ez === 0) return;

    // Initialize array to hold all arrows
    material.eFieldArrows = [];

    // Get particle position in visual coordinates
    let centerX, centerY, centerZ;
    
    if (x !== null && y !== null && z !== null) {
      const xScale = material.axisLength / (material.xRange.max - material.xRange.min);
      const yScale = material.axisLength / (material.yRange.max - material.yRange.min);
      const zScale = material.axisLength / (material.zRange.max - material.zRange.min);
      centerX = (x - material.xRange.min) * xScale;
      centerY = (y - material.yRange.min) * yScale;
      centerZ = (z - material.zRange.min) * zScale;
    } else {
      centerX = material.axisLength / 2;
      centerY = material.axisLength / 2;
      centerZ = material.axisLength / 2;
    }

    // Create direction vector (normalized)
    const dir = new THREE.Vector3(Ex, Ey, Ez).normalize();

    // Arrow properties
    const length = 0.5;
    const spacing = 0.8; // Distance between arrows

    // Define 8 positions: 4 on top plane (k=1), 4 on bottom plane (k=-1)
    const positions = [
      // Top 4 corners (k = 1)
      { i: -1, j: 1, k: 1 },   // top-left-front
      { i: 1, j: 1, k: 1 },    // top-right-front
      { i: -1, j: -1, k: 1 },  // top-left-back
      { i: 1, j: -1, k: 1 },   // top-right-back
      
      // Bottom 4 corners (k = -1)
      { i: -1, j: 1, k: -1 },  // bottom-left-front
      { i: 1, j: 1, k: -1 },   // bottom-right-front
      { i: -1, j: -1, k: -1 }, // bottom-left-back
      { i: 1, j: -1, k: -1 },  // bottom-right-back
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
        0x0000ff, // blue
        0.15,     // small headLength
        0.1,      // small headWidth
      );
      
      // arrow.visible = material.showElectricField;
      material.group.add(arrow);
      material.eFieldArrows.push(arrow);
    });
}