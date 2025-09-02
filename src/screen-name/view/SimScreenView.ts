import { ScreenView, ScreenViewOptions } from "scenerystack/sim";
import { SimModel } from "../model/SimModel.js";
import { ResetAllButton } from "scenerystack/scenery-phet";
import { DOM, Rectangle, Text } from "scenerystack/scenery";
import { createConstantPanel } from "./components/constants.js";
import equationInput from "./components/equationInput.js";
import { Vector2 } from "scenerystack";
import Chart3D, { updateChart3D } from "./components/3DAxes.js";
import rk4 from "./components/rk4.ts";
// @ts-ignore
import drawVector from "./components/drawVector.js";
import { GraphComponent } from "./components/graph.ts";
import createComponent from "./components/component.ts";

export class SimScreenView extends ScreenView {
  constantPanel: any;
  equationPanel: any;
  domElement: DOM;
  chart3D: any;
  model: SimModel;
  x1: number = 0;
  y1: number = 0;
  z1: number = 0;
  trailX: number[] = [];
  trailY: number[] = [];
  trailZ: number[] = [];
  vx1: number = 0;
  vy1: number = 0;
  vz1: number = 0;
  xvelocityGraph: GraphComponent;
  yvelocityGraph: GraphComponent;
  zvelocityGraph: GraphComponent;
  time: number = 0;
  userInteracting: boolean = false;
  run: boolean = false;

