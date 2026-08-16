export function subscribeVisibility(handler) {
  const listener = () => handler(document.visibilityState);
  document.addEventListener('visibilitychange', listener);
  window.addEventListener('pageshow', listener);
  return () => {
    document.removeEventListener('visibilitychange', listener);
    window.removeEventListener('pageshow', listener);
  };
}
