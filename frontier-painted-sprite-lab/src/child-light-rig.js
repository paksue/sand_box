const PIXI = window.PIXI;

const ASSET_URL = './assets/rosa-bonheur-pair-of-oxen.webp';
const ART_W = 800;
const ART_H = 538;
const GROUND_Y = 492;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function point(x, y) { return { x, y }; }

function localPolygon(globalPoints, pivot) {
  const output = [];
  for (const p of globalPoints) output.push(p.x - pivot.x, p.y - pivot.y);
  return output;
}

function createMaskedPaintPiece(texture, pivot, polygon, tintTargets) {
  const node = new PIXI.Container();
  node.position.set(pivot.x, pivot.y);

  const sprite = new PIXI.Sprite(texture);
  sprite.position.set(-pivot.x, -pivot.y);

  const mask = new PIXI.Graphics()
    .poly(localPolygon(polygon, pivot))
    .fill({ color: 0xffffff, alpha: 1 });
  sprite.mask = mask;
  node.addChild(sprite, mask);
  tintTargets.push(sprite);
  return { node, sprite, mask };
}

function rotateVector(x, y, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
}

// This historical painting was never authored with hidden joint artwork. The
// safest Child-of-Light-style test is therefore to keep each visible limb as a
// complete painted shape. Small skeletal rotations happen underneath a torso
// overlap, preserving brushwork and avoiding the hinged-fragment look that the
// previous two-bone crop produced. A purpose-authored production asset can then
// split these limbs further and add weighted IK because its hidden anatomy will
// actually exist.
const LEG_DEFS = [
  {
    id: 'foreFar', far: true, phase: Math.PI * 1.08, maxAngle: 0.105,
    hip: point(285, 306), foot: point(267, 486),
    polygon: [point(244, 290), point(322, 290), point(316, 360), point(307, 430), point(303, 520), point(232, 520), point(238, 430), point(239, 350)],
  },
  {
    id: 'hindFar', far: true, phase: Math.PI * 0.08, maxAngle: 0.10,
    hip: point(621, 300), foot: point(642, 482),
    polygon: [point(586, 278), point(674, 279), point(680, 360), point(676, 430), point(691, 516), point(608, 518), point(612, 430), point(596, 356)],
  },
  {
    id: 'foreNear', far: false, phase: 0, maxAngle: 0.135,
    hip: point(356, 307), foot: point(351, 500),
    polygon: [point(314, 286), point(402, 288), point(397, 368), point(392, 438), point(398, 528), point(309, 528), point(316, 438), point(311, 366)],
  },
  {
    id: 'hindNear', far: false, phase: Math.PI * 1.16, maxAngle: 0.125,
    hip: point(706, 299), foot: point(716, 497),
    polygon: [point(663, 276), point(758, 277), point(762, 365), point(766, 438), point(777, 528), point(686, 528), point(690, 438), point(678, 363)],
  },
];

export class ChildLightOxRig {
  constructor() {
    this.root = new PIXI.Container();
    this.bodyGroup = new PIXI.Container();
    this.shadowLayer = new PIXI.Container();
    this.dustBack = new PIXI.Container();
    this.dustFront = new PIXI.Container();
    this.debugLayer = new PIXI.Graphics();
    this.texture = null;
    this.paintedSprites = [];
    this.legs = [];
    this.motionStrength = 0.72;
    this.actorScale = 1;
    this.debugRig = false;
    this.heroFocus = true;
    this.dustEnabled = true;
    this.ready = false;
    this.phase = 0;
    this.poseVersion = 0;
    this.currentToePositions = {};
    this.dustPuffs = [];
    this.noiseFilter = new PIXI.NoiseFilter({ noise: 0.011, seed: 0.41 });
    this.shadowBlur = new PIXI.BlurFilter({ strength: 5.5, quality: 2 });
    this.dustBlur = new PIXI.BlurFilter({ strength: 2.6, quality: 2 });
  }

  async init() {
    this.texture = await PIXI.Assets.load(ASSET_URL);
    this.root.pivot.set(ART_W * 0.50, 430);

    const shadow = new PIXI.Graphics()
      .ellipse(ART_W * 0.51, 493, 238, 15)
      .fill({ color: 0x2d1d13, alpha: 0.19 });
    shadow.filters = [this.shadowBlur];
    this.shadowLayer.addChild(shadow);

    this.dustBack.filters = [this.dustBlur];
    this.dustFront.filters = [this.dustBlur];
    this.createDust();

    // Give the illustrated body a natural pivot rather than rotating the entire
    // painting around its top-left corner.
    this.bodyGroup.pivot.set(400, 326);
    this.bodyGroup.position.set(400, 326);

    const legLayer = new PIXI.Container();
    for (const def of LEG_DEFS) {
      const piece = createMaskedPaintPiece(this.texture, def.hip, def.polygon, this.paintedSprites);
      this.legs.push({ def, piece, angle: 0, lift: 0 });
      legLayer.addChild(piece.node);
    }

    // The torso deliberately overlaps the tops of all four leg sprites. That
    // hides their rotation seams and recreates the way a properly prepared
    // skeletal illustration contains generous hidden paint around joints.
    const bodyPivot = point(400, 300);
    const bodyPoly = [
      point(15, 22), point(788, 22), point(792, 386), point(742, 392),
      point(678, 384), point(612, 376), point(536, 382), point(458, 377),
      point(386, 384), point(311, 378), point(239, 384), point(166, 370),
      point(93, 359), point(27, 333),
    ];
    this.bodyPiece = createMaskedPaintPiece(this.texture, bodyPivot, bodyPoly, this.paintedSprites);
    this.bodyPiece.sprite.filters = [this.noiseFilter];

    this.bodyGroup.addChild(legLayer, this.bodyPiece.node, this.debugLayer);
    this.root.addChild(this.shadowLayer, this.dustBack, this.bodyGroup, this.dustFront);
    this.applyLook();
    this.updatePose(0);
    this.ready = true;
    return this;
  }

