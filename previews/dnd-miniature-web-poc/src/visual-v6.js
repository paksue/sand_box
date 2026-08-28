import * as THREE from 'three'

// v6: screenshot-driven correction. v5's alpha cards looked like green squares,
// so this pass removes them and replaces the visible canopy with true 3D
// instanced lichen filaments + small organic nodes.

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(0x1a1ce006)
const rr = (a, b) => a + (b - a) * rand()

const lichenColors = ['#6e7b31', '#7f8737', '#929343', '#a5a14e', '#b0a95a', '#596a2a']
const lichenMats = lichenColors.map((color) => new THREE.MeshStandardMaterial({ color, roughness: 1 }))

function findBoard() {
  const scene = globalThis.__dndScene
  if (!scene) return null
  let result = null
  scene.traverse((obj) => { if (obj.name === 'fidelity-board-v4') result = obj })
  return result
}

function findTree(board) {
  return board.children.find((obj) => obj.isGroup && Math.abs(obj.position.x + 0.62) < 0.12 && Math.abs(obj.position.z + 2.50) < 0.15)
}

function hideFailedCanopy(tree) {
  const cards = tree.getObjectByName('lichen-card-canopy-v5')
  if (cards) cards.visible = false

  // Remove the remaining large CG-looking canopy bodies from v4.
  tree.traverse((obj) => {
    if (!obj.isMesh || obj.isInstancedMesh) return
    if (obj.position.y > 2.0 && (obj.geometry?.type === 'SphereGeometry' || obj.geometry?.type === 'IcosahedronGeometry')) {
      obj.visible = false
    }
  })
}

const centers = [
  [-0.78, 2.43, 0.04, 0.72, 0.55, 0.64],
  [0.67, 2.50, 0.18, 0.69, 0.54, 0.63],
  [-0.40, 2.78, -0.40, 0.73, 0.59, 0.68],
  [0.38, 2.82, 0.40, 0.70, 0.58, 0.66],
  [-0.74, 2.66, -0.31, 0.63, 0.51, 0.59],
  [0.00, 2.62, -0.03, 0.83, 0.67, 0.77],
  [0.75, 2.71, -0.28, 0.58, 0.48, 0.56],
  [-0.12, 3.00, 0.14, 0.61, 0.51, 0.58],
  [-0.52, 3.02, 0.23, 0.46, 0.40, 0.46],
  [0.47, 2.99, -0.12, 0.44, 0.38, 0.44],
]

function randomPointInCluster(c, shellBias = 0.70) {
  const [cx, cy, cz, sx, sy, sz] = c
  const theta = rr(0, Math.PI * 2)
  const u = rr(-1, 1)
  const ring = Math.sqrt(1 - u * u)
  const radius = Math.pow(rand(), shellBias)
  return new THREE.Vector3(
    cx + Math.cos(theta) * ring * sx * radius,
    cy + u * sy * radius,
    cz + Math.sin(theta) * ring * sz * radius,
  )
}

