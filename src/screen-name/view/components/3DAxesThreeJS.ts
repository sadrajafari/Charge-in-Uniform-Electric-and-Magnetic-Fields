// import * as THREE from "three";

// const Show3DAxesThreeJS = () => {
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(75, 700 / 600, 0.1, 1000);
//   scene.background = new THREE.Color("#ffffff");
//   camera.position.set(5, 5, 15);
//   const renderer = new THREE.WebGLRenderer({
//     antialias: true,
//     powerPreference: "high-performance",
//   });

//   //   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.setSize(700, 600);
//   document.body.appendChild(renderer.domElement);

//   //   @ts-ignore
//   const controls = new window.THREE.OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.25;

//   // Add a grid helper for perspective
//   const gridHelper = new THREE.GridHelper(12, 12);
//   // scene.add(gridHelper);

//   // Create custom axes with both positive and negative directions
//   function createCustomAxes(length: number) {
//     const axes = new THREE.Object3D();

//     // Materials for axes
//     const xAxisMaterial = new THREE.LineBasicMaterial({ color: "black" }); // Red for X
//     const yAxisMaterial = new THREE.LineBasicMaterial({ color: "black" }); // Green for Y
//     const zAxisMaterial = new THREE.LineBasicMaterial({ color: "black" }); // Blue for Z
//     // const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red for X
//     // const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Green for Y
//     // const zAxisMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Blue for Z

//     // Create positive and negative axes for each dimension
//     // X Axis
//     const xPosGeometry = new THREE.BufferGeometry().setFromPoints([
//       new THREE.Vector3(0, 0, 0),
//       new THREE.Vector3(length, 0, 0),
//     ]);
//     const xNegGeometry = new THREE.BufferGeometry().setFromPoints([
//       new THREE.Vector3(0, 0, 0),
//       new THREE.Vector3(-length, 0, 0),
//     ]);

//     // Y Axis
//     const yPosGeometry = new THREE.BufferGeometry().setFromPoints([
//       new THREE.Vector3(0, 0, 0),
//       new THREE.Vector3(0, length, 0),
//     ]);
//     const yNegGeometry = new THREE.BufferGeometry().setFromPoints([
//       new THREE.Vector3(0, 0, 0),
//       new THREE.Vector3(0, -length, 0),
//     ]);

//     // Z Axis
//     const zPosGeometry = new THREE.BufferGeometry().setFromPoints([
//       new THREE.Vector3(0, 0, 0),
//       new THREE.Vector3(0, 0, length),
//     ]);
//     const zNegGeometry = new THREE.BufferGeometry().setFromPoints([
//       new THREE.Vector3(0, 0, 0),
//       new THREE.Vector3(0, 0, -length),
//     ]);

//     // Create lines for each axis direction
//     const xPosLine = new THREE.Line(xPosGeometry, xAxisMaterial);
//     const xNegLine = new THREE.Line(xNegGeometry, xAxisMaterial);
//     const yPosLine = new THREE.Line(yPosGeometry, yAxisMaterial);
//     const yNegLine = new THREE.Line(yNegGeometry, yAxisMaterial);
//     const zPosLine = new THREE.Line(zPosGeometry, zAxisMaterial);
//     const zNegLine = new THREE.Line(zNegGeometry, zAxisMaterial);

//     // Add all lines to the axes object
//     axes.add(xPosLine, xNegLine, yPosLine, yNegLine, zPosLine, zNegLine);

//     return axes;
//   }

//   // Create and add custom axes
//   const customAxes = createCustomAxes(6);
//   // scene.add(customAxes);

//   // Add this after creating and adding custom axes
//   // function createAxisBox(size: number) {
//   //   // Create a wireframe box
//   //   const boxGeometry = new THREE.BoxGeometry(size, size, size);

//   //   // Remove the default faces/materials
//   //   const edges = new THREE.EdgesGeometry(boxGeometry);
//   //   const boxMaterial = new THREE.LineBasicMaterial({
//   //     // color: 0x888888,
//   //     color: "black",
//   //     opacity: 1,
//   //     transparent: true,
//   //   });

