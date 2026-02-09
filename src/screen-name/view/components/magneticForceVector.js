

// import createCustomArrow from "./customArrow.js";

// export default function magneticForceVector(
//   material,
//   q,
//   vx,
//   vy,
//   vz,
//   Bx,
//   By,
//   Bz,
//   x = null,
//   y = null,
//   z = null,
//   type = "main"
// ) {

//   const arrowKey = type === "test" ? "testMagneticFieldOnParticleArrow" : "magneticFieldOnParticleArrow";
//   if (material[arrowKey]) {
//     material.group.remove(material[arrowKey]);
//     material[arrowKey] = null;
//   }
//   // Remove previous magnetic force arrow if it exists
//   // if (material.magneticForceField) {
//   //   material.group.remove(material.magneticForceField);
//   //   material.magneticForceField = null;
//   // }

//   const xDir = q * (vy * Bz - vz * By);
//   const yDir = q * (vz * Bx - vx * Bz);
//   const zDir = q * (vx * By - vy * Bx);

//   // Only show if force is nonzero
//   if (xDir !== 0 || yDir !== 0 || zDir !== 0) {
//     // Calculate the center of the axes in visual coordinates
//     const centerX = material.axisLength / 2;
//     const centerY = material.axisLength / 2;
//     const centerZ = material.axisLength / 2;

//     // Create direction vector (normalize for arrow direction)
//     const dir = new THREE.Vector3(xDir, yDir, zDir).normalize();

//     // Calculate magnitude and scale length
//     const mag = Math.sqrt(xDir * xDir + yDir * yDir + zDir * zDir);
//     const minMag = 0;
//     const maxMag = 40;
//     let normalizedMag = (2 * (mag - minMag)) / (maxMag - minMag);
//     normalizedMag = Math.max(0, Math.min(1.5, normalizedMag)); // clamp to [0,1]

//     const lengthScale = 0.1; // Adjust this to control overall arrow size
//     const length = mag * lengthScale; // Arrow length directly proportional to velocity
//     const finalLength = Math.min(length, 1.5);

//     // Create custom arrow with adjustable parameters
//     const shaftRadius = 0.05; // Line thickness
//     const headRadius = 0.1; // Arrowhead width
//     const headLength = 0.3; // Arrowhead length
//     // const color = "blue"; // Arrow color
//     // const color = "#009E73"; // Arrow color
//     const color = "#63b5e4"; // Arrow color
//     // const color = "#021018ff"; // Arrow color

//     material.magneticForceField = createCustomArrow(
//       // normalizedMag, // Length
//       finalLength,
//       shaftRadius,
//       headRadius,
//       headLength,
//       color,
//     );

//     // Position at center
//     material.magneticForceField.position.set(centerX, centerY, centerZ);

//     // Rotate to point in force direction
//     material.magneticForceField.quaternion.setFromUnitVectors(
//       new THREE.Vector3(0, 1, 0),
//       dir,
//     );

//     material.magneticForceField.visible = true;
//     material.group.add(material.magneticForceField);
//   }
// }









import createCustomArrow from "./customArrow.js";