  public constructor(model: SimModel, options?: ScreenViewOptions) {
    super(options);
    this.model = model;
    this.layoutBounds.maxX = 1300;

    this.constantPanel = createConstantPanel(model);
    this.constantPanel.leftTop = new Vector2(0, 0);
    this.addChild(this.constantPanel);

    this.equationPanel = equationInput("equationPanel", model);
    this.equationPanel.leftTop = new Vector2(0, this.constantPanel.height + 5);
    this.addChild(this.equationPanel);

    this.chart3D = Chart3D(
      "tester",
      0,
      0,
      0,
      this.model.e0x,
      this.model.e0y,
      this.model.e0z,
      this.model.b0x,
      this.model.b0y,
      this.model.b0z,
      false,
    );
    this.domElement = new DOM(this.chart3D, { allowInput: true });
    this.addChild(this.domElement);
    this.domElement.leftTop = new Vector2(this.constantPanel.width, -60);
    // this.domElement.leftTop = new Vector2(0, 160);

    this.chart3D.addEventListener("pointerdown", () => {
      this.userInteracting = true;
    });

    this.chart3D.addEventListener("pointerup", () => {
      this.userInteracting = false;
    });

    // I figure this out later
    // this.chart3D.addEventListener("wheel", () => {
    //   this.userInteracting = true;
    // })

    const xvelocityGraph = document.createElement("div");
    xvelocityGraph.style.width = "300px";
    xvelocityGraph.style.height = "300px";
    xvelocityGraph.id = "xvelocityGraph";
    const xvelocityGraphDOM = new DOM(xvelocityGraph);
    xvelocityGraphDOM.leftTop = new Vector2(
      this.constantPanel.width + 700,
      this.constantPanel.height + 10,
    );
    document.body.appendChild(xvelocityGraph);

    this.xvelocityGraph = new GraphComponent(
      xvelocityGraph.id,
      300,
      250,
      "Time (s)",
      "x velocity",
    );

    const xvelocityGraphNode = new DOM(xvelocityGraph);
    xvelocityGraphNode.leftTop = new Vector2(this.domElement.width + 250, -30);
    this.addChild(xvelocityGraphNode);

    const yvelocityGraph = document.createElement("div");
    yvelocityGraph.style.width = "300px";
    yvelocityGraph.style.height = "300px";
    yvelocityGraph.id = "yvelocityGraph";
    const yvelocityGraphDOM = new DOM(yvelocityGraph);
    yvelocityGraphDOM.leftTop = new Vector2(
      this.constantPanel.width + 700,
      this.constantPanel.height + 10,
    );
    document.body.appendChild(yvelocityGraph);

    this.yvelocityGraph = new GraphComponent(
      yvelocityGraph.id,
      300,
      250,
      "Time (s)",
      "y velocity",
    );

    const yvelocityGraphNode = new DOM(yvelocityGraph);
    yvelocityGraphNode.leftTop = new Vector2(this.domElement.width + 250, 170);
    this.addChild(yvelocityGraphNode);

    const zvelocityGraph = document.createElement("div");
    zvelocityGraph.style.width = "300px";
    zvelocityGraph.style.height = "300px";
    zvelocityGraph.id = "zvelocityGraph";
    const zvelocityGraphDOM = new DOM(zvelocityGraph);
    zvelocityGraphDOM.leftTop = new Vector2(
      this.constantPanel.width + 700,
      this.constantPanel.height + 10,
    );
    document.body.appendChild(zvelocityGraph);

    this.zvelocityGraph = new GraphComponent(
      zvelocityGraph.id,
      300,
      250,
      "Time (s)",
      "z velocity",
    );

    const zvelocityGraphNode = new DOM(zvelocityGraph);
    zvelocityGraphNode.leftTop = new Vector2(this.domElement.width + 250, 370);
    this.addChild(zvelocityGraphNode);
    const resetAllButton = new ResetAllButton({
      listener: () => {
        this.interruptSubtreeInput();
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10,
    });
    // this.addChild(resetAllButton);
    const component = createComponent(model, resetAllButton);
    component.leftTop = new Vector2(0, this.equationPanel.bottom + 5);
    this.addChild(component);
  }

  public reset(): void {
    this.x1 = 0;
    this.y1 = 0;
    this.z1 = 0;
    this.vx1 = this.model.v0x;
    this.vy1 = this.model.v0y;
    this.vz1 = this.model.v0z;
    this.trailX = [];
    this.trailY = [];
    this.trailZ = [];
    this.time = 0;
    this.xvelocityGraph.resetGraph();
    this.yvelocityGraph.resetGraph();
    this.zvelocityGraph.resetGraph();
    this.run = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public step(dt: number): void {
    // Called every frame, with the time since the last frame in seconds

    if (!this.userInteracting && this.run && this.time < 30) {
      const values = rk4(
        [this.x1, this.y1, this.z1, this.vx1, this.vy1, this.vz1],
        0.007 * this.model.simSpeed,
        this.model.q,
        this.model.mass,
        this.model.e0x,
        this.model.e0y,
        this.model.e0z,
        this.model.b0x,
        this.model.b0y,
        this.model.b0z,
      );
      this.x1 = values[0];
      this.y1 = values[1];
      this.z1 = values[2];
      [this.x1, this.y1, this.z1, this.vx1, this.vy1, this.vz1] = values as [
        number,
        number,
        number,
        number,
        number,
        number,
      ];

      this.trailX.push(this.x1);
      this.trailY.push(this.y1);
      this.trailZ.push(this.z1);

      const maxTrailLength = 100000;
      if (this.trailX.length > maxTrailLength) {
        this.trailX.shift();
        this.trailY.shift();
        this.trailZ.shift();
      }

      // Normalize vectors and apply fixed scale
      const ARROW_SCALE = 2.0; // Fixed arrow length

      // Electric field normalization
      const eMagnitude = Math.sqrt(
        this.model.e0x ** 2 + this.model.e0y ** 2 + this.model.e0z ** 2,
      );
      const eNormX =
        eMagnitude > 0 ? (this.model.e0x / eMagnitude) * ARROW_SCALE : 0;
      const eNormY =
        eMagnitude > 0 ? (this.model.e0y / eMagnitude) * ARROW_SCALE : 0;
      const eNormZ =
        eMagnitude > 0 ? (this.model.e0z / eMagnitude) * ARROW_SCALE : 0;

      // Magnetic field normalization
      const bMagnitude = Math.sqrt(
        this.model.b0x ** 2 + this.model.b0y ** 2 + this.model.b0z ** 2,
      );
      const bNormX =
        bMagnitude > 0 ? (this.model.b0x / bMagnitude) * ARROW_SCALE : 0;
      const bNormY =
        bMagnitude > 0 ? (this.model.b0y / bMagnitude) * ARROW_SCALE : 0;
      const bNormZ =
        bMagnitude > 0 ? (this.model.b0z / bMagnitude) * ARROW_SCALE : 0;

      updateChart3D(
        this.chart3D,
        this.x1,
        this.y1,
        this.z1,
        // this.model.e0x,
        // this.model.e0y,
        // this.model.e0z,
        eNormX,
        eNormY,
        eNormZ,
        //
        this.model.b0x,
        this.model.b0y,
        this.model.b0z,
        this.trailX,
        this.trailY,
        this.trailZ,
      );

      this.updateGraphs();
      this.time += 0.007 * this.model.simSpeed;
    }
  }

  private updateGraphs(): void {
    this.xvelocityGraph.updateGraph(
      this.time,
      this.vx1,
      null,
      "Time (s)",
      "x Velocity (m/s)",
    );

    this.yvelocityGraph.updateGraph(
      this.time,
      this.vy1,
      null,
      "Time (s)",
      "y Velocity (m/s)",
    );

    this.zvelocityGraph.updateGraph(
      this.time,
      this.vz1,
      null,
      "Time (s)",
      "z Velocity (m/s)",
    );
  }
}
