import {
  Color,
  HBox,
  HSlider,
  Panel,
  Property,
  Range,
  Rectangle,
  ResetAllButton,
  RoundToggleButton,
  Text,
  DerivedProperty
} from "scenerystack";
import { SimModel } from "../../model/SimModel";

export default function createComponent(
  model: SimModel,
  resetButton: ResetAllButton,
) {
  const simSpeedText = new Text("simSpeed", { fontSize: 18 });
  const simSpeed = new HSlider(
    model.simSpeedProperty,
    new Range(0.1, Number(2)),
  );
  const buttonSpeed = new Property<boolean>(false);
  const speedPrompt = new RoundToggleButton(buttonSpeed, false, true, {
    radius: 13,
    content: new Text("✎", { fontSize: 100, maxWidth: 15 }),
  });

  buttonSpeed.lazyLink(
    () =>
      (model.simSpeedProperty.value = Number(
        window.prompt("Enter new value for simSpeed:"),
      )),
  );

  return new Panel(
    new HBox({
      align: "center",
      //   spacing: 10,
      children: [
        simSpeedText,
        simSpeed,
        new Text(new DerivedProperty([model.simSpeedProperty], (speed) => speed.toFixed(2)), { fontSize: 18 }),
        new Text("x", { fontSize: 18 }),
        new Rectangle(0, 0, 10, 0),
        speedPrompt,
        new Rectangle(0, 0, 40, 10),
        resetButton,
      ],
    }),
    { fill: new Color("#d3d3d3"), maxWidth: 283, scale: 0.85, minWidth: 260 },
  );
}
