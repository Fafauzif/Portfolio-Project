# SIGNAL Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the SIGNAL homepage — a tuning-instrument stage over a scrolling editorial report — as hand-coded static HTML/CSS/JS with placeholder content only.

**Architecture:** One `index.html`. The first `100svh` is the instrument: a deep panel holding a printed scale card, a spring-driven needle, a three-band switch, a station readout, three metrics and a signal meter. All tuner geometry derives from one unit (`--u`). A single `requestAnimationFrame` loop owns one spring scalar. Below the instrument the page becomes an editorial document with mask-only reveals. Opening a station grows a paper sheet out of the artifact card's real `getBoundingClientRect()` via `clip-path`, showing placeholder station detail in-page — no case-study URLs yet.

**Tech Stack:** Static HTML, plain CSS (custom properties, no framework), vanilla ES modules, self-hosted woff2 fonts, `node --test` for the pure math.

**Spec:** `docs/portfolio/09-concept-signal.md` (concept, palette, physics), constrained by `docs/portfolio/08-craft-rules.md` (technique) and `docs/portfolio/01-site-architecture.md` (funnel).

## Global Constraints

- Palette, verbatim from `09` §2: `--paper #F2EFE8`, `--paper-sunk #E7E2D8`, `--ink #101A24`, `--ink-soft #2C3B49`, `--mute #5D6B76`, `--blue #2B5CF0`, `--blue-deep #14309A`, `--cobalt #1F3FB0`, `--deep #070D14`, `--deep-2 #0D1824`, `--stage-line #1B2A38`, `--paper-on-deep #EDF1F6`, `--glow #5BE1FF`, `--azure #3AA8D0`.
- Contrast law: `--blue` only for text ≥16px on paper; `--blue-deep` or `--cobalt` for smaller accent text; `--azure` never on paper (2.38:1); `--blue` never sets text on `--deep` (3.61:1).
- Type: Newsreader 400 (+italic) serif; Inter Tight 500/600; Geist Mono 400/500. **No font-size below 11px.** No tap target below 24px (44px outside running text).
- Motion: `--ease-out cubic-bezier(.16,1,.3,1)`, `--ease-mask cubic-bezier(.2,.8,.2,1)`, `--ease-sheet cubic-bezier(.76,0,.18,1)`. Spring `k=5.2`, drag `k=18`, `dt ≤ .033`, snap at `1e-4`.
- **Reveals are masks, clips or scales — zero `opacity` fades for content reveals.** (Gradients/static overlays may animate opacity; content may not.)
- Reduced motion: needle snaps (`k → ∞`), static burst off, sheet instant, every value still shown.
- No custom cursor. No scroll-jacking. No `scroll-behavior: smooth`.
- Content is **placeholder**: no claim may be presented as a real, sourced metric. Every invented figure carries a visible placeholder affordance.
- Scale span `87.5`–`108.0`; 14 stations.

## Review Focus

- A station with **no numeric lift** must not render a fabricated `+n%`; the meter falls back to a labelled absolute reading.
- `metrics.js` pure functions must stay DOM-free so `node --test` runs without a browser.
- The sheet must clamp correctly when the sheet's own rect exceeds the viewport (`inset` values cannot go negative in a way that breaks `clip-path`).
- Wheel and drag must not fight `overscroll`; the instrument must not trap the page inside a locked stage.
- Keyboard-only: Tab order, `Enter` to open a station, `Escape` to close, focus returned to the trigger.

---

## File Structure

