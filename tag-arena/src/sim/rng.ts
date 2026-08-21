export interface Rng {
  next(): number;
  getState(): number;
}

export function createRng(seed = 1): Rng {
  let state = (Number(seed) >>> 0) || 1;

  return {
    next(): number {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      return state / 0x100000000;
    },
    getState(): number {
      return state >>> 0;
    },
  };
}
