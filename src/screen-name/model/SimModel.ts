import { Property } from "scenerystack";

export class SimModel {
  public qproperty: Property<number> = new Property(1);
  public massProperty: Property<number> = new Property(1);
  public e0xProperty: Property<number> = new Property(0);
  public e0yProperty: Property<number> = new Property(0);
  public e0zProperty: Property<number> = new Property(0);
  public b0xProperty: Property<number> = new Property(0);
  public b0yProperty: Property<number> = new Property(0);
  public b0zProperty: Property<number> = new Property(0);
  public v0xProperty: Property<number> = new Property(0);
  public v0yProperty: Property<number> = new Property(0);
  public v0zProperty: Property<number> = new Property(0);
  public vdotxProperty: Property<string> = new Property("0");
  public vdotyProperty: Property<string> = new Property("0");
  public vdotzProperty: Property<string> = new Property("0");
  public xdotProperty: Property<string> = new Property("0");
  public ydotProperty: Property<string> = new Property("0");
  public zdotProperty: Property<string> = new Property("0");

  public simSpeedProperty: Property<number> = new Property(1);

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

    this.simSpeedProperty.lazyLink(() => {
      this.simSpeed = this.simSpeedProperty.value;
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
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public step(_dt: number): void {
    // Called every frame, with the time since the last frame in seconds
  }
}
