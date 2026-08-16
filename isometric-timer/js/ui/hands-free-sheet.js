function statusLabel(status, message) {
  if (status === 'ACTIVE') return message || 'Active';
  if (status === 'LOADING') return message || 'Loading…';
  if (status === 'PERMISSION_DENIED') return message || 'Permission denied';
  if (status === 'ERROR') return message || 'Unavailable';
  return 'Off';
}

export function renderHandsFreeSheet(elements, state) {
  const voice = state.handsFree.voice;
  const gesture = state.handsFree.gesture;
  elements.voiceToggle.checked = Boolean(state.settings.handsFree.voiceEnabled);
  elements.gestureToggle.checked = Boolean(state.settings.handsFree.gestureEnabled);
  elements.voiceStatus.textContent = statusLabel(voice.status, voice.message);
  elements.gestureStatus.textContent = statusLabel(gesture.status, gesture.message);
  elements.voiceStatus.dataset.state = voice.status.toLowerCase();
  elements.gestureStatus.dataset.state = gesture.status.toLowerCase();
}
