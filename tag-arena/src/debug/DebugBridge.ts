import type { GameRuntime } from '../runtime/GameRuntime';
import type { InputState, PlayerId, ScenarioName } from '../sim/types';

export interface TagArenaDebugApi {
  readonly version: 4;
  readonly renderer: 'pixi-v8-webgl';
  getState: GameRuntime['game']['getState'];
  getEvents: GameRuntime['game']['getEvents'];
  setInput(playerId: PlayerId, input: Partial<InputState>): void;
  step(ticks?: number): ReturnType<GameRuntime['game']['getState']>;
  loadScenario(name: ScenarioName): ReturnType<GameRuntime['game']['getState']>;
  reset(seed?: number): ReturnType<GameRuntime['game']['getState']>;
}

declare global {
  interface Window {
    __TAG_ARENA__?: TagArenaDebugApi;
  }
}

export function installDebugBridge(runtime: GameRuntime): TagArenaDebugApi {
  const api: TagArenaDebugApi = Object.freeze({
    version: 4,
    renderer: 'pixi-v8-webgl',
    getState: () => runtime.game.getState(),
    getEvents: () => runtime.game.getEvents(),
    setInput: (playerId, input) => runtime.setInput(playerId, input),
    step: (ticks = 1) => runtime.step(ticks),
    loadScenario: (name) => runtime.loadScenario(name),
    reset: (seed = 1) => runtime.reset(seed),
  });

  window.__TAG_ARENA__ = api;
  return api;
}
