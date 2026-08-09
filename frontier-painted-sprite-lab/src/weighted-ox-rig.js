const PIXI = window.PIXI;

const ASSET_URL = './assets/rosa-bonheur-pair-of-oxen.webp';
const ART_W = 800;
const ART_H = 538;
const GRID_COLS = 17;
const GRID_ROWS = 11;

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

function rotationDelta(x, y, pivotX, pivotY, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const localX = x - pivotX;
  const localY = y - pivotY;
  const rx = pivotX + localX * cos - localY * sin;
  const ry = pivotY + localX * sin + localY * cos;
  return { dx: rx - x, dy: ry - y };
}

function bonePoint(u, v) {
  return { x: u * ART_W, y: v * ART_H };
}

class WeightedOxSprite {
  constructor({ phaseOffset = 0, depthBias = 0 } = {}) {
    this.phaseOffset = phaseOffset;
    this.depthBias = depthBias;
    this.root = new PIXI.Container();
    this.mesh = null;
    this.shadow = null;
    this.debugLayer = new PIXI.Graphics();
    this.baseVertices = null;
    this.poseVersion = 0;
    this.motionStrength = 0.55;
    this.sceneDepth = 0.42;
    this.debugSkeleton = false;
    this.colorMatch = true;
    this.atmosphere = true;
    this.shadowEnabled = true;
    this.noiseFilter = new PIXI.NoiseFilter({ noise: 0.016, seed: 0.41 + depthBias * 0.7 });
    this.shadowBlur = new PIXI.BlurFilter({ strength: 5, quality: 2 });
    this.lastPhase = 0;
    this.lastBonePose = null;
  }

  async init(texture) {
    const grid = buildGrid(GRID_COLS, GRID_ROWS, ART_W, ART_H);
    this.baseVertices = new Float32Array(grid.vertices);
    this.mesh = new PIXI.MeshSimple({
      texture,
      vertices: new Float32Array(grid.vertices),
      uvs: grid.uvs,
      indices: grid.indices,
    });
    this.mesh.autoUpdate = true;
    this.mesh.filters = [this.noiseFilter];

    this.shadow = new PIXI.Graphics()
      .ellipse(ART_W * 0.53, ART_H * 0.84, ART_W * 0.34, ART_H * 0.035)
      .fill({ color: 0x352116, alpha: 0.21 });
    this.shadow.filters = [this.shadowBlur];

    this.root.addChild(this.shadow, this.mesh, this.debugLayer);
    this.root.pivot.set(ART_W * 0.50, ART_H * 0.79);
    this.applyIntegration();
    return this;
  }

  setMotionStrength(value) {
    this.motionStrength = clamp01(value);
  }

  setDepth(value) {
    this.sceneDepth = clamp01(value);
    this.applyIntegration();
  }

  setDebugSkeleton(enabled) {
    this.debugSkeleton = enabled;
    this.debugLayer.visible = enabled;
    if (enabled) this.drawSkeleton();
  }

  setIntegration({ colorMatch, atmosphere, shadow } = {}) {
    if (typeof colorMatch === 'boolean') this.colorMatch = colorMatch;
    if (typeof atmosphere === 'boolean') this.atmosphere = atmosphere;
    if (typeof shadow === 'boolean') this.shadowEnabled = shadow;
    this.applyIntegration();
  }

  applyIntegration() {
    if (!this.mesh) return;
    const depth = clamp01(this.sceneDepth + this.depthBias);
    const haze = this.atmosphere ? depth : 0;
    this.mesh.alpha = 1 - haze * 0.13;
    this.mesh.tint = this.colorMatch ? 0xffdbbf : 0xffffff;
    this.noiseFilter.noise = this.colorMatch ? 0.016 : 0.004;
    this.shadow.visible = this.shadowEnabled;
    this.shadow.alpha = this.shadowEnabled ? 0.70 * (1 - depth * 0.34) : 0;
  }

