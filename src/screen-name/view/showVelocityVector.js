export default function showVelocityVector(material, status) {
  material.visibleVelocityVector = status;

  // Handle test particle
  if (material.testVelocityArrow) {
    if (status) {
      material.group.add(material.testVelocityArrow);
    } else {
      material.group.remove(material.testVelocityArrow);
      material.testVelocityArrow = null;
    }
  }

  status
    ? material.group.add(material.velocityArrow)
    : material.group.remove(material.velocityArrow);
}
