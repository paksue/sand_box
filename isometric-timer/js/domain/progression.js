import { getExercise } from './exercise-catalog.js';

export const FEEDBACK = Object.freeze({
  HARD: 'hard',
  GOOD: 'good',
  EASY: 'easy'
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function recommendNextTarget(exerciseId, currentSeconds, feedback) {
  const exercise = getExercise(exerciseId);
  const current = Number.isFinite(Number(currentSeconds)) ? Number(currentSeconds) : exercise.defaultTargetSeconds;
  if (!exercise.progressive) return clamp(current, exercise.minSeconds, exercise.maxSeconds);
  const step = exercise.progressionStepSeconds;
  let next = current;
  if (feedback === FEEDBACK.HARD) next -= step;
  if (feedback === FEEDBACK.EASY) next += step;
  return clamp(Math.round(next), exercise.minSeconds, exercise.maxSeconds);
}
