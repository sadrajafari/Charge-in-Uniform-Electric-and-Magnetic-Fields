export default function createArrowHeads(material) {
    const arrowGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);

    // X-axis arrow at the end of the line
    const xArrow = new THREE.Mesh(
      arrowGeometry,
      new THREE.MeshBasicMaterial({ color: "black" }),
    );
    xArrow.position.set(material.axisLength, 0, 0);
    xArrow.rotateZ(-Math.PI / 2);
    // material.scene.add(xArrow);
    material.group.add(xArrow);

    // Y-axis arrow at the end of the line
    const yArrow = new THREE.Mesh(
      arrowGeometry,
      new THREE.MeshBasicMaterial({ color: "black" }),
    );
    yArrow.position.set(0, material.axisLength, 0);
    // material.scene.add(yArrow);
    material.group.add(yArrow);

    // Z-axis arrow at the end of the line
    const zArrow = new THREE.Mesh(
      arrowGeometry,
      new THREE.MeshBasicMaterial({ color: "black" }),
    );
    zArrow.position.set(0, 0, material.axisLength);
    zArrow.rotateX(Math.PI / 2);
    // material.scene.add(zArrow);
    material.group.add(zArrow);
  }