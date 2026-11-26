import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BANDS, STATIONS } from '../assets/js/data.js';

test('14 stations across 3 bands, frequencies ascending inside the scale', () => {
  assert.equal(STATIONS.length, 14);
  assert.equal(BANDS.length, 3);
  const freqs = STATIONS.map(s => s.freq);
  assert.deepEqual(freqs, [...freqs].sort((a, b) => a - b));
  for (const f of freqs) assert.ok(f >= 87.5 && f <= 108.0, `freq ${f} off-scale`);
});

test('every station declares the full shape and a real band', () => {
  const ids = new Set(BANDS.map(b => b.id));
  for (const s of STATIONS) {
    assert.ok(ids.has(s.band), `${s.id} bad band`);
    assert.equal(s.metrics.length, 3);
    for (const m of s.metrics) assert.ok(m.v.length > 0 && m.l.length > 0);
    assert.ok('lift' in s, `${s.id} missing lift`);
    assert.ok(s.floorLabel.length > 0);
    assert.ok(s.note === null || s.note.length > 0);
  }
});

test('a station with no baseline shows no fabricated percentage', () => {
  for (const s of STATIONS) {
    if (s.lift === null) {
      assert.ok(!s.metrics.some(m => /^\+/.test(m.v)), `${s.id} shows +% without a lift`);
      assert.ok(s.note, `${s.id} needs a note explaining the missing baseline`);
    }
  }
});
