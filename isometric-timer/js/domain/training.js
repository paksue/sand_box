import { EXERCISES, getExercise } from './exercise-catalog.js';
import { recommendNextTarget } from './progression.js';

const HISTORY_LIMIT = 80;

function defaultTargets() {
  return Object.fromEntries(EXERCISES.map((exercise) => [exercise.id, exercise.defaultTargetSeconds]));
}

export function createTrainingState() {
  return {
    version: 2,
    selectedExerciseId: 'quick-hold',
    targets: defaultTargets(),
    personalBests: {},
    history: [],
    lastFeedback: {},
    recommendations: {}
  };
}

export function normalizeTrainingState(raw) {
  const base = createTrainingState();
  if (!raw || typeof raw !== 'object') return base;
  const selected = getExercise(raw.selectedExerciseId).id;
  const targets = { ...base.targets };
  for (const exercise of EXERCISES) {
    const value = Number(raw.targets?.[exercise.id]);
    if (Number.isFinite(value)) targets[exercise.id] = Math.min(exercise.maxSeconds, Math.max(exercise.minSeconds, Math.round(value)));
  }
  return {
    ...base,
    ...raw,
    version: 2,
    selectedExerciseId: selected,
    targets,
    personalBests: raw.personalBests && typeof raw.personalBests === 'object' ? raw.personalBests : {},
    history: Array.isArray(raw.history) ? raw.history.slice(0, HISTORY_LIMIT) : [],
    lastFeedback: raw.lastFeedback && typeof raw.lastFeedback === 'object' ? raw.lastFeedback : {},
    recommendations: raw.recommendations && typeof raw.recommendations === 'object' ? raw.recommendations : {}
  };
}

export function selectExercise(state, exerciseId) {
  return { ...state, selectedExerciseId: getExercise(exerciseId).id };
}

export function setExerciseTarget(state, exerciseId, seconds) {
  const exercise = getExercise(exerciseId);
  const safe = Math.min(exercise.maxSeconds, Math.max(exercise.minSeconds, Math.round(Number(seconds) || exercise.defaultTargetSeconds)));
  return { ...state, targets: { ...state.targets, [exercise.id]: safe } };
}

export function recordCompletedSession(state, session) {
  if (!session?.sessionId || state.history.some((item) => item.sessionId === session.sessionId)) return state;
  const completedSeconds = Math.max(0, Number(session.completedDurationSeconds) || 0);
  const priorBest = Number(state.personalBests[session.exerciseId]) || 0;
  return {
    ...state,
    personalBests: {
      ...state.personalBests,
      [session.exerciseId]: Math.max(priorBest, completedSeconds)
    },
    history: [session, ...state.history].slice(0, HISTORY_LIMIT)
  };
}

export function applyDifficultyFeedback(state, exerciseId, feedback) {
  const current = Number(state.targets[exerciseId]) || getExercise(exerciseId).defaultTargetSeconds;
  const next = recommendNextTarget(exerciseId, current, feedback);
  return {
    ...state,
    targets: { ...state.targets, [exerciseId]: next },
    lastFeedback: { ...state.lastFeedback, [exerciseId]: feedback },
    recommendations: { ...state.recommendations, [exerciseId]: next },
    history: state.history.map((item, index) => {
      if (index !== 0 || item.exerciseId !== exerciseId || item.difficultyFeedback) return item;
      return { ...item, difficultyFeedback: feedback, recommendedNextTarget: next };
    })
  };
}

export function recentSessionsFor(state, exerciseId, limit = 3) {
  return state.history.filter((session) => session.exerciseId === exerciseId).slice(0, limit);
}
