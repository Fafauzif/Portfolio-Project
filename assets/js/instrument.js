import { freqToUnit, freqAtTune, meterGeometry } from './metrics.js';
import { STATIONS, BANDS, FREQS } from './data.js';

const MINOR_PER_MAJOR = 4;

/** Build the scale: real text ticks, crisp at any DPI. */
function buildScale(scaleEl) {
  const n = STATIONS.length;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < n; i++) {
    const at = freqToUnit(FREQS[i]) * 100;

    for (let m = 0; m < MINOR_PER_MAJOR; m++) {
      const prev = i === 0 ? FREQS[0] : FREQS[i - 1];
      const frac = m / MINOR_PER_MAJOR;
      const f = i === 0 ? FREQS[0] : prev + (FREQS[i] - prev) * frac;
      const t = document.createElement('div');
      t.className = 'tick tick--minor';
      t.style.setProperty('--at', `${freqToUnit(f) * 100}%`);
      frag.appendChild(t);
    }

    const major = document.createElement('div');
    major.className = 'tick tick--major';
    major.style.setProperty('--at', `${at}%`);
    frag.appendChild(major);

    const lbl = document.createElement('span');
    lbl.className = 'freq';
    lbl.style.setProperty('--at', `${at}%`);
    lbl.textContent = FREQS[i].toFixed(1);
    lbl.dataset.station = String(i);
    frag.appendChild(lbl);
  }

  // Trailing minors up to the top of the scale.
  for (let m = 0; m <= MINOR_PER_MAJOR; m++) {
    const f = FREQS[n - 1] + (108 - FREQS[n - 1]) * (m / MINOR_PER_MAJOR);
    const t = document.createElement('div');
    t.className = 'tick tick--minor';
    t.style.setProperty('--at', `${freqToUnit(f) * 100}%`);
    frag.appendChild(t);
  }

  scaleEl.prepend(frag);
}

