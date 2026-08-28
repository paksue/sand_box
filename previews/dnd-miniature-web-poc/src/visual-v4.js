import * as THREE from 'three'

// v4 reference-driven visual layer. The app still owns GLB import and interaction;
// this layer owns the physical-diorama terrain used by the visual loop.
const originalSceneAdd = THREE.Scene.prototype.add
THREE.Scene.prototype.add = function (...objects) {
  globalThis.__dndScene = this
  return originalSceneAdd.apply(this, objects)
}

const originalRender = THREE.WebGLRenderer.prototype.render
THREE.WebGLRenderer.prototype.render = function (scene, camera) {
  globalThis.__dndRenderer = this
  globalThis.__dndCamera = camera
  if (document.documentElement.classList.contains('visual-capture')) {
    camera.position.set(5.65, 5.15, 7.75)
    camera.lookAt(-0.05, 0.46, -0.20)
  }
  return originalRender.call(this, scene, camera)
}

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const random = mulberry32(0x8d44d00d)
const rr = (a, b) => a + (b - a) * random()
const pick = (items) => items[Math.floor(random() * items.length)]

function cast(mesh) {
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function makeTexture(size, painter, colorSpace = THREE.SRGBColorSpace) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  painter(ctx, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = colorSpace
  texture.anisotropy = 8
  return texture
}

function paintStone(ctx, size, bump = false) {
  const rand = mulberry32(bump ? 4119 : 4118)
  ctx.fillStyle = bump ? '#777' : '#6e665d'
  ctx.fillRect(0, 0, size, size)
  const colors = bump
    ? ['#252525', '#414141', '#5b5b5b', '#838383', '#a8a8a8', '#d0d0d0']
    : ['#302d29', '#4a4540', '#5f5952', '#777067', '#8d8478', '#a59b8d', '#c0b6a6']

  for (let i = 0; i < size * 150; i += 1) {
    const x = rand() * size
    const y = rand() * size
    const radius = 0.2 + Math.pow(rand(), 2.1) * 4.3
    ctx.globalAlpha = 0.025 + rand() * 0.14
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)]
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  // porous pits
  for (let i = 0; i < 620; i += 1) {
    const radius = 0.35 + rand() * 2.8
    ctx.globalAlpha = bump ? 0.22 + rand() * 0.34 : 0.07 + rand() * 0.14
    ctx.fillStyle = bump ? '#2c2c2c' : pickWith(rand, ['#34312e', '#4c4741', '#5d5750'])
    ctx.beginPath()
    ctx.ellipse(rand() * size, rand() * size, radius, radius * rrLocal(rand, 0.45, 1.15), rand() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  // mineral bands / hairline fissures
  for (let i = 0; i < 120; i += 1) {
    let x = rand() * size
    let y = rand() * size
    ctx.globalAlpha = bump ? 0.24 : 0.16
    ctx.strokeStyle = bump ? '#303030' : '#342f2b'
    ctx.lineWidth = 0.4 + rand() * 1.45
    ctx.beginPath(); ctx.moveTo(x, y)
    for (let j = 0; j < 3 + Math.floor(rand() * 6); j += 1) {
      x += (rand() - 0.5) * 48
      y += (rand() - 0.5) * 34
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function paintMoss(ctx, size) {
  const rand = mulberry32(771)
  ctx.fillStyle = '#58602c'
  ctx.fillRect(0, 0, size, size)
  const colors = ['#263016', '#39431c', '#4c5924', '#65702f', '#7d833a', '#989246', '#aca253']
  for (let i = 0; i < size * 190; i += 1) {
    ctx.globalAlpha = 0.09 + rand() * 0.34
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)]
    ctx.beginPath()
    ctx.arc(rand() * size, rand() * size, 0.25 + rand() * 2.2, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function paintBark(ctx, size, bump = false) {
  const rand = mulberry32(bump ? 929 : 928)
  ctx.fillStyle = bump ? '#777' : '#49372b'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 330; i += 1) {
    const x = rand() * size
    ctx.globalAlpha = 0.07 + rand() * 0.28
    ctx.strokeStyle = bump ? pickWith(rand, ['#252525', '#444', '#aaa']) : pickWith(rand, ['#201915', '#33241d', '#604536', '#7a5943'])
    ctx.lineWidth = 0.6 + rand() * 3.8
    ctx.beginPath(); ctx.moveTo(x, -10)
    let y = 0
    while (y < size + 10) {
      y += 10 + rand() * 34
      ctx.lineTo(x + (rand() - 0.5) * 15, y)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function paintWood(ctx, size) {
  const rand = mulberry32(113)
  ctx.fillStyle = '#704a34'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 230; i += 1) {
    const y = rand() * size
    ctx.globalAlpha = 0.04 + rand() * 0.13
    ctx.strokeStyle = pickWith(rand, ['#342319', '#513323', '#8b5a3d', '#a66b49'])
    ctx.lineWidth = 0.5 + rand() * 2.4
    ctx.beginPath(); ctx.moveTo(-20, y)
    for (let x = 0; x < size + 40; x += 28) ctx.lineTo(x, y + Math.sin((x + rand() * 60) * 0.024) * (1.5 + rand() * 4.5))
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function rrLocal(rand, a, b) { return a + (b - a) * rand() }
function pickWith(rand, items) { return items[Math.floor(rand() * items.length)] }

const stoneMap = makeTexture(1024, (ctx, size) => paintStone(ctx, size, false))
stoneMap.repeat.set(1.35, 1.35)
const stoneBump = makeTexture(1024, (ctx, size) => paintStone(ctx, size, true), THREE.NoColorSpace)
stoneBump.repeat.set(1.35, 1.35)
const mossMap = makeTexture(512, paintMoss)
mossMap.repeat.set(1.8, 1.8)
const barkMap = makeTexture(512, (ctx, size) => paintBark(ctx, size, false))
barkMap.repeat.set(1.5, 3.2)
const barkBump = makeTexture(512, (ctx, size) => paintBark(ctx, size, true), THREE.NoColorSpace)
barkBump.repeat.set(1.5, 3.2)
const woodMap = makeTexture(768, paintWood)
woodMap.repeat.set(3.4, 2.2)

const stoneColors = ['#777067', '#847b70', '#6e6860', '#8f8578', '#756c62', '#988d7f', '#6b655e']
const stoneMaterials = stoneColors.map((color) => new THREE.MeshStandardMaterial({ color, map: stoneMap, bumpMap: stoneBump, bumpScale: 0.21, roughness: 0.98 }))
const stoneDark = new THREE.MeshStandardMaterial({ color: '#3d3934', map: stoneMap, bumpMap: stoneBump, bumpScale: 0.18, roughness: 1 })
const stoneStain = new THREE.MeshStandardMaterial({ color: '#4e463d', roughness: 1 })
const paleStone = new THREE.MeshStandardMaterial({ color: '#b2a58c', map: stoneMap, bumpMap: stoneBump, bumpScale: 0.13, roughness: 0.97 })
const paleStoneDark = new THREE.MeshStandardMaterial({ color: '#877c69', map: stoneMap, bumpMap: stoneBump, bumpScale: 0.14, roughness: 0.99 })
const columnGrime = new THREE.MeshStandardMaterial({ color: '#5d5841', map: mossMap, roughness: 1 })
const soilMaterial = new THREE.MeshStandardMaterial({ color: '#54402f', map: stoneMap, bumpMap: stoneBump, bumpScale: 0.08, roughness: 1 })
const mossMaterials = ['#435124', '#56632b', '#687331', '#7b8138', '#949044'].map((color) => new THREE.MeshStandardMaterial({ color, map: mossMap, bumpMap: mossMap, bumpScale: 0.07, roughness: 1 }))
const barkMaterial = new THREE.MeshStandardMaterial({ color: '#5f4938', map: barkMap, bumpMap: barkBump, bumpScale: 0.16, roughness: 1 })
const twigMaterial = new THREE.MeshStandardMaterial({ color: '#4c3b2e', roughness: 1 })
const grassMaterials = ['#6f6d32', '#867c36', '#596632', '#8e8742'].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 1 }))
const woodMaterial = new THREE.MeshStandardMaterial({ color: '#744a34', map: woodMap, roughness: 0.84 })

function irregularStoneShape(width, depth) {
  const hw = width / 2, hd = depth / 2
  const pts = [
    [-hw * 0.78, -hd], [-hw * 0.20, -hd + rr(-0.025, 0.02)], [hw * 0.42, -hd + rr(-0.02, 0.025)],
    [hw * 0.83, -hd], [hw, -hd * 0.68], [hw - rr(0.00, 0.045), -hd * 0.15], [hw, hd * 0.45], [hw * 0.83, hd],
    [hw * 0.28, hd - rr(0, 0.035)], [-hw * 0.32, hd], [-hw * 0.82, hd - rr(0, 0.025)], [-hw, hd * 0.64],
    [-hw + rr(0, 0.035), hd * 0.08], [-hw, -hd * 0.42],
  ]
  // occasional chipped corner: deliberately inset one perimeter point
  if (random() < 0.55) {
    const idx = [0, 3, 7, 10][Math.floor(random() * 4)]
    pts[idx][0] *= rr(0.78, 0.90)
    pts[idx][1] *= rr(0.78, 0.90)
  }
  const shape = new THREE.Shape()
  shape.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i += 1) shape.lineTo(pts[i][0], pts[i][1])
  shape.closePath()
  return shape
}

function createSlab(x, z, row, col) {
  const width = rr(0.87, 0.98)
  const depth = rr(0.87, 0.98)
  const height = rr(0.07, 0.145)
  const geo = new THREE.ExtrudeGeometry(irregularStoneShape(width, depth), {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.018,
    bevelSegments: 2,
    steps: 1,
  })
  geo.rotateX(-Math.PI / 2)
  geo.computeVertexNormals()
  const mesh = cast(new THREE.Mesh(geo, stoneMaterials[(row * 5 + col * 2) % stoneMaterials.length]))
  mesh.position.set(x + rr(-0.035, 0.035), 0.045 + rr(-0.025, 0.035), z + rr(-0.035, 0.035))
  mesh.rotation.set(rr(-0.015, 0.015), rr(-0.026, 0.026), rr(-0.013, 0.013))
  return { mesh, top: mesh.position.y + height }
}

function addCrack(parent, x, y, z, length) {
  const points = [new THREE.Vector3(x - length * 0.5, y, z)]
  for (let i = 1; i < 4; i += 1) points.push(new THREE.Vector3(x - length * 0.5 + (length * i) / 4, y + 0.002, z + rr(-0.07, 0.07)))
  points.push(new THREE.Vector3(x + length * 0.5, y, z + rr(-0.04, 0.04)))
  const crack = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 12, 0.005, 4, false), stoneDark)
  crack.castShadow = false
  parent.add(crack)
}

function addStoneSurfaceScatter(parent) {
  const pitGeo = new THREE.SphereGeometry(1, 8, 5)
  const stainGeo = new THREE.CircleGeometry(1, 12)
  const pits = new THREE.InstancedMesh(pitGeo, stoneDark, 360)
  const stains = new THREE.InstancedMesh(stainGeo, stoneStain, 130)
  const d = new THREE.Object3D()
  pits.castShadow = false
  stains.castShadow = false
  for (let i = 0; i < 360; i += 1) {
    const x = rr(-4.38, 4.38), z = rr(-3.35, 3.35), s = rr(0.012, 0.038)
    d.position.set(x, 0.163 + rr(-0.01, 0.018), z)
    d.scale.set(s * rr(0.7, 1.5), s * rr(0.08, 0.22), s * rr(0.7, 1.4))
    d.rotation.set(rr(0, Math.PI), rr(0, Math.PI), rr(0, Math.PI)); d.updateMatrix(); pits.setMatrixAt(i, d.matrix)
  }
  for (let i = 0; i < 130; i += 1) {
    d.position.set(rr(-4.35, 4.35), 0.174 + rr(-0.004, 0.006), rr(-3.32, 3.32))
    d.rotation.set(-Math.PI / 2, 0, rr(0, Math.PI))
    const s = rr(0.035, 0.11); d.scale.set(s * rr(0.7, 1.5), s * rr(0.45, 1.0), 1); d.updateMatrix(); stains.setMatrixAt(i, d.matrix)
  }
  pits.instanceMatrix.needsUpdate = true; stains.instanceMatrix.needsUpdate = true
  parent.add(pits, stains)
}

function buildGroundFlock(parent) {
  const mossGeo = new THREE.IcosahedronGeometry(1, 1)
  const mossMeshes = mossMaterials.map((m) => new THREE.InstancedMesh(mossGeo, m, 430))
  const mossCount = new Array(mossMeshes.length).fill(0)
  const bladeGeo = new THREE.ConeGeometry(0.009, 0.16, 5, 1)
  const grassMeshes = grassMaterials.map((m) => new THREE.InstancedMesh(bladeGeo, m, 520))
  const grassCount = new Array(grassMeshes.length).fill(0)
  const d = new THREE.Object3D()
  mossMeshes.forEach((m) => { m.castShadow = true; m.receiveShadow = true; parent.add(m) })
  grassMeshes.forEach((m) => { m.castShadow = true; parent.add(m) })

  // moss mostly follows tile seams and outer flock border
  for (let i = 0; i < 1350; i += 1) {
    const outer = random() < 0.55
    let x = rr(-5.05, 5.05), z = rr(-4.0, 4.0)
    if (outer) {
      const side = Math.floor(random() * 4)
      if (side === 0) z = rr(3.35, 4.0)
      if (side === 1) z = rr(-4.0, -3.35)
      if (side === 2) x = rr(-5.05, -4.35)
      if (side === 3) x = rr(4.35, 5.05)
    } else if (random() < 0.84) {
      if (random() < 0.5) x = Math.round(x + 0.5) - 0.5 + rr(-0.065, 0.065)
      else z = Math.round(z + 0.5) - 0.5 + rr(-0.065, 0.065)
    }
    const mi = Math.floor(random() * mossMeshes.length)
    if (mossCount[mi] >= 430) continue
    const slot = mossCount[mi]++, s = rr(0.018, outer ? 0.085 : 0.050)
    d.position.set(x, rr(0.105, 0.17), z)
    d.rotation.set(rr(-0.4, 0.4), rr(0, Math.PI), rr(-0.4, 0.4))
    d.scale.set(s * rr(0.6, 1.6), s * rr(0.18, 0.48), s * rr(0.6, 1.6)); d.updateMatrix(); mossMeshes[mi].setMatrixAt(slot, d.matrix)
  }

  // dense static-grass tufts around edges plus a few seam tufts
  for (let tuft = 0; tuft < 230; tuft += 1) {
    const outer = random() < 0.82
    let cx = rr(-4.95, 4.95), cz = rr(-3.92, 3.92)
    if (outer) {
      const side = Math.floor(random() * 4)
      if (side === 0) cz = rr(3.35, 3.94)
      if (side === 1) cz = rr(-3.94, -3.35)
      if (side === 2) cx = rr(-4.95, -4.35)
      if (side === 3) cx = rr(4.35, 4.95)
    }
    const gi = Math.floor(random() * grassMeshes.length)
    for (let blade = 0; blade < 7 && grassCount[gi] < 520; blade += 1) {
      const slot = grassCount[gi]++
      d.position.set(cx + rr(-0.055, 0.055), 0.145 + rr(0, 0.035), cz + rr(-0.055, 0.055))
      d.rotation.set(rr(-0.35, 0.35), rr(0, Math.PI), rr(-0.35, 0.35))
      d.scale.set(rr(0.55, 1.0), rr(0.55, 1.5), rr(0.55, 1.0)); d.updateMatrix(); grassMeshes[gi].setMatrixAt(slot, d.matrix)
    }
  }
  mossMeshes.forEach((m, i) => { m.count = mossCount[i]; m.instanceMatrix.needsUpdate = true })
  grassMeshes.forEach((m, i) => { m.count = grassCount[i]; m.instanceMatrix.needsUpdate = true })
}

function buildRubble(parent) {
  const geo = new THREE.DodecahedronGeometry(1, 1)
  const rubble = new THREE.InstancedMesh(geo, stoneDark, 300)
  const d = new THREE.Object3D(); rubble.castShadow = true; rubble.receiveShadow = true
  for (let i = 0; i < 300; i += 1) {
    const edge = random() < 0.72
    let x = rr(-5.0, 5.0), z = rr(-3.95, 3.95)
    if (edge) {
      const side = Math.floor(random() * 4)
      if (side === 0) z = rr(3.36, 3.96)
      if (side === 1) z = rr(-3.96, -3.36)
      if (side === 2) x = rr(-5.0, -4.35)
      if (side === 3) x = rr(4.35, 5.0)
    }
    const s = rr(0.022, 0.085)
    d.position.set(x, 0.105 + rr(0, 0.055), z)
    d.rotation.set(rr(0, Math.PI), rr(0, Math.PI), rr(0, Math.PI))
    d.scale.set(s * rr(0.65, 1.7), s * rr(0.3, 0.9), s * rr(0.65, 1.7)); d.updateMatrix(); rubble.setMatrixAt(i, d.matrix)
  }
  rubble.instanceMatrix.needsUpdate = true; parent.add(rubble)
}

function tubeBetween(points, radius, material, radial = 14) {
  return cast(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), Math.max(12, points.length * 8), radius, radial, false), material))
}