  createDust() {
    for (let i = 0; i < 16; i += 1) {
      const g = new PIXI.Graphics()
        .circle(0, 0, 5 + (i % 5) * 2.4)
        .fill({ color: 0xb78654, alpha: 0.055 });
      const entry = {
        node: g,
        age: ((i * 37) % 100) / 100,
        seed: i * 0.67,
        front: i % 3 === 0,
      };
      (entry.front ? this.dustFront : this.dustBack).addChild(g);
      this.dustPuffs.push(entry);
    }
  }

  setMotionStrength(value) { this.motionStrength = clamp(value, 0, 1); }
  setActorScale(value) { this.actorScale = clamp(value, 0.6, 1.6); }
  setDebugRig(enabled) { this.debugRig = enabled; this.debugLayer.visible = enabled; if (enabled) this.drawRig(); }
  setHeroFocus(enabled) { this.heroFocus = enabled; this.applyLook(); }
  setDustEnabled(enabled) { this.dustEnabled = enabled; this.dustBack.visible = enabled; this.dustFront.visible = enabled; }

  applyLook() {
    const tint = this.heroFocus ? 0xffe4ce : 0xffd7bb;
    for (const sprite of this.paintedSprites) sprite.tint = tint;
  }

  layout(screenWidth, screenHeight) {
    const baseWidth = screenWidth * 0.285 * this.actorScale;
    const scale = baseWidth / ART_W;
    this.root.scale.set(scale);
    this.root.x = screenWidth * 0.66;
    this.root.y = screenHeight * 0.815;
  }

  resetPose() { this.updatePose(0); }

  updatePose(phase) {
    if (!this.texture) return;
    this.phase = phase;
    this.poseVersion += 1;
    const strength = this.motionStrength;

    const bodyBob = Math.sin(phase * 2) * 2.8 * strength;
    const bodyRock = Math.sin(phase) * 0.008 * strength;
    const bodySway = Math.sin(phase * 0.5) * 1.6 * strength;
    this.bodyGroup.position.set(400 + bodySway, 326 + bodyBob);
    this.bodyGroup.rotation = bodyRock;

    this.currentToePositions = {};
    for (const leg of this.legs) {
      const localPhase = phase + leg.def.phase;
      const swing = Math.sin(localPhase);
      const liftPhase = Math.max(0, Math.sin(localPhase));
      const angle = swing * leg.def.maxAngle * strength;
      const lift = liftPhase * 5.5 * strength * (leg.def.far ? 0.82 : 1);
      leg.angle = angle;
      leg.lift = lift;
      leg.piece.node.position.set(leg.def.hip.x, leg.def.hip.y - lift);
      leg.piece.node.rotation = angle;

      const rest = {
        x: leg.def.foot.x - leg.def.hip.x,
        y: leg.def.foot.y - leg.def.hip.y,
      };
      const rotated = rotateVector(rest.x, rest.y, angle);
      this.currentToePositions[leg.def.id] = point(
        leg.def.hip.x + rotated.x,
        leg.def.hip.y - lift + rotated.y,
      );
    }

    if (this.debugRig) this.drawRig();
  }

  updateContinuous(deltaSeconds) {
    if (!this.ready) return;
    const strength = this.motionStrength;
    for (const puff of this.dustPuffs) {
      puff.age += deltaSeconds * (0.27 + strength * 0.10);
      if (puff.age >= 1) puff.age -= 1;
      const t = puff.age;
      const footIndex = Math.floor(puff.seed * 10) % LEG_DEFS.length;
      const foot = this.currentToePositions[LEG_DEFS[footIndex].id] || LEG_DEFS[footIndex].foot;
      puff.node.x = foot.x - t * (34 + (puff.seed % 1) * 20);
      puff.node.y = GROUND_Y - t * (6 + (puff.seed % 1) * 6);
      puff.node.alpha = this.dustEnabled ? Math.sin(Math.PI * t) * 0.048 * strength : 0;
      puff.node.scale.set(0.34 + t * 0.70);
    }
    if (this.debugRig) this.drawRig();
  }

  drawRig() {
    const g = this.debugLayer;
    g.clear();
    for (const leg of this.legs) {
      const hip = leg.def.hip;
      const toe = this.currentToePositions[leg.def.id] || leg.def.foot;
      g.moveTo(hip.x, hip.y - leg.lift).lineTo(toe.x, toe.y)
        .stroke({ width: leg.def.far ? 2.7 : 3.5, color: leg.def.far ? 0x8ad7ff : 0xffd474, alpha: 0.94 });
      g.circle(hip.x, hip.y - leg.lift, 4.8).fill({ color: 0xfff0b7, alpha: 0.96 });
      g.circle(toe.x, toe.y, 4.8).fill({ color: 0xfff0b7, alpha: 0.96 });
    }
  }

  getDebugState() {
    return {
      ready: this.ready,
      poseVersion: this.poseVersion,
      phase: this.phase,
      rootX: this.root.x,
      rootY: this.root.y,
      scale: this.root.scale.x,
      toes: Object.fromEntries(Object.entries(this.currentToePositions).map(([key, value]) => [key, { x: value.x, y: value.y }])),
      debugRig: this.debugRig,
    };
  }
}
