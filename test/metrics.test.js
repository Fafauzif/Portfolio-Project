import { test } from 'node:test';
import assert from 'node:assert/strict';
import { springStep, freqToUnit, unitToFreq, nearestStation, wheelToDelta, meterGeometry, freqAtTune } from '../assets/js/metrics.js';

test('springStep settles on the target', () => {
  let v = 0;
  for (let i = 0; i < 200; i++) v = springStep(v, 10, 5.2, 1 / 60);
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

test('freqAtTune interpolates between uneven neighbours', () => {
  const freqs = [88.1, 89.3, 90.7];
  assert.equal(freqAtTune(0, freqs), 88.1);
  assert.equal(freqAtTune(2, freqs), 90.7);
  assert.ok(Math.abs(freqAtTune(0.5, freqs) - 88.7) < 1e-9);
  assert.equal(freqAtTune(-3, freqs), 88.1);
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

test('meterGeometry never fabricates a lift', () => {
  const g = meterGeometry(null, 70);
  assert.equal(g.hasLift, false);
  assert.equal(g.liftPct, null);
  assert.equal(g.floorPct, null);
});

test('meterGeometry puts the floor below the result for a positive lift', () => {
  const g = meterGeometry(154);
  assert.equal(g.hasLift, true);
  assert.ok(g.floorPct < g.resultPct);
  assert.ok(g.floorPct >= 0 && g.resultPct <= 100);
});
