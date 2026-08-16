import { AppController } from './app-controller.js';
import { collectElements, refreshSheets } from './ui/render.js';
import { FEEDBACK } from './domain/progression.js';

const elements = collectElements();
const app = new AppController(elements);

function openDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

function bindDialogBackdrop(dialog) {
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
}

elements.mainAction.addEventListener('click', () => app.mainAction('touch'));
elements.resetButton.addEventListener('click', () => app.reset('touch'));
elements.soundButton.addEventListener('click', () => app.toggleSound());

elements.durationButton.addEventListener('click', () => {
  refreshSheets(elements, app.state);
  openDialog(elements.settingsDialog);
});
elements.settingsButton.addEventListener('click', () => {
  refreshSheets(elements, app.state);
  openDialog(elements.settingsDialog);
});
elements.closeSettingsButton.addEventListener('click', () => closeDialog(elements.settingsDialog));

elements.presetGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-seconds]');
  if (!button) return;
  app.setDurationSeconds(button.dataset.seconds);
  closeDialog(elements.settingsDialog);
});
elements.applyCustomButton.addEventListener('click', () => {
  app.setDurationSeconds(elements.customSeconds.value);
  closeDialog(elements.settingsDialog);
});
elements.customSeconds.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  app.setDurationSeconds(elements.customSeconds.value);
  closeDialog(elements.settingsDialog);
});

elements.exerciseButton.addEventListener('click', () => {
  refreshSheets(elements, app.state);
  openDialog(elements.exerciseDialog);
});
elements.closeExerciseButton.addEventListener('click', () => closeDialog(elements.exerciseDialog));
elements.exerciseList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-exercise-id]');
  if (!button) return;
  app.chooseExercise(button.dataset.exerciseId);
  closeDialog(elements.exerciseDialog);
});

elements.handsFreeButton.addEventListener('click', () => {
  refreshSheets(elements, app.state);
  openDialog(elements.handsFreeDialog);
});
elements.closeHandsFreeButton.addEventListener('click', () => closeDialog(elements.handsFreeDialog));
elements.voiceToggle.addEventListener('change', async () => {
  const desired = elements.voiceToggle.checked;
  const ok = await app.setHandsFree('voice', desired);
  if (desired && !ok) elements.voiceToggle.checked = false;
});
elements.gestureToggle.addEventListener('change', async () => {
  const desired = elements.gestureToggle.checked;
  const ok = await app.setHandsFree('gesture', desired);
  if (desired && !ok) elements.gestureToggle.checked = false;
});

elements.feedbackButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.feedback;
    if ([FEEDBACK.HARD, FEEDBACK.GOOD, FEEDBACK.EASY].includes(value)) app.applyFeedback(value);
  });
});

for (const dialog of [elements.settingsDialog, elements.exerciseDialog, elements.handsFreeDialog]) bindDialogBackdrop(dialog);

document.addEventListener('keydown', (event) => {
  if (event.repeat) return;
  if ([elements.settingsDialog, elements.exerciseDialog, elements.handsFreeDialog].some((dialog) => dialog?.open)) return;
  if (event.target instanceof HTMLInputElement) return;
  if (event.code === 'Space') {
    event.preventDefault();
    app.mainAction('keyboard');
  } else if (event.key.toLowerCase() === 'r' && app.state.timer.mode !== 'READY') {
    event.preventDefault();
    app.reset('keyboard');
  }
});

window.addEventListener('beforeunload', () => app.dispose(), { once: true });

app.init();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Offline enhancement is optional; the timer itself remains usable.
    });
  }, { once: true });
}
