import { Application, Container, Graphics, Text } from 'pixi.js';
import { FIGHTER_RADIUS } from '../sim/constants';
import type { FighterState, GameState } from '../sim/types';

export class PixiGameRenderer {
  readonly app = new Application();
  readonly #world = new Container();
  readonly #graphics = new Graphics();
  readonly #labels = new Container();
  readonly #status = new Text({
    text: '',
    style: { fill: 0x202020, fontFamily: 'monospace', fontSize: 13 },
  });

  async init(host: HTMLElement): Promise<void> {
    await this.app.init({
      width: 800,
      height: 450,
      background: '#f5efe4',
      antialias: true,
      preference: 'webgl',
    });
    this.app.canvas.setAttribute('aria-label', 'Tag Arena production arena');
    this.app.canvas.id = 'arena';
    host.replaceChildren(this.app.canvas);
    this.app.stage.addChild(this.#world);
    this.#world.addChild(this.#graphics);
    this.#world.addChild(this.#labels);
    this.#labels.addChild(this.#status);
    this.#status.position.set(16, 420);
  }

  render(state: GameState): void {
    const g = this.#graphics;
    g.clear();

    // Arena and inner rope guide.
    g.rect(2, 2, state.arena.width - 4, state.arena.height - 4)
      .stroke({ color: 0x181818, width: 3 });
    g.rect(14, 14, state.arena.width - 28, state.arena.height - 28)
      .stroke({ color: 0xb8aa96, width: 2, alpha: 0.85 });

    // Deterministic marker retained from the harness so seeded state remains visible.
    g.circle(state.marker.x, state.marker.y, 5).fill(0x222222);

    this.#drawHealth(g, 20, 18, 260, state.fighters.p1, false);
    this.#drawHealth(g, 520, 18, 260, state.fighters.p2, true);
    this.#drawFighter(g, state.fighters.p1, 0x1769aa);
    this.#drawFighter(g, state.fighters.p2, 0xb3261e);

    if (state.grapple) {
      const attacker = state.fighters[state.grapple.attackerId];
      const target = state.fighters[state.grapple.targetId];
      const midX = (attacker.x + target.x) * 0.5;
      const midY = (attacker.y + target.y) * 0.5;
      const arrowLength = 42;

      g.moveTo(attacker.x, attacker.y)
        .lineTo(target.x, target.y)
        .stroke({ color: 0x7b2cbf, width: 8, alpha: 0.8 });
      g.circle(midX, midY, 11)
        .stroke({ color: 0xf4a261, width: 4, alpha: 0.95 });
      g.moveTo(midX, midY)
        .lineTo(
          midX + state.grapple.throwX * arrowLength,
          midY + state.grapple.throwY * arrowLength,
        )
        .stroke({ color: 0x111111, width: 4 });
    }

    if (state.impact) {
      const pulse = 16 + state.impact.ticksRemaining * 4;
      const impactColor = state.impact.kind === 'throw' ? 0x7b2cbf : 0xffa000;
      const accentColor = state.impact.kind === 'throw' ? 0xe0aaff : 0xffd166;
      g.circle(state.impact.x, state.impact.y, pulse)
        .stroke({ color: impactColor, width: 5, alpha: 0.9 });
      g.moveTo(state.impact.x - pulse, state.impact.y)
        .lineTo(state.impact.x + pulse, state.impact.y)
        .stroke({ color: accentColor, width: 3 });
      if (state.impact.kind === 'throw') {
        g.moveTo(state.impact.x, state.impact.y - pulse)
          .lineTo(state.impact.x, state.impact.y + pulse)
          .stroke({ color: accentColor, width: 3 });
      }
    }

    // Tiny deterministic camera kick; it visualizes simulation pause and owns no gameplay truth.
    const shake = state.hitstopTicks > 0 ? (state.tick % 2 === 0 ? 2 : -2) : 0;
    this.#world.position.set(shake, 0);

    const grappleStatus = state.grapple
      ? `CLINCH ${state.grapple.ticksRemaining} → ${state.grapple.throwX.toFixed(2)},${state.grapple.throwY.toFixed(2)}`
      : '';
    const pauseStatus = state.hitstopTicks > 0
      ? `${state.impact?.kind === 'throw' ? 'THROW' : 'HIT'}STOP ${state.hitstopTicks}`
      : '';

    this.#status.text = [
      `tick ${state.tick}`,
      `P1 ${state.fighters.p1.health}hp ${state.fighters.p1.state}`,
      `P2 ${state.fighters.p2.health}hp ${state.fighters.p2.state}`,
      grappleStatus,
      pauseStatus,
    ].filter(Boolean).join('  ·  ');
  }

  #drawHealth(g: Graphics, x: number, y: number, width: number, fighter: FighterState, alignRight: boolean): void {
    g.rect(x, y, width, 10).fill(0xd8d2c8);
    const healthWidth = width * (fighter.health / 100);
    const healthX = alignRight ? x + width - healthWidth : x;
    g.rect(healthX, y, healthWidth, 10).fill(fighter.id === 'p1' ? 0x1769aa : 0xb3261e);
    g.rect(x, y, width, 10).stroke({ color: 0x111111, width: 1 });
  }

  #drawFighter(g: Graphics, fighter: FighterState, color: number): void {
    g.circle(fighter.x, fighter.y, FIGHTER_RADIUS).fill(color);
    g.moveTo(fighter.x, fighter.y)
      .lineTo(
        fighter.x + fighter.facingX * (FIGHTER_RADIUS + 13),
        fighter.y + fighter.facingY * (FIGHTER_RADIUS + 13),
      )
      .stroke({ color: 0xffffff, width: 4 });

    if (fighter.state === 'attack') {
      g.circle(fighter.x, fighter.y, FIGHTER_RADIUS + 8)
        .stroke({ color: 0x111111, width: 3 });
    } else if (fighter.state === 'grapple') {
      g.circle(fighter.x, fighter.y, FIGHTER_RADIUS + 7)
        .stroke({ color: 0x7b2cbf, width: 4 });
    } else if (fighter.state === 'throw') {
      g.circle(fighter.x, fighter.y, FIGHTER_RADIUS + 8)
        .stroke({ color: 0xf4a261, width: 4 });
    }
  }
}
