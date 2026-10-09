import { BIRD_RADIUS } from './bird.js';

export const PIPE_WIDTH = 60;
export const GAP = 150;
const SPEED = 140;     // px/s
const SPACING = 210;   // distance horizontale entre deux tuyaux
const MARGIN = 60;     // marge min. entre le trou et le haut/bas

export function createPipes() {
  return [];
}

function spawn(pipes, x, groundY) {
  const min = MARGIN + GAP / 2;
  const max = groundY - MARGIN - GAP / 2;
  pipes.push({ x, gapY: min + Math.random() * (max - min), scored: false });
}

export function updatePipes(pipes, dt, width, groundY) {
  for (const p of pipes) p.x -= SPEED * dt;
  while (pipes.length && pipes[0].x + PIPE_WIDTH < 0) pipes.shift();
  const last = pipes[pipes.length - 1];
  if (!last) spawn(pipes, width + 40, groundY);
  else if (last.x < width + 40 - SPACING) spawn(pipes, last.x + SPACING, groundY);
}

/** Retourne le nombre de tuyaux nouvellement dépassés. */
export function countPassed(pipes, birdX) {
  let n = 0;
  for (const p of pipes) {
    if (!p.scored && p.x + PIPE_WIDTH < birdX) {
      p.scored = true;
      n++;
    }
  }
  return n;
}

export function hitsPipe(pipes, bird) {
  for (const p of pipes) {
    const inX = bird.x + BIRD_RADIUS > p.x && bird.x - BIRD_RADIUS < p.x + PIPE_WIDTH;
    if (!inX) continue;
    if (bird.y - BIRD_RADIUS < p.gapY - GAP / 2 || bird.y + BIRD_RADIUS > p.gapY + GAP / 2) return true;
  }
  return false;
}

export const PIPE_SPEED = SPEED;
