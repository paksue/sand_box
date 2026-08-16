import { INTENTS } from './commands.js';

export const PREP_MS = 3000;
export const TIMER_MODES = Object.freeze(['READY', 'PREPARE', 'HOLD', 'PAUSED', 'DONE']);
const TIMER_MODE_SET = new Set(TIMER_MODES);

function clampMs(value, min = 0, max = 300000) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.min(max, Math.max(min, numeric));
}

export function createTimerState(durationMs = 30000) {
  return {
    version: 2,
    mode: 'READY',
    durationMs: clampMs(durationMs, 5000),
    phaseEndAt: null,
    pendingHoldMs: 0,
    pausedHoldMs: 0,
    resumePreparation: false,
    sessionId: null,
    holdStartedAt: null,
    initiatingSource: 'touch',
    exerciseId: 'quick-hold',
    completionReason: null,
    completedAt: null
  };
}

export function normalizeTimerState(raw, fallbackDurationMs = 30000) {
  const base = createTimerState(fallbackDurationMs);
  if (!raw || typeof raw !== 'object') return base;
  const mode = TIMER_MODE_SET.has(raw.mode) ? raw.mode : 'READY';
  return {
    ...base,
    mode,
    durationMs: clampMs(raw.durationMs ?? fallbackDurationMs, 5000),
    phaseEndAt: Number.isFinite(Number(raw.phaseEndAt)) ? Number(raw.phaseEndAt) : null,
    pendingHoldMs: clampMs(raw.pendingHoldMs),
    pausedHoldMs: clampMs(raw.pausedHoldMs),
    resumePreparation: Boolean(raw.resumePreparation),
    sessionId: typeof raw.sessionId === 'string' ? raw.sessionId : null,
    holdStartedAt: Number.isFinite(Number(raw.holdStartedAt)) ? Number(raw.holdStartedAt) : null,
    initiatingSource: typeof raw.initiatingSource === 'string' ? raw.initiatingSource : 'touch',
    exerciseId: typeof raw.exerciseId === 'string' ? raw.exerciseId : 'quick-hold',
    completionReason: typeof raw.completionReason === 'string' ? raw.completionReason : null,
    completedAt: Number.isFinite(Number(raw.completedAt)) ? Number(raw.completedAt) : null
  };
}

function newSessionId(now) {
  const random = globalThis.crypto?.randomUUID?.();
  return random || `hold-${now}-${Math.random().toString(36).slice(2, 9)}`;
}

function toReady(state) {
  return {
    ...state,
    mode: 'READY',
    phaseEndAt: null,
    pendingHoldMs: 0,
    pausedHoldMs: 0,
    resumePreparation: false,
    sessionId: null,
    holdStartedAt: null,
    completionReason: null,
    completedAt: null
  };
}

function toDone(state, now, reason = 'timer-complete') {
  return {
    ...state,
    mode: 'DONE',
    phaseEndAt: null,
    pendingHoldMs: 0,
    pausedHoldMs: 0,
    resumePreparation: false,
    completionReason: reason,
    completedAt: now
  };
}

export function reconcileTimer(inputState, now) {
  let state = normalizeTimerState(inputState, inputState?.durationMs ?? 30000);
  const effects = [];
  if (!Number.isFinite(now)) return { state, effects, changed: false };

  if (state.mode === 'PREPARE' && Number.isFinite(state.phaseEndAt)) {
    if (now >= state.phaseEndAt) {
      const holdEndAt = state.phaseEndAt + state.pendingHoldMs;
      if (now >= holdEndAt) {
        state = toDone(state, now);
        effects.push({ type: 'SESSION_COMPLETE', recovered: true });
      } else {
        state = {
          ...state,
          mode: 'HOLD',
          phaseEndAt: holdEndAt,
          pendingHoldMs: 0,
          resumePreparation: false,
          holdStartedAt: state.holdStartedAt ?? (holdEndAt - state.durationMs)
        };
        effects.push({ type: 'PHASE_STARTED', phase: 'HOLD', recovered: true });
      }
      return { state, effects, changed: true };
    }
  }

  if (state.mode === 'HOLD' && Number.isFinite(state.phaseEndAt) && now >= state.phaseEndAt) {
    state = toDone(state, now);
    effects.push({ type: 'SESSION_COMPLETE', recovered: true });
    return { state, effects, changed: true };
  }

  return { state, effects, changed: false };
}

