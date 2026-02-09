// export default function velocityVectorArrow(material, x, y, z, vx, vy, vz) {
//   // Remove previous velocity arrow if it exists

//   if (material.velocityArrow) {
//     material.group.remove(material.velocityArrow);
//     material.velocityArrow = null;
//   }
//   // Only show if velocity is nonzero
//   if (vx !== 0 || vy !== 0 || vz !== 0) {
//     const xScale =
//       material.axisLength / (material.xRange.max - material.xRange.min);
//     const yScale =
//       material.axisLength / (material.yRange.max - material.yRange.min);
//     const zScale =
//       material.axisLength / (material.zRange.max - material.zRange.min);
//     const visualX = (x - material.xRange.min) * xScale;
//     const visualY = (y - material.yRange.min) * yScale;
//     const visualZ = (z - material.zRange.min) * zScale;
//     const vDir = new THREE.Vector3(
//       vx * xScale,
//       vy * yScale,
//       vz * zScale,
//     ).normalize();
//     // console.log(vDir);
//     const vMag = Math.sqrt(vx * vx + vy * vy + vz * vz);

//     console.log(vx, vy, vz);
//     // Scale length for visibility
//     const minMag = 0;
//     const maxMag = 15; // or set to your expected max velocity magnitude
//     const length = Math.max(
//       0,
//       Math.min(1, (2 * (vMag - minMag)) / (maxMag - minMag)),
//     );
//     material.velocityArrow = new THREE.ArrowHelper(
//       vDir,
//       // new THREE.Vector3(visualX, visualY, visualZ),
//       new THREE.Vector3(visualX, visualY, visualZ),
//       length,
//       "black", // green
//       0.3,
//       0.2,
//     );
//     material.velocityArrow.visible = material.visibleVelocityVector !== false;
//     material.group.add(material.velocityArrow);

//   }
// }

// Helper function to create custom arrow
// function createCustomArrow(length, shaftRadius, headRadius, headLength, color) {
//   // Create a group to hold the arrow
//   const arrowGroup = new THREE.Group();

//   // 1. Create the LINE (shaft) using a cylinder
//   const shaftLength = length * 0.8; // 80% of total length is the shaft
//   const shaftGeometry = new THREE.CylinderGeometry(
//     shaftRadius,
//     shaftRadius,
//     shaftLength,
//     8,
//   );
//   const shaftMaterial = new THREE.MeshBasicMaterial({ color: color });
//   const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);

//   // Position shaft
//   shaft.position.set(0, shaftLength / 2, 0);

//   // 2. Create the ARROWHEAD (cone)
//   const headGeometry = new THREE.ConeGeometry(headRadius, headLength, 8);
//   const headMaterial = new THREE.MeshBasicMaterial({ color: color });
//   const head = new THREE.Mesh(headGeometry, headMaterial);

//   // Position arrowhead at the end of shaft
//   head.position.set(0, shaftLength + headLength / 2, 0);

//   // Add both to the arrow group
//   arrowGroup.add(shaft);
//   arrowGroup.add(head);

//   return arrowGroup;
// }

import createCustomArrow from "./customArrow.js";

export default function velocityVectorArrow(
  material,
  x,
  y,
  z,
  vx,
  vy,
  vz,
  type = "main",
) {
  const arrowKey = type === "test" ? "testVelocityArrow" : "velocityArrow";
  if (material[arrowKey]) {
    material.group.remove(material[arrowKey]);
    material[arrowKey] = null;
  }

  // Remove previous velocity arrow if it exists
  // if (material.velocityArrow) {
  //   material.group.remove(material.velocityArrow);
  //   material.velocityArrow = null;
  // }

  // Only show if velocity is nonzero
  if (vx !== 0 || vy !== 0 || vz !== 0) {
    const xScale =
      material.axisLength / (material.xRange.max - material.xRange.min);
    const yScale =
      material.axisLength / (material.yRange.max - material.yRange.min);
    const zScale =
      material.axisLength / (material.zRange.max - material.zRange.min);
    const visualX = (x - material.xRange.min) * xScale;
    const visualY = (y - material.yRange.min) * yScale;
    const visualZ = (z - material.zRange.min) * zScale;
    const vDir = new THREE.Vector3(
      vx * xScale,
      vy * yScale,
      vz * zScale,
    ).normalize();
    const vMag = Math.sqrt(vx * vx + vy * vy + vz * vz);

    // console.log(vx, vy, vz);

    // Scale length proportionally to velocity magnitude
    const lengthScale = 0.1; // Adjust this to control overall arrow size
    const length = vMag * lengthScale; // Arrow length directly proportional to velocity

    // Optional: Add minimum and maximum length limits
    const minLength = 0; // Minimum visible length
    const maxLength = 0; // Maximum length to prevent oversized arrows

    // console.log("Arrow length:", length);
    const clampedLength = Math.max(minLength, Math.min(maxLength, length));
    const finalLength = Math.min(length, 2);

    // Create custom arrow with adjustable parameters
    const shaftRadius = 0.05; // Adjust line thickness here
    const headRadius = 0.1; // Adjust arrowhead width here
    const headLength = 0.2; // Adjust arrowhead length here
    const color = "black"; // Adjust color here

    // material.velocityArrow = createCustomArrow(
    material[arrowKey] = createCustomArrow(
      // clampedLength,  // Use clamped length instead of normalized length
      finalLength,
      shaftRadius,
      headRadius,
      headLength,
      color,
    );

    // Position the arrow at particle location
    // material.velocityArrow.position.set(visualX, visualY, visualZ);
    material[arrowKey].position.set(visualX, visualY, visualZ);

    // Rotate the entire arrow to point in velocity direction
    // material.velocityArrow.quaternion.setFromUnitVectors(
    material[arrowKey].quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      vDir,
    );

    // material.velocityArrow.visible = material.visibleVelocityVector !== false;
    material[arrowKey].visible = material.visibleVelocityVector !== false;
    material.group.add(material[arrowKey]);

    if (!material.showReferenceVelocityVector) {
      material.velocityArrow.visible = false;
    }
    if (!material.showTestVelocity && type === "test") {
      material.testVelocityArrow.visible = false;
    }
  }
}
