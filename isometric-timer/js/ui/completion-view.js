import { getExercise } from '../domain/exercise-catalog.js';
import { FEEDBACK } from '../domain/progression.js';

export function renderCompletion(elements, state) {
  const exercise = getExercise(state.training.selectedExerciseId);
  const done = state.timer.mode === 'DONE';
  elements.feedbackPanel.hidden = !done || !exercise.progressive;
  if (!done || !exercise.progressive) return;

  const currentSession = state.training.history.find((item) => item.sessionId === state.timer.sessionId);
  const feedback = currentSession?.difficultyFeedback || '';
  const next = currentSession?.recommendedNextTarget || state.training.targets[exercise.id];
  elements.feedbackButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.feedback === feedback));
  });
  elements.nextTarget.textContent = feedback ? `Next target: ${next} sec` : 'How was that?';
  elements.nextTarget.dataset.hasFeedback = feedback ? 'true' : 'false';

  const labels = {
    [FEEDBACK.HARD]: 'Too hard',
    [FEEDBACK.GOOD]: 'Good',
    [FEEDBACK.EASY]: 'Easy'
  };
  elements.feedbackSummary.textContent = feedback ? `${labels[feedback]} · target adjusted` : 'Choose one after the hold';
}
