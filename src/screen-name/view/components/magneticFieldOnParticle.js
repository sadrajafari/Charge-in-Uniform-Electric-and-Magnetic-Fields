// export default function magneticFieldOnParticle(material, x, y, z, Bx, By, Bz) {
//     // Remove previous arrow if it exists
//     if (material.magneticFieldOnParticleArrow) {
//       material.group.remove(material.magneticFieldOnParticleArrow);
//       material.magneticFieldOnParticleArrow = null;
//     }
//     // Only show if field is nonzero
//     if (Bx !== 0 || By !== 0 || Bz !== 0) {
//       const xScale = material.axisLength / (material.xRange.max - material.xRange.min);
//       const yScale = material.axisLength / (material.yRange.max - material.yRange.min);
//       const zScale = material.axisLength / (material.zRange.max - material.zRange.min);
//       const visualX = (x - material.xRange.min) * xScale;
//       const visualY = (y - material.yRange.min) * yScale;
//       const visualZ = (z - material.zRange.min) * zScale;
//       const dir = new THREE.Vector3(Bx, By, Bz).normalize();
//       const mag = Math.sqrt(Bx * Bx + By * By + Bz * Bz);
//       const minMag = 0;
//       const maxMag = 5; // adjust as needed for your field strength
//       const length = Math.max(
//         0,
//         Math.min(1, (2 * (mag - minMag)) / (maxMag - minMag)),
//       );
//       material.magneticFieldOnParticleArrow = new THREE.ArrowHelper(
//         dir,
//         new THREE.Vector3(visualX, visualY, visualZ),
//         length,
//         "teal", // deep sky blue
//         0.3,
//         0.2,
//       );
//       material.magneticFieldOnParticleArrow.visible =
//         material.visibleMagneticFieldParticle !== false;
//       material.group.add(material.magneticFieldOnParticleArrow);
//     }
//   }

// import createCustomArrow from "./customArrow.js";

// export default function magneticFieldOnParticle(material, x, y, z, Bx, By, Bz) {

//   // Remove previous arrow if it exists
//   if (material.magneticFieldOnParticleArrow) {
//     material.group.remove(material.magneticFieldOnParticleArrow);
//     material.magneticFieldOnParticleArrow = null;
//   }

//   // Only show if field is nonzero
//   if (Bx !== 0 || By !== 0 || Bz !== 0) {
//     const xScale =
//       material.axisLength / (material.xRange.max - material.xRange.min);
//     const yScale =
//       material.axisLength / (material.yRange.max - material.yRange.min);
//     const zScale =
//       material.axisLength / (material.zRange.max - material.zRange.min);
//     const visualX = (x - material.xRange.min) * xScale;
//     const visualY = (y - material.yRange.min) * yScale;
//     const visualZ = (z - material.zRange.min) * zScale;

//     const dir = new THREE.Vector3(Bx, By, Bz).normalize();
//     const mag = Math.sqrt(Bx * Bx + By * By + Bz * Bz);
//     const minMag = 0;
//     const maxMag = 5; // adjust as needed for your field strength
//     const length = Math.max(
//       0,
//       Math.min(1.5, (2 * (mag - minMag)) / (maxMag - minMag)),
//     );

//     // Create custom arrow with adjustable parameters
//     const shaftRadius = 0.05; // Line thickness
//     const headRadius = 0.1; // Arrowhead width
//     const headLength = 0.3; // Arrowhead length
//     // const color = "teal"; // Arrow color (deep sky blue)
//     // const color = "green"; // Arrow color (deep sky blue)
//     const color = "#0072B2"; // Arrow color (deep sky blue)

//     material.magneticFieldOnParticleArrow = createCustomArrow(
//       length,
//       shaftRadius,
//       headRadius,
//       headLength,
//       color,
//     );

//     // Position at particle location
//     material.magneticFieldOnParticleArrow.position.set(
//       visualX,
//       visualY,
//       visualZ,
//     );

//     // Rotate to point in magnetic field direction
//     material.magneticFieldOnParticleArrow.quaternion.setFromUnitVectors(
//       new THREE.Vector3(0, 1, 0),
//       dir,
//     );

//     material.magneticFieldOnParticleArrow.visible =
//       material.visibleMagneticFieldParticle !== false;
//     material.group.add(material.magneticFieldOnParticleArrow);
//   }
// }

import createCustomArrow from "./customArrow.js";

export default function magneticFieldOnParticle(
  material,
  x,
  y,
  z,
  Bx,
  By,
  Bz,
  type = "main",
) {
  // ✅ Use separate property for test particle
  const arrowKey =
    type === "test"
      ? "testMagneticFieldOnParticleArrow"
      : "magneticFieldOnParticleArrow";
  if (material[arrowKey]) {
    material.group.remove(material[arrowKey]);
    material[arrowKey] = null;
  }

  // Only show if field is nonzero
  if (Bx !== 0 || By !== 0 || Bz !== 0) {
    const xScale =
      material.axisLength / (material.xRange.max - material.xRange.min);
    const yScale =
      material.axisLength / (material.yRange.max - material.yRange.min);
    const zScale =
      material.axisLength / (material.zRange.max - material.zRange.min);
    const visualX = (x - material.xRange.min) * xScale;
    const visualY = (y - material.yRange.min) * yScale;
    const visualZ = (z - material.zRange.min) * zScale;

    const dir = new THREE.Vector3(Bx, By, Bz).normalize();
    const mag = Math.sqrt(Bx * Bx + By * By + Bz * Bz);
    const minMag = 0;
    const maxMag = 5;
    const length = 2;

    // Create custom arrow with adjustable parameters
    const shaftRadius = 0.05;
    const headRadius = 0.1;
    const headLength = 0.3;
    const color = "#0072B2";

    // ✅ Use material[arrowKey] instead of material.magneticFieldOnParticleArrow
    material[arrowKey] = createCustomArrow(
      length,
      shaftRadius,
      headRadius,
      headLength,
      color,
      true
    );

    // ✅ Use material[arrowKey] here
    material[arrowKey].position.set(visualX, visualY, visualZ);

    // ✅ And here
    material[arrowKey].quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir,
    );

    // ✅ And here
    material[arrowKey].visible =
      material.visibleMagneticFieldParticle !== false;
    material.group.add(material[arrowKey]);

    if (!material.showMagneticFieldParticle) {
      material.magneticFieldOnParticleArrow.visible = false;
    }
    if (!material.showTestMagneticFieldParticle && type === "test") {
      
      material.testMagneticFieldOnParticleArrow.visible = false;
    }
  }
}
