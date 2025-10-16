export default function showElectricFieldVector(material, Ex = material.Ex, Ey = material.Ey, Ez = material.Ez) {
    // Remove previous arrow if it exists
    if (material.eFieldArrow) {
      material.group.remove(material.eFieldArrow);
      material.eFieldArrow = null;
    }
    // Only create arrow if at least one component is nonzero
    if (Ex === 0 && Ey === 0 && Ez === 0) return;

    // Calculate the center of the axes in visual coordinates
    const centerX = material.axisLength / 2;
    const centerY = material.axisLength / 2;
    const centerZ = material.axisLength / 2;

    // Create direction vector (normalize for ArrowHelper)
    const dir = new THREE.Vector3(Ex, Ey, Ez).normalize();

    // Set arrow length proportional to field magnitude
    const length = 1;

    // Create the arrow
    material.eFieldArrow = new THREE.ArrowHelper(
      dir,
      new THREE.Vector3(centerX, centerY, centerZ),
      length,
      0x0000ff, // color (blue)
      0.3, // headLength
      0.2, // headWidth
    );
    material.eFieldArrow.visible = material.showElectricField;
    material.group.add(material.eFieldArrow);
  }