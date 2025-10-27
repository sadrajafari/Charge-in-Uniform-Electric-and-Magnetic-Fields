// export default function setCameraOrthogonalToMagneticField(
//   material,
//   Bx,
//   By,
//   Bz,
//   x,
//   y,
//   z,
// ) {
//   // nothing to do if no magnetic field
//   if (Bx === 0 && By === 0 && Bz === 0) return;

//   // ensure group transforms are up to date
//   material.group.updateMatrixWorld(true);

//   // convert particle physical position -> visual coords
//   const xScale =
//     material.axisLength / (material.xRange.max - material.xRange.min);
//   const yScale =
//     material.axisLength / (material.yRange.max - material.yRange.min);
//   const zScale =
//     material.axisLength / (material.zRange.max - material.zRange.min);
//   const visualX = (x - material.xRange.min) * xScale;
//   const visualY = (y - material.yRange.min) * yScale;
//   const visualZ = (z - material.zRange.min) * zScale;

//   // particle target in world space
//   const targetPoint = new THREE.Vector3(visualX, visualY, visualZ);
//   const worldTarget = targetPoint
//     .clone()
//     .applyMatrix4(material.group.matrixWorld);

//   // compute magnetic force in model (physical) coordinates: F = q * (v × B)
//   const vx = material.vx,
//     vy = material.vy,
//     vz = material.vz,
//     q = material.q;
//   const fX = q * (vy * Bz - vz * By);
//   const fY = q * (vz * Bx - vx * Bz);
//   const fZ = q * (vx * By - vy * Bx);
//   const force = new THREE.Vector3(fX, fY, fZ);

//   // determine a reliable world-space horizontal heading (based on force)
//   const eps = 1e-12;
//   let worldForceDir = new THREE.Vector3();
//   if (force.lengthSq() > eps) {
//     worldForceDir
//       .copy(force)
//       .normalize()
//       .applyQuaternion(material.group.quaternion);
//   } else {
//     // fallback: use B's world direction
//     worldForceDir
//       .copy(new THREE.Vector3(Bx, By, Bz))
//       .normalize()
//       .applyQuaternion(material.group.quaternion);
//   }

//   // project force to horizontal plane to get heading
//   const horiz = worldForceDir.clone();
//   horiz.y = 0; // project to horizontal
//   if (horiz.lengthSq() < 1e-8) {
//     // force nearly vertical: pick perpendicular horizontal direction
//     horiz.set(worldForceDir.z, 0, -worldForceDir.x);
//     if (horiz.lengthSq() < 1e-8) horiz.set(1, 0, 0);
//   }
//   horiz.normalize();

//   // Calculate the "right" direction (perpendicular to force direction)
//   const up = new THREE.Vector3(0, 1, 0);
//   const rightDir = new THREE.Vector3()
//     .crossVectors(worldForceDir, up)
//     .normalize();

//   // If cross product is too small, force is vertical, use alternative right
//   if (rightDir.lengthSq() < 1e-8) {
//     rightDir.set(1, 0, 0);
//   }

//   // Build a direction 45° above horizontal, preserving heading
//   const angle45 = Math.PI / 9;
//   const elevatedDir = new THREE.Vector3()
//     .addScaledVector(horiz, Math.cos(angle45))
//     .addScaledVector(up, Math.sin(angle45))
//     .normalize();

//   // Add a right-side offset (adjust the multiplier to control how far right)
//   // const rightOffset = -.5; // Adjust this value to move more/less to the right
//   const rightOffset = -0.5; // Adjust this value to move more/less to the right
//   const offsetElevatedDir = elevatedDir
//     .clone()
//     .add(rightDir.clone().multiplyScalar(rightOffset))
//     .normalize();

//   // place camera at specified distance along offsetElevatedDir (in front and to the right of particle)
//   const distance = 10; // adjust for framing
//   const cameraPos = worldTarget
//     .clone()
//     .add(offsetElevatedDir.clone().multiplyScalar(distance));
//   material.camera.position.copy(cameraPos);

//   // make camera always look at the particle
//   material.camera.lookAt(worldTarget);

//   // stable up vector
//   const worldUp = new THREE.Vector3(0, 1, 0);
//   material.camera.up.copy(worldUp);

//   // update controls target so interaction stays centered on the particle
//   material.controls.target.copy(worldTarget);
// }

// export default function setCameraOrthogonalToMagneticField(material, Bx, By, Bz, x, y, z) {
//     // nothing to do if no magnetic field
//     if (Bx === 0 && By === 0 && Bz === 0) return;

//     // ensure group transforms are up to date
//     material.group.updateMatrixWorld(true);

