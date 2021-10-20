import Contro from 'contro/dist/core/control';
import { Vector2 } from '../lib/vector2';

interface Controls {
  up: Contro.Control<boolean>;
  down: Contro.Control<boolean>;
  left: Contro.Control<boolean>;
  right: Contro.Control<boolean>;
}

export class Player {
  private shotTimer = 0.2;
  private shotTimerMax = 0.2;

  private angle = -90;

  constructor(
    public position: Vector2,
    public velocity: Vector2,
    private controls: Controls,
  ) {}

  public update(dt: number) {
    if (this.controls.left.query()) {
      this.position.x -= this.velocity.x * dt;
    }

    if (this.controls.right.query()) {
      this.position.x += this.velocity.x * dt;
    }

    if (this.controls.up.query()) {
      this.position.y -= this.velocity.y * dt;
    }

    if (this.controls.down.query()) {
      this.position.y += this.velocity.y * dt;
    }

    this.angle += 2 * dt;

    this.shotTimer -= dt;

    if (this.shotTimer <= 0) {
      this.shotTimer = this.shotTimerMax;

      // spawn bullets
    }
  }

  public draw(context: CanvasRenderingContext2D) {
    // Ship
    context.globalAlpha = 0.5;
    context.strokeStyle = 'white';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(this.position.x, this.position.y, 18, 0, Math.PI * 2, true);
    context.stroke();

    // Orbs
    context.beginPath();
    context.arc(this.position.x - 32, this.position.y, 6, 0, Math.PI * 2, true);
    context.stroke();
    context.beginPath();
    context.arc(this.position.x + 32, this.position.y, 6, 0, Math.PI * 2, true);
    context.stroke();

    // Ship
    context.globalAlpha = 0.8;
    context.strokeStyle = 'green';
    context.lineWidth = 8;
    context.beginPath();
    context.arc(this.position.x, this.position.y, 18, 0, Math.PI * 2, true);
    context.stroke();

    // Orbs
    context.strokeStyle = 'green';
    context.lineWidth = 8;
    context.beginPath();
    context.arc(this.position.x - 32, this.position.y, 6, 0, Math.PI * 2, true);
    context.stroke();
    context.beginPath();
    context.arc(this.position.x + 32, this.position.y, 6, 0, Math.PI * 2, true);
    context.stroke();

    // Barrier ?
    context.strokeStyle = 'teal';
    context.save();
    context.lineWidth = 3;
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      22,
      this.angle - (135 * Math.PI) / 180,
      this.angle - (45 * Math.PI) / 180,
      false,
    );
    context.stroke();

    // Barrier ?
    context.strokeStyle = 'lightBlue';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      22,
      this.angle - (135 * Math.PI) / 180,
      this.angle - (45 * Math.PI) / 180,
      false,
    );
    context.stroke();
    context.restore();
  }
}
