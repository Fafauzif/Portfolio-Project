import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

test('the portfolio starts with its positioning and direct work link', async () => {
  const html = await readFile('index.html', 'utf8');

  assert.match(html, /<html lang="en">/);
  assert.match(html, /href="#main">Skip to content/);
  assert.match(html, /<h1 id="hero-title">I don’t stop<br>\s+at the <em>deck\.<\/em><\/h1>/);
  assert.match(html, /class="hero-cta" href="#selected-work"/);
  assert.match(html, /id="selected-work"/);
  assert.match(html, /id="contact"/);
});

test('the poster has one scene with three panels and a usable work destination', async () => {
  const html = await readFile('index.html', 'utf8');

  assert.equal([...html.matchAll(/\bdata-fold-scene\b/g)].length, 1);
  assert.equal([...html.matchAll(/poster-panel--(?:one|two|three)\b/g)].length, 3);
  assert.match(html, /class="poster-frame" aria-hidden="true"/);
  assert.match(html, /class="work-image work-image--lead"[^>]+data-fold-target/);
  assert.match(html, /<picture class="poster-still">/);
});

test('public pages are available as static directory indexes', async () => {
  for (const route of ['about', 'work', 'work/still-we-grow', 'work/referral-engine', 'work/naming-the-problem']) {
    await access(`${route}/index.html`);
  }
});
