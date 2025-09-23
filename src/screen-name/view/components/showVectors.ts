import { Property } from "scenerystack";
import { SimModel } from "../../model/SimModel";

/**
 * Sets up the electric and magnetic field vector toggles to immediately update the 3D graph.
 * @param chart3D The ThreeDGraph instance
 * @param model The SimModel instance
 * @param showElectricFieldVector Property<boolean> for electric field toggle
 * @param showMagneticFieldVector Property<boolean> for magnetic field toggle
 */
export function setupFieldVectorToggles(
  chart3D: any,
  model: SimModel,
  showElectricFieldVector: Property<boolean>,
  showMagneticFieldVector: Property<boolean>,
) {
  showElectricFieldVector.link((show: boolean) => {
    chart3D.toggleElectricField(show);
    // Immediately update field vectors so arrows appear/disappear without slider change
    chart3D.updateFieldVector(
      model.b0xProperty.value,
      model.b0yProperty.value,
      model.b0zProperty.value,
      model.e0xProperty.value,
      model.e0yProperty.value,
      model.e0zProperty.value,
    );
  });
  showMagneticFieldVector.link((show: boolean) => {
    chart3D.toggleMagneticField(show);
    // Immediately update field vectors so arrows appear/disappear without slider change
    chart3D.updateFieldVector(
      model.b0xProperty.value,
      model.b0yProperty.value,
      model.b0zProperty.value,
      model.e0xProperty.value,
      model.e0yProperty.value,
      model.e0zProperty.value,
    );
  });
}
