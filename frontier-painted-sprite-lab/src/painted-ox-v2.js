const PIXI = window.PIXI;

const ASSET_URL = './assets/rosa-bonheur-pair-of-oxen.webp';
const ART_W = 800;
const ART_H = 538;
const GRID_COLS = 11;
const GRID_ROWS = 7;

const clamp01 = (value) => Math.max(0, Math.min(1, value));

function smoothstep(edge0, edge1, value) {
  const x = clamp01((value - edge0) / (edge1 - edge0));
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

export class PaintedOx {
  constructor() {
    this.root = new PIXI.Container();
    this.mesh = null;
    this.shadow = null;
    this.dustLayer = new PIXI.Container();
    this.debugLayer = new PIXI.Graphics();
    this.baseVertices = null;
    this.motionStrength = 0.48;
    this.depth = 0.46;
    this.colorMatch = true;
    this.atmosphere = true;
    this.shadowEnabled = true;
    this.dustEnabled = true;
    this.meshDebug = false;
    this.poseVersion = 0;
    this.dust = [];
    this.noiseFilter = new PIXI.NoiseFilter({ noise: 0.018, seed: 0.63 });
    this.dustBlur = new PIXI.BlurFilter({ strength: 2.5, quality: 2 });
    this.shadowBlur = new PIXI.BlurFilter({ strength: 5, quality: 2 });
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
    this.mesh.autoUpdate = true;
    this.mesh.filters = [this.noiseFilter];

    this.shadow = new PIXI.Graphics()
      .ellipse(ART_W * 0.52, ART_H * 0.83, ART_W * 0.38, ART_H * 0.04)
      .fill({ color: 0x352116, alpha: 0.24 });
    this.shadow.filters = [this.shadowBlur];

    this.root.addChild(this.shadow, this.mesh, this.dustLayer, this.debugLayer);
    this.root.pivot.set(ART_W * 0.49, ART_H * 0.77);
    this.createDust();
    this.applyIntegration();
    return this;
  }

  createDust() {
    this.dustLayer.filters = [this.dustBlur];
    for (let i = 0; i < 12; i += 1) {
      const puff = new PIXI.Graphics()
        .circle(0, 0, 7 + (i % 4) * 4)
        .fill({ color: 0xb47d45, alpha: 0.07 + (i % 3) * 0.012 });
      puff.x = ART_W * (0.27 + (i % 7) * 0.07);
      puff.y = ART_H * (0.79 + (i % 3) * 0.018);
      this.dustLayer.addChild(puff);
      this.dust.push({ node: puff, seed: i * 0.83, age: (i % 6) / 6 });
    }
  }

  setMotionStrength(value) { this.motionStrength = clamp01(value); }
  setDepth(value) { this.depth = clamp01(value); this.applyIntegration(); }

  setDebugMesh(enabled) {
    this.meshDebug = enabled;
    this.debugLayer.visible = enabled;
    if (enabled) this.drawDebugMesh();
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
    this.mesh.alpha = 1 - haze * 0.16;
    this.mesh.tint = this.colorMatch ? 0xffd8b5 : 0xffffff;
    this.noiseFilter.noise = this.colorMatch ? 0.018 : 0.005;
    this.shadow.visible = this.shadowEnabled;
    this.shadow.alpha = 1 - haze * 0.4;
    this.dustLayer.visible = this.dustEnabled;
    this.dustLayer.alpha = 1 - haze * 0.25;
  }

  layout(screenWidth, screenHeight) {
    const targetWidth = screenWidth * (0.34 - this.depth * 0.075);
    const scale = targetWidth / ART_W;
    this.root.scale.set(scale);
    this.root.x = screenWidth * (0.58 - this.depth * 0.02);
    this.root.y = screenHeight * (0.80 - this.depth * 0.07);
  }

  resetPose() { this.updatePose(0); }

  updatePose(phase) {
    if (!this.mesh) return;
    this.poseVersion += 1;
    const vertices = this.mesh.vertices;
    const strength = this.motionStrength;
    const breath = Math.sin(phase * 0.48);
    const weight = Math.sin(phase);
    const counter = Math.sin(phase + Math.PI * 0.55);

    for (let i = 0; i < vertices.length; i += 2) {
      const baseX = this.baseVertices[i];
      const baseY = this.baseVertices[i + 1];
      const u = baseX / ART_W;
      const v = baseY / ART_H;
      let dx = 0;
      let dy = 0;

      const torso = smoothstep(0.18, 0.35, u) * (1 - smoothstep(0.82, 0.96, u)) *
        smoothstep(0.12, 0.34, v) * (1 - smoothstep(0.58, 0.78, v));
      dy -= breath * 2.4 * strength * torso;
      dx += Math.sin(phase * 0.5) * 1.5 * strength * torso;

      const headFront = (1 - smoothstep(0.18, 0.31, u)) * smoothstep(0.13, 0.58, v);
      const headRear = bell(0.24, 0.15, u) * smoothstep(0.12, 0.50, v) * (1 - headFront * 0.45);
      dx += Math.cos(phase * 0.66 + 0.3) * 2.6 * strength * headFront;
      dy += Math.sin(phase * 0.66 + 0.55) * 3.4 * strength * headFront;
      dx += Math.cos(phase * 0.61 + 1.25) * 1.8 * strength * headRear;
      dy += Math.sin(phase * 0.61 + 1.4) * 2.7 * strength * headRear;

      const lower = smoothstep(0.58, 0.96, v);
      const frontLegZone = bell(0.36, 0.16, u);
      const rearLegZone = bell(0.78, 0.16, u);
      dx += weight * 3.4 * strength * frontLegZone * lower;
      dy += Math.max(0, -weight) * 2.3 * strength * frontLegZone * lower;
      dx += counter * 3.0 * strength * rearLegZone * lower;
      dy += Math.max(0, -counter) * 1.9 * strength * rearLegZone * lower;

      const shoulder = bell(0.37, 0.18, u) * smoothstep(0.28, 0.68, v);
      const rump = bell(0.76, 0.18, u) * smoothstep(0.25, 0.65, v);
      dy += Math.max(0, weight) * 1.8 * strength * shoulder;
      dy += Math.max(0, counter) * 1.4 * strength * rump;

      vertices[i] = baseX + dx;
      vertices[i + 1] = baseY + dy;
    }

    if (this.meshDebug) this.drawDebugMesh();
  }

  drawDebugMesh() {
    if (!this.mesh) return;
    const vertices = this.mesh.vertices;
    const g = this.debugLayer;
    g.clear();
    for (let row = 0; row < GRID_ROWS; row += 1) {
      for (let col = 0; col < GRID_COLS - 1; col += 1) {
        const a = (row * GRID_COLS + col) * 2;
        const b = a + 2;
        g.moveTo(vertices[a], vertices[a + 1]).lineTo(vertices[b], vertices[b + 1]);
      }
    }
    for (let col = 0; col < GRID_COLS; col += 1) {
      for (let row = 0; row < GRID_ROWS - 1; row += 1) {
        const a = (row * GRID_COLS + col) * 2;
        const b = ((row + 1) * GRID_COLS + col) * 2;
        g.moveTo(vertices[a], vertices[a + 1]).lineTo(vertices[b], vertices[b + 1]);
      }
    }
    g.stroke({ width: 2.2, color: 0xffc55c, alpha: 0.82 });
    for (let i = 0; i < vertices.length; i += 2) {
      g.circle(vertices[i], vertices[i + 1], 3.2).fill({ color: 0xffe2a0, alpha: 0.9 });
    }
  }

  updateContinuous(deltaSeconds, phase) {
    if (this.shadow) {
      this.shadow.scale.x = 1 + Math.sin(phase) * 0.012 * this.motionStrength;
      this.shadow.alpha = (this.shadowEnabled ? 0.78 : 0) * (1 - this.depth * 0.32);
    }
    for (const puff of this.dust) {
      puff.age += deltaSeconds * (0.12 + this.motionStrength * 0.08);
      if (puff.age > 1) puff.age -= 1;
      const t = puff.age;
      puff.node.x += deltaSeconds * (4.5 + puff.seed * 0.3);
      if (puff.node.x > ART_W * 0.82) puff.node.x = ART_W * 0.25;
      puff.node.y = ART_H * (0.81 - t * 0.025) + Math.sin(puff.seed + phase) * 1.7;
      const scale = 0.42 + t * 0.48;
      puff.node.scale.set(scale);
      puff.node.alpha = this.dustEnabled ? Math.sin(Math.PI * t) * 0.075 : 0;
    }
  }
}