//   //   // Create the box
//   //   const box = new THREE.LineSegments(edges, boxMaterial);

//   //   // Center the box on the origin
//   //   box.position.set(0, 0, 0);

//   //   return box;
//   // }

//   // Create clipping planes for each side of the box
//   const clippingPlanes = [
//     new THREE.Plane(new THREE.Vector3(-1, 0, 0), 6), // +X
//     new THREE.Plane(new THREE.Vector3(1, 0, 0), 6), // -X
//     new THREE.Plane(new THREE.Vector3(0, -1, 0), 6), // +Y
//     new THREE.Plane(new THREE.Vector3(0, 1, 0), 6), // -Y
//     new THREE.Plane(new THREE.Vector3(0, 0, -1), 6), // +Z
//     new THREE.Plane(new THREE.Vector3(0, 0, 1), 6), // -Z
//   ];

//   function createAxisBox(size: number) {
//     // Create a group to hold everything
//     const boxGroup = new THREE.Group();

//     // Create the inner wireframe box (your existing box)
//     const innerBoxGeometry = new THREE.BoxGeometry(size, size, size);
//     const innerEdges = new THREE.EdgesGeometry(innerBoxGeometry);
//     const innerBoxMaterial = new THREE.LineBasicMaterial({
//       color: 0x888888,
//       opacity: 0.5,
//       transparent: true,
//     });

//     // Create the inner box
//     const innerBox = new THREE.LineSegments(innerEdges, innerBoxMaterial);
//     boxGroup.add(innerBox);

//     // Create faces for the outer box
//     const faces = [
//       // Front face
//       new THREE.PlaneGeometry(size, size),
//       // Back face
//       new THREE.PlaneGeometry(size, size),
//       // Top face
//       new THREE.PlaneGeometry(size, size),
//       // Bottom face
//       new THREE.PlaneGeometry(size, size),
//       // Right face
//       new THREE.PlaneGeometry(size, size),
//       // Left face
//       new THREE.PlaneGeometry(size, size),
//     ];

//     const faceMaterial = new THREE.MeshBasicMaterial({
//       // color: 0xcccccc,
//       // color: "black",
//       opacity: 0.1,
//       transparent: true,
//       side: THREE.DoubleSide,
//       depthWrite: false,
//       clippingPlanes: clippingPlanes,
//     });

//     // Position and add each face
//     const halfSize = size / 2;

//     // Front face
//     const frontFace = new THREE.Mesh(faces[0], faceMaterial);
//     frontFace.position.set(0, 0, halfSize);
//     boxGroup.add(frontFace);

//     // Back face
//     const backFace = new THREE.Mesh(faces[1], faceMaterial);
//     backFace.position.set(0, 0, -halfSize);
//     boxGroup.add(backFace);

//     // Top face
//     const topFace = new THREE.Mesh(faces[2], faceMaterial);
//     topFace.rotation.x = Math.PI / 2;
//     topFace.position.set(0, halfSize, 0);
//     boxGroup.add(topFace);

//     // Bottom face
//     const bottomFace = new THREE.Mesh(faces[3], faceMaterial);
//     bottomFace.rotation.x = Math.PI / 2;
//     bottomFace.position.set(0, -halfSize, 0);
//     boxGroup.add(bottomFace);

//     // Right face
//     const rightFace = new THREE.Mesh(faces[4], faceMaterial);
//     rightFace.rotation.y = Math.PI / 2;
//     rightFace.position.set(halfSize, 0, 0);
//     boxGroup.add(rightFace);

//     // Left face
//     const leftFace = new THREE.Mesh(faces[5], faceMaterial);
//     leftFace.rotation.y = Math.PI / 2;
//     leftFace.position.set(-halfSize, 0, 0);
//     boxGroup.add(leftFace);

//     return boxGroup;
//   }

