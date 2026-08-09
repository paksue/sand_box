const PIXI = window.PIXI;

const ASSET_URL = './assets/rosa-bonheur-pair-of-oxen.webp';
const ART_W = 800;
const ART_H = 538;
const GROUND_Y = 492;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;

function point(x, y) { return { x, y }; }
function sub(a, b) { return { x: a.x - b.x, y: a.y - b.y }; }
function length(v) { return Math.hypot(v.x, v.y); }

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

function solveTwoBone(hip, target, upperLength, lowerLength, bendSign = 1) {
  const delta = sub(target, hip);
  const distance = clamp(length(delta), Math.abs(upperLength - lowerLength) + 0.5, upperLength + lowerLength - 0.5);
  const baseAngle = Math.atan2(delta.y, delta.x);
  const cosKnee = clamp(
    (distance * distance - upperLength * upperLength - lowerLength * lowerLength) /
      (2 * upperLength * lowerLength),
    -1,
    1,
  );
  const kneeRelative = Math.acos(cosKnee) * bendSign;
  const helper = Math.atan2(
    lowerLength * Math.sin(kneeRelative),
    upperLength + lowerLength * Math.cos(kneeRelative),
  );
  const upperWorld = baseAngle - helper;
  const knee = point(
    hip.x + Math.cos(upperWorld) * upperLength,
    hip.y + Math.sin(upperWorld) * upperLength,
  );
  const lowerWorld = Math.atan2(target.y - knee.y, target.x - knee.x);
  return { upperWorld, lowerWorld, knee, target };
}

