export function announce(element, message) {
  if (!element || !message) return;
  element.textContent = '';
  requestAnimationFrame(() => { element.textContent = message; });
}