//   // Create and add the axis box (same size as your axes length)
//   const axisBox = createAxisBox(12); // 12 units (6 in each direction)

//   // scene.add(axisBox);

//   //

//   renderer.localClippingEnabled = true;

//   // Define box size - half the total box size
//   const boxSize = 6;

//   function createMagneticFieldArrows(rowCount, spacing) {
//     // Create a group to hold all arrows
//     const arrowsGroup = new THREE.Group();

//     // Create three rows of arrows along different planes

//     // Row 1: Horizontal row along X-axis at y=0, z=0
//     for (let x = -rowCount / 2; x <= rowCount / 2; x++) {
//       // Skip the center if desired
//       if (x === 0) continue;

//       // Create arrow at this position
//       const arrowPosition = new THREE.Vector3(
//         x * spacing,
//         0, // y = 0 (center)
//         0, // z = 0 (center)
//       );

//       // Create a smaller arrow
//       const arrow = createMagneticFieldArrow(1.0);

//       // Position the arrow
//       arrow.position.copy(arrowPosition);

//       // Remove the label
//       const label = arrow.children.find(
//         (child) => child instanceof THREE.Sprite,
//       );
//       if (label) arrow.remove(label);

//       // Add to the group
//       arrowsGroup.add(arrow);
//     }

//     // Row 2: Horizontal row along Z-axis at x=0, y=0
//     for (let z = -rowCount / 2; z <= rowCount / 2; z++) {
//       // Skip the center if desired
//       if (z === 0) continue;

//       const arrowPosition = new THREE.Vector3(
//         0, // x = 0 (center)
//         0, // y = 0 (center)
//         z * spacing,
//       );

//       const arrow = createMagneticFieldArrow(1.0);
//       arrow.position.copy(arrowPosition);

//       const label = arrow.children.find(
//         (child) => child instanceof THREE.Sprite,
//       );
//       if (label) arrow.remove(label);

//       arrowsGroup.add(arrow);
//     }

//     // Row 3: Vertical row along Y-axis at x=0, z=0
//     for (let y = -rowCount / 2; y <= rowCount / 2; y++) {
//       // Skip the center if desired
//       if (y === 0) continue;

//       const arrowPosition = new THREE.Vector3(
//         0, // x = 0 (center)
//         y * spacing,
//         0, // z = 0 (center)
//       );

//       const arrow = createMagneticFieldArrow(1.0);
//       arrow.position.copy(arrowPosition);

//       const label = arrow.children.find(
//         (child) => child instanceof THREE.Sprite,
//       );
//       if (label) arrow.remove(label);

//       arrowsGroup.add(arrow);
//     }

//     return arrowsGroup;
//   }

//   // Modify your existing createMagneticFieldArrow to accept a size parameter
//   function createMagneticFieldArrow(size = 2) {
//     // Create a group to hold the arrow and label
//     const arrowGroup = new THREE.Group();

//     // Arrow dimensions - scaled by size parameter
//     const arrowLength = size;
//     const shaftRadius = 0.05 * (size / 2);
//     const headRadius = 0.15 * (size / 2);
//     const headLength = 0.4 * (size / 2);

//     // Create the arrow shaft
//     const shaftGeometry = new THREE.CylinderGeometry(
//       shaftRadius,
//       shaftRadius,
//       arrowLength - headLength,
//       12,
//     );
//     // Move shaft so its base is at the origin
//     shaftGeometry.translate(0, (arrowLength - headLength) / 2, 0);

//     // Create the arrow head
//     const headGeometry = new THREE.ConeGeometry(headRadius, headLength, 12);
//     // Position the head at the end of the shaft
//     headGeometry.translate(0, arrowLength - headLength / 2, 0);

//     // Create materials - blue for magnetic field
//     const arrowMaterial = new THREE.MeshStandardMaterial({
//       color: 0x0000ff, // Blue
//       metalness: 0.3,
//       roughness: 0.7,
//       clippingPlanes: clippingPlanes,
//     });