  updatePose(teamPhase) {
    if (!this.mesh) return;
    const phase = teamPhase + this.phaseOffset;
    this.lastPhase = phase;
    this.poseVersion += 1;

    const vertices = this.mesh.vertices;
    const strength = this.motionStrength;
    const stride = Math.sin(phase);
    const rearStride = Math.sin(phase + Math.PI * 0.94);
    const bodyBob = Math.sin(phase * 2) * 2.0 * strength;
    const bodySway = Math.sin(phase) * 1.1 * strength;
    const breath = Math.sin(phase * 0.47 + 0.7) * 1.25 * strength;
    const headAngle = (Math.sin(phase * 0.52 + 0.4) * 0.023 - 0.006) * strength;
    const neckAngle = Math.sin(phase * 0.56 + 0.7) * 0.016 * strength;
    const foreAngle = stride * 0.060 * strength;
    const hindAngle = rearStride * 0.054 * strength;

    const headPivot = bonePoint(0.27, 0.44);
    const neckPivot = bonePoint(0.35, 0.46);
    const forePivot = bonePoint(0.40, 0.59);
    const hindPivot = bonePoint(0.78, 0.57);

    for (let i = 0; i < vertices.length; i += 2) {
      const baseX = this.baseVertices[i];
      const baseY = this.baseVertices[i + 1];
      const u = baseX / ART_W;
      const v = baseY / ART_H;
      let dx = 0;
      let dy = 0;

      const torso = smoothstep(0.20, 0.36, u) * (1 - smoothstep(0.84, 0.97, u)) *
        smoothstep(0.15, 0.30, v) * (1 - smoothstep(0.64, 0.78, v));
      dx += bodySway * torso;
      dy += (bodyBob - breath * torso) * torso;

      const headWeight = (1 - smoothstep(0.21, 0.37, u)) * smoothstep(0.16, 0.32, v) *
        (1 - smoothstep(0.64, 0.78, v));
      const neckWeight = bell(0.33, 0.17, u) * smoothstep(0.22, 0.38, v) *
        (1 - smoothstep(0.66, 0.80, v));
      const headDelta = rotationDelta(baseX, baseY, headPivot.x, headPivot.y, headAngle);
      const neckDelta = rotationDelta(baseX, baseY, neckPivot.x, neckPivot.y, neckAngle);
      dx += headDelta.dx * headWeight + neckDelta.dx * neckWeight * 0.65;
      dy += headDelta.dy * headWeight + neckDelta.dy * neckWeight * 0.65;

      const lowerBody = smoothstep(0.53, 0.92, v);
      const foreWeight = bell(0.40, 0.15, u) * lowerBody;
      const hindWeight = bell(0.79, 0.15, u) * lowerBody;
      const foreDelta = rotationDelta(baseX, baseY, forePivot.x, forePivot.y, foreAngle);
      const hindDelta = rotationDelta(baseX, baseY, hindPivot.x, hindPivot.y, hindAngle);

      // A simple planted-hoof approximation: lower vertices receive less horizontal
      // rotation during the stance half of the gait, preserving contact with the ground.
      const hoofBand = smoothstep(0.77, 0.94, v);
      const foreStance = stride < 0 ? 1 : 0;
      const hindStance = rearStride < 0 ? 1 : 0;
      const forePlant = 1 - hoofBand * foreStance * 0.68;
      const hindPlant = 1 - hoofBand * hindStance * 0.68;

      dx += foreDelta.dx * foreWeight * forePlant;
      dy += foreDelta.dy * foreWeight * (0.88 + hoofBand * 0.12);
      dx += hindDelta.dx * hindWeight * hindPlant;
      dy += hindDelta.dy * hindWeight * (0.88 + hoofBand * 0.12);

      // Shoulder/hip compression adds perceived weight without replacing painted pixels.
      const shoulder = bell(0.40, 0.17, u) * smoothstep(0.33, 0.70, v);
      const hip = bell(0.78, 0.17, u) * smoothstep(0.31, 0.69, v);
      dy += Math.max(0, stride) * 1.8 * strength * shoulder;
      dy += Math.max(0, rearStride) * 1.5 * strength * hip;

      vertices[i] = baseX + dx;
      vertices[i + 1] = baseY + dy;
    }

    this.lastBonePose = {
      head: { ...headPivot, angle: headAngle },
      neck: { ...neckPivot, angle: neckAngle },
      fore: { ...forePivot, angle: foreAngle },
      hind: { ...hindPivot, angle: hindAngle },
      stride,
      rearStride,
    };

    if (this.debugSkeleton) this.drawSkeleton();
  }

