import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('primary navigation and interactive project targets use native links', async () => {
  const html = await readFile('index.html', 'utf8');

  assert.match(html, /<nav[^>]+aria-label="Main navigation"/);
  assert.doesNotMatch(html, /<div[^>]+onclick=/);
  for (const href of ['still-we-grow', 'referral-engine', 'naming-the-problem']) {
    assert.ok(html.includes(`href="work/${href}/"`), `missing project link for ${href}`);
  }
});

test('no literal font-size below 11px in the stylesheets', async () => {
  for (const name of ['tokens', 'base', 'instrument', 'report', 'sheet', 'portfolio', 'portfolio-motion', 'pages']) {
    const path = `assets/css/${name}.css`;
    const css = await readFile(path, 'utf8');
    for (const match of css.matchAll(/font-size:\s*([\d.]+)px/g)) {
      assert.ok(Number(match[1]) >= 11, `${path}: ${match[0]}`);
    }
  }
});
