export default function showMagneticFieldOnParticleVector(material, status) {
  material.visibleMagneticFieldParticle = status;

  // Handle test particle
  if (material.testMagneticFieldOnParticleArrow) {
    if (status) {
      material.group.add(material.testMagneticFieldOnParticleArrow);
    } else {
      material.group.remove(material.testMagneticFieldOnParticleArrow);
      // material.testMagneticFieldOnParticleArrow = null;
    }
  }

  status
    ? material.group.add(material.magneticFieldOnParticleArrow)
    : material.group.remove(material.magneticFieldOnParticleArrow);
}
