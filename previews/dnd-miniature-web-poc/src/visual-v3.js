import * as THREE from 'three'

// Visual-fidelity override layer. It deliberately leaves the app's GLB importer
// and interaction code untouched, but replaces the original procedural board
// after startup with a denser diorama-style environment.

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
    camera.position.set(6.15, 4.55, 7.1)
    camera.lookAt(0, 0.38, 0.08)
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
const random = mulberry32(0x5eedcafe)
const rr = (a, b) => a + (b - a) * random()
const pickLocal = (rand, items) => items[Math.floor(rand() * items.length)]

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

function paintStone(ctx, size, grayscale = false) {
  const rand = mulberry32(grayscale ? 829 : 431)
  ctx.fillStyle = grayscale ? '#777777' : '#75685a'
  ctx.fillRect(0, 0, size, size)
  const colors = grayscale
    ? ['#323232', '#555555', '#777777', '#a0a0a0', '#c4c4c4']
    : ['#413830', '#574a40', '#716256', '#887665', '#9b8976', '#b09b84']
  for (let i = 0; i < size * 95; i += 1) {
    const x = rand() * size
    const y = rand() * size
    const rad = 0.25 + rand() * 2.4
    ctx.globalAlpha = 0.025 + rand() * 0.12
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)]
    ctx.beginPath()
    ctx.arc(x, y, rad, 0, Math.PI * 2)
    ctx.fill()
  }
  for (let i = 0; i < 150; i += 1) {
    ctx.globalAlpha = 0.025 + rand() * 0.08
    ctx.strokeStyle = colors[Math.floor(rand() * colors.length)]
    ctx.lineWidth = 0.5 + rand() * 3.0
    ctx.beginPath()
    let x = rand() * size
    let y = rand() * size
    ctx.moveTo(x, y)
    for (let j = 0; j < 3 + Math.floor(rand() * 5); j += 1) {
      x += (rand() - 0.5) * 55
      y += (rand() - 0.5) * 34
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function paintMoss(ctx, size) {
  const rand = mulberry32(986)
  ctx.fillStyle = '#4a5228'
  ctx.fillRect(0, 0, size, size)
  const colors = ['#29341b', '#3f4d22', '#53612c', '#687435', '#7f8741', '#9a9750']
  for (let i = 0; i < size * 145; i += 1) {
    ctx.globalAlpha = 0.09 + rand() * 0.36
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)]
    ctx.beginPath()
    ctx.arc(rand() * size, rand() * size, 0.3 + rand() * 2.3, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function paintBark(ctx, size, grayscale = false) {
  const rand = mulberry32(grayscale ? 375 : 374)
  ctx.fillStyle = grayscale ? '#777' : '#4e392b'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 240; i += 1) {
    const x = rand() * size
    ctx.globalAlpha = 0.08 + rand() * 0.25
    ctx.strokeStyle = grayscale ? pickLocal(rand, ['#333', '#555', '#aaa']) : pickLocal(rand, ['#231b16', '#3c2a22', '#745540', '#8a6549'])
    ctx.lineWidth = 0.7 + rand() * 3.5
    ctx.beginPath()
    ctx.moveTo(x, -10)
    let y = 0
    while (y < size + 10) {
      y += 15 + rand() * 40
      ctx.lineTo(x + (rand() - 0.5) * 12, y)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function paintWood(ctx, size) {
  const rand = mulberry32(512)
  ctx.fillStyle = '#5b3927'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 180; i += 1) {
    const y = rand() * size
    ctx.globalAlpha = 0.05 + rand() * 0.14
    ctx.strokeStyle = pickLocal(rand, ['#2f2018', '#7a5035', '#986344', '#3c281e'])
    ctx.lineWidth = 0.5 + rand() * 2.3
    ctx.beginPath()
    ctx.moveTo(-20, y)
    for (let x = 0; x < size + 40; x += 30) {
      ctx.lineTo(x, y + Math.sin((x + rand() * 50) * 0.025) * (2 + rand() * 5))
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

const stoneMap = makeTexture(768, (ctx, size) => paintStone(ctx, size, false))
stoneMap.repeat.set(1.15, 1.15)
const stoneBump = makeTexture(768, (ctx, size) => paintStone(ctx, size, true), THREE.NoColorSpace)
stoneBump.repeat.set(1.15, 1.15)
const mossMap = makeTexture(512, paintMoss)
mossMap.repeat.set(1.5, 1.5)
const barkMap = makeTexture(512, (ctx, size) => paintBark(ctx, size, false))
barkMap.repeat.set(1.4, 2.7)
const barkBump = makeTexture(512, (ctx, size) => paintBark(ctx, size, true), THREE.NoColorSpace)
barkBump.repeat.set(1.4, 2.7)
const woodMap = makeTexture(768, paintWood)
woodMap.repeat.set(3, 2)

const stoneColors = ['#8b7764', '#81705f', '#9b846d', '#77685b', '#907966', '#a08972']
const stoneMaterials = stoneColors.map((color) => new THREE.MeshStandardMaterial({ color, map: stoneMap, bumpMap: stoneBump, bumpScale: 0.14, roughness: 0.98 }))
const stoneDark = new THREE.MeshStandardMaterial({ color: '#51463d', map: stoneMap, bumpMap: stoneBump, bumpScale: 0.13, roughness: 1 })
const paleStone = new THREE.MeshStandardMaterial({ color: '#b1a184', map: stoneMap, bumpMap: stoneBump, bumpScale: 0.09, roughness: 0.96 })
const paleStoneDark = new THREE.MeshStandardMaterial({ color: '#8d7e67', map: stoneMap, bumpMap: stoneBump, bumpScale: 0.09, roughness: 0.99 })
const soilMaterial = new THREE.MeshStandardMaterial({ color: '#57432f', map: stoneMap, roughness: 1 })
const mossMaterials = ['#485527', '#5c6831', '#717a39', '#878548'].map((color) => new THREE.MeshStandardMaterial({ color, map: mossMap, bumpMap: mossMap, bumpScale: 0.07, roughness: 1 }))
const barkMaterial = new THREE.MeshStandardMaterial({ color: '#68503b', map: barkMap, bumpMap: barkBump, bumpScale: 0.13, roughness: 1 })
const grassMaterials = ['#766f32', '#8a8038', '#5c6a34'].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 1 }))
const woodMaterial = new THREE.MeshStandardMaterial({ color: '#6d4630', map: woodMap, roughness: 0.82 })

function cast(mesh) { mesh.castShadow = true; mesh.receiveShadow = true; return mesh }

function irregularStoneShape(width, depth) {
  const hw = width / 2, hd = depth / 2
  const points = [
    [-hw + rr(-0.03, 0.05), -hd + rr(-0.03, 0.04)], [-hw * 0.25 + rr(-0.04, 0.04), -hd + rr(-0.035, 0.035)],
    [hw * 0.35 + rr(-0.04, 0.04), -hd + rr(-0.035, 0.035)], [hw + rr(-0.04, 0.03), -hd + rr(-0.03, 0.05)],
    [hw + rr(-0.035, 0.035), -hd * 0.1 + rr(-0.05, 0.05)], [hw + rr(-0.04, 0.03), hd + rr(-0.04, 0.03)],
    [hw * 0.25 + rr(-0.05, 0.05), hd + rr(-0.035, 0.035)], [-hw * 0.35 + rr(-0.05, 0.05), hd + rr(-0.035, 0.035)],
    [-hw + rr(-0.03, 0.04), hd + rr(-0.04, 0.03)], [-hw + rr(-0.035, 0.035), hd * 0.05 + rr(-0.05, 0.05)],
  ]
  const shape = new THREE.Shape(); shape.moveTo(points[0][0], points[0][1]); for (let i = 1; i < points.length; i += 1) shape.lineTo(points[i][0], points[i][1]); shape.closePath(); return shape
}

function createSlab(x, z, row, col) {
  const width = rr(0.90, 0.98), depth = rr(0.90, 0.98), height = rr(0.075, 0.13)
  const geometry = new THREE.ExtrudeGeometry(irregularStoneShape(width, depth), { depth: height, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.022, bevelSegments: 2, curveSegments: 1, steps: 1 })
  geometry.rotateX(-Math.PI / 2); geometry.computeVertexNormals()
  const mesh = cast(new THREE.Mesh(geometry, stoneMaterials[(row * 3 + col) % stoneMaterials.length]))
  mesh.position.set(x + rr(-0.028, 0.028), 0.055 + rr(-0.016, 0.026), z + rr(-0.028, 0.028)); mesh.rotation.y = rr(-0.018, 0.018); mesh.rotation.x = rr(-0.008, 0.008); mesh.rotation.z = rr(-0.008, 0.008)
  return { mesh, height }
}

function addSurfaceCrack(parent, x, y, z, length = 0.33) {
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(x - length / 2, y, z), new THREE.Vector3(x + rr(-0.04, 0.04), y + 0.002, z + rr(-0.07, 0.07)), new THREE.Vector3(x + length / 2, y, z + rr(-0.08, 0.08))])
  const crack = new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.007, 5, false), stoneDark); crack.castShadow = false; parent.add(crack)
}

