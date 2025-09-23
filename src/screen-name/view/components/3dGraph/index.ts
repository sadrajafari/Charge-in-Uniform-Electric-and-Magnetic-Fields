import * as THREE from "three";
import { createScene, createSceneGroup } from "./Scene";
import { createCamera, createControls } from "./Camera";
import { createRenderer } from "./Renderer";
import { createCustomAxes, createAxisLabels, createGridHelper } from "./Axes";
import { createClippingPlanes, createAxisBox } from "./Box";
import { ParticleSystem } from "./Particle";
import { ElectricField } from "./ElectricField";
import { MagneticField } from "./MagneticField";
import { FieldDisplayMode } from "./FieldArrows";

/**
 * Interface for the Three.js visualization API
 */
export interface ThreeJSVisualization {
  domElement: HTMLCanvasElement;
  updateParticlePosition: (x: number, y: number, z: number) => void;
  resetTrail: () => void;
  updateMagneticField: (direction: { x: number; y: number; z: number }) => void;
  updateElectricField: (direction: { x: number; y: number; z: number }) => void;
}

/**
 * Creates the complete Three.js visualization
 */
export function createVisualization(
  width: number = 700,
  height: number = 600,
): ThreeJSVisualization {
  // Create the basic Three.js components
  const scene = createScene();
  const camera = createCamera(width, height);
  const renderer = createRenderer(width, height);
  const controls = createControls(camera, renderer.domElement);

  // Create the scene group that will hold all objects
  const sceneGroup = createSceneGroup();
  scene.add(sceneGroup);

  // Create clipping planes
  const clippingPlanes = createClippingPlanes();

  // Create axis components
  const customAxes = createCustomAxes(6);
  const axisLabels = createAxisLabels(6);
  const gridHelper = createGridHelper();
  const axisBox = createAxisBox(12, clippingPlanes);

  // Create particle system
  const particleSystem = new ParticleSystem(clippingPlanes);

  // Create field visualizations
  const electricField = new ElectricField(clippingPlanes);
  const magneticField = new MagneticField(clippingPlanes);

  electricField.setDisplayMode(FieldDisplayMode.GRID); // Electric field on front/back walls
  magneticField.setDisplayMode(FieldDisplayMode.SINGLE); // Magnetic field on left/right walls

  // Add all components to the scene group
  sceneGroup.add(gridHelper);
  sceneGroup.add(customAxes);
  sceneGroup.add(axisBox);
  sceneGroup.add(axisLabels);
  sceneGroup.rotation.x = (3 * Math.PI) / 2; // Rotate to desired orientation

  // Add particle and trail
  particleSystem.getObjects().forEach((obj) => sceneGroup.add(obj));

  // Add field arrows
  electricField.getObjects().forEach((obj) => sceneGroup.add(obj));
  magneticField.getObjects().forEach((obj) => sceneGroup.add(obj));

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // Return the public interface
  return {
    domElement: renderer.domElement,
    updateParticlePosition: (x, y, z) => particleSystem.updatePosition(x, y, z),
    resetTrail: () => particleSystem.resetTrail(),
    updateMagneticField: (direction) =>
      magneticField.updateDirection(direction),
    updateElectricField: (direction) =>
      electricField.updateDirection(direction),
  };
}
