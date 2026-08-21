import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');

describe('production architecture boundaries', () => {
  it('keeps simulation independent of browser, Pixi and wall-clock APIs', async () => {
    const source = await read('../src/sim/Game.ts');
    for (const forbidden of [
      'document.',
      'window.',
      'requestAnimationFrame',
      'performance.now',
      "from 'pixi.js'",
      'Math.random',
    ]) {
      expect(source, `simulation contains forbidden dependency: ${forbidden}`).not.toContain(forbidden);
    }
  });

  it('keeps the Pixi renderer read-only with respect to gameplay', async () => {
    const source = await read('../src/render/PixiGameRenderer.ts');
    expect(source).not.toContain("from '../sim/Game'");
    expect(source).not.toContain('ATTACK_DAMAGE');
    expect(source).not.toContain('KNOCKBACK_SPEED');
    expect(source).not.toContain('.step(');
    expect(source).not.toContain('.setInput(');
  });

  it('uses the runtime as the only production module connecting input, simulation and renderer', async () => {
    const source = await read('../src/runtime/GameRuntime.ts');
    expect(source).toContain("from '../sim/Game'");
    expect(source).toContain("from '../render/PixiGameRenderer'");
    expect(source).toContain("from '../input/KeyboardInput'");
  });

  it('boots through TypeScript rather than the legacy canvas controller', async () => {
    const html = await read('../index.html');
    expect(html).toContain('src="/src/main.ts"');
    expect(html).not.toContain('src/app.js');
  });
});
