export default function createAxisEndLabels(material) {
  function createTextSprite(text, color = 'black') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;

    context.font = 'Bold 100px Arial';
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.8, 0.8, 1);
    
    return sprite;
  }

  const offset = 0.8;

  // Negative signs at origin
  const negativeX = createTextSprite('-');
  negativeX.position.set(-offset, 0, 0);
  material.group.add(negativeX);

  const negativeY = createTextSprite('-');
  negativeY.position.set(0, -offset, 0);
  material.group.add(negativeY);

  const negativeZ = createTextSprite('-');
  negativeZ.position.set(0, 0, -offset);
  material.group.add(negativeZ);

  // Positive signs at arrow heads
  const positiveX = createTextSprite('+');
  positiveX.position.set(material.axisLength + offset, 0, 0);
  material.group.add(positiveX);

  const positiveY = createTextSprite('+');
  positiveY.position.set(0, material.axisLength + offset, 0);
  material.group.add(positiveY);

  const positiveZ = createTextSprite('+');
  positiveZ.position.set(0, 0, material.axisLength + offset);
  material.group.add(positiveZ);
}