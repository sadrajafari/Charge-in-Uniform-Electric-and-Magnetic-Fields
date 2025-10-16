export default function showMagneticForceVector(material, status) {
    status
      ? material.group.add(material.magneticForceField)
      : material.group.remove(material.magneticForceField);
  }