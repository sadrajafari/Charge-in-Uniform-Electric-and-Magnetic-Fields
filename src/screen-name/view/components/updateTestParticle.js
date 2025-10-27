import velocityVectorArrow from "./velocityVectorArrow";
import electricForceVector from "./electricForceVector";
import magneticForceVector from "./magneticForceVector";
import magneticFieldOnParticle from "./magneticFieldOnParticle";

export default function updateTestParticle(material, x, y, z, vx, vy, vz) {
  if (!material.testParticle) return;
  // Clamp to axis ranges
  const xScale =
    material.axisLength / (material.xRange.max - material.xRange.min);
  const yScale =
    material.axisLength / (material.yRange.max - material.yRange.min);
  const zScale =
    material.axisLength / (material.zRange.max - material.zRange.min);
  const visualX = (x - material.xRange.min) * xScale;
  const visualY = (y - material.yRange.min) * yScale;
  const visualZ = (z - material.zRange.min) * zScale;
  material.testParticle.position.set(visualX, visualY, visualZ);
  // Trail
  if (!material.testTrail) material.testTrail = [];
  material.testTrail.push(material.testParticle.position.clone());
  if (material.testTrail.length > material.maxTrailLength) {
    material.testTrail.shift();
  }
  if (material.testTrail.length > 1 && material.testTrailMesh) {
    const positions = [];
    material.testTrail.forEach((point) => {
      positions.push(point.x, point.y, point.z);
    });
    material.testTrailMesh.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    material.testTrailMesh.geometry.attributes.position.needsUpdate = true;
  }
  if (material.visibleVelocityVector) {
    velocityVectorArrow(material, x, y, z, vx, vy, vz, "test");
  }

  if (material.showElectricForce) {
    electricForceVector(material, material.q, material.Ex, material.Ey, material.Ez, x, y, z, "test");
  }
  
  if (material.showMagneticForce) {
    magneticForceVector(material, material.q, vx, vy, vz, material.Bx, material.By, material.Bz, x, y, z, "test");
  }
  
  if (material.visibleMagneticFieldParticle) {
    magneticFieldOnParticle(material, x, y, z, material.Bx, material.By, material.Bz, "test");
  }
}
