import { getExercise } from '../domain/exercise-catalog.js';
import { renderTimer } from './timer-view.js';
import { renderCompletion } from './completion-view.js';
import { renderExerciseSheet } from './exercise-sheet.js';
import { renderHandsFreeSheet } from './hands-free-sheet.js';

export function collectElements() {
  const q = (id) => document.getElementById(id);
  return {
    timerPanel: q('timerPanel'),
    phaseLabel: q('phaseLabel'),
    phaseCaption: q('phaseCaption'),
    timerNumber: q('timerNumber'),
    timerUnit: q('timerUnit'),
    progressCircle: q('progressCircle'),
    mainAction: q('mainAction'),
    resetButton: q('resetButton'),
    wakeStatus: q('wakeStatus'),
    wakeStatusText: q('wakeStatusText'),
    capabilityStatus: q('capabilityStatus'),
    capabilityStatusText: q('capabilityStatusText'),
    soundButton: q('soundButton'),
    soundIcon: q('soundIcon'),
    soundLabel: q('soundLabel'),
    durationButton: q('durationButton'),
    durationLabel: q('durationLabel'),
    handsFreeButton: q('handsFreeButton'),
    exerciseButton: q('exerciseButton'),
    exerciseName: q('exerciseName'),
    settingsButton: q('settingsButton'),
    settingsDialog: q('settingsDialog'),
    closeSettingsButton: q('closeSettingsButton'),
    presetGrid: q('presetGrid'),
    customSeconds: q('customSeconds'),
    applyCustomButton: q('applyCustomButton'),
    exerciseDialog: q('exerciseDialog'),
    closeExerciseButton: q('closeExerciseButton'),
    exerciseList: q('exerciseList'),
    handsFreeDialog: q('handsFreeDialog'),
    closeHandsFreeButton: q('closeHandsFreeButton'),
    voiceToggle: q('voiceToggle'),
    gestureToggle: q('gestureToggle'),
    voiceStatus: q('voiceStatus'),
    gestureStatus: q('gestureStatus'),
    feedbackPanel: q('feedbackPanel'),
    feedbackButtons: [...document.querySelectorAll('[data-feedback]')],
    nextTarget: q('nextTarget'),
    feedbackSummary: q('feedbackSummary'),
    phaseAnnouncer: q('phaseAnnouncer'),
    notice: q('notice')
  };
}

function renderActions(elements, timer) {
  if (timer.mode === 'READY') {
    elements.mainAction.textContent = 'Start';
    elements.mainAction.dataset.kind = 'start';
    elements.resetButton.hidden = true;
  } else if (timer.mode === 'PREPARE') {
    elements.mainAction.textContent = 'Cancel';
    elements.mainAction.dataset.kind = 'pause';
    elements.resetButton.hidden = true;
  } else if (timer.mode === 'HOLD') {
    elements.mainAction.textContent = 'Pause';
    elements.mainAction.dataset.kind = 'pause';
    elements.resetButton.hidden = false;
  } else if (timer.mode === 'PAUSED') {
    elements.mainAction.textContent = 'Resume';
    elements.mainAction.dataset.kind = 'resume';
    elements.resetButton.hidden = false;
  } else {
    elements.mainAction.textContent = 'Do Again';
    elements.mainAction.dataset.kind = 'start';
    elements.resetButton.hidden = false;
  }
}

function renderWake(elements, state) {
  const active = state.timer.mode === 'PREPARE' || state.timer.mode === 'HOLD';
  if (!active) {
    elements.wakeStatus.dataset.state = 'idle';
    elements.wakeStatusText.textContent = 'Screen awake';
    return;
  }
  if (state.wakeStatus === 'active') {
    elements.wakeStatus.dataset.state = 'active';
    elements.wakeStatusText.textContent = 'Screen awake';
  } else {
    elements.wakeStatus.dataset.state = 'warning';
    elements.wakeStatusText.textContent = 'Keep screen on';
  }
}

function renderCapabilities(elements, state) {
  const active = [];
  if (state.handsFree.voice.status === 'ACTIVE') active.push('Voice');
  if (state.handsFree.gesture.status === 'ACTIVE') active.push('Gestures');
  if (!active.length) {
    elements.capabilityStatus.dataset.state = 'idle';
    elements.capabilityStatusText.textContent = 'Hands-free off';
  } else {
    elements.capabilityStatus.dataset.state = 'active';
    elements.capabilityStatusText.textContent = `${active.join(' + ')} ready`;
  }
}

function renderUtilities(elements, state) {
  const selected = getExercise(state.training.selectedExerciseId);
  elements.exerciseName.textContent = selected.name;
  elements.durationLabel.textContent = `${Math.round(state.timer.durationMs / 1000)} sec`;
  elements.soundButton.setAttribute('aria-pressed', String(state.settings.soundEnabled));
  elements.soundIcon.textContent = state.settings.soundEnabled ? '♪' : '×';
  elements.soundLabel.textContent = state.settings.soundEnabled ? 'Sound on' : 'Sound off';

  const timerLocked = ['PREPARE', 'HOLD', 'PAUSED'].includes(state.timer.mode);
  elements.durationButton.disabled = timerLocked;
  elements.exerciseButton.disabled = state.timer.mode !== 'READY';
  elements.settingsButton.disabled = timerLocked;
  elements.handsFreeButton.disabled = ['PREPARE', 'HOLD'].includes(state.timer.mode);

  const anyHandsFree = state.settings.handsFree.voiceEnabled || state.settings.handsFree.gestureEnabled;
  elements.handsFreeButton.setAttribute('aria-pressed', String(anyHandsFree));
  elements.handsFreeButton.classList.toggle('utility-button--active', anyHandsFree);
}

export function renderApp(elements, state, clock) {
  renderTimer(elements, state, clock);
  renderActions(elements, state.timer);
  renderWake(elements, state);
  renderCapabilities(elements, state);
  renderUtilities(elements, state);
  renderCompletion(elements, state);
  renderHandsFreeSheet(elements, state);
  if (state.notice) {
    elements.notice.hidden = false;
    elements.notice.textContent = state.notice;
  } else {
    elements.notice.hidden = true;
    elements.notice.textContent = '';
  }
}

export function refreshSheets(elements, state) {
  renderExerciseSheet(elements, state);
  renderHandsFreeSheet(elements, state);
  const seconds = Math.round(state.timer.durationMs / 1000);
  elements.customSeconds.value = String(seconds);
  elements.presetGrid.querySelectorAll('[data-seconds]').forEach((button) => {
    button.setAttribute('aria-pressed', String(Number(button.dataset.seconds) === seconds));
  });
}
