export default function showVelocityVector(material, status) {
    status
      ? material.group.add(material.velocityArrow)
      : material.group.remove(material.velocityArrow);
  }