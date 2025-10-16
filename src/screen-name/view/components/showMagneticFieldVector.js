export default function showMagneticFieldVector(material, Bx = material.Bx, By = material.By, Bz = material.Bz) {
    // Remove previous arrow if it exists
    if (material.bFieldArrow) {
      material.group.remove(material.bFieldArrow);
      material.bFieldArrow = null;
    }
    // Only create arrow if at least one component is nonzero
    if (Bx === 0 && By === 0 && Bz === 0) return;

    // Calculate the center of the axes in visual coordinates
    const centerX = material.axisLength / 2;
    const centerY = material.axisLength / 2;
    const centerZ = material.axisLength / 2;

    // Create direction vector (normalize for ArrowHelper)
    const dir = new THREE.Vector3(Bx, By, Bz).normalize();

    // Set arrow length proportional to field magnitude
    // const length = Math.max(1, Math.sqrt(Bx * Bx + By * By + Bz * Bz) * 0.1);
    const length = 1;

    // Create the arrow
    material.bFieldArrow = new THREE.ArrowHelper(
      dir,
      new THREE.Vector3(centerX, centerY, centerZ),
      length,
      "purple",
      0.3,
      0.2,
    );
    material.bFieldArrow.visible = material.showMagneticField;
    material.group.add(material.bFieldArrow);
  }