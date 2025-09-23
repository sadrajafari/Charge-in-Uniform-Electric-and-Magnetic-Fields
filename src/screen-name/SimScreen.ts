import { Screen, ScreenOptions } from "scenerystack/sim";
import { SimModel } from "./model/SimModel";
import { SimScreenView } from "./view/SimScreenView.js";

export class SimScreen extends Screen<SimModel, SimScreenView> {
  public constructor(options: ScreenOptions) {
    super(
      () => new SimModel(),
      (model) => new SimScreenView(model),
      options,
    );
  }
}
