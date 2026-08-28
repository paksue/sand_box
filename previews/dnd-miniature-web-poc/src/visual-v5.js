import * as THREE from 'three'

// v5 comparison-driven detail pass layered on top of v4.
// Goal: break the remaining CG look with lacy hobby foliage, dark real-world
// grout seams, micro-flock, and granular stone surface breakup.

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(0xf011a6e5)
const rr = (a, b) => a + (b - a) * rand()
const pick = (items) => items[Math.floor(rand() * items.length)]

function makeLichenTexture(size = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, size, size)

  // Fine tangled skeleton, inspired by physical reindeer-lichen foliage.
  const colors = ['#7e8737', '#929744', '#a5a553', '#6b7931', '#b1ae61', '#596928']
  ctx.lineCap = 'round'
  for (let i = 0; i < 1500; i += 1) {
    const cx = size * (0.15 + rand() * 0.70)
    const cy = size * (0.15 + rand() * 0.70)
    const radius = 4 + rand() * 40
    const branches = 2 + Math.floor(rand() * 5)
    ctx.globalAlpha = 0.32 + rand() * 0.62
    ctx.strokeStyle = pick(colors)
    ctx.lineWidth = 0.7 + rand() * 3.0
    for (let b = 0; b < branches; b += 1) {
      let x = cx + rr(-radius * 0.22, radius * 0.22)
      let y = cy + rr(-radius * 0.22, radius * 0.22)
      ctx.beginPath(); ctx.moveTo(x, y)
      const a = rand() * Math.PI * 2
      for (let s = 0; s < 3 + Math.floor(rand() * 5); s += 1) {
        const step = radius * rr(0.12, 0.32)
        x += Math.cos(a + rr(-1.0, 1.0)) * step
        y += Math.sin(a + rr(-1.0, 1.0)) * step
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  // Tiny spongey tips soften the linework.
  for (let i = 0; i < 2600; i += 1) {
    const a = rand() * Math.PI * 2
    const radial = Math.sqrt(rand()) * size * 0.39
    const x = size * 0.5 + Math.cos(a) * radial
    const y = size * 0.5 + Math.sin(a) * radial
    ctx.globalAlpha = 0.28 + rand() * 0.62
    ctx.fillStyle = pick(colors)
    ctx.beginPath(); ctx.arc(x, y, 0.5 + rand() * 2.3, 0, Math.PI * 2); ctx.fill()
  }
  ctx.globalAlpha = 1

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

const lichenTexture = makeLichenTexture()
const lichenMaterial = new THREE.MeshStandardMaterial({
  map: lichenTexture,
  color: '#a3a65a',
  roughness: 1,
  side: THREE.DoubleSide,
  alphaTest: 0.16,
  transparent: false,
  depthWrite: true,
})

const deepGrout = new THREE.MeshStandardMaterial({ color: '#292720', roughness: 1 })
const dirtMat = new THREE.MeshStandardMaterial({ color: '#493d31', roughness: 1 })
const flockColors = ['#58672d', '#6f7934', '#83833a', '#969044', '#4a5b27']
const flockMats = flockColors.map((color) => new THREE.MeshStandardMaterial({ color, roughness: 1 }))
const strawMats = ['#8e8037', '#a19243', '#716c31', '#9e8c39'].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 1 }))

function findBoard() {
  const scene = globalThis.__dndScene
  if (!scene) return null
  let found = null
  scene.traverse((obj) => {
    if (obj.name === 'fidelity-board-v4') found = obj
  })
  return found
}

function findTree(board) {
  return board.children.find((obj) => obj.isGroup && Math.abs(obj.position.x + 0.62) < 0.12 && Math.abs(obj.position.z + 2.50) < 0.15)
}

function softenExistingTree(tree) {
  // Large v4 canopy bodies are only dark interior mass now; the visible surface
  // comes from the lichen cards below.
  tree.traverse((obj) => {
    if (!obj.isMesh || obj.isInstancedMesh) return
    if (obj.position.y > 2.0 && (obj.geometry?.type === 'SphereGeometry' || obj.geometry?.type === 'IcosahedronGeometry')) {
      obj.scale.multiplyScalar(0.69)
      if (obj.material?.color) obj.material.color.multiplyScalar(0.72)
    }
  })
}

