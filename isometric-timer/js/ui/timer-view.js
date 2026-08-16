const RING_RADIUS = 134;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function timerDisplay(timer, clock) {
  const durationSeconds = Math.round(timer.durationMs / 1000);

  if (timer.mode === 'PREPARE') {
    const remaining = clock.remaining(timer);
    return {
      label: timer.resumePreparation ? 'Resume in' : 'Get Ready',
      caption: 'Get in position',
      number: Math.max(1, Math.ceil(remaining / 1000)),
      unit: '',
      progress: clamp(1 - remaining / 3000, 0, 1)
    };
  }

  if (timer.mode === 'HOLD') {
    const remaining = clock.remaining(timer);
    return {
      label: 'Hold',
      caption: 'Keep breathing',
      number: Math.max(0, Math.ceil(remaining / 1000)),
      unit: 'seconds',
      progress: clamp(1 - remaining / timer.durationMs, 0, 1)
    };
  }

  if (timer.mode === 'PAUSED') {
    const remaining = timer.pausedHoldMs;
    return {
      label: 'Paused',
      caption: `Paused with ${Math.max(1, Math.ceil(remaining / 1000))} seconds left`,
      number: Math.max(1, Math.ceil(remaining / 1000)),
      unit: 'seconds',
      progress: clamp(1 - remaining / timer.durationMs, 0, 1)
    };
  }

  if (timer.mode === 'DONE') {
    return {
      label: 'Done',
      caption: `${durationSeconds} second hold complete`,
      number: '✓',
      unit: 'complete',
      progress: 1
    };
  }

  return {
    label: 'Isometric Hold',
    caption: 'Ready when you are',
    number: durationSeconds,
    unit: 'seconds',
    progress: 0
  };
}

export function renderTimer(elements, state, clock) {
  const display = timerDisplay(state.timer, clock);
  elements.timerPanel.dataset.mode = state.timer.mode;
  elements.phaseLabel.textContent = display.label;
  elements.phaseCaption.textContent = display.caption;
  elements.timerNumber.textContent = String(display.number);
  elements.timerUnit.textContent = display.unit;
  elements.progressCircle.style.strokeDasharray = `${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`;
  elements.progressCircle.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - display.progress));
}