//     // convert particle physical position -> visual coords
//     const xScale = material.axisLength / (material.xRange.max - material.xRange.min);
//     const yScale = material.axisLength / (material.yRange.max - material.yRange.min);
//     const zScale = material.axisLength / (material.zRange.max - material.zRange.min);
//     const visualX = (x - material.xRange.min) * xScale;
//     const visualY = (y - material.yRange.min) * yScale;
//     const visualZ = (z - material.zRange.min) * zScale;

//     // particle target in world space
//     const targetPoint = new THREE.Vector3(visualX, visualY, visualZ);
//     const worldTarget = targetPoint
//       .clone()
//       .applyMatrix4(material.group.matrixWorld);

//     // compute magnetic force: F = q * (v × B)
//     const vx = material.vx,
//       vy = material.vy,
//       vz = material.vz,
//       q = material.q;
//     const fX = q * (vy * Bz - vz * By);
//     const fY = q * (vz * Bx - vx * Bz);
//     const fZ = q * (vx * By - vy * Bx);
//     const force = new THREE.Vector3(fX, fY, fZ);

//     // Get force direction in world space
//     const eps = 1e-12;
//     let forceDir = new THREE.Vector3();
//     if (force.lengthSq() > eps) {
//       forceDir.copy(force).normalize().applyQuaternion(material.group.quaternion);
//     } else {
//       // No force - use velocity direction as fallback
//       forceDir.set(vx, vy, vz).normalize().applyQuaternion(material.group.quaternion);
//     }

//     // Calculate "right" direction (perpendicular to force)
//     const up = new THREE.Vector3(0, 1, 0);
//     const rightDir = new THREE.Vector3().crossVectors(forceDir, up).normalize();

//     // If force is vertical, use alternative right direction
//     if (rightDir.lengthSq() < 1e-8) {

//       rightDir.set(1, 0, 0);
//     }

//     // Build camera direction vector (combine force direction + offsets)
//     const rightOffset = -10; // Shift to the right
//     const upOffset = 5;     // Move up

//     const cameraDirection = forceDir
//       .clone()
//       .add(rightDir.clone().multiplyScalar(rightOffset / 10)) // Normalize offset
//       .add(up.clone().multiplyScalar(upOffset / 10))          // Normalize offset
//       .normalize(); // IMPORTANT: Normalize to unit length

//     // Position camera at CONSTANT distance from particle
//     const distance = 10; // Constant distance
//     const cameraPos = worldTarget
//       .clone()
//       .add(cameraDirection.multiplyScalar(distance)); // Apply constant distance

//     material.camera.position.copy(cameraPos);

//     // Look back at the particle (so force arrow points toward camera)
//     material.camera.lookAt(worldTarget);

//     // Stable up vector
//     material.camera.up.set(0, 1, 0);

//     // Update controls
//     material.controls.target.copy(worldTarget);
// }

// export default function setCameraOrthogonalToMagneticField(
//   material,
//   Bx,
//   By,
//   Bz,
//   x,
//   y,
//   z,
// ) {
//   // nothing to do if no magnetic field
//   if (Bx === 0 && By === 0 && Bz === 0) return;

//   // ensure group transforms are up to date
//   material.group.updateMatrixWorld(true);

//   // convert particle physical position -> visual coords
//   const xScale =
//     material.axisLength / (material.xRange.max - material.xRange.min);
//   const yScale =
//     material.axisLength / (material.yRange.max - material.yRange.min);
//   const zScale =
//     material.axisLength / (material.zRange.max - material.zRange.min);
//   const visualX = (x - material.xRange.min) * xScale;
//   const visualY = (y - material.yRange.min) * yScale;
//   const visualZ = (z - material.zRange.min) * zScale;

//   // particle target in world space
//   const targetPoint = new THREE.Vector3(visualX, visualY, visualZ);
//   const worldTarget = targetPoint
//     .clone()
//     .applyMatrix4(material.group.matrixWorld);

//   // ✅ Use MAGNETIC FIELD direction instead of force
//   const magneticField = new THREE.Vector3(Bx, By, Bz);

//   // Get magnetic field direction in world space
//   const eps = 1e-12;
//   let fieldDir = new THREE.Vector3();
//   if (magneticField.lengthSq() > eps) {
//     fieldDir
//       .copy(magneticField)
//       .normalize()
//       .applyQuaternion(material.group.quaternion);
//   } else {
//     // Fallback to default direction
//     fieldDir.set(0, 0, 1);
//   }

//   // Calculate "right" direction (perpendicular to magnetic field)
//   const up = new THREE.Vector3(0, 1, 0);
//   const rightDir = new THREE.Vector3().crossVectors(fieldDir, up).normalize();

//   // If field is vertical, use alternative right direction
//   if (rightDir.lengthSq() < 1e-8) {
//     rightDir.set(1, 0, 0);
//   }