| File | Responsibility |
|---|---|
| `index.html` | Entire document: head, header, instrument stage, report section, footer, sheet template |
| `assets/css/tokens.css` | Colour, type, spacing, easing, `--u` — every variable |
| `assets/css/base.css` | Reset, fonts, type scale, prose, focus rings, skip link |
| `assets/css/instrument.css` | Panel, scale card, needle, bands, readout, metrics, meter, static |
| `assets/css/report.css` | Scroll document: proof strip, work rows, ledger, contact, footer |
| `assets/js/data.js` | 14 stations + band definitions |
| `assets/js/metrics.js` | **Pure** math: spring, frequency↔pixel, nearest station, meter geometry. DOM-free. |
| `assets/js/engine.js` | rAF loop, spring state, input (wheel/drag/keys), emits station changes |
| `assets/js/instrument.js` | DOM wiring: builds ticks, needle, bands, readout, meter; consumes engine events |
| `assets/js/sheet.js` | Clip-path sheet transition, focus trap, Esc, focus restore |
| `assets/js/report.js` | Mask reveals for the scroll section + proof-strip count-up |
| `assets/js/main.js` | Boot: reduced-motion detection, tier selection, module wiring |
| `test/metrics.test.js` | `node --test` suite for `metrics.js` |
| `tools/serve.mjs` | 40-line static server so modules/fonts load over `http://` |

`metrics.js` is a separate file purely so it can be unit-tested without a DOM. Everything else is deliberately one-file-per-responsibility.

---

### Task 1: Tokens, fonts and base

**Files:**
- Create: `assets/css/tokens.css`, `assets/css/base.css`, `tools/serve.mjs`
- Test: `test/tokens.test.js`

**Interfaces:**
- Produces: CSS custom properties used by every later task — `--paper`, `--ink`, `--deep`, `--blue`, `--glow`, `--ease-mask`, `--u`, `--font-serif`, `--font-sans`, `--font-mono`.

- [ ] **Step 1: Write the failing test**

```js
// test/tokens.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('tokens.css declares every required custom property', async () => {
  const css = await readFile('assets/css/tokens.css', 'utf8');
  for (const name of ['--paper','--ink','--deep','--blue','--glow','--ease-mask','--u','--font-serif','--font-sans','--font-mono']) {
    assert.ok(css.includes(name + ':'), `missing ${name}`);
  }
});

test('no font-size below 11px is declared anywhere', async () => {
  for (const f of ['assets/css/tokens.css','assets/css/base.css']) {
    const css = await readFile(f, 'utf8');
    for (const m of css.matchAll(/font-size:\s*([\d.]+)px/g)) {
      assert.ok(Number(m[1]) >= 11, `${f}: ${m[0]}`);
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/tokens.test.js`
Expected: FAIL — `ENOENT` on `assets/css/tokens.css`.

- [ ] **Step 3: Write `assets/css/tokens.css` and `assets/css/base.css`**

`tokens.css` holds the `:root` block with the Global Constraints palette verbatim, the three font stacks, the easing tokens, and `--u: min(100vw / 1440, 100vh / 900)` with a media query overriding to `100vw / 390` under 820px. `base.css` holds reset, `@font-face` for the six self-hosted woff2 files in `assets/fonts/`, the type scale from `09` §3, the skip link and the `:focus-visible` ring (`2px var(--glow)`, `2px` offset, on deep; `2px var(--cobalt)` on paper).

- [ ] **Step 4: Write `tools/serve.mjs`**

A 40-line `node:http` server: serves files from the repo root, maps `/` → `index.html`, sets correct `Content-Type` for `.html/.css/.js/.woff2`, sends `Cache-Control: no-store` locally. Listens on `127.0.0.1:4321`.

- [ ] **Step 5: Run tests and commit**

Run: `node --test test/tokens.test.js`
Expected: PASS (2 tests)

```bash
git add assets/css assets/fonts test/tokens.test.js tools/serve.mjs
git commit -m "feat: design tokens, self-hosted fonts and type base"
```

---

### Task 2: Pure tuning math

**Files:**
- Create: `assets/js/metrics.js`
- Test: `test/metrics.test.js`

**Interfaces:**
- Produces:
  - `springStep(current: number, target: number, k: number, dt: number) -> number`
  - `freqToUnit(freq: number, min = 87.5, max = 108.0) -> number` (0–1)
  - `unitToFreq(u: number, min = 87.5, max = 108.0) -> number`
  - `nearestStation(tune: number, count: number) -> number` (integer index)
  - `wheelToDelta(a: number, b: number) -> number` (largest abs of the two)
  - `meterGeometry(lift: number | null, resultPct: number) -> { floorPct, resultPct, liftPct, hasLift }`

