import { ScreenView, ScreenViewOptions } from "scenerystack/sim";
import { SimModel } from "../model/SimModel.js";
import { ResetAllButton } from "scenerystack/scenery-phet";
import { Circle, DOM, HBox, Rectangle, Text, VBox } from "scenerystack/scenery";
import { createConstantPanel } from "./components/constants.js";
import equationInput from "./components/equationInput.js";
import {
  HSlider,
  Panel,
  Property,
  RoundButton,
  RoundToggleButton,
  ToggleSwitch,
  Vector2,
  Range,
  DerivedProperty,
} from "scenerystack";
import Chart3D, { updateChart3D } from "./components/3DAxes.js";
import rk4 from "./components/rk4.ts";
// @ts-ignore
import drawVector from "./components/drawVector.js";
import { GraphComponent } from "./components/graph.ts";
import createComponent from "./components/component.ts";
import Show3DAxesThreeJS from "./components/3DAxesThreeJS.js";
// @ts-ignore
import ThreeDGraph from "./components/3DGraph.js";

export class SimScreenView extends ScreenView {
  constantPanel: any;
  equationPanel: any;
  domElement: DOM;
  chart3D: any;
  model: SimModel;
  x1: number = 0;
  y1: number = 0;
  z1: number = 0;
  x1Test: number = 0;
  y1Test: number = 0;
  z1Test: number = 0;
  trailX: number[] = [];
  trailY: number[] = [];
  trailZ: number[] = [];
  trailXTest: number[] = [];
  trailYTest: number[] = [];
  trailZTest: number[] = [];
  vx1: number = 0;
  vy1: number = 0;
  vz1: number = 0;
  vx1Test: number = 0;
  vy1Test: number = 0;
  vz1Test: number = 0;
  xvelocityGraph: GraphComponent;
  yvelocityGraph: GraphComponent;
  zvelocityGraph: GraphComponent;
  time: number = 0;
  userInteracting: boolean = false;
  run: boolean = false;
  test: boolean = false;
  equationPanelBoxes: any;
  hasTest: boolean = false;
  prevLeftTop: any;
  particleUpdate: any;
  updateParticle: any;
  updateChartsRange: any;
  electricForceVector: any;
  magneticForceVector: any;
  updateValues: any;
  setFieldSurfaceRows: any;
  updateRows: any;
  showMagneticForceVector: any;
  showElectricForceVector: any;
  setElectricForceShow: any;
  setMagneticForceShow: any;
  setMagneticFieldParticleShow: any;
  setVelocityVectorShow: any;

  // setMagneticFieldDisplayMode: (mode: import("/Users/sadra/Desktop/sceneryStack/Charge in Uniform Electric and Magnetic Fields/src/screen-name/view/components/3DAxesThreeJS").FieldDisplayMode) => void;
  // setElectricFieldDisplayMode: (mode: import("/Users/sadra/Desktop/sceneryStack/Charge in Uniform Electric and Magnetic Fields/src/screen-name/view/components/3DAxesThreeJS").FieldDisplayMode) => void;

