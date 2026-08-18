import { assert, equal } from './assert.js';
import { classifyDistilledGesture, inflateDistilledGestureModel } from '../js/hands-free/distilled-classifier.js';
import { IntentGate } from '../js/hands-free/intent-gate.js';

function zeroModel({ winner = 'none' } = {}) {
  const classes = ['none', 'pause', 'start'];
  const bias = new Float32Array(3);
  bias[classes.indexOf(winner)] = 4;
  return {
    version: 1,
    featureSize: 63,
    hiddenSize: 32,
    classes,
    commandThreshold: 0.8,
    training: {},
    mean: new Float32Array(63),
    scale: new Float32Array(63).fill(1),
    w0: new Int8Array(63 * 32),
    w0Scale: 0.01,
    b0: new Float32Array(32),
    w1: new Int8Array(32 * 3),
    w1Scale: 0.01,
    b1: bias
  };
}

export async function runDistilledGestureTests() {
  const none = classifyDistilledGesture(new Array(63).fill(0), zeroModel({ winner: 'none' }));
  equal(none.label, 'none', 'NONE must remain a no-command classification');
  assert(none.confidence > 0.9, 'Synthetic NONE confidence should be high');

  const start = classifyDistilledGesture(new Array(63).fill(0), zeroModel({ winner: 'start' }));
  equal(start.label, 'start', 'High-confidence START should survive the command threshold');
  assert(start.probabilities.start > start.probabilities.none, 'START probability should lead');

  const accepted = [];
  const gate = new IntentGate({ onAccepted: (candidate) => accepted.push(candidate.intent) });
  gate.offer({ intent: 'START', source: 'gesture', confidence: 0.91, timestamp: 10000, rawLabel: 'Hold_Start' });
  gate.offer({ intent: 'START', source: 'gesture', confidence: 0.92, timestamp: 10250, rawLabel: 'Hold_Start' });
  gate.offer({ intent: 'START', source: 'gesture', confidence: 0.93, timestamp: 10520, rawLabel: 'Hold_Start' });
  equal(accepted[0], 'START', 'Hold_Start must still route through the temporal intent gate');

  const noCommandAccepted = [];
  const noCommandGate = new IntentGate({ onAccepted: (candidate) => noCommandAccepted.push(candidate.intent) });
  noCommandGate.offer({ intent: null, source: 'gesture', confidence: 0.99, timestamp: 20000, rawLabel: 'Hold_None' });
  equal(noCommandAccepted.length, 0, 'Hold_None must never become a timer command');

  if (typeof window !== 'undefined') {
    const response = await fetch('../assets/models/hold-gestures-v1-q8.json', { cache: 'no-store' });
    assert(response.ok, 'Built-in Hold v1 model asset should load');
    const raw = await response.json();
    const model = inflateDistilledGestureModel(raw);
    equal(model.featureSize, 63, 'Model feature size');
    equal(model.hiddenSize, 32, 'Model hidden size');
    equal(raw.training?.rawPhotosShipped, false, 'Model metadata must confirm photos are not shipped');
    equal(raw.training?.rawPositiveLandmarksShipped, false, 'Raw positive landmark samples must not be shipped');
  }
}
