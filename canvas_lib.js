export function getCanvas(id) {
  let canvas = document.getElementById(id);
  let context = canvas.getContext('2d');
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight * 0.8;
  return context;
}

export function roundedRect(context, width, height, fillStyle) {
  context.fillStyle = fillStyle;
  context.beginPath();
  context.moveTo(-width / 2, -width / 2);
  context.lineTo(-width / 2, -(height - width / 2));
  context.quadraticCurveTo(-width / 2, -height, 0, -height);
  context.quadraticCurveTo(
    width / 2,
    -height,
    width / 2,
    -(height - width / 2)
  );
  context.lineTo(width / 2, -width / 2);
  context.quadraticCurveTo(width / 2, 0, 0, 0);
  context.quadraticCurveTo(-width / 2, 0, -width / 2, -width / 2);
  context.closePath();
  context.fill();
}
