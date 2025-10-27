import { Property } from "scenerystack";
import calculateRK4 from "../view/components/calculateRK4.ts";

type TrajectoryData = {
  t: number[];
  x: number[];
  y: number[];
  z: number[];
  vx: number[];
  vy: number[];
  vz: number[];
};

export class SimModel {
  public qproperty: Property<number> = new Property(1);
  public massProperty: Property<number> = new Property(1);
  public e0xProperty: Property<number> = new Property(0);
  public e0yProperty: Property<number> = new Property(0);
  public e0zProperty: Property<number> = new Property(5);
  public b0xProperty: Property<number> = new Property(0);
  public b0yProperty: Property<number> = new Property(0);
  public b0zProperty: Property<number> = new Property(3);
  public v0xProperty: Property<number> = new Property(10);
  public v0yProperty: Property<number> = new Property(0);
  public v0zProperty: Property<number> = new Property(0);
  public vdotxProperty: Property<string> = new Property(
    new URLSearchParams(window.location.search).get("formula") === "true"
      ? "\\frac{q}{m}\\left(E_x+v_y\\cdot B_z-v_z\\cdot B_y\\right)"
      : "",
  );
  public vdotyProperty: Property<string> = new Property(
    new URLSearchParams(window.location.search).get("formula") === "true"
      ? "\\frac{q}{m}\\left(E_y+v_z\\cdot B_x-v_x\\cdot B_z\\right)"
      : "",
  );
  public vdotzProperty: Property<string> = new Property(
    new URLSearchParams(window.location.search).get("formula") === "true"
      ? "\\frac{q}{m}\\left(E_z+v_x\\cdot B_y-v_y\\cdot B_x\\right)"
      : "",
  );
  public xdotProperty: Property<string> = new Property("");
  public ydotProperty: Property<string> = new Property("");
  public zdotProperty: Property<string> = new Property("");

  // Vector visualization properties
  public vectorDensityProperty: Property<number> = new Property(3);
  public numberOfSurfacesProperty: Property<number> = new Property(5);
  public hasTestProperty: Property<boolean> = new Property(false);

  public simSpeedProperty: Property<number> = new Property(1);
  public rowNumberProperty: Property<number> = new Property(3);
  public referenceRecordsProperty: Property<TrajectoryData> = new Property({
    t: [] as number[],
    x: [] as number[],
    y: [] as number[],
    z: [] as number[],
    vx: [] as number[],
    vy: [] as number[],
    vz: [] as number[],
  });
  public testRecordsProperty: Property<TrajectoryData> = new Property({
    t: [] as number[],
    x: [] as number[],
    y: [] as number[],
    z: [] as number[],
    vx: [] as number[],
    vy: [] as number[],
    vz: [] as number[],
  });



  q: number;
  mass: number;
  e0x: number;
  e0y: number;
  e0z: number;
  b0x: number;
  b0y: number;
  b0z: number;
  v0x: number;
  v0y: number;
  v0z: number;
  vdotx: string;
  vdoty: string;
  vdotz: string;
  xdot: string;
  ydot: string;
  zdot: string;
  simSpeed: number;
  vectorDensity: number;
  numberOfSurfaces: number;
  Xrange: [number, number] = [-1, 1];
  Yrange: [number, number] = [-1, 1];
  Zrange: [number, number] = [-1, 1];
  hasTest: boolean = false;
  rowNumber: number = 3;
  updateRows: any;
  referenceRecords: TrajectoryData = {
    t: [],
    x: [],
    y: [],
    z: [],
    vx: [],
    vy: [],
    vz: [],
  };
  testRecords: TrajectoryData = {
    t: [],
    x: [],
    y: [],
    z: [],
    vx: [],
    vy: [],
    vz: [],
  };
  compiledVdotx: any;
  compiledVdoty: any;
  compiledVdotz: any;

