let ctx = null;

function beep(freq, duration, type = 'square', gain = 0.08) {
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(g).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // audio indisponible : on ignore
  }
}

export const sound = {
  flap: () => beep(520, 0.1),
  score: () => beep(880, 0.12, 'sine', 0.1),
  hit: () => beep(120, 0.3, 'sawtooth', 0.12),
};
