import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('controls are real buttons or links with names', async () => {
  const html = await readFile('index.html', 'utf8');
  assert.ok(!/<div[^>]+onclick=/.test(html), 'click handler on a div');
  assert.ok(html.includes('aria-live="polite"'));
  assert.ok(html.includes('role="dialog"'));
  assert.ok(/aria-label="[^"]+"/.test(html));
  assert.ok(html.includes('aria-modal="true"'));
});

test('no literal font-size below 11px in any stylesheet', async () => {
  for (const n of ['tokens','base','instrument','report','sheet']) {
    const f = `assets/css/${n}.css`;
    const css = await readFile(f, 'utf8');
    for (const m of css.matchAll(/font-size:\s*([\d.]+)px/g)) {
      assert.ok(Number(m[1]) >= 11, `${f}: ${m[0]}`);
    }
  }
});