function addLichenCanopy(tree) {
  const centers = [
    [-0.82, 2.43, 0.03, 0.72, 0.58, 0.67], [0.70, 2.50, 0.18, 0.70, 0.57, 0.65],
    [-0.42, 2.78, -0.42, 0.76, 0.62, 0.70], [0.40, 2.82, 0.41, 0.72, 0.60, 0.68],
    [-0.76, 2.65, -0.32, 0.66, 0.54, 0.61], [0.02, 2.62, -0.03, 0.86, 0.70, 0.80],
    [0.78, 2.72, -0.28, 0.60, 0.50, 0.58], [-0.12, 3.00, 0.14, 0.64, 0.53, 0.60],
  ]

  const cards = new THREE.Group()
  cards.name = 'lichen-card-canopy-v5'
  for (let i = 0; i < 230; i += 1) {
    const c = centers[Math.floor(rand() * centers.length)]
    const [cx, cy, cz, sx, sy, sz] = c
    const theta = rr(0, Math.PI * 2)
    const u = rr(-1, 1)
    const ring = Math.sqrt(1 - u * u)
    const radial = Math.pow(rand(), 0.42)
    const x = cx + Math.cos(theta) * ring * sx * radial
    const y = cy + u * sy * radial
    const z = cz + Math.sin(theta) * ring * sz * radial
    const size = rr(0.18, 0.52)
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(size * rr(0.75, 1.4), size), lichenMaterial)
    plane.position.set(x, y, z)
    plane.rotation.set(rr(-1.0, 1.0), rr(0, Math.PI), rr(-1.0, 1.0))
    plane.castShadow = i % 3 === 0
    plane.receiveShadow = true
    cards.add(plane)
  }
  tree.add(cards)

  // Fine dangling pieces that create the characteristic fuzzy lower edge.
  const strandGeo = new THREE.CylinderGeometry(0.004, 0.008, 0.16, 5, 1)
  const strandMats = [flockMats[2], flockMats[3], flockMats[1]]
  const strands = strandMats.map((m) => new THREE.InstancedMesh(strandGeo, m, 190))
  const counts = new Array(strands.length).fill(0)
  const dummy = new THREE.Object3D()
  strands.forEach((m) => { m.castShadow = true; tree.add(m) })
  for (let i = 0; i < 520; i += 1) {
    const c = centers[Math.floor(rand() * centers.length)]
    const mi = Math.floor(rand() * strands.length)
    if (counts[mi] >= 190) continue
    const slot = counts[mi]++
    dummy.position.set(c[0] + rr(-c[3] * 0.85, c[3] * 0.85), c[1] + rr(-c[4] * 0.78, c[4] * 0.25), c[2] + rr(-c[5] * 0.82, c[5] * 0.82))
    dummy.rotation.set(rr(-0.30, 0.30), rr(0, Math.PI), rr(-0.30, 0.30))
    dummy.scale.set(rr(0.6, 1.1), rr(0.45, 1.7), rr(0.6, 1.1))
    dummy.updateMatrix(); strands[mi].setMatrixAt(slot, dummy.matrix)
  }
  strands.forEach((m, i) => { m.count = counts[i]; m.instanceMatrix.needsUpdate = true })
}

function addDeepSeams(board) {
  // Broken, very dark grout emphasizes that these are individual physical slabs.
  for (let col = -4; col < 4; col += 1) {
    const x = col + 0.5
    for (let row = -3; row <= 3; row += 1) {
      if (rand() < 0.08) continue
      const seg = new THREE.Mesh(new THREE.BoxGeometry(rr(0.018, 0.035), 0.010, rr(0.68, 0.96)), deepGrout)
      seg.position.set(x + rr(-0.025, 0.025), 0.170, row + rr(-0.04, 0.04)); seg.rotation.y = rr(-0.025, 0.025); board.add(seg)
    }
  }
  for (let row = -3; row < 3; row += 1) {
    const z = row + 0.5
    for (let col = -4; col <= 4; col += 1) {
      if (rand() < 0.08) continue
      const seg = new THREE.Mesh(new THREE.BoxGeometry(rr(0.68, 0.96), 0.010, rr(0.018, 0.035)), deepGrout)
      seg.position.set(col + rr(-0.04, 0.04), 0.171, z + rr(-0.025, 0.025)); seg.rotation.y = rr(-0.025, 0.025); board.add(seg)
    }
  }
}

