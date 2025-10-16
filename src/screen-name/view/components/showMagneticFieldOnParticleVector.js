export default function showMagneticFieldOnParticleVector(material, status) {
  status
    ? material.group.add(material.magneticFieldOnParticleArrow)
    : material.group.remove(material.magneticFieldOnParticleArrow);
}