function buildMossInstances(parent) {
  const geometry = new THREE.IcosahedronGeometry(1, 2), groups = mossMaterials.map((mat) => new THREE.InstancedMesh(geometry, mat, 190)), d = new THREE.Object3D(), counts = new Array(groups.length).fill(0)
  groups.forEach((mesh) => { mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh) })
  function place(x, y, z, sx, sy, sz, materialIndex) { const index = materialIndex % groups.length, slot = counts[index]++; d.position.set(x, y, z); d.rotation.set(rr(-0.3, 0.3), rr(0, Math.PI), rr(-0.3, 0.3)); d.scale.set(sx, sy, sz); d.updateMatrix(); groups[index].setMatrixAt(slot, d.matrix) }
  for (let i = 0; i < 470; i += 1) {
    let x = rr(-5.05, 5.05), z = rr(-4.02, 4.02); const central = Math.abs(x) < 4.55 && Math.abs(z) < 3.55
    if (central && random() < 0.82) { if (random() < 0.5) x = Math.round(x + 0.5) - 0.5 + rr(-0.07, 0.07); else z = Math.round(z + 0.5) - 0.5 + rr(-0.07, 0.07) }
    const scale = rr(0.035, central ? 0.095 : 0.15); place(x, rr(0.10, 0.145), z, scale * rr(0.8, 1.7), scale * rr(0.22, 0.55), scale * rr(0.8, 1.7), Math.floor(random() * mossMaterials.length))
  }
  groups.forEach((mesh, i) => { mesh.count = counts[i]; mesh.instanceMatrix.needsUpdate = true })
}

