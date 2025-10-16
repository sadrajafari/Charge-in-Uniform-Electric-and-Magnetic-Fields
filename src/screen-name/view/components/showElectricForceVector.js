export default function showElectricForceVector(material, status) {
    status
      ? material.group.add(material.electricForceField)
      : material.group.remove(material.electricForceField);
  }