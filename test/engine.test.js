import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reduceTune } from '../assets/js/engine.js';

test('reduceTune clamps the target to the station range', () => {
  assert.equal(reduceTune(-4, 14), 0);
  assert.equal(reduceTune(40, 14), 13);
});

test('reduceTune snaps only within epsilon, and only when asked', () => {
  assert.equal(reduceTune(3.00004, 14), 3);
  assert.equal(reduceTune(3.4, 14, false), 3.4);
  assert.equal(reduceTune(3.4, 14), 3.4);
});
