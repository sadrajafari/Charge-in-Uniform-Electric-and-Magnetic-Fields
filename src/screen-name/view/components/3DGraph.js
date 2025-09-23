// Three.js 3D Graph with Particle Motion
export default class ThreeDGraph {
  constructor(width, height, showTestParticle = false) {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.particle = null;
    this.trail = [];
    this.trailMesh = null;
    this.time = 0;
    this.particleSpeed = 0.02;
    this.maxTrailLength = 4500;
    this.width = width;
    this.height = height;
    this.group = null;
    this.showTestParticle = showTestParticle;

    // Define axis ranges - you can modify these values (can include negative values)
    this.xRange = { min: -5, max: 5 }; // X-axis range (example with negative values)
    this.yRange = { min: -10, max: 10 }; // Y-axis range (example with negative values)
    this.zRange = { min: -5, max: 550 }; // Z-axis range

    // Define the standard visual length for all axes (same physical length)
    this.axisLength = 10; // All axes will be this length visually

    this.simState = [0, 0, 0, 9, 100, 10]; // initial [x, y, z, vx, vy, vz]
    this.simTime = 0;
    this.simulationRunning = true; // Start simulation immediately for demo
    this.showElectricField = true; // New property for toggling
    this.showMagneticField = true; // New property for toggling magnetic field

    this.init();
    // this.updateRange();
    this.createGraph();
    this.createParticle();
    if (this.showTestParticle) {
      this.createTestParticle();
    }
    this.showFieldSurfaces(3);
    this.renderer.render(this.scene, this.camera);
    this.animate();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("white");
    // this.scene.rotation.x = (3 * Math.PI) / 2;

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75, // Field of view
      this.width / this.height, // Aspect ratio
      0.1, // Near clipping plane
      1000, // Far clipping plane
    );
    this.camera.position.set(14, 10, -15);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x0a0a0a);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Add renderer to DOM
    document.getElementById("graphDiv").appendChild(this.renderer.domElement);

    // Add orbit controls
    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement,
    );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 5); // Look at center of z-axis
    this.controls.minPolarAngle = Math.PI / 4; // Lower vertical limit
    this.controls.maxPolarAngle = Math.PI / 2; // Upper vertical limit
    this.controls.minAzimuthAngle = Math.PI / 2; // Left horizontal limit
    this.controls.maxAzimuthAngle = -Math.PI; // Right horizontal limit

    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.group.rotation.x = (3 * Math.PI) / 2;
    this.group.position.set(3, 1, 1);

    // Add lights
    // this.addLights();

    // this.renderer.render(this.scene, this.camera);

    // Handle window resize
    // window.addEventListener("resize", () => this.onWindowResize(), false);
  }

  addLights() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    // Directional light for better visibility
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);

    // Point light to highlight the particle
    const pointLight = new THREE.PointLight(0x00aaff, 0.7, 50);
    pointLight.position.set(0, 5, 0);
    this.scene.add(pointLight);
  }

  createGraph() {
    // Create coordinate axes
    this.createAxes();

    // Create custom grid planes for (x, y), (x, z), (y, z)
    this.createCustomGrids();

    // Add axis labels
    this.createAxisLabels();

    // const bx = parseFloat(document.getElementById("slider-bx")?.value || 50);
    // const by = parseFloat(document.getElementById("slider-by")?.value || 10);
    // const bz = parseFloat(document.getElementById("slider-bz")?.value || 100);
    // this.showMagneticFieldVector(this.Bx, this.By, this.Bz);
    // const ex = parseFloat(document.getElementById("slider-ex")?.value || 0);
    // const ey = parseFloat(document.getElementById("slider-ey")?.value || 0);
    // const ez = parseFloat(document.getElementById("slider-ez")?.value || 10);
    // this.showElectricFieldVector(this.Ex, this.Ey, this.Ez);
  }

  updateFieldVector(Bx, By, Bz, Ex, Ey, Ez) {
    this.Bx = Bx;
    this.By = By;
    this.Bz = Bz;
    this.Ex = Ex;
    this.Ey = Ey;
    this.Ez = Ez;
    // this.showMagneticFieldVector(Bx, By, Bz);
    // this.showElectricFieldVector(Ex, Ey, Ez);
    if (Bx === 0 && By === 0 && Bz === 0) {
      this.group.remove(this.bFieldArrow);
    }
    if (Ex === 0 && Ey === 0 && Ez === 0) {
      this.group.remove(this.eFieldArrow);
    }
    this.showFieldSurfaces(3, Bx, By, Bz, Ex, Ey, Ez);
  }

  toggleElectricField(show) {
    this.showElectricField = show;
    // Main vector
    if (this.eFieldArrow) {
      this.eFieldArrow.visible = show;
    }
    // Surface arrows
    if (this.fieldSurfaceArrows && this.fieldSurfaceArrows.length > 0) {
      this.fieldSurfaceArrows.forEach((arrow) => {
        // Only hide electric field arrows (color: maroon)
        if (arrow instanceof THREE.ArrowHelper && arrow.cone && arrow.line) {
          // Check color (maroon)
          if (arrow.cone.material.color.getStyle() === "maroon") {
            arrow.visible = show;
          }
        } else if (
          arrow.material &&
          arrow.material.color &&
          arrow.material.color.getStyle() === "maroon"
        ) {
          arrow.visible = show;
        }
      });
    }
  }

  toggleMagneticField(show) {
    this.showMagneticField = show;
    // Main vector
    if (this.bFieldArrow) {
      this.bFieldArrow.visible = show;
    }
    // Surface arrows
    if (this.fieldSurfaceArrows && this.fieldSurfaceArrows.length > 0) {
      this.fieldSurfaceArrows.forEach((arrow) => {
        // Only hide magnetic field arrows (color: teal)
        if (arrow instanceof THREE.ArrowHelper && arrow.cone && arrow.line) {
          if (arrow.cone.material.color.getStyle() === "teal") {
            arrow.visible = show;
          }
        } else if (
          arrow.material &&
          arrow.material.color &&
          arrow.material.color.getStyle() === "teal"
        ) {
          arrow.visible = show;
        }
      });
    }
  }

  showElectricFieldVector(Ex = this.Ex, Ey = this.Ey, Ez = this.Ez) {
    // Remove previous arrow if it exists
    if (this.eFieldArrow) {
      this.group.remove(this.eFieldArrow);
      this.eFieldArrow = null;
    }
    // Only create arrow if at least one component is nonzero
    if (Ex === 0 && Ey === 0 && Ez === 0) return;

    // Calculate the center of the axes in visual coordinates
    const centerX = this.axisLength / 2;
    const centerY = this.axisLength / 2;
    const centerZ = this.axisLength / 2;

    // Create direction vector (normalize for ArrowHelper)
    const dir = new THREE.Vector3(Ex, Ey, Ez).normalize();

    // Set arrow length proportional to field magnitude
    const length = 1;

    // Create the arrow
    this.eFieldArrow = new THREE.ArrowHelper(
      dir,
      new THREE.Vector3(centerX, centerY, centerZ),
      length,
      0x0000ff, // color (blue)
      0.3, // headLength
      0.2, // headWidth
    );
    this.eFieldArrow.visible = this.showElectricField;
    this.group.add(this.eFieldArrow);
  }

  showMagneticFieldVector(Bx = this.Bx, By = this.By, Bz = this.Bz) {
    // Remove previous arrow if it exists
    if (this.bFieldArrow) {
      this.group.remove(this.bFieldArrow);
      this.bFieldArrow = null;
    }
    // Only create arrow if at least one component is nonzero
    if (Bx === 0 && By === 0 && Bz === 0) return;

    // Calculate the center of the axes in visual coordinates
    const centerX = this.axisLength / 2;
    const centerY = this.axisLength / 2;
    const centerZ = this.axisLength / 2;

    // Create direction vector (normalize for ArrowHelper)
    const dir = new THREE.Vector3(Bx, By, Bz).normalize();

    // Set arrow length proportional to field magnitude
    // const length = Math.max(1, Math.sqrt(Bx * Bx + By * By + Bz * Bz) * 0.1);
    const length = 1;

    // Create the arrow
    this.bFieldArrow = new THREE.ArrowHelper(
      dir,
      new THREE.Vector3(centerX, centerY, centerZ),
      length,
      "purple",
      0.3,
      0.2,
    );
    this.bFieldArrow.visible = this.showMagneticField;
    this.group.add(this.bFieldArrow);
  }

  // rk4(f, y, t, dt) {
  //   const n = y.length;

  //   const k1 = f(t, y);
  //   const y2 = y.map((yi, i) => yi + 0.5 * dt * k1[i]);

  //   const k2 = f(t + dt / 2, y2);
  //   const y3 = y.map((yi, i) => yi + 0.5 * dt * k2[i]);

  //   const k3 = f(t + dt / 2, y3);
  //   const y4 = y.map((yi, i) => yi + dt * k3[i]);

  //   const k4 = f(t + dt, y4);

  //   return y.map(
  //     (yi, i) => yi + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]),
  //   );
  // }

  // lorentz(t, state) {
  //   const q = 1.0,
  //     m = 1.0;
  //   const Bz = 10.0,
  //     Ez = 10.0;

  //   const [x, y, z, vx, vy, vz] = state;

  //   // accelerations
  //   const ax = (q / m) * (vy * Bz);
  //   const ay = (q / m) * (-vx * Bz);
  //   const az = (q / m) * Ez;

  //   return [vx, vy, vz, ax, ay, az]; // dx/dt, dy/dt, dz/dt, dvx/dt, dvy/dt, dvz/dt
  // }

  updateParticle(x, y, z, vx, vy, vz) {
    // Update the particle's position and velocity
    // this.particle.position.set(x, y, z);
    // const [x, y, z] = [x, y, z];

    // Stop simulation if out of axis bounds
    if (
      x < this.xRange.min ||
      x > this.xRange.max ||
      y < this.yRange.min ||
      y > this.yRange.max ||
      z < this.zRange.min ||
      z > this.zRange.max
    ) {
      this.simulationRunning = false;
      return;
    }

    // Clamp to axis ranges if desired
    const xScale = this.axisLength / (this.xRange.max - this.xRange.min);
    const yScale = this.axisLength / (this.yRange.max - this.yRange.min);
    const zScale = this.axisLength / (this.zRange.max - this.zRange.min);

    const visualX = (x - this.xRange.min) * xScale;
    const visualY = (y - this.yRange.min) * yScale;
    const visualZ = (z - this.zRange.min) * zScale;

    this.particle.position.set(visualX, visualY, visualZ);

    // Update particle info display (for debugging)
    if (this.particleInfoLabel) {
      // this.scene.remove(this.particleInfoLabel);
      this.group.remove(this.particleInfoLabel);
    }

    // const infoText = `Particle: (${x.toFixed(1)}, ${y.toFixed(
    //   1,
    // )}, ${z.toFixed(1)})`;
    // this.particleInfoLabel = this.createTextLabel(
    //   infoText,
    //   visualX + 1,
    //   visualY + 1,
    //   visualZ + 1,
    //   0xffffff,
    //   0.6,
    // );

    // Update trail
    this.updateTrail();

    // this.particle.velocity.set(vx, vy, vz);
  }
  updateRange(
    xRange,
    yRange,
    zRange,
    particleState = null,
    testParticleState = null,
  ) {
    // Update the range of the particle's position and velocity
    console.log("Updating ranges:", xRange, yRange, zRange);
    if (xRange[0] === 0 && xRange[1] === 0) {
      this.xRange = {
        min: -1,
        max: 1,
      };
    } else {
      this.xRange = {
        min: xRange[0],
        max: xRange[1],
      };
    }
    if (yRange[0] === 0 && yRange[1] === 0) {
      this.yRange = {
        min: -1,
        max: 1,
      };
    } else {
      this.yRange = {
        min: yRange[0],
        max: yRange[1],
      };
    }
    if (zRange[0] === 0 && zRange[1] === 0) {
      this.zRange = {
        min: -1,
        max: 1,
      };
    } else {
      this.zRange = {
        min: zRange[0],
        max: zRange[1],
      };
    }

    // Remove previous graph elements from the group
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }

    // Recreate the graph with new ranges
    this.createGraph();
    this.createParticle();
    if (this.showTestParticle) {
      this.createTestParticle();
      if (
        testParticleState &&
        Array.isArray(testParticleState) &&
        testParticleState.length >= 6
      ) {
        this.updateTestParticle(
          testParticleState[0],
          testParticleState[1],
          testParticleState[2],
          testParticleState[3],
          testParticleState[4],
          testParticleState[5],
        );
      }
    } else if (this.testParticle) {
      this.group.remove(this.testParticle);
      this.testParticle = null;
      if (this.testTrailMesh) {
        this.group.remove(this.testTrailMesh);
        this.testTrailMesh = null;
      }
    }
    this.showFieldSurfaces(3);

    // If a particle state is provided, update the particle position
    if (
      particleState &&
      Array.isArray(particleState) &&
      particleState.length >= 6
    ) {
      this.updateParticle(
        particleState[0],
        particleState[1],
        particleState[2],
        particleState[3],
        particleState[4],
        particleState[5],
      );
    }

    this.renderer.render(this.scene, this.camera);
  }

  // updateRange() {
  //   let dt = 0.0016;
  //   let t = 0;
  //   let state = [0, 0, 0, 9, 100, 10]; // initial position (0,0,0), velocity (5,0,0)
  //   let records = [];

  //   // for (let i = 0; i < 5000; i++) { // simulate 5 seconds
  //   while (t < 5) {
  //     state = this.rk4(this.lorentz.bind(this), state, t, dt);
  //     // console.log("Final state:", state);
  //     records.push(state);
  //     t += dt;
  //   }
  //   const xMin = Math.min(...records.map((r) => r[0]));
  //   const xMax = Math.max(...records.map((r) => r[0]));
  //   console.log(xMin, xMax);

  //   const yMin = Math.min(...records.map((r) => r[1]));
  //   const yMax = Math.max(...records.map((r) => r[1]));
  //   console.log(yMin, yMax);

  //   const zMin = Math.min(...records.map((r) => r[2]));
  //   const zMax = Math.max(...records.map((r) => r[2]));
  //   console.log(zMin, zMax);

  //   this.xRange = { min: xMin, max: xMax };
  //   this.yRange = { min: yMin, max: yMax };
  //   this.zRange = { min: zMin, max: zMax };

  //   // state now holds [x,y,z,vx,vy,vz] at final time
  // }

  createCustomGrids() {
    // Calculate scaling factors
    const xScale = this.axisLength / (this.xRange.max - this.xRange.min);
    const yScale = this.axisLength / (this.yRange.max - this.yRange.min);
    const zScale = this.axisLength / (this.zRange.max - this.zRange.min);

    // Grid resolution (number of lines)
    const gridLines = 11;

    // (x, y) plane grid at z = 0
    const xyGroup = new THREE.Group();
    for (let i = 0; i < gridLines; i++) {
      const t = i / (gridLines - 1);
      const x = t * this.axisLength;
      const y = t * this.axisLength;
      // Vertical lines (constant x)
      xyGroup.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, 0, 0),
            new THREE.Vector3(x, this.axisLength, 0),
          ]),
          new THREE.LineBasicMaterial({
            color: "black",
            opacity: 0.3,
            transparent: true,
          }),
        ),
      );
      // Horizontal lines (constant y)
      xyGroup.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, y, 0),
            new THREE.Vector3(this.axisLength, y, 0),
          ]),
          new THREE.LineBasicMaterial({
            color: "black",
            opacity: 0.3,
            transparent: true,
          }),
        ),
      );
    }
    // this.scene.add(xyGroup);
    this.group.add(xyGroup);

    // (x, z) plane grid at y = 0
    const xzGroup = new THREE.Group();
    for (let i = 0; i < gridLines; i++) {
      const t = i / (gridLines - 1);
      const x = t * this.axisLength;
      const z = t * this.axisLength;
      // Vertical lines (constant x)
      xzGroup.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, 0, 0),
            new THREE.Vector3(x, 0, this.axisLength),
          ]),
          new THREE.LineBasicMaterial({
            color: "black",
            opacity: 0.3,
            transparent: true,
          }),
        ),
      );
      // Horizontal lines (constant z)
      xzGroup.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, z),
            new THREE.Vector3(this.axisLength, 0, z),
          ]),
          new THREE.LineBasicMaterial({
            color: "black",
            opacity: 0.3,
            transparent: true,
          }),
        ),
      );
    }
    // this.scene.add(xzGroup);
    this.group.add(xzGroup);

    // (y, z) plane grid at x = 0
    const yzGroup = new THREE.Group();
    for (let i = 0; i < gridLines; i++) {
      const t = i / (gridLines - 1);
      const y = t * this.axisLength;
      const z = t * this.axisLength;
      // Vertical lines (constant y)
      yzGroup.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, y, 0),
            new THREE.Vector3(0, y, this.axisLength),
          ]),
          new THREE.LineBasicMaterial({
            color: "black",
            opacity: 0.3,
            transparent: true,
          }),
        ),
      );
      // Horizontal lines (constant z)
      yzGroup.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, z),
            new THREE.Vector3(0, this.axisLength, z),
          ]),
          new THREE.LineBasicMaterial({
            color: "black",
            opacity: 0.3,
            transparent: true,
          }),
        ),
      );
    }
    // this.scene.add(yzGroup);
    this.group.add(yzGroup);
  }

  createAxes() {
    // All axes start from the same point (0,0,0) and extend outward
    const origin = new THREE.Vector3(0, 0, 0);

    // X-axis - from origin extending in positive X direction
    const xGeometry = new THREE.BufferGeometry().setFromPoints([
      origin,
      new THREE.Vector3(this.axisLength, 0, 0),
    ]);
    const xMaterial = new THREE.LineBasicMaterial({
      color: 0xff4444,
      linewidth: 5,
    });
    const xAxis = new THREE.Line(xGeometry, xMaterial);
    // this.scene.add(xAxis);
    this.group.add(xAxis);

    // Y-axis - from origin extending in positive Y direction
    const yGeometry = new THREE.BufferGeometry().setFromPoints([
      origin,
      new THREE.Vector3(0, this.axisLength, 0),
    ]);
    const yMaterial = new THREE.LineBasicMaterial({
      color: 0x44ff44,
      linewidth: 5,
    });
    const yAxis = new THREE.Line(yGeometry, yMaterial);
    // this.scene.add(yAxis);
    this.group.add(yAxis);

    // Z-axis - from origin extending in positive Z direction
    const zGeometry = new THREE.BufferGeometry().setFromPoints([
      origin,
      new THREE.Vector3(0, 0, this.axisLength),
    ]);
    const zMaterial = new THREE.LineBasicMaterial({
      color: 0x4488ff,
      linewidth: 7,
    });
    const zAxis = new THREE.Line(zGeometry, zMaterial);
    // this.scene.add(zAxis);
    this.group.add(zAxis);

    // Add arrow heads for axes
    this.createArrowHeads();

    // Add tick marks and numbers
    this.createAxisTicksAndNumbers();
  }

  createArrowHeads() {
    const arrowGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);

    // X-axis arrow at the end of the line
    const xArrow = new THREE.Mesh(
      arrowGeometry,
      new THREE.MeshBasicMaterial({ color: 0xff4444 }),
    );
    xArrow.position.set(this.axisLength, 0, 0);
    xArrow.rotateZ(-Math.PI / 2);
    // this.scene.add(xArrow);
    this.group.add(xArrow);

    // Y-axis arrow at the end of the line
    const yArrow = new THREE.Mesh(
      arrowGeometry,
      new THREE.MeshBasicMaterial({ color: 0x44ff44 }),
    );
    yArrow.position.set(0, this.axisLength, 0);
    // this.scene.add(yArrow);
    this.group.add(yArrow);

    // Z-axis arrow at the end of the line
    const zArrow = new THREE.Mesh(
      arrowGeometry,
      new THREE.MeshBasicMaterial({ color: 0x4488ff }),
    );
    zArrow.position.set(0, 0, this.axisLength);
    zArrow.rotateX(Math.PI / 2);
    // this.scene.add(zArrow);
    this.group.add(zArrow);
  }

  createGrids() {
    // XY plane grid
    const xyGrid = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    xyGrid.rotateX(Math.PI / 2);
    xyGrid.position.z = 0;
    // this.scene.add(xyGrid);
    this.group.add(xyGrid);

    // XZ plane grid
    const xzGrid = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    xzGrid.position.y = 0;
    // this.scene.add(xzGrid);
    this.group.add(xzGrid);
  }

  createAxisLabels() {
    // Create text using canvas and texture for better readability
    this.createTextLabel("X", this.axisLength + 2.5, 0, 0, "black", 1.5);
    this.createTextLabel("Y", 0, this.axisLength + 2.5, 0, "black", 1.5);
    this.createTextLabel("Z", 0, 0, this.axisLength + 2.5, "black", 1.5);

    // Add range labels
    this.createTextLabel(
      // `X: ${this.xRange.min.toFixed(2)} to ${this.xRange.max.toFixed(2)}`,
      this.axisLength + 1,
      -1,
      0,
      // 0xff4444,
      "black",
      1,
    );
    this.createTextLabel(
      // `Y: ${this.yRange.min.toFixed(2)} to ${this.yRange.max.toFixed(2)}`,
      -1,
      this.axisLength + 1,
      0,
      0x44ff44,
      1,
    );
    this.createTextLabel(
      // `Z: ${this.zRange.min.toFixed(2)} to ${this.zRange.max.toFixed(2)}`,
      -1,
      -1,
      this.axisLength + 1,
      0x4488ff,
      1,
    );
  }

  createTextLabel(text, x, y, z, color, scale = 1) {
    // Create canvas for text
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const fontSize = 120; // Increased font size
    canvas.width = 512; // Increased canvas size
    canvas.height = 128;

    // Add background for better contrast
    // context.fillStyle = "rgba(0, 0, 0, 0.8)";
    // context.fillRect(0, 0, canvas.width, canvas.height);

    // Add white border for better readability
    // context.strokeStyle = "white";
    // context.lineWidth = 2;
    // context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

    context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
    context.font = `bold ${fontSize}px Arial`; // Made bold
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Add text shadow for better readability
    context.shadowColor = "black";
    context.shadowBlur = 3;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;

    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Create sprite material
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
    });

    // Create sprite
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y, z);
    sprite.scale.set(scale * 3, scale * 0.75, 1); // Increased scale

    // this.scene.add(sprite);
    this.group.add(sprite);
    return sprite; // Return the sprite for reference
  }

  createAxisTicksAndNumbers() {
    // Calculate scaling factors to map ranges to visual length
    const xScale = this.axisLength / (this.xRange.max - this.xRange.min);
    const yScale = this.axisLength / (this.yRange.max - this.yRange.min);
    const zScale = this.axisLength / (this.zRange.max - this.zRange.min);

    // Show only 5 labels per axis (including min and max)
    const numLabels = 5;

    // X-axis ticks and numbers
    for (let i = 0; i < numLabels; i++) {
      const t = i / (numLabels - 1);
      const value = this.xRange.min + t * (this.xRange.max - this.xRange.min);
      const visualX = (value - this.xRange.min) * xScale;
      // Create tick mark
      const tickGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(visualX, -0.3, 0),
        new THREE.Vector3(visualX, 0.3, 0),
      ]);
      const tickMaterial = new THREE.LineBasicMaterial({
        color: 0xff4444,
        linewidth: 3,
      });
      const tick = new THREE.Line(tickGeometry, tickMaterial);
      // this.scene.add(tick);
      this.group.add(tick);
      // Create number label
      this.createTextLabel(value.toFixed(2), visualX, -0.8, 0, "black", 0.8);
    }

    // Y-axis ticks and numbers
    for (let i = 0; i < numLabels; i++) {
      const t = i / (numLabels - 1);
      const value = this.yRange.min + t * (this.yRange.max - this.yRange.min);
      const visualY = (value - this.yRange.min) * yScale;
      const tickGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.3, visualY, 0),
        new THREE.Vector3(0.3, visualY, 0),
      ]);
      const tickMaterial = new THREE.LineBasicMaterial({
        color: 0x44ff44,
        linewidth: 3,
      });
      const tick = new THREE.Line(tickGeometry, tickMaterial);
      // this.scene.add(tick);
      this.group.add(tick);
      this.createTextLabel(value.toFixed(2), -0.8, visualY, 0, "black", 0.8);
    }

    // Z-axis ticks and numbers
    for (let i = 0; i < numLabels; i++) {
      const t = i / (numLabels - 1);
      const value = this.zRange.min + t * (this.zRange.max - this.zRange.min);
      const visualZ = (value - this.zRange.min) * zScale;
      const tickGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.3, 0, visualZ),
        new THREE.Vector3(0.3, 0, visualZ),
      ]);
      const tickMaterial = new THREE.LineBasicMaterial({
        color: 0x4488ff,
        linewidth: 3,
      });
      const tick = new THREE.Line(tickGeometry, tickMaterial);
      // this.scene.add(tick);
      this.group.add(tick);
      this.createTextLabel(value.toFixed(2), -0.8, 0, visualZ, "black", 0.8);
    }

    // Add connection point marker (where all axes meet)
    const originGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const originMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const origin = new THREE.Mesh(originGeometry, originMaterial);
    origin.position.set(0, 0, 0);
    // this.scene.add(origin);
    this.group.add(origin);

    // Add connection point label
    // this.createTextLabel("Connection Point", -1.5, -1.5, -1.5, 0xffffff, 0.8);
  }

  createParticle() {
    // Create the main particle
    const particleGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const particleMaterial = new THREE.MeshPhongMaterial({
      color: "red",
      emissive: "red",
      // emissiveIntensity: 0.3,
    });
    this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
    this.particle.position.set(0, 0, 0);
    // this.scene.add(this.particle);
    this.group.add(this.particle);

    // Create particle glow effect
    const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "red",
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    // this.particle.add(glow);
    this.group.add(glow);

    // Initialize trail
    this.trail = [];
    this.createTrailMesh();
  }

  createTestParticle() {
    const particleGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const particleMaterial = new THREE.MeshPhongMaterial({
      color: "blue",
      emissive: "blue",
    });
    this.testParticle = new THREE.Mesh(particleGeometry, particleMaterial);
    this.testParticle.position.set(0, 0, 0);
    this.group.add(this.testParticle);
    // Glow
    const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "blue",
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.group.add(glow);
    // Trail
    this.testTrail = [];
    this.createTestTrailMesh();
  }

  createTrailMesh() {
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({
      color: "red",
      // transparent: true,
      // opacity: 0.7,
      linewidth: 0.5,
    });
    this.trailMesh = new THREE.Line(trailGeometry, trailMaterial);
    // this.scene.add(this.trailMesh);
    this.group.add(this.trailMesh);
  }

  createTestTrailMesh() {
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({
      color: "blue",
      linewidth: 0.5,
    });
    this.testTrailMesh = new THREE.Line(trailGeometry, trailMaterial);
    this.group.add(this.testTrailMesh);
  }

  updateTrail() {
    // Add current particle position to trail
    this.trail.push(this.particle.position.clone());

    // Limit trail length
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // Update trail geometry
    if (this.trail.length > 1) {
      const positions = [];
      this.trail.forEach((point) => {
        positions.push(point.x, point.y, point.z);
      });

      this.trailMesh.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      this.trailMesh.geometry.attributes.position.needsUpdate = true;
    }
  }

  updateTestParticle(x, y, z, vx, vy, vz) {
    if (!this.testParticle) return;
    // Clamp to axis ranges
    const xScale = this.axisLength / (this.xRange.max - this.xRange.min);
    const yScale = this.axisLength / (this.yRange.max - this.yRange.min);
    const zScale = this.axisLength / (this.zRange.max - this.zRange.min);
    const visualX = (x - this.xRange.min) * xScale;
    const visualY = (y - this.yRange.min) * yScale;
    const visualZ = (z - this.zRange.min) * zScale;
    this.testParticle.position.set(visualX, visualY, visualZ);
    // Trail
    if (!this.testTrail) this.testTrail = [];
    this.testTrail.push(this.testParticle.position.clone());
    if (this.testTrail.length > this.maxTrailLength) {
      this.testTrail.shift();
    }
    if (this.testTrail.length > 1 && this.testTrailMesh) {
      const positions = [];
      this.testTrail.forEach((point) => {
        positions.push(point.x, point.y, point.z);
      });
      this.testTrailMesh.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      this.testTrailMesh.geometry.attributes.position.needsUpdate = true;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // if (this.simulationRunning && this.simState) {
    //   // RK4 integration for Lorentz force
    //   const dt = 0.0016; // ~60 FPS
    //   this.simState = this.rk4(
    //     this.lorentz.bind(this),
    //     this.simState,
    //     this.simTime,
    //     dt,
    //   );
    //   this.simTime += dt;
    //   const [x, y, z] = this.simState;

    //   // Stop simulation if out of axis bounds
    //   if (
    //     x < this.xRange.min ||
    //     x > this.xRange.max ||
    //     y < this.yRange.min ||
    //     y > this.yRange.max ||
    //     z < this.zRange.min ||
    //     z > this.zRange.max
    //   ) {
    //     this.simulationRunning = false;
    //     return;
    //   }

    //   // Clamp to axis ranges if desired
    //   const xScale = this.axisLength / (this.xRange.max - this.xRange.min);
    //   const yScale = this.axisLength / (this.yRange.max - this.yRange.min);
    //   const zScale = this.axisLength / (this.zRange.max - this.zRange.min);

    //   const visualX = (x - this.xRange.min) * xScale;
    //   const visualY = (y - this.yRange.min) * yScale;
    //   const visualZ = (z - this.zRange.min) * zScale;

    //   this.particle.position.set(visualX, visualY, visualZ);

    //   // Update particle info display (for debugging)
    //   if (this.particleInfoLabel) {
    //     // this.scene.remove(this.particleInfoLabel);
    //     this.group.remove(this.particleInfoLabel);
    //   }

    //   const infoText = `Particle: (${x.toFixed(1)}, ${y.toFixed(
    //     1,
    //   )}, ${z.toFixed(1)})`;
    //   this.particleInfoLabel = this.createTextLabel(
    //     infoText,
    //     visualX + 1,
    //     visualY + 1,
    //     visualZ + 1,
    //     0xffffff,
    //     0.6,
    //   );

    //   // Update trail
    //   this.updateTrail();

    //   // Add some rotation to particle for visual effect
    //   this.particle.rotation.x += 0.02;
    //   this.particle.rotation.y += 0.03;
    // }

    // Update controls
    this.controls.update();

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  // onWindowResize() {
  //   this.camera.aspect = window.innerWidth / window.innerHeight;
  //   this.camera.updateProjectionMatrix();
  //   this.renderer.setSize(window.innerWidth, window.innerHeight);
  // }

  showFieldSurfaces(
    numPerSide = 3,
    bx = this.Bx,
    by = this.By,
    bz = this.Bz,
    ex = this.Ex,
    ey = this.Ey,
    ez = this.Ez,
  ) {
    // Remove previous field surface arrows if any
    if (this.fieldSurfaceArrows) {
      this.fieldSurfaceArrows.forEach((arrow) => this.group.remove(arrow));
    }
    this.fieldSurfaceArrows = [];

    // Use provided field values instead of reading from sliders
    // Planes: closer together
    const zPlanes = [
      this.axisLength / 4,
      this.axisLength / 2,
      (3 * this.axisLength) / 4,
    ];
    for (const z of zPlanes) {
      for (let i = 0; i < numPerSide; i++) {
        for (let j = 0; j < numPerSide; j++) {
          // Position grid in x and y
          const x = (i + 0.5) * (this.axisLength / numPerSide);
          const y = (j + 0.5) * (this.axisLength / numPerSide);
          // Magnetic field arrow (teal)
          if (bx !== 0 || by !== 0 || bz !== 0) {
            const bDir = new THREE.Vector3(bx, by, bz).normalize();
            const bArrow = new THREE.ArrowHelper(
              bDir,
              new THREE.Vector3(x, y, z),
              1.2,
              "teal",
              0.2,
              0.22,
            );
            bArrow.visible = this.showMagneticField;
            this.group.add(bArrow);
            this.fieldSurfaceArrows.push(bArrow);
          }
          // Electric field arrow (maroon)
          if (ex !== 0 || ey !== 0 || ez !== 0) {
            const eDir = new THREE.Vector3(ex, ey, ez).normalize();
            const eArrow = new THREE.ArrowHelper(
              eDir,
              new THREE.Vector3(x, y, z),
              1.2,
              "maroon",
              0.2,
              0.22,
            );
            eArrow.visible = this.showElectricField;
            this.group.add(eArrow);
            this.fieldSurfaceArrows.push(eArrow);
          }
        }
      }
    }
  }
}
