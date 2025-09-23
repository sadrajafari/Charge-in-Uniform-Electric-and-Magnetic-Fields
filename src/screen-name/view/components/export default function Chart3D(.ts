export default function Chart3D(
  containerId: string,
  hasTest: boolean = false,
  xloc: number = 0,
  yloc: number = 0,
  zloc: number = 0,

  xlocTest: number = 0,
  ylocTest: number = 0,
  zlocTest: number = 0,

  magneticFieldX: number,
  magneticFieldY: number,
  magneticFieldZ: number,

  Xrange: [number, number] = [-10, 10],
  Yrange: [number, number] = [-10, 10],
  Zrange: [number, number] = [-10, 10],
) {
  const plotDiv = document.createElement("div");
  plotDiv.id = containerId;

  const plot = window.Plotly;

  const data: any = [
    {
      x: [],
      y: [],
      z: [],
      mode: "lines",
      type: "scatter3d",
      marker: { size: 5, color: "red" },
      name: "Trail",
      showlegend: false,
    },
    {
      x: [xloc],
      y: [yloc],
      z: [zloc],
      uirevision: "keep",
      mode: "markers", // Only markers, no lines
      type: "scatter3d",
      marker: { size: 8, color: "red" }, // Blue point
      name: "Particle",
      showlegend: false,
    },
  ];

  if (hasTest) {
    data.push({
      x: [],
      y: [],
      z: [],
      uirevision: "keep",
      mode: "lines",
      type: "scatter3d",
      marker: { size: 8, color: "blue" },
      name: "Test Particle",
      // showlegend: true,
    });

    data.push({
      x: [xlocTest],
      y: [ylocTest],
      z: [zlocTest],
      uirevision: "keep",
      mode: "markers",
      type: "scatter3d",
      marker: { size: 8, color: "blue" },
      name: "Test Particle",
      // showlegend: true,
    });
  }

  // Add a vector centered at midpoints of the axis ranges: (Xrange/2, Yrange/2, Zrange/2)
  {
    // Center from provided ranges
    const cx0 = (Xrange[0] + Xrange[1]) / 2;
    const cy0 = (Yrange[0] + Yrange[1]) / 2;
    const cz0 = (Zrange[0] + Zrange[1]) / 2;

    // Direction from magnetic field
    const bx = magneticFieldX ?? 0;
    const by = magneticFieldY ?? 0;
    const bz = magneticFieldZ ?? 0;
    let bmag = Math.hypot(bx, by, bz);
    let dx = bx, dy = by, dz = bz;
    if (bmag < 1e-9) { dx = 1; dy = 0; dz = 0; bmag = 1; }
    dx /= bmag; dy /= bmag; dz /= bmag; // unit direction

    // Per-axis spans
    const spanX0 = Math.abs(Xrange[1] - Xrange[0]) || 1;
    const spanY0 = Math.abs(Yrange[1] - Yrange[0]) || 1;
    const spanZ0 = Math.abs(Zrange[1] - Zrange[0]) || 1;

    // Normalize direction by spans to make screen-space length consistent, then map back
    let sdx = dx / spanX0;
    let sdy = dy / spanY0;
    let sdz = dz / spanZ0;
    let sNorm = Math.hypot(sdx, sdy, sdz);
    if (sNorm < 1e-9) { sdx = 1 / spanX0; sdy = 0; sdz = 0; sNorm = Math.hypot(sdx, sdy, sdz); }
    const ndx = sdx / sNorm;
    const ndy = sdy / sNorm;
    const ndz = sdz / sNorm;

    const lengthFrac = 0.24; // display length fraction (normalized space)
    const tipx = cx0 + ndx * lengthFrac * spanX0;
    const tipy = cy0 + ndy * lengthFrac * spanY0;
    const tipz = cz0 + ndz * lengthFrac * spanZ0;

    const headFrac = 0.32; // arrowhead fraction of total display length
    const hx = ndx * (lengthFrac * headFrac) * spanX0;
    const hy = ndy * (lengthFrac * headFrac) * spanY0;
    const hz = ndz * (lengthFrac * headFrac) * spanZ0;

    const headMagnitude = Math.hypot(hx, hy, hz);
    const coneSize = headMagnitude * 0.8; // Scale cone size relative to head vector

    // Shaft from center to tip (where cone is positioned)
    data.push({
      type: "scatter3d",
      mode: "lines",
      x: [cx0, tipx],
      y: [cy0, tipy],
      z: [cz0, tipz],
      line: { color: "green", width: 2 },
      name: "Center Vector",
      showlegend: false,
      uirevision: "keep",
    });

    // Arrowhead cone at tip; size scaled to head vector magnitude
    data.push({
      type: "cone",
      x: [tipx],
      y: [tipy],
      z: [tipz],
      u: [hx],
      v: [hy],
      w: [hz],
      anchor: "tip",
      colorscale: [ [0, "green"], [1, "green"] ],
      showscale: false,
      sizemode: "absolute",
      sizeref: coneSize,
      name: "Center Vector Head",
      showlegend: false,
      uirevision: "keep",
    } as any);
  }

  // Dynamic axis ranges based on simulation data
  plot.newPlot(
    plotDiv,
    data,
    {
      width: 700,
      height: 700,

      scene: {
        dragmode: "orbit",
        bgcolor: "white",
        aspectmode: "cube",
        uirevision: "keep", // Preserve camera state
        responsive: true,
        xaxis: {
          showline: true,
          linewidth: 3,
          // range: [-maxRange, maxRange],
          range: Xrange,
        },
        yaxis: {
          showline: true,
          linewidth: 3,
          // range: [-maxRange, maxRange],
          range: Yrange,
        },
        zaxis: {
          showline: true,
          linewidth: 3,
          // range: [-maxRange, maxRange],
          range: Zrange,
        },

        camera: {
          eye: { x: 1.8, y: 1.6, z: 1 },
        },
      } as any,
    },
    {
      displayModeBar: true,
      uiRevision: "keep", // Preserve camera state
      responsive: true,
      scrollZoom: true,
      doubleClick: "autosize",
    } as any,
  );

  return plotDiv;
}

export function updateChart3D(
  container: string,
  hasTest: boolean,

  xloc: number,
  yloc: number,
  zloc: number,

  trailX: number[] = [],
  trailY: number[] = [],
  trailZ: number[] = [],

  xTestloc: number = 0,
  yTestloc: number = 0,
  zTestloc: number = 0,

  trailXTest: number[] = [],
  trailYTest: number[] = [],
  trailZTest: number[] = [],
) {
  const plot = window.Plotly;

  const update = {
    x: [[xloc]],
    y: [[yloc]],
    z: [[zloc]],
  };
  plot.restyle(container, update, [1]);

  // 2) Update trail (trace index 0) with the whole path
  const trailUpdate = {
    x: [trailX],
    y: [trailY],
    z: [trailZ],
  };
  plot.restyle(container, trailUpdate, [0]);

  if (hasTest) {
    // Update test particle (now index 3)
    const testUpdate = {
      x: [[xTestloc]],
      y: [[yTestloc]],
      z: [[zTestloc]],
      opacity: 1,
    };
    plot.restyle(container, testUpdate, [3]);

    // Update test trail (now index 2)
    const testTrailUpdate = {
      x: [trailXTest],
      y: [trailYTest],
      z: [trailZTest],
      opacity: 1,
    };
    plot.restyle(container, testTrailUpdate, [2]);
  }
}
