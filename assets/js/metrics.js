/**
 * metrics.js — pure tuning math. No DOM, no globals, no side effects.
 * Kept separate so `node --test` can exercise it without a browser.
 */

const MIN_FREQ = 87.5;
const MAX_FREQ = 108.0;

/** Exponential spring step. `k = Infinity` snaps exactly. */
export function springStep(current, target, k, dt) {
  if (!Number.isFinite(k)) return target;
  if (dt <= 0) return current;
  return current + (target - current) * (1 - Math.exp(-k * dt));
}

/** Frequency → 0..1 position along the scale. */
export function freqToUnit(freq, min = MIN_FREQ, max = MAX_FREQ) {
  const u = (freq - min) / (max - min);
  return u < 0 ? 0 : u > 1 ? 1 : u;
}

/** 0..1 position along the scale → frequency. */
export function unitToFreq(u, min = MIN_FREQ, max = MAX_FREQ) {
  const c = u < 0 ? 0 : u > 1 ? 1 : u;
  return min + c * (max - min);
}

/**
 * Continuous tune value (0..freqs.length-1) → the frequency the needle sits on.
 * Station spacing is deliberately uneven, so this interpolates between neighbours.
 */
export function freqAtTune(tune, freqs) {
  if (freqs.length === 0) return MIN_FREQ;
  if (freqs.length === 1) return freqs[0];
  const t = tune < 0 ? 0 : tune > freqs.length - 1 ? freqs.length - 1 : tune;
  const i = Math.floor(t);
  const f = t - i;
  if (i >= freqs.length - 1) return freqs[freqs.length - 1];
  return freqs[i] + (freqs[i + 1] - freqs[i]) * f;
}

/** Snap a free tune value to the nearest legal station index. */
export function nearestStation(tune, count) {
  if (count <= 0) return 0;
  const r = Math.round(tune);
  return r < 0 ? 0 : r > count - 1 ? count - 1 : r;
}

/** Wheel events report two axes; the dial follows whichever moved further. */
export function wheelToDelta(a, b) {
  return Math.abs(a) >= Math.abs(b) ? a : b;
}

/**
 * Meter geometry. `lift` is percent above baseline, or null when nothing was measured.
 * With a lift: the result pins to 100% and the floor sits at 10000/(100+lift).
 * +154% → floor at 39.4%. Without one, we refuse to invent a baseline.
 */
export function meterGeometry(lift, resultPct = 100) {
  if (lift === null || lift === undefined || !Number.isFinite(lift)) {
    return { hasLift: false, floorPct: null, liftPct: null, resultPct };
  }
  if (lift > 0) {
    return { hasLift: true, floorPct: 10000 / (100 + lift), liftPct: lift, resultPct: 100 };
  }
  const result = Math.max(0, 100 + lift);
  return { hasLift: true, floorPct: 100, liftPct: lift, resultPct: result };
}

export const SCALE = { min: MIN_FREQ, max: MAX_FREQ };
