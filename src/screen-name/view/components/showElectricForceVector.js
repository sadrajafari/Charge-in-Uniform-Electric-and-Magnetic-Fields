export default function showElectricForceVector(material, status) {
  material.showElectricForce = status;

  // Handle test particle
  if (material.testElectricForceField) {
    if (status) {
      if (material.electricForceField) {
        material.group.remove(material.electricForceField);
        material.electricForceField = null;
      }

      material.group.add(material.testElectricForceField);
    } else {
      material.group.remove(material.testElectricForceField);
      material.testElectricForceField = null; // ✅ DESTROY it so it won't be recreated
    }
  }
  status
    ? material.group.add(material.electricForceField)
    : material.group.remove(material.electricForceField);
}