- [ ] **Step 1: Write the failing test**

```js
// test/metrics.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { springStep, freqToUnit, unitToFreq, nearestStation, wheelToDelta, meterGeometry } from '../assets/js/metrics.js';

test('springStep approaches the target monotonically and never overshoots past it on the first step', () => {
  let v = 0;
  const k = 5.2, dt = 1 / 60;
  for (let i = 0; i < 200; i++) v = springStep(v, 10, k, dt);
  assert.ok(Math.abs(v - 10) < 0.01, `settled to ${v}`);
});

test('springStep with k = Infinity snaps exactly', () => {
  assert.equal(springStep(2, 9, Infinity, 1 / 60), 9);
});

test('freqToUnit and unitToFreq round-trip', () => {
  assert.equal(freqToUnit(87.5), 0);
  assert.equal(freqToUnit(108.0), 1);
  assert.ok(Math.abs(unitToFreq(freqToUnit(98.6)) - 98.6) < 1e-9);
});

test('nearestStation clamps to the valid index range', () => {
  assert.equal(nearestStation(2.4, 14), 2);
  assert.equal(nearestStation(2.6, 14), 3);
  assert.equal(nearestStation(-5, 14), 0);
  assert.equal(nearestStation(99, 14), 13);
});

test('wheelToDelta takes the dominant axis', () => {
  assert.equal(wheelToDelta(3, -40), -40);
  assert.equal(wheelToDelta(-12, 8), -12);
});

test('meterGeometry never fabricates a lift when lift is null', () => {
  const g = meterGeometry(null, 70);
  assert.equal(g.hasLift, false);
  assert.equal(g.liftPct, null);
  assert.equal(g.floorPct, null);
  assert.equal(g.resultPct, 70);
});

test('meterGeometry places the floor below the result when lift is positive', () => {
  const g = meterGeometry(154, 100);
  assert.equal(g.hasLift, true);
  assert.equal(g.liftPct, 154);
  assert.ok(g.floorPct < g.resultPct);
  assert.ok(g.floorPct >= 0 && g.resultPct <= 100);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/metrics.test.js`
Expected: FAIL — cannot resolve `../assets/js/metrics.js`.

- [ ] **Step 3: Implement `assets/js/metrics.js`**

`springStep` is `current + (target - current) * (1 - Math.exp(-k * dt))`, with `k === Infinity` returning `target`. `meterGeometry`: when `hasLift`, `resultPct` maps to 100 and `floorPct = 10000 / (100 + lift)`, so a `+154%` lift puts the floor at 39.4%. When `!hasLift`, `floorPct` and `liftPct` are `null` and `resultPct` is the passed absolute percentage. No DOM, no globals.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/metrics.test.js`
Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add assets/js/metrics.js test/metrics.test.js
git commit -m "feat: pure tuning math with unit tests"
```

---

### Task 3: Station data

**Files:**
- Create: `assets/js/data.js`
- Test: `test/data.test.js`

**Interfaces:**
- Produces: `BANDS` (array of `{ id, label }`) and `STATIONS` (array of 14 objects). Consumed by `engine.js` and `instrument.js`.
- Station shape: `{ id, band, ch, freq, title, tag, desc, metrics: [{v,l}], lift: number|null, floorLabel, artifact: string }`

- [ ] **Step 1: Write the failing test**

