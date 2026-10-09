import { createBird, flap, updateBird, BIRD_RADIUS } from './bird.js';
import { createPipes, updatePipes, countPassed, hitsPipe, PIPE_SPEED } from './pipes.js';
import { render, WIDTH, HEIGHT, GROUND_Y } from './render.js';
import { setupInput } from './input.js';
import { loadBest, saveBest } from './storage.js';
import { sound } from './sound.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Résolution interne nette sur écrans haute densité
const dpr = Math.min(window.devicePixelRatio || 1, 3);
canvas.width = WIDTH * dpr;
canvas.height = HEIGHT * dpr;
ctx.scale(dpr, dpr);

const BIRD_X = 100;
const START_Y = 280;
const RESTART_DELAY = 0.5; // évite de rejouer par un tap accidentel

const game = {
  state: 'ready', // 'ready' | 'playing' | 'over'
  bird: createBird(BIRD_X, START_Y),
  pipes: createPipes(),
  score: 0,
  best: loadBest(),
  groundOffset: 0,
  overTime: 0,
  canRestart: false,
};

function reset() {
  game.bird = createBird(BIRD_X, START_Y);
  game.pipes = createPipes();
  game.score = 0;
  game.canRestart = false;
  game.state = 'ready';
}

function die() {
  game.state = 'over';
  game.overTime = 0;
  game.canRestart = false;
  sound.hit();
  if (game.score > game.best) {
    game.best = game.score;
    saveBest(game.best);
  }
}

function onFlap() {
  if (game.state === 'ready') {
    game.state = 'playing';
    flap(game.bird);
    sound.flap();
  } else if (game.state === 'playing') {
    flap(game.bird);
    sound.flap();
  } else if (game.canRestart) {
    reset();
  }
}

setupInput(canvas, onFlap);

function update(dt, t) {
  if (game.state === 'ready') {
    // Oiseau qui flotte en attendant le premier tap
    game.bird.y = START_Y + Math.sin(t * 5) * 8;
    game.bird.angle = 0;
    game.groundOffset -= PIPE_SPEED * dt;
    return;
  }

  if (game.state === 'playing') {
    updateBird(game.bird, dt);
    updatePipes(game.pipes, dt, WIDTH, GROUND_Y);
    game.groundOffset -= PIPE_SPEED * dt;

    const passed = countPassed(game.pipes, game.bird.x);
    if (passed) {
      game.score += passed;
      sound.score();
    }

    if (
      hitsPipe(game.pipes, game.bird) ||
      game.bird.y + BIRD_RADIUS >= GROUND_Y ||
      game.bird.y - BIRD_RADIUS <= 0
    ) {
      game.bird.y = Math.min(game.bird.y, GROUND_Y - BIRD_RADIUS);
      die();
    }
    return;
  }

  // Game over : l'oiseau finit de tomber
  game.overTime += dt;
  if (game.overTime > RESTART_DELAY) game.canRestart = true;
  if (game.bird.y + BIRD_RADIUS < GROUND_Y) {
    updateBird(game.bird, dt);
    game.bird.y = Math.min(game.bird.y, GROUND_Y - BIRD_RADIUS);
  }
}

let last = performance.now();
function frame(now) {
  // dt plafonné pour éviter les sauts après un onglet en arrière-plan
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  update(dt, now / 1000);
  render(ctx, game, now / 1000);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
