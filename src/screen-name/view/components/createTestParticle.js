export default function createTestParticle(material) {
    const particleGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const particleMaterial = new THREE.MeshPhongMaterial({
      color: "blue",
      emissive: "blue",
    });
    material.testParticle = new THREE.Mesh(particleGeometry, particleMaterial);
    material.testParticle.position.set(0, 0, 0);
    material.group.add(material.testParticle);
    // Glow
    const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "blue",
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    material.group.add(glow);
    // Trail
    material.testTrail = [];
    material.createTestTrailMesh();
  }