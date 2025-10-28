export default async function post(
  action,
  q,
  m,
  ex,
  ey,
  ez,
  bx,
  by,
  bz,
  vx,
  vy,
  vz,
  showElectricFields,
  showMagneticFields,
  xAccEq,
  yAccEq,
  zAccEq,
  cameraView,
) {
  let url =
    "https://particleinuniformelecmag-default-rtdb.firebaseio.com/.json";
  let date = new Date();
  let data = {
    action: action,
    q: q,
    mass: m,
    Ex: ex,
    Ey: ey,
    Ez: ez,
    Bx: bx,
    By: by,
    Bz: bz,
    Vx: vx,
    Vy: vy,
    Vz: vz,
    showElectricFields: showElectricFields,
    showMagneticFields: showMagneticFields,
    xAcc: xAccEq,
    yAcc: yAccEq,
    zAcc: zAccEq,
    cameraView: cameraView,
    timestamp: date.toISOString(),
  };
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
}
