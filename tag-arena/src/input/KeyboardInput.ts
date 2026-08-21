import type { InputState, PlayerId } from '../sim/types';

const KEY_MAP: Readonly<Record<string, readonly [PlayerId, keyof InputState]>> = {
  ArrowLeft: ['p1', 'left'],
  ArrowRight: ['p1', 'right'],
  ArrowUp: ['p1', 'up'],
  ArrowDown: ['p1', 'down'],
  Space: ['p1', 'attack'],
  Enter: ['p1', 'tag'],
  KeyA: ['p2', 'left'],
  KeyD: ['p2', 'right'],
  KeyW: ['p2', 'up'],
  KeyS: ['p2', 'down'],
  KeyF: ['p2', 'attack'],
  KeyG: ['p2', 'tag'],
};

function blank(): InputState {
  return { left: false, right: false, up: false, down: false, attack: false, tag: false };
}

export class KeyboardInput {
  readonly #state: Record<PlayerId, InputState> = { p1: blank(), p2: blank() };
  readonly #onKeyDown = (event: KeyboardEvent): void => this.#handle(event, true);
  readonly #onKeyUp = (event: KeyboardEvent): void => this.#handle(event, false);
  readonly #onBlur = (): void => this.clear();

  start(): void {
    window.addEventListener('keydown', this.#onKeyDown);
    window.addEventListener('keyup', this.#onKeyUp);
    window.addEventListener('blur', this.#onBlur);
  }

  stop(): void {
    window.removeEventListener('keydown', this.#onKeyDown);
    window.removeEventListener('keyup', this.#onKeyUp);
    window.removeEventListener('blur', this.#onBlur);
  }

  get(playerId: PlayerId): InputState {
    return { ...this.#state[playerId] };
  }

  clear(): void {
    this.#state.p1 = blank();
    this.#state.p2 = blank();
  }

  #handle(event: KeyboardEvent, pressed: boolean): void {
    const mapping = KEY_MAP[event.code];
    if (!mapping) return;
    event.preventDefault();
    const [playerId, action] = mapping;
    this.#state[playerId][action] = pressed;
  }
}
