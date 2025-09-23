import * as THREE from "three";

/**
 * Creates a Three.js scene with appropriate background and lighting
 */
export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#ffffff");
  
  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  
  return scene;
}

/**
 * Creates a Three.js group that will contain all objects in the scene
 */
export function createSceneGroup(): THREE.Group {
  const sceneGroup = new THREE.Group();
  // Rotate to desired orientation if needed
  // sceneGroup.rotation.x = Math.PI / 2;
  return sceneGroup;
}