const LEG_DEFS = [
  {
    id: 'foreFar', far: true, phase: Math.PI * 1.06,
    hip: point(286, 306), knee: point(274, 392), foot: point(268, 486),
    upperPoly: [point(238, 286), point(326, 286), point(326, 410), point(242, 422)],
    lowerPoly: [point(235, 366), point(313, 362), point(311, 518), point(233, 520)],
  },
  {
    id: 'hindFar', far: true, phase: Math.PI * 0.10,
    hip: point(621, 300), knee: point(630, 389), foot: point(642, 482),
    upperPoly: [point(582, 278), point(668, 280), point(679, 414), point(594, 419)],
    lowerPoly: [point(594, 363), point(676, 360), point(690, 514), point(608, 518)],
  },
  {
    id: 'foreNear', far: false, phase: 0,
    hip: point(356, 309), knee: point(354, 401), foot: point(351, 500),
    upperPoly: [point(313, 286), point(400, 288), point(400, 423), point(315, 424)],
    lowerPoly: [point(313, 369), point(396, 366), point(396, 526), point(315, 527)],
  },
  {
    id: 'hindNear', far: false, phase: Math.PI * 1.16,
    hip: point(706, 299), knee: point(708, 392), foot: point(716, 497),
    upperPoly: [point(665, 276), point(751, 277), point(758, 416), point(674, 420)],
    lowerPoly: [point(674, 362), point(754, 360), point(770, 525), point(688, 528)],
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
    this.noiseFilter = new PIXI.NoiseFilter({ noise: 0.012, seed: 0.41 });
    this.shadowBlur = new PIXI.BlurFilter({ strength: 6, quality: 2 });
    this.dustBlur = new PIXI.BlurFilter({ strength: 2.8, quality: 2 });
  }

  async init() {
    this.texture = await PIXI.Assets.load(ASSET_URL);
    this.root.pivot.set(ART_W * 0.50, 428);

    const shadow = new PIXI.Graphics()
      .ellipse(ART_W * 0.51, 493, 246, 17)
      .fill({ color: 0x2d1d13, alpha: 0.20 });
    shadow.filters = [this.shadowBlur];
    this.shadowLayer.addChild(shadow);

    this.dustBack.filters = [this.dustBlur];
    this.dustFront.filters = [this.dustBlur];
    this.createDust();

    const farLegLayer = new PIXI.Container();
    const nearLegLayer = new PIXI.Container();

    for (const def of LEG_DEFS) {
      const leg = this.createLeg(def);
      this.legs.push(leg);
      (def.far ? farLegLayer : nearLegLayer).addChild(leg.upper.node);
    }

    const bodyPivot = point(400, 300);
    const bodyPoly = [
      point(15, 22), point(788, 22), point(792, 365), point(748, 374),
      point(675, 369), point(612, 359), point(531, 366), point(454, 360),
      point(383, 369), point(312, 363), point(238, 369), point(168, 357),
      point(96, 349), point(30, 326),
    ];
    this.bodyPiece = createMaskedPaintPiece(this.texture, bodyPivot, bodyPoly, this.paintedSprites);
    this.bodyPiece.node.position.set(bodyPivot.x, bodyPivot.y);
    this.bodyPiece.sprite.filters = [this.noiseFilter];

    this.bodyGroup.addChild(farLegLayer, this.bodyPiece.node, nearLegLayer);
    this.root.addChild(this.shadowLayer, this.dustBack, this.bodyGroup, this.dustFront, this.debugLayer);
    this.applyLook();
    this.updatePose(0);
    this.ready = true;
    return this;
  }

  createLeg(def) {
    const upper = createMaskedPaintPiece(this.texture, def.hip, def.upperPoly, this.paintedSprites);
    const lower = createMaskedPaintPiece(this.texture, def.knee, def.lowerPoly, this.paintedSprites);
    lower.node.position.set(def.knee.x - def.hip.x, def.knee.y - def.hip.y);
    upper.node.addChild(lower.node);

    const upperVector = sub(def.knee, def.hip);
    const lowerVector = sub(def.foot, def.knee);
    return {
      def,
      upper,
      lower,
      upperLength: length(upperVector),
      lowerLength: length(lowerVector),
      bindUpper: Math.atan2(upperVector.y, upperVector.x),
      bindLower: Math.atan2(lowerVector.y, lowerVector.x),
      bendSign: def.id.includes('hind') ? -1 : 1,
      solved: null,
    };
  }

  createDust() {
    for (let i = 0; i < 18; i += 1) {
      const g = new PIXI.Graphics()
        .circle(0, 0, 5 + (i % 5) * 2.7)
        .fill({ color: 0xb78654, alpha: 0.06 });
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
  setDebugRig(enabled) { this.debugRig = enabled; this.debugLayer.visible = enabled; }
  setHeroFocus(enabled) { this.heroFocus = enabled; this.applyLook(); }
  setDustEnabled(enabled) { this.dustEnabled = enabled; this.dustBack.visible = enabled; this.dustFront.visible = enabled; }

  applyLook() {
    const tint = this.heroFocus ? 0xffe1c8 : 0xffd4b2;
    for (const sprite of this.paintedSprites) sprite.tint = tint;
  }

  layout(screenWidth, screenHeight) {
    const baseWidth = screenWidth * 0.355 * this.actorScale;
    const scale = baseWidth / ART_W;
    this.root.scale.set(scale);
    this.root.x = screenWidth * 0.59;
    this.root.y = screenHeight * 0.775;
  }

  resetPose() { this.updatePose(0); }

  updatePose(phase) {
    if (!this.texture) return;
    this.phase = phase;
    this.poseVersion += 1;
    const strength = this.motionStrength;

    const bodyBob = Math.sin(phase * 2) * 5.2 * strength;
    const bodyRock = Math.sin(phase) * 0.014 * strength;
    const bodySway = Math.sin(phase * 0.5) * 2.4 * strength;
    this.bodyGroup.position.set(bodySway, bodyBob);
    this.bodyGroup.rotation = bodyRock;

    this.currentToePositions = {};
    for (const leg of this.legs) this.updateLeg(leg, phase + leg.def.phase, strength);
    if (this.debugRig) this.drawRig();
  }

  updateLeg(leg, phase, strength) {
    const def = leg.def;
    const stride = 38 * strength;
    const lift = 33 * strength;
    const cycleSin = Math.sin(phase);
    const cycleCos = Math.cos(phase);
    const swing = Math.max(0, cycleSin);

    // During stance the hoof tracks backward against the moving body; during
    // swing it lifts and advances. This creates a readable foot plant even when
    // the actor root is held perfectly still.
    const target = point(
      def.foot.x + cycleCos * stride,
      GROUND_Y + (def.foot.y - GROUND_Y) * 0.18 - swing * lift,
    );

    // Keep the far pair a touch quieter so the foreground animal retains a
    // readable silhouette, similar to layered illustrated character animation.
    if (def.far) {
      target.x = lerp(def.foot.x, target.x, 0.86);
      target.y = lerp(def.foot.y, target.y, 0.86);
    }

    const solved = solveTwoBone(def.hip, target, leg.upperLength, leg.lowerLength, leg.bendSign);
    leg.solved = solved;

    leg.upper.node.rotation = solved.upperWorld - leg.bindUpper;
    const desiredRelative = solved.lowerWorld - solved.upperWorld;
    const bindRelative = leg.bindLower - leg.bindUpper;
    leg.lower.node.rotation = desiredRelative - bindRelative;

    this.currentToePositions[def.id] = point(solved.target.x, solved.target.y);
  }

  updateContinuous(deltaSeconds, phase) {
    if (!this.ready) return;
    const strength = this.motionStrength;
    for (const puff of this.dustPuffs) {
      puff.age += deltaSeconds * (0.28 + strength * 0.12);
      if (puff.age >= 1) puff.age -= 1;
      const t = puff.age;
      const footIndex = Math.floor(puff.seed * 10) % LEG_DEFS.length;
      const foot = this.currentToePositions[LEG_DEFS[footIndex].id] || LEG_DEFS[footIndex].foot;
      puff.node.x = foot.x - t * (38 + (puff.seed % 1) * 24);
      puff.node.y = GROUND_Y - t * (7 + (puff.seed % 1) * 7);
      const fade = Math.sin(Math.PI * t);
      puff.node.alpha = this.dustEnabled ? fade * 0.055 * strength : 0;
      puff.node.scale.set(0.35 + t * 0.75);
    }

    if (this.debugRig) this.drawRig();
  }

  drawRig() {
    const g = this.debugLayer;
    g.clear();
    for (const leg of this.legs) {
      if (!leg.solved) continue;
      const { hip } = leg.def;
      const { knee, target } = leg.solved;
      g.moveTo(hip.x, hip.y).lineTo(knee.x, knee.y).lineTo(target.x, target.y)
        .stroke({ width: leg.def.far ? 3 : 4, color: leg.def.far ? 0x8ad7ff : 0xffd474, alpha: 0.94 });
      for (const p of [hip, knee, target]) {
        g.circle(p.x, p.y, 5).fill({ color: 0xfff0b7, alpha: 0.96 });
      }
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
