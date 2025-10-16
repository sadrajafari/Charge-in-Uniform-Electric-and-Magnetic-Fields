export default function createGraph(material) {
  // Create coordinate axes
  material.createAxes();

  // Create custom grid planes for (x, y), (x, z), (y, z)
  material.createCustomGrids();

  // Add axis labels
  material.createAxisLabels();
}