function softBlobGeometry(radius, phase) {
  const geo = new THREE.SphereGeometry(radius, 22, 16)
  const p = geo.attributes.position
  for (let i = 0; i < p.count; i += 1) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i)
    const len = Math.max(0.0001, Math.hypot(x, y, z))
    const nx = x / len, ny = y / len, nz = z / len
    const wave = Math.sin(nx * 6.1 + phase) + Math.sin(ny * 7.9 - phase * 0.6) + Math.sin(nz * 6.7 + phase * 0.35)
    const scale = 0.965 + wave * 0.018
    p.setXYZ(i, x * scale, y * scale, z * scale)
  }
  geo.computeVertexNormals(); return geo
}

function buildTree(parent) {
  const tree = new THREE.Group(); tree.position.set(-0.62, 0.10, -2.50)
  const mound = cast(new THREE.Mesh(new THREE.SphereGeometry(1.30, 48, 26), soilMaterial)); mound.scale.set(1.28, 0.35, 1.02); mound.position.y = -0.25; tree.add(mound)

  tree.add(tubeBetween([new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(0.05, 0.72, 0.01), new THREE.Vector3(-0.04, 1.42, -0.03), new THREE.Vector3(0.02, 1.98, 0.02)], 0.17, barkMaterial, 20))
  const branchEnds = [[-0.92, 2.24, 0.02], [0.82, 2.34, 0.20], [-0.58, 2.67, -0.50], [0.50, 2.72, 0.48], [-0.90, 2.48, -0.34], [0.80, 2.58, -0.44], [-0.15, 2.86, 0.46]]
  branchEnds.forEach(([x, y, z], i) => {
    const start = i < 2 ? new THREE.Vector3(0, 1.35, 0) : new THREE.Vector3(0.01, 1.82, 0.02)
    tree.add(tubeBetween([start, new THREE.Vector3(x * 0.52, y - 0.38, z * 0.52), new THREE.Vector3(x, y, z)], rr(0.038, 0.072), barkMaterial, 12))
  })
  for (let i = 0; i < 11; i += 1) {
    const a = (i / 11) * Math.PI * 2 + rr(-0.15, 0.15)
    tree.add(tubeBetween([new THREE.Vector3(0, 0.15, 0), new THREE.Vector3(Math.cos(a) * 0.45, 0.07, Math.sin(a) * 0.38), new THREE.Vector3(Math.cos(a) * rr(0.85, 1.30), 0.02, Math.sin(a) * rr(0.72, 1.08))], rr(0.025, 0.05), barkMaterial, 9))
  }

  const centers = [
    [-0.82, 2.43, 0.03, 0.69, 0.56, 0.63], [0.70, 2.50, 0.18, 0.67, 0.54, 0.62],
    [-0.42, 2.78, -0.42, 0.72, 0.60, 0.67], [0.40, 2.82, 0.41, 0.68, 0.57, 0.65],
    [-0.76, 2.65, -0.32, 0.62, 0.51, 0.58], [0.02, 2.62, -0.03, 0.82, 0.68, 0.76],
    [0.78, 2.72, -0.28, 0.56, 0.48, 0.54], [-0.12, 3.00, 0.14, 0.60, 0.50, 0.56],
  ]
  // soft dark interior volumes, heavily overlapped so the canopy does not read as rocks
  centers.forEach(([x, y, z, sx, sy, sz], i) => {
    const m = cast(new THREE.Mesh(softBlobGeometry(1, i * 1.37), mossMaterials[i % 3]))
    m.position.set(x, y, z); m.scale.set(sx, sy, sz); tree.add(m)
  })

  // Hundreds of tiny lichen nuggets make the silhouette granular like hobby foliage.
  const nuggetGeo = new THREE.IcosahedronGeometry(1, 1)
  const nuggetMeshes = mossMaterials.map((mat) => new THREE.InstancedMesh(nuggetGeo, mat, 380))
  const nuggetCount = new Array(nuggetMeshes.length).fill(0)
  const d = new THREE.Object3D()
  nuggetMeshes.forEach((m) => { m.castShadow = true; tree.add(m) })
  for (let i = 0; i < 1500; i += 1) {
    const c = centers[Math.floor(random() * centers.length)]
    const [cx, cy, cz, sx, sy, sz] = c
    const theta = rr(0, Math.PI * 2), u = rr(-1, 1), radial = Math.cbrt(random())
    const ring = Math.sqrt(1 - u * u)
    const x = cx + Math.cos(theta) * ring * sx * radial
    const y = cy + u * sy * radial
    const z = cz + Math.sin(theta) * ring * sz * radial
    const mi = Math.floor(random() * nuggetMeshes.length)
    if (nuggetCount[mi] >= 380) continue
    const slot = nuggetCount[mi]++, s = rr(0.020, 0.075)
    d.position.set(x, y, z)
    d.rotation.set(rr(0, Math.PI), rr(0, Math.PI), rr(0, Math.PI))
    d.scale.set(s * rr(0.65, 1.55), s * rr(0.55, 1.25), s * rr(0.65, 1.55)); d.updateMatrix(); nuggetMeshes[mi].setMatrixAt(slot, d.matrix)
  }
  nuggetMeshes.forEach((m, i) => { m.count = nuggetCount[i]; m.instanceMatrix.needsUpdate = true })

  // Hanging lichen/twig breakup under the canopy.
  const strandGeo = new THREE.CylinderGeometry(0.006, 0.010, 0.18, 5, 1)
  const strands = new THREE.InstancedMesh(strandGeo, mossMaterials[4], 230)
  for (let i = 0; i < 230; i += 1) {
    const c = centers[Math.floor(random() * centers.length)]
    const x = c[0] + rr(-c[3] * 0.9, c[3] * 0.9)
    const y = c[1] + rr(-c[4] * 0.55, c[4] * 0.35)
    const z = c[2] + rr(-c[5] * 0.8, c[5] * 0.8)
    d.position.set(x, y, z); d.rotation.set(rr(-0.28, 0.28), rr(0, Math.PI), rr(-0.28, 0.28)); d.scale.set(rr(0.6, 1.3), rr(0.45, 1.5), rr(0.6, 1.3)); d.updateMatrix(); strands.setMatrixAt(i, d.matrix)
  }
  strands.instanceMatrix.needsUpdate = true; strands.castShadow = true; tree.add(strands)
  parent.add(tree)
}

