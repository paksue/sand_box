import '../styles.css';
import { installDebugBridge } from './debug/DebugBridge';
import { KeyboardInput } from './input/KeyboardInput';
import { PixiGameRenderer } from './render/PixiGameRenderer';
import { GameRuntime } from './runtime/GameRuntime';
import { Game } from './sim/Game';

const params = new URLSearchParams(window.location.search);
const manualMode = params.get('manual') === '1';
const debugMode = params.get('debug') === '1' || manualMode;
const seed = Number(params.get('seed') || 1);
const host = document.querySelector<HTMLElement>('#game-host');

if (!host) throw new Error('Missing #game-host');

const renderer = new PixiGameRenderer();
await renderer.init(host);

const runtime = new GameRuntime(new Game(seed), renderer, new KeyboardInput(), manualMode);
runtime.start();

if (debugMode) installDebugBridge(runtime);
