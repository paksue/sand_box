import { KeyboardInput } from '../input/KeyboardInput';
import { PixiGameRenderer } from '../render/PixiGameRenderer';
import { FIXED_HZ } from '../sim/constants';
import { Game } from '../sim/Game';
import type { InputState, PlayerId, ScenarioName } from '../sim/types';

export class GameRuntime {
  #game: Game;
  readonly #renderer: PixiGameRenderer;
  readonly #keyboard: KeyboardInput;
  readonly #manualMode: boolean;
  #accumulator = 0;
  #lastTime = performance.now();
  #rafId: number | null = null;

  constructor(game: Game, renderer: PixiGameRenderer, keyboard: KeyboardInput, manualMode: boolean) {
    this.#game = game;
    this.#renderer = renderer;
    this.#keyboard = keyboard;
    this.#manualMode = manualMode;
  }

  start(): void {
    this.#keyboard.start();
    this.render();
    if (!this.#manualMode) this.#rafId = requestAnimationFrame(this.#frame);
  }

  stop(): void {
    this.#keyboard.stop();
    if (this.#rafId !== null) cancelAnimationFrame(this.#rafId);
    this.#rafId = null;
  }

  get game(): Game {
    return this.#game;
  }

  render(): void {
    this.#renderer.render(this.#game.getState());
  }

  setInput(playerId: PlayerId, input: Partial<InputState>): void {
    this.#game.setInput(playerId, input);
  }

  step(ticks = 1): ReturnType<Game['getState']> {
    const state = this.#game.step(ticks);
    this.#renderer.render(state);
    return state;
  }

  loadScenario(name: ScenarioName): ReturnType<Game['getState']> {
    this.#keyboard.clear();
    const state = this.#game.loadScenario(name);
    this.#renderer.render(state);
    return state;
  }

  reset(seed = 1): ReturnType<Game['getState']> {
    this.#keyboard.clear();
    this.#game = new Game(seed);
    const state = this.#game.getState();
    this.#renderer.render(state);
    return state;
  }

  readonly #frame = (now: number): void => {
    const frameSeconds = Math.min(0.25, (now - this.#lastTime) / 1000);
    this.#lastTime = now;
    this.#accumulator += frameSeconds;
    const fixedSeconds = 1 / FIXED_HZ;

    while (this.#accumulator >= fixedSeconds) {
      this.#game.setInput('p1', this.#keyboard.get('p1'));
      this.#game.setInput('p2', this.#keyboard.get('p2'));
      this.#game.step(1);
      this.#accumulator -= fixedSeconds;
    }

    this.render();
    this.#rafId = requestAnimationFrame(this.#frame);
  };
}
