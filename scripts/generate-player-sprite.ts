import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';

const outputDir = './godot/cyberpunk-blaster/assets';
mkdirSync(outputDir, { recursive: true });

// === SHIP BODY (ring only, no shield) ===
{
  const size = 64;
  const center = size / 2;

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.globalCompositeOperation = 'lighter';
  ctx.shadowColor = 'red';
  ctx.shadowBlur = 6;

  // Ship outer ring - white base
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(center, center, 18, 0, Math.PI * 2, true);
  ctx.stroke();

  // Ship main ring - green
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(center, center, 18, 0, Math.PI * 2, true);
  ctx.stroke();

  const buffer = canvas.toBuffer('image/png');
  writeFileSync(`${outputDir}/ship_body.png`, buffer);
  console.log(`Saved ship_body.png (${size}x${size}px)`);
}

// === SHIELD (arc only) ===
{
  const size = 64;
  const center = size / 2;

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.globalCompositeOperation = 'lighter';
  ctx.shadowColor = 'red';
  ctx.shadowBlur = 6;

  // Shield arc - teal
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = 'teal';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(
    center,
    center,
    22,
    -Math.PI / 2 - (45 * Math.PI) / 180,
    -Math.PI / 2 + (45 * Math.PI) / 180,
    false,
  );
  ctx.stroke();

  // Shield overlay - light blue
  ctx.strokeStyle = 'lightBlue';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(
    center,
    center,
    22,
    -Math.PI / 2 - (45 * Math.PI) / 180,
    -Math.PI / 2 + (45 * Math.PI) / 180,
    false,
  );
  ctx.stroke();

  const buffer = canvas.toBuffer('image/png');
  writeFileSync(`${outputDir}/shield.png`, buffer);
  console.log(`Saved shield.png (${size}x${size}px)`);
}

// === BULLET (yellow, width 4) ===
{
  const bulletWidth = 4;
  const bulletHeight = 15;
  const padding = 12; // Extra space for glow
  const width = bulletWidth + padding * 2;
  const height = bulletHeight + padding * 2;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const centerX = width / 2;
  const startY = padding + bulletHeight;
  const endY = padding;

  ctx.globalCompositeOperation = 'lighter';
  ctx.shadowColor = 'red';
  ctx.shadowBlur = 6;

  // White base
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = bulletWidth;
  ctx.beginPath();
  ctx.moveTo(centerX, startY);
  ctx.lineTo(centerX, endY);
  ctx.stroke();

  // Yellow overlay
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = 'yellow';
  ctx.lineWidth = bulletWidth;
  ctx.beginPath();
  ctx.moveTo(centerX, startY);
  ctx.lineTo(centerX, endY);
  ctx.stroke();

  const buffer = canvas.toBuffer('image/png');
  writeFileSync(`${outputDir}/bullet.png`, buffer);
  console.log(`Saved bullet.png (${width}x${height}px)`);
}

console.log('Done!');
