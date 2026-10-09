export const BIRD_RADIUS = 12;

const GRAVITY = 1500;   // px/s²
const FLAP_SPEED = -420; // px/s
const MAX_FALL = 700;

export function createBird(x, y) {
  return { x, y, vy: 0, angle: 0 };
}

export function flap(bird) {
  bird.vy = FLAP_SPEED;
}

export function updateBird(bird, dt) {
  bird.vy = Math.min(bird.vy + GRAVITY * dt, MAX_FALL);
  bird.y += bird.vy * dt;
  // Inclinaison : vers le haut quand on monte, piqué quand on tombe
  const target = Math.max(-0.45, Math.min(1.2, bird.vy / 500));
  bird.angle += (target - bird.angle) * Math.min(1, dt * 12);
}
