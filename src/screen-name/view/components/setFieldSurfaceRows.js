export default function setFieldSurfaceRows(material, numRows) {
    // numRows: integer, number of arrows per axis side
    material.showFieldSurfaces(
      numRows,
      material.Bx,
      material.By,
      material.Bz,
      material.Ex,
      material.Ey,
      material.Ez,
    );
    // Optionally re-render if needed:
    material.renderer.render(material.scene, material.camera);
  }