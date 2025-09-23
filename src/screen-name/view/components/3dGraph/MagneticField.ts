import * as THREE from "three";
import { FieldArrows } from "./FieldArrows";

/**
 * Magnetic field arrow visualization
 */
export class MagneticField extends FieldArrows {
  constructor(clippingPlanes: THREE.Plane[]) {
    super(clippingPlanes, 0x0000ff, "B"); // Blue color for magnetic field
    
    // Position the main arrow in top-left corner
    this.positionMainArrow(new THREE.Vector3(-4, 4, 0));
  }
}