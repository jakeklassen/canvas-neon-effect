import type { Control } from '../lib/contro';
import { Vector2 as ControVector2 } from '../lib/contro/utils/math';
import { Vector2 } from '../lib/vector2';
import { Bullet } from './bullet';

interface Controls {
  up: Control<boolean>;
  down: Control<boolean>;
  left: Control<boolean>;
  right: Control<boolean>;
  fire: Control<boolean>;
  leftStick: Control<ControVector2>;
  rightStick: Control<ControVector2>;
}

export class Player {
  private shotTimer = 0;
  private shotTimerMax = 0.06;

  // Player facing direction (controlled by right stick)
  private rotation = -Math.PI / 2; // Start facing up
  private previousRotation = -Math.PI / 2;

  // Current frame velocity (for bullet compensation)
  private currentVelocity = new Vector2(0, 0);

  public previousPosition: Vector2;
  public bullets: Bullet[] = [];

  constructor(
    public position: Vector2,
    public velocity: Vector2,
    private controls: Controls,
  ) {
    this.previousPosition = new Vector2(position.x, position.y);
  }

  public savePreviousState() {
    this.previousPosition.x = this.position.x;
    this.previousPosition.y = this.position.y;
    this.previousRotation = this.rotation;
  }

  public update(dt: number) {
    // Reset current velocity for this frame
    this.currentVelocity.x = 0;
    this.currentVelocity.y = 0;

    // Handle digital input (keyboard/dpad)
    if (this.controls.left.query()) {
      this.currentVelocity.x -= this.velocity.x;
    }

    if (this.controls.right.query()) {
      this.currentVelocity.x += this.velocity.x;
    }

    if (this.controls.up.query()) {
      this.currentVelocity.y -= this.velocity.y;
    }

    if (this.controls.down.query()) {
      this.currentVelocity.y += this.velocity.y;
    }

    // Handle left stick movement
    const leftStick = this.controls.leftStick.query();
    const deadzone = 0.15;
    if (Math.abs(leftStick.x) > deadzone) {
      this.currentVelocity.x += leftStick.x * this.velocity.x;
    }
    if (Math.abs(leftStick.y) > deadzone) {
      this.currentVelocity.y += leftStick.y * this.velocity.y;
    }

    // Apply velocity to position
    this.position.x += this.currentVelocity.x * dt;
    this.position.y += this.currentVelocity.y * dt;

    // Handle right stick rotation (player facing direction)
    const rightStick = this.controls.rightStick.query();
    if (Math.abs(rightStick.x) > deadzone || Math.abs(rightStick.y) > deadzone) {
      const targetRotation = Math.atan2(rightStick.y, rightStick.x);

      // Smoothly rotate towards target using shortest path
      let diff = targetRotation - this.rotation;

      // Normalize difference to [-PI, PI] to take shortest path
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;

      const rotationSpeed = 15; // radians per second
      const maxRotation = rotationSpeed * dt;

      if (Math.abs(diff) < maxRotation) {
        this.rotation = targetRotation;
      } else {
        this.rotation += Math.sign(diff) * maxRotation;
      }

      // Keep rotation in [-PI, PI] range
      while (this.rotation > Math.PI) this.rotation -= Math.PI * 2;
      while (this.rotation < -Math.PI) this.rotation += Math.PI * 2;
    }

    this.shotTimer -= dt;

    if (this.controls.fire.query() && this.shotTimer <= 0) {
      this.shotTimer = this.shotTimerMax;

      const bulletSpeed = 600;
      // Calculate bullet velocity based on player rotation + player velocity for consistent spacing
      const bulletVelX = Math.cos(this.rotation) * bulletSpeed + this.currentVelocity.x;
      const bulletVelY = Math.sin(this.rotation) * bulletSpeed + this.currentVelocity.y;

      // Fire from shield position (in front of player)
      const shieldOffset = 28;
      const shieldX = this.position.x + Math.cos(this.rotation) * shieldOffset;
      const shieldY = this.position.y + Math.sin(this.rotation) * shieldOffset;

      // Fire from shield
      this.bullets.push(
        new Bullet(
          new Vector2(shieldX, shieldY),
          new Vector2(bulletVelX, bulletVelY),
          'yellow',
          4,
          this.rotation, // Use player's aim direction for bullet rotation
        ),
      );
    }
  }

  private lerpAngle(from: number, to: number, t: number): number {
    let diff = to - from;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return from + diff * t;
  }

  public draw(context: CanvasRenderingContext2D, alpha: number = 1) {
    // Interpolate position and rotation
    const x =
      this.previousPosition.x + (this.position.x - this.previousPosition.x) * alpha;
    const y =
      this.previousPosition.y + (this.position.y - this.previousPosition.y) * alpha;
    const rotation = this.lerpAngle(this.previousRotation, this.rotation, alpha);

    // Save context and apply rotation transform
    context.save();
    context.translate(x, y);
    context.rotate(rotation + Math.PI / 2); // Add PI/2 so "up" is the default facing direction

    // Ship (drawn at origin since we translated)
    context.globalAlpha = 0.5;
    context.strokeStyle = 'white';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, 0, 18, 0, Math.PI * 2, true);
    context.stroke();

    // Ship
    context.globalAlpha = 0.8;
    context.strokeStyle = 'green';
    context.lineWidth = 8;
    context.beginPath();
    context.arc(0, 0, 18, 0, Math.PI * 2, true);
    context.stroke();

    // Shield/gun (points in player direction - "up" in local space is forward)
    context.strokeStyle = 'teal';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(
      0,
      0,
      22,
      -Math.PI / 2 - (45 * Math.PI) / 180,
      -Math.PI / 2 + (45 * Math.PI) / 180,
      false,
    );
    context.stroke();

    // Shield overlay
    context.strokeStyle = 'lightBlue';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(
      0,
      0,
      22,
      -Math.PI / 2 - (45 * Math.PI) / 180,
      -Math.PI / 2 + (45 * Math.PI) / 180,
      false,
    );
    context.stroke();

    context.restore();
  }
}