//     // Create meshes
//     const shaftMesh = new THREE.Mesh(shaftGeometry, arrowMaterial);
//     const headMesh = new THREE.Mesh(headGeometry, arrowMaterial);

//     // Add to arrow group
//     arrowGroup.add(shaftMesh);
//     arrowGroup.add(headMesh);

//     // Only add label for the main arrow
//     if (size === 2) {
//       // Create a 'B' label for the arrow
//       const labelCanvas = document.createElement("canvas");
//       const context = labelCanvas.getContext("2d");
//       labelCanvas.width = 128;
//       labelCanvas.height = 64;

//       if (context) {
//         context.fillStyle = "rgba(255, 255, 255, 0)";
//         context.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
//         context.font = "bold 48px Arial";
//         context.fillStyle = "#0000ff"; // Blue
//         context.textAlign = "center";
//         context.textBaseline = "middle";
//         context.fillText("B", labelCanvas.width / 2, labelCanvas.height / 2);
//       }

//       const texture = new THREE.Texture(labelCanvas);
//       texture.needsUpdate = true;
//       const spriteMaterial = new THREE.SpriteMaterial({
//         map: texture,
//         transparent: true,
//       });

//       const labelSprite = new THREE.Sprite(spriteMaterial);
//       // Position the label near the middle of the arrow
//       labelSprite.position.set(0.5, arrowLength / 2 + 0.3, 0);
//       labelSprite.scale.set(0.8, 0.4, 1);

//       arrowGroup.add(labelSprite);
//     }

//     // Start with the arrow pointing in the z-direction
//     arrowGroup.rotation.x = -Math.PI / 2; // Point along z-axis

//     return arrowGroup;
//   }

//   // Add the main magnetic field arrow (larger, with label)
//   const magneticFieldArrow = createMagneticFieldArrow(0);
//   magneticFieldArrow.position.set(-4, 4, 0); // Position in top-left corner

//   // Add a grid of smaller arrows
//   const fieldArrowsGrid = createMagneticFieldArrows(3, 3); // 3×3×3 grid with spacing of 4 units

//   // Add this function to show/hide arrows based on direction magnitude
//   function updateArrowsVisibility(arrows, direction, isMainArrow = false) {
//     // Check if direction is zero or very close to zero
//     const isZeroDirection =
//       Math.abs(direction.x) < 0.00001 &&
//       Math.abs(direction.y) < 0.00001 &&
//       Math.abs(direction.z) < 0.00001;

//     // Hide the main arrow if direction is zero
//     if (isMainArrow) {
//       arrows.visible = !isZeroDirection;
//     }
//     // For arrow groups, hide all children
//     else if (arrows.children) {
//       arrows.children.forEach((arrow) => {
//         arrow.visible = !isZeroDirection;
//       });
//     }
//   }

//   // Modify your updateMagneticField function
//   const updateMagneticField = (direction) => {
//     // Normalize the direction vector only if it's not zero
//     const dir = new THREE.Vector3(direction.x, direction.y, direction.z);
//     const magnitude = dir.length();

//     if (magnitude > 0.00001) {
//       dir.normalize();

//       // Update rotation for all arrows
//       updateArrowDirection(magneticFieldArrow, dir);
//       fieldArrowsGrid.children.forEach((arrow) => {
//         updateArrowDirection(arrow, dir);
//       });
//     }

//     // Update visibility based on direction magnitude
//     updateArrowsVisibility(magneticFieldArrow, direction, true);
//     updateArrowsVisibility(fieldArrowsGrid, direction);
//   };

//   // Helper function to update an individual arrow's direction
//   function updateArrowDirection(arrow, direction) {
//     // Reset rotation
//     arrow.rotation.set(0, 0, 0);

//     // Default arrow points along y-axis
//     if (Math.abs(direction.y) > 0.99999) {
//       // Already pointing in the right direction if dir is (0,1,0)
//       if (direction.y < 0) {
//         arrow.rotation.x = Math.PI; // Flip if dir is (0,-1,0)
//       }
//     } else {
//       // For any other direction, use quaternion rotation
//       const up = new THREE.Vector3(0, 1, 0);
//       const quaternion = new THREE.Quaternion();
//       quaternion.setFromUnitVectors(up, direction);
//       arrow.setRotationFromQuaternion(quaternion);
//     }
//   }

