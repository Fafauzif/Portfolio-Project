import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sampleFold } from '../assets/js/portfolio-motion.js';

test('the poster has two moving creases on desktop and one on mobile', () => {
  const desktop = sampleFold(0, false);
  const mobile = sampleFold(0, true);

  assert.ok(desktop.middle < 0 && desktop.end > 0);
  assert.ok(mobile.middle < 0);
  assert.equal(mobile.end, 0);
});

test('both posters end flat and at their landing scale', () => {
  for (const single of [false, true]) {
    const end = sampleFold(1, single);
    for (const key of ['x', 'y', 'pitch', 'yaw', 'roll', 'middle', 'end', 'handoff']) {
      assert.ok(Math.abs(end[key]) < 0.00001, key);
    }
    assert.equal(end.scale, 1);
  }
});

test('reversing direction returns the same pose at the same scroll progress', () => {
  const pose = sampleFold(.42, false);
  sampleFold(.89, false);
  assert.deepEqual(sampleFold(.42, false), pose);
  assert.ok(Object.values(pose).every(Number.isFinite));
});
