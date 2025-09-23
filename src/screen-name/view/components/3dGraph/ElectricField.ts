import * as THREE from "three";
import { FieldArrows } from "./FieldArrows";

/**
 * Electric field arrow visualization
 */
export class ElectricField extends FieldArrows {
  constructor(clippingPlanes: THREE.Plane[]) {
    super(clippingPlanes, 0xff0000, "E"); // Red color for electric field
    
    // Position the main arrow in top-right corner
    this.positionMainArrow(new THREE.Vector3(4, 4, 0));
  }
}