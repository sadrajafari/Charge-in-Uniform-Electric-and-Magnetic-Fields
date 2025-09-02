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

const derive = (
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
  return [
    vx,
    vy,
    vz,
    vdotx(q, m, Ex, vy, Bz, vz, By),
    vdoty(q, m, Ey, vz, Bx, vx, Bz),
    vdotz(q, m, Ez, vx, By, vy, Bx),
  ];
};

export default function rk4(
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
  const k1 = derive(q, m, state, Ex, Ey, Ez, Bx, By, Bz);

  const state2 = state.map((val, i) => val + (dt * k1[i]) / 2);
  const k2 = derive(q, m, state2, Ex, Ey, Ez, Bx, By, Bz);

  const state3 = state.map((val, i) => val + (dt * k2[i]) / 2);
  const k3 = derive(q, m, state3, Ex, Ey, Ez, Bx, By, Bz);

  const state4 = state.map((val, i) => val + dt * k3[i]);
  const k4 = derive(q, m, state4, Ex, Ey, Ez, Bx, By, Bz);


  return state.map((val, i) => {
    return val + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  });
}


