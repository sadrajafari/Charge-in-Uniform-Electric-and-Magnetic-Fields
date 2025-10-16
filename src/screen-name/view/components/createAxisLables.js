export default function createAxisLabels(material) {
    // Create text using canvas and texture for better readability
    material.createTextLabel("X", material.axisLength + 2.5, 0, 0, "black", 1.5);
    material.createTextLabel("Y", 0, material.axisLength + 2.5, 0, "black", 1.5);
    material.createTextLabel("Z", 0, 0, material.axisLength + 2.5, "black", 1.5);

    // Add range labels
    material.createTextLabel(
      // `X: ${material.xRange.min.toFixed(2)} to ${material.xRange.max.toFixed(2)}`,
      
      material.axisLength + 1,
      -1,
      0,
      // 0xff4444,
      "black",
      1,
    );
    material.createTextLabel(
      // `Y: ${material.yRange.min.toFixed(2)} to ${material.yRange.max.toFixed(2)}`,
      
      -1,
      material.axisLength + 1,
      0,
      0x44ff44,
      1,
    );
    material.createTextLabel(
      // `Z: ${material.zRange.min.toFixed(2)} to ${material.zRange.max.toFixed(2)}`,
      
      -1,
      -1,
      material.axisLength + 1,
      0x4488ff,
      1,
    );
  }