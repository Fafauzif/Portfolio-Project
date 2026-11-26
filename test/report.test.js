import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('report.css never fades content in', async () => {
  const css = await readFile('assets/css/report.css', 'utf8');
  const banned = /\.(reveal|line|row|card|mask)[^{]*\{[^}]*opacity:\s*0[;}]/;
  assert.ok(!banned.test(css), 'content reveal uses opacity; use a mask');
});
