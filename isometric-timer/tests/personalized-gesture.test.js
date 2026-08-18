import { assert, equal } from './assert.js';
import { normalizeHandLandmarks } from '../js/hands-free/landmark-features.js';
import { classifyPersonalizedGesture } from '../js/hands-free/personalized-classifier.js';
import { readStoredZip } from '../js/training/zip-store-reader.js';

function landmarks() {
  return Array.from({ length: 21 }, (_, index) => ({
    x: index === 0 ? 0 : ((index % 5) - 2) * 0.07,
    y: index === 0 ? 0 : -0.04 * index,
    z: index === 0 ? 0 : 0.006 * (index % 4)
  }));
}

function transformed(points, scale, tx, ty, tz) {
  return points.map((point) => ({
    x: point.x * scale + tx,
    y: point.y * scale + ty,
    z: point.z * scale + tz
  }));
}

function maxDelta(a, b) {
  return Math.max(...a.map((value, index) => Math.abs(value - b[index])));
}

function storedZipOne(name, content) {
  const encoder = new TextEncoder();
  const nameBytes = encoder.encode(name);
  const dataBytes = encoder.encode(content);
  const header = new Uint8Array(30 + nameBytes.length + dataBytes.length + 4);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 0x0800, true);
  view.setUint16(8, 0, true);
  view.setUint32(18, dataBytes.length, true);
  view.setUint32(22, dataBytes.length, true);
  view.setUint16(26, nameBytes.length, true);
  view.setUint16(28, 0, true);
  header.set(nameBytes, 30);
  header.set(dataBytes, 30 + nameBytes.length);
  view.setUint32(30 + nameBytes.length + dataBytes.length, 0x02014b50, true);
  return header.buffer;
}

export async function runPersonalizedGestureTests() {
  const base = landmarks();
  const feature = normalizeHandLandmarks(base, 'Right');
  const moved = normalizeHandLandmarks(transformed(base, 2.7, 3.2, -1.4, 0.8), 'Right');
  assert(feature?.length === 63, 'Hand feature must contain 63 numbers');
  assert(maxDelta(feature, moved) < 1e-9, 'Feature should be translation/scale invariant');

  const mirroredRaw = base.map((point) => ({ ...point, x: -point.x }));
  const mirrored = normalizeHandLandmarks(mirroredRaw, 'Left');
  assert(maxDelta(feature, mirrored) < 1e-9, 'Left/right canonicalization should match mirrored hands');

  const make = (value) => Array(63).fill(value);
  const references = {
    start: [make(1), make(1.02), make(0.98), make(1.01), make(0.99)],
    pause: [make(-1), make(-1.02), make(-0.98), make(-1.01), make(-0.99)],
    none: [make(0), make(0.02), make(-0.02), make(0.01), make(-0.01)]
  };
  const start = classifyPersonalizedGesture(make(0.95), references);
  const none = classifyPersonalizedGesture(make(0.03), references);
  equal(start.label, 'start', 'Nearest START cluster should classify START');
  assert(start.confidence > 0.6, 'Separated START should clear personalized gate');
  equal(none.label, 'none', 'Ordinary/negative cluster should classify NONE');

  const zip = readStoredZip(storedZipOne('hold-gesture-dataset/start/a.jpg', 'abc'));
  equal(zip.length, 1, 'Stored ZIP reader should find one file');
  equal(zip[0].name, 'hold-gesture-dataset/start/a.jpg');
  equal(new TextDecoder().decode(zip[0].bytes), 'abc');
}
