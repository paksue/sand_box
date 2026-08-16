export const INTENTS = Object.freeze({
  START: 'START',
  PAUSE: 'PAUSE',
  RESUME: 'RESUME',
  CANCEL_PREPARE: 'CANCEL_PREPARE',
  REPEAT: 'REPEAT',
  RESET: 'RESET'
});

export const SOURCES = Object.freeze({
  TOUCH: 'touch',
  KEYBOARD: 'keyboard',
  VOICE: 'voice',
  GESTURE: 'gesture',
  TEST: 'test'
});

const POLICY = Object.freeze({
  READY: new Set([INTENTS.START]),
  PREPARE: new Set([INTENTS.CANCEL_PREPARE, INTENTS.RESET]),
  HOLD: new Set([INTENTS.PAUSE, INTENTS.RESET]),
  PAUSED: new Set([INTENTS.RESUME, INTENTS.RESET]),
  DONE: new Set([INTENTS.REPEAT, INTENTS.RESET])
});

export function createIntent(intent, source, extra = {}) {
  return {
    intent,
    source,
    timestamp: Date.now(),
    ...extra
  };
}

export function isIntentAllowed(mode, intent) {
  return Boolean(POLICY[mode]?.has(intent));
}

export function contextualPositiveIntent(mode) {
  if (mode === 'READY') return INTENTS.START;
  if (mode === 'PAUSED') return INTENTS.RESUME;
  if (mode === 'DONE') return INTENTS.REPEAT;
  return null;
}

export function contextualGestureIntent(mode, label) {
  if (label === 'Thumb_Up') return contextualPositiveIntent(mode);
  if (label === 'Open_Palm' && mode === 'HOLD') return INTENTS.PAUSE;
  return null;
}
