const radians = Math.PI / 180;

function clampUnit(value) {
  return Math.min(1, Math.max(0, value));
}

function interpolation(progress, start, end) {
  const t = clampUnit((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
}

function incidenceShade(degrees) {
  const facing = Math.cos((degrees - 25) * radians);
  return .014 + .19 * (1 - Math.max(0, facing));
}

export function sampleFold(progress, single) {
  const mainOpen = interpolation(progress, .04, single ? .75 : .79);
  const endOpen = interpolation(progress, .17, .84);
  const align = interpolation(progress, .26, .85);
  const lift = interpolation(progress, 0, .23) * (1 - interpolation(progress, .48, .89));

  const middle = (single ? -54 : -52) * (1 - mainOpen);
  const end = single ? 0 : 108 * (1 - endOpen);
  const yaw = (single ? -7 : -8) * (1 - align);
  const firstCrease = single ? .5 : 1 / 3;
  const secondCrease = firstCrease + firstCrease * Math.cos(middle * radians);
  const edge = single ? secondCrease : secondCrease + firstCrease * Math.cos((middle + end) * radians);
  const width = Math.max(firstCrease, secondCrease, edge);

  return {
    x: 50 * (1 - width),
    y: (single ? -1.5 : 3.5) * (1 - align) - (single ? 2.5 : 4.5) * lift,
    scale: 1 - (single ? .29 : .21) * (1 - align) + .032 * lift,
    pitch: (single ? 17 : 16) * (1 - align) + 1.8 * lift,
    yaw,
    roll: (single ? 17 : 18) * (1 - align) - 1.6 * lift,
    middle,
    end,
    shadeOne: incidenceShade(yaw) * (1 - align),
    shadeTwo: incidenceShade(yaw + middle) * (1 - align),
    shadeThree: incidenceShade(yaw + middle + end) * (1 - align),
    shadowY: 16 + 9 * lift,
    shadowScale: .25 + .65 * width + .1 * lift,
    light: .14 * (1 - align),
    handoff: 100 * (1 - interpolation(progress, .84, .98)),
  };
}

function mountFold(scene) {
  if (!scene.querySelector('.poster-sheet') || !CSS.supports('transform-style', 'preserve-3d')) return;

  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const narrow = window.matchMedia('(max-width: 760px)');
  const stage = scene.querySelector('.poster-frame');
  const destination = document.querySelector('[data-fold-target]');
  const projectLink = destination?.closest('.lead-project')?.querySelector('.project-link');
  const artwork = destination?.querySelector(':scope > .case-art');
  const handoff = artwork?.cloneNode(true);
  if (handoff && stage) {
    handoff.classList.add('poster-handoff');
    handoff.setAttribute('aria-hidden', 'true');
    stage.append(handoff);
  }
  const dimensions = {
    x: '%', y: '%', scale: '', pitch: 'deg', yaw: 'deg', roll: 'deg',
    middle: 'deg', end: 'deg', shadeOne: '', shadeTwo: '', shadeThree: '',
    shadowY: '%', shadowScale: '', light: '', handoff: '%',
  };
  const properties = Object.entries(dimensions).map(([field, unit]) => [
    field, '--fold-' + field.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase()), unit,
  ]);
  const textures = new Map();
  let frame = 0;
  let ready = false;
  let start = 0;
  let distance = 1;
  let destinationEnters = Infinity;
  let travelStart = Infinity;
  let travelEnd = Infinity;
  let previousProgress = NaN;
  let activation = 0;

  function measure() {
    const viewport = document.documentElement.clientHeight;
    const sceneTop = scene.getBoundingClientRect().top + window.scrollY;
    start = Math.max(0, sceneTop - viewport * (narrow.matches ? .69 : .32));
    distance = Math.max(150, viewport * (narrow.matches ? .36 : .68));
    if (handoff && !narrow.matches) {
      const destinationTop = destination.getBoundingClientRect().top + window.scrollY;
      destinationEnters = destinationTop - viewport;
      travelStart = Math.max(start + distance, destinationEnters);
      travelEnd = Math.max(travelStart + viewport * .26, destinationTop - viewport * .59);
    }
    previousProgress = NaN;
  }

  function writePose() {
    frame = 0;
    if (!ready) return;

    const scroll = window.scrollY;
    const progress = clampUnit((scroll - start) / distance);
    const transfer = Boolean(handoff && !narrow.matches);
    const travel = transfer ? interpolation(scroll, travelStart, travelEnd) : 0;
    const flying = travel > 0 && travel < 1;
    const bypass = transfer && projectLink?.matches(':focus-visible');
    const from = flying && !bypass ? stage.getBoundingClientRect() : null;
    const to = from ? destination.getBoundingClientRect() : null;

    if (progress !== previousProgress) {
      previousProgress = progress;
      const pose = sampleFold(progress, narrow.matches);
      for (const [field, property, unit] of properties) {
        scene.style.setProperty(property, pose[field].toFixed(4) + unit);
      }
      scene.dataset.foldProgress = progress.toFixed(3);
      scene.toggleAttribute('data-fold-complete', transfer && progress === 1);
    }

    if (from && to) {
      handoff.style.setProperty('--fold-flight-x', ((to.left - from.left) * travel).toFixed(3) + 'px');
      handoff.style.setProperty('--fold-flight-y', ((to.top - from.top) * travel).toFixed(3) + 'px');
      handoff.style.setProperty('--fold-flight-width', (1 + (to.width / from.width - 1) * travel).toFixed(4));
      handoff.style.setProperty('--fold-flight-height', (1 + (to.height / from.height - 1) * travel).toFixed(4));
    }
    scene.toggleAttribute('data-fold-transferring', flying && !bypass);
    scene.toggleAttribute('data-fold-arrived', travel === 1 || Boolean(bypass && scroll >= destinationEnters));
    destination?.toggleAttribute('data-fold-await', transfer && !bypass && scroll >= destinationEnters && travel < 1);
  }

  function schedule() {
    if (ready && frame === 0) frame = window.requestAnimationFrame(writePose);
  }

  function resize() {
    if (!ready) return;
    measure();
    schedule();
  }

  function loadTexture(compact) {
    if (!textures.has(compact)) {
      const art = new Image();
      const path = compact ? '../img/poster-print-mobile.webp' : '../img/poster-print.webp';
      textures.set(compact, new Promise(resolve => {
        art.addEventListener('load', () => resolve(true), { once: true });
        art.addEventListener('error', () => resolve(false), { once: true });
        art.src = new URL(path, import.meta.url).href;
        if ('decode' in art) {
          art.decode().then(() => resolve(true), () => {});
        }
      }));
    }
    return textures.get(compact);
  }

  async function activate() {
    const ticket = ++activation;
    const isNarrow = narrow.matches;
    ready = false;
    scene.removeAttribute('data-fold-ready');
    scene.removeAttribute('data-fold-progress');
    scene.removeAttribute('data-fold-complete');
    scene.removeAttribute('data-fold-transferring');
    scene.removeAttribute('data-fold-arrived');
    destination?.removeAttribute('data-fold-await');
    if (frame !== 0) window.cancelAnimationFrame(frame);
    frame = 0;
    if (!motion.matches) return;

    const loaded = await loadTexture(isNarrow);
    if (!loaded || ticket !== activation) return;
    measure();
    ready = true;
    writePose();
    scene.setAttribute('data-fold-ready', '');
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pageshow', resize);
  motion.addEventListener('change', activate);
  narrow.addEventListener('change', activate);
  projectLink?.addEventListener('focus', schedule);
  projectLink?.addEventListener('blur', schedule);
  document.fonts?.ready.then(resize);

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(scene);
  activate();
}

if (typeof document !== 'undefined') {
  const scene = document.querySelector('[data-fold-scene]');
  if (scene) mountFold(scene);
}
