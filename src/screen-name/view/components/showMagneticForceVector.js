export default function showMagneticForceVector(material, status) {
  material.showMagneticForce = status;
  if (material.testMagneticForceField) {
    if (status) {
      material.group.add(material.testMagneticForceField);
    } else {
      material.group.remove(material.testMagneticForceField);
      material.testMagneticForceField = null; // ✅ DESTROY it so it won't be recreated
    }
  }

  status
    ? material.group.add(material.magneticForceField)
    : material.group.remove(material.magneticForceField);
}