  public constructor(model: SimModel, options?: ScreenViewOptions) {
    super(options);
    this.model = model;
    this.layoutBounds.maxX = 1300;

    const redBall = new Circle(7, { fill: "red" });
    const refText = new Text("Reference", { fontSize: 20, fill: "black" });
    refText.leftTop = new Vector2(720, 17);
    this.addChild(refText);
    const blueBall = new Circle(7, { fill: "blue" });
    const testText = new Text("Test", { fontSize: 20, fill: "black" });
    testText.leftTop = new Vector2(920, 17);
    this.addChild(testText);
    redBall.leftTop = new Vector2(700, 20);
    blueBall.leftTop = new Vector2(900, 20);
    this.addChild(redBall);
    this.addChild(blueBall);

    this.constantPanel = createConstantPanel(model);
    this.constantPanel.leftTop = new Vector2(0, 0);
    this.addChild(this.constantPanel);

    this.equationPanel = equationInput("equationPanel", model);
    this.equationPanelBoxes = this.equationPanel["panel"];
    this.equationPanelBoxes.leftTop = new Vector2(
      0,
      this.constantPanel.height + 65,
    );
    this.addChild(this.equationPanelBoxes);

    const graphDiv = document.createElement("div");
    graphDiv.id = "graphDiv";
    graphDiv.style.width = "750px";
    graphDiv.style.height = "550px";
    graphDiv.style.backgroundColor = "black";
    graphDiv.style.marginTop = "2rem";
    document.body.appendChild(graphDiv);
    this.chart3D = new ThreeDGraph(750, 550);
    this.updateParticle = this.chart3D.updateParticle.bind(this.chart3D);
    this.updateChartsRange = this.chart3D.updateRange.bind(this.chart3D);
    this.electricForceVector = this.chart3D.electricForceVector.bind(
      this.chart3D,
    );
    this.magneticForceVector = this.chart3D.magneticForceVector.bind(
      this.chart3D,
    );
    this.updateValues = this.chart3D.updateValues.bind(this.chart3D);
    this.updateRows = this.chart3D.updateRows.bind(this.chart3D);
    this.showElectricForceVector = this.chart3D.showElectricForceVector.bind(
      this.chart3D,
    );
    this.showMagneticForceVector = this.chart3D.showMagneticForceVector.bind(
      this.chart3D,
    );
    this.setElectricForceShow = this.chart3D.setElectricForceShow.bind(
      this.chart3D,
    );
    this.setMagneticForceShow = this.chart3D.setMagneticForceShow.bind(
      this.chart3D,
    );
    this.setMagneticFieldParticleShow =
      this.chart3D.setMagneticFieldParticleShow.bind(this.chart3D);
    this.setVelocityVectorShow = this.chart3D.setVelocityVectorShow.bind(
      this.chart3D,
    );

    this.setVelocityVectorShow(true);
    this.setMagneticFieldParticleShow(false);

    this.setElectricForceShow(false);

    // this.showElectricForceVector(false)
    const rowNumberSlider = new HSlider(
      this.model.rowNumberProperty,
      new Range(0, Number(6)),
      { scale: 0.7 },
    );

    this.addChild(rowNumberSlider);
    rowNumberSlider.leftTop = new Vector2(
      380,
      this.equationPanelBoxes.height - 170,
    );

    const rowNumberText = new Text("Field Surface Rows", {
      fontSize: 20,
      fill: "black",
      scale: 0.7,
    });
    rowNumberText.leftTop = new Vector2(
      250,
      this.equationPanelBoxes.height - 165,
    );
    this.addChild(rowNumberText);

    this.model.rowNumberProperty.lazyLink((event) => {
      this.updateRows(parseInt(event));
      this.chart3D.renderer.render(this.chart3D.scene, this.chart3D.camera);
    });

    const numberOfSurfacesText = new Text(
      new DerivedProperty(
        [this.model.rowNumberProperty],
        (rowNumber) => `${Math.round(rowNumber)}`,
      ),
      { fontSize: 20, fill: "black", scale: 0.7 },
    );
    numberOfSurfacesText.leftTop = new Vector2(
      480,
      this.equationPanelBoxes.height - 165,
    );
    this.addChild(numberOfSurfacesText);

    this.updateChartsRange(
      this.model.Xrange,
      this.model.Yrange,
      this.model.Zrange,
    );
    this.chart3D.renderer.render(this.chart3D.scene, this.chart3D.camera);

    this.domElement = new DOM(graphDiv, { allowInput: true });
    this.addChild(this.domElement);
    this.domElement.leftTop = new Vector2(250, 10);
    this.prevLeftTop = this.domElement.leftTop.copy();

    this.model.b0xProperty.link((b0x: number) => {
      (this.chart3D as any).updateFieldVector(
        b0x,
        this.model.b0yProperty.value,
        this.model.b0zProperty.value,
        this.model.e0xProperty.value,
        this.model.e0yProperty.value,
        this.model.e0zProperty.value,
      );
    });
    this.model.b0yProperty.link((b0y: number) => {
      (this.chart3D as any).updateFieldVector(
        this.model.b0xProperty.value,
        b0y,
        this.model.b0zProperty.value,
        this.model.e0xProperty.value,
        this.model.e0yProperty.value,
        this.model.e0zProperty.value,
      );
    });
    this.model.b0zProperty.link((b0z: number) => {
      (this.chart3D as any).updateFieldVector(
        this.model.b0xProperty.value,
        this.model.b0yProperty.value,
        b0z,
        this.model.e0xProperty.value,
        this.model.e0yProperty.value,
        this.model.e0zProperty.value,
      );
    });

    this.model.e0xProperty.link((e0x: number) => {
      (this.chart3D as any).updateFieldVector(
        this.model.b0xProperty.value,
        this.model.b0yProperty.value,
        this.model.b0zProperty.value,
        e0x,
        this.model.e0yProperty.value,
        this.model.e0zProperty.value,
      );
    });
    this.model.e0yProperty.link((e0y: number) => {
      (this.chart3D as any).updateFieldVector(
        this.model.b0xProperty.value,
        this.model.b0yProperty.value,
        this.model.b0zProperty.value,
        this.model.e0xProperty.value,
        e0y,
        this.model.e0zProperty.value,
      );
    });
    this.model.e0zProperty.link((e0z: number) => {
      (this.chart3D as any).updateFieldVector(
        this.model.b0xProperty.value,
        this.model.b0yProperty.value,
        this.model.b0zProperty.value,
        this.model.e0xProperty.value,
        this.model.e0yProperty.value,
        e0z,
      );
    });

    const showElectricFieldVector = new Property<boolean>(true);
    const showMagneticFieldVector = new Property<boolean>(true);
    const mode1 = new Property<boolean>(true);

    const ElectricFieldToggleBtn = new ToggleSwitch(
      showElectricFieldVector,
      false,
      true,
    );
    const MagneticFieldToggleBtn = new ToggleSwitch(
      showMagneticFieldVector,
      false,
      true,
    );

    const mode1Btn = new ToggleSwitch(mode1, false, true);

    const showElectricFieldVectorHBox = new HBox({
      align: "center",
      children: [
        new Text("Show Electric Field", { fontSize: 20, fill: "black" }),
        new Rectangle(0, 0, 100, 0),
        ElectricFieldToggleBtn,
      ],
    });
    // this.addChild(showElectricFieldVectorHBox);

    const showMagneticFieldVectorHBox = new HBox({
      align: "center",
      children: [
        new Text("Show Magnetic Field", { fontSize: 20, fill: "black" }),
        new Rectangle(0, 0, 90, 0),
        MagneticFieldToggleBtn,
      ],
    });

    const modeHBox = new HBox({
      align: "center",
      children: [
        new Text("Vector Display Mode", { fontSize: 20, fill: "black" }),
        new Rectangle(0, 0, 70, 0),
        mode1Btn,
      ],
    });

    const showVectorsPanel = new Panel(
      new VBox({
        align: "center",
        children: [
          showElectricFieldVectorHBox,
          new Rectangle(0, 0, 0, 10),
          showMagneticFieldVectorHBox,
          new Rectangle(0, 0, 0, 10),
          modeHBox,
        ],
      }),
      { fill: "#d3d3d3", maxWidth: 290, scale: 0.835 },
    );
    showVectorsPanel.leftTop = new Vector2(0, this.constantPanel.height + 5);
    this.addChild(showVectorsPanel);

    showElectricFieldVector.link((show: boolean) => {
      this.chart3D.toggleElectricField(show);
      // Immediately update field vectors so arrows appear/disappear without slider change
      this.chart3D.updateFieldVector(
        this.model.b0xProperty.value,
        this.model.b0yProperty.value,
        this.model.b0zProperty.value,
        this.model.e0xProperty.value,
        this.model.e0yProperty.value,
        this.model.e0zProperty.value,
      );
    });
    showMagneticFieldVector.link((show: boolean) => {
      this.chart3D.toggleMagneticField(show);
      // Immediately update field vectors so arrows appear/disappear without slider change
      this.chart3D.updateFieldVector(
        this.model.b0xProperty.value,
        this.model.b0yProperty.value,
        this.model.b0zProperty.value,
        this.model.e0xProperty.value,
        this.model.e0yProperty.value,
        this.model.e0zProperty.value,
      );
    });

    mode1.link((mode: boolean) => {
      if (mode) {
        this.setMagneticFieldParticleShow(true);
        this.setMagneticForceShow(true);
        this.setVelocityVectorShow(true);
        this.setElectricForceShow(false);
      } else {
        this.setMagneticFieldParticleShow(false);
        this.setVelocityVectorShow(false);
        this.setElectricForceShow(true);
        this.setMagneticForceShow(true);
      }
    });

    const xvelocityGraph = document.createElement("div");
    xvelocityGraph.style.width = "300px";
    xvelocityGraph.style.height = "300px";
    xvelocityGraph.id = "xvelocityGraph";
    const xvelocityGraphDOM = new DOM(xvelocityGraph);
    xvelocityGraphDOM.leftTop = new Vector2(
      // this.constantPanel.width + 700,
      1000,
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
    // xvelocityGraphNode.leftTop = new Vector2(this.domElement.width + 250, -30);
    xvelocityGraphNode.leftTop = new Vector2(1000, -30);
    this.addChild(xvelocityGraphNode);

    const yvelocityGraph = document.createElement("div");
    yvelocityGraph.style.width = "300px";
    yvelocityGraph.style.height = "300px";
    yvelocityGraph.id = "yvelocityGraph";
    const yvelocityGraphDOM = new DOM(yvelocityGraph);
    yvelocityGraphDOM.leftTop = new Vector2(
      // this.constantPanel.width + 700,
      1000,
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
    // yvelocityGraphNode.leftTop = new Vector2(this.domElement.width + 250, 170);
    yvelocityGraphNode.leftTop = new Vector2(1000, 170);
    this.addChild(yvelocityGraphNode);

    const zvelocityGraph = document.createElement("div");
    zvelocityGraph.style.width = "300px";
    zvelocityGraph.style.height = "300px";
    zvelocityGraph.id = "zvelocityGraph";
    const zvelocityGraphDOM = new DOM(zvelocityGraph);
    zvelocityGraphDOM.leftTop = new Vector2(
      // this.constantPanel.width + 700,
      1000,
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
    // zvelocityGraphNode.leftTop = new Vector2(this.domElement.width + 250, 370);
    zvelocityGraphNode.leftTop = new Vector2(1000, 370);
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
    component.leftTop = new Vector2(0, this.equationPanelBoxes.bottom + 5);
    this.addChild(component);

    // this.reset();
    // this.reset();
  }

  public reset(): void {
    // this.resetTrail();
    this.equationPanel.vdotxInput.updatePropertyFromField();
    this.equationPanel.vdotyInput.updatePropertyFromField();
    this.equationPanel.vdotzInput.updatePropertyFromField();

    this.x1 = 0;
    this.y1 = 0;
    this.z1 = 0;
    this.x1Test = 0;
    this.y1Test = 0;
    this.z1Test = 0;
    this.vx1Test = this.model.v0x;
    this.vy1Test = this.model.v0y;
    this.vz1Test = this.model.v0z;
    this.vx1 = this.model.v0x;
    this.vy1 = this.model.v0y;
    this.vz1 = this.model.v0z;
    this.trailX = [];
    this.trailY = [];
    this.trailZ = [];
    this.trailXTest = [];
    this.trailYTest = [];
    this.trailZTest = [];
    this.time = 0;
    this.xvelocityGraph.resetGraph();
    this.yvelocityGraph.resetGraph();
    this.zvelocityGraph.resetGraph();

    if (
      this.model.vdotx !== "" &&
      this.model.vdoty !== "" &&
      this.model.vdotz !== ""
    ) {
      this.hasTest = true;
      // Ensure test particle is present in the 3D graph
      if (this.chart3D && !this.chart3D.showTestParticle) {
        this.chart3D.showTestParticle = true;
        this.chart3D.createTestParticle();
      }
      // Update test particle state
      if (this.chart3D && this.chart3D.updateTestParticle) {
        this.chart3D.updateTestParticle(
          this.x1Test,
          this.y1Test,
          this.z1Test,
          this.vx1Test,
          this.vy1Test,
          this.vz1Test,
        );
      }
    } else {
      this.hasTest = false;
      // Remove test particle from the 3D graph if present
      if (this.chart3D && this.chart3D.showTestParticle) {
        this.chart3D.showTestParticle = false;
        if (this.chart3D.testParticle) {
          this.chart3D.group.remove(this.chart3D.testParticle);
          this.chart3D.testParticle = null;
        }
        if (this.chart3D.testTrailMesh) {
          this.chart3D.group.remove(this.chart3D.testTrailMesh);
          this.chart3D.testTrailMesh = null;
        }
      }
    }

    const currentLeftTop = this.domElement.leftTop.copy();
    // this.removeChild(this.domElement);
    this.updateChartsRange(
      this.model.Xrange,
      this.model.Yrange,
      this.model.Zrange,
    );

    // this.chart3D = null;
    // this.chart3D = Chart3D(
    //   "tester",
    //   this.hasTest,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   this.model.b0x,
    //   this.model.b0y,
    //   this.model.b0z,
    //   this.model.Xrange,
    //   this.model.Yrange,
    //   this.model.Zrange,
    // );
    // this.domElement = new DOM(this.chart3D, { allowInput: true });
    // this.addChild(this.domElement);
    // this.domElement.leftTop = new Vector2(300, -60);

    // this.chart3D.addEventListener("pointerdown", () => {
    //   this.userInteracting = true;
    // });

    // this.chart3D.addEventListener("pointerup", () => {
    //   this.userInteracting = false;
    // });

    this.run = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public step(dt: number): void {
    // Called every frame, with the time since the last frame in seconds
    // this.run = true;

    if (!this.userInteracting && this.run && this.time < 4.9) {
      const values = rk4(
        false,
        "",
        "",
        "",
        [this.x1, this.y1, this.z1, this.vx1, this.vy1, this.vz1],
        0.001 * this.model.simSpeed,
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

      // (this.magneticForceVector(this.model.q, this.vx1, this.vy1, this.vz1, this.model.b0x, this.model.b0y, this.model.b0z))

      // const maxTrailLength = 100000;
      // if (this.trailX.length > maxTrailLength) {
      //   this.trailX.shift();
      //   this.trailY.shift();
      //   this.trailZ.shift();
      // }

      if (
        this.model.vdotx !== "" &&
        this.model.vdoty !== "" &&
        this.model.vdotz !== ""
      ) {
        this.hasTest = true;
        const testValues = rk4(
          true,
          this.model.vdotx,
          this.model.vdoty,
          this.model.vdotz,
          [
            this.x1Test,
            this.y1Test,
            this.z1Test,
            this.vx1Test,
            this.vy1Test,
            this.vz1Test,
          ],
          0.001 * this.model.simSpeed,
          this.model.q,
          this.model.mass,
          this.model.e0x,
          this.model.e0y,
          this.model.e0z,
          this.model.b0x,
          this.model.b0y,
          this.model.b0z,
        );
        this.x1Test = testValues[0];
        this.y1Test = testValues[1];
        this.z1Test = testValues[2];
        [
          this.x1Test,
          this.y1Test,
          this.z1Test,
          this.vx1Test,
          this.vy1Test,
          this.vz1Test,
        ] = testValues as [number, number, number, number, number, number];

        this.trailXTest.push(this.x1Test);
        this.trailYTest.push(this.y1Test);
        this.trailZTest.push(this.z1Test);

        const maxTrailLength = 100000;
        if (this.trailXTest.length > maxTrailLength) {
          this.trailXTest.shift();
          this.trailYTest.shift();
          this.trailZTest.shift();
        }
      }

      (this.chart3D as any).updateParticle(
        this.x1,
        this.y1,
        this.z1,
        this.vx1,
        this.vy1,
        this.vz1,
      );
      (this.chart3D as any).updateTestParticle(
        this.x1Test,
        this.y1Test,
        this.z1Test,
        this.vx1Test,
        this.vy1Test,
        this.vz1Test,
      );
      this.updateValues(this.model.q, this.vx1, this.vy1, this.vz1);

      this.updateGraphs();
      this.time += 0.001 * this.model.simSpeed;
    }
  }

  private updateGraphs(): void {
    this.xvelocityGraph.updateGraph(
      this.time,
      this.vx1,
      this.hasTest ? this.vx1Test : null,
      "Time (s)",
      "x Velocity (m/s)",
    );

    this.yvelocityGraph.updateGraph(
      this.time,
      this.vy1,
      this.hasTest ? this.vy1Test : null,
      "Time (s)",
      "y Velocity (m/s)",
    );

    this.zvelocityGraph.updateGraph(
      this.time,
      this.vz1,
      this.hasTest ? this.vz1Test : null,
      "Time (s)",
      "z Velocity (m/s)",
    );
  }
}