function flutedGeometry(radius, height) {
  const geo = new THREE.CylinderGeometry(radius * 0.91, radius, height, 72, 10, false)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i), z = pos.getZ(i), len = Math.hypot(x, z)
    if (len < radius * 0.6) continue
    const angle = Math.atan2(z, x), groove = 1 - 0.047 * (0.5 + 0.5 * Math.cos(angle * 18))
    pos.setX(i, x * groove); pos.setZ(i, z * groove)
  }
  geo.computeVertexNormals(); return geo
}

function weatherColumn(group, shaftHeight) {
  for (let i = 0; i < 18; i += 1) {
    const angle = rr(0, Math.PI * 2), y = rr(0.08, Math.min(0.75, shaftHeight + 0.35))
    const blob = cast(new THREE.Mesh(new THREE.IcosahedronGeometry(rr(0.018, 0.045), 1), i < 11 ? columnGrime : paleStoneDark))
    blob.position.set(Math.cos(angle) * rr(0.17, 0.24), y, Math.sin(angle) * rr(0.17, 0.24)); blob.scale.y = rr(0.2, 0.65); group.add(blob)
  }
  for (let i = 0; i < 7; i += 1) {
    const chip = cast(new THREE.Mesh(new THREE.DodecahedronGeometry(rr(0.025, 0.06), 0), paleStoneDark))
    chip.position.set(rr(-0.24, 0.24), rr(0.10, 0.38), rr(-0.24, 0.24)); chip.scale.y = rr(0.35, 0.8); group.add(chip)
  }
}

