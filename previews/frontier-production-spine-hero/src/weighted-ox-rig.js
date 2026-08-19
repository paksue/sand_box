const PIXI = window.PIXI;

const ASSET_URL = './assets/rosa-bonheur-pair-of-oxen.webp';
const ART_W = 800;
const ART_H = 538;
const GRID_COLS = 19;
const GRID_ROWS = 13;

const clamp01 = (value) => Math.max(0, Math.min(1, value));

function smoothstep(edge0, edge1, value) {
  const x = clamp01((value - edge0) / Math.max(0.0001, edge1 - edge0));
  return x * x * (3 - 2 * x);
}

function bell(center, radius, value) {
  const x = Math.abs(value - center) / radius;
  return x >= 1 ? 0 : 1 - smoothstep(0, 1, x);
}

function buildGrid(cols, rows, width, height) {
  const vertices = new Float32Array(cols * rows * 2);
  const uvs = new Float32Array(cols * rows * 2);
  const indices = [];
  let cursor = 0;

  for (let row = 0; row < rows; row += 1) {
    const v = row / (rows - 1);
    for (let col = 0; col < cols; col += 1) {
      const u = col / (cols - 1);
      vertices[cursor] = u * width;
      vertices[cursor + 1] = v * height;
      uvs[cursor] = u;
      uvs[cursor + 1] = v;
      cursor += 2;
    }
  }

  for (let row = 0; row < rows - 1; row += 1) {
    for (let col = 0; col < cols - 1; col += 1) {
      const a = row * cols + col;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }

  return { vertices, uvs, indices: new Uint32Array(indices) };
}

function rotateDelta(x, y, pivotX, pivotY, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const localX = x - pivotX;
  const localY = y - pivotY;
  const rx = pivotX + localX * cos - localY * sin;
  const ry = pivotY + localX * sin + localY * cos;
  return { dx: rx - x, dy: ry - y };
}

function rotatePointAround(source, pivot, angle) {
  const delta = rotateDelta(source.x, source.y, pivot.x, pivot.y, angle);
  return { x: source.x + delta.dx, y: source.y + delta.dy };
}

function point(u, v) {
  return { x: u * ART_W, y: v * ART_H };
}

/**
 * Open implementation of the deformation architecture we would author in
 * Spine Professional. The visible object is still ONE pre-matted raster image
 * containing Rosa Bonheur's two overlapping oxen. Multiple virtual bones
 * influence regions of a dense mesh, but no vector/3D replacement art is used.
 *
 * This is deliberately honest about the source limitation: because one ox is
 * partially occluded by the other in the painting, this asset cannot become two
 * fully independent skeletal characters. That requires purpose-painted layers.
 */
export class WeightedPaintedPairRig {
  constructor() {
    this.root = new PIXI.Container();
    this.mesh = null;
    this.shadow = null;
    this.debugLayer = new PIXI.Graphics();
    this.dustLayer = new PIXI.Container();
    this.baseVertices = null;
    this.poseVersion = 0;
    this.motionStrength = 0.72;
    this.depth = 0.42;
    this.debugSkeleton = false;
    this.colorMatch = true;
    this.atmosphere = true;
    this.shadowEnabled = true;
    this.dustEnabled = true;
    this.ready = false;
    this.lastPose = null;
    this.dust = [];
    this.noiseFilter = new PIXI.NoiseFilter({ noise: 0.016, seed: 0.47 });
    this.shadowBlur = new PIXI.BlurFilter({ strength: 5.5, quality: 2 });
    this.dustBlur = new PIXI.BlurFilter({ strength: 2.4, quality: 2 });
  }

  async init() {
    const texture = await PIXI.Assets.load(ASSET_URL);
    const grid = buildGrid(GRID_COLS, GRID_ROWS, ART_W, ART_H);
    this.baseVertices = new Float32Array(grid.vertices);
    this.mesh = new PIXI.MeshSimple({
      texture,
      vertices: new Float32Array(grid.vertices),
      uvs: grid.uvs,
      indices: grid.indices,
    });
    // PixiJS 8 MeshSimple supports dynamic vertices with autoUpdate enabled.
    // The official docs explicitly call this out for per-frame geometry changes.
    this.mesh.autoUpdate = true;
    this.mesh.filters = [this.noiseFilter];

    this.shadow = new PIXI.Graphics()
      .ellipse(ART_W * 0.52, ART_H * 0.84, ART_W * 0.36, ART_H * 0.038)
      .fill({ color: 0x352116, alpha: 0.23 });
    this.shadow.filters = [this.shadowBlur];

    this.dustLayer.filters = [this.dustBlur];
    this.createDust();
    this.root.addChild(this.shadow, this.mesh, this.dustLayer, this.debugLayer);
    this.root.pivot.set(ART_W * 0.50, ART_H * 0.79);
    this.applyIntegration();
    this.updatePose(0);
    this.ready = true;
    return this;
  }

  createDust() {
    for (let i = 0; i < 13; i += 1) {
      const puff = new PIXI.Graphics()
        .circle(0, 0, 7 + (i % 4) * 3.5)
        .fill({ color: 0xb88450, alpha: 0.05 + (i % 3) * 0.012 });
      puff.x = ART_W * (0.28 + (i % 8) * 0.065);
      puff.y = ART_H * (0.81 + (i % 3) * 0.012);
      this.dustLayer.addChild(puff);
      this.dust.push({ node: puff, seed: i * 0.73, age: (i % 7) / 7 });
    }
  }

  setMotionStrength(value) {
    this.motionStrength = clamp01(value);
  }

  setDepth(value) {
    this.depth = clamp01(value);
    this.applyIntegration();
  }

  setIntegration({ colorMatch, atmosphere, shadow, dust } = {}) {
    if (typeof colorMatch === 'boolean') this.colorMatch = colorMatch;
    if (typeof atmosphere === 'boolean') this.atmosphere = atmosphere;
    if (typeof shadow === 'boolean') this.shadowEnabled = shadow;
    if (typeof dust === 'boolean') this.dustEnabled = dust;
    this.applyIntegration();
  }

  applyIntegration() {
    if (!this.mesh) return;
    const haze = this.atmosphere ? this.depth : 0;
    this.mesh.alpha = 1 - haze * 0.14;
    this.mesh.tint = this.colorMatch ? 0xffdbbf : 0xffffff;
    this.noiseFilter.noise = this.colorMatch ? 0.016 : 0.004;
    this.shadow.visible = this.shadowEnabled;
    this.shadow.alpha = this.shadowEnabled ? 0.72 * (1 - this.depth * 0.33) : 0;
    this.dustLayer.visible = this.dustEnabled;
    this.dustLayer.alpha = 1 - haze * 0.22;
  }

  setDebugSkeleton(enabled) {
    this.debugSkeleton = enabled;
    this.debugLayer.visible = enabled;
    if (enabled) this.drawSkeleton();
  }

  layout(screenWidth, screenHeight) {
    const targetWidth = screenWidth * (0.32 - this.depth * 0.025);
    const scale = targetWidth / ART_W;
    this.root.scale.set(scale);
    this.root.x = screenWidth * (0.61 - this.depth * 0.008);
    this.root.y = screenHeight * (0.815 - this.depth * 0.010);
  }

  resetPose() {
    this.updatePose(0);
  }

  updatePose(phase) {
    if (!this.mesh) return;
    this.poseVersion += 1;
    const vertices = this.mesh.vertices;
    const strength = this.motionStrength;

    // Deliberately readable draft-animal motion. The prior experiment used
    // physically tiny values that mostly became sub-pixel after scene scaling,
    // so CI could measure changes that a human could not see. These values stay
    // restrained enough to preserve the painting while creating visible gait.
    const foreStride = Math.sin(phase);
    const hindStride = Math.sin(phase + Math.PI * 0.92);
    const bodyBob = Math.sin(phase * 2) * 4.8 * strength;
    const bodySway = Math.sin(phase) * 2.6 * strength;
    const breath = Math.sin(phase * 0.46 + 0.8) * 1.5 * strength;

    const headFrontAngle = (Math.sin(phase * 0.53 + 0.25) * 0.052 - 0.010) * strength;
    const headRearAngle = (Math.sin(phase * 0.49 + 1.05) * 0.038 + 0.005) * strength;
    const neckAngle = Math.sin(phase * 0.56 + 0.65) * 0.032 * strength;
    const foreAngle = foreStride * 0.115 * strength;
    const hindAngle = hindStride * 0.102 * strength;
    const foreLift = Math.max(0, foreStride) * 9.0 * strength;
    const hindLift = Math.max(0, hindStride) * 8.0 * strength;

    const headFrontPivot = point(0.20, 0.43);
    const headRearPivot = point(0.29, 0.40);
    const neckPivot = point(0.35, 0.47);
    const forePivot = point(0.40, 0.59);
    const hindPivot = point(0.78, 0.58);

    for (let i = 0; i < vertices.length; i += 2) {
      const baseX = this.baseVertices[i];
      const baseY = this.baseVertices[i + 1];
      const u = baseX / ART_W;
      const v = baseY / ART_H;
      let dx = 0;
      let dy = 0;

      const torso = smoothstep(0.22, 0.36, u) * (1 - smoothstep(0.84, 0.97, u)) *
        smoothstep(0.14, 0.29, v) * (1 - smoothstep(0.65, 0.78, v));
      dx += bodySway * torso;
      dy += bodyBob * torso - breath * torso;

      // Two overlapping painted heads are given different virtual bone fields.
      const frontHeadWeight = bell(0.17, 0.17, u) * smoothstep(0.16, 0.30, v) *
        (1 - smoothstep(0.65, 0.78, v));
      const rearHeadWeight = bell(0.29, 0.15, u) * smoothstep(0.12, 0.29, v) *
        (1 - smoothstep(0.60, 0.74, v));
      const neckWeight = bell(0.35, 0.18, u) * smoothstep(0.22, 0.36, v) *
        (1 - smoothstep(0.67, 0.81, v));
      const frontHeadDelta = rotateDelta(baseX, baseY, headFrontPivot.x, headFrontPivot.y, headFrontAngle);
      const rearHeadDelta = rotateDelta(baseX, baseY, headRearPivot.x, headRearPivot.y, headRearAngle);
      const neckDelta = rotateDelta(baseX, baseY, neckPivot.x, neckPivot.y, neckAngle);
      dx += frontHeadDelta.dx * frontHeadWeight + rearHeadDelta.dx * rearHeadWeight * 0.62 + neckDelta.dx * neckWeight * 0.62;
      dy += frontHeadDelta.dy * frontHeadWeight + rearHeadDelta.dy * rearHeadWeight * 0.62 + neckDelta.dy * neckWeight * 0.62;

      // Weighted leg regions are spatially broad because this historical source
      // is flattened. This tests weighted deformation; final production art will
      // split each leg into overlapping painted attachments before Spine rigging.
      const lowerBody = smoothstep(0.52, 0.94, v);
      const foreWeight = bell(0.40, 0.17, u) * lowerBody;
      const hindWeight = bell(0.79, 0.17, u) * lowerBody;
      const foreDelta = rotateDelta(baseX, baseY, forePivot.x, forePivot.y, foreAngle);
      const hindDelta = rotateDelta(baseX, baseY, hindPivot.x, hindPivot.y, hindAngle);

      const hoofBand = smoothstep(0.76, 0.94, v);
      const foreStance = foreStride < 0 ? 1 : 0;
      const hindStance = hindStride < 0 ? 1 : 0;
      const forePlant = 1 - hoofBand * foreStance * 0.78;
      const hindPlant = 1 - hoofBand * hindStance * 0.78;
      dx += foreDelta.dx * foreWeight * forePlant;
      dy += foreDelta.dy * foreWeight * (0.84 + hoofBand * 0.16) - foreLift * foreWeight * hoofBand;
      dx += hindDelta.dx * hindWeight * hindPlant;
      dy += hindDelta.dy * hindWeight * (0.84 + hoofBand * 0.16) - hindLift * hindWeight * hoofBand;

      const shoulder = bell(0.40, 0.18, u) * smoothstep(0.32, 0.70, v);
      const hip = bell(0.79, 0.18, u) * smoothstep(0.31, 0.69, v);
      dy += Math.max(0, foreStride) * 3.8 * strength * shoulder;
      dy += Math.max(0, hindStride) * 3.2 * strength * hip;

      vertices[i] = baseX + dx;
      vertices[i + 1] = baseY + dy;
    }

    this.lastPose = {
      frontHead: { ...headFrontPivot, angle: headFrontAngle },
      rearHead: { ...headRearPivot, angle: headRearAngle },
      neck: { ...neckPivot, angle: neckAngle },
      fore: { ...forePivot, angle: foreAngle },
      hind: { ...hindPivot, angle: hindAngle },
      foreStride,
      hindStride,
      foreLift,
      hindLift,
    };

    if (this.debugSkeleton) this.drawSkeleton();
  }

  getAnimatedSkeletonPoints() {
    if (!this.lastPose) return null;
    const pose = this.lastPose;
    const spineA = point(0.34, 0.48);
    const spineB = point(0.77, 0.49);
    const frontMuzzleBase = point(0.08, 0.48);
    const rearMuzzleBase = point(0.17, 0.39);
    const foreFootBase = point(0.42, 0.89);
    const hindFootBase = point(0.82, 0.89);

    const frontMuzzle = rotatePointAround(frontMuzzleBase, pose.frontHead, pose.frontHead.angle);
    const rearMuzzle = rotatePointAround(rearMuzzleBase, pose.rearHead, pose.rearHead.angle);
    const foreFoot = rotatePointAround(foreFootBase, pose.fore, pose.fore.angle);
    const hindFoot = rotatePointAround(hindFootBase, pose.hind, pose.hind.angle);
    foreFoot.y -= pose.foreLift;
    hindFoot.y -= pose.hindLift;

    return {
      spineA,
      spineB,
      frontMuzzle,
      rearMuzzle,
      foreFoot,
      hindFoot,
      foreFootBase,
      hindFootBase,
    };
  }

  drawSkeleton() {
    if (!this.debugSkeleton || !this.lastPose) return;
    const g = this.debugLayer;
    const pose = this.lastPose;
    const p = this.getAnimatedSkeletonPoints();

    g.clear();

    // Faint planted-hoof targets make stance vs swing readable in debug view.
    g.moveTo(p.foreFootBase.x - 10, p.foreFootBase.y).lineTo(p.foreFootBase.x + 10, p.foreFootBase.y)
      .stroke({ width: 2, color: 0xffcf66, alpha: 0.28 });
    g.moveTo(p.hindFootBase.x - 10, p.hindFootBase.y).lineTo(p.hindFootBase.x + 10, p.hindFootBase.y)
      .stroke({ width: 2, color: 0xffcf66, alpha: 0.28 });

    g.moveTo(p.frontMuzzle.x, p.frontMuzzle.y).lineTo(pose.frontHead.x, pose.frontHead.y)
      .lineTo(pose.neck.x, pose.neck.y).lineTo(p.spineA.x, p.spineA.y).lineTo(p.spineB.x, p.spineB.y)
      .stroke({ width: 4, color: 0x77d7ff, alpha: 0.93 });
    g.moveTo(p.rearMuzzle.x, p.rearMuzzle.y).lineTo(pose.rearHead.x, pose.rearHead.y)
      .lineTo(pose.neck.x, pose.neck.y)
      .stroke({ width: 3.4, color: 0x9ae2ff, alpha: 0.87 });
    g.moveTo(pose.fore.x, pose.fore.y).lineTo(p.foreFoot.x, p.foreFoot.y)
      .stroke({ width: 4, color: 0xffcf66, alpha: 0.93 });
    g.moveTo(pose.hind.x, pose.hind.y).lineTo(p.hindFoot.x, p.hindFoot.y)
      .stroke({ width: 4, color: 0xffcf66, alpha: 0.93 });

    for (const node of [p.frontMuzzle, p.rearMuzzle, pose.frontHead, pose.rearHead, pose.neck, p.spineA, p.spineB, pose.fore, pose.hind, p.foreFoot, p.hindFoot]) {
      g.circle(node.x, node.y, 5.5).fill({ color: 0xfff1bd, alpha: 0.95 });
    }
  }

  updateContinuous(deltaSeconds, phase) {
    if (!this.mesh) return;
    this.shadow.scale.x = 1 + Math.sin(phase * 2) * 0.022 * this.motionStrength;
    this.shadow.scale.y = 1 - Math.sin(phase * 2) * 0.010 * this.motionStrength;
    this.shadow.alpha = this.shadowEnabled ? 0.72 * (1 - this.depth * 0.33) : 0;

    for (const puff of this.dust) {
      puff.age += deltaSeconds * (0.18 + this.motionStrength * 0.11);
      if (puff.age > 1) puff.age -= 1;
      const t = puff.age;
      puff.node.x += deltaSeconds * (8.0 + puff.seed * 0.42);
      if (puff.node.x > ART_W * 0.84) puff.node.x = ART_W * 0.27;
      puff.node.y = ART_H * (0.815 - t * 0.032) + Math.sin(phase + puff.seed) * 2.4;
      const scale = 0.43 + t * 0.58;
      puff.node.scale.set(scale);
      puff.node.alpha = this.dustEnabled ? Math.sin(Math.PI * t) * 0.085 : 0;
    }
  }

  getDebugState() {
    return {
      poseVersion: this.poseVersion,
      vertices: this.mesh ? Array.from(this.mesh.vertices) : [],
      debugSkeleton: this.debugSkeleton,
      grid: [GRID_COLS, GRID_ROWS],
      skeletonPoints: this.getAnimatedSkeletonPoints(),
      motionStrength: this.motionStrength,
    };
  }
}
