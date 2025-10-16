export default function createTextLabel(material, text, x, y, z, color, scale = 1) {
    // Create canvas for text
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const fontSize = 120; // Increased font size
    canvas.width = 512; // Increased canvas size
    canvas.height = 128;

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

    // material.scene.add(sprite);
    material.group.add(sprite);
    return sprite; // Return the sprite for reference
  }