function addColumn(parent, x, z, height = 1.25, broken = false, rotation = 0) {
  const g = new THREE.Group(); g.position.set(x, 0.10, z); g.rotation.set(rr(-0.018, 0.018), rotation, rr(-0.018, 0.018))
  const parts = [
    [new THREE.CylinderGeometry(0.32, 0.38, 0.09, 48), paleStoneDark, 0.045],
    [new THREE.CylinderGeometry(0.27, 0.32, 0.08, 48), paleStone, 0.13],
    [new THREE.BoxGeometry(0.44, 0.09, 0.44), paleStone, 0.215],
    [new THREE.CylinderGeometry(0.21, 0.24, 0.08, 48), paleStoneDark, 0.30],
  ]
  parts.forEach(([geo, mat, y]) => { const m = cast(new THREE.Mesh(geo, mat)); m.position.y = y; g.add(m) })
  const shaftHeight = broken ? height * rr(0.42, 0.72) : height
  const shaft = cast(new THREE.Mesh(flutedGeometry(0.165, shaftHeight), paleStone)); shaft.position.y = 0.35 + shaftHeight / 2; g.add(shaft)
  if (!broken) {
    const neck = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.16, 0.10, 48), paleStoneDark)); neck.position.y = 0.38 + shaftHeight; g.add(neck)
    const echinus = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.19, 0.10, 48), paleStone)); echinus.position.y = 0.46 + shaftHeight; g.add(echinus)
    const cap = cast(new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.10, 0.43), paleStone)); cap.position.y = 0.55 + shaftHeight; g.add(cap)
    const cap2 = cast(new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.065, 0.35), paleStoneDark)); cap2.position.y = 0.635 + shaftHeight; g.add(cap2)
  } else {
    for (let i = 0; i < 9; i += 1) {
      const chip = cast(new THREE.Mesh(new THREE.DodecahedronGeometry(rr(0.025, 0.055), 0), paleStoneDark)); chip.position.set(rr(-0.12, 0.12), 0.36 + shaftHeight + rr(-0.025, 0.04), rr(-0.12, 0.12)); g.add(chip)
    }
  }
  weatherColumn(g, shaftHeight)
  parent.add(g)
}

