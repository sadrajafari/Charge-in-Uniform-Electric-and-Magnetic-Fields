export default function createAxisTicksAndNumbers(material) {
    // Calculate scaling factors to map ranges to visual length
    const xScale = material.axisLength / (material.xRange.max - material.xRange.min);
    const yScale = material.axisLength / (material.yRange.max - material.yRange.min);
    const zScale = material.axisLength / (material.zRange.max - material.zRange.min);

    // Show only 5 labels per axis (including min and max)
    const numLabels = 5;

    // X-axis ticks and numbers
    for (let i = 0; i < numLabels; i++) {
      const t = i / (numLabels - 1);
      const value = material.xRange.min + t * (material.xRange.max - material.xRange.min);
      const visualX = (value - material.xRange.min) * xScale;
      // Create tick mark
      const tickGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(visualX, -0.3, 0),
        new THREE.Vector3(visualX, 0.3, 0),
      ]);
      const tickMaterial = new THREE.LineBasicMaterial({
        color: 0xff4444,
        linewidth: 3,
      });
      const tick = new THREE.Line(tickGeometry, tickMaterial);
      // material.scene.add(tick);
      material.group.add(tick);
      // Create number label
      // material.createTextLabel(value.toFixed(2), visualX, -0.8, 0, "black", 0.8);
    }

    // Y-axis ticks and numbers
    for (let i = 0; i < numLabels; i++) {
      const t = i / (numLabels - 1);
      const value = material.yRange.min + t * (material.yRange.max - material.yRange.min);
      const visualY = (value - material.yRange.min) * yScale;
      const tickGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.3, visualY, 0),
        new THREE.Vector3(0.3, visualY, 0),
      ]);
      const tickMaterial = new THREE.LineBasicMaterial({
        color: 0x44ff44,
        linewidth: 3,
      });
      const tick = new THREE.Line(tickGeometry, tickMaterial);
      // material.scene.add(tick);
      material.group.add(tick);
      // material.createTextLabel(value.toFixed(2), -0.8, visualY, 0, "black", 0.8);
    }

    // Z-axis ticks and numbers
    for (let i = 0; i < numLabels; i++) {
      const t = i / (numLabels - 1);
      const value = material.zRange.min + t * (material.zRange.max - material.zRange.min);
      const visualZ = (value - material.zRange.min) * zScale;
      const tickGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.3, 0, visualZ),
        new THREE.Vector3(0.3, 0, visualZ),
      ]);
      const tickMaterial = new THREE.LineBasicMaterial({
        color: 0x4488ff,
        linewidth: 3,
      });
      const tick = new THREE.Line(tickGeometry, tickMaterial);
      // material.scene.add(tick);
      material.group.add(tick);
      // material.createTextLabel(value.toFixed(2), -0.8, 0, visualZ, "black", 0.8);
    }

    // Add connection point marker (where all axes meet)
    const originGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const originMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const origin = new THREE.Mesh(originGeometry, originMaterial);
    origin.position.set(0, 0, 0);
    // material.scene.add(origin);
    material.group.add(origin);

    // Add connection point label
    // material.createTextLabel("Connection Point", -1.5, -1.5, -1.5, 0xffffff, 0.8);
  }