import { Vector2 } from '../lib/vector2';

export class Bullet {
  // private image: CanvasImageSource;

  constructor(
    public position: Vector2,
    public velocity: Vector2,
    public color: string,
    public bulletWidth = 4,
  ) {
    // const bufferWidth = 16;
    // const bufferHeight = 24;
    // const buffer = document.createElement('canvas');
    // buffer.width = bufferWidth;
    // buffer.height = bufferHeight;
    // const renderPosition = new Vector2(bufferWidth / 2, bufferHeight / 2);
    // const context = buffer.getContext('2d')!;
    // context.imageSmoothingEnabled = false;
    // context.globalCompositeOperation = 'lighter';
    // context.globalAlpha = 0.5;
    // context.strokeStyle = 'white';
    // context.lineWidth = this.bulletWidth;
    // context.beginPath();
    // context.moveTo(renderPosition.x, renderPosition.y);
    // context.lineTo(renderPosition.x, renderPosition.y - 15);
    // context.closePath();
    // context.stroke();
    // // Bullet overlay
    // context.globalAlpha = 0.8;
    // context.strokeStyle = this.color;
    // context.lineWidth = this.bulletWidth;
    // context.beginPath();
    // context.moveTo(renderPosition.x, renderPosition.y);
    // context.lineTo(renderPosition.x, renderPosition.y - 15);
    // context.closePath();
    // context.stroke();
    // this.image = buffer;
  }

  public update(dt: number) {
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }

  public draw(context: CanvasRenderingContext2D) {
    // Bullet
    context.globalAlpha = 0.5;
    context.strokeStyle = 'white';
    context.lineWidth = this.bulletWidth;
    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(this.position.x, this.position.y - 15);
    context.closePath();
    context.stroke();

    // Bullet overlay
    context.globalAlpha = 0.8;
    context.strokeStyle = this.color;
    context.lineWidth = this.bulletWidth;
    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(this.position.x, this.position.y - 15);
    context.closePath();
    context.stroke();

    // context.drawImage(this.image, this.position.x, this.position.y);
  }
}