function addMicroFlock(board) {
  const geo = new THREE.IcosahedronGeometry(1, 1)
  const moss = flockMats.map((mat) => new THREE.InstancedMesh(geo, mat, 520))
  const counts = new Array(moss.length).fill(0)
  const dummy = new THREE.Object3D()
  moss.forEach((m) => { m.castShadow = false; m.receiveShadow = true; board.add(m) })

  for (let i = 0; i < 2050; i += 1) {
    const edge = rand() < 0.68
    let x = rr(-5.03, 5.03), z = rr(-3.98, 3.98)
    if (edge) {
      const side = Math.floor(rand() * 4)
      if (side === 0) z = rr(3.30, 3.98)
      if (side === 1) z = rr(-3.98, -3.30)
      if (side === 2) x = rr(-5.03, -4.30)
      if (side === 3) x = rr(4.30, 5.03)
    } else if (rand() < 0.86) {
      if (rand() < 0.5) x = Math.round(x + 0.5) - 0.5 + rr(-0.055, 0.055)
      else z = Math.round(z + 0.5) - 0.5 + rr(-0.055, 0.055)
    }
    const mi = Math.floor(rand() * moss.length)
    if (counts[mi] >= 520) continue
    const slot = counts[mi]++
    const s = rr(0.010, edge ? 0.055 : 0.030)
    dummy.position.set(x, rr(0.166, 0.198), z)
    dummy.rotation.set(rr(0, Math.PI), rr(0, Math.PI), rr(0, Math.PI))
    dummy.scale.set(s * rr(0.7, 1.6), s * rr(0.18, 0.50), s * rr(0.7, 1.6))
    dummy.updateMatrix(); moss[mi].setMatrixAt(slot, dummy.matrix)
  }
  moss.forEach((m, i) => { m.count = counts[i]; m.instanceMatrix.needsUpdate = true })

  const bladeGeo = new THREE.ConeGeometry(0.006, 0.11, 4, 1)
  const blades = strawMats.map((mat) => new THREE.InstancedMesh(bladeGeo, mat, 560))
  const bladeCounts = new Array(blades.length).fill(0)
  blades.forEach((m) => { m.castShadow = false; board.add(m) })
  for (let tuft = 0; tuft < 280; tuft += 1) {
    const side = Math.floor(rand() * 4)
    let cx = rr(-4.95, 4.95), cz = rr(-3.90, 3.90)
    if (side === 0) cz = rr(3.30, 3.92)
    if (side === 1) cz = rr(-3.92, -3.30)
    if (side === 2) cx = rr(-4.95, -4.30)
    if (side === 3) cx = rr(4.30, 4.95)
    const mi = Math.floor(rand() * blades.length)
    for (let b = 0; b < 8 && bladeCounts[mi] < 560; b += 1) {
      const slot = bladeCounts[mi]++
      dummy.position.set(cx + rr(-0.05, 0.05), 0.18 + rr(0, 0.025), cz + rr(-0.05, 0.05))
      dummy.rotation.set(rr(-0.28, 0.28), rr(0, Math.PI), rr(-0.28, 0.28))
      dummy.scale.set(rr(0.5, 1), rr(0.55, 1.6), rr(0.5, 1)); dummy.updateMatrix(); blades[mi].setMatrixAt(slot, dummy.matrix)
    }
  }
  blades.forEach((m, i) => { m.count = bladeCounts[i]; m.instanceMatrix.needsUpdate = true })
}

function addStoneDust(board) {
  const dustGeo = new THREE.CircleGeometry(1, 10)
  const dust = new THREE.InstancedMesh(dustGeo, dirtMat, 240)
  const dummy = new THREE.Object3D()
  for (let i = 0; i < 240; i += 1) {
    const s = rr(0.012, 0.060)
    dummy.position.set(rr(-4.35, 4.35), 0.181, rr(-3.34, 3.34))
    dummy.rotation.set(-Math.PI / 2, 0, rr(0, Math.PI))
    dummy.scale.set(s * rr(0.5, 1.8), s * rr(0.35, 1.0), 1)
    dummy.updateMatrix(); dust.setMatrixAt(i, dummy.matrix)
  }
  dust.instanceMatrix.needsUpdate = true; dust.castShadow = false; board.add(dust)
}

function applyV5() {
  const board = findBoard()
  if (!board || board.getObjectByName('v5-detail-pass')) return false
  const marker = new THREE.Group(); marker.name = 'v5-detail-pass'; board.add(marker)
  const tree = findTree(board)
  if (tree) {
    softenExistingTree(tree)
    addLichenCanopy(tree)
  }
  addDeepSeams(board)
  addMicroFlock(board)
  addStoneDust(board)

  const renderer = globalThis.__dndRenderer
  if (renderer) renderer.toneMappingExposure = 1.45
  return true
}

let tries = 0
const timer = setInterval(() => {
  tries += 1
  if (applyV5() || tries > 80) clearInterval(timer)
}, 75)
