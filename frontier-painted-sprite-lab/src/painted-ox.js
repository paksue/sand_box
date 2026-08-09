const PIXI = window.PIXI;

export const OX_SOURCE_URL = 'https://upload.wikimedia.org/wikipedia/commons/a/a1/George_Stubbs_-_The_Lincolnshire_Ox_-_Google_Art_Project.jpg';

// Source dimensions: 3082 × 2083. This crop keeps the animal large enough for
// mesh deformation while leaving a small safety border for the silhouette mask.
const CROP = { x: 300, y: 990, w: 1710, h: 1060 };
const GRID_COLS = 9;
const GRID_ROWS = 6;

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(edge0, edge1, value) {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
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

  return {
    vertices,
    uvs,
    indices: new Uint32Array(indices),
  };
}

function silhouettePoints(width, height) {
  // Deliberately generous around hooves/head so small mesh motion does not clip.
  // The important visual boundary comes from the source painting itself; this
  // mask removes the rectangular crop without pretending to be segmentation.
  const p = [
    [0.015, 0.57], [0.045, 0.52], [0.070, 0.46], [0.105, 0.43],
    [0.145, 0.40], [0.175, 0.31], [0.215, 0.23], [0.285, 0.17],
    [0.405, 0.13], [0.545, 0.115], [0.690, 0.12], [0.795, 0.10],
    [0.865, 0.14], [0.900, 0.23], [0.915, 0.42], [0.900, 0.58],
    [0.875, 0.73], [0.855, 0.91], [0.805, 0.95], [0.760, 0.90],
    [0.725, 0.72], [0.675, 0.68], [0.615, 0.69], [0.575, 0.81],
    [0.530, 0.96], [0.465, 0.97], [0.420, 0.79], [0.360, 0.76],
    [0.325, 0.96], [0.260, 0.97], [0.220, 0.82], [0.170, 0.79],
    [0.115, 0.73], [0.065, 0.68], [0.020, 0.64],
  ];
  return p.map(([x, y]) => [x * width, y * height]);
}

function buildMask(width, height) {
  const points = silhouettePoints(width, height);
  const g = new PIXI.Graphics();
  g.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) g.lineTo(points[i][0], points[i][1]);
  g.closePath().fill(0xffffff);
  return g;
}

export class PaintedOx {
  constructor() {
    this.root = new PIXI.Container();
    this.mesh = null;
    this.mask = null;
    this.shadow = null;
    this.dustLayer = new PIXI.Container();
    this.debugLayer = new PIXI.Graphics();
    this.baseVertices = null;
    this.grid = null;
    this.motionStrength = 0.62;
    this.depth = 0.46;
    this.colorMatch = true;
    this.atmosphere = true;
    this.shadowEnabled = true;
    this.dustEnabled = true;
    this.meshDebug = false;
    this.posePhase = 0;
    this.poseVersion = 0;
    this.dust = [];
    this.noiseFilter = new PIXI.NoiseFilter({ noise: 0.035, seed: 0.63 });
    this.dustBlur = new PIXI.BlurFilter({ strength: 3.2, quality: 2 });
    this.shadowBlur = new PIXI.BlurFilter({ strength: 4.5, quality: 2 });
  }

  async init() {
    const sourceTexture = await PIXI.Assets.load(OX_SOURCE_URL);
    const texture = new PIXI.Texture({
      source: sourceTexture.source,
      frame: new PIXI.Rectangle(CROP.x, CROP.y, CROP.w, CROP.h),
    });

    this.grid = buildGrid(GRID_COLS, GRID_ROWS, CROP.w, CROP.h);
    this.baseVertices = new Float32Array(this.grid.vertices);

    this.mesh = new PIXI.MeshSimple({
      texture,
      vertices: new Float32Array(this.grid.vertices),
      uvs: this.grid.uvs,
      indices: this.grid.indices,
    });
    this.mesh.autoUpdate = true;
    this.mesh.filters = [this.noiseFilter];

    this.mask = buildMask(CROP.w, CROP.h);
    this.mesh.mask = this.mask;

    this.shadow = new PIXI.Graphics()
      .ellipse(CROP.w * 0.50, CROP.h * 0.88, CROP.w * 0.31, CROP.h * 0.055)
      .fill({ color: 0x3b2417, alpha: 0.30 });
    this.shadow.filters = [this.shadowBlur];

    this.root.addChild(this.shadow, this.mesh, this.mask, this.dustLayer, this.debugLayer);
    this.root.pivot.set(CROP.w * 0.51, CROP.h * 0.78);

    this.createDust();
    this.setIntegration({});
    this.setDepth(this.depth);
    return this;
  }

  createDust() {
    this.dustLayer.filters = [this.dustBlur];
    for (let i = 0; i < 15; i += 1) {
      const radius = 16 + (i % 5) * 6;
      const puff = new PIXI.Graphics()
        .circle(0, 0, radius)
        .fill({ color: 0xb8844d, alpha: 0.09 + (i % 3) * 0.02 });
      puff.x = CROP.w * (0.24 + (i % 7) * 0.075);
      puff.y = CROP.h * (0.82 + (i % 3) * 0.025);
      puff.scale.set(0.5 + (i % 4) * 0.08);
      this.dustLayer.addChild(puff);
      this.dust.push({ node: puff, seed: i * 0.83, age: (i % 6) / 6 });
    }
  }

