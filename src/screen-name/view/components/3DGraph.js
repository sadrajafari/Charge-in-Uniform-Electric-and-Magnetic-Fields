import {
  showVelocityVector,
  createArrowHeads,
  createAxes,
  createAxisLabels,
  createAxisTicksAndNumbers,
  createCustomGrids,
  createGraph,
  createParticle,
  createTestParticle,
  createTestTrailMesh,
  createTextLabel,
  createTrailMesh,
  electricForceVector,
  init,
  magneticFieldOnParticle,
  magneticForceVector,
  setCameraOrthogonalToElectricField,
  setCameraOrthogonalToMagneticField,
  setElectricForceShow,
  setMagneticForceShow,
  showElectricFieldVector,
  showElectricForceVector,
  showFieldSurfaces,
  showMagneticFieldOnParticleVector,
  showMagneticFieldVector,
  showMagneticForceVector,
  toggleElectricField,
  toggleMagneticField,
  updateMagneticForceVector,
  updateTestParticle,
  updateTrail,
  velocityVectorArrow,
  setCameraView,
  createAxisEndLabels,
} from "./3DgraphIndex.js";
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
    this.maxTrailLength = 14500;
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
    this.q = 1;
    this.vx = 9;
    this.vy = 100;
    this.vz = 10;
    this.rowNumber = 3;
    this.showElectricForce = true;
    this.showMagneticForce = true;
    this.visibleVelocityVector = true;
    this.visibleMagneticFieldParticle = true;
    this.currentCameraView = "normal"; // Track current view mode

    this.init();
    
    // this.updateRange();
    createGraph(this);
    // this.createParticle();
    createParticle(this);
    if (this.showTestParticle) {
      // this.createTestParticle();
      createTestParticle(this);
    }
    // this.showFieldSurfaces(this.rowNumber);
    showFieldSurfaces(this);
    // this.electricForceVector(this.q, 0, 5, 0);
    electricForceVector(this, this.q, 0, 5, 0);
    // this.magneticForceVector(this.q, 0, 0, 0, 0, 0, 0);
    this.renderer.render(this.scene, this.camera);
    this.animate();
  }

  init() {
    init(this);
    
  }

  setCameraOrthogonalToElectricField(Ex, Ey, Ez, x, y, z) {
    setCameraOrthogonalToElectricField(this, Ex, Ey, Ez, x, y, z);
  }

  setCameraOrthogonalToMagneticField(Bx, By, Bz, x, y, z) {
    setCameraOrthogonalToMagneticField(this, Bx, By, Bz, x, y, z);
  }

  createAxisEndLabels() {
    createAxisEndLabels(this);
  }

  updateRows(numRows) {
    this.rowNumber = numRows;
    showFieldSurfaces(
      this,
      this.rowNumber,
      this.Bx,
      this.By,
      this.Bz,
      this.Ex,
      this.Ey,
      this.Ez,
    );
    this.renderer.render(this.scene, this.camera);
  }

  updateValues(q, vx, vy, vz) {
    this.q = q;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
  }

  setElectricForceShow(status) {
    setElectricForceShow(this, status);
  }
  setMagneticForceShow(status) {
    setMagneticForceShow(this, status);
  }
  setMagneticFieldParticleShow(status) {
    this.visibleMagneticFieldParticle = status;
  }
  setVelocityVectorShow(status) {
    this.visibleVelocityVector = status;
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
    // this.showFieldSurfaces(this.rowNumber, Bx, By, Bz, Ex, Ey, Ez);
    showFieldSurfaces(this);
  }

  toggleElectricField(show) {
    toggleElectricField(this, show);
  }

  toggleMagneticField(show) {
    toggleMagneticField(this, show);
  }

  showElectricFieldVector(Ex = this.Ex, Ey = this.Ey, Ez = this.Ez) {
    showElectricFieldVector(this, Ex, Ey, Ez);
  }

  showMagneticFieldVector(Bx = this.Bx, By = this.By, Bz = this.Bz) {
    showMagneticFieldVector(this, Bx, By, Bz);
  }

  setCameraView(viewType, x = null, y = null, z = null) {
    setCameraView(this, viewType, x, y, z);
  }

  updateParticle(x, y, z, vx, vy, vz) {
    this.updateMagneticForceVector(
      this.q,
      this.vx,
      this.vy,
      this.vz,
      this.Bx,
      this.By,
      this.Bz,
    );

    showMagneticForceVector(this, this.showMagneticForce);
    showElectricForceVector(this, this.showElectricForce);
    showVelocityVector(this, this.visibleVelocityVector);
    showMagneticFieldOnParticleVector(this, this.visibleMagneticFieldParticle);

    if (this.currentCameraView === "electric") {
      this.setCameraOrthogonalToElectricField(
        this.Ex,
        this.Ey,
        this.Ez,
        x,
        y,
        z,
      );
    } else if (this.currentCameraView === "magnetic") {
      this.setCameraOrthogonalToMagneticField(
        this.Bx,
        this.By,
        this.Bz,
        x,
        y,
        z,
      );
    }
    // else {
    //   // this.setCameraView("normal");
    //   this.camera.position.set(14, 10, -15);
    //   this.controls.target.set(0, 0, 5);
    //   this.controls.update();
    // }
    // Commented here
    // Inside updateParticle method:
    // this.setCameraOrthogonalToMagneticField(this.Bx, this.By, this.Bz, x, y, z);
    // setCameraOrthogonalToMagneticField(
    //   this,
    //   this.Bx,
    //   this.By,
    //   this.Bz,
    //   x,
    //   y,
    //   z,
    // );

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
      // return;
    }

    // Clamp to axis ranges if desired
    const xScale = this.axisLength / (this.xRange.max - this.xRange.min);
    const yScale = this.axisLength / (this.yRange.max - this.yRange.min);
    const zScale = this.axisLength / (this.zRange.max - this.zRange.min);

    const visualX = (x - this.xRange.min) * xScale;
    const visualY = (y - this.yRange.min) * yScale;
    const visualZ = (z - this.zRange.min) * zScale;

    this.particle.position.set(visualX, visualY, visualZ);

    if (this.electricForceField) {
      this.electricForceField.position.set(visualX, visualY, visualZ);
    }
    if (this.magneticForceField) {
      this.magneticForceField.position.set(visualX, visualY, visualZ);
    }

    // Update particle info display (for debugging)
    if (this.particleInfoLabel) {
      // this.scene.remove(this.particleInfoLabel);
      this.group.remove(this.particleInfoLabel);
    }

    velocityVectorArrow(this, x, y, z, vx, vy, vz);

    magneticFieldOnParticle(this, x, y, z, this.Bx, this.By, this.Bz);

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
    // this.createGraph();
    createGraph(this);
    // this.createParticle();
    createParticle(this);
    if (this.showTestParticle) {
      // this.createTestParticle();
      createTestParticle(this);
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
    // this.showFieldSurfaces(this.rowNumber);
    showFieldSurfaces(this);

    // Recreate electric force vector after clearing group
    // this.electricForceVector(this.q, this.Ex, this.Ey, this.Ez);
    electricForceVector(this, this.q, this.Ex, this.Ey, this.Ez);
    this.magneticForceVector(
      this.q,
      this.vx,
      this.vy,
      this.vz,
      this.Bx,
      this.By,
      this.Bz,
    );

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

  magneticForceVector(q, vx, vy, vz, Bx, By, Bz) {
    magneticForceVector(this, q, vx, vy, vz, Bx, By, Bz);
  }

  updateMagneticForceVector(q, vx, vy, vz, Bx, By, Bz) {
    updateMagneticForceVector(this, q, vx, vy, vz, Bx, By, Bz);
  }

  createCustomGrids() {
    createCustomGrids(this);
  }

  createAxes() {
    createAxes(this);
  }

  createArrowHeads() {
    createArrowHeads(this);
  }

  createAxisLabels() {
    createAxisLabels(this);
  }

  createTextLabel(text, x, y, z, color, scale = 1) {
    createTextLabel(this, text, x, y, z, color, (scale = 1));
  }

  createAxisTicksAndNumbers() {
    createAxisTicksAndNumbers(this);
  }

  createTestParticle() {
    createTestParticle(this);
  }

  createTrailMesh() {
    createTrailMesh(this);
  }

  createTestTrailMesh() {
    createTestTrailMesh(this);
  }

  updateTrail() {
    updateTrail(this);
  }

  updateTestParticle(x, y, z, vx, vy, vz) {
    updateTestParticle(this, x, y, z, vx, vy, vz);
  }

  // setTestVectorsVisible(
  //   showElectric,
  //   showMagnetic,
  //   showVelocity,
  //   showMagneticField,
  // ) {
  //   // Remove test particle vectors if they should be hidden
  //   if (!showElectric && this.testElectricForceField) {
  //     this.group.remove(this.testElectricForceField);
  //     this.testElectricForceField = null;
  //   }
  //   if (!showMagnetic && this.testMagneticForceField) {
  //     this.group.remove(this.testMagneticForceField);
  //     this.testMagneticForceField = null;
  //   }
  //   if (!showVelocity && this.testVelocityArrow) {
  //     this.group.remove(this.testVelocityArrow);
  //     this.testVelocityArrow = null;
  //   }
  //   if (!showMagneticField && this.testMagneticFieldOnParticleArrow) {
  //     this.group.remove(this.testMagneticFieldOnParticleArrow);
  //     this.testMagneticFieldOnParticleArrow = null;
  //   }

  //   this.renderer.render(this.scene, this.camera);
  // }

  removeTestParticle() {
    // Remove test particle
    if (this.testParticle) {
      this.group.remove(this.testParticle);
      this.testParticle = null;
    }

    // Remove test particle trail
    if (this.testTrailMesh) {
      this.group.remove(this.testTrailMesh);
      this.testTrailMesh = null;
    }
    if (this.testTrail) {
      this.testTrail = [];
    }

    // ✅ Remove ALL test particle vectors
    if (this.testVelocityArrow) {
      this.group.remove(this.testVelocityArrow);
      this.testVelocityArrow = null;
    }

    if (this.testElectricForceField) {
      this.group.remove(this.testElectricForceField);
      this.testElectricForceField = null;
    }

    if (this.testMagneticForceField) {
      this.group.remove(this.testMagneticForceField);
      this.testMagneticForceField = null;
    }

    if (this.testMagneticFieldOnParticleArrow) {
      this.group.remove(this.testMagneticFieldOnParticleArrow);
      this.testMagneticFieldOnParticleArrow = null;
    }

    // Re-render
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Update controls
    this.controls.update();

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}
