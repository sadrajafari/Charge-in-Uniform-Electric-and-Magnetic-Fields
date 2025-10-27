export default function updateMagneticForceVector(material, q, vx, vy, vz, Bx, By, Bz) {
  if (material.magneticForceField) {
    material.group.remove(material.magneticForceField);
    material.magneticForceField = null;
  }
  
  material.magneticForceVector(q, vx, vy, vz, Bx, By, Bz);
}
