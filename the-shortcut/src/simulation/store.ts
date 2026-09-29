import { useSyncExternalStore } from "react";
import {
  deserialize,
  initialState,
  reduce,
  SAVE_KEY,
  serialize,
  type Action,
} from "./game";
let state = initialState();
let saveStatus = "No saved session";
try {
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) {
    state = deserialize(raw);
    saveStatus = "Saved session restored";
  }
} catch {
  saveStatus = "Save unavailable or invalid; fresh session loaded";
}
const listeners = new Set<() => void>();
let uiState = state;
export const snapshot = () => state;
const uiSnapshot = () => uiState;
function publish() {
  uiState = state;
  listeners.forEach((fn) => fn());
}
export function dispatch(action: Action) {
  const previousState = state;
  state = reduce(state, action);
  if (
    action.type !== "tick" ||
    state.story !== previousState.story ||
    state.inspection !== previousState.inspection ||
    (state.target !== previousState.target && !state.target) ||
    Math.floor(state.ticks / 1200) !== Math.floor(previousState.ticks / 1200)
  )
    publish();
}
export function save() {
  try {
    localStorage.setItem(SAVE_KEY, serialize(state));
    saveStatus = "Session saved";
  } catch {
    saveStatus = "Could not save in this browser";
  }
  state = { ...state };
  publish();
}
export const status = () => saveStatus;
export function reset() {
  state = initialState();
  save();
}
export function useGame() {
  return useSyncExternalStore((fn) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, uiSnapshot);
}
let accumulator = 0,
  previous = performance.now();
function loop(now: number) {
  accumulator += Math.min(now - previous, 250);
  previous = now;
  while (accumulator >= 50) {
    dispatch({ type: "tick" });
    accumulator -= 50;
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
setInterval(save, 2000);
window.addEventListener("pagehide", save);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) save();
  previous = performance.now();
  accumulator = 0;
});
