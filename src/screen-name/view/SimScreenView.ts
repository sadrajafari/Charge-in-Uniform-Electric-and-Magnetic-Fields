import { ScreenView, ScreenViewOptions } from "scenerystack/sim";
import { SimModel } from "../model/SimModel.js";
import { ResetAllButton } from "scenerystack/scenery-phet";
import {
  Circle,
  DOM,
  HBox,
  Path,
  Rectangle,
  Text,
  VBox,
} from "scenerystack/scenery";
import { createConstantPanel } from "./components/constants.js";
import equationInput from "./components/equationInput.js";
import post from "./components/postData.js";

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
  Checkbox,
  AquaRadioButton,
  Shape,
  RectangularPushButton,
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
  playPause: Property<boolean> = new Property(false);
  simPaused: Property<boolean> = new Property(false);
  showElectricFieldVector = new Property<boolean>(true);
  showMagneticFieldVector = new Property<boolean>(true);
  cameraViewProperty = new Property<string>("normal");
  displayMode: Property<string> = new Property("reference");
  simInit = new Property<boolean>(true);
  updateChargeRangeFile: null;
  private pendingCameraView: string | null = null;
  private simulationFinished: boolean = false;
  private pauseSim: Property<boolean> = new Property(false);
  private handleTestParticleRemoval(): void {
    // Remove test particle and all its vectors
    (this.chart3D as any).removeTestParticle();

    // Reset test particle flags
    this.hasTest = false;
    this.x1Test = 0;
    this.y1Test = 0;
    this.z1Test = 0;
    this.vx1Test = 0;
    this.vy1Test = 0;
    this.vz1Test = 0;
  }

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

    this.constantPanel = createConstantPanel(model, this);
    this.constantPanel.leftTop = new Vector2(0, 0);
    this.addChild(this.constantPanel);

    this.equationPanel = equationInput("equationPanel", model);
    this.equationPanelBoxes = this.equationPanel["panel"];
    this.equationPanelBoxes.leftTop = new Vector2(
      0,
      this.constantPanel.height + 5,
    );
    this.addChild(this.equationPanelBoxes);

    const graphDiv = document.createElement("div");
    graphDiv.id = "graphDiv";
    graphDiv.style.width = "750px";
    // graphDiv.style.height = "550px";
    graphDiv.style.height = "450px";
    // graphDiv.style.height = "50px";
    graphDiv.style.backgroundColor = "black";
    graphDiv.style.marginTop = "2rem";
    document.body.appendChild(graphDiv);
    // this.chart3D = new ThreeDGraph(750, 550);
    this.chart3D = new ThreeDGraph(750, 450);
    this.updateParticle = this.chart3D.updateParticle.bind(this.chart3D);
    this.updateChartsRange = this.chart3D.updateRange.bind(this.chart3D);

    // this.electricForceVector = this.chart3D.electricForceVector.bind(
    //   this.chart3D,
    // );
    this.magneticForceVector = this.chart3D.magneticForceVector.bind(
      this.chart3D,
    );
    this.updateValues = this.chart3D.updateValues.bind(this.chart3D);
    this.updateRows = this.chart3D.updateRows.bind(this.chart3D);

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

    // const cameraViewProperty = new Property<string>("normal");
    const normalViewRadio = new AquaRadioButton(
      this.cameraViewProperty,
      "normal",
      new Text("Standard View", { fontSize: 16, fill: "black" }),
      { radius: 8 },
    );

    const electricViewRadio = new AquaRadioButton(
      this.cameraViewProperty,
      "electric",
      new Text("Electric Force View", { fontSize: 16, fill: "black" }),
      { radius: 8 },
    );

    const magneticViewRadio = new AquaRadioButton(
      this.cameraViewProperty,
      "magnetic",
      new Text("Magnetic Force View", { fontSize: 16, fill: "black" }),
      { radius: 8 },
    );

    const showRefCheckBox = new AquaRadioButton(
      // this.model.referenceModeProperty,
      this.model.displayModeProperty,
      "reference",
      new Text("Reference", { fontSize: 16, fill: "black" }),
    );

    const showTestCheckBox = new AquaRadioButton(
      // this.model.testModeProperty,
      this.model.displayModeProperty,
      "test",
      new Text("Test", { fontSize: 16, fill: "black" }),
    );

    // const dropArrows = new Checkbox(this.model.dropArrowsProperty, {});

    const cameraViewPanel = new Panel(
      new HBox({
        align: "top",
        spacing: 20,
        children: [
          // Left side - Camera View controls
          new VBox({
            align: "left",
            spacing: 12,
            children: [
              new Text("Camera View", {
                fontSize: 18,
                fill: "black",
                fontWeight: "bold",
              }),
              normalViewRadio,
              electricViewRadio,
              magneticViewRadio,
            ],
          }),
          // Vertical separator line
          new Rectangle(0, 0, 2, 120, {
            fill: "#888",
            cornerRadius: 1,
          }),
          // Right side - Show controls
          new VBox({
            align: "left",
            spacing: 12,
            children: [
              new Text("Track", {
                fontSize: 18,
                fill: "black",
                fontWeight: "bold",
              }),
              showRefCheckBox,
              showTestCheckBox,
              // dropArrows,
            ],
          }),
        ],
      }),
      {
        fill: "#d3d3d3",
        stroke: "#888",
        cornerRadius: 5,
        scale: 0.8,
        xMargin: 15,
        yMargin: 10,
      },
    );

    cameraViewPanel.leftTop = new Vector2(540, 500);

    const runModeProperty = new Property<string>("run1");

    // Create four radio buttons for run modes
    const run1Radio = new AquaRadioButton(
      runModeProperty,
      "run1",
      new Text("Run 1", { fontSize: 16, fill: "black" }),
    );
    const run2Radio = new AquaRadioButton(
      runModeProperty,
      "run2",
      new Text("Run 2", { fontSize: 16, fill: "black" }),
    );
    const run3Radio = new AquaRadioButton(
      runModeProperty,
      "run3",
      new Text("Run 3", { fontSize: 16, fill: "black" }),
    );
    const run4Radio = new AquaRadioButton(
      runModeProperty,
      "run4",
      new Text("Run 4", { fontSize: 16, fill: "black" }),
    );

    const RunPanel = new Panel(
      new VBox({
        align: "center",
        spacing: 15,
        children: [run1Radio, run2Radio, run3Radio, run4Radio],
      }),
      {
        fill: "#d3d3d3",
        stroke: "#888",
        cornerRadius: 5,
        scale: 0.8,
        xMargin: 15,
        yMargin: 10,
      },
    );

    this.addChild(RunPanel);

    runModeProperty.link((mode: string) => {
      if (mode === "run1") {
        this.setElectricForceShow(false);
        this.setMagneticForceShow(false);
        this.setVelocityVectorShow(false);
        this.setMagneticFieldParticleShow(false);
      } else if (mode === "run2") {
        this.setElectricForceShow(true);
        this.setMagneticForceShow(false);
        this.setVelocityVectorShow(true);
        this.setMagneticFieldParticleShow(false);
      } else if (mode === "run3") {
        this.setElectricForceShow(false);
        this.setMagneticForceShow(true);
        this.setVelocityVectorShow(true);
        this.setMagneticFieldParticleShow(true);
      } else if (mode === "run4") {
        this.setElectricForceShow(true);
        this.setMagneticForceShow(true);
        this.setVelocityVectorShow(true);
        this.setMagneticFieldParticleShow(true);
      }
    })

    // Add to scene
    this.addChild(cameraViewPanel);

    RunPanel.leftTop = new Vector2(850, 500);

    this.cameraViewProperty.link((viewType: string) => {
      if (!this.simInit.value) {
        post(
          `view type: ${viewType}`,
          this.model.qproperty.value,
          this.model.massProperty.value,
          this.model.e0xProperty.value,
          this.model.e0yProperty.value,
          this.model.e0zProperty.value,
          this.model.b0xProperty.value,
          this.model.b0yProperty.value,
          this.model.b0zProperty.value,
          this.model.v0xProperty.value,
          this.model.v0yProperty.value,
          this.model.v0zProperty.value,
          this.model.showElectricFieldVectors,
          this.model.showMagneticFieldVectors,
          this.model.vdotx,
          this.model.vdoty,
          this.model.vdotz,
          this.cameraViewProperty.value,
        );
      }

      if (this.simulationFinished || this.playPause.value === false) {
        this.pendingCameraView = viewType;
        return;
      }
      // if (this.model.referenceModeProperty.value){
      this.chart3D.currentCameraView = viewType;
      this.chart3D.setCameraView(viewType);
      // } else if (!this.model.testModeProperty.value){ {
      //   this.chart3D.currentCameraView = "normal";
      //   this.chart3D.setCameraView("normal");

      // }

      if (viewType === "normal") {
        // this.setElectricForceShow(true);
        // this.setMagneticForceShow(true);

        // this.setVelocityVectorShow(true);
        // this.setMagneticFieldParticleShow(true);
      } else if (viewType === "electric") {
        this.setElectricForceShow(true);
        this.setVelocityVectorShow(true);
        this.setMagneticForceShow(false);
        this.setMagneticFieldParticleShow(false);
      } else if (viewType === "magnetic") {
        this.setMagneticForceShow(true);
        this.setVelocityVectorShow(true);
        this.setElectricForceShow(false);
        this.setMagneticFieldParticleShow(true);
      }
    });

    // Add this in SimScreenView.ts constructor, after the camera view panel

    // Helper function to create arrow symbol using Path (updated to support dashed)
    function createArrowSymbol(
      color: string,
      length: number = 30,
      dashed: boolean = false,
    ): any {
      if (dashed) {
        // Create dashed arrow using multiple small rectangles
        const dashLength = 4;
        const gapLength = 1;
        const totalSegments = Math.floor(
          (length - 8) / (dashLength + gapLength),
        );

        const dashElements = [];
        for (let i = 0; i < 11; i++) {
          const dash = new Rectangle(0, 1.5, dashLength, 5, {
            fill: i % 2 === 0 ? color : "transparent",
            cornerRadius: 1,
          });
          dashElements.push(dash);
        }

        const arrowHead = new Path(
          new Shape().moveTo(0, 0).lineTo(-9, -8).lineTo(-9, 8).close(),
          {
            fill: color,
          },
        );

        arrowHead.left = length - 8;

        const arrow = new HBox({
          spacing: 0,
          align: "center",
          children: [...dashElements, arrowHead],
        });

        return arrow;
      } else {
        // Original solid arrow
        const arrowBody = new Rectangle(0, -1.5, length - 8, 3, {
          fill: color,
          cornerRadius: 2,
        });

        const arrowHead = new Path(
          new Shape().moveTo(0, 0).lineTo(-9, -8).lineTo(-9, 8).close(),
          {
            fill: color,
          },
        );

        arrowHead.left = arrowBody.right;

        const arrow = new HBox({
          spacing: 0,
          align: "center",
          children: [arrowBody, arrowHead],
        });

        return arrow;
      }
    }

    // Update vector legend items to include dashed property
    const vectorLegendItems = [
      { color: "#0072B2", label: "Magnetic Field", symbol: "→", dashed: true },
      { color: "#0072B2", label: "Magnetic Force", symbol: "→", dashed: false }, // ✅ Make this dashed
      { color: "#CC5500", label: "Electric Field", symbol: "→", dashed: true },
      { color: "#CC5500", label: "Electric Force", symbol: "→", dashed: false },
      { color: "black", label: "Velocity", symbol: "→", dashed: false },
    ];

    const legendChildren = vectorLegendItems.map((item) => {
      return new HBox({
        spacing: 10,
        align: "center",
        children: [
          createArrowSymbol(item.color, 50, item.dashed), // ✅ Pass dashed parameter
          new Text(item.label, { fontSize: 15, fill: "black" }),
        ],
      });
    });

    const vectorLegend = new Panel(
      new VBox({
        align: "left",
        spacing: 8,
        children: [
          new Rectangle(0, 0, 180, 1, { fill: "white" }),
          ...legendChildren,
        ],
      }),
      {
        fill: "white",
        stroke: "white",
        cornerRadius: 5,
        xMargin: 12,
        yMargin: 10,
        scale: 0.75,
      },
    );

    vectorLegend.leftTop = new Vector2(300, 500);
    this.addChild(vectorLegend);

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

    // const showElectricFieldVector = new Property<boolean>(true);
    // const showMagneticFieldVector = new Property<boolean>(true);

    const ElectricFieldToggleBtn = new ToggleSwitch(
      this.model.showElectricFieldVectors,
      false,
      true,
      { scale: 0.8 },
    );
    const MagneticFieldToggleBtn = new ToggleSwitch(
      this.model.showMagneticFieldVectors,
      false,
      true,
      { scale: 0.8 },
    );

    const playPauseLabel = new Text("▶", {
      fontSize: 30,
      fill: "black",
      scale: 0.8,
    });
    const playPauseBtn = new RectangularPushButton({
      content: playPauseLabel,
      baseColor: "red",
      minWidth: 40,
      minHeight: 40,
      xMargin: 5,
      yMargin: 5,
      listener: () => {
        const newPlayState = !this.playPause.value;
        this.playPause.value = newPlayState;
        //   console.log(newPlayState)
        //   if (newPlayState) {
        //     this.simPaused.value = false;
        //   } else {
        //     this.simPaused.value = true;
        //     this.flushPendingCameraView();

        //   }
      },
    });

    playPauseBtn.leftTop = new Vector2(700, 20);
    this.playPause.link((play: boolean) => {
      this.playPause.value = play;
      playPauseLabel.string = play ? "⏸" : "▶";
      playPauseBtn.baseColor = play ? "#27BEF5" : "red";
      this.playPause.value = play;
      // console.log(this.playPause.value)
      if (this.playPause.value === true) {
        this.flushPendingCameraView();
      }
      // if (this.playPause.value === false && this.simulationFinished) {
      //   this.reset();
      //   this.model.reset();
      // }
    });
    window.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault(); // Prevent page scroll
        this.playPause.value = !this.playPause.value;
      }
    });

    const showElectricFieldVectorHBox = new HBox({
      align: "center",
      children: [
        new Text("Show Electric Field", {
          fontSize: 20,
          fill: "black",
          scale: 0.8,
        }),
        new Rectangle(0, 0, 40, 0),
        ElectricFieldToggleBtn,
      ],
    });
    // this.addChild(showElectricFieldVectorHBox);

    const showMagneticFieldVectorHBox = new HBox({
      align: "center",
      children: [
        new Text("Show Magnetic Field", {
          fontSize: 20,
          fill: "black",
          scale: 0.8,
        }),
        new Rectangle(0, 0, 30, 0),
        MagneticFieldToggleBtn,
      ],
    });

    // const modeHBox = new HBox({
    //   align: "center",
    //   children: [
    //     new Text("Vector Display Mode", { fontSize: 20, fill: "black" }),
    //     new Rectangle(0, 0, 10, 0),
    //     mode1Btn,
    //   ],
    // });

    const showVectorsPanel = new Panel(
      new VBox({
        align: "center",
        children: [
          showElectricFieldVectorHBox,
          // new Rectangle(0, 0, 0, 5),
          showMagneticFieldVectorHBox,
        ],
      }),
      { fill: "#d3d3d3", scale: 0.75, minHeight: 70, minWidth: 320 },
    );
    showVectorsPanel.leftTop = new Vector2(0, this.constantPanel.height + 5);
    this.addChild(showVectorsPanel);
    this.equationPanelBoxes.leftTop = new Vector2(
      0,
      showVectorsPanel.bottom + 5,
    );

    this.model.showElectricFieldVectors.link((show: boolean) => {
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
      if (!this.simInit.value) {
        post(
          `Electric Field show: ${show}`,
          this.model.q,
          this.model.mass,
          this.model.e0x,
          this.model.e0y,
          this.model.e0z,
          this.model.b0x,
          this.model.b0y,
          this.model.b0z,
          this.model.v0xProperty.value,
          this.model.v0yProperty.value,
          this.model.v0zProperty.value,
          this.model.showElectricFieldVectors.value,
          this.model.showMagneticFieldVectors.value,
          this.model.vdotx,
          this.model.vdoty,
          this.model.vdotz,
          this.cameraViewProperty.value,
        );
      }
    });
    this.model.showMagneticFieldVectors.link((show: boolean) => {
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
      if (!this.simInit.value) {
        post(
          `Magnetic Field show: ${show}`,
          this.model.q,
          this.model.mass,
          this.model.e0x,
          this.model.e0y,
          this.model.e0z,
          this.model.b0x,
          this.model.b0y,
          this.model.b0z,
          this.model.v0xProperty.value,
          this.model.v0yProperty.value,
          this.model.v0zProperty.value,
          this.model.showElectricFieldVectors.value,
          this.model.showMagneticFieldVectors.value,
          this.model.vdotx,
          this.model.vdoty,
          this.model.vdotz,
          this.cameraViewProperty.value,
        );
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
    // const resetAllButton = new ResetAllButton({
    const resetAllButton = new RectangularPushButton({
      content: new Text("⏮", { fontSize: 20, fill: "black" }),
      listener: () => {
        this.interruptSubtreeInput();
        model.reset();
        this.reset();
        this.playPause.value = true;
      },
      minWidth: 40,
      minHeight: 40,
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10,
    });
    // this.addChild(resetAllButton);
    // resetAllButton.baseColor = "red";

    const component = createComponent(model, resetAllButton, playPauseBtn);
    component.leftTop = new Vector2(0, this.equationPanelBoxes.bottom + 5);
    this.addChild(component);

    post(
      "Init",
      this.model.q,
      this.model.mass,
      this.model.e0x,
      this.model.e0y,
      this.model.e0z,
      this.model.b0x,
      this.model.b0y,
      this.model.b0z,
      this.model.v0xProperty.value,
      this.model.v0yProperty.value,
      this.model.v0zProperty.value,
      this.model.showElectricFieldVectors.value,
      this.model.showMagneticFieldVectors.value,
      this.model.vdotx,
      this.model.vdoty,
      this.model.vdotz,
      this.cameraViewProperty.value,
    );
    this.simInit.value = false;
  }

  public reset(value?: string): void {
    // this.resetTrail();

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
    this.model.qproperty.value = this.model.q;
    this.model.massProperty.value = this.model.mass;
    this.model.e0xProperty.value = this.model.e0x;
    this.model.e0yProperty.value = this.model.e0y;
    this.model.e0zProperty.value = this.model.e0z;
    this.model.b0xProperty.value = this.model.b0x;
    this.model.b0yProperty.value = this.model.b0y;
    this.model.b0zProperty.value = this.model.b0z;
    this.model.v0xProperty.value = this.model.v0x;
    this.model.v0yProperty.value = this.model.v0y;
    this.model.v0zProperty.value = this.model.v0z;

    post(
      value ? value : "reset",
      this.model.qproperty.value,
      this.model.massProperty.value,
      this.model.e0xProperty.value,
      this.model.e0yProperty.value,
      this.model.e0zProperty.value,
      this.model.b0xProperty.value,
      this.model.b0yProperty.value,
      this.model.b0zProperty.value,
      this.model.v0xProperty.value,
      this.model.v0yProperty.value,
      this.model.v0zProperty.value,
      this.model.showElectricFieldVectors.value,
      this.model.showMagneticFieldVectors.value,
      this.model.vdotx,
      this.model.vdoty,
      this.model.vdotz,
      this.cameraViewProperty.value,
    );

    this.xvelocityGraph.resetGraph();
    this.yvelocityGraph.resetGraph();
    this.zvelocityGraph.resetGraph();

    if (
      this.model.vdotx === "" ||
      this.model.vdoty === "" ||
      this.model.vdotz === ""
    ) {
      this.handleTestParticleRemoval();
    }

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

    this.simulationFinished = false;
    this.playPause.value = false;
    this.flushPendingCameraView();
    // if (this.pendingCameraView !== null) {
    //   const viewType = this.pendingCameraView;
    //   this.pendingCameraView = null; // Clear the pending change

    //   this.chart3D.currentCameraView = viewType;
    //   this.chart3D.setCameraView(viewType);

    //   if (viewType === "normal") {
    //     this.setElectricForceShow(true);
    //     this.setMagneticForceShow(true);
    //     this.setVelocityVectorShow(false);
    //     this.setMagneticFieldParticleShow(false);
    //   } else if (viewType === "electric") {
    //     this.setElectricForceShow(true);
    //     this.setVelocityVectorShow(true);
    //     this.setMagneticForceShow(false);
    //     this.setMagneticFieldParticleShow(false);
    //   } else if (viewType === "magnetic") {
    //     this.setMagneticForceShow(true);
    //     this.setVelocityVectorShow(true);
    //     this.setElectricForceShow(false);
    //     this.setMagneticFieldParticleShow(true);
    //   }
    // }

    this.run = true;
  }

  private applyCameraView(viewType: string): void {
    this.chart3D.currentCameraView = viewType;
    this.chart3D.setCameraView(viewType);

    if (viewType === "normal") {
      // this.setElectricForceShow(true);
      // this.setMagneticForceShow(true);
      // this.setVelocityVectorShow(false);
      // this.setMagneticFieldParticleShow(false);
    } else if (viewType === "electric") {
      this.setElectricForceShow(true);
      this.setVelocityVectorShow(true);
      this.setMagneticForceShow(false);
      this.setMagneticFieldParticleShow(false);
    } else if (viewType === "magnetic") {
      this.setMagneticForceShow(true);
      this.setVelocityVectorShow(true);
      this.setElectricForceShow(false);
      this.setMagneticFieldParticleShow(true);
    }
  }

  private flushPendingCameraView(): void {
    if (this.pendingCameraView !== null) {
      const viewType = this.pendingCameraView;
      this.pendingCameraView = null;
      this.applyCameraView(viewType);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public step(dt: number): void {
    // Called every frame, with the time since the last frame in seconds
    // this.run = true;

    if (
      !this.userInteracting &&
      this.run &&
      this.time < 4.9 &&
      this.playPause.value
    ) {
      // const values = rk4(
      //   false,
      //   "",
      //   "",
      //   "",
      //   [this.x1, this.y1, this.z1, this.vx1, this.vy1, this.vz1],
      //   0.001 * this.model.simSpeed,
      //   this.model.q,
      //   this.model.mass,
      //   this.model.e0x,
      //   this.model.e0y,
      //   this.model.e0z,
      //   this.model.b0x,
      //   this.model.b0y,
      //   this.model.b0z,
      // );
      const values = this.model.referenceRecordsProperty.value;
      // this.x1 = values[0];
      // this.y1 = values[1];
      // this.z1 = values[2];
      const idx = values.t.findIndex((t) => Math.abs(t - this.time) < 0.01);
      // console.log(idx, this.time);
      this.x1 = values.x[idx];
      this.y1 = values.y[idx];
      this.z1 = values.z[idx];
      this.vx1 = values.vx[idx];
      this.vy1 = values.vy[idx];
      this.vz1 = values.vz[idx];
      // [this.x1, this.y1, this.z1, this.vx1, this.vy1, this.vz1] = values as [
      //   number,
      //   number,
      //   number,
      //   number,
      //   number,
      //   number,
      // ];

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
        // const testValues = rk4(
        //   true,
        //   this.model.vdotx,
        //   this.model.vdoty,
        //   this.model.vdotz,
        //   [
        //     this.x1Test,
        //     this.y1Test,
        //     this.z1Test,
        //     this.vx1Test,
        //     this.vy1Test,
        //     this.vz1Test,
        //   ],
        //   0.001 * this.model.simSpeed,
        //   this.model.q,
        //   this.model.mass,
        //   this.model.e0x,
        //   this.model.e0y,
        //   this.model.e0z,
        //   this.model.b0x,
        //   this.model.b0y,
        //   this.model.b0z,
        // );
        const testValues = this.model.testRecordsProperty.value;
        const testIdx = testValues.t.findIndex(
          (t) => Math.abs(t - this.time) < 0.01,
        );
        this.x1Test = testValues.x[testIdx];
        this.y1Test = testValues.y[testIdx];
        this.z1Test = testValues.z[testIdx];
        this.vx1Test = testValues.vx[testIdx];
        this.vy1Test = testValues.vy[testIdx];
        this.vz1Test = testValues.vz[testIdx];
        // this.x1Test = testValues[0];
        // this.y1Test = testValues[1];
        // this.z1Test = testValues[2];
        // [
        //   this.x1Test,
        //   this.y1Test,
        //   this.z1Test,
        //   this.vx1Test,
        //   this.vy1Test,
        //   this.vz1Test,
        // ] = testValues as [number, number, number, number, number, number];
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
      // if (this.chart3D) {
      //   this.chart3D._matrixUpdatedThisFrame = false; // Reset flag
      // }
      this.updateValues(this.model.q, this.vx1, this.vy1, this.vz1);

      this.updateGraphs();
      this.time += 0.001 * this.model.simSpeed;
    }
    if (this.time >= 4.9) {
      // this.run = false;
      this.simulationFinished = true;
      this.playPause.value = false;
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
