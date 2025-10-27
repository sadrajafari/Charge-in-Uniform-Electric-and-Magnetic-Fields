// export default function createCustomArrow(length, shaftRadius, headRadius, headLength, color, dashed = false) {
//   // Create a group to hold the arrow
//   const arrowGroup = new THREE.Group();

//   // 1. Create the LINE (shaft) using a cylinder
//   const shaftLength = length * 0.8; // 80% of total length is the shaft
//   const shaftGeometry = new THREE.CylinderGeometry(
//     shaftRadius,
//     shaftRadius,
//     shaftLength,
//     8,
//   );
//   const shaftMaterial = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
//   const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);

//   // Position shaft
//   shaft.position.set(0, shaftLength / 2, 0);

//   // 2. Create the ARROWHEAD (cone)
//   const headGeometry = new THREE.ConeGeometry(headRadius, headLength, 8);
//   const headMaterial = new THREE.MeshBasicMaterial({ color: color });
//   const head = new THREE.Mesh(headGeometry, headMaterial);

//   // Position arrowhead at the end of shaft
//   head.position.set(0, shaftLength + headLength / 2, 0);

//   // Add both to the arrow group
//   arrowGroup.add(shaft);
//   arrowGroup.add(head);

//   return arrowGroup;
// }



// function createDashTexture(color) {
//   const canvas = document.createElement('canvas');
//   canvas.width = 1;
//   canvas.height = 32; // Height controls dash frequency
//   const context = canvas.getContext('2d');
  
//   // Create vertical dash pattern
//   context.fillStyle = color;
//   context.fillRect(0, 0, 1, 24);    // Dash (top half)
//   context.fillStyle = 'transparent';
//   context.fillRect(0, 24, 1, 8);   // Gap (bottom half)
  
//   const texture = new THREE.CanvasTexture(canvas);
//   texture.wrapS = THREE.RepeatWrapping;
//   texture.wrapT = THREE.RepeatWrapping;
//   texture.repeat.set(1, 5); // Repeat vertically
  
//   return texture;
// }

// export default function createCustomArrow(length, shaftRadius, headRadius, headLength, color, dashed = false) {
//   // Create a group to hold the arrow
//   const arrowGroup = new THREE.Group();

//   // 1. Create the LINE (shaft) using a cylinder
//   const shaftLength = length * 0.8; // 80% of total length is the shaft
//   const shaftGeometry = new THREE.CylinderGeometry(
//     shaftRadius,
//     shaftRadius,
//     shaftLength,
//     8,
//   );

//   let shaftMaterial;
//   if (dashed) {
//     const dashTexture = createDashTexture(color);
//     shaftMaterial = new THREE.MeshBasicMaterial({ 
//       color: color,
//       map: dashTexture,
//       transparent: true,
//       alphaTest: 0.5 // Discard transparent pixels
//     });
//   } else {
//     shaftMaterial = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
//   }

//   const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
//   shaft.position.set(0, shaftLength / 2, 0);

//   // 2. Create the ARROWHEAD (cone)
//   const headGeometry = new THREE.ConeGeometry(headRadius, headLength, 8);
//   const headMaterial = new THREE.MeshBasicMaterial({ color: color });
//   const head = new THREE.Mesh(headGeometry, headMaterial);
//   head.position.set(0, shaftLength + headLength / 2, 0);

//   // Add both to the arrow group
//   arrowGroup.add(shaft);
//   arrowGroup.add(head);

//   return arrowGroup;
// }

export default function createCustomArrow(length, shaftRadius, headRadius, headLength, color, dashed = false) {
  // Create a group to hold the arrow
  const arrowGroup = new THREE.Group();

  const shaftLength = length * 0.8; // 80% of total length is the shaft

  if (dashed) {
    // Create multiple small cylinders for dashes using a for loop
    const dashLength = 0.15;     // Length of each dash
    const gapLength = 0.12;     // Gap between dashes
    const segmentLength = dashLength + gapLength;
    const numSegments = Math.floor(shaftLength / segmentLength);

    for (let i = 0; i < numSegments; i++) {
      // Create individual dash cylinder
      const dashGeometry = new THREE.CylinderGeometry(shaftRadius, shaftRadius, dashLength, 8);
      const dashMaterial = new THREE.MeshBasicMaterial({ color: color });
      const dash = new THREE.Mesh(dashGeometry, dashMaterial);
      
      // Position each dash along the shaft
      const yPos = (i * segmentLength) + (dashLength / 2);
      dash.position.set(0, yPos, 0);
      
      arrowGroup.add(dash);
    }
  } else {
    // Create solid cylinder shaft
    const shaftGeometry = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftLength, 8);
    const shaftMaterial = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.position.set(0, shaftLength / 2, 0);
    arrowGroup.add(shaft);
  }

  // 2. Create the ARROWHEAD (cone) - same for both
  const headGeometry = new THREE.ConeGeometry(headRadius, headLength, 8);
  const headMaterial = new THREE.MeshBasicMaterial({ color: color });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0, shaftLength, 0);
  arrowGroup.add(head);

  return arrowGroup;
}