// vdotx equation
const vdotx = (
  q: number,
  m: number,
  Ex: number,
  vy: number,
  Bz: number,
  vz: number,
  By: number,
) => {
  return (q / m) * (Ex + vy * Bz - vz * By);
};

// vdoty equation
// q/m *(Ey + vz*Bx - vx*Bz)
const vdoty = (
  q: number,
  m: number,
  Ey: number,
  vz: number,
  Bx: number,
  vx: number,
  Bz: number,
) => {
  return (q / m) * (Ey + vz * Bx - vx * Bz);
};

// vdotz equation
// q/m *(Ez + vx*By - vy*Bx)
const vdotz = (
  q: number,
  m: number,
  Ez: number,
  vx: number,
  By: number,
  vy: number,
  Bx: number,
) => {
  return (q / m) * (Ez + vx * By - vy * Bx);
};

const evaluateFunction = (
  compiledOrEquation: any,
  // equation: string,
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
) => {
  const compiled =
    typeof compiledOrEquation === "string"
      ? // @ts-ignore
        evaluatex(compiledOrEquation, { latex: true })
      : compiledOrEquation;
  // @ts-ignore
  // return evaluatex(equation, { latex: true })({
  //   q,
  //   m,
  //   E_x: Ex,
  //   E_y: Ey,
  //   E_z: Ez,
  //   B_x: Bx,
  //   B_y: By,
  //   B_z: Bz,
  //   v_x: vx,
  //   v_y: vy,
  //   v_z: vz,
  // });
  return compiled({
    q, m,
    E_x: Ex, E_y: Ey, E_z: Ez,
    B_x: Bx, B_y: By, B_z: Bz,
    v_x: vx, v_y: vy, v_z: vz,
  });
};

const derive = (
  test: boolean = false,
  xdot: string,
  ydot: string,
  zdot: string,
  q: number,
  m: number,
  state: number[],
  Ex: number,
  Ey: number,
  Ez: number,
  Bx: number,
  By: number,
  Bz: number,
) => {
  const [x, y, z, vx, vy, vz] = state;

  // placeholder for derived calculations
  if (test) {
    return [
      vx,
      vy,
      vz,
      evaluateFunction(xdot, q, m, Ex, Ey, Ez, Bx, By, Bz, vx, vy, vz),
      evaluateFunction(ydot, q, m, Ex, Ey, Ez, Bx, By, Bz, vx, vy, vz),
      evaluateFunction(zdot, q, m, Ex, Ey, Ez, Bx, By, Bz, vx, vy, vz),
      
    ];
  } else {
    return [
      vx,
      vy,
      vz,
      vdotx(q, m, Ex, vy, Bz, vz, By),
      vdoty(q, m, Ey, vz, Bx, vx, Bz),
      vdotz(q, m, Ez, vx, By, vy, Bx),
    ];
  }
};

export default function rk4(
  test: boolean,
  xdot: string,
  ydot: string,
  zdot: string,
  state: number[],
  dt: number,
  q: number,
  m: number,
  Ex: number,
  Ey: number,
  Ez: number,
  Bx: number,
  By: number,
  Bz: number,
): number[] {
  // console.log(`rk4: ${values}`);
  const k1 = derive(
    test,
    xdot,
    ydot,
    zdot,
    q,
    m,
    state,
    Ex,
    Ey,
    Ez,
    Bx,
    By,
    Bz,
  );

  const state2 = state.map((val, i) => val + (dt * k1[i]) / 2);
  const k2 = derive(
    test,
    xdot,
    ydot,
    zdot,
    q,
    m,
    state2,
    Ex,
    Ey,
    Ez,
    Bx,
    By,
    Bz,
  );

  const state3 = state.map((val, i) => val + (dt * k2[i]) / 2);
  const k3 = derive(
    test,
    xdot,
    ydot,
    zdot,
    q,
    m,
    state3,
    Ex,
    Ey,
    Ez,
    Bx,
    By,
    Bz,
  );

  const state4 = state.map((val, i) => val + dt * k3[i]);
  const k4 = derive(
    test,
    xdot,
    ydot,
    zdot,
    q,
    m,
    state4,
    Ex,
    Ey,
    Ez,
    Bx,
    By,
    Bz,
  );

  return state.map((val, i) => {
    return val + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  });
}
