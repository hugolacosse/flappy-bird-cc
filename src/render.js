import { BIRD_RADIUS } from './bird.js';
import { PIPE_WIDTH, GAP } from './pipes.js';

export const WIDTH = 400;
export const HEIGHT = 600;
export const GROUND_H = 80;
export const GROUND_Y = HEIGHT - GROUND_H;

function text(ctx, str, x, y, size, color = '#fff') {
  ctx.font = `bold ${size}px "Trebuchet MS", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(3, size / 8);
  ctx.strokeStyle = '#533';
  ctx.strokeText(str, x, y);
  ctx.fillStyle = color;
  ctx.fillText(str, x, y);
}

function drawPipe(ctx, x, top, bottom) {
  const cap = 24;
  ctx.fillStyle = '#73bf2e';
  ctx.strokeStyle = '#2d5016';
  ctx.lineWidth = 2;
  // Corps + chapeau (haut)
  ctx.fillRect(x + 4, 0, PIPE_WIDTH - 8, top);
  ctx.strokeRect(x + 4, 0, PIPE_WIDTH - 8, top);
  ctx.fillRect(x, top - cap, PIPE_WIDTH, cap);
  ctx.strokeRect(x, top - cap, PIPE_WIDTH, cap);
  // Corps + chapeau (bas)
  ctx.fillRect(x + 4, bottom, PIPE_WIDTH - 8, GROUND_Y - bottom);
  ctx.strokeRect(x + 4, bottom, PIPE_WIDTH - 8, GROUND_Y - bottom);
  ctx.fillRect(x, bottom, PIPE_WIDTH, cap);
  ctx.strokeRect(x, bottom, PIPE_WIDTH, cap);
  // Reflet
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(x + 10, 0, 6, top - cap);
  ctx.fillRect(x + 10, bottom + cap, 6, GROUND_Y - bottom - cap);
}

function drawBird(ctx, bird, t) {
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(bird.angle);
  // Corps
  ctx.fillStyle = '#f8d030';
  ctx.strokeStyle = '#533';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, BIRD_RADIUS + 4, BIRD_RADIUS + 1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Aile (bat selon le temps)
  const wing = Math.sin(t * 18) * 4;
  ctx.fillStyle = '#f0a020';
  ctx.beginPath();
  ctx.ellipse(-4, 3 + wing / 2, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Œil
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(7, -4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(9, -4, 2, 0, Math.PI * 2);
  ctx.fill();
  // Bec
  ctx.fillStyle = '#f05020';
  ctx.beginPath();
  ctx.ellipse(14, 3, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function render(ctx, game, t) {
  // Ciel
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, '#4ec0ca');
  sky.addColorStop(1, '#a5e2e8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Tuyaux
  for (const p of game.pipes) drawPipe(ctx, p.x, p.gapY - GAP / 2, p.gapY + GAP / 2);

  // Sol animé
  ctx.fillStyle = '#ded895';
  ctx.fillRect(0, GROUND_Y, WIDTH, GROUND_H);
  ctx.fillStyle = '#73bf2e';
  ctx.fillRect(0, GROUND_Y, WIDTH, 14);
  ctx.fillStyle = '#5a9a20';
  const off = game.groundOffset % 24;
  for (let x = -24 + off; x < WIDTH; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, GROUND_Y);
    ctx.lineTo(x + 12, GROUND_Y);
    ctx.lineTo(x + 24, GROUND_Y + 14);
    ctx.lineTo(x + 12, GROUND_Y + 14);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#533';
  ctx.fillRect(0, GROUND_Y, WIDTH, 2);

  drawBird(ctx, game.bird, t);

  // Interface
  if (game.state === 'ready') {
    text(ctx, 'FLAPPY BIRD', WIDTH / 2, 150, 44);
    text(ctx, 'Touchez pour sauter', WIDTH / 2, 380, 22);
    if (game.best > 0) text(ctx, `Record : ${game.best}`, WIDTH / 2, 415, 20, '#ffe680');
  } else if (game.state === 'playing') {
    text(ctx, String(game.score), WIDTH / 2, 80, 56);
  } else {
    // Game over
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    text(ctx, 'GAME OVER', WIDTH / 2, 190, 44, '#ffb347');
    ctx.fillStyle = '#ded895';
    ctx.strokeStyle = '#533';
    ctx.lineWidth = 3;
    ctx.fillRect(100, 230, 200, 110);
    ctx.strokeRect(100, 230, 200, 110);
    text(ctx, `Score : ${game.score}`, WIDTH / 2, 275, 26);
    text(ctx, `Record : ${game.best}`, WIDTH / 2, 320, 26, '#ffe680');
    if (game.canRestart) text(ctx, 'Touchez pour rejouer', WIDTH / 2, 400, 22);
  }
}
