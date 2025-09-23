import * as THREE from "three";
import { createTextSprite } from "./utils/createTextSprite";

/**
 * Creates custom coordinate axes
 */
export function createCustomAxes(length: number): THREE.Object3D {
  const axes = new THREE.Object3D();

  // Materials for axes
  const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0x880000 });
  const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x008800 });
  const zAxisMaterial = new THREE.LineBasicMaterial({ color: 0x000088 });

  // Create positive and negative axes for each dimension
  // X Axis
  const xPosGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(length, 0, 0),
  ]);
  const xNegGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-length, 0, 0),
  ]);

  // Y Axis
  const yPosGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, length, 0),
  ]);
  const yNegGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -length, 0),
  ]);

  // Z Axis
  const zPosGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, length),
  ]);
  const zNegGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -length),
  ]);

  // Create lines for each axis direction
  const xPosLine = new THREE.Line(xPosGeometry, xAxisMaterial);
  const xNegLine = new THREE.Line(xNegGeometry, xAxisMaterial);
  const yPosLine = new THREE.Line(yPosGeometry, yAxisMaterial);
  const yNegLine = new THREE.Line(yNegGeometry, yAxisMaterial);
  const zPosLine = new THREE.Line(zPosGeometry, zAxisMaterial);
  const zNegLine = new THREE.Line(zNegGeometry, zAxisMaterial);

  // Add all lines to the axes object
  axes.add(xPosLine, xNegLine, yPosLine, yNegLine, zPosLine, zNegLine);

  return axes;
}

/**
 * Creates labels for coordinate axes
 */
export function createAxisLabels(length: number): THREE.Group {
  const labelGroup = new THREE.Group();

  // X-axis labels
  for (let i = -length; i <= length; i += 2) {
    if (i !== 0) {
      const label = createTextSprite(
        i.toString(),
        new THREE.Vector3(i, -0.3, 0),
        0x880000
      );
      labelGroup.add(label);
    }
  }

  // Y-axis labels
  for (let i = -length; i <= length; i += 2) {
    if (i !== 0) {
      const label = createTextSprite(
        i.toString(),
        new THREE.Vector3(-0.3, i, 0),
        0x008800
      );
      labelGroup.add(label);
    }
  }

  // Z-axis labels
  for (let i = -length; i <= length; i += 2) {
    if (i !== 0) {
      const label = createTextSprite(
        i.toString(),
        new THREE.Vector3(0, -0.3, i),
        0x000088
      );
      labelGroup.add(label);
    }
  }

  // Add origin label
  const originLabel = createTextSprite(
    "0",
    new THREE.Vector3(0, -0.3, -0.3),
    0x000000
  );
  labelGroup.add(originLabel);

  // Add axis name labels
  const xAxisLabel = createTextSprite(
    "X",
    new THREE.Vector3(length + 0.5, 0, 0),
    0x880000
  );
  const yAxisLabel = createTextSprite(
    "Y",
    new THREE.Vector3(0, length + 0.5, 0),
    0x008800
  );
  const zAxisLabel = createTextSprite(
    "Z",
    new THREE.Vector3(0, 0, length + 0.5),
    0x000088
  );

  labelGroup.add(xAxisLabel);
  labelGroup.add(yAxisLabel);
  labelGroup.add(zAxisLabel);

  return labelGroup;
}

/**
 * Creates a grid helper for the XZ plane
 */
export function createGridHelper(): THREE.GridHelper {
  const gridHelper = new THREE.GridHelper(12, 12, 0x444444, 0xcccccc);
  gridHelper.rotation.x = Math.PI / 2; // Rotate grid to lie in XZ plane
  return gridHelper;
}