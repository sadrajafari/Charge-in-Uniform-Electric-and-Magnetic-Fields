// import * as THREE from "three";
// import { updateArrowDirection, updateArrowsVisibility } from "./utils/updateArrowDirection";

// /**
//  * Base class for field arrows (electric or magnetic)
//  */
// export abstract class FieldArrows {
//   protected mainArrow: THREE.Group;
//   protected arrowsGrid: THREE.Group;
//   protected clippingPlanes: THREE.Plane[];
//   protected color: number;
//   protected label: string;

//   constructor(clippingPlanes: THREE.Plane[], color: number, label: string) {
//     this.clippingPlanes = clippingPlanes;
//     this.color = color;
//     this.label = label;

//     // Create main arrow and grid
//     this.mainArrow = this.createArrow(0);
//     this.arrowsGrid = this.createArrowsGrid(3, 3);

//     // Initially hide arrows
//     this.mainArrow.visible = false;
//     this.arrowsGrid.children.forEach((arrow) => (arrow.visible = false));
//   }

//   /**
//    * Creates a single arrow with optional label
//    */
//   protected createArrow(size: number = 2): THREE.Group {
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
//       12
//     );
//     // Move shaft so its base is at the origin
//     shaftGeometry.translate(0, (arrowLength - headLength) / 2, 0);

//     // Create the arrow head
//     const headGeometry = new THREE.ConeGeometry(headRadius, headLength, 12);
//     // Position the head at the end of the shaft
//     headGeometry.translate(0, arrowLength - headLength / 2, 0);

//     // Create material
//     const arrowMaterial = new THREE.MeshStandardMaterial({
//       color: this.color,
//       metalness: 0.3,
//       roughness: 0.7,
//       clippingPlanes: this.clippingPlanes,
//     });

//     // Create meshes
//     const shaftMesh = new THREE.Mesh(shaftGeometry, arrowMaterial);
//     const headMesh = new THREE.Mesh(headGeometry, arrowMaterial);

//     // Add to arrow group
//     arrowGroup.add(shaftMesh);
//     arrowGroup.add(headMesh);

//     // Only add label for the main arrow
//     if (size === 2) {
//       const labelCanvas = document.createElement("canvas");
//       const context = labelCanvas.getContext("2d");
//       labelCanvas.width = 128;
//       labelCanvas.height = 64;

//       if (context) {
//         context.fillStyle = "rgba(255, 255, 255, 0)";
//         context.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
//         context.font = "bold 48px Arial";
//         context.fillStyle = "#" + new THREE.Color(this.color).getHexString();
//         context.textAlign = "center";
//         context.textBaseline = "middle";
//         context.fillText(this.label, labelCanvas.width / 2, labelCanvas.height / 2);
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

//   /**
//    * Creates a grid of arrows along the main axes
//    */
//   protected createArrowsGrid(rowCount: number, spacing: number): THREE.Group {
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
//         0,
//         0
//       );

//       // Create a smaller arrow
//       const arrow = this.createArrow(1.0);

//       // Position the arrow
//       arrow.position.copy(arrowPosition);

//       // Remove the label
//       const label = arrow.children.find(
//         (child) => child instanceof THREE.Sprite
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
//         0,
//         0,
//         z * spacing
//       );

//       const arrow = this.createArrow(1.0);
//       arrow.position.copy(arrowPosition);

//       const label = arrow.children.find(
//         (child) => child instanceof THREE.Sprite
//       );
//       if (label) arrow.remove(label);

//       arrowsGroup.add(arrow);
//     }

//     // Row 3: Vertical row along Y-axis at x=0, z=0
//     for (let y = -rowCount / 2; y <= rowCount / 2; y++) {
//       // Skip the center if desired
//       if (y === 0) continue;

//       const arrowPosition = new THREE.Vector3(
//         0,
//         y * spacing,
//         0
//       );

//       const arrow = this.createArrow(1.0);
//       arrow.position.copy(arrowPosition);

//       const label = arrow.children.find(
//         (child) => child instanceof THREE.Sprite
//       );
//       if (label) arrow.remove(label);

//       arrowsGroup.add(arrow);
//     }

//     return arrowsGroup;
//   }

//   /**
//    * Updates the direction of all field arrows
//    */
//   updateDirection(direction: { x: number; y: number; z: number }): void {
//     // Normalize the direction vector only if it's not zero
//     const dir = new THREE.Vector3(direction.x, direction.y, direction.z);
//     const magnitude = dir.length();

//     if (magnitude > 0.00001) {
//       dir.normalize();

