export function completionVibration() {
  if (!('vibrate' in navigator)) return;
  try { navigator.vibrate([70, 50, 140]); } catch { /* optional */ }
}