//   // Add this function similar to your magnetic field arrow function
//   function createElectricFieldArrow(size = 2) {
//     // Create a group to hold the arrow and label
//     const arrowGroup = new THREE.Group();

//     // Arrow dimensions - scaled by size parameter
//     const arrowLength = size;
//     const shaftRadius = 0.05 * (size / 2);
//     const headRadius = 0.15 * (size / 2);
//     const headLength = 0.4 * (size / 2);

//     // Create the arrow shaft
//     const shaftGeometry = new THREE.CylinderGeometry(
//       shaftRadius,
//       shaftRadius,
//       arrowLength - headLength,
//       12,
//     );
//     // Move shaft so its base is at the origin
//     shaftGeometry.translate(0, (arrowLength - headLength) / 2, 0);

//     // Create the arrow head
//     const headGeometry = new THREE.ConeGeometry(headRadius, headLength, 12);
//     // Position the head at the end of the shaft
//     headGeometry.translate(0, arrowLength - headLength / 2, 0);

//     // Create materials - RED for electric field
//     const arrowMaterial = new THREE.MeshStandardMaterial({
//       color: 0xff0000, // Red
//       metalness: 0.3,
//       roughness: 0.7,
//       clippingPlanes: clippingPlanes,
//     });

//     // Create meshes
//     const shaftMesh = new THREE.Mesh(shaftGeometry, arrowMaterial);
//     const headMesh = new THREE.Mesh(headGeometry, arrowMaterial);

//     // Add to arrow group
//     arrowGroup.add(shaftMesh);
//     arrowGroup.add(headMesh);

//     // Only add label for the main arrow
//     if (size === 2) {
//       // Create an 'E' label for the arrow
//       const labelCanvas = document.createElement("canvas");
//       const context = labelCanvas.getContext("2d");
//       labelCanvas.width = 128;
//       labelCanvas.height = 64;

//       if (context) {
//         context.fillStyle = "rgba(255, 255, 255, 0)";
//         context.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
//         context.font = "bold 48px Arial";
//         context.fillStyle = "#ff0000"; // Red
//         context.textAlign = "center";
//         context.textBaseline = "middle";
//         context.fillText("E", labelCanvas.width / 2, labelCanvas.height / 2);
//       }

//       const texture = new THREE.Texture(labelCanvas);
//       texture.needsUpdate = true;
//       const spriteMaterial = new THREE.SpriteMaterial({
//         map: texture,
//         transparent: true,
//       });

//       const labelSprite = new THREE.Sprite(spriteMaterial);
//       // Position the label near the middle of the arrow
//       labelSprite.position.set(0.5, arrowLength / 2 + 0.3, 0);
//       labelSprite.scale.set(0.8, 0.4, 1);

//       arrowGroup.add(labelSprite);
//     }

//     // Start with the arrow pointing in the z-direction
//     arrowGroup.rotation.x = -Math.PI / 2; // Point along z-axis

//     return arrowGroup;
//   }

//   // Function to create a grid of electric field arrows
//   function createElectricFieldArrows(rowCount, spacing) {
//     // Create a group to hold all arrows
//     const arrowsGroup = new THREE.Group();

//     // Create three rows of arrows along different planes
//     // Row 1: Horizontal row along X-axis at y=0, z=0
//     for (let x = -rowCount / 2; x <= rowCount / 2; x++) {
//       // Skip the center if desired
//       if (x === 0) continue;

//       // Create arrow at this position
//       const arrowPosition = new THREE.Vector3(
//         x * spacing,
//         0, // y = 0 (center)
//         0, // z = 0 (center)
//       );

//       // Create a smaller arrow
//       const arrow = createElectricFieldArrow(1.0);

