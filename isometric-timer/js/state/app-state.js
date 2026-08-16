import { normalizeTimerState } from '../domain/timer-machine.js';
import { normalizeTrainingState } from '../domain/training.js';
import { normalizeSettings } from './schema.js';

export function createHandsFreeState() {
  return {
    voice: { status: 'OFF', message: '' },
    gesture: { status: 'OFF', message: '' },
    lastAccepted: null,
    lastIgnored: null
  };
}

export function createAppState({ core, settings, training }) {
  const normalizedSettings = normalizeSettings(settings);
  const normalizedTraining = normalizeTrainingState(training);
  return {
    timer: normalizeTimerState(core, normalizedSettings.quickHoldSeconds * 1000),
    settings: normalizedSettings,
    training: normalizedTraining,
    handsFree: createHandsFreeState(),
    wakeStatus: 'idle',
    notice: null
  };
}
