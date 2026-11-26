/** Convert an element rect to clip-path inset values, never negative. */
export function insetFromRects(card, vp) {
  return {
    top: Math.max(0, card.top),
    right: Math.max(0, vp.width - card.right),
    bottom: Math.max(0, vp.height - card.bottom),
    left: Math.max(0, card.left),
  };
}

const reduced = () => document.documentElement.dataset.reduced === 'true';

// Generation token shared by every open and close. A close awaits ~850ms before touching
// the DOM, and a click in that window can open the sheet again; the token lets the stale
// close continuation notice that it no longer owns the sheet and stand down.
let token = 0;

export function createSheet() {
  const sheet = document.getElementById('sheet');
  const panel = document.getElementById('sheet-panel');
  const closeBtn = document.getElementById('sheet-close');
  const card = document.getElementById('card');
  const f = {
    tag: document.getElementById('s-tag'),
    title: document.getElementById('s-title'),
    meta: document.getElementById('s-meta'),
    metrics: document.getElementById('s-metrics'),
    art: document.getElementById('s-art'),
    note: document.getElementById('s-note'),
  };

  let open = false;
  let opener = null;

  function render(s) {
    f.tag.textContent = s.tag.toUpperCase();
    f.title.textContent = s.title;
    f.meta.textContent = `${s.freq.toFixed(1)} MHz · CH ${String(s.ch).padStart(3, '0')} · ${s.artifact}`;
    f.metrics.replaceChildren(
      ...s.metrics.map((m) => {
        const d = document.createElement('div');
        d.className = 'sheet__metric';
        const dd = document.createElement('dd');
        dd.textContent = m.v;
        const dt = document.createElement('dt');
        dt.textContent = m.l;
        d.append(dt, dd);
        return d;
      }),
    );
    f.art.textContent = s.artifact;
    f.note.textContent = s.note
      ? s.note
      : 'Placeholder artifact. When the real work lands, this frame holds the deck spread, the screenshot or the recording.';
  }

  function rectOf(el) {
    const r = el.getBoundingClientRect();
    return { top: r.top, left: r.left, right: r.right, bottom: r.bottom };
  }

  function trapTab(e) {
    if (e.key !== 'Tab') return;
    const focusables = sheet.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    // Clicking plain text in the panel leaves focus on <body>, which matches neither edge,
    // so pull focus back inside the aria-modal dialog before Tab can walk out behind it.
    if (!sheet.contains(document.activeElement)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onKey(e) {
    // The panel is still painted during the 850ms close, so keep trapping Tab after `open`
    // flips false; only stop once the sheet is actually hidden again.
    if (!open) {
      if (!sheet.hidden) trapTab(e);
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSheet();
    }
    trapTab(e);
  }

  async function openSheet(s, trigger) {
    if (open) return;
    open = true;
    // Any close still parked on its await is now stale and must not hide this sheet.
    token += 1;
    opener = trigger ?? card;
    render(s);

    const from = insetFromRects(rectOf(card), { width: window.innerWidth, height: window.innerHeight });
    sheet.hidden = false;
    document.body.dataset.sheet = 'open';

    const animation = panel.animate(
      [
        { clipPath: `inset(${from.top}px ${from.right}px ${from.bottom}px ${from.left}px round 3px)`, transform: 'rotate(-2.5deg)' },
        { clipPath: 'inset(0px 0px 0px 0px round 0px)', transform: 'rotate(0deg)' },
      ],
      { duration: reduced() ? 0 : 1050, easing: 'cubic-bezier(.76,0,.18,1)', fill: 'both' },
    );
    animation.finished.catch(() => {});

    if (!reduced()) {
      sheet.querySelectorAll('.sheet__rise').forEach((line, i) => {
        line.animate(
          [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }],
          { duration: 900, delay: 620 + i * 75, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' },
        );
      });
    }

    closeBtn.focus({ preventScroll: true });
  }

  async function closeSheet() {
    if (!open) return;
    open = false;
    const mine = ++token;
    const to = insetFromRects(rectOf(card), { width: window.innerWidth, height: window.innerHeight });
    const animation = panel.animate(
      [
        { clipPath: 'inset(0px 0px 0px 0px round 0px)', transform: 'rotate(0deg)' },
        { clipPath: `inset(${to.top}px ${to.right}px ${to.bottom}px ${to.left}px round 3px)`, transform: 'rotate(-2.5deg)' },
      ],
      { duration: reduced() ? 0 : 850, easing: 'cubic-bezier(.76,0,.18,1)', fill: 'both' },
    );
    await animation.finished.catch(() => {});
    // A re-open bumped the token while this close was waiting, so that open owns the sheet
    // now: bail out before hiding it and stranding `open` true with nothing painted.
    if (mine !== token) return;
    panel.getAnimations().forEach((a) => a.cancel());
    // `.sheet__rise` lines are descendants, so only a subtree query reaches their animations.
    sheet.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    sheet.hidden = true;
    delete document.body.dataset.sheet;
    opener?.focus({ preventScroll: true });
  }

  closeBtn.addEventListener('click', closeSheet);
  sheet.addEventListener('click', (e) => {
    if (e.target === sheet) closeSheet();
  });
  document.addEventListener('keydown', onKey);

  return { openSheet, closeSheet, isOpen: () => open };
}
