import {
  HBox,
  HSlider,
  Panel,
  Rectangle,
  RichText,
  Text,
  VBox,
  Range,
  DerivedProperty,
  Color,
  Property,
  RoundToggleButton,
} from "scenerystack";
import { SimModel } from "../../model/SimModel";
import { SimScreenView } from "../SimScreenView";

// const model = new SimModel();

export function createConstantPanel(model: SimModel, screen: SimScreenView) {
  const qSlider = new HSlider(model.qproperty, new Range(-2, 2), {
    scale: 0.6,
  });

  const charge = new RichText("Charge (<em>q</em>)", { scale: 0.55 });

  const parameters = new VBox({
    align: "center",
    children: [
      charge,
      new Rectangle(0, 0, 0, qSlider.height),
      new RichText("Mass (<em>m</em>)", { scale: 0.55 }),
      new Rectangle(0, 0, 0, qSlider.height),
      new RichText("Electric Field (<em>E<sub>0x</sub></em>)", { scale: 0.55 }),
      new Rectangle(0, 0, 0, qSlider.height),
      new RichText("Electric Field (<em>E<sub>0y</sub></em>)", { scale: 0.55 }),
      new Rectangle(0, 0, 0, qSlider.height),
      new RichText("Electric Field (<em>E<sub>0z</sub></em>)", { scale: 0.55 }),
      new Rectangle(0, 0, 0, qSlider.height),
      new RichText("Magnetic Field (<em>B<sub>0x</sub></em>)", { scale: 0.55 }),
      new Rectangle(0, 0, 0, qSlider.height),
      new RichText("Magnetic Field (<em>B<sub>0y</sub></em>)", { scale: 0.55 }),
      new Rectangle(0, 0, 0, qSlider.height),
      new RichText("Magnetic Field (<em>B<sub>0z</sub></em>)", { scale: 0.55 }),
      new Rectangle(0, 0, 0, qSlider.height),
      new RichText("Initial Velocity (<em>V<sub>0x</sub></em>)", {
        scale: 0.55,
      }),
      new Rectangle(0, 0, 0, qSlider.height),
      new RichText("Initial Velocity (<em>V<sub>0y</sub></em>)", {
        scale: 0.55,
      }),
      new Rectangle(0, 0, 0, qSlider.height),
      new RichText("Initial Velocity (<em>V<sub>0z</sub></em>)", {
        scale: 0.55,
      }),
    ],
  });

  const sliders = new VBox({
    align: "center",
    children: [
      qSlider,
      new Rectangle(0, 0, 0, 12),
      new HSlider(model.massProperty, new Range(0.01, 0.1), { scale: 0.6 }),
      new Rectangle(0, 0, 0, 12),
      new HSlider(model.e0xProperty, new Range(0, 10), { scale: 0.6 }),
      new Rectangle(0, 0, 0, 12),
      new HSlider(model.e0yProperty, new Range(0, 10), { scale: 0.6 }),
      new Rectangle(0, 0, 0, 12),
      new HSlider(model.e0zProperty, new Range(0, 10), { scale: 0.6 }),
      new Rectangle(0, 0, 0, 12),
      new HSlider(model.b0xProperty, new Range(0, 10), { scale: 0.6 }),
      new Rectangle(0, 0, 0, 12),
      new HSlider(model.b0yProperty, new Range(0, 10), { scale: 0.6 }),
      new Rectangle(0, 0, 0, 12),
      new HSlider(model.b0zProperty, new Range(0, 10), { scale: 0.6 }),
      new Rectangle(0, 0, 0, 12),
      new HSlider(model.v0xProperty, new Range(-10, 10), { scale: 0.6 }),
      new Rectangle(0, 0, 0, 12),
      new HSlider(model.v0yProperty, new Range(-10, 10), { scale: 0.6 }),
      new Rectangle(0, 0, 0, 12),
      new HSlider(model.v0zProperty, new Range(-10, 10), { scale: 0.6 }),
    ],
  });

  const qButton = new Property<boolean>(true);
  const mButton = new Property<boolean>(true);
  const e0xButton = new Property<boolean>(true);
  const e0yButton = new Property<boolean>(true);
  const e0zButton = new Property<boolean>(true);
  const b0xButton = new Property<boolean>(true);
  const b0yButton = new Property<boolean>(true);
  const b0zButton = new Property<boolean>(true);
  const v0xButton = new Property<boolean>(true);
  const v0yButton = new Property<boolean>(true);
  const v0zButton = new Property<boolean>(true);

  const buttons = new VBox({
    align: "center",
    children: [
      new RoundToggleButton(qButton, false, true, {
        radius: 9,
        content: new Text("✎", { fontSize: 10, maxWidth: 15 }),
      }),
      new Rectangle(0, 0, 0, 13 + 2),
      new RoundToggleButton(mButton, false, true, {
        radius: 9,
        content: new Text("✎", { fontSize: 10, maxWidth: 15 }),
      }),
      new Rectangle(0, 0, 0, 13 + 2),
      new RoundToggleButton(e0xButton, false, true, {
        radius: 9,
        content: new Text("✎", { fontSize: 10, maxWidth: 15 }),
      }),
      new Rectangle(0, 0, 0, 13 + 2),
      new RoundToggleButton(e0yButton, false, true, {
        radius: 9,
        content: new Text("✎", { fontSize: 10, maxWidth: 15 }),
      }),
      new Rectangle(0, 0, 0, 13 + 2),
      new RoundToggleButton(e0zButton, false, true, {
        radius: 9,
        content: new Text("✎", { fontSize: 10, maxWidth: 15 }),
      }),
      new Rectangle(0, 0, 0, 13 + 2),
      new RoundToggleButton(b0xButton, false, true, {
        radius: 9,
        content: new Text("✎", { fontSize: 10, maxWidth: 15 }),
      }),
      new Rectangle(0, 0, 0, 13 + 2),
      new RoundToggleButton(b0yButton, false, true, {
        radius: 9,
        content: new Text("✎", { fontSize: 10, maxWidth: 15 }),
      }),
      new Rectangle(0, 0, 0, 13 + 2),
      new RoundToggleButton(b0zButton, false, true, {
        radius: 9,
        content: new Text("✎", { fontSize: 10, maxWidth: 15 }),
      }),
      new Rectangle(0, 0, 0, 13 + 2),
      new RoundToggleButton(v0xButton, false, true, {
        radius: 9,
        content: new Text("✎", { fontSize: 10, maxWidth: 15 }),
      }),
      new Rectangle(0, 0, 0, 13 + 2),
      new RoundToggleButton(v0yButton, false, true, {
        radius: 9,
        content: new Text("✎", { fontSize: 10, maxWidth: 15 }),
      }),
      new Rectangle(0, 0, 0, 13 + 2),
      new RoundToggleButton(v0zButton, false, true, {
        radius: 9,
        content: new Text("✎", { fontSize: 10, maxWidth: 15 }),
      }),
    ],
  });

  qButton.lazyLink(
    () =>
      (model.qproperty.value = Number(
        window.prompt("Enter new value for Charge (q):"),
      )),
  );
  mButton.lazyLink(
    () =>
      (model.massProperty.value = Number(
        window.prompt("Enter new value for Mass (m):"),
      )),
  );
  e0xButton.lazyLink(
    () =>
      (model.e0xProperty.value = Number(
        window.prompt("Enter new value for Electric Field (E0x):"),
      )),
  );
  e0yButton.lazyLink(
    () =>
      (model.e0yProperty.value = Number(
        window.prompt("Enter new value for Electric Field (E0y):"),
      )),
  );
  e0zButton.lazyLink(
    () =>
      (model.e0zProperty.value = Number(
        window.prompt("Enter new value for Electric Field (E0z):"),
      )),
  );
  b0xButton.lazyLink(
    () =>
      (model.b0xProperty.value = Number(
        window.prompt("Enter new value for Magnetic Field (B0x):"),
      )),
  );
  b0yButton.lazyLink(
    () =>
      (model.b0yProperty.value = Number(
        window.prompt("Enter new value for Magnetic Field (B0y):"),
      )),
  );
  b0zButton.lazyLink(
    () =>
      (model.b0zProperty.value = Number(
        window.prompt("Enter new value for Magnetic Field (B0z):"),
      )),
  );
  v0xButton.lazyLink(
    () =>
      (model.v0xProperty.value = Number(
        window.prompt("Enter new value for Velocity (v0x):"),
      )),
  );
  v0yButton.lazyLink(
    () =>
      (model.v0yProperty.value = Number(
        window.prompt("Enter new value for Velocity (v0y):"),
      )),
  );
  v0zButton.lazyLink(
    () =>
      (model.v0zProperty.value = Number(
        window.prompt("Enter new value for Velocity (v0z):"),
      )),
  );

  const values = new VBox({
    align: "center",
    children: [
      new Text(
        new DerivedProperty([model.qproperty], (q) => {
          return String(Number(q).toFixed(2));
        }),
      ),
      new Rectangle(0, 0, 30, qSlider.height + 2),

      new Text(
        new DerivedProperty([model.massProperty], (m) => {
          return String(Number(m).toFixed(2));
        }),
      ),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text(
        new DerivedProperty([model.e0xProperty], (e0x) => {
          return String(Number(e0x).toFixed(2));
        }),
      ),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text(
        new DerivedProperty([model.e0yProperty], (e0y) => {
          return String(Number(e0y).toFixed(2));
        }),
      ),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text(
        new DerivedProperty([model.e0zProperty], (e0z) => {
          return String(Number(e0z).toFixed(2));
        }),
      ),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text(
        new DerivedProperty([model.b0xProperty], (b0x) => {
          return String(Number(b0x).toFixed(2));
        }),
      ),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text(
        new DerivedProperty([model.b0yProperty], (b0y) => {
          return String(Number(b0y).toFixed(2));
        }),
      ),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text(
        new DerivedProperty([model.b0zProperty], (b0z) => {
          return String(Number(b0z).toFixed(2));
        }),
      ),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text(
        new DerivedProperty([model.v0xProperty], (v0x) => {
          return String(Number(v0x).toFixed(2));
        }),
      ),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text(
        new DerivedProperty([model.v0yProperty], (v0y) => {
          return String(Number(v0y).toFixed(2));
        }),
      ),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text(
        new DerivedProperty([model.v0zProperty], (v0z) => {
          return String(Number(v0z).toFixed(2));
        }),
      ),
    ],
  });

  const units = new VBox({
    align: "center",
    children: [
      new Text("C"),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text("kg"),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text("N/C"),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text("N/C"),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text("N/C"),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text("T"),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text("T"),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text("T"),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text("m/s"),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text("m/s"),
      new Rectangle(0, 0, 0, qSlider.height + 2),
      new Text("m/s"),
    ],
  });

  const constantPanel = new Panel(
    new VBox({
      align: "center",
      children: [
        new RichText("Constants"),
        new Rectangle(0, 0, 0, 10),
        new HBox({
          align: "center",
          children: [
            parameters,
            new Rectangle(0, 0, 10, 0),
            sliders,
            new Rectangle(0, 0, 10, 0),
            buttons,
            new Rectangle(0, 0, 10, 0),
            values,
            new Rectangle(0, 0, 10, 0),
            units,
          ],
        }),
      ],
    }),
    { fill: new Color("#d3d3d3"), maxWidth: 290, scale: 0.85, minWidth: 260 },
  );


  var changingWithId = [false, -1];

  for (var slider of constantPanel._children) {
    // if (slider !== simSpeedSlider) {
    slider.addInputListener({
      mousedown: function (event: { target: { _id: any } }) {

        changingWithId[0] = true;
        changingWithId[1] = event.target._id;
      },
    });
  }
  window.addEventListener("pointerup", () => {
    if (changingWithId[1] === 323) {
      model.reset();
      screen.reset("charge changed");
      screen.playPause.value = true;
      changingWithId[1] = -1;
    } else if (changingWithId[1] === 444) {
      model.reset();
      screen.reset("mass changed");
      screen.playPause.value = true;
      changingWithId[1] = -1;
    } else if (changingWithId[1] === 459) {
      model.reset();
      screen.reset("Ex changed");
      screen.playPause.value = true;
      changingWithId[1] = -1;
    } else if (changingWithId[1] === 474) {
      model.reset();
      screen.reset("Ey changed");
      screen.playPause.value = true;
      changingWithId[1] = -1;
    } else if (changingWithId[1] === 489) {
      model.reset();
      screen.reset("Ez changed");
      screen.playPause.value = true;
      changingWithId[1] = -1;
    } else if (changingWithId[1] === 504) {
      model.reset();
      screen.reset("Bx changed");
      screen.playPause.value = true;
      changingWithId[1] = -1;
    } else if (changingWithId[1] === 519) {
      model.reset();
      screen.reset("By changed");
      screen.playPause.value = true;
      changingWithId[1] = -1;
    } else if (changingWithId[1] === 534) {
      model.reset();
      screen.reset("Bz changed");
      screen.playPause.value = true;
      changingWithId[1] = -1;
    } else if (changingWithId[1] === 549) {
      model.reset();
      screen.reset("Vx changed");
      screen.playPause.value = true;
      changingWithId[1] = -1;
    } else if (changingWithId[1] === 564) {
      model.reset();
      screen.reset("Vy changed");
      screen.playPause.value = true;
      changingWithId[1] = -1;
    } else if (changingWithId[1] === 579) {
      model.reset();
      screen.reset("Vz changed");
      screen.playPause.value = true;
      changingWithId[1] = -1;
    }
  });

  return constantPanel;
}