//       // Position the arrow
//       arrow.position.copy(arrowPosition);

//       // Remove the label
//       const label = arrow.children.find(
//         (child) => child instanceof THREE.Sprite,
//       );
//       if (label) arrow.remove(label);

//       // Add to the group
//       arrowsGroup.add(arrow);
//     }

//     // Row 2: Horizontal row along Z-axis at x=0, y=0
//     for (let z = -rowCount / 2; z <= rowCount / 2; z++) {
//       // Skip the center if desired
//       if (z === 0) continue;

//       const arrowPosition = new THREE.Vector3(
//         0, // x = 0 (center)
//         0, // y = 0 (center)
//         z * spacing,
//       );

//       const arrow = createElectricFieldArrow(1.0);
//       arrow.position.copy(arrowPosition);

//       const label = arrow.children.find(
//         (child) => child instanceof THREE.Sprite,
//       );
//       if (label) arrow.remove(label);

//       arrowsGroup.add(arrow);
//     }

//     // Row 3: Vertical row along Y-axis at x=0, z=0
//     for (let y = -rowCount / 2; y <= rowCount / 2; y++) {
//       // Skip the center if desired
//       if (y === 0) continue;

//       const arrowPosition = new THREE.Vector3(
//         0, // x = 0 (center)
//         y * spacing,
//         0, // z = 0 (center)
//       );

//       const arrow = createElectricFieldArrow(1.0);
//       arrow.position.copy(arrowPosition);

//       const label = arrow.children.find(
//         (child) => child instanceof THREE.Sprite,
//       );
//       if (label) arrow.remove(label);

//       arrowsGroup.add(arrow);
//     }

//     return arrowsGroup;
//   }

//   // Add these lines after you create your magnetic field arrows
//   // Add the main electric field arrow (larger, with label)
//   const electricFieldArrow = createElectricFieldArrow(0);
//   electricFieldArrow.position.set(4, 4, 0); // Position in top-right corner

//   // Add a grid of smaller electric field arrows
//   const electricFieldArrowsGrid = createElectricFieldArrows(3, 3);

//   // Similarly modify updateElectricField function
//   const updateElectricField = (direction) => {
//     // Normalize the direction vector only if it's not zero
//     const dir = new THREE.Vector3(direction.x, direction.y, direction.z);
//     const magnitude = dir.length();

//     if (magnitude > 0.00001) {
//       dir.normalize();

//       // Update rotation for all arrows
//       updateArrowDirection(electricFieldArrow, dir);
//       electricFieldArrowsGrid.children.forEach((arrow) => {
//         updateArrowDirection(arrow, dir);
//       });
//     }

//     // Update visibility based on direction magnitude
//     updateArrowsVisibility(electricFieldArrow, direction, true);
//     updateArrowsVisibility(electricFieldArrowsGrid, direction);
//   };

//   magneticFieldArrow.visible = false;
//   fieldArrowsGrid.children.forEach((arrow) => (arrow.visible = false));
//   electricFieldArrow.visible = false;
//   electricFieldArrowsGrid.children.forEach((arrow) => (arrow.visible = false));
//   // Add the arrows to your scene

//   //

//   // ...existing code...

//   // Add some lighting
//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//   scene.add(ambientLight);

//   const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//   directionalLight.position.set(10, 10, 10);
//   scene.add(directionalLight);

//   const particleMaterial = new THREE.MeshBasicMaterial({
//     color: "red",
//     clippingPlanes: clippingPlanes,
//   });

//   const particle = new THREE.Mesh(
//     new THREE.SphereGeometry(0.1, 16, 16),
//     particleMaterial,
//   );
//   // scene.add(particle);
//   particle.position.set(0, 0, 0);

//   // Setup for the trail line
//   const MAX_TRAIL_POINTS = 100000;
//   const trailPositions = [];
//   for (let i = 0; i < MAX_TRAIL_POINTS; i++) {
//     trailPositions.push(new THREE.Vector3(0, 0, 0));
//   }

