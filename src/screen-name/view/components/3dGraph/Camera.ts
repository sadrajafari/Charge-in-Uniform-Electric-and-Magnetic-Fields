import * as THREE from "three";
// Note: You'll need to install OrbitControls if not using the one from window.THREE
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Creates a perspective camera with appropriate settings
 */
export function createCamera(width: number, height: number): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(5, 5, 15);
  return camera;
}

/**
 * Creates orbit controls for camera movement
 */
export function createControls(camera: THREE.Camera, domElement: HTMLElement): any {
  // @ts-ignore - Assuming OrbitControls is available on window.THREE
  const controls = new window.THREE.OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  controls.autoRotate = false;
  
  // Set initial view
  controls.target.set(0, 0, 0);
  controls.update();
  
  return controls;
}