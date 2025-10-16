export default function setCameraOrthogonalToElectricField(material, Ex, Ey, Ez, x, y, z) {
    if (Ex === 0 && Ey === 0 && Ez === 0) {
      return;
    }

    // Convert particle position from physical to visual coordinates
    const xScale = material.axisLength / (material.xRange.max - material.xRange.min);
    const yScale = material.axisLength / (material.yRange.max - material.yRange.min);
    const zScale = material.axisLength / (material.zRange.max - material.zRange.min);

    const visualX = (x - material.xRange.min) * xScale;
    const visualY = (y - material.yRange.min) * yScale;
    const visualZ = (z - material.zRange.min) * zScale;

    // Target point in group space
    const targetPoint = new THREE.Vector3(visualX, visualY, visualZ);

    // Get target in world space by applying the group's matrix
    const worldTarget = targetPoint.clone();
    worldTarget.applyMatrix4(material.group.matrixWorld);

    // Normalize the electric field vector
    const eField = new THREE.Vector3(Ex, Ey, Ez).normalize();

    // Transform the electric field direction to world space (rotation only)
    const worldEField = eField.clone();
    worldEField.applyQuaternion(material.group.quaternion);

    // Find a perpendicular vector using a more robust approach
    // First, find the smallest component of the field vector
    let perpendicular;
    if (
      Math.abs(worldEField.x) <= Math.abs(worldEField.y) &&
      Math.abs(worldEField.x) <= Math.abs(worldEField.z)
    ) {
      // x is smallest, use unit vector along x
      perpendicular = new THREE.Vector3(1, 0, 0);
    } else if (Math.abs(worldEField.y) <= Math.abs(worldEField.z)) {
      // y is smallest, use unit vector along y
      perpendicular = new THREE.Vector3(0, 1, 0);
    } else {
      // z is smallest, use unit vector along z
      perpendicular = new THREE.Vector3(0, 0, 1);
    }

    // Make perpendicular actually perpendicular to worldEField
    perpendicular.sub(
      worldEField.clone().multiplyScalar(perpendicular.dot(worldEField)),
    );

    // Normalize
    perpendicular.normalize();

    // Position camera along this perpendicular direction
    const distance = 10; // Distance from target
    const cameraPosition = new THREE.Vector3().addVectors(
      worldTarget,
      perpendicular.multiplyScalar(distance),
    );

    // Set camera position and orientation
    material.camera.position.copy(cameraPosition);
    material.camera.lookAt(worldTarget);
    // material.camera.up.copy(worldEField); // Align camera's up with electric field

    // Update orbit controls target
    material.controls.target.copy(worldTarget);
  }