function buildGrass(parent) {
  const geo = new THREE.ConeGeometry(0.012, 0.16, 5, 1), meshes = grassMaterials.map((mat) => new THREE.InstancedMesh(geo, mat, 360)), counts = new Array(meshes.length).fill(0), d = new THREE.Object3D(); meshes.forEach((m) => { m.castShadow = true; parent.add(m) })
  for (let tuft = 0; tuft < 155; tuft += 1) {
    const perimeter = random() < 0.72; let cx = rr(-4.95, 4.95), cz = rr(-3.92, 3.92)
    if (perimeter) { const side = Math.floor(random() * 4); if (side === 0) cz = rr(3.48, 3.93); if (side === 1) cz = rr(-3.93, -3.48); if (side === 2) cx = rr(-4.95, -4.48); if (side === 3) cx = rr(4.48, 4.95) }
    const matIndex = Math.floor(random() * meshes.length)
    for (let blade = 0; blade < 6 && counts[matIndex] < 360; blade += 1) { const slot = counts[matIndex]++; d.position.set(cx + rr(-0.055, 0.055), 0.15 + rr(0, 0.035), cz + rr(-0.055, 0.055)); d.rotation.set(rr(-0.35, 0.35), rr(0, Math.PI), rr(-0.35, 0.35)); d.scale.set(rr(0.55, 1.05), rr(0.6, 1.45), rr(0.55, 1.05)); d.updateMatrix(); meshes[matIndex].setMatrixAt(slot, d.matrix) }
  }
  meshes.forEach((m, i) => { m.count = counts[i]; m.instanceMatrix.needsUpdate = true })
}

