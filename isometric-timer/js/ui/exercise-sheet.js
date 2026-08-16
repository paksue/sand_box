import { EXERCISES } from '../domain/exercise-catalog.js';
import { recentSessionsFor } from '../domain/training.js';

function formatDate(timestamp) {
  if (!Number.isFinite(Number(timestamp))) return '';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(timestamp));
}

export function renderExerciseSheet(elements, state) {
  elements.exerciseList.innerHTML = EXERCISES.map((exercise) => {
    const selected = exercise.id === state.training.selectedExerciseId;
    const target = state.training.targets[exercise.id] || exercise.defaultTargetSeconds;
    const best = Math.round(Number(state.training.personalBests[exercise.id]) || 0);
    const recent = recentSessionsFor(state.training, exercise.id, 1)[0];
    const detail = best > 0
      ? `Target ${target}s · Best ${best}s${recent ? ` · ${formatDate(recent.completedAt)}` : ''}`
      : `Target ${target}s`;
    return `<button class="exercise-row" type="button" data-exercise-id="${exercise.id}" aria-pressed="${selected}">
      <span><strong>${exercise.name}</strong><small>${detail}</small></span>
      <span class="exercise-check" aria-hidden="true">${selected ? '✓' : ''}</span>
    </button>`;
  }).join('');
}
