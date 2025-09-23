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

  Xrange: [number, number] = [-1, 1],
  Yrange: [number, number] = [-1, 1],
  Zrange: [number, number] = [-1, 1],

  vectorGridSize: number = 1, // New parameter to control grid size
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
      showlegend: false,
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
      showlegend: false,
    });
  }

  // Add a surface of vectors in a 3x3 grid
  {
    // Direction from magnetic field
    const bx = magneticFieldX ?? 0;
    const by = magneticFieldY ?? 0;
    const bz = magneticFieldZ ?? 0;
    let bmag = Math.hypot(bx, by, bz);
    let dx = bx,
      dy = by,
      dz = bz;
    if (bmag < 1e-9) {
      dx = 1;
      dy = 0;
      dz = 0;
      bmag = 1;
    }
    dx /= bmag;
    dy /= bmag;
    dz /= bmag; // unit direction

    // Per-axis spans
    const spanX0 = Math.abs(Xrange[1] - Xrange[0]) || 1;
    const spanY0 = Math.abs(Yrange[1] - Yrange[0]) || 1;
    const spanZ0 = Math.abs(Zrange[1] - Zrange[0]) || 1;

    // Normalize direction by spans to make screen-space length consistent
    let sdx = dx / spanX0;
    let sdy = dy / spanY0;
    let sdz = dz / spanZ0;
    let sNorm = Math.hypot(sdx, sdy, sdz);
    if (sNorm < 1e-9) {
      sdx = 1 / spanX0;
      sdy = 0;
      sdz = 0;
      sNorm = Math.hypot(sdx, sdy, sdz);
    }
    const ndx = sdx / sNorm;
    const ndy = sdy / sNorm;
    const ndz = sdz / sNorm;

    const lengthFrac = 0.16; // smaller vectors for grid
    const headFrac = 0.32;

    // Create NxN grid of vectors (configurable size)
    const gridSize = Math.max(1, vectorGridSize); // Ensure at least 1x1 grid
    const gridSpacing = 0.4; // spacing between vectors as fraction of axis range

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Calculate grid position
        const centerX = (Xrange[0] + Xrange[1]) / 2;
        const centerY = (Yrange[0] + Yrange[1]) / 2;
        const centerZ = (Zrange[0] + Zrange[1]) / 2;

        const offsetX = (i - (gridSize - 1) / 2) * gridSpacing * spanX0;
        const offsetY = (j - (gridSize - 1) / 2) * gridSpacing * spanY0;

        const cx = centerX + offsetX;
        const cy = centerY + offsetY;
        const cz = centerZ;

        // Calculate vector tip
        const tipx = cx + ndx * lengthFrac * spanX0;
        const tipy = cy + ndy * lengthFrac * spanY0;
        const tipz = cz + ndz * lengthFrac * spanZ0;

        // Calculate head vector
        const hx = ndx * (lengthFrac * headFrac) * spanX0;
        const hy = ndy * (lengthFrac * headFrac) * spanY0;
        const hz = ndz * (lengthFrac * headFrac) * spanZ0;

        const headMagnitude = Math.hypot(hx, hy, hz);
        const coneSize = headMagnitude * 0.8;

        // Add shaft
        data.push({
          type: "scatter3d",
          mode: "lines",
          x: [cx, tipx],
          y: [cy, tipy],
          z: [cz, tipz],
          line: { color: "green", width: 2 },
          name: `Vector_${i}_${j}`,
          showlegend: false,
          uirevision: "keep",
        });

        // Add cone head
        data.push({
          type: "cone",
          x: [tipx],
          y: [tipy],
          z: [tipz],
          u: [hx],
          v: [hy],
          w: [hz],
          anchor: "tip",
          colorscale: [
            [0, "green"],
            [1, "green"],
          ],
          showscale: false,
          sizemode: "absolute",
          sizeref: coneSize,
          name: `Vector_Head_${i}_${j}`,
          showlegend: false,
          uirevision: "keep",
        } as any);
      }
    }
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
        hovermode: false, // Disable hover functionality
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

  // Recompute vector grid on relayout to keep visual size consistent across axis changes
  {
    const pltDiv: any = plotDiv as any;
    pltDiv.on?.("plotly_relayout", () => {
      const layout: any = pltDiv.layout || {};
      const xr: [number, number] = layout.scene?.xaxis?.range ?? Xrange;
      const yr: [number, number] = layout.scene?.yaxis?.range ?? Yrange;
      const zr: [number, number] = layout.scene?.zaxis?.range ?? Zrange;

      // Recalculate direction and spans
      const bx = magneticFieldX ?? 0;
      const by = magneticFieldY ?? 0;
      const bz = magneticFieldZ ?? 0;
      let bmag = Math.hypot(bx, by, bz);
      let dx = bx,
        dy = by,
        dz = bz;
      if (bmag < 1e-9) {
        dx = 1;
        dy = 0;
        dz = 0;
        bmag = 1;
      }
      dx /= bmag;
      dy /= bmag;
      dz /= bmag;

      const spanX = Math.abs(xr[1] - xr[0]) || 1;
      const spanY = Math.abs(yr[1] - yr[0]) || 1;
      const spanZ = Math.abs(zr[1] - zr[0]) || 1;

      let sdx = dx / spanX;
      let sdy = dy / spanY;
      let sdz = dz / spanZ;
      let sNorm = Math.hypot(sdx, sdy, sdz);
      if (sNorm < 1e-9) {
        sdx = 1 / spanX;
        sdy = 0;
        sdz = 0;
        sNorm = Math.hypot(sdx, sdy, sdz);
      }
      const ndx = sdx / sNorm;
      const ndy = sdy / sNorm;
      const ndz = sdz / sNorm;

      const lengthFrac = 0.16;
      const headFrac = 0.32;
      const gridSize = Math.max(1, vectorGridSize); // Use the parameter
      const gridSpacing = 0.4;

      // Update each vector in the grid
      const shaftUpdates: any[] = [];
      const coneUpdates: any[] = [];
      const shaftIndices: number[] = [];
      const coneIndices: number[] = [];

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const vectorName = `Vector_${i}_${j}`;
          const headName = `Vector_Head_${i}_${j}`;

          const vecIdx =
            pltDiv?.data?.findIndex((t: any) => t.name === vectorName) ?? -1;
          const headIdx =
            pltDiv?.data?.findIndex((t: any) => t.name === headName) ?? -1;

          if (vecIdx < 0 || headIdx < 0) continue;

          // Recalculate grid position
          const centerX = (xr[0] + xr[1]) / 2;
          const centerY = (yr[0] + yr[1]) / 2;
          const centerZ = (zr[0] + zr[1]) / 2;

          const offsetX = (i - (gridSize - 1) / 2) * gridSpacing * spanX;
          const offsetY = (j - (gridSize - 1) / 2) * gridSpacing * spanY;

          const cx = centerX + offsetX;
          const cy = centerY + offsetY;
          const cz = centerZ;

          const tipx = cx + ndx * lengthFrac * spanX;
          const tipy = cy + ndy * lengthFrac * spanY;
          const tipz = cz + ndz * lengthFrac * spanZ;

          const hx = ndx * (lengthFrac * headFrac) * spanX;
          const hy = ndy * (lengthFrac * headFrac) * spanY;
          const hz = ndz * (lengthFrac * headFrac) * spanZ;

          const headMagnitude = Math.hypot(hx, hy, hz);
          const coneSize = headMagnitude * 0.8;

          // Collect updates for batching
          shaftUpdates.push({
            x: [[cx, tipx]],
            y: [[cy, tipy]],
            z: [[cz, tipz]],
            "line.width": 2,
          });
          shaftIndices.push(vecIdx);

          coneUpdates.push({
            x: [[tipx]],
            y: [[tipy]],
            z: [[tipz]],
            u: [[hx]],
            v: [[hy]],
            w: [[hz]],
            sizeref: coneSize,
            sizemode: "absolute",
          });
          coneIndices.push(headIdx);
        }
      }

      // Batch update all shafts and cones
      if (shaftUpdates.length > 0) {
        (window as any).Plotly.restyle(pltDiv, shaftUpdates, shaftIndices);
      }
      if (coneUpdates.length > 0) {
        (window as any).Plotly.restyle(pltDiv, coneUpdates, coneIndices);
      }
    });
  }

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
