import { Vector2 } from '../lib/vector2';

// Cache pre-rendered bullet images by color
const bulletCache = new Map<string, HTMLCanvasElement>();

function createBulletImage(
  color: string,
  bulletWidth: number,
): HTMLCanvasElement {
  const cacheKey = `${color}-${bulletWidth}`;
  const cached = bulletCache.get(cacheKey);
  if (cached) return cached;

  const padding = 12; // Extra space for glow
  const bulletHeight = 15;
  const buffer = document.createElement('canvas');
  buffer.width = bulletWidth + padding * 2;
  buffer.height = bulletHeight + padding * 2;

  const ctx = buffer.getContext('2d')!;
  const centerX = buffer.width / 2;
  const startY = padding + bulletHeight;
  const endY = padding;

  ctx.globalCompositeOperation = 'lighter';

  // Apply shadow/glow during pre-render (red matches original)
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

  // Colored overlay
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = color;
  ctx.lineWidth = bulletWidth;
  ctx.beginPath();
  ctx.moveTo(centerX, startY);
  ctx.lineTo(centerX, endY);
  ctx.stroke();

  bulletCache.set(cacheKey, buffer);
  return buffer;
}

export class Bullet {
  private image: HTMLCanvasElement;
  public previousPosition: Vector2;
  public rotation: number;

  constructor(
    public position: Vector2,
    public velocity: Vector2,
    public color: string,
    public bulletWidth = 4,
    rotation?: number,
  ) {
    this.previousPosition = new Vector2(position.x, position.y);
    this.image = createBulletImage(color, bulletWidth);
    // Use provided rotation or calculate from velocity
    this.rotation = rotation ?? Math.atan2(velocity.y, velocity.x);
  }

  public savePreviousState() {
    this.previousPosition.x = this.position.x;
    this.previousPosition.y = this.position.y;
  }

  public update(dt: number) {
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }

  public draw(context: CanvasRenderingContext2D, alpha: number = 1) {
    // Interpolate position
    const x =
      this.previousPosition.x +
      (this.position.x - this.previousPosition.x) * alpha;
    const y =
      this.previousPosition.y +
      (this.position.y - this.previousPosition.y) * alpha;

    // Draw pre-rendered bullet with rotation
    context.save();
    context.translate(x, y);
    context.rotate(this.rotation + Math.PI / 2);
    context.drawImage(
      this.image,
      -this.image.width / 2,
      -this.image.height / 2,
    );
    context.restore();
  }
}
