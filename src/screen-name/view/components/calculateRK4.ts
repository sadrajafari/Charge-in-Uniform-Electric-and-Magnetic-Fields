import rk4 from "./rk4";
// import { SimModel } from "../../model/SimModel.ts";

export default function calculateRK4(
  test: boolean,
  xdot: string,
  ydot: string,
  zdot: string,
  dt: number,
  q: number,
  m: number,
  Ex: number,
  Ey: number,
  Ez: number,
  Bx: number,
  By: number,
  Bz: number,
  vx: number,
  vy: number,
  vz: number,
) {
  let t = 0;
  let x = 0;
  let y = 0;
  let z = 0;
  
  const results = {
    t: [] as number[],
    x: [] as number[],
    y: [] as number[],
    z: [] as number[],
    vx: [] as number[],
    vy: [] as number[],
    vz: [] as number[],
  };

  if (test) {
    // console.log("q:", q, "m:", m, "Ex:", Ex, "Ey:", Ey, "Ez:", Ez, "Bx:", Bx, "By:", By, "Bz:", Bz, "vx:", vx, "vy:", vy, "vz:", vz);
  }
  while (t < 5) {
    const values = rk4(
      test,
      test ? xdot : "",
      test ? ydot : "",
      test ? zdot : "",
      [x, y, z, vx, vy, vz],
      dt,
      q,
      m,
      Ex,
      Ey,
      Ez,
      Bx,
      By,
      Bz,
    );
    results.t.push(t);
    results.x.push(x);
    results.y.push(y);
    results.z.push(z);
    results.vx.push(vx);
    results.vy.push(vy);
    results.vz.push(vz);
    [x, y, z, vx, vy, vz] = values;

    t += dt;
  }

  return results;
}