```js
// test/data.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BANDS, STATIONS } from '../assets/js/data.js';

test('14 stations across 3 bands, frequencies ascending and inside the scale', () => {
  assert.equal(STATIONS.length, 14);
  assert.equal(BANDS.length, 3);
  const freqs = STATIONS.map(s => s.freq);
  assert.deepEqual(freqs, [...freqs].sort((a, b) => a - b));
  for (const f of freqs) assert.ok(f >= 87.5 && f <= 108.0, `freq ${f} out of scale`);
});

test('every station declares the full shape and a band that exists', () => {
  const ids = new Set(BANDS.map(b => b.id));
  for (const s of STATIONS) {
    assert.ok(ids.has(s.band), `${s.id} bad band`);
    assert.equal(s.metrics.length, 3);
    for (const m of s.metrics) assert.ok(m.v.length > 0 && m.l.length > 0);
    assert.ok('lift' in s, `${s.id} missing lift`);
    assert.ok(s.floorLabel.length > 0);
  }
});

test('a station with no lift carries no fabricated percentage', () => {
  for (const s of STATIONS) {
    if (s.lift === null) assert.ok(!s.metrics.some(m => /^\+/.test(m.v)), `${s.id} shows +% without a lift`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/data.test.js`
Expected: FAIL — cannot resolve `../assets/js/data.js`.

- [ ] **Step 3: Implement `assets/js/data.js`**

Three bands — `work`, `writing`, `record`. Fourteen stations at frequencies `88.1, 89.3, 90.7, 92.1, 93.5, 95.1` (work), `96.3, 97.7, 99.1, 100.5` (writing), `102.3, 103.9, 105.5, 107.1` (record). Titles, tags and descriptions are **placeholder** and echo the roles in `02-content-inventory.md`; every numeric metric is placeholder. `lift` is a number for six stations and `null` for the rest.

- [ ] **Step 4: Run tests and commit**

Run: `node --test test/data.test.js`
Expected: PASS (3 tests)

```bash
git add assets/js/data.js test/data.test.js
git commit -m "feat: placeholder station data for three bands"
```

---

### Task 4: Instrument markup and CSS

**Files:**
- Create: `index.html`, `assets/css/instrument.css`
- Modify: `assets/css/base.css` (paper page frame)

**Interfaces:**
- Consumes: tokens from Task 1.
- Produces DOM contract used by Tasks 5–6: `#scale` (contains `.tick` elements), `#needle`, `#bands`, `#readout` (`#r-kicker`, `#r-title`, `#r-desc`), `#metrics`, `#meter`, `#card`, `#counter`, `[data-station-index]`.

- [ ] **Step 1: Write the failing test**

