export default function showElectricForceVector(material, status) {
  material.showElectricForce = status;

  // Handle test particle
  if (material.testElectricForceField) {
    if (status) {
      // if (material.electricForceField) {
      //   material.group.remove(material.electricForceField);
      //   material.electricForceField = null;
      // }
      material.group.add(material.testElectricForceField);
    } else {
      // console.log("ADDING TEST ELECTRIC FORCE FIELD");
      
      material.group.remove(material.testElectricForceField);
      // material.testElectricForceField = null; // ✅ DESTROY it so it won't be recreated
    }
  }

  // if (!material.showReferenceElectricForce) {
  //   material.group.remove(material.electricForceField);
  //   material.electricForceField = null;
  // } 
  // console.log("SHOW REFERENCE ELECTRIC FORCE STATUS:", material.showReferenceElectricForce);
  if (status && material.showReferenceElectricForce) {
    material.group.add(material.electricForceField)
  } else{
    material.group.remove(material.electricForceField);
    // material.electricForceField = null;
  }
  // status
  //   ? material.group.add(material.electricForceField)
  //   : material.group.remove(material.electricForceField);
}
