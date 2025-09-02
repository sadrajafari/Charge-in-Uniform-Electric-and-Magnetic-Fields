export default function Chart3D(
  containerId: string,
  xloc: number = 0,
  yloc: number = 0,
  zloc: number = 0,

  exloc: number,
  eyloc: number,
  ezloc: number,

  mxloc: number,
  myloc: number,
  mzloc: number,

  hasTest: boolean = false,
) {
  const plotDiv = document.createElement("div");
  plotDiv.id = containerId;
  const plot = window.Plotly;

  if (!hasTest) {
    plot.newPlot(
      plotDiv,
      [
        {
          x: [],
          y: [],
          z: [],
          mode: "lines",
          type: "scatter3d",
          marker: { size: 5, color: "red" },
          name: "Trail",
          showlegend: true,
        },
        {
          x: [xloc],
          y: [yloc],
          z: [zloc],
          uirevision: "keep",
          mode: "markers", // Only markers, no lines
          type: "scatter3d",
          marker: { size: 8, color: "blue" }, // Blue point
          name: "Particle",
          showlegend: true,
        },
        {
          x: [xloc, xloc + exloc],
          y: [yloc, yloc + eyloc],
          z: [zloc, zloc + ezloc],
          
          mode: "lines+markers",
          type: "scatter3d",
          marker: {
            size: [0, 10],
            color: "purple",
            symbol: ["circle", "diamond"],
          },
        },
        {
          x: [xloc, xloc - mxloc],
          y: [yloc, yloc + myloc],
          z: [zloc, zloc + mzloc],
          mode: "lines+markers",
          type: "scatter3d",
          line: { color: "green", width: 6 },
          marker: {
            size: [0, 10],
            color: "green",
            symbol: ["circle", "diamond"],
          },
          name: "Magnetic Field",
          showlegend: true,
        },
      ],
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
            // tickmode: "linear",
            showline: true,
            linewidth: 3,
          },
          yaxis: {
            // tickmode: "linear",
            showline: true,
            linewidth: 3,
          },
          zaxis: {
            // tickmode: "linear",
            showline: true,
            linewidth: 3,
          },

          camera: {
            eye: { x: 1.8, y: 1.6, z: 1 },
          },
        },
      },
      {
        displayModeBar: true,
        uiRevision: "keep", // Preserve camera state
        responsive: true,
        scrollZoom: true,
        doubleClick: "autosize",
      },
    );
  }

  return plotDiv;
}

export function updateChart3D(
  container: string,
  xloc: number,
  yloc: number,
  zloc: number,

  exloc: number,
  eyloc: number,
  ezloc: number,

  mxloc: number,
  myloc: number,
  mzloc: number,
  trailX: number[] = [],
  trailY: number[] = [],
  trailZ: number[] = [],
) {
  const plot = window.Plotly;

  const update = {
    x: [[xloc]],
    y: [[yloc]],
    z: [[zloc]],
  };
  // plot.restyle(container, update, [1]);
  plot.restyle(container, update, [1]);

  // 2) Update trail (trace index 0) with the whole path
  const trailUpdate = {
    x: [trailX],
    y: [trailY],
    z: [trailZ],
  };
  plot.restyle(container, trailUpdate, [0]);

  // 3) Update electric field vector (trace index 2)
  const electricFieldUpdate = {
    x: [[xloc, xloc + exloc]],
    y: [[yloc, yloc + eyloc]],
    z: [[zloc, zloc + ezloc]],
  };
  plot.restyle(container, electricFieldUpdate, [2]);

  // 4) Update magnetic field vector (trace index 3)
  const magneticFieldUpdate = {
    x: [[xloc, xloc - mxloc]],
    y: [[yloc, yloc + myloc]],
    z: [[zloc, zloc + mzloc]],
  };
  plot.restyle(container, magneticFieldUpdate, [3]);
}
