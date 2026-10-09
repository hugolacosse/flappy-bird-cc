export function setupInput(target, onFlap) {
  target.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    onFlap();
  });
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      if (!e.repeat) onFlap();
    }
  });
}
