import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { Keyboard } from 'contro';
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

pane.addMonitor(
  {
    get time() {
      return new Date().toLocaleTimeString();
    },
  },
  'time',
  {
    interval: 1_000,
  },
);

const keyboard = new Keyboard();
const controls = {
  up: keyboard.key('up'),
  down: keyboard.key('down'),
  left: keyboard.key('left'),
  right: keyboard.key('right'),
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
    dtAccumulator -= step;

    player.update(step);

    for (const bullet of bullets) {
      bullet.update(step);
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.shadowColor = 'red';
  ctx.shadowBlur = 6;

  player.draw(ctx);

  for (const bullet of bullets) {
    bullet.draw(ctx);
  }

  last = hrt;

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
