import type { GameRuntime } from '../runtime/GameRuntime';
import type { GameEvent, GameState, InputState, PlayerId, ScenarioName } from '../sim/types';

export interface TagArenaDebugApi {
  readonly version: 5;
  readonly renderer: 'pixi-v8-webgl';
  getState(): GameState;
  getEvents(): GameEvent[];
  setInput(playerId: PlayerId, input: Partial<InputState>): void;
  step(ticks?: number): GameState;
  loadScenario(name: ScenarioName): GameState;
  reset(seed?: number): GameState;
}

declare global {
  interface Window {
    __TAG_ARENA__?: TagArenaDebugApi;
  }
}

export function installDebugBridge(runtime: GameRuntime): TagArenaDebugApi {
  const api: TagArenaDebugApi = Object.freeze({
    version: 5,
    renderer: 'pixi-v8-webgl',
    getState: (): GameState => runtime.game.getState(),
    getEvents: (): GameEvent[] => runtime.game.getEvents(),
    setInput: (playerId: PlayerId, input: Partial<InputState>): void => runtime.setInput(playerId, input),
    step: (ticks = 1): GameState => runtime.step(ticks),
    loadScenario: (name: ScenarioName): GameState => runtime.loadScenario(name),
    reset: (seed = 1): GameState => runtime.reset(seed),
  });

  window.__TAG_ARENA__ = api;
  return api;
}
