export default function toggleMagneticField(material, show) {
    material.showMagneticField = show;
    // Main vector
    if (material.bFieldArrow) {
      material.bFieldArrow.visible = show;
    }
    // Surface arrows
    if (material.fieldSurfaceArrows && material.fieldSurfaceArrows.length > 0) {
      material.fieldSurfaceArrows.forEach((arrow) => {
        // Only hide magnetic field arrows (color: teal)
        if (arrow instanceof THREE.ArrowHelper && arrow.cone && arrow.line) {
          if (arrow.cone.material.color.getStyle() === "teal") {
            arrow.visible = show;
          }
        } else if (
          arrow.material &&
          arrow.material.color &&
          arrow.material.color.getStyle() === "teal"
        ) {
          arrow.visible = show;
        }
      });
    }
  }