//   // Build camera direction vector (combine field direction + offsets)
//   const rightOffset = -2; // Shift to the right
//   const upOffset = -5; // Move up

//   const cameraDirection = fieldDir
//     .clone()
//     .add(rightDir.clone().multiplyScalar(rightOffset / 10)) // Normalize offset
//     .add(up.clone().multiplyScalar(upOffset / 10)) // Normalize offset
//     .normalize(); // IMPORTANT: Normalize to unit length

//   // Position camera at CONSTANT distance from particle
//   const distance = 10; // Constant distance
//   const cameraPos = worldTarget
//     .clone()
//     .add(cameraDirection.multiplyScalar(distance)); // Apply constant distance

//   material.camera.position.copy(cameraPos);

//   // Look back at the particle (so magnetic field arrow points toward camera)
//   material.camera.lookAt(worldTarget);

//   // Stable up vector
//   material.camera.up.set(0, 1, 0);

//   // Update controls
//   material.controls.target.copy(worldTarget);
// }

export default function setCameraOrthogonalToMagneticField(
  material,
  Bx,
  By,
  Bz,
  x,
  y,
  z,
) {
  // Add orbit hooks once to capture a persistent follow offset and log camera position
  if (!material._cameraHooksAdded) {
    material.controls.addEventListener("start", () => {
      material._userMovingCamera = true;
    });
    material.controls.addEventListener("end", () => {
      material._userMovingCamera = false;
      // Save the offset the user prefers (camera relative to current target)
      material.cameraFollowOffset = material.camera.position
        .clone()
        .sub(material.controls.target);
      material._useFollowOffset = true;
    });
    
    material._cameraHooksAdded = true;
  }

  // nothing to do if no magnetic field
  if (Bx === 0 && By === 0 && Bz === 0) return;

  // ensure group transforms are up to date
  material.group.updateMatrixWorld(true);

  // convert particle physical position -> visual coords
  const xScale =
    material.axisLength / (material.xRange.max - material.xRange.min);
  const yScale =
    material.axisLength / (material.yRange.max - material.yRange.min);
  const zScale =
    material.axisLength / (material.zRange.max - material.zRange.min);
  const visualX = (x - material.xRange.min) * xScale;
  const visualY = (y - material.yRange.min) * yScale;
  const visualZ = (z - material.zRange.min) * zScale;

  // particle target in world space
  const targetPoint = new THREE.Vector3(visualX, visualY, visualZ);
  const worldTarget = targetPoint
    .clone()
    .applyMatrix4(material.group.matrixWorld);

  // Always keep OrbitControls target on the particle
  material.controls.target.copy(worldTarget);

  // If user is moving the camera, do not override their movement
  if (material._userMovingCamera) {
    return;
  }

  // If a user-chosen view exists, follow the particle with that exact offset
  if (material._useFollowOffset && material.cameraFollowOffset) {
    material.camera.position.copy(worldTarget).add(material.cameraFollowOffset);
    material.camera.lookAt(worldTarget);
    material.camera.up.set(0, 1, 0);
    return;
  }

  // Initial automatic placement based on magnetic field direction
  const magneticField = new THREE.Vector3(Bx, By, Bz);

  const eps = 1e-12;
  let fieldDir = new THREE.Vector3();
  if (magneticField.lengthSq() > eps) {
    fieldDir
      .copy(magneticField)
      .normalize()
      .applyQuaternion(material.group.quaternion);
  } else {
    fieldDir.set(0, 0, 1);
  }

  // Calculate "right" direction (perpendicular to magnetic field)
  const up = new THREE.Vector3(0, 1, 0);
  const rightDir = new THREE.Vector3().crossVectors(fieldDir, up).normalize();

  // If field is vertical, use alternative right direction
  if (rightDir.lengthSq() < 1e-8) {
    rightDir.set(1, 0, 0);
  }

  // Build camera direction vector (combine field direction + offsets)
  const rightOffset = -2; // Shift to the right
  const upOffset = -5; // Move up

  const cameraDirection = fieldDir
    .clone()
    .add(rightDir.clone().multiplyScalar(rightOffset / 10))
    .add(up.clone().multiplyScalar(upOffset / 10))
    .normalize();

  // Position camera at CONSTANT distance from particle
  const distance = 10;
  const cameraPos = worldTarget
    .clone()
    .add(cameraDirection.multiplyScalar(distance));
  material.camera.position.copy(cameraPos);

  // Look back at the particle
  material.camera.lookAt(worldTarget);

  // Stable up vector
  material.camera.up.set(0, 1, 0);

  // Initialize a default follow offset so it keeps following until the user sets their own
  if (!material.cameraFollowOffset) {
    material.cameraFollowOffset = material.camera.position
      .clone()
      .sub(worldTarget);
  }
}
