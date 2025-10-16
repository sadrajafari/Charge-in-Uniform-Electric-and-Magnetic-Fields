export default function createParticle(material) {
    // Create the main particle
    const particleGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const particleMaterial = new THREE.MeshPhongMaterial({
      color: "red",
      emissive: "red",
      // emissiveIntensity: 0.3,
    });
    material.particle = new THREE.Mesh(particleGeometry, particleMaterial);
    material.particle.position.set(0, 0, 0);
    // material.scene.add(material.particle);
    material.group.add(material.particle);

    // Create particle glow effect
    const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "red",
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    // material.particle.add(glow);
    material.group.add(glow);

    // Initialize trail
    material.trail = [];
    material.createTrailMesh();
  }