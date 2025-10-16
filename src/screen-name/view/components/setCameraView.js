// Add this method to your ThreeDGraph class
export default function setCameraView(material, viewType, x = null, y = null, z = null) {
  // Get current particle position if not provided
  const particleX = x !== null ? x : (material.particle ? material.particle.position.x : 0);
  const particleY = y !== null ? y : (material.particle ? material.particle.position.y : 0);
  const particleZ = z !== null ? z : (material.particle ? material.particle.position.z : 0);

  switch(viewType) {
    case 'normal':
    case 'default':
      // Reset to default camera position
      material.camera.position.set(14, 10, -15);
      material.controls.target.set(0, 0, 5);
      material.controls.update();
      break;
      
    case 'electric':
    case 'electricField':
      // Set camera orthogonal to electric field
      if (material.Ex !== undefined && material.Ey !== undefined && material.Ez !== undefined) {
        material.setCameraOrthogonalToElectricField(material.Ex, material.Ey, material.Ez, particleX, particleY, particleZ);
      } else {
        console.warn('Electric field values not set');
      }
      break;
      
    case 'magnetic':
    case 'magneticField':
      // Set camera orthogonal to magnetic field
      if (material.Bx !== undefined && material.By !== undefined && material.Bz !== undefined) {
        material.setCameraOrthogonalToMagneticField(material.Bx, material.By, material.Bz, particleX, particleY, particleZ);
      } else {
        console.warn('Magnetic field values not set');
      }
      break;
      
    default:
      console.warn(`Unknown view type: ${viewType}. Available views: 'normal', 'electric', 'magnetic'`);
      break;
  }
  
  // Force a render update
  material.renderer.render(material.scene, material.camera);
}