  drawSkeleton() {
    if (!this.debugSkeleton || !this.lastBonePose) return;
    const g = this.debugLayer;
    const pose = this.lastBonePose;
    g.clear();

    const spineA = bonePoint(0.31, 0.47);
    const spineB = bonePoint(0.76, 0.48);
    const head = bonePoint(0.16, 0.43);
    const foreFoot = bonePoint(0.42, 0.88);
    const hindFoot = bonePoint(0.81, 0.88);

    g.moveTo(head.x, head.y).lineTo(pose.neck.x, pose.neck.y)
      .lineTo(spineA.x, spineA.y).lineTo(spineB.x, spineB.y)
      .stroke({ width: 4, color: 0x77d7ff, alpha: 0.92 });
    g.moveTo(pose.fore.x, pose.fore.y).lineTo(foreFoot.x, foreFoot.y)
      .stroke({ width: 4, color: 0xffcf66, alpha: 0.92 });
    g.moveTo(pose.hind.x, pose.hind.y).lineTo(hindFoot.x, hindFoot.y)
      .stroke({ width: 4, color: 0xffcf66, alpha: 0.92 });

    for (const point of [head, pose.neck, spineA, spineB, pose.fore, pose.hind, foreFoot, hindFoot]) {
      g.circle(point.x, point.y, 6).fill({ color: 0xfff1bd, alpha: 0.95 });
    }
  }
}

export class WeightedOxTeamRig {
  constructor() {
    this.root = new PIXI.Container();
    this.backOx = new WeightedOxSprite({ phaseOffset: 0.62, depthBias: 0.09 });
    this.frontOx = new WeightedOxSprite({ phaseOffset: 0, depthBias: 0 });
    this.teamShadow = new PIXI.Graphics();
    this.dustLayer = new PIXI.Container();
    this.dust = [];
    this.ready = false;
    this.poseVersion = 0;
    this.motionStrength = 0.55;
    this.depth = 0.42;
    this.phaseOffset = 0.62;
    this.debugSkeleton = false;
    this.colorMatch = true;
    this.atmosphere = true;
    this.shadowEnabled = true;
    this.dustEnabled = true;
    this.dustBlur = new PIXI.BlurFilter({ strength: 2.4, quality: 2 });
    this.shadowBlur = new PIXI.BlurFilter({ strength: 7, quality: 2 });
  }

  async init() {
    const texture = await PIXI.Assets.load(ASSET_URL);
    await this.backOx.init(texture);
    await this.frontOx.init(texture);

    this.teamShadow
      .ellipse(430, 440, 310, 32)
      .fill({ color: 0x2f1e15, alpha: 0.18 });
    this.teamShadow.filters = [this.shadowBlur];
    this.dustLayer.filters = [this.dustBlur];
    this.createDust();

    this.backOx.root.position.set(-72, -42);
    this.backOx.root.scale.set(0.92);
    this.frontOx.root.position.set(62, 34);

    this.root.addChild(this.teamShadow, this.backOx.root, this.frontOx.root, this.dustLayer);
    this.root.pivot.set(410, 425);
    this.setMotionStrength(this.motionStrength);
    this.setDepth(this.depth);
    this.setIntegration({ colorMatch: true, atmosphere: true, shadow: true, dust: true });
    this.ready = true;
    return this;
  }

  createDust() {
    for (let i = 0; i < 18; i += 1) {
      const puff = new PIXI.Graphics()
        .circle(0, 0, 8 + (i % 4) * 4)
        .fill({ color: 0xb88450, alpha: 0.055 + (i % 3) * 0.012 });
      puff.x = 180 + (i % 9) * 55;
      puff.y = 438 + (i % 3) * 5;
      this.dustLayer.addChild(puff);
      this.dust.push({ node: puff, seed: i * 0.71, age: (i % 7) / 7 });
    }
  }

