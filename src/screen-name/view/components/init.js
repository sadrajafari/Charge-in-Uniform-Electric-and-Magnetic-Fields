export default function init(material) {
  // Create scene
  material.scene = new THREE.Scene();
  material.scene.background = new THREE.Color("white");
  // material.scene.rotation.x = (3 * Math.PI) / 2;

  // Create camera
  material.camera = new THREE.PerspectiveCamera(
    75, // Field of view
    material.width / material.height, // Aspect ratio
    0.1, // Near clipping plane
    1000, // Far clipping plane
  );
  material.camera.position.set(14, 10, -15);
  // material.camera.position.set(0, 0, -20);

  // Create renderer
  material.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  material.renderer.setSize(material.width, material.height);
  material.renderer.setClearColor(0x0a0a0a);
  // material.renderer.physicallyCorrectLights = true;
  // material.renderer.setPixelRatio(window.devicePixelRatio);
  material.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  // Add renderer to DOM
  document.getElementById("graphDiv").appendChild(material.renderer.domElement);

  // Add orbit controls
  material.controls = new THREE.OrbitControls(
    material.camera,
    material.renderer.domElement,
  );
  material.controls.enableDamping = true;
  material.controls.dampingFactor = 0.05;
  material.controls.target.set(0, 0, 5); // Look at center of z-axis

  material.group = new THREE.Group();
  material.scene.add(material.group);
  material.group.rotation.x = (3 * Math.PI) / 2;

  material.group.position.set(3, 1, 1);

  
}
