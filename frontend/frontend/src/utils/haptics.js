/**
 * HealthSaathi — Haptics & Sound Utilities
 * Uses Web Vibration API + Web Audio API
 */

// ── VIBRATION PATTERNS ──────────────────────────────────────
export const haptics = {
  /** Light tap — nav switch, button tap */
  light: () => vibrate([10]),

  /** Medium tap — submit, save */
  medium: () => vibrate([20]),

  /** Heavy — success confirmation */
  success: () => vibrate([10, 50, 20]),

  /** Error pattern */
  error: () => vibrate([30, 40, 30, 40, 30]),

  /** Mood logged — celebratory */
  celebrate: () => vibrate([15, 30, 15, 30, 50]),

  /** Breathing — inhale pulse */
  breathIn: () => vibrate([80]),

  /** Breathing — exhale */
  breathOut: () => vibrate([40]),

  /** Warning */
  warning: () => vibrate([20, 60, 20]),

  /** Custom pattern */
  custom: (pattern) => vibrate(pattern),
};

function vibrate(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {
    // Silently fail on unsupported devices
  }
}

// ── AUDIO CONTEXT (singleton) ────────────────────────────────
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

// ── SYNTH SOUNDS ─────────────────────────────────────────────
/**
 * Play a soft success chime
 */
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const freqs = [523.25, 659.25, 783.99]; // C5 E5 G5
  freqs.forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t);
    osc.stop(t + 0.4);
  });
}

/**
 * Play a soft error buzz
 */
export function playErrorSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
}

/**
 * Play a gentle notification ping
 */
export function playPing() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

/**
 * Resume audio context (required after user gesture on iOS)
 */
export function resumeAudio() {
  const ctx = getAudioContext();
  if (ctx?.state === 'suspended') ctx.resume();
}
