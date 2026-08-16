import { equal, assert } from './assert.js';
import { isIntentAllowed, contextualGestureIntent } from '../js/domain/commands.js';
import { HandsFreeManager } from '../js/hands-free/manager.js';

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
}
