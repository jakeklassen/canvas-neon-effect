import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { Gamepad, Keyboard, or } from './lib/contro';
import { Pane } from 'tweakpane';
import { Bullet } from './entities/bullet';
import { Player } from './entities/player';
import { getRandom } from './lib/get-random';
import { getResolution } from './lib/screen';
import { Vector2 } from './lib/vector2';
import './style.css';

const pane = new Pane({
  title: 'Data',
});

pane.registerPlugin(EssentialsPlugin);

pane.addBinding(
  {
    get time() {
      return new Date().toLocaleTimeString();
    },
  },
  'time',
  {
    readonly: true,
    interval: 1_000,
  },
);

const keyboard = new Keyboard();
const gamepad = new Gamepad();

const controls = {
  up: or(keyboard.key('up'), gamepad.button('DpadUp')),
  down: or(keyboard.key('down'), gamepad.button('DpadDown')),
  left: or(keyboard.key('left'), gamepad.button('DpadLeft')),
  right: or(keyboard.key('right'), gamepad.button('DpadRight')),
  fire: or(keyboard.key('z'), gamepad.button('RT')),
  leftStick: gamepad.stick('left'),
  rightStick: gamepad.stick('right'),
};

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d')!;

const GAME_WIDTH = 640;
const GAME_HEIGHT = 360;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

ctx.imageSmoothingEnabled = false;
ctx.globalCompositeOperation = 'lighter';

canvas.style.width = `${GAME_WIDTH}px`;
canvas.style.height = `${GAME_HEIGHT}px`;

const resize = (window: Window & typeof globalThis) => {
  // Scale canvas to fit window while maintaining 16x9
  const { innerWidth, innerHeight } = window;
  const { factor } = getResolution(
    innerWidth,
    innerHeight,
    GAME_WIDTH,
    GAME_HEIGHT,
  );

  canvas.style.transform = `scale(${factor})`;
};

resize(window);

window.addEventListener('resize', () => resize(window));

const player = new Player(
  new Vector2(canvas.width / 2, canvas.height - 100),
  new Vector2(300, 300),
  controls,
);

const COLORS = ['red', 'green', 'blue', 'cyan'];

const bullets = Array.from(
  { length: 200 },
  () =>
    new Bullet(
      new Vector2(
        getRandom(canvas.width),
        getRandom(canvas.height, canvas.height * 1.5),
      ),
      new Vector2(0, -getRandom(650, 50)),
      COLORS[getRandom(COLORS.length)],
      2,
    ),
);

let dt = 0;
let last = performance.now();
let dtAccumulator = 0;
const step = 1 / 60;

function frame(hrt: DOMHighResTimeStamp) {
  // How much time has elapsed since the last frame?
  // Also convert to seconds.
  dt = (hrt - last) / 1000;
  dtAccumulator += dt;

  while (dtAccumulator >= step) {
    // Save previous state before updating
    player.savePreviousState();
    for (const bullet of bullets) {
      bullet.savePreviousState();
    }
    for (const bullet of player.bullets) {
      bullet.savePreviousState();
    }

    dtAccumulator -= step;

    player.update(step);

    for (const bullet of bullets) {
      bullet.update(step);
    }
    for (const bullet of player.bullets) {
      bullet.update(step);
    }
  }

  // Calculate interpolation factor (how far between physics steps we are)
  const alpha = dtAccumulator / step;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Reset context state for player
  ctx.globalAlpha = 1;
  ctx.shadowColor = 'red';
  ctx.shadowBlur = 6;

  player.draw(ctx, alpha);

  // Disable shadow for bullets (they have pre-baked glow)
  ctx.shadowBlur = 0;

  for (const bullet of bullets) {
    bullet.draw(ctx, alpha);
  }

  for (const bullet of player.bullets) {
    bullet.draw(ctx, alpha);
  }

  last = hrt;

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