//       // Update rotation for all arrows
//       updateArrowDirection(this.mainArrow, dir);
//       this.arrowsGrid.children.forEach((arrow) => {
//         updateArrowDirection(arrow, dir);
//       });
//     }

//     // Update visibility based on direction magnitude
//     updateArrowsVisibility(this.mainArrow, direction, true);
//     updateArrowsVisibility(this.arrowsGrid, direction);
//   }

//   /**
//    * Returns the field arrow objects to add to the scene
//    */
//   getObjects(): THREE.Object3D[] {
//     return [this.mainArrow, this.arrowsGrid];
//   }

//   /**
//    * Sets the position of the main field arrow
//    */
//   positionMainArrow(position: THREE.Vector3): void {
//     this.mainArrow.position.copy(position);
//   }
// }



import * as THREE from "three";
import { updateArrowDirection, updateArrowsVisibility } from "./utils/updateArrowDirection";

// Display mode enum
export enum FieldDisplayMode {
  GRID,    // Show arrows distributed in a grid
  SINGLE,  // Show a single arrow at origin
  HIDDEN   // Don't show any arrows
}

/**
 * Base class for field arrows (electric or magnetic)
 */
export abstract class FieldArrows {
  protected mainArrow: THREE.Group;
  protected arrowsGrid: THREE.Group;
  protected originArrow: THREE.Group; // NEW: Arrow at origin
  protected clippingPlanes: THREE.Plane[];
  protected color: number;
  protected label: string;
  protected currentMode: FieldDisplayMode = FieldDisplayMode.HIDDEN;

  constructor(clippingPlanes: THREE.Plane[], color: number, label: string) {
    this.clippingPlanes = clippingPlanes;
    this.color = color;
    this.label = label;

    // Create all arrow visualizations
    this.mainArrow = this.createArrow(2);
    this.arrowsGrid = this.createArrowsGrid(3, 3);
    
    // NEW: Create an arrow at origin (0,0,0)
    this.originArrow = this.createArrow(2);
    this.originArrow.position.set(0, 0, 0);

    // Initially hide all arrows
    this.mainArrow.visible = false;
    this.arrowsGrid.children.forEach((arrow) => (arrow.visible = false));
    this.originArrow.visible = false;
  }

  /**
   * Set the display mode for the field
   */
  setDisplayMode(mode: FieldDisplayMode): void {
    this.currentMode = mode;
    
    // Hide all arrows first
    this.mainArrow.visible = false;
    this.arrowsGrid.children.forEach(arrow => arrow.visible = false);
    this.originArrow.visible = false;
    
    // Show appropriate arrows based on mode
    switch(mode) {
      case FieldDisplayMode.GRID:
        this.mainArrow.visible = true;
        this.arrowsGrid.children.forEach(arrow => arrow.visible = true);
        break;
        
      case FieldDisplayMode.SINGLE:
        this.originArrow.visible = true;
        break;
        
      case FieldDisplayMode.HIDDEN:
      default:
        // All arrows already hidden
        break;
    }
  }

