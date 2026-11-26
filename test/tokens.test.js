import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

/** Parse `--name: value;` declarations out of a stylesheet. */
function parseTokens(css) {
  const out = new Map();
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    out.set(m[1], m[2].trim());
  }
  return out;
}

/** Follow `var(--x)` aliases to a literal. */
function resolve(tokens, name, seen = new Set()) {
  assert.ok(!seen.has(name), `circular alias at ${name}`);
  seen.add(name);
  const raw = tokens.get(name);
  assert.ok(raw, `missing ${name}`);
  const alias = raw.match(/^var\((--[a-z0-9-]+)\)$/i);
  return alias ? resolve(tokens, alias[1], seen) : raw;
}

function channel(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const m = hex.trim().match(/^#([0-9a-f]{6})$/i);
  assert.ok(m, `not a 6-digit hex: ${hex}`);
  const n = parseInt(m[1], 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

const css = await readFile('assets/css/tokens.css', 'utf8');
const tokens = parseTokens(css);
const pair = (fg, bg) => contrast(resolve(tokens, fg), resolve(tokens, bg));

test('the four picked swatches are shipped verbatim, never adjusted', () => {
  for (const [name, hex] of [
    ['--navy', '#091540'],
    ['--cobalt', '#1B2CC1'],
    ['--peri', '#7692FF'],
    ['--sky', '#ABD2FA'],
  ]) {
    assert.equal(resolve(tokens, name).toLowerCase(), hex.toLowerCase(), `${name} drifted`);
  }
});

test('every ink clears WCAG AA on the surface it is painted on', () => {
  // 4.5 = AA body text, 7 = AAA. The palette is one ramp, so every step has to
  // hold up as type somewhere — that is what makes four blues a system.
  const required = [
    ['--on-deep', '--deep', 7],        // station title, metric values
    ['--dim-deep', '--deep', 4.5],     // description, inactive band
    ['--mute-deep', '--deep', 4.5],    // micro-labels, hints, frequencies
    ['--ink', '--paper', 7],           // report body
    ['--ink-soft', '--paper', 7],      // report secondary
    ['--mute', '--paper', 4.5],        // report captions, table heads
    ['--accent', '--paper', 4.5],      // rules, links, figures
    ['--on-accent', '--accent', 4.5],  // text on a cobalt fill
    ['--mute', '--paper-sunk', 4.5],   // captions over a hovered row
  ];
  for (const [fg, bg, min] of required) {
    const got = pair(fg, bg);
    assert.ok(got >= min, `${fg} on ${bg} is ${got.toFixed(2)}:1, needs ${min}`);
  }
});

test('cobalt is never used as type on navy — it measures 1.83 and cannot carry it', () => {
  // The comment in tokens.css says cobalt is a FILL on the dark side. Pin it, so
  // nobody "fixes" a link colour to cobalt on the panel and ships an invisible word.
  assert.ok(pair('--cobalt', '--deep') < 3, 'cobalt on navy unexpectedly passes — re-check the rule');
  assert.ok(pair('--on-accent', '--accent') >= 4.5, 'cobalt fill lost its readable text');
});

test('tokens.css declares every required custom property', () => {
  for (const name of [
    '--navy', '--cobalt', '--peri', '--sky',
    '--deep', '--deep-2', '--deep-3', '--on-deep', '--dim-deep', '--mute-deep',
    '--glow', '--rule-deep', '--stage-line',
    '--paper', '--paper-sunk', '--ink', '--ink-soft', '--mute', '--accent', '--rule',
    '--u', '--ease-out', '--ease-mask', '--font-serif', '--font-sans', '--font-mono',
  ]) {
    assert.ok(tokens.has(name), `missing ${name}`);
  }
});

test('no literal font-size below 11px in tokens or base', async () => {
  for (const f of ['assets/css/tokens.css', 'assets/css/base.css']) {
    const sheet = await readFile(f, 'utf8');
    for (const m of sheet.matchAll(/font-size:\s*([\d.]+)px/g)) {
      assert.ok(Number(m[1]) >= 11, `${f}: ${m[0]}`);
    }
  }
});