function buildRubble(parent) {
  const geo = new THREE.DodecahedronGeometry(1, 1), mesh = new THREE.InstancedMesh(geo, stoneDark, 240), d = new THREE.Object3D(); mesh.castShadow = true; mesh.receiveShadow = true
  for (let i = 0; i < 240; i += 1) { const side = Math.floor(random() * 4); let x = rr(-5.0, 5.0), z = rr(-3.95, 3.95); if (random() < 0.7) { if (side === 0) z = rr(3.45, 3.95); if (side === 1) z = rr(-3.95, -3.45); if (side === 2) x = rr(-5.0, -4.45); if (side === 3) x = rr(4.45, 5.0) } const s = rr(0.025, 0.09); d.position.set(x, 0.11 + rr(0, 0.04), z); d.rotation.set(rr(0, Math.PI), rr(0, Math.PI), rr(0, Math.PI)); d.scale.set(s * rr(0.7, 1.6), s * rr(0.35, 0.85), s * rr(0.7, 1.6)); d.updateMatrix(); mesh.setMatrixAt(i, d.matrix) }
  parent.add(mesh)
}

function tubeBetween(points, radius, material, radialSegments = 14) { const curve = new THREE.CatmullRomCurve3(points); return cast(new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(16, points.length * 10), radius, radialSegments, false), material)) }

function lichenGeometry(radius, phase) {
  const geo = new THREE.IcosahedronGeometry(radius, 3), p = geo.attributes.position
  for (let i = 0; i < p.count; i += 1) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), len = Math.max(0.0001, Math.hypot(x, y, z)), nx = x / len, ny = y / len, nz = z / len; const n = Math.sin(nx * 8.7 + phase) + Math.sin(ny * 11.4 - phase * 0.7) + Math.sin(nz * 9.5 + nx * 3.2) + 0.6 * Math.sin((nx + ny - nz) * 15.0 + phase); const scale = 0.84 + n * 0.045; p.setXYZ(i, x * scale, y * scale, z * scale) }
  geo.computeVertexNormals(); return geo
}

function buildTree(parent) {
  const tree = new THREE.Group(); tree.position.set(0.35, 0.1, -2.45)
  const mound = cast(new THREE.Mesh(new THREE.SphereGeometry(1.25, 64, 32), soilMaterial)); mound.scale.set(1.28, 0.32, 1.02); mound.position.y = -0.24; tree.add(mound)
  tree.add(tubeBetween([new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(0.06, 0.7, 0.02), new THREE.Vector3(-0.03, 1.35, -0.04), new THREE.Vector3(0.02, 1.95, 0.02)], 0.17, barkMaterial, 18))
  const branchEnds = [[-0.86, 2.28, 0.02], [0.82, 2.34, 0.16], [-0.52, 2.65, -0.48], [0.48, 2.72, 0.48], [-0.88, 2.48, -0.32], [0.76, 2.58, -0.42]]
  branchEnds.forEach(([x, y, z], i) => { const start = i < 2 ? new THREE.Vector3(0, 1.35, 0) : new THREE.Vector3(0.02, 1.82, 0.02); tree.add(tubeBetween([start, new THREE.Vector3(x * 0.5, y - 0.35, z * 0.5), new THREE.Vector3(x, y, z)], rr(0.045, 0.075), barkMaterial, 12)) })
  for (let i = 0; i < 10; i += 1) { const a = (i / 10) * Math.PI * 2 + rr(-0.14, 0.14); tree.add(tubeBetween([new THREE.Vector3(0, 0.16, 0), new THREE.Vector3(Math.cos(a) * 0.45, 0.08, Math.sin(a) * 0.4), new THREE.Vector3(Math.cos(a) * rr(0.85, 1.25), 0.02, Math.sin(a) * rr(0.72, 1.05))], rr(0.027, 0.05), barkMaterial, 10)) }
  const clusters = [[-0.85, 2.36, 0.03, 0.72, 0.62, 0.68], [0.78, 2.47, 0.18, 0.72, 0.60, 0.68], [-0.45, 2.78, -0.42, 0.78, 0.66, 0.72], [0.43, 2.83, 0.43, 0.72, 0.62, 0.70], [-0.83, 2.61, -0.35, 0.68, 0.58, 0.64], [0.02, 2.62, -0.04, 0.90, 0.75, 0.82], [0.86, 2.70, -0.30, 0.62, 0.54, 0.61], [-0.12, 3.05, 0.15, 0.65, 0.56, 0.62], [-0.56, 2.98, 0.24, 0.56, 0.48, 0.55], [0.54, 3.02, -0.14, 0.54, 0.47, 0.55], [-0.92, 2.78, 0.30, 0.48, 0.42, 0.49], [0.95, 2.48, 0.46, 0.46, 0.40, 0.48]]
  clusters.forEach(([x, y, z, sx, sy, sz], i) => { const mesh = cast(new THREE.Mesh(lichenGeometry(1, i * 1.71), mossMaterials[i % mossMaterials.length])); mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); mesh.rotation.set(rr(-0.25, 0.25), rr(0, Math.PI), rr(-0.25, 0.25)); tree.add(mesh) })
  const smallGeo = new THREE.IcosahedronGeometry(1, 2), small = new THREE.InstancedMesh(smallGeo, mossMaterials[3], 95), d = new THREE.Object3D(); small.castShadow = true
  for (let i = 0; i < 95; i += 1) { const theta = rr(0, Math.PI * 2), phi = rr(0.25, Math.PI - 0.25), rad = rr(0.55, 1.15), s = rr(0.055, 0.13); d.position.set(Math.cos(theta) * Math.sin(phi) * rad * 0.9, 2.66 + Math.cos(phi) * rad * 0.55, Math.sin(theta) * Math.sin(phi) * rad * 0.76); d.scale.set(s * rr(0.7, 1.4), s * rr(0.6, 1.1), s * rr(0.7, 1.4)); d.rotation.set(rr(0, Math.PI), rr(0, Math.PI), rr(0, Math.PI)); d.updateMatrix(); small.setMatrixAt(i, d.matrix) }
  tree.add(small); parent.add(tree)
}