  /**
   * Creates a single arrow with optional label
   */
  protected createArrow(size: number = 2): THREE.Group {
    // Create a group to hold the arrow and label
    const arrowGroup = new THREE.Group();

    // Arrow dimensions - scaled by size parameter
    const arrowLength = size;
    const shaftRadius = 0.05 * (size / 2);
    const headRadius = 0.15 * (size / 2);
    const headLength = 0.4 * (size / 2);

    // Create the arrow shaft
    const shaftGeometry = new THREE.CylinderGeometry(
      shaftRadius,
      shaftRadius,
      arrowLength - headLength,
      12
    );
    // Move shaft so its base is at the origin
    shaftGeometry.translate(0, (arrowLength - headLength) / 2, 0);

    // Create the arrow head
    const headGeometry = new THREE.ConeGeometry(headRadius, headLength, 12);
    // Position the head at the end of the shaft
    headGeometry.translate(0, arrowLength - headLength / 2, 0);

    // Create material
    const arrowMaterial = new THREE.MeshStandardMaterial({
      color: this.color,
      metalness: 0.3,
      roughness: 0.7,
      clippingPlanes: this.clippingPlanes,
    });

    // Create meshes
    const shaftMesh = new THREE.Mesh(shaftGeometry, arrowMaterial);
    const headMesh = new THREE.Mesh(headGeometry, arrowMaterial);

    // Add to arrow group
    arrowGroup.add(shaftMesh);
    arrowGroup.add(headMesh);

    // Only add label for the main arrow
    if (size === 2) {
      const labelCanvas = document.createElement("canvas");
      const context = labelCanvas.getContext("2d");
      labelCanvas.width = 128;
      labelCanvas.height = 64;

      if (context) {
        context.fillStyle = "rgba(255, 255, 255, 0)";
        context.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
        context.font = "bold 48px Arial";
        context.fillStyle = "#" + new THREE.Color(this.color).getHexString();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.label, labelCanvas.width / 2, labelCanvas.height / 2);
      }

      const texture = new THREE.Texture(labelCanvas);
      texture.needsUpdate = true;
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });

      const labelSprite = new THREE.Sprite(spriteMaterial);
      // Position the label near the middle of the arrow
      labelSprite.position.set(0.5, arrowLength / 2 + 0.3, 0);
      labelSprite.scale.set(0.8, 0.4, 1);

      arrowGroup.add(labelSprite);
    }

    // Start with the arrow pointing in the z-direction
    arrowGroup.rotation.x = -Math.PI / 2; // Point along z-axis

    return arrowGroup;
  }

  /**
   * Creates a grid of arrows along the main axes
   */
  protected createArrowsGrid(rowCount: number, spacing: number): THREE.Group {
    // Create a group to hold all arrows
    const arrowsGroup = new THREE.Group();

    // Create three rows of arrows along different planes
    // Row 1: Horizontal row along X-axis at y=0, z=0
    for (let x = -rowCount / 2; x <= rowCount / 2; x++) {
      // Skip the center if desired
      if (x === 0) continue;

      // Create arrow at this position
      const arrowPosition = new THREE.Vector3(
        x * spacing,
        0,
        0
      );

      // Create a smaller arrow
      const arrow = this.createArrow(1.0);

      // Position the arrow
      arrow.position.copy(arrowPosition);

      // Remove the label
      const label = arrow.children.find(
        (child) => child instanceof THREE.Sprite
      );
      if (label) arrow.remove(label);

      // Add to the group
      arrowsGroup.add(arrow);
    }

    // Row 2: Horizontal row along Z-axis at x=0, y=0
    for (let z = -rowCount / 2; z <= rowCount / 2; z++) {
      // Skip the center if desired
      if (z === 0) continue;

      const arrowPosition = new THREE.Vector3(
        0,
        0,
        z * spacing
      );

      const arrow = this.createArrow(1.0);
      arrow.position.copy(arrowPosition);

      const label = arrow.children.find(
        (child) => child instanceof THREE.Sprite
      );
      if (label) arrow.remove(label);

      arrowsGroup.add(arrow);
    }

    // Row 3: Vertical row along Y-axis at x=0, z=0
    for (let y = -rowCount / 2; y <= rowCount / 2; y++) {
      // Skip the center if desired
      if (y === 0) continue;

      const arrowPosition = new THREE.Vector3(
        0,
        y * spacing,
        0
      );

      const arrow = this.createArrow(1.0);
      arrow.position.copy(arrowPosition);

      const label = arrow.children.find(
        (child) => child instanceof THREE.Sprite
      );
      if (label) arrow.remove(label);

      arrowsGroup.add(arrow);
    }

    return arrowsGroup;
  }

  /**
   * Updates the direction of all field arrows
   */
  updateDirection(direction: { x: number; y: number; z: number }): void {
    // Normalize the direction vector only if it's not zero
    const dir = new THREE.Vector3(direction.x, direction.y, direction.z);
    const magnitude = dir.length();

    if (magnitude > 0.00001) {
      dir.normalize();

      // Update rotation for all arrows
      updateArrowDirection(this.mainArrow, dir);
      updateArrowDirection(this.originArrow, dir); // NEW: Update origin arrow
      this.arrowsGrid.children.forEach((arrow) => {
        updateArrowDirection(arrow, dir);
      });
    }

    // Update visibility based on current mode and direction magnitude
    const isZeroDirection = magnitude < 0.00001;
    
    if (this.currentMode === FieldDisplayMode.GRID) {
      updateArrowsVisibility(this.mainArrow, direction, true);
      updateArrowsVisibility(this.arrowsGrid, direction);
    } else if (this.currentMode === FieldDisplayMode.SINGLE) {
      // Hide origin arrow if direction is zero
      this.originArrow.visible = !isZeroDirection;
    }
  }

  /**
   * Returns the field arrow objects to add to the scene
   */
  getObjects(): THREE.Object3D[] {
    return [this.mainArrow, this.arrowsGrid, this.originArrow];
  }

  /**
   * Sets the position of the main field arrow
   */
  positionMainArrow(position: THREE.Vector3): void {
    this.mainArrow.position.copy(position);
  }
}