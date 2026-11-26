import { test } from 'node:test';
import assert from 'node:assert/strict';
import { insetFromRects } from '../assets/js/sheet.js';

test('insetFromRects converts a card rect to a clip-path inset', () => {
  const vp = { width: 1000, height: 800 };
  const card = { top: 100, left: 200, right: 400, bottom: 500 };
  assert.deepEqual(insetFromRects(card, vp), { top: 100, right: 600, bottom: 300, left: 200 });
});

test('insetFromRects clamps overflow to zero', () => {
  const vp = { width: 1000, height: 800 };
  const card = { top: -20, left: -10, right: 1200, bottom: 900 };
  const r = insetFromRects(card, vp);
  for (const v of Object.values(r)) assert.ok(v >= 0, `negative inset ${v}`);
});
