// Deterministic 32-bit linear congruential generator.
// Gameplay code must use this instead of Math.random().
export function createRng(seed = 1) {
  let state = (Number(seed) >>> 0) || 1;

  return {
    next() {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      return state / 0x100000000;
    },

    getState() {
      return state >>> 0;
    },
  };
}