```js
// test/markup.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('index.html has the instrument contract', async () => {
  const html = await readFile('index.html', 'utf8');
  for (const id of ['scale','needle','bands','readout','metrics','meter','card','counter','sheet']) {
    assert.ok(html.includes(`id="${id}"`), `missing #${id}`);
  }
  assert.ok(/<html[^>]+lang="/.test(html), 'missing lang');
  assert.ok(html.includes('class="skip"'), 'missing skip link');
  assert.ok(html.includes('aria-live'), 'station readout must be announced');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/markup.test.js`
Expected: FAIL — `ENOENT index.html`.

- [ ] **Step 3: Build the markup**

`<html lang="en" data-reduced="false">`. Head: title, description, og tags, inline SVG favicon, preload of the two most-used woff2 files. Body order: skip link → `header` (wordmark left, `About` + `CV` right, `Jakarta · open to work` in mono) → `main` → `section#stage` (the deep panel: band switch, counter, scale, needle, readout, metrics, meter, artifact card, hints) → `section#report` (proof strip, three work rows, awards ledger table, contact) → `footer` (colophon) → `div#sheet` (`role="dialog" aria-modal="true" aria-labelledby="s-title"`, hidden).

- [ ] **Step 4: Write `assets/css/instrument.css`**

Panel inset `clamp(10px,2vw,22px)`, radius `22px`, `clip-path: inset(0 round 22px)`, background `--deep`. Scale: `position: relative`, `height: 140px`, ticks are `1px` divs with three size classes, frequency labels in mono `10px` `--mute`. Needle: `2px` wide, `--glow`, `box-shadow: 0 0 24px -4px var(--glow)`, positioned with `translate3d(x,0,0)` and `will-change: transform`. Card: aspect `3/4`, `transform: perspective(900px) rotateY(-12deg)`, hairline border, placeholder typographic composition using the site's own type. All spacing in `var(--u)` multiples.

- [ ] **Step 5: Verify and commit**

Run: `node --test test/markup.test.js` → PASS
Run: `node tools/serve.mjs` then load `http://127.0.0.1:4321/` — the panel, scale, ticks, needle at rest, readout, three metrics, meter and card are all visible with no JS.

```bash
git add index.html assets/css/instrument.css assets/css/base.css test/markup.test.js
git commit -m "feat: instrument stage markup and styles"
```

---

### Task 5: The engine

**Files:**
- Create: `assets/js/engine.js`, `assets/js/instrument.js`, `assets/js/main.js`

**Interfaces:**
- Consumes: `springStep`, `nearestStation`, `wheelToDelta` from `metrics.js`; `STATIONS` from `data.js`; DOM contract from Task 4.
- Produces: `createEngine({ onTune, onStation }) -> { setTune, setBand, destroy }`. `onTune(tune: number)` fires per frame with the spring value; `onStation(index: number, dir: -1|1)` fires only when the snapped index changes.

- [ ] **Step 1: Write the failing test**

```js
// test/engine.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reduceTune } from '../assets/js/engine.js';

test('reduceTune clamps the target to the station range', () => {
  assert.equal(reduceTune(-4, 14), 0);
  assert.equal(reduceTune(40, 14), 13);
});

test('reduceTune snaps once close enough', () => {
  assert.equal(reduceTune(3.00004, 14), 3);
  assert.equal(reduceTune(3.4, 14, false), 3.4);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/engine.test.js`
Expected: FAIL — cannot resolve `../assets/js/engine.js`.

- [ ] **Step 3: Implement `engine.js`**

Export the pure `reduceTune(target, count, snap = true)`. Then `createEngine` with: a rAF loop, `state = { tune, target, dragging, band }`, wheel handler (`delta = wheelToDelta(dY, dX) * (deltaMode === 1 ? 16 : 1) * 0.0016`), pointer drag with a 6px threshold and release momentum, arrow-key and `Enter` handling, and a 160ms idle timer that snaps `target` to `reduceTune(target, count)`. Skip the loop entirely when `document.documentElement.dataset.reduced === 'true'` (set `tune = target` on change).

- [ ] **Step 4: Implement `instrument.js`**

Builds `#scale`'s tick divs from `STATIONS.length` with the frequency label under each major tick. On `onTune`, sets `needle.style.transform` via `translate3d`. On `onStation`, swaps the readout through masks (kicker/title/desc, `translateY(dir*110%) → 0`, `650ms`, stagger `0/60/120`), fires the 120ms static burst class, updates the counter, the meter (`meterGeometry`), and each metric. `aria-live` region gets the new title.

- [ ] **Step 5: Implement `main.js`**

Set `data-reduced` from `matchMedia('(prefers-reduced-motion: reduce)')`, wire engine → instrument, and call `report.js`. No framework, no globals beyond one `boot()`.

- [ ] **Step 6: Verify and commit**

Run: `node --test test/engine.test.js` → PASS
Manual: wheel and drag move the needle with visible overshoot and settle; the readout swaps through masks; the static burst fires; the counter and meter update.

```bash
git add assets/js test/engine.test.js
git commit -m "feat: spring engine and instrument wiring"
```

---

### Task 6: The sheet

**Files:**
- Create: `assets/js/sheet.js`

**Interfaces:**
- Consumes: `#card`, `#sheet`.
- Produces: `openSheet(station, triggerEl)` / `closeSheet()`; `sheetOpen() -> boolean`.

- [ ] **Step 1: Write the failing test**

```js
// test/sheet.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { insetFromRects } from '../assets/js/sheet.js';

test('insetFromRects converts a card rect to a clip-path inset', () => {
  const vp = { width: 1000, height: 800 };
  const card = { top: 100, left: 200, right: 400, bottom: 500 };
  assert.deepEqual(insetFromRects(card, vp), { top: 100, right: 600, bottom: 300, left: 200 });
});

test('insetFromRects clamps negative overflow to zero', () => {
  const vp = { width: 1000, height: 800 };
  const card = { top: -20, left: -10, right: 1200, bottom: 900 };
  const r = insetFromRects(card, vp);
  for (const v of Object.values(r)) assert.ok(v >= 0, `negative inset ${v}`);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/sheet.test.js`
Expected: FAIL — cannot resolve `../assets/js/sheet.js`.

- [ ] **Step 3: Implement `sheet.js`**

`insetFromRects` computes `{top: r.top, right: vp.width - r.right, bottom: vp.height - r.bottom, left: r.left}` with each clamped at `0` via `Math.max(0, …)`. `openSheet` reads `#card.getBoundingClientRect()`, fills `#sheet`'s content from the station, removes `hidden`, then `element.animate([...], { duration: 1050, easing: 'cubic-bezier(.76,0,.18,1)', fill: 'both' })` from `inset(...) rotate(-2.5deg)` to `inset(0) rotate(0deg)`. Content lines animate from `translateY(110%)` at `620ms + i*75ms`, `900ms` each. Focus moves to the close button; `Tab` is trapped; `Escape` closes. `closeSheet` reverses to the **current** card rect over `850ms`, then sets `hidden` and returns focus to the triggering element. Under `data-reduced`, durations are `0`.

- [ ] **Step 4: Verify and commit**

Run: `node --test test/sheet.test.js` → PASS
Manual: click the card → the sheet grows out of the card's exact rectangle and straightens; content rises line by line; `Escape` reverses it; focus returns to the card.

```bash
git add assets/js/sheet.js test/sheet.test.js
git commit -m "feat: clip-path sheet transition"
```

---

### Task 7: The report section

**Files:**
- Create: `assets/css/report.css`, `assets/js/report.js`

**Interfaces:**
- Consumes: `#report` markup from Task 4.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Write the failing test**

```js
// test/report.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('report.css contains no content opacity fades', async () => {
  const css = await readFile('assets/css/report.css', 'utf8');
  const banned = /\.(reveal|line|row|card)[^{]*\{[^}]*opacity:\s*0[;}]/;
  assert.ok(!banned.test(css), 'content reveal uses opacity; use a mask');
});

test('index.html exposes every mask target the report needs', async () => {
  const html = await readFile('index.html', 'utf8');
  for (const sel of ['data-mask', 'data-count', 'id="ledger"', 'id="contact"']) {
    assert.ok(html.includes(sel), `missing ${sel}`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/report.test.js`
Expected: FAIL — `ENOENT assets/css/report.css`.

- [ ] **Step 3: Implement `report.css` and `report.js`**

Proof strip: four mono figures at `--fs-metric` with hairline separators. Work rows: full-width, `01`/`02`/`03` in mono mute, serif title, dominant metric right-aligned, hairline above, whole row a link. Ledger: a real `<table>` with mono year, placing in `--cobalt`, name in Inter Tight 500, discipline in `--mute`; no badges, no laurels. Contact: `mailto:`, LinkedIn, CV. Footer colophon.

`report.js` uses one `IntersectionObserver` with `threshold: 0.25`, firing **once** per element: adds `.in`, which slides the inner `[data-mask] > span` from `translateY(110%)` to `0` (`900ms`, `--ease-mask`, stagger `60ms` via `--i`). `[data-count]` elements count up over `900ms` with `springStep`-free linear easing, then hold the final string. Under `data-reduced`, `.in` is added to everything immediately on load and no count runs.

- [ ] **Step 4: Verify and commit**

Run: `node --test test/report.test.js` → PASS
Manual: scroll — every line rises out of its mask once, counters run once, nothing fades.

```bash
git add assets/css/report.css assets/js/report.js test/report.test.js
git commit -m "feat: editorial report section with mask reveals"
```

---

### Task 8: Mobile, reduced motion, accessibility

**Files:**
- Modify: `assets/css/instrument.css`, `assets/js/instrument.js`, `assets/js/main.js`
- Create: `test/a11y.test.js`

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Write the failing test**

```js
// test/a11y.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('interactive controls are real buttons or links with names', async () => {
  const html = await readFile('index.html', 'utf8');
  assert.ok(!/<div[^>]+onclick=/.test(html), 'click handler on a div');
  assert.ok(html.includes('aria-live="polite"'));
  assert.ok(html.includes('role="dialog"'));
  assert.ok(/aria-label="[^"]+"/.test(html));
});

test('no font-size below 11px in any stylesheet', async () => {
  for (const f of ['tokens','base','instrument','report'].map(n => `assets/css/${n}.css`)) {
    const css = await readFile(f, 'utf8');
    for (const m of css.matchAll(/font-size:\s*([\d.]+)px/g)) assert.ok(Number(m[1]) >= 11, `${f}: ${m[0]}`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/a11y.test.js`
Expected: FAIL on the first missing assertion.

- [ ] **Step 3: Add the vertical-mobile scale and fix findings**

Under `820px`: `--u: 100vw/390`; the scale rotates to a vertical card on the left edge with ticks reading upward and frequencies rotated `writing-mode: vertical-rl`; the needle becomes horizontal; the readout stacks below; the band switch moves to the bottom. Reduced motion: `data-reduced="true"` sets `tune = target` instantly, hides `.static`, makes sheet durations `0`, and reveals all report content. Fix every finding from Step 2.

- [ ] **Step 4: Verify and commit**

Run: `node --test` → all suites PASS.
Manual at 390px: nothing overflows horizontally, both buttons ≥44px, the sheet is usable, the vertical scale is legible.

```bash
git add assets/css assets/js index.html test/a11y.test.js
git commit -m "feat: mobile layout, reduced motion and accessibility pass"
```

---

### Task 9: Verification and review

**Files:** none created; fixes only.

- [ ] **Step 1: Run the whole suite**

Run: `node --test`
Expected: every suite PASS, 0 failures.

- [ ] **Step 2: Check the page over http at four widths**

Run: `node tools/serve.mjs` and load `http://127.0.0.1:4321/` at 1440, 1024, 768 and 390. Confirm: no horizontal scrollbar at any width; the panel is fully visible without scrolling at 1440×900; the needle rests on station 1.

- [ ] **Step 3: Dispatch critique subagents**

Two fresh-context reviewers, in parallel, each given the file list and the constraint list but not my reasoning:
- **Craft critic** — reads `08-craft-rules.md` and the built CSS/JS, reports every violation of the eleven-item checklist in `08` §11 plus any AI-slop tell from `05` §6.
- **Animation/engine specialist** — reads the engine, instrument and sheet JS, reports physics errors (single loop, `dt` clamp, substeps, snap logic), interruption bugs, and anything that breaks under reduced motion or rapid input.

- [ ] **Step 4: Fix what they find, then re-run**

Fix, re-run `node --test`, reload the page, confirm nothing regressed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix: address craft and engine review findings"
```

---

## Self-review notes

- **Spec coverage:** `09` §4 anatomy → Task 4; §5 physics → Tasks 2, 5; §6 station change → Task 5; §7 sheet → Task 6; §9 mobile → Task 8; §8 placeholders → Task 3. `09` §11 checklist → Task 9 Step 3.
- **Deliberate gaps:** WebGL (not needed — the instrument is CSS/DOM, per `09` §11), the custom cursor (Q6: no), case-study pages (Q5a: homepage only), grain overlay (CSS-only `feTurbulence` data URI, added in Task 4).
- **Type consistency:** `meterGeometry` returns `floorPct | null` and every consumer must null-check, pinned by the `lift: null` test in Task 2 and the data test in Task 3.
