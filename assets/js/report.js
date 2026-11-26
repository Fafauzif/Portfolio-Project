/** Mask-only reveals for the report. Nothing here fades content in. */

const reduced = () => document.documentElement.dataset.reduced === 'true';

function format(n, mode) {
  if (mode === 'comma') return Math.round(n).toLocaleString('en-US');
  return String(Math.round(n));
}

function countUp(el) {
  const to = Number(el.dataset.count);
  if (!Number.isFinite(to)) return;
  const prefix = el.dataset.prefix ?? '';
  const suffix = el.dataset.suffix ?? '';
  const mode = el.dataset.format ?? 'plain';
  const final = prefix + format(to, mode) + suffix;

  if (reduced()) {
    el.textContent = final;
    return;
  }

  const dur = 900;
  const t0 = performance.now();
  let done = false;

  function step(now) {
    if (done) return;
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + format(to * eased, mode) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else { done = true; el.textContent = final; }
  }
  requestAnimationFrame(step);
}

export function initReport() {
  const targets = document.querySelectorAll('[data-in]');
  const counters = new Map();

  if (reduced() || !('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('in'));
    document.querySelectorAll('[data-count]').forEach(countUp);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        entry.target.querySelectorAll('[data-count]').forEach((el) => {
          if (counters.has(el)) return;
          counters.set(el, true);
          countUp(el);
        });
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
  );

  targets.forEach((t) => io.observe(t));
}