export function createInstrument({ stations = STATIONS, bands = BANDS, freqs = FREQS } = {}) {
  const el = {
    scale:      document.getElementById('scale'),
    needle:     document.getElementById('needle'),
    bands:      document.getElementById('bands'),
    counter:    document.getElementById('counter'),
    readout:    document.getElementById('readout'),
    Kicker:     document.getElementById('r-kicker'),
    title:      document.getElementById('r-title'),
    desc:       document.getElementById('r-desc'),
    metrics:    document.getElementById('metrics'),
    meter:      document.getElementById('meter'),
    mLift:      document.getElementById('m-lift'),
    mFill:      document.getElementById('m-fill'),
    mFloor:     document.getElementById('m-floor'),
    mFloorLbl:  document.getElementById('m-floor-lbl'),
    mResultLbl: document.getElementById('m-result-lbl'),
    card:       document.getElementById('card'),
    cardCh:     document.getElementById('c-ch'),
    cardTitle:  document.getElementById('c-title'),
    cardArt:    document.getElementById('c-art'),
    staticEl:   document.getElementById('static'),
    live:       document.getElementById('live'),
  };

  buildScale(el.scale);

  const mqMobile = window.matchMedia('(max-width: 820px)');
  const state = { index: 0, band: 'work' };
  let lastLift = null;

  const bandIndices = (band) =>
    stations.reduce((acc, s, i) => (s.band === band ? (acc.push(i), acc) : acc), []);

  // The .mask wrappers outlive every swap; the spans inside them do not.
  const masks = {
    kicker: el.Kicker.closest('.mask'),
    title:  el.title.closest('.mask'),
    desc:   el.desc.closest('.mask'),
  };
  const liveSpan = new WeakMap();

  function setMaskText(mask, text, { dir = 1, order = 0, animate = true } = {}) {
    if (!mask) return;
    const prev = liveSpan.get(mask) ?? mask.querySelector('span');
    const span = document.createElement('span');
    span.textContent = text;
    liveSpan.set(mask, span);

    if (!animate) {
      mask.replaceChildren(span);
      return;
    }

    // Anything still on its way out is dropped: a fast tune must not stack three.
    mask.querySelectorAll('[data-leaving]').forEach((n) => n.remove());

    span.style.transitionDelay = `${order * 60}ms`;
    span.style.transform = `translateY(${dir * 110}%)`;
    mask.append(span);

    if (prev && prev !== span) {
      prev.dataset.leaving = '';
      prev.style.position = 'absolute';
      prev.style.inset = '0';
      prev.style.transform = `translateY(${-dir * 110}%)`;
      setTimeout(() => prev.remove(), 760); // each span owns exactly one timer
    }

    requestAnimationFrame(() => { span.style.transform = 'translateY(0)'; });
  }

  function renderStation(index, dir = 1, { instant = false } = {}) {
    const s = stations[index];
    const reduced = document.documentElement.dataset.reduced === 'true';

    const animate = !(instant || reduced);
    setMaskText(masks.kicker, s.tag.toUpperCase(), { dir, order: 0, animate });
    setMaskText(masks.title, s.title, { dir, order: 1, animate });
    setMaskText(masks.desc, s.desc, { dir, order: 2, animate });

    el.cardCh.textContent = `CH ${String(s.ch).padStart(3, '0')}`;
    el.cardTitle.textContent = s.title;
    el.cardArt.textContent = s.artifact;
    el.card.setAttribute('aria-label', `Open station ${s.ch}: ${s.title}`);

    el.metrics.replaceChildren(
      ...s.metrics.map((m) => {
        const wrap = document.createElement('div');
        wrap.className = 'metric';
        const dt = document.createElement('dt');
        dt.textContent = m.l;
        const dd = document.createElement('dd');
        dd.textContent = m.v;
        wrap.append(dt, dd);
        return wrap;
      }),
    );

    // Meter — refuses to invent a baseline.
    const g = meterGeometry(s.lift);
    el.meter.dataset.hasLift = String(g.hasLift);
    if (g.hasLift) {
      el.mFill.style.width = `${g.resultPct}%`;
      el.mFloor.style.left = `${g.floorPct}%`;
      el.mLift.textContent = `${s.lift > 0 ? '+' : ''}${s.lift}%`;
      el.mFloorLbl.textContent = s.floorLabel;
      el.mResultLbl.textContent = 'Result';
      el.meter.querySelector('.meter__note')?.remove();
    } else {
      el.mFill.style.width = '100%';
      el.mFloor.style.left = '0%';
      el.mLift.textContent = 'No baseline';
      el.mFloorLbl.textContent = 'Not benchmarked';
      el.mResultLbl.textContent = 'Not measured';
      let note = el.meter.querySelector('.meter__note');
      if (!note) {
        note = document.createElement('p');
        note.className = 'meter__note';
        el.meter.appendChild(note);
      }
      note.textContent = s.note ?? '';
    }
    lastLift = s.lift;

    el.counter.innerHTML = `CH ${String(s.ch).padStart(3, '0')}<span> / ${String(stations.length).padStart(3, '0')}</span>`;
    el.scale.setAttribute('aria-valuenow', String(index));
    el.scale.setAttribute('aria-valuetext', `Station ${index + 1} of ${stations.length}: ${s.title}, ${s.freq.toFixed(1)}`);
    announce(s);

    document.querySelectorAll('.freq').forEach((f) => {
      f.dataset.active = String(Number(f.dataset.station) === index);
    });

    state.index = index;
  }

  let liveTimer = 0;
  /** Announce on settle only: a polite region fired per tick talks over itself. */
  function announce(s) {
    clearTimeout(liveTimer);
    liveTimer = setTimeout(() => {
      if (document.activeElement === el.scale) return; // the slider reports it already
      el.live.textContent = `Station ${s.ch}: ${s.title}. ${s.tag}.`;
    }, 340);
  }

  function fireStatic(long = false) {
    if (document.documentElement.dataset.reduced === 'true') return;
    const cls = long ? 'is-firing--long' : 'is-firing';
    el.staticEl.classList.remove('is-firing', 'is-firing--long');
    void el.staticEl.offsetWidth;
    el.staticEl.classList.add(cls);
  }

  function setBand(band, { fromUser = true } = {}) {
    if (band === state.band) return;
    state.band = band;
    [...el.bands.querySelectorAll('button')].forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.band === band));
    });
    syncScaleRange();
    fireStatic(true);
    const idxs = bandIndices(band);
    if (fromUser) engine?.goTo(idxs[0]);
  }

  let engine = null;

  function attachEngine(e) {
    engine = e;
  }

  function range() {
    const idxs = bandIndices(state.band);
    return [idxs[0], idxs[idxs.length - 1]];
  }

  /** The slider's declared bounds must track its band, or AT announces unreachable values. */
  function syncScaleRange() {
    const [lo, hi] = range();
    el.scale.setAttribute('aria-valuemin', String(lo));
    el.scale.setAttribute('aria-valuemax', String(hi));
    el.scale.setAttribute('aria-orientation', mqMobile.matches ? 'vertical' : 'horizontal');
  }

  function onTune(tune) {
    const scaleW = el.scale.clientWidth;
    const vertical = mqMobile.matches;
    const unit = freqToUnit(freqAtTune(tune, freqs));
    if (vertical) {
      el.needle.style.transform = `translate3d(0, ${unit * el.scale.clientHeight}px, 0)`;
    } else {
      el.needle.style.transform = `translate3d(${unit * scaleW}px, 0, 0)`;
    }
  }

  function attachBands() {
    el.bands.replaceChildren(
      ...bands.map((b, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.band = b.id;
        btn.textContent = b.label;
        btn.setAttribute('aria-pressed', String(i === 0));
        btn.addEventListener('click', () => setBand(b.id));
        return btn;
      }),
    );
    el.bands.setAttribute('role', 'group');
    el.bands.setAttribute('aria-label', 'Filter the dial by band');
  }

  attachBands();
  syncScaleRange();
  mqMobile.addEventListener('change', syncScaleRange);

  return {
    el,
    attachEngine,
    range,
    onTune,
    fireStatic,
    renderStation,
    get index() { return state.index; },
    get band() { return state.band; },
    get station() { return stations[state.index]; },
    setBand,
    bandIndices,
    get lastLift() { return lastLift; },
  };
}
