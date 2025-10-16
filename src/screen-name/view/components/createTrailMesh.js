export default function createTrailMesh(material) {
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({
      color: "red",
      linewidth: 0.5,
    });
    material.trailMesh = new THREE.Line(trailGeometry, trailMaterial);
    material.trailMesh.frustumCulled = false; // Prevent disappearing when out of view
    material.group.add(material.trailMesh);
  }