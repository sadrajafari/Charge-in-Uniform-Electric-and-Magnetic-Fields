// export default function setCameraOrthogonalToElectricField(material, Ex, Ey, Ez, x, y, z) {
//     if (Ex === 0 && Ey === 0 && Ez === 0) {
//       return;
//     }

//     // Convert particle position from physical to visual coordinates
//     const xScale = material.axisLength / (material.xRange.max - material.xRange.min);
//     const yScale = material.axisLength / (material.yRange.max - material.yRange.min);
//     const zScale = material.axisLength / (material.zRange.max - material.zRange.min);

//     const visualX = (x - material.xRange.min) * xScale;
//     const visualY = (y - material.yRange.min) * yScale;
//     const visualZ = (z - material.zRange.min) * zScale;

//     // Target point in group space
//     const targetPoint = new THREE.Vector3(visualX, visualY, visualZ);

//     // Get target in world space by applying the group's matrix
//     const worldTarget = targetPoint.clone();
//     worldTarget.applyMatrix4(material.group.matrixWorld);

//     // Normalize the electric field vector
//     const eField = new THREE.Vector3(Ex, Ey, Ez).normalize();

//     // Transform the electric field direction to world space (rotation only)
//     const worldEField = eField.clone();
//     worldEField.applyQuaternion(material.group.quaternion);

//     // Find a perpendicular vector using a more robust approach
//     // First, find the smallest component of the field vector
//     let perpendicular;
//     if (
//       Math.abs(worldEField.x) <= Math.abs(worldEField.y) &&
//       Math.abs(worldEField.x) <= Math.abs(worldEField.z)
//     ) {
//       // x is smallest, use unit vector along x
//       perpendicular = new THREE.Vector3(1, 0, 0);
//     } else if (Math.abs(worldEField.y) <= Math.abs(worldEField.z)) {
//       // y is smallest, use unit vector along y
//       perpendicular = new THREE.Vector3(0, 1, 0);
//     } else {
//       // z is smallest, use unit vector along z
//       perpendicular = new THREE.Vector3(0, 0, 1);
//     }

//     // Make perpendicular actually perpendicular to worldEField
//     perpendicular.sub(
//       worldEField.clone().multiplyScalar(perpendicular.dot(worldEField)),
//     );

//     // Normalize
//     perpendicular.normalize();

//     // Position camera along this perpendicular direction
//     const distance = 10; // Distance from target
//     const cameraPosition = new THREE.Vector3().addVectors(
//       worldTarget,
//       perpendicular.multiplyScalar(distance),
//     );

//     // Set camera position and orientation
//     material.camera.position.copy(cameraPosition);
//     material.camera.lookAt(worldTarget);
//     // material.camera.up.copy(worldEField); // Align camera's up with electric field

//     // Update orbit controls target
//     material.controls.target.copy(worldTarget);
//   }


export default function setCameraOrthogonalToElectricField(material, Ex, Ey, Ez, x, y, z) {
  // Hook OrbitControls once to capture a persistent follow offset
  if (!material._cameraHooksAdded) {
    material.controls.addEventListener('start', () => {
      material._userMovingCamera = true;
    });
    material.controls.addEventListener('end', () => {
      material._userMovingCamera = false;
      // Save the offset the user prefers (camera relative to current target)
      material.cameraFollowOffset = material.camera.position.clone().sub(material.controls.target);
      material._useFollowOffset = true;
    });
    material._cameraHooksAdded = true;
  }

  // Ensure group transforms are up to date
  material.group.updateMatrixWorld(true);

  // Convert particle position from physical to visual coordinates
  const xScale = material.axisLength / (material.xRange.max - material.xRange.min);
  const yScale = material.axisLength / (material.yRange.max - material.yRange.min);
  const zScale = material.axisLength / (material.zRange.max - material.zRange.min);

  const visualX = (x - material.xRange.min) * xScale;
  const visualY = (y - material.yRange.min) * yScale;
  const visualZ = (z - material.zRange.min) * zScale;

  // Target point in group space -> world space
  const targetPoint = new THREE.Vector3(visualX, visualY, visualZ);
  const worldTarget = targetPoint.clone().applyMatrix4(material.group.matrixWorld);

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

  // If electric field is zero and no offset yet, do nothing
  if (Ex === 0 && Ey === 0 && Ez === 0) {
    return;
  }

  // Normalize the electric field vector
  const eField = new THREE.Vector3(Ex, Ey, Ez).normalize();

  // Transform the electric field direction to world space (rotation only)
  const worldEField = eField.clone().applyQuaternion(material.group.quaternion);

  // Find a robust perpendicular to worldEField:
  // Pick the axis with the smallest component, then orthogonalize
  let perpendicular;
  if (
    Math.abs(worldEField.x) <= Math.abs(worldEField.y) &&
    Math.abs(worldEField.x) <= Math.abs(worldEField.z)
  ) {
    perpendicular = new THREE.Vector3(1, 0, 0);
  } else if (Math.abs(worldEField.y) <= Math.abs(worldEField.z)) {
    perpendicular = new THREE.Vector3(0, 1, 0);
  } else {
    perpendicular = new THREE.Vector3(0, 0, 1);
  }
  perpendicular.sub(worldEField.clone().multiplyScalar(perpendicular.dot(worldEField)));
  perpendicular.normalize();

  // Position camera along this perpendicular direction
  const distance = 10; // Distance from target
  const cameraPosition = worldTarget.clone().add(perpendicular.multiplyScalar(distance));

  // Set camera position and orientation
  material.camera.position.copy(cameraPosition);
  material.camera.lookAt(worldTarget);
  material.camera.up.set(0, 1, 0);

  // Initialize a default follow offset so it keeps following until the user sets their own
  if (!material.cameraFollowOffset) {
    material.cameraFollowOffset = material.camera.position.clone().sub(worldTarget);
  }
}