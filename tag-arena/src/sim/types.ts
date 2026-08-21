export type PlayerId = 'p1' | 'p2';
export type FighterMode = 'idle' | 'move' | 'attack' | 'hitstun' | 'rebound';
export type ScenarioName = 'baseline' | 'collision' | 'edge-collision' | 'attack' | 'rope' | 'rope-hit';

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  attack: boolean;
}

export interface FighterState {
  id: PlayerId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facingX: number;
  facingY: number;
  state: FighterMode;
  health: number;
  attackCooldown: number;
  attackStartupTicks: number;
  attackRecoveryTicks: number;
  attackActive: boolean;
  hitstunTicks: number;
  reboundTicks: number;
}

export interface ImpactState {
  attackerId: PlayerId;
  targetId: PlayerId;
  x: number;
  y: number;
  ticksRemaining: number;
}

export interface GameState {
  version: 3;
  seed: number;
  tick: number;
  hitstopTicks: number;
  impact: ImpactState | null;
  arena: { width: number; height: number };
  marker: { x: number; y: number };
  fighters: Record<PlayerId, FighterState>;
}

export interface GameEvent {
  tick: number;
  type: string;
  [key: string]: string | number | boolean | undefined;
}

export interface GameApi {
  getState(): GameState;
  getEvents(): GameEvent[];
  setInput(playerId: PlayerId, input: Partial<InputState>): void;
  loadScenario(name: ScenarioName): GameState;
  step(ticks?: number): GameState;
  reset(seed?: number): Game;
}

// Type-only forward declaration for the public reset() contract.
export interface Game extends GameApi {}
