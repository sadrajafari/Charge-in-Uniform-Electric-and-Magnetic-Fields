export default function createTestTrailMesh(material) {
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({
      color: "blue",
      linewidth: 0.5,
    });
    material.testTrailMesh = new THREE.Line(trailGeometry, trailMaterial);
    material.testTrailMesh.frustumCulled = false;
    material.group.add(material.testTrailMesh);
  }