function addFallenColumn(parent, x, z, length, rotation) {
  const g = new THREE.Group(); g.position.set(x, 0.19, z); g.rotation.y = rotation
  const shaft = cast(new THREE.Mesh(flutedGeometry(0.15, length), paleStone)); shaft.rotation.z = Math.PI / 2; g.add(shaft)
  const base = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.32, 0.11, 48), paleStoneDark)); base.rotation.z = Math.PI / 2; base.position.x = -length * 0.48; g.add(base)
  weatherColumn(g, 0.45); parent.add(g)
}

function addShrub(parent, x, z, scale, seedOffset) {
  const g = new THREE.Group(); g.position.set(x, 0.10, z)
  const centers = [[0, 0.34, 0], [-0.20, 0.28, 0.05], [0.18, 0.42, -0.06], [0.05, 0.55, 0.10]]
  centers.forEach((c, i) => {
    const blob = cast(new THREE.Mesh(softBlobGeometry(0.20 * scale, seedOffset + i), mossMaterials[(seedOffset + i) % mossMaterials.length]))
    blob.position.set(c[0] * scale, c[1] * scale, c[2] * scale); blob.scale.set(1.1, 1.3, 0.9); g.add(blob)
  })
  const geo = new THREE.IcosahedronGeometry(1, 1), mesh = new THREE.InstancedMesh(geo, mossMaterials[(seedOffset + 2) % mossMaterials.length], 70), d = new THREE.Object3D(); mesh.castShadow = true
  for (let i = 0; i < 70; i += 1) {
    const s = rr(0.018, 0.055) * scale; d.position.set(rr(-0.34, 0.34) * scale, rr(0.18, 0.65) * scale, rr(-0.26, 0.26) * scale); d.scale.set(s * rr(0.7, 1.5), s * rr(0.6, 1.3), s * rr(0.7, 1.5)); d.rotation.set(rr(0, Math.PI), rr(0, Math.PI), rr(0, Math.PI)); d.updateMatrix(); mesh.setMatrixAt(i, d.matrix)
  }
  mesh.instanceMatrix.needsUpdate = true; g.add(mesh); parent.add(g)
}

