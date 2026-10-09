const KEY = 'flappy-best';

export function loadBest() {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
}

export function saveBest(score) {
  try {
    localStorage.setItem(KEY, String(score));
  } catch {
    // stockage indisponible : on ignore
  }
}
