export default function createCustomGrids(material) {
  // Calculate scaling factors
  const xScale =
    material.axisLength / (material.xRange.max - material.xRange.min);
  const yScale =
    material.axisLength / (material.yRange.max - material.yRange.min);
  const zScale =
    material.axisLength / (material.zRange.max - material.zRange.min);

  // Grid resolution (number of lines)
  const gridLines = 11;

  // (x, y) plane grid at z = 0
  const xyGroup = new THREE.Group();
  for (let i = 0; i < gridLines; i++) {
    const t = i / (gridLines - 1);
    const x = t * material.axisLength;
    const y = t * material.axisLength;
    // Vertical lines (constant x)
    xyGroup.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, 0, 0),
          new THREE.Vector3(x, material.axisLength, 0),
        ]),
        new THREE.LineBasicMaterial({
          color: "black",
          opacity: 0.3,
          transparent: true,
        }),
      ),
    );
    // Horizontal lines (constant y)
    xyGroup.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, y, 0),
          new THREE.Vector3(material.axisLength, y, 0),
        ]),
        new THREE.LineBasicMaterial({
          color: "black",
          opacity: 0.3,
          transparent: true,
        }),
      ),
    );
  }
  // material.scene.add(xyGroup);
  material.group.add(xyGroup);

  // (x, z) plane grid at y = 0
  const xzGroup = new THREE.Group();
  for (let i = 0; i < gridLines; i++) {
    const t = i / (gridLines - 1);
    const x = t * material.axisLength;
    const z = t * material.axisLength;
    // Vertical lines (constant x)
    xzGroup.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, 0, 0),
          new THREE.Vector3(x, 0, material.axisLength),
        ]),
        new THREE.LineBasicMaterial({
          color: "black",
          opacity: 0.3,
          transparent: true,
        }),
      ),
    );
    // Horizontal lines (constant z)
    xzGroup.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, z),
          new THREE.Vector3(material.axisLength, 0, z),
        ]),
        new THREE.LineBasicMaterial({
          color: "black",
          opacity: 0.3,
          transparent: true,
        }),
      ),
    );
  }
  // material.scene.add(xzGroup);
  material.group.add(xzGroup);

  // (y, z) plane grid at x = 0
  const yzGroup = new THREE.Group();
  for (let i = 0; i < gridLines; i++) {
    const t = i / (gridLines - 1);
    const y = t * material.axisLength;
    const z = t * material.axisLength;
    // Vertical lines (constant y)
    yzGroup.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, y, 0),
          new THREE.Vector3(0, y, material.axisLength),
        ]),
        new THREE.LineBasicMaterial({
          color: "black",
          opacity: 0.3,
          transparent: true,
        }),
      ),
    );
    // Horizontal lines (constant z)
    yzGroup.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, z),
          new THREE.Vector3(0, material.axisLength, z),
        ]),
        new THREE.LineBasicMaterial({
          color: "black",
          opacity: 0.3,
          transparent: true,
        }),
      ),
    );
  }
  // material.scene.add(yzGroup);
  material.group.add(yzGroup);
}