  constructor() {
    this.q = this.qproperty.value;
    this.mass = this.massProperty.value;
    this.e0x = this.e0xProperty.value;
    this.e0y = this.e0yProperty.value;
    this.e0z = this.e0zProperty.value;
    this.b0x = this.b0xProperty.value;
    this.b0y = this.b0yProperty.value;
    this.b0z = this.b0zProperty.value;
    this.v0x = this.v0xProperty.value;
    this.v0y = this.v0yProperty.value;
    this.v0z = this.v0zProperty.value;
    this.vdotx = this.vdotxProperty.value;
    this.vdoty = this.vdotyProperty.value;
    this.vdotz = this.vdotzProperty.value;
    this.xdot = this.xdotProperty.value;
    this.ydot = this.ydotProperty.value;
    this.zdot = this.zdotProperty.value;
    this.simSpeed = this.simSpeedProperty.value;
    this.vectorDensity = this.vectorDensityProperty.value;
    this.numberOfSurfaces = this.numberOfSurfacesProperty.value;
    this.hasTest = this.hasTestProperty.value;
    this.rowNumber = this.rowNumberProperty.value;
    this.referenceRecords = this.referenceRecordsProperty.value;
    this.testRecords = this.testRecordsProperty.value;
    this.compiledVdotx = this.compiledVdotx;;
    this.compiledVdoty = this.compiledVdoty;
    this.compiledVdotz = this.compiledVdotz;

    this.simSpeedProperty.lazyLink(() => {
      this.simSpeed = this.simSpeedProperty.value;
    });

    this.vectorDensityProperty.lazyLink(() => {
      this.vectorDensity = this.vectorDensityProperty.value;
    });

    this.numberOfSurfacesProperty.lazyLink(() => {
      this.numberOfSurfaces = this.numberOfSurfacesProperty.value;
    });
  }
  public reset(): void {
    // Called when the user presses the reset-all button
    this.q = this.qproperty.value;
    this.mass = this.massProperty.value;
    this.e0x = this.e0xProperty.value;
    this.e0y = this.e0yProperty.value;
    this.e0z = this.e0zProperty.value;
    this.b0x = this.b0xProperty.value;
    this.b0y = this.b0yProperty.value;
    this.b0z = this.b0zProperty.value;
    this.v0x = this.v0xProperty.value;
    this.v0y = this.v0yProperty.value;
    this.v0z = this.v0zProperty.value;
    this.vdotx = this.vdotxProperty.value;
    this.vdoty = this.vdotyProperty.value;
    this.vdotz = this.vdotzProperty.value;
    this.xdot = this.xdotProperty.value;
    this.ydot = this.ydotProperty.value;
    this.zdot = this.zdotProperty.value;
    this.vectorDensity = this.vectorDensityProperty.value;
    this.numberOfSurfaces = this.numberOfSurfacesProperty.value;
    if (this.vdotx !== "" && this.vdoty !== "" && this.vdotz !== "") {
      this.hasTest = true;
      // console.log("has test");
    } else {
      this.hasTest = false;
    }

    if (this.hasTest) {
      // @ts-ignore
      this.compiledVdotx = evaluatex(this.vdotx, { latex: true })
      // @ts-ignore
      this.compiledVdoty = evaluatex(this.vdoty, { latex: true })
      // @ts-ignore
      this.compiledVdotz = evaluatex(this.vdotz, { latex: true })
      
    }

    const values = calculateRK4(
      false,
      "",
      "",
      "",
      0.0001,
      this.qproperty.value,
      this.massProperty.value,
      this.e0xProperty.value,
      this.e0yProperty.value,
      this.e0zProperty.value,
      this.b0xProperty.value,
      this.b0yProperty.value,
      this.b0zProperty.value,
      this.v0xProperty.value,
      this.v0yProperty.value,
      this.v0zProperty.value,
    );

    this.referenceRecordsProperty.value = values;

    if (this.hasTest) {
      const testValues = calculateRK4(
        true,
        // this.vdotx,
        // this.vdoty,
        // this.vdotz,
        this.compiledVdotx,
        this.compiledVdoty,
        this.compiledVdotz,
        0.0001,
        this.qproperty.value,
        this.massProperty.value,
        this.e0xProperty.value,
        this.e0yProperty.value,
        this.e0zProperty.value,
        this.b0xProperty.value,
        this.b0yProperty.value,
        this.b0zProperty.value,
        this.v0xProperty.value,
        this.v0yProperty.value,
        this.v0zProperty.value,
      );
      this.testRecordsProperty.value = testValues;
      // console.log("heloo  ")
      // console.log(values, testValues);
      this.Xrange = [
        Math.min(...values.x, ...testValues.x),
        Math.max(...values.x, ...testValues.x),
      ];
      this.Yrange = [
        Math.min(...values.y, ...testValues.y),
        Math.max(...values.y, ...testValues.y),
      ];
      this.Zrange = [
        Math.min(...values.z, ...testValues.z),
        Math.max(...values.z, ...testValues.z),
      ];
    } else {
      this.Xrange = [Math.min(...values.x), Math.max(...values.x)];
      this.Yrange = [Math.min(...values.y), Math.max(...values.y)];
      this.Zrange = [Math.min(...values.z), Math.max(...values.z)];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public step(_dt: number): void {
    // Called every frame, with the time since the last frame in seconds
  }
}