//   // Create a line geometry with initial positions
//   const trailGeometry = new THREE.BufferGeometry().setFromPoints(
//     trailPositions,
//   );

//   // Create a line material
//   const trailMaterial = new THREE.LineBasicMaterial({
//     color: 0xff6666,
//     linewidth: 50,
//     opacity: 1,
//     transparent: true,
//     clippingPlanes: clippingPlanes,
//   });

//   // Create the line
//   const trailLine = new THREE.Line(trailGeometry, trailMaterial);

//   // scene.add(trailLine);

//   // Your existing setup code...

//   // Add this function after createCustomAxes
//   function createAxisLabels(length) {
//     const labelGroup = new THREE.Group();
//     const labelSize = 0.3;

//     // Create text loader
//     const loader = new THREE.FontLoader();

//     // We'll use a simpler approach with sprites since loading fonts can be complex
//     function createTextSprite(text, position, color = 0xffffff) {
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");
//       canvas.width = 128;
//       canvas.height = 64;

//       // Draw text on canvas
//       if (context) {
//         context.fillStyle = "rgba(255, 255, 255, 0)";
//         context.fillRect(0, 0, canvas.width, canvas.height);
//         context.font = "40px Arial";
//         context.fillStyle = "#" + new THREE.Color(color).getHexString();
//         context.textAlign = "center";
//         context.textBaseline = "middle";
//         context.fillText(text, canvas.width / 2, canvas.height / 2);
//       }

//       // Create sprite from canvas
//       const texture = new THREE.Texture(canvas);
//       texture.needsUpdate = true;
//       const spriteMaterial = new THREE.SpriteMaterial({
//         map: texture,
//         transparent: true,
//       });
//       const sprite = new THREE.Sprite(spriteMaterial);
//       sprite.position.copy(position);
//       sprite.scale.set(labelSize * 4, labelSize * 2, 1);

//       return sprite;
//     }

//     // X-axis labels
//     for (let i = -length; i <= length; i += 2) {
//       if (i !== 0) {
//         // Skip zero
//         const label = createTextSprite(
//           i.toString(),
//           new THREE.Vector3(i, -0.3, 0),
//           0xff0000,
//         );
//         labelGroup.add(label);
//       }
//     }

//     // Y-axis labels
//     for (let i = -length; i <= length; i += 2) {
//       if (i !== 0) {
//         // Skip zero
//         const label = createTextSprite(
//           i.toString(),
//           new THREE.Vector3(-0.3, i, 0),
//           0x00ff00,
//         );
//         labelGroup.add(label);
//       }
//     }

//     // Z-axis labels
//     for (let i = -length; i <= length; i += 2) {
//       if (i !== 0) {
//         // Skip zero
//         const label = createTextSprite(
//           i.toString(),
//           new THREE.Vector3(0, -0.3, i),
//           0x0000ff,
//         );
//         labelGroup.add(label);
//       }
//     }

//     // Add origin label
//     const originLabel = createTextSprite(
//       "0",
//       new THREE.Vector3(0, -0.3, -0.3),
//       0xffffff,
//     );
//     labelGroup.add(originLabel);

//     // Add axis name labels
//     const xAxisLabel = createTextSprite(
//       "X",
//       new THREE.Vector3(length + 0.5, 0, 0),
//       0xff0000,
//     );
//     const yAxisLabel = createTextSprite(
//       "Y",
//       new THREE.Vector3(0, length + 0.5, 0),
//       0x00ff00,
//     );
//     const zAxisLabel = createTextSprite(
//       "Z",
//       new THREE.Vector3(0, 0, length + 0.5),
//       0x0000ff,
//     );

//     labelGroup.add(xAxisLabel);
//     labelGroup.add(yAxisLabel);
//     labelGroup.add(zAxisLabel);

//     return labelGroup;
//   }

//   // Create and add axis labels (use the same length as your axes)
//   const axisLabels = createAxisLabels(6);

//   // Add to your scene group

