export default function updateTrail(material) {
  // Add current particle position to trail
  material.trail.push(material.particle.position.clone());

  // Limit trail length
  if (material.trail.length > material.maxTrailLength) {
    material.trail.shift();
  }

  // Update trail geometry
  if (material.trail.length > 1) {
    const positions = [];
    material.trail.forEach((point) => {
      positions.push(point.x, point.y, point.z);
    });

    material.trailMesh.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    material.trailMesh.geometry.attributes.position.needsUpdate = true;
  }
}
