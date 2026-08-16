export const STORAGE_KEYS = Object.freeze({
  V1: 'isometric-hold-timer-v1',
  CORE: 'hold.core.v2',
  SETTINGS: 'hold.settings.v2',
  TRAINING: 'hold.training.v2'
});

export const SETTINGS_DEFAULTS = Object.freeze({
  version: 2,
  soundEnabled: true,
  quickHoldSeconds: 30,
  selectedExerciseId: 'quick-hold',
  handsFree: {
    voiceEnabled: false,
    gestureEnabled: false
  }
});

export function normalizeSettings(raw) {
  const base = typeof globalThis.structuredClone === 'function' ? globalThis.structuredClone(SETTINGS_DEFAULTS) : JSON.parse(JSON.stringify(SETTINGS_DEFAULTS));
  if (!raw || typeof raw !== 'object') return base;
  return {
    version: 2,
    soundEnabled: raw.soundEnabled !== false,
    quickHoldSeconds: Math.min(300, Math.max(5, Math.round(Number(raw.quickHoldSeconds) || 30))),
    selectedExerciseId: typeof raw.selectedExerciseId === 'string' ? raw.selectedExerciseId : 'quick-hold',
    handsFree: {
      voiceEnabled: Boolean(raw.handsFree?.voiceEnabled),
      gestureEnabled: Boolean(raw.handsFree?.gestureEnabled)
    }
  };
}
