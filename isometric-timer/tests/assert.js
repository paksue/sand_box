export function assert(condition, message = 'Assertion failed') {
  if (!condition) throw new Error(message);
}

export function equal(actual, expected, message = '') {
  if (!Object.is(actual, expected)) throw new Error(`${message || 'Values differ'}: expected ${expected}, got ${actual}`);
}
