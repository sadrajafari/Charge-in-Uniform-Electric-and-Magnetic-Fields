import * as THREE from "three";

/**
 * Creates a text sprite that always faces the camera
 */
export function createTextSprite(
  text: string, 
  position: THREE.Vector3, 
  color: number | string = 0xffffff,
  size: number = 0.3
): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 128;
  canvas.height = 64;

  // Draw text on canvas
  if (context) {
    context.fillStyle = "rgba(255, 255, 255, 0)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "bold 40px Arial";
    context.fillStyle = typeof color === 'string' ? color : "#" + new THREE.Color(color).getHexString();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  // Create sprite from canvas
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.copy(position);
  sprite.scale.set(size * 4, size * 2, 1);

  return sprite;
}