  setMotionStrength(value) {
    this.motionStrength = clamp01(value);
  }

  setDepth(value) {
    this.depth = clamp01(value);
    this.applyIntegration();
  }

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
    this.mesh.alpha = 1 - haze * 0.17;
    this.mesh.tint = this.colorMatch ? 0xffd9ad : 0xffffff;
    this.noiseFilter.noise = this.colorMatch ? 0.035 : 0.012;
    this.shadow.visible = this.shadowEnabled;
    this.shadow.alpha = 1 - haze * 0.35;
    this.dustLayer.visible = this.dustEnabled;
    this.dustLayer.alpha = 1 - haze * 0.25;
  }

  layout(screenWidth, screenHeight) {
    const targetWidth = screenWidth * (0.39 - this.depth * 0.13);
    const scale = targetWidth / CROP.w;
    this.root.scale.set(scale);
    this.root.x = screenWidth * (0.59 - this.depth * 0.035);
    this.root.y = screenHeight * (0.73 - this.depth * 0.115);
  }

  resetPose() {
    this.posePhase = 0;
    this.updatePose(0);
  }

  updatePose(phase) {
    if (!this.mesh) return;
    this.posePhase = phase;
    this.poseVersion += 1;
    const vertices = this.mesh.vertices;
    const strength = this.motionStrength;
    const frontStep = Math.sin(phase);
    const rearStep = Math.sin(phase + Math.PI);
    const bodyLift = Math.sin(phase * 2) * 5.5 * strength;

    for (let i = 0; i < vertices.length; i += 2) {
      const baseX = this.baseVertices[i];
      const baseY = this.baseVertices[i + 1];
      const u = baseX / CROP.w;
      const v = baseY / CROP.h;
      let dx = 0;
      let dy = bodyLift * smoothstep(0.14, 0.58, u) * (1 - smoothstep(0.72, 1, v));

      // Head and neck retain the original painting but dip with the animal's
      // weight transfer. The deformation is broad so it does not hinge like a puppet.
      const headWeight = (1 - smoothstep(0.28, 0.43, u)) * smoothstep(0.25, 0.80, v);
      dx += Math.cos(phase + 0.35) * 7.5 * strength * headWeight;
      dy += Math.sin(phase + 0.45) * 13 * strength * headWeight;

      // Shoulder/chest compression during the front-leg plant.
      const shoulderWeight = smoothstep(0.20, 0.34, u) * (1 - smoothstep(0.44, 0.54, u)) * smoothstep(0.38, 0.82, v);
      dy += Math.max(0, frontStep) * 8.5 * strength * shoulderWeight;
      dx -= frontStep * 4.5 * strength * shoulderWeight;

      // Front lower-leg region. The influence increases toward the hoof.
      const frontLegU = smoothstep(0.20, 0.29, u) * (1 - smoothstep(0.43, 0.49, u));
      const lower = smoothstep(0.58, 0.96, v);
      dx += frontStep * 22 * strength * frontLegU * lower;
      dy += Math.max(0, -frontStep) * 9 * strength * frontLegU * lower;

      // Rear legs move in the opposite phase and push the rump slightly forward.
      const rearLegU = smoothstep(0.56, 0.64, u) * (1 - smoothstep(0.81, 0.88, u));
      dx += rearStep * 20 * strength * rearLegU * lower;
      dy += Math.max(0, -rearStep) * 8 * strength * rearLegU * lower;

      const hipWeight = smoothstep(0.66, 0.80, u) * (1 - smoothstep(0.91, 0.98, u)) * smoothstep(0.30, 0.75, v);
      dy += Math.sin(phase * 2 + 0.55) * 4.5 * strength * hipWeight;

      // Very low-frequency tail sway. Kept subtle so the oil-painted edge survives.
      const tailWeight = smoothstep(0.82, 0.92, u) * smoothstep(0.30, 0.74, v);
      dx += Math.sin(phase * 0.5 + 1.4) * 7 * strength * tailWeight;

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
    g.stroke({ width: 3.2, color: 0xffc55c, alpha: 0.85 });

    for (let i = 0; i < vertices.length; i += 2) {
      g.circle(vertices[i], vertices[i + 1], 5.2).fill({ color: 0xffe2a0, alpha: 0.9 });
    }
  }

  updateContinuous(deltaSeconds, phase) {
    // Environment effects remain smooth even though the painted pose itself is
    // intentionally updated at a limited cadence by the caller.
    if (this.shadow) {
      this.shadow.scale.x = 1 + Math.sin(phase * 2) * 0.025 * this.motionStrength;
      this.shadow.alpha = (this.shadowEnabled ? 0.9 : 0) * (1 - this.depth * 0.3);
    }

    for (const puff of this.dust) {
      puff.age += deltaSeconds * (0.24 + this.motionStrength * 0.18);
      if (puff.age > 1) puff.age -= 1;
      const t = puff.age;
      puff.node.x += deltaSeconds * (14 + puff.seed * 0.7);
      if (puff.node.x > CROP.w * 0.84) puff.node.x = CROP.w * 0.22;
      puff.node.y = CROP.h * (0.86 - t * 0.045) + Math.sin(puff.seed + phase) * 4;
      const scale = 0.45 + t * 0.65;
      puff.node.scale.set(scale);
      puff.node.alpha = this.dustEnabled ? Math.sin(Math.PI * t) * 0.16 : 0;
    }
  }
}
