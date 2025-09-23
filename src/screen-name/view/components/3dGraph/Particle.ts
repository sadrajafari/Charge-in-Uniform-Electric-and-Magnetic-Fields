// import * as THREE from "three";

// /**
//  * Manages a particle and its trail in the simulation
//  */
// export class ParticleSystem {
//   particle: THREE.Mesh;
//   trailLine: THREE.Line;
//   trailGeometry: THREE.BufferGeometry;
//   trailPositions: THREE.Vector3[];
//   trailPositionCount: number = 0;
//   readonly MAX_TRAIL_POINTS = 100000;

//   constructor(clippingPlanes: THREE.Plane[]) {
//     // Create particle
//     const particleMaterial = new THREE.MeshStandardMaterial({
//       color: 0xff0000, // Red
//       emissive: 0x440000,
//       metalness: 0.3,
//       roughness: 0.4,
//       clippingPlanes: clippingPlanes,
//     });

//     this.particle = new THREE.Mesh(
//       new THREE.SphereGeometry(0.15, 16, 16),
//       particleMaterial
//     );
//     this.particle.position.set(0, 0, 0);

//     // Setup for the trail line
//     this.trailPositions = [];
//     for (let i = 0; i < this.MAX_TRAIL_POINTS; i++) {
//       this.trailPositions.push(new THREE.Vector3(0, 0, 0));
//     }

//     // Create a line geometry with initial positions
//     this.trailGeometry = new THREE.BufferGeometry().setFromPoints(
//       this.trailPositions.slice(0, 1)
//     );

//     // Create a line material
//     const trailMaterial = new THREE.LineBasicMaterial({
//       color: 0xff6666,
//       linewidth: 1,
//       opacity: 1,
//       transparent: true,
//       clippingPlanes: clippingPlanes,
//     });

//     // Create the line
//     this.trailLine = new THREE.Line(this.trailGeometry, trailMaterial);
//   }

//   /**
//    * Updates the particle position and adds a point to the trail
//    */
//   updatePosition(x: number, y: number, z: number): void {
//     this.particle.position.set(x, y, z);

//     // Add new position to trail
//     if (this.trailPositionCount < this.MAX_TRAIL_POINTS) {
//       this.trailPositions[this.trailPositionCount].set(x, y, z);
//       this.trailPositionCount++;
//     } else {
//       // Shift all positions back by one
//       for (let i = 0; i < this.MAX_TRAIL_POINTS - 1; i++) {
//         this.trailPositions[i].copy(this.trailPositions[i + 1]);
//       }
//       // Add new position at the end
//       this.trailPositions[this.MAX_TRAIL_POINTS - 1].set(x, y, z);
//     }

//     // Update the line geometry
//     this.trailGeometry.setFromPoints(
//       this.trailPositions.slice(0, this.trailPositionCount)
//     );

//     // Mark the geometry as needing an update
//     this.trailGeometry.attributes.position.needsUpdate = true;
//   }

//   /**
//    * Resets the particle trail to empty
//    */
//   resetTrail(): void {
//     // Reset trail position count
//     this.trailPositionCount = 0;

//     // Reset all trail positions to origin
//     for (let i = 0; i < this.MAX_TRAIL_POINTS; i++) {
//       this.trailPositions[i].set(0, 0, 0);
//     }

//     // Reset the particle position
//     this.particle.position.set(0, 0, 0);

//     // Update the geometry with empty trail
//     this.trailGeometry.setFromPoints(
//       this.trailPositions.slice(0, 1)
//     );
//     this.trailGeometry.attributes.position.needsUpdate = true;
//   }

//   /**
//    * Returns the particle and trail objects to add to the scene
//    */
//   getObjects(): THREE.Object3D[] {
//     return [this.particle, this.trailLine];
//   }
// }


import * as THREE from "three";

/**
 * Manages a particle and its trail in the simulation
 */
export class ParticleSystem {
  particle: THREE.Mesh;
  trailMesh: THREE.Mesh;
  trailGeometry: THREE.BufferGeometry | null = null;
  trailPositions: THREE.Vector3[];
  trailCurve: THREE.CatmullRomCurve3;
  trailPositionCount: number = 0;
  readonly MAX_TRAIL_POINTS = 10000;
  readonly TRAIL_RADIUS = 0.01; // Thickness of the trail