//   const sceneGroup = new THREE.Group();
//   scene.add(sceneGroup);
//   // sceneGroup.add(scene);
//   // sceneGroup.rotation.z = Math.PI / 2; // Rotate 90 degrees around Z axis

//   sceneGroup.add(gridHelper);
//   gridHelper.rotation.x = Math.PI / 2; // Rotate grid to lie in XZ plane
//   sceneGroup.add(customAxes);
//   sceneGroup.add(axisBox);
//   sceneGroup.add(axisLabels);
//   sceneGroup.add(particle);
//   sceneGroup.add(trailLine);
//   sceneGroup.rotation.x = (3 * Math.PI) / 2; // Rotate 90 degrees around Y axis

//   // Track the number of positions actually used
//   let trailPositionCount = 0;

//   const particleUpdate = (x: number, y: number, z: number) => {
//     particle.position.x = x;
//     particle.position.y = y;
//     particle.position.z = z;

//     // Add new position to trail
//     if (trailPositionCount < MAX_TRAIL_POINTS) {
//       trailPositions[trailPositionCount].set(x, y, z);
//       trailPositionCount++;
//     } else {
//       // Shift all positions back by one
//       for (let i = 0; i < MAX_TRAIL_POINTS - 1; i++) {
//         trailPositions[i].copy(trailPositions[i + 1]);
//       }
//       // Add new position at the end
//       trailPositions[MAX_TRAIL_POINTS - 1].set(x, y, z);
//     }

//     // Update the line geometry
//     trailGeometry.setFromPoints(trailPositions.slice(0, trailPositionCount));

//     // Mark the geometry as needing an update
//     trailGeometry.attributes.position.needsUpdate = true;
//   };

//   // Reset Trail

//   const resetTrail = () => {
//     // Reset trail position count
//     trailPositionCount = 0;

//     // Reset all trail positions to origin (or wherever your particle starts)
//     for (let i = 0; i < MAX_TRAIL_POINTS; i++) {
//       trailPositions[i].set(0, 0, 0);
//     }

//     // Reset the particle position
//     particle.position.set(0, 0, 0);

//     // Add the arrow to your scene group
//     sceneGroup.add(magneticFieldArrow);
//     // Update the geometry with empty trail
//     trailGeometry.setFromPoints(trailPositions.slice(0, trailPositionCount));
//     trailGeometry.attributes.position.needsUpdate = true;
//   };

//   sceneGroup.add(magneticFieldArrow);
//   sceneGroup.add(fieldArrowsGrid);
//   sceneGroup.add(electricFieldArrow);
//   sceneGroup.add(electricFieldArrowsGrid);

//   // Animation loop
//   function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     // updateCyclotronParticle();
//     // particleUpdate();
//     renderer.render(scene, camera);
//   }

//   animate();

//   return {
//     domElement: renderer.domElement,
//     updateParticlePosition: particleUpdate,
//     resetTrail: resetTrail,
//     updateMagneticField: updateMagneticField,
//     updateElectricField: updateElectricField,
//   };
// };

// export default Show3DAxesThreeJS;


// import { createVisualization, ThreeJSVisualization } from './3dGraph';

// /**
//  * Main component that creates and returns the 3D visualization
//  */
// const Show3DAxesThreeJS = (): ThreeJSVisualization => {
//   // Create the visualization with default size
//   const visualization = createVisualization(700, 700);
  
//   // Return the visualization API
//   return visualization;
// };

// export default Show3DAxesThreeJS;


import { createVisualization, ThreeJSVisualization } from './3dGraph';
import { FieldDisplayMode } from './3dGraph/FieldArrows';

/**
 * Main component that creates and returns the 3D visualization
 */
const Show3DAxesThreeJS = (): ThreeJSVisualization => {
  // Create the visualization with default size
  const visualization = createVisualization(700, 700);
  
  // Return the visualization API
  return visualization;
};

// Also export the display mode enum for use in SimScreenView
export { FieldDisplayMode };
export default Show3DAxesThreeJS;