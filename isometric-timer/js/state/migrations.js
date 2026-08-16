import { createTimerState, normalizeTimerState } from '../domain/timer-machine.js';
import { createTrainingState } from '../domain/training.js';
import { SETTINGS_DEFAULTS, normalizeSettings } from './schema.js';

export function migrateV1(v1Raw) {
  if (!v1Raw || typeof v1Raw !== 'object') {
    return {
      core: createTimerState(30000),
      settings: normalizeSettings(SETTINGS_DEFAULTS),
      training: createTrainingState()
    };
  }

  const durationMs = Math.min(300000, Math.max(5000, Number(v1Raw.durationMs) || 30000));
  const core = normalizeTimerState({
    ...v1Raw,
    version: 2,
    durationMs,
    sessionId: null,
    initiatingSource: 'touch'
  }, durationMs);

  const settings = normalizeSettings({
    version: 2,
    soundEnabled: v1Raw.soundEnabled !== false,
    quickHoldSeconds: Math.round(durationMs / 1000),
    selectedExerciseId: 'quick-hold',
    handsFree: { voiceEnabled: false, gestureEnabled: false }
  });

  return { core, settings, training: createTrainingState() };
}
