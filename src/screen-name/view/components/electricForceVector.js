// import createCustomArrow from "./customArrow.js";

// export default function electricForceVector(
//   material,
//   q = material.q,
//   Ex = material.Ex,
//   Ey = material.Ey,
//   Ez = material.Ez,
// ) {
//   const xDir = q * Ex;
//   const yDir = q * Ey;
//   const zDir = q * Ez;

//   // Calculate the center of the axes in visual coordinates
//   const centerX = material.axisLength / 2;
//   const centerY = material.axisLength / 2;
//   const centerZ = material.axisLength / 2;

//   // Create direction vector (normalize for ArrowHelper)
//   const dir = new THREE.Vector3(xDir, yDir, zDir).normalize();
//   const length = 1.5;

//   // Create the arrow
//   material.electricForceField = new THREE.ArrowHelper(
//     dir,
//     new THREE.Vector3(centerX, centerY, centerZ),
//     length,
//     "red",
//     0.3,
//     0.2,
//   );
//   material.electricForceField.visible = true;
//   material.group.add(material.electricForceField);
// }

import createCustomArrow from "./customArrow.js";

export default function electricForceVector(
  material,
  q = material.q,
  Ex = material.Ex,
  Ey = material.Ey,
  Ez = material.Ez,
) {
  // Remove previous arrow if it exists
  if (material.electricForceField) {
    material.group.remove(material.electricForceField);
    material.electricForceField = null;
  }

  const xDir = q * Ex;
  const yDir = q * Ey;
  const zDir = q * Ez;

  // Only show if force is nonzero
  if (xDir !== 0 || yDir !== 0 || zDir !== 0) {
    // Calculate the center of the axes in visual coordinates
    const centerX = material.axisLength / 2;
    const centerY = material.axisLength / 2;
    const centerZ = material.axisLength / 2;

    // Create direction vector (normalize for arrow direction)
    const dir = new THREE.Vector3(xDir, yDir, zDir).normalize();

    // Calculate magnitude and scale length
    const mag = Math.sqrt(xDir * xDir + yDir * yDir + zDir * zDir);
    // const lengthScale = 0.1; // Adjust for desired arrow size
    // const length = Math.min(mag * lengthScale, 1.5); // Cap at 1.5

    const lengthScale = 0.1; // Adjust this to control overall arrow size
    const length = mag * lengthScale; // Arrow length directly proportional to velocity
    // const finalLength = Math.min(0, 1.5);
    const finalLength = 1.5;

    // Create custom arrow with adjustable parameters
    const shaftRadius = 0.05; // Line thickness
    const headRadius = 0.1; // Arrowhead width
    const headLength = 0.3; // Arrowhead length
    // const color = "red"; // Arrow color for electric force
    const color = "#E69F00"; // Arrow color for electric force

    material.electricForceField = createCustomArrow(
      finalLength,
      shaftRadius,
      headRadius,
      headLength,
      color,
    );

    // Position at center
    material.electricForceField.position.set(centerX, centerY, centerZ);

    // Rotate to point in force direction
    material.electricForceField.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir,
    );

    material.electricForceField.visible = true;
    material.group.add(material.electricForceField);
  }
}