function buildBackdrop(parent) {
  const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 720
  const ctx = canvas.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, 1200, 720)
  grad.addColorStop(0, '#bd6c73'); grad.addColorStop(0.45, '#e6a3b8'); grad.addColorStop(1, '#aa5660')
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 1200, 720)
  // pale cloud shapes
  ctx.globalAlpha = 0.48; ctx.fillStyle = '#d6c6df'
  ctx.beginPath(); ctx.ellipse(720, 220, 310, 100, -0.12, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(350, 330, 210, 75, 0.10, 0, Math.PI * 2); ctx.fill()
  // broad red dragon wing silhouette
  ctx.globalAlpha = 0.92; ctx.fillStyle = '#a82326'
  ctx.beginPath(); ctx.moveTo(120, 40); ctx.lineTo(480, 35); ctx.lineTo(930, 130); ctx.lineTo(690, 185); ctx.lineTo(1040, 350); ctx.lineTo(590, 310); ctx.lineTo(520, 570); ctx.lineTo(430, 300); ctx.lineTo(170, 380); ctx.lineTo(360, 210); ctx.closePath(); ctx.fill()
  // neck/head mass
  ctx.fillStyle = '#9a2728'; ctx.beginPath(); ctx.ellipse(470, 390, 210, 92, -0.32, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(590, 360); ctx.lineTo(790, 405); ctx.lineTo(600, 445); ctx.closePath(); ctx.fill()
  ctx.globalAlpha = 0.28; ctx.fillStyle = '#561b20'; ctx.beginPath(); ctx.ellipse(565, 385, 95, 34, -0.18, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(12.6, 7.55), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }))
  screen.position.set(0, 3.55, -6.45); parent.add(screen)
}

