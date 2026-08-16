export const EXERCISES = Object.freeze([
  { id: 'quick-hold', name: 'Quick Hold', defaultTargetSeconds: 30, progressionStepSeconds: 5, minSeconds: 5, maxSeconds: 300, progressive: false },
  { id: 'plank', name: 'Plank', defaultTargetSeconds: 30, progressionStepSeconds: 5, minSeconds: 10, maxSeconds: 180, progressive: true },
  { id: 'wall-sit', name: 'Wall Sit', defaultTargetSeconds: 30, progressionStepSeconds: 5, minSeconds: 10, maxSeconds: 240, progressive: true },
  { id: 'side-plank', name: 'Side Plank', defaultTargetSeconds: 20, progressionStepSeconds: 5, minSeconds: 10, maxSeconds: 120, progressive: true },
  { id: 'glute-bridge', name: 'Glute Bridge Hold', defaultTargetSeconds: 30, progressionStepSeconds: 5, minSeconds: 10, maxSeconds: 180, progressive: true },
  { id: 'hollow-hold', name: 'Hollow Hold', defaultTargetSeconds: 20, progressionStepSeconds: 5, minSeconds: 5, maxSeconds: 120, progressive: true },
  { id: 'squat-hold', name: 'Squat Hold', defaultTargetSeconds: 30, progressionStepSeconds: 5, minSeconds: 10, maxSeconds: 180, progressive: true }
]);

export function getExercise(id) {
  return EXERCISES.find((exercise) => exercise.id === id) || EXERCISES[0];
}