  setMotionStrength(value) {
    this.motionStrength = clamp01(value);
    this.frontOx.setMotionStrength(this.motionStrength);
    this.backOx.setMotionStrength(this.motionStrength * 0.93);
  }

  setPhaseOffset(radians) {
    this.phaseOffset = radians;
    this.backOx.phaseOffset = radians;
  }

  setDepth(value) {
    this.depth = clamp01(value);
    this.frontOx.setDepth(this.depth);
    this.backOx.setDepth(this.depth);
  }

  setDebugSkeleton(enabled) {
    this.debugSkeleton = enabled;
    this.frontOx.setDebugSkeleton(enabled);
    this.backOx.setDebugSkeleton(enabled);
  }

  setIntegration({ colorMatch, atmosphere, shadow, dust } = {}) {
    if (typeof colorMatch === 'boolean') this.colorMatch = colorMatch;
    if (typeof atmosphere === 'boolean') this.atmosphere = atmosphere;
    if (typeof shadow === 'boolean') this.shadowEnabled = shadow;
    if (typeof dust === 'boolean') this.dustEnabled = dust;
    this.frontOx.setIntegration({ colorMatch: this.colorMatch, atmosphere: this.atmosphere, shadow: this.shadowEnabled });
    this.backOx.setIntegration({ colorMatch: this.colorMatch, atmosphere: this.atmosphere, shadow: this.shadowEnabled });
    this.teamShadow.visible = this.shadowEnabled;
    this.dustLayer.visible = this.dustEnabled;
  }

  layout(screenWidth, screenHeight) {
    const targetWidth = screenWidth * (0.44 - this.depth * 0.07);
    const scale = targetWidth / 930;
    this.root.scale.set(scale);
    this.root.x = screenWidth * (0.57 - this.depth * 0.015);
    this.root.y = screenHeight * (0.80 - this.depth * 0.055);
  }

  resetPose() {
    this.updatePose(0);
  }

  updatePose(phase) {
    if (!this.ready) return;
    this.poseVersion += 1;
    this.frontOx.updatePose(phase);
    this.backOx.updatePose(phase);

    const strength = this.motionStrength;
    this.frontOx.root.y = 34 + Math.sin(phase * 2) * 1.7 * strength;
    this.backOx.root.y = -42 + Math.sin((phase + this.phaseOffset) * 2) * 1.5 * strength;
  }

  updateContinuous(deltaSeconds, phase) {
    if (!this.ready) return;
    this.teamShadow.scale.x = 1 + Math.sin(phase * 2) * 0.010 * this.motionStrength;
    this.teamShadow.alpha = this.shadowEnabled ? 0.68 * (1 - this.depth * 0.30) : 0;

    for (const puff of this.dust) {
      puff.age += deltaSeconds * (0.16 + this.motionStrength * 0.08);
      if (puff.age > 1) puff.age -= 1;
      const t = puff.age;
      puff.node.x += deltaSeconds * (7 + puff.seed * 0.4);
      if (puff.node.x > 720) puff.node.x = 175;
      puff.node.y = 442 - t * 13 + Math.sin(phase + puff.seed) * 2.0;
      const scale = 0.45 + t * 0.55;
      puff.node.scale.set(scale);
      puff.node.alpha = this.dustEnabled ? Math.sin(Math.PI * t) * 0.07 : 0;
    }
  }

  getDebugState() {
    return {
      poseVersion: this.poseVersion,
      phaseOffset: this.phaseOffset,
      frontPhase: this.frontOx.lastPhase,
      backPhase: this.backOx.lastPhase,
      frontVertices: this.frontOx.mesh ? Array.from(this.frontOx.mesh.vertices) : [],
      backVertices: this.backOx.mesh ? Array.from(this.backOx.mesh.vertices) : [],
      debugSkeleton: this.debugSkeleton,
    };
  }
}