function buildDiorama(world) {
  const board = new THREE.Group(); board.name = 'fidelity-board-v4'
  const table = cast(new THREE.Mesh(new THREE.BoxGeometry(17, 0.34, 13), woodMaterial)); table.position.y = -0.50; board.add(table)
  const base = cast(new THREE.Mesh(new THREE.BoxGeometry(10.65, 0.22, 8.55), new THREE.MeshStandardMaterial({ color: '#191816', roughness: 0.96 }))); base.position.y = -0.20; board.add(base)
  const earth = cast(new THREE.Mesh(new THREE.BoxGeometry(10.35, 0.20, 8.25), soilMaterial)); earth.position.y = -0.07; board.add(earth)

  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const x = col - 4, z = row - 3
      const { mesh, top } = createSlab(x, z, row, col); board.add(mesh)
      if (random() < 0.46) addCrack(board, x + rr(-0.15, 0.15), top + 0.004, z + rr(-0.13, 0.13), rr(0.12, 0.38))
    }
  }
  addStoneSurfaceScatter(board)
  buildGroundFlock(board)
  buildRubble(board)
  buildTree(board)

  const cols = [
    [-3.64, -2.42, 1.20, false, 0.05], [-2.86, 1.92, 0.84, true, -0.10], [-4.16, 0.04, 1.30, false, 0.02],
    [3.45, -2.08, 1.30, false, -0.08], [4.05, 1.86, 1.12, false, 0.08], [2.86, 2.52, 0.76, true, 0],
  ]
  cols.forEach((c) => addColumn(board, ...c))
  addFallenColumn(board, 3.35, 3.0, 1.28, -0.35)
  addFallenColumn(board, -2.75, -3.16, 1.0, 0.48)

  addShrub(board, -4.25, -1.62, 1.0, 3)
  addShrub(board, 3.62, -2.82, 0.88, 11)
  addShrub(board, 4.22, 0.10, 0.76, 19)
  addShrub(board, 1.70, -3.45, 0.62, 31)
  buildBackdrop(board)
  world.add(board)
  return board
}

function replaceBoard() {
  const scene = globalThis.__dndScene
  if (!scene) return
  const world = scene.children.find((child) => child?.isGroup)
  if (!world) return
  for (const child of [...world.children]) {
    if (child?.isGroup && child.name !== 'fidelity-board-v4') world.remove(child)
  }
  if (!world.getObjectByName('fidelity-board-v4')) buildDiorama(world)
  scene.fog = new THREE.FogExp2('#65463b', 0.011)
  scene.background = new THREE.Color('#66483c')
  const renderer = globalThis.__dndRenderer
  if (renderer) renderer.toneMappingExposure = 1.38
}

window.addEventListener('load', () => setTimeout(replaceBoard, 45))