function flutedGeometry(radius, height) { const geo = new THREE.CylinderGeometry(radius * 0.91, radius, height, 96, 12, false), pos = geo.attributes.position; for (let i = 0; i < pos.count; i += 1) { const x = pos.getX(i), z = pos.getZ(i), len = Math.hypot(x, z); if (len < radius * 0.6) continue; const angle = Math.atan2(z, x), groove = 1 - 0.045 * (0.5 + 0.5 * Math.cos(angle * 18)); pos.setX(i, x * groove); pos.setZ(i, z * groove) } geo.computeVertexNormals(); return geo }

function addColumn(parent, x, z, height = 1.25, broken = false, rotation = 0) {
  const g = new THREE.Group(); g.position.set(x, 0.10, z); g.rotation.y = rotation
  const parts = [[new THREE.CylinderGeometry(0.32, 0.38, 0.09, 64), paleStoneDark, 0.045], [new THREE.CylinderGeometry(0.27, 0.32, 0.08, 64), paleStone, 0.13], [new THREE.BoxGeometry(0.44, 0.09, 0.44), paleStone, 0.215], [new THREE.CylinderGeometry(0.21, 0.24, 0.08, 64), paleStoneDark, 0.30]]
  parts.forEach(([geo, mat, y]) => { const m = cast(new THREE.Mesh(geo, mat)); m.position.y = y; g.add(m) })
  const shaftHeight = broken ? height * rr(0.42, 0.72) : height, shaft = cast(new THREE.Mesh(flutedGeometry(0.165, shaftHeight), paleStone)); shaft.position.y = 0.35 + shaftHeight / 2; g.add(shaft)
  if (!broken) { const neck = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.16, 0.10, 64), paleStoneDark)); neck.position.y = 0.38 + shaftHeight; g.add(neck); const cap = cast(new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.10, 0.43), paleStone)); cap.position.y = 0.47 + shaftHeight; g.add(cap); const cap2 = cast(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.34), paleStoneDark)); cap2.position.y = 0.55 + shaftHeight; g.add(cap2) }
  else for (let i = 0; i < 6; i += 1) { const chip = cast(new THREE.Mesh(new THREE.DodecahedronGeometry(rr(0.025, 0.05), 1), paleStoneDark)); chip.position.set(rr(-0.11, 0.11), 0.36 + shaftHeight + rr(-0.025, 0.035), rr(-0.11, 0.11)); g.add(chip) }
  parent.add(g)
}

function addFallenColumn(parent, x, z, length, rotation) { const g = new THREE.Group(); g.position.set(x, 0.19, z); g.rotation.y = rotation; const shaft = cast(new THREE.Mesh(flutedGeometry(0.15, length), paleStone)); shaft.rotation.z = Math.PI / 2; shaft.position.x = length * 0.12; g.add(shaft); const base = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.32, 0.11, 64), paleStoneDark)); base.rotation.z = Math.PI / 2; base.position.x = -length * 0.48; g.add(base); parent.add(g) }

