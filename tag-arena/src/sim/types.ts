export type PlayerId = 'p1' | 'p2';
export type RosterId = 'p1a' | 'p1b' | 'p2a' | 'p2b';
export type FighterMode = 'idle' | 'move' | 'attack' | 'grapple' | 'throw' | 'hitstun' | 'rebound' | 'inactive';
export type ScenarioName =
  | 'baseline'
  | 'collision'
  | 'edge-collision'
  | 'attack'
  | 'grapple'
  | 'grapple-rope'
  | 'tag-ready'
  | 'tag-ready-p2'
  | 'tag-recovery'
  | 'rope'
  | 'rope-hit';

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  attack: boolean;
  tag: boolean;
}

export interface FighterState {
  id: PlayerId;
  rosterId: RosterId;
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
  grappleRecoveryTicks: number;
  hitstunTicks: number;
  reboundTicks: number;
}

export interface TeamState {
  tagCooldownTicks: number;
  partnerRecoveryTicks: number;
}

export interface ImpactState {
  kind: 'strike' | 'throw';
  attackerId: PlayerId;
  targetId: PlayerId;
  x: number;
  y: number;
  ticksRemaining: number;
}

export interface GrappleState {
  attackerId: PlayerId;
  targetId: PlayerId;
  ticksRemaining: number;
  throwX: number;
  throwY: number;
}

export interface GameState {
  version: 5;
  seed: number;
  tick: number;
  hitstopTicks: number;
  impact: ImpactState | null;
  grapple: GrappleState | null;
  arena: { width: number; height: number };
  marker: { x: number; y: number };
  fighters: Record<PlayerId, FighterState>;
  partners: Record<PlayerId, FighterState>;
  teams: Record<PlayerId, TeamState>;
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
  reset(seed?: number): GameApi;
}
