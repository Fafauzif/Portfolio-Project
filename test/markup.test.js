import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('index.html has the instrument DOM contract', async () => {
  const html = await readFile('index.html', 'utf8');
  for (const id of ['scale','needle','bands','readout','metrics','meter','card','counter','sheet','live']) {
    assert.ok(html.includes(`id="${id}"`), `missing #${id}`);
  }
  assert.ok(/<html[^>]+lang="/.test(html), 'missing lang');
  assert.ok(html.includes('class="skip"'), 'missing skip link');
});

test('index.html exposes every report target', async () => {
  const html = await readFile('index.html', 'utf8');
  for (const sel of ['data-mask', 'data-count', 'id="ledger"', 'id="contact"', 'data-in']) {
    assert.ok(html.includes(sel), `missing ${sel}`);
  }
});