function buildLichenTangle(tree) {
  const detail = new THREE.Group()
  detail.name = 'lichen-tangle-v6'

  // Very small irregular nodes form the sponge/lichen tips.
  const nodeGeo = new THREE.IcosahedronGeometry(1, 1)
  const nodeMeshes = lichenMats.map((mat) => new THREE.InstancedMesh(nodeGeo, mat, 620))
  const nodeCounts = new Array(nodeMeshes.length).fill(0)
  const dummy = new THREE.Object3D()
  nodeMeshes.forEach((m) => { m.castShadow = true; m.receiveShadow = true; detail.add(m) })

  for (let i = 0; i < 3500; i += 1) {
    const c = centers[Math.floor(rand() * centers.length)]
    const p = randomPointInCluster(c, 0.52)
    const mi = Math.floor(rand() * nodeMeshes.length)
    if (nodeCounts[mi] >= 620) continue
    const slot = nodeCounts[mi]++
    const s = rr(0.012, 0.060)
    dummy.position.copy(p)
    dummy.rotation.set(rr(0, Math.PI), rr(0, Math.PI), rr(0, Math.PI))
    dummy.scale.set(s * rr(0.55, 1.75), s * rr(0.45, 1.35), s * rr(0.55, 1.75))
    dummy.updateMatrix(); nodeMeshes[mi].setMatrixAt(slot, dummy.matrix)
  }
  nodeMeshes.forEach((m, i) => { m.count = nodeCounts[i]; m.instanceMatrix.needsUpdate = true })

  // Short cylinders in random orientations make an open tangled lichen network.
  const filamentGeo = new THREE.CylinderGeometry(0.0045, 0.007, 1, 5, 1)
  const filamentMeshes = lichenMats.map((mat) => new THREE.InstancedMesh(filamentGeo, mat, 720))
  const filamentCounts = new Array(filamentMeshes.length).fill(0)
  filamentMeshes.forEach((m) => { m.castShadow = true; detail.add(m) })
  const up = new THREE.Vector3(0, 1, 0)

  for (let i = 0; i < 4100; i += 1) {
    const c = centers[Math.floor(rand() * centers.length)]
    const p = randomPointInCluster(c, 0.62)
    const mi = Math.floor(rand() * filamentMeshes.length)
    if (filamentCounts[mi] >= 720) continue
    const slot = filamentCounts[mi]++
    const length = rr(0.045, 0.16)
    const dir = new THREE.Vector3(rr(-1, 1), rr(-1, 1), rr(-1, 1)).normalize()
    // mild downward bias gives the shaggy hanging character in the reference
    if (rand() < 0.34) dir.y -= rr(0.25, 0.85)
    dir.normalize()
    dummy.position.copy(p)
    dummy.quaternion.setFromUnitVectors(up, dir)
    dummy.scale.set(rr(0.65, 1.2), length, rr(0.65, 1.2))
    dummy.updateMatrix(); filamentMeshes[mi].setMatrixAt(slot, dummy.matrix)
  }
  filamentMeshes.forEach((m, i) => { m.count = filamentCounts[i]; m.instanceMatrix.needsUpdate = true })

  // Sparse darker inner twigs make holes read as depth instead of transparency.
  const twigMat = new THREE.MeshStandardMaterial({ color: '#465323', roughness: 1 })
  const twigGeo = new THREE.CylinderGeometry(0.005, 0.008, 1, 5, 1)
  const twigs = new THREE.InstancedMesh(twigGeo, twigMat, 620)
  for (let i = 0; i < 620; i += 1) {
    const c = centers[Math.floor(rand() * centers.length)]
    const p = randomPointInCluster(c, 0.95)
    const length = rr(0.05, 0.20)
    const dir = new THREE.Vector3(rr(-1, 1), rr(-1, 0.25), rr(-1, 1)).normalize()
    dummy.position.copy(p); dummy.quaternion.setFromUnitVectors(up, dir); dummy.scale.set(rr(0.6, 1), length, rr(0.6, 1)); dummy.updateMatrix(); twigs.setMatrixAt(i, dummy.matrix)
  }
  twigs.instanceMatrix.needsUpdate = true; twigs.castShadow = true; detail.add(twigs)
  tree.add(detail)
}

function tuneExistingV5(board) {
  // v5 ground density helped, but it was too bright. Darken just the very light
  // micro-flock materials without changing the underlying v4 board.
  board.traverse((obj) => {
    if (!obj.isInstancedMesh || !obj.material?.color) return
    const c = obj.material.color
    if (c.g > c.r * 0.95 && c.g > c.b * 1.25 && c.getHSL({ h: 0, s: 0, l: 0 }).l > 0.42) {
      c.multiplyScalar(0.78)
    }
  })
}

function applyV6() {
  const board = findBoard()
  if (!board || board.getObjectByName('v6-marker')) return false
  const tree = findTree(board)
  if (!tree) return false
  const marker = new THREE.Group(); marker.name = 'v6-marker'; board.add(marker)
  hideFailedCanopy(tree)
  buildLichenTangle(tree)
  tuneExistingV5(board)
  const renderer = globalThis.__dndRenderer
  if (renderer) renderer.toneMappingExposure = 1.33
  return true
}

let tries = 0
const timer = setInterval(() => {
  tries += 1
  if (applyV6() || tries > 100) clearInterval(timer)
}, 80)
