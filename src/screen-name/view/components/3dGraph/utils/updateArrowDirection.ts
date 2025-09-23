import * as THREE from "three";

/**
 * Updates the rotation of an arrow to point in the specified direction
 */
export function updateArrowDirection(
  arrow: THREE.Object3D, 
  direction: THREE.Vector3
): void {
  // Reset rotation
  arrow.rotation.set(0, 0, 0);

  // Default arrow points along y-axis
  if (Math.abs(direction.y) > 0.99999) {
    // Already pointing in the right direction if dir is (0,1,0)
    if (direction.y < 0) {
      arrow.rotation.x = Math.PI; // Flip if dir is (0,-1,0)
    }
  } else {
    // For any other direction, use quaternion rotation
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(up, direction);
    arrow.setRotationFromQuaternion(quaternion);
  }
}

/**
 * Updates the visibility of arrows based on whether the direction is zero
 */
export function updateArrowsVisibility(
  arrows: THREE.Object3D,
  direction: { x: number; y: number; z: number },
  isMainArrow: boolean = false
): void {
  // Check if direction is zero or very close to zero
  const isZeroDirection =
    Math.abs(direction.x) < 0.00001 &&
    Math.abs(direction.y) < 0.00001 &&
    Math.abs(direction.z) < 0.00001;

  // Hide the main arrow if direction is zero
  if (isMainArrow) {
    arrows.visible = !isZeroDirection;
  }
  // For arrow groups, hide all children
  else if (arrows.children) {
    arrows.children.forEach((arrow) => {
      arrow.visible = !isZeroDirection;
    });
  }
}