  constructor(clippingPlanes: THREE.Plane[]) {
    // Create particle material
    const particleMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000, // Red
      emissive: 0x440000,
      metalness: 0.3,
      roughness: 0.4,
      clippingPlanes: clippingPlanes,
    });

    // Create particle mesh
    this.particle = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      particleMaterial
    );
    this.particle.position.set(0, 0, 0);

    // Initialize with TWO identical points so the curve is valid
    // This is crucial - we need at least 2 points for a valid curve
    this.trailPositions = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0.001) // Slightly offset to avoid errors
    ];
    this.trailPositionCount = 2;
    
    // Create a curve from the trail points
    this.trailCurve = new THREE.CatmullRomCurve3(this.trailPositions);
    
    // Create trail material
    const trailMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6666,
      emissive: 0x661111,
      transparent: true,
      opacity: 1,
      clippingPlanes: clippingPlanes,
    });
    
    try {
      // Create a tube with minimal segments
      this.trailGeometry = new THREE.TubeGeometry(
        this.trailCurve,
        1, // Path segments
        this.TRAIL_RADIUS, // Tube radius
        8, // Radial segments
        false // Closed
      );
      
      // Create the mesh
      this.trailMesh = new THREE.Mesh(this.trailGeometry, trailMaterial);
    } catch (error) {
      console.error("Error creating tube geometry:", error);
      
      // Fallback to a simple sphere if tube creation fails
      this.trailGeometry = new THREE.SphereGeometry(0.01, 8, 8);
      this.trailMesh = new THREE.Mesh(this.trailGeometry, trailMaterial);
      this.trailMesh.visible = false;
    }
  }

  /**
   * Updates the particle position and adds a point to the trail
   */
  updatePosition(x: number, y: number, z: number): void {
    // Update particle position
    this.particle.position.set(x, y, z);

    try {
      // Add new position to trail
      if (this.trailPositionCount < this.MAX_TRAIL_POINTS) {
        // Add new point
        this.trailPositions.push(new THREE.Vector3(x, y, z));
        this.trailPositionCount++;
      } else {
        // Shift all positions back by one (remove oldest)
        this.trailPositions.shift();
        // Add new position at the end
        this.trailPositions.push(new THREE.Vector3(x, y, z));
      }

      // Make sure we have at least 2 distinct points
      if (this.trailPositions.length < 2) {
        // Add a duplicate point with tiny offset if we only have one
        this.trailPositions.push(
          new THREE.Vector3(x + 0.001, y + 0.001, z + 0.001)
        );
      }

      // Update the curve
      this.trailCurve = new THREE.CatmullRomCurve3(this.trailPositions);
      
      // Update the tube geometry
      if (this.trailMesh) {
        const newGeometry = new THREE.TubeGeometry(
          this.trailCurve,
          Math.max(1, this.trailPositions.length - 1), // Path segments
          this.TRAIL_RADIUS, // Tube radius
          8, // Radial segments
          false // Closed
        );
        
        // Replace the old geometry
        if (this.trailMesh.geometry) {
          this.trailMesh.geometry.dispose();
        }
        this.trailMesh.geometry = newGeometry;
        this.trailGeometry = newGeometry;
        this.trailMesh.visible = true;
      }
    } catch (error) {
      console.error("Error updating tube geometry:", error);
    }
  }

  /**
   * Resets the particle trail to empty
   */
  resetTrail(): void {
    try {
      // Reset trail position count
      this.trailPositionCount = 2; // Keep at minimum 2 points

      // Reset trail positions to origin with tiny offset for second point
      this.trailPositions = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0.001) // Slightly offset to avoid errors
      ];

      // Reset the particle position
      this.particle.position.set(0, 0, 0);

      // Update the curve
      this.trailCurve = new THREE.CatmullRomCurve3(this.trailPositions);
      
      // Update the tube geometry to be minimal
      if (this.trailMesh) {
        const newGeometry = new THREE.TubeGeometry(
          this.trailCurve,
          1, // Minimal segments
          this.TRAIL_RADIUS,
          8,
          false
        );
        
        // Replace the old geometry
        if (this.trailMesh.geometry) {
          this.trailMesh.geometry.dispose();
        }
        this.trailMesh.geometry = newGeometry;
        this.trailGeometry = newGeometry;
        
        // Hide the trail initially
        this.trailMesh.visible = false;
      }
    } catch (error) {
      console.error("Error resetting tube geometry:", error);
    }
  }

  /**
   * Returns the particle and trail objects to add to the scene
   */
  getObjects(): THREE.Object3D[] {
    return [this.particle, this.trailMesh];
  }
}