function buildBackdrop(parent) {
  const canvas = document.createElement('canvas'); canvas.width = 900; canvas.height = 520; const ctx = canvas.getContext('2d'), grad = ctx.createLinearGradient(0, 0, 900, 520); grad.addColorStop(0, '#7d2928'); grad.addColorStop(0.45, '#a3423a'); grad.addColorStop(1, '#5c3046'); ctx.fillStyle = grad; ctx.fillRect(0, 0, 900, 520); ctx.globalAlpha = 0.20; ctx.fillStyle = '#e6c3bf'; ctx.beginPath(); ctx.ellipse(560, 190, 270, 115, -0.18, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 0.22; ctx.fillStyle = '#471e24'; ctx.beginPath(); ctx.moveTo(75, 350); ctx.lineTo(320, 90); ctx.lineTo(540, 330); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; const screen = new THREE.Mesh(new THREE.PlaneGeometry(12, 6.8), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })); screen.position.set(0, 3.2, -6.1); parent.add(screen)
}

function buildDiorama(world) {
  const board = new THREE.Group(); board.name = 'fidelity-board-v3'
  const table = cast(new THREE.Mesh(new THREE.BoxGeometry(17, 0.32, 13), woodMaterial)); table.position.y = -0.48; board.add(table)
  const base = cast(new THREE.Mesh(new THREE.BoxGeometry(10.65, 0.22, 8.55), new THREE.MeshStandardMaterial({ color: '#171613', roughness: 0.95 }))); base.position.y = -0.20; board.add(base)
  const earth = cast(new THREE.Mesh(new THREE.BoxGeometry(10.35, 0.19, 8.25), soilMaterial)); earth.position.y = -0.07; board.add(earth)
  for (let row = 0; row < 7; row += 1) for (let col = 0; col < 9; col += 1) { const x = col - 4, z = row - 3, { mesh, height } = createSlab(x, z, row, col); board.add(mesh); if (random() < 0.35) addSurfaceCrack(board, x + rr(-0.15, 0.15), 0.058 + height + 0.005, z + rr(-0.12, 0.12), rr(0.16, 0.42)) }
  buildMossInstances(board); buildGrass(board); buildRubble(board); buildTree(board)
  const cols = [[-3.65, -2.42, 1.20, false, 0.05], [-2.88, 1.92, 0.88, true, -0.1], [-4.18, 0.05, 1.30, false, 0.02], [3.46, -2.08, 1.30, false, -0.08], [4.08, 1.86, 1.12, false, 0.08], [2.86, 2.52, 0.78, true, 0]]; cols.forEach((c) => addColumn(board, ...c)); addFallenColumn(board, 3.35, 3.0, 1.28, -0.35); addFallenColumn(board, -2.75, -3.16, 1.0, 0.48)
  ;[[-4.25, -1.65, 0.62], [3.62, -2.82, 0.55], [4.22, 0.12, 0.47]].forEach(([x, z, s], k) => { const shrub = new THREE.Group(); shrub.position.set(x, 0.15, z); for (let i = 0; i < 7; i += 1) { const m = cast(new THREE.Mesh(lichenGeometry(0.22, k * 10 + i), mossMaterials[(k + i + 1) % mossMaterials.length])); m.position.set(rr(-0.22, 0.22), rr(0.08, 0.5), rr(-0.18, 0.18)); m.scale.set(s * rr(0.6, 1.1), s * rr(0.75, 1.4), s * rr(0.6, 1.1)); shrub.add(m) } board.add(shrub) })
  buildBackdrop(board); world.add(board); return board
}

function replaceBoard() {
  const scene = globalThis.__dndScene; if (!scene) return
  const world = scene.children.find((child) => child?.isGroup); if (!world) return
  const originalBoard = world.children.find((child) => child?.isGroup && child.name !== 'fidelity-board-v3'); if (originalBoard) world.remove(originalBoard)
  if (!world.getObjectByName('fidelity-board-v3')) buildDiorama(world)
  scene.fog = new THREE.FogExp2('#5a382c', 0.017); scene.background = new THREE.Color('#5f3d31')
  const renderer = globalThis.__dndRenderer; if (renderer) renderer.toneMappingExposure = 1.34
}

window.addEventListener('load', () => setTimeout(replaceBoard, 40))
