import { springStep, wheelToDelta, nearestStation } from './metrics.js';

const K        = 5.2;    // proven settle from the reference builds
const K_DRAG   = 18;     // 1:1 feel while dragging
const DT_MAX   = 0.033;
const SNAP_EPS = 1e-3;   // station units — settles in ~0.9s rather than 1.8s
const IDLE_MS  = 160;
const DRAG_PX  = 6;

/** Clamp to the legal range; snap only when already within epsilon of a station. */
export function reduceTune(target, count, snap = true) {
  const clamped = Math.max(0, Math.min(count - 1, target));
  if (!snap) return clamped;
  const near = Math.round(clamped);
  return Math.abs(clamped - near) < SNAP_EPS ? near : clamped;
}

/**
 * One rAF loop owns one spring scalar.
 * Emits onTune(tune) every frame and onStation(index, dir) when intent changes.
 *
 * Reduced motion is read live from <html data-reduced> rather than captured at
 * construction: an OS preference can change mid-session and every path — the
 * spring, the release momentum, the wheel — has to agree on what it means.
 */
export function createEngine({ count, onTune, onStation, getStep, getRange, getTouch }) {
  let tune = 0;
  let target = 0;
  let lastIndex = 0;
  let dir = 1;

  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragMoved = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let lastPointerT = 0;
  let velocity = 0;

  let idle = 0;
  let raf = 0;
  let last = 0;

  const isReduced = () => document.documentElement.dataset.reduced === 'true';

  const range = () => getRange?.() ?? [0, count - 1];
  const clampToRange = (v) => {
    const [lo, hi] = range();
    return Math.max(lo, Math.min(hi, v));
  };
  const getStepPx = () => getStep?.() || 80;

  function emitTune() {
    onTune?.(tune);
  }

  function emitStation() {
    const idx = nearestStation(target, count);
    if (idx !== lastIndex) {
      dir = idx > lastIndex ? 1 : -1;
      lastIndex = idx;
      onStation?.(idx, dir);
    }
  }

  function setTarget(v, { snap = false } = {}) {
    target = snap ? reduceTune(clampToRange(v), count) : clampToRange(v);
    emitStation();
    if (isReduced()) {
      tune = target;
      emitTune();
      return;
    }
    start(); // every target change has to wake the loop, or the needle freezes
  }

  function scheduleIdleSnap() {
    clearTimeout(idle);
    idle = setTimeout(() => {
      if (dragging) return;
      target = reduceTune(clampToRange(target), count);
      emitStation();
      if (isReduced()) { tune = target; emitTune(); }
    }, IDLE_MS);
  }

  function frame(now) {
    raf = 0;
    const dt = Math.min(DT_MAX, last ? (now - last) / 1000 : DT_MAX);
    last = now;

    if (isReduced()) {
      tune = target;
    } else {
      tune = springStep(tune, target, dragging ? K_DRAG : K, dt);
      if (Math.abs(target - tune) < SNAP_EPS) tune = target;
    }

    emitTune();

    if (isReduced()) { last = 0; return; }
    if (tune !== target) start();
    else last = 0;
  }

  function start() {
    if (raf) return;
    raf = requestAnimationFrame(frame);
  }

  // ── Input ────────────────────────────────────────────────────────────────
  function onWheel(e) {
    const raw = wheelToDelta(e.deltaY, e.deltaX);
    const mult = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
    const delta = Math.max(-480, Math.min(480, raw * mult));
    if (!delta) return;

    const [lo, hi] = range();
    // At the ends of the band, hand the gesture back to the page. A 104px strip
    // that swallows every wheel tick is scroll-jacking, not a control.
    if (delta > 0 && target >= hi - SNAP_EPS) return;
    if (delta < 0 && target <= lo + SNAP_EPS) return;

    e.preventDefault();
    setTarget(target + (delta / getStepPx()) * 0.5);
    scheduleIdleSnap();
  }

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true;
    dragMoved = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    lastPointerT = performance.now();
    velocity = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;

    const vertical = getTouch?.() === 'vertical';
    const fromStart = vertical ? e.clientY - dragStartY : e.clientX - dragStartX;

    if (!dragMoved) {
      if (Math.abs(fromStart) <= DRAG_PX) return;
      dragMoved = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      lastPointerT = performance.now();
      return; // don't leap by the 6px that armed the drag
    }

    const now = performance.now();
    const dt = now - lastPointerT;
    const delta = vertical ? e.clientY - lastPointerY : e.clientX - lastPointerX;
    if (dt > 0) velocity = (delta / dt) * 1000;

    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    lastPointerT = now;

    // Integrated relative to the last move, not replayed from the press point,
    // so a keypress or a report-row jump mid-drag is not silently discarded.
    target = clampToRange(target - delta / getStepPx());
    emitStation();
    start(); // the needle has to track the finger, not just snap on release
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    if (dragMoved && !isReduced()) {
      target = clampToRange(target - (velocity / getStepPx()) * 0.35);
    }
    target = reduceTune(clampToRange(target), count);
    emitStation();
    last = 0;
    start();
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  /** A cancelled gesture is not a throw: settle where the finger left it. */
  function onPointerCancel() {
    if (!dragging) return;
    dragging = false;
    target = reduceTune(clampToRange(target), count);
    emitStation();
    last = 0;
    start();
  }

  function onKeyDown(e) {
    const [lo, hi] = range();
    let v = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v = nearestStation(target, count) + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v = nearestStation(target, count) - 1;
    else if (e.key === 'Home') v = lo;
    else if (e.key === 'End') v = hi;
    if (v === null) return;
    e.preventDefault();
    setTarget(Math.max(lo, Math.min(hi, v)), { snap: true });
  }

  return {
    attach(scaleEl) {
      scaleEl.addEventListener('wheel', onWheel, { passive: false });
      scaleEl.addEventListener('pointerdown', onPointerDown);
      scaleEl.addEventListener('pointermove', onPointerMove);
      scaleEl.addEventListener('pointerup', onPointerUp);
      scaleEl.addEventListener('pointercancel', onPointerCancel);
      scaleEl.addEventListener('keydown', onKeyDown);
      this._scale = scaleEl;
    },
    goTo(index) {
      setTarget(index, { snap: true });
      last = 0;
      start();
    },
    get target() { return target; },
    get tune() { return tune; },
    get dir() { return dir; },
    get dragging() { return dragging; },
    destroy() {
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      const el = this._scale;
      if (!el) return;
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerCancel);
      el.removeEventListener('keydown', onKeyDown);
    },
  };
}
