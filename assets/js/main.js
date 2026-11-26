import { STATIONS } from './data.js';
import { createEngine } from './engine.js';
import { createInstrument } from './instrument.js';
import { createSheet } from './sheet.js';
import { initReport } from './report.js';

function boot() {
  const root = document.documentElement;
  const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqMobile = window.matchMedia('(max-width: 820px)');

  const applyReduced = () => { root.dataset.reduced = String(mqReduced.matches); };
  applyReduced();
  mqReduced.addEventListener('change', applyReduced);

  const instrument = createInstrument();
  const sheet = createSheet();

  const engine = createEngine({
    count: STATIONS.length,
    onTune: (t) => instrument.onTune(t),
    onStation: (index, dir) => {
      instrument.renderStation(index, dir);
      instrument.fireStatic(dir < 0);
    },
    getStep: () => {
      const s = instrument.el.scale;
      const n = Math.max(1, STATIONS.length - 1);
      return mqMobile.matches ? s.clientHeight / n : s.clientWidth / n;
    },
    getRange: () => instrument.range(),
    getTouch: () => (mqMobile.matches ? 'vertical' : 'horizontal'),
  });

  instrument.attachEngine(engine);
  engine.attach(instrument.el.scale);

  instrument.renderStation(0, 1, { instant: true });
  // Measure once the layout has settled so the needle lands on station 1.
  requestAnimationFrame(() => instrument.onTune(0));

  // onTune turns a tune value into pixels from the scale's current size, so a
  // viewport change would leave the needle at a stale offset until the next
  // tune. Re-measure from the live display value, debounced because dragging a
  // window edge fires resize on every frame and each pass forces layout.
  let resizeTimer = 0;
  const remeasure = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => instrument.onTune(engine.tune), 120);
  };
  window.addEventListener('resize', remeasure);
  window.addEventListener('orientationchange', remeasure);

  const openStation = () => sheet.openSheet(instrument.station, instrument.el.card);
  instrument.el.card.addEventListener('click', openStation);
  instrument.el.scale.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openStation();
    }
  });

  // Report rows jump the dial to their station.
  document.querySelectorAll('[data-go]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const idx = Number(link.dataset.go);
      if (!Number.isFinite(idx)) return;
      e.preventDefault();
      // goTo() clamps to the ACTIVE band's range, so a row pointing outside it
      // (report row 01 while Writing is active) would open the band's first
      // station instead. Switch the band first — with fromUser:false, so setBand
      // does not jump on its own and we get one move, not two.
      const s = STATIONS[idx];
      if (!s) return;
      instrument.setBand(s.band, { fromUser: false });
      engine.goTo(idx);
      document.getElementById('stage').scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  });

  initReport();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
