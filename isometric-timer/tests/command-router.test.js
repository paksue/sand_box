import { equal, assert } from './assert.js';
import { isIntentAllowed, contextualGestureIntent } from '../js/domain/commands.js';
import { HandsFreeManager } from '../js/hands-free/manager.js';
import { IntentGate } from '../js/hands-free/intent-gate.js';

export async function runCommandRouterTests() {
  assert(isIntentAllowed('READY', 'START'));
  assert(!isIntentAllowed('READY', 'PAUSE'));
  equal(contextualGestureIntent('READY', 'Thumb_Up'), 'START');
  equal(contextualGestureIntent('PAUSED', 'Thumb_Up'), 'RESUME');
  equal(contextualGestureIntent('DONE', 'Thumb_Up'), 'REPEAT');
  equal(contextualGestureIntent('HOLD', 'Open_Palm'), 'PAUSE');

  const accepted = [];
  const manager = new HandsFreeManager({
    getMode: () => 'READY',
    onIntent: (candidate) => accepted.push(candidate.intent),
    onStateChange: () => {},
    adapterFactories: {
      voice: (options) => ({
        async start() {
          options.onStatus('ACTIVE', 'fake ready');
          options.onCandidate({ intent: 'START', source: 'voice', confidence: 0.9, timestamp: 5000, rawLabel: 'start' });
        },
        async stop() {}
      })
    }
  });
  const ok = await manager.enable('voice');
  assert(ok, 'Fake adapter should enable');
  equal(accepted[0], 'START', 'Fake adapter must route through normalized gate');
  await manager.dispose();

  // Regression: Open_Palm can flicker for a frame on a real phone camera.
  // A brief dropout must not erase the deliberate pause dwell.
  const gestureAccepted = [];
  const gate = new IntentGate({ onAccepted: (candidate) => gestureAccepted.push(candidate.intent) });
  gate.offer({ intent: 'PAUSE', source: 'gesture', confidence: 0.67, timestamp: 10000, rawLabel: 'Open_Palm' });
  gate.offer({ intent: null, source: 'gesture', confidence: 0, timestamp: 10120, rawLabel: 'None' });
  gate.offer({ intent: 'PAUSE', source: 'gesture', confidence: 0.66, timestamp: 10240, rawLabel: 'Open_Palm' });
  gate.offer({ intent: 'PAUSE', source: 'gesture', confidence: 0.68, timestamp: 10480, rawLabel: 'Open_Palm' });
  equal(gestureAccepted[0], 'PAUSE', 'Open_Palm should survive a brief recognition dropout and pause HOLD');

  // But a long dropout must force a fresh dwell so stale gestures cannot fire later.
  const staleAccepted = [];
  const staleGate = new IntentGate({ onAccepted: (candidate) => staleAccepted.push(candidate.intent) });
  staleGate.offer({ intent: 'PAUSE', source: 'gesture', confidence: 0.67, timestamp: 20000, rawLabel: 'Open_Palm' });
  staleGate.offer({ intent: null, source: 'gesture', confidence: 0, timestamp: 20400, rawLabel: 'None' });
  staleGate.offer({ intent: 'PAUSE', source: 'gesture', confidence: 0.68, timestamp: 20480, rawLabel: 'Open_Palm' });
  assert(staleAccepted.length === 0, 'Long Open_Palm dropout must restart dwell');
}