export default function magneticForceVector(
  material,
  q,
  vx,
  vy,
  vz,
  Bx,
  By,
  Bz,
  x = null,      // ✅ Position parameters
  y = null,
  z = null,
  type = "main"  // ✅ type parameter
) {
  // ✅ FIX: Use correct arrowKey for magnetic FORCE (not field)
  const arrowKey = type === "test" ? "testMagneticForceField" : "magneticForceField";
  if (material[arrowKey]) {
    material.group.remove(material[arrowKey]);
    material[arrowKey] = null;
  }

  const xDir = q * (vy * Bz - vz * By);
  const yDir = q * (vz * Bx - vx * Bz);
  const zDir = q * (vx * By - vy * Bx);

  // Only show if force is nonzero
  if (xDir !== 0 || yDir !== 0 || zDir !== 0) {
    let centerX, centerY, centerZ;
    
    // ✅ For test particle: use its actual position
    if (type === "test" && x !== null && y !== null && z !== null) {
      const xScale = material.axisLength / (material.xRange.max - material.xRange.min);
      const yScale = material.axisLength / (material.yRange.max - material.yRange.min);
      const zScale = material.axisLength / (material.zRange.max - material.zRange.min);
      centerX = (x - material.xRange.min) * xScale;
      centerY = (y - material.yRange.min) * yScale;
      centerZ = (z - material.zRange.min) * zScale;
    } else {
      // For reference particle: use center of axes
      centerX = material.axisLength / 2;
      centerY = material.axisLength / 2;
      centerZ = material.axisLength / 2;
    }

    // Create direction vector (normalize for arrow direction)
    const dir = new THREE.Vector3(xDir, yDir, zDir).normalize();

    // Calculate magnitude and scale length
    const mag = Math.sqrt(xDir * xDir + yDir * yDir + zDir * zDir);
    const lengthScale = 0.1;
    const length = mag * lengthScale;
    const finalLength = Math.min(length, 2);

    // Create custom arrow with adjustable parameters
    const shaftRadius = 0.05;
    const headRadius = 0.1;
    const headLength = 0.3;
    const color = "#0072B2";

    // ✅ Use material[arrowKey] instead of material.magneticForceField
    material[arrowKey] = createCustomArrow(
      finalLength,
      shaftRadius,
      headRadius,
      headLength,
      color,
      false
    );

    // ✅ Use material[arrowKey] here
    material[arrowKey].position.set(centerX, centerY, centerZ);

    // ✅ And here
    material[arrowKey].quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir,
    );

    // ✅ And here
    // material[arrowKey].visible = true;
    material.group.add(material[arrowKey]);
    if (!material.showTestMagneticForce && type === "test") {
      material[arrowKey].visible = false;
      // material.group.remove(material.testMagneticForceField);
    }
  }
}




// import createCustomArrow from "./customArrow.js";

// export default function magneticForceVector(
//   material,
//   q,
//   vx,
//   vy,
//   vz,
//   Bx,
//   By,
//   Bz,
//   x = null,
//   y = null,
//   z = null,
//   type = "main"
// ) {
//   const arrowKey = type === "test" ? "testMagneticForceField" : "magneticForceField";
//   if (material[arrowKey]) {
//     material.group.remove(material[arrowKey]);
//     material[arrowKey] = null;
//   }

//   // Physical Lorentz force components (for magnitude)
//   const xDir = q * (vy * Bz - vz * By);
//   const yDir = q * (vz * Bx - vx * Bz);
//   const zDir = q * (vx * By - vy * Bx);

//   // Early out if zero
//   if (xDir === 0 && yDir === 0 && zDir === 0) return;

//   // View-space scales (anisotropic axes)
//   const xScale = material.axisLength / (material.xRange.max - material.xRange.min);
//   const yScale = material.axisLength / (material.yRange.max - material.yRange.min);
//   const zScale = material.axisLength / (material.zRange.max - material.zRange.min);

//   // Position to place the arrow
//   let centerX, centerY, centerZ;
//   if (type === "test" && x !== null && y !== null && z !== null) {
//     centerX = (x - material.xRange.min) * xScale;
//     centerY = (y - material.yRange.min) * yScale;
//     centerZ = (z - material.zRange.min) * zScale;
//   } else {
//     centerX = material.axisLength / 2;
//     centerY = material.axisLength / 2;
//     centerZ = material.axisLength / 2;
//   }

//   // Build direction in view space so it's visually ⟂ to v and B
//   const vView = new THREE.Vector3(vx * xScale, vy * yScale, vz * zScale);
//   const bView = new THREE.Vector3(Bx * xScale, By * yScale, Bz * zScale);
//   const dir = new THREE.Vector3().crossVectors(vView, bView);
//   if (q < 0) dir.negate(); // account for charge sign in direction
//   if (dir.lengthSq() === 0) return;
//   dir.normalize();

//   // Length from physical magnitude (keeps sizing meaningful)
//   const fPhysMag = Math.sqrt(xDir * xDir + yDir * yDir + zDir * zDir);
//   const lengthScale = 0.1;
//   const finalLength = Math.min(fPhysMag * lengthScale, 2);

//   const shaftRadius = 0.05;
//   const headRadius = 0.1;
//   const headLength = 0.3;
//   const color = "#0072B2";

//   material[arrowKey] = createCustomArrow(
//     finalLength,
//     shaftRadius,
//     headRadius,
//     headLength,
//     color,
//     true
//   );

//   material[arrowKey].position.set(centerX, centerY, centerZ);
//   material[arrowKey].quaternion.setFromUnitVectors(
//     new THREE.Vector3(0, 1, 0),
//     dir
//   );

//   material.group.add(material[arrowKey]);
// }
// // ...existing code...