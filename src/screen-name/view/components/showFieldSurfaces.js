


// import createCustomArrow from "./customArrow.js";

// export default function showFieldSurfaces(
//   material,
//   numPerSide = material.rowNumber,
//   bx = material.Bx,
//   by = material.By,
//   bz = material.Bz,
//   ex = material.Ex,
//   ey = material.Ey,
//   ez = material.Ez,
// ) {
//   // Remove previous field surface arrows if any
//   if (material.fieldSurfaceArrows) {
//     material.fieldSurfaceArrows.forEach((arrow) => material.group.remove(arrow));
//   }
//   material.fieldSurfaceArrows = [];

//   // Arrow parameters
//   const shaftRadius = 0.03;   // Line thickness
//   const headRadius = 0.09;    // Arrowhead width
//   const headLength = 0.27;    // Arrowhead length
//   const arrowLength = 1.4;    // Arrow length

//   // Use provided field values instead of reading from sliders
//   // Planes: closer together
//   const zPlanes = [
//     material.axisLength / 4,
//     material.axisLength / 2,
//     (3 * material.axisLength) / 4,
//   ];
  
//   for (const z of zPlanes) {
//     for (let i = 0; i < numPerSide; i++) {
//       for (let j = 0; j < numPerSide; j++) {
//         // Position grid in x and y
//         const x = (i + 0.5) * (material.axisLength / numPerSide);
//         const y = (j + 0.5) * (material.axisLength / numPerSide);
        
//         // Magnetic field arrow (teal)
//         if (bx !== 0 || by !== 0 || bz !== 0) {
//           const bDir = new THREE.Vector3(bx, by, bz).normalize();
          
//           const bArrow = createCustomArrow(
//             arrowLength,
//             shaftRadius,
//             headRadius,
//             headLength,
//             // "teal"
//             "#0072B2",
//             true
//           );
          
//           // Position the arrow
//           bArrow.position.set(x, y, z);
          
//           // Rotate to point in magnetic field direction
//           bArrow.quaternion.setFromUnitVectors(
//             new THREE.Vector3(0, 1, 0),
//             bDir
//           );
          
//           bArrow.visible = material.showMagneticField;
//           material.group.add(bArrow);
//           material.fieldSurfaceArrows.push(bArrow);
//         }
        
//         // Electric field arrow (maroon)
//         if (ex !== 0 || ey !== 0 || ez !== 0) {
//           const eDir = new THREE.Vector3(ex, ey, ez).normalize();
          
//           const eArrow = createCustomArrow(
//             arrowLength,
//             shaftRadius,
//             headRadius,
//             headLength,
//             // "maroon"
//             // "#D55E00"
//             "#CC5500",
//             true
//           );
          
//           // Position the arrow
//           eArrow.position.set(x, y, z);
          
//           // Rotate to point in electric field direction
//           eArrow.quaternion.setFromUnitVectors(
//             new THREE.Vector3(0, 1, 0),
//             eDir
//           );
          
//           eArrow.visible = material.showElectricField;
//           material.group.add(eArrow);
//           material.fieldSurfaceArrows.push(eArrow);
//         }
//       }
//     }
//   }
// }


import createCustomArrow from "./customArrow.js";

export default function showFieldSurfaces(
  material,
  numPerSide = material.rowNumber,
  bx = material.Bx,
  by = material.By,
  bz = material.Bz,
  ex = material.Ex,
  ey = material.Ey,
  ez = material.Ez,
) {
  // Remove previous field surface arrows if any
  if (material.fieldSurfaceArrows) {
    material.fieldSurfaceArrows.forEach((arrow) => material.group.remove(arrow));
  }
  material.fieldSurfaceArrows = [];

  // Arrow parameters
  const shaftRadius = 0.03;   // Line thickness
  const headRadius = 0.09;    // Arrowhead width
  const headLength = 0.27;    // Arrowhead length
  const arrowLength = 1.4;    // Arrow length

  // Choose zPlanes based on numPerSide
  let zPlanes;
  if (numPerSide === 1) {
    zPlanes = [material.axisLength / 2];
  } else {
    zPlanes = [
      material.axisLength / 4,
      material.axisLength / 2,
      (3 * material.axisLength) / 4,
    ];
  }

  for (const z of zPlanes) {
    for (let i = 0; i < numPerSide; i++) {
      for (let j = 0; j < numPerSide; j++) {
        // Position grid in x and y
        const x = (i + 0.5) * (material.axisLength / numPerSide);
        const y = (j + 0.5) * (material.axisLength / numPerSide);

        // Magnetic field arrow (teal)
        if (bx !== 0 || by !== 0 || bz !== 0) {
          const bDir = new THREE.Vector3(bx, by, bz).normalize();

          const bArrow = createCustomArrow(
            arrowLength,
            shaftRadius,
            headRadius,
            headLength,
            "#0072B2",
            true
          );

          // Position the arrow
          bArrow.position.set(x, y, z);

          // Rotate to point in magnetic field direction
          bArrow.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            bDir
          );

          bArrow.visible = material.showMagneticField;
          material.group.add(bArrow);
          material.fieldSurfaceArrows.push(bArrow);
        }

        // Electric field arrow (maroon)
        if (ex !== 0 || ey !== 0 || ez !== 0) {
          const eDir = new THREE.Vector3(ex, ey, ez).normalize();

          const eArrow = createCustomArrow(
            arrowLength,
            shaftRadius,
            headRadius,
            headLength,
            "#CC5500",
            true
          );

          // Position the arrow
          eArrow.position.set(x, y, z);

          // Rotate to point in electric field direction
          eArrow.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            eDir
          );

          eArrow.visible = material.showElectricField;
          material.group.add(eArrow);
          material.fieldSurfaceArrows.push(eArrow);
        }
      }
    }
  }
}