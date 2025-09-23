import * as THREE from "three";

/**
 * Creates a WebGL renderer with appropriate settings
 */
export function createRenderer(width: number, height: number): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.localClippingEnabled = true;
  
  return renderer;
}