export function transitionTimer(inputState, envelope, now) {
  const current = normalizeTimerState(inputState, inputState?.durationMs ?? 30000);
  const effects = [];
  const intent = envelope?.intent;
  const source = envelope?.source || 'touch';

  if (!Number.isFinite(now) || typeof intent !== 'string') {
    return { state: current, effects, accepted: false };
  }

  if (intent === INTENTS.RESET) {
    return {
      state: toReady(current),
      effects: [{ type: 'RESET' }],
      accepted: current.mode !== 'READY'
    };
  }

  if (current.mode === 'READY' && intent === INTENTS.START) {
    const state = {
      ...current,
      mode: 'PREPARE',
      phaseEndAt: now + PREP_MS,
      pendingHoldMs: current.durationMs,
      pausedHoldMs: 0,
      resumePreparation: false,
      sessionId: newSessionId(now),
      holdStartedAt: now + PREP_MS,
      initiatingSource: source,
      exerciseId: typeof envelope?.exerciseId === 'string' ? envelope.exerciseId : current.exerciseId,
      completionReason: null,
      completedAt: null
    };
    effects.push({ type: 'PHASE_STARTED', phase: 'PREPARE', fresh: true });
    return { state, effects, accepted: true };
  }

  if (current.mode === 'PREPARE' && intent === INTENTS.CANCEL_PREPARE) {
    return { state: toReady(current), effects: [{ type: 'RESET' }], accepted: true };
  }

  if (current.mode === 'HOLD' && intent === INTENTS.PAUSE) {
    const remaining = clampMs((current.phaseEndAt ?? now) - now);
    if (remaining <= 0) {
      const state = toDone(current, now);
      effects.push({ type: 'SESSION_COMPLETE', recovered: false });
      return { state, effects, accepted: true };
    }
    const state = {
      ...current,
      mode: 'PAUSED',
      phaseEndAt: null,
      pendingHoldMs: 0,
      pausedHoldMs: remaining,
      resumePreparation: false
    };
    effects.push({ type: 'PAUSED' });
    return { state, effects, accepted: true };
  }

  if (current.mode === 'PAUSED' && intent === INTENTS.RESUME) {
    if (current.pausedHoldMs <= 0) return { state: current, effects, accepted: false };
    const state = {
      ...current,
      mode: 'PREPARE',
      phaseEndAt: now + PREP_MS,
      pendingHoldMs: current.pausedHoldMs,
      pausedHoldMs: 0,
      resumePreparation: true
    };
    effects.push({ type: 'PHASE_STARTED', phase: 'PREPARE', fresh: true });
    return { state, effects, accepted: true };
  }

  if (current.mode === 'DONE' && intent === INTENTS.REPEAT) {
    const state = {
      ...current,
      mode: 'PREPARE',
      phaseEndAt: now + PREP_MS,
      pendingHoldMs: current.durationMs,
      pausedHoldMs: 0,
      resumePreparation: false,
      sessionId: newSessionId(now),
      holdStartedAt: now + PREP_MS,
      initiatingSource: source,
      exerciseId: typeof envelope?.exerciseId === 'string' ? envelope.exerciseId : current.exerciseId,
      completionReason: null,
      completedAt: null
    };
    effects.push({ type: 'PHASE_STARTED', phase: 'PREPARE', fresh: true });
    return { state, effects, accepted: true };
  }

  return { state: current, effects, accepted: false };
}

export function setTimerDuration(inputState, durationMs) {
  const state = normalizeTimerState(inputState, durationMs);
  if (!['READY', 'DONE'].includes(state.mode)) return state;
  return { ...state, durationMs: clampMs(durationMs, 5000) };
}

export function timerRemainingMs(state, now) {
  if (state.mode === 'PREPARE' || state.mode === 'HOLD') {
    return Math.max(0, (state.phaseEndAt ?? now) - now);
  }
  if (state.mode === 'PAUSED') return Math.max(0, state.pausedHoldMs);
  return 0;
}
