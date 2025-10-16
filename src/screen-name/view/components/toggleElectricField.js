export default function toggleElectricField(material, show) {
    material.showElectricField = show;
    // Main vector
    if (material.eFieldArrow) {
      material.eFieldArrow.visible = show;
    }
    // Surface arrows
    if (material.fieldSurfaceArrows && material.fieldSurfaceArrows.length > 0) {
      material.fieldSurfaceArrows.forEach((arrow) => {
        // Only hide electric field arrows (color: maroon)
        if (arrow instanceof THREE.ArrowHelper && arrow.cone && arrow.line) {
          // Check color (maroon)
          if (arrow.cone.material.color.getStyle() === "maroon") {
            arrow.visible = show;
          }
        } else if (
          arrow.material &&
          arrow.material.color &&
          arrow.material.color.getStyle() === "maroon"
        ) {
          arrow.visible = show;
        }
      });
    }
  }