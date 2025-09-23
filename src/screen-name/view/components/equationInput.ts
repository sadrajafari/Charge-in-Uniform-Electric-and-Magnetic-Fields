import {
  Color,
  DOM,
  HBox,
  Panel,
  Rectangle,
  RichText,
  VBox,
} from "scenerystack";
import { SimModel } from "../../model/SimModel";
import EquationInput from "./mathquill.ts";

const equationInput = (container: string, model: SimModel) => {
  const vxDOM = document.createElement("div");
  const vyDOM = document.createElement("div");
  const vzDOM = document.createElement("div");
  const xdotDOM = document.createElement("div");
  const ydotDOM = document.createElement("div");
  const zdotDOM = document.createElement("div");
  vxDOM.id = "vx";
  vyDOM.id = "vy";
  vzDOM.id = "vz";
  xdotDOM.id = "xdot";
  ydotDOM.id = "ydot";
  zdotDOM.id = "zdot";

  const vdotx = document.body;
  const vdotxInput = new EquationInput(
    vxDOM,
    vxDOM.id,
    vdotx,
    model.vdotxProperty,
    model,
    { initialText: model.vdotxProperty, left: 20, top: 320 },
  );

  const vdoty = document.body;
  const vdotyInput = new EquationInput(
    vyDOM,
    vyDOM.id,
    vdoty,
    model.vdotyProperty,
    model,
    { initialText: model.vdotyProperty, left: 20, top: 320 },
  );

  const vdotz = document.body;
  const vdotzInput = new EquationInput(
    vzDOM,
    vzDOM.id,
    vdotz,
    model.vdotzProperty,
    model,
    { initialText: model.vdotzProperty, left: 20, top: 320 },
  );

  const xdot = document.body;
  const xdotInput = new EquationInput(
    xdotDOM,
    xdotDOM.id,
    xdot,
    model.xdotProperty,
    model,
    { initialText: model.xdotProperty, left: 20, top: 320 },
  );

  const ydot = document.body;
  const ydotInput = new EquationInput(
    ydotDOM,
    ydotDOM.id,
    ydot,
    model.ydotProperty,
    model,
    { initialText: model.ydotProperty, left: 20, top: 320 },
  );

  const zdot = document.body;
  const zdotInput = new EquationInput(
    zdotDOM,
    zdotDOM.id,
    zdot,
    model.zdotProperty,
    model,
    { initialText: model.zdotProperty, left: 20, top: 320 },
  );

  const vdotxBox = new HBox({
    align: "center",
    children: [new RichText("ẍ = ", { scale: 0.8 }), vdotxInput],
  });

  const vdotyBox = new HBox({
    align: "center",
    children: [new RichText("ÿ = ", { scale: 0.8 }), vdotyInput],
  });

  const vdotzBox = new HBox({
    align: "center",
    children: [new RichText("z̈ = ", { scale: 0.8 }), vdotzInput],
  });

  const xdotBox = new HBox({
    align: "center",
    children: [new RichText("ẋ = ", { scale: 0.8 }), xdotInput],
  });

  const ydotBox = new HBox({
    align: "center",
    children: [new RichText("ẏ = ", { scale: 0.8 }), ydotInput],
  });

  const zdotBox = new HBox({
    align: "center",
    children: [new RichText("ż = ", { scale: 0.8 }), zdotInput],
  });

  const panel = new Panel(
    new VBox({
      align: "center",
      children: [
        new RichText("Equations"),
        new Rectangle(0, 0, 0, 10),
        vdotxBox,
        new Rectangle(0, 0, 0, 5),
        vdotyBox,
        new Rectangle(0, 0, 0, 5),
        vdotzBox,
        // xdotBox,
        // ydotBox,
        // zdotBox,
      ],
    }),
    { fill: new Color("#d3d3d3"), maxWidth: 290, scale: 0.9, minWidth: 265 },
  );

  return { panel, vdotxInput, vdotyInput, vdotzInput };
};

export default equationInput;
