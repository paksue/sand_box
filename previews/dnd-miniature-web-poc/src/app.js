import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

const MAX_ASSETS = 8
const canvas = document.querySelector('#scene')
const app = document.querySelector('#app')
const input = document.querySelector('#file-input')
const clearButton = document.querySelector('#clear-button')
const assetList = document.querySelector('#asset-list')
const dropCallout = document.querySelector('#drop-callout')
const dropOverlay = document.querySelector('#drop-overlay')
const status = document.querySelector('#status')

const scene = new THREE.Scene()
scene.background = new THREE.Color('#17130f')
scene.fog = new THREE.FogExp2('#17130f', 0.038)

const camera = new THREE.PerspectiveCamera(35, 1, 0.04, 120)
camera.position.set(6.3, 5.1, 7.4)

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.08
renderer.outputColorSpace = THREE.SRGBColorSpace

const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.035).texture

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.07
controls.target.set(0, 0.46, 0.15)
controls.minDistance = 1.7
controls.maxDistance = 15
controls.minPolarAngle = 0.12
controls.maxPolarAngle = Math.PI / 2.015
controls.update()

scene.add(new THREE.HemisphereLight('#b8c8dd', '#2a1d14', 1.18))

const key = new THREE.DirectionalLight('#fff0d6', 4.7)
key.position.set(5.6, 8.8, 4.6)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
key.shadow.camera.near = 0.1
key.shadow.camera.far = 26
key.shadow.camera.left = -7.5
key.shadow.camera.right = 7.5
key.shadow.camera.top = 7.5
key.shadow.camera.bottom = -7.5
key.shadow.bias = -0.00012
key.shadow.normalBias = 0.025
scene.add(key)

const fill = new THREE.DirectionalLight('#9eb8e8', 1.08)
fill.position.set(-5.5, 3.8, -3.2)
scene.add(fill)

const warmRim = new THREE.PointLight('#ffc78c', 30, 14, 2)
warmRim.position.set(2.3, 4.1, -4.7)
scene.add(warmRim)

const world = new THREE.Group()
scene.add(world)

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(0xd0d0babe)
const r = (min, max) => min + (max - min) * rand()

function makeNoiseCanvas(size, base, flecks, seed, contrast = 1) {
  const random = mulberry32(seed)
  const element = document.createElement('canvas')
  element.width = element.height = size
  const ctx = element.getContext('2d')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < size * 34; i += 1) {
    const x = random() * size
    const y = random() * size
    const radius = 0.4 + random() * 3.4
    const alpha = (0.015 + random() * 0.095) * contrast
    ctx.globalAlpha = alpha
    ctx.fillStyle = flecks[Math.floor(random() * flecks.length)]
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let i = 0; i < 34; i += 1) {
    ctx.globalAlpha = 0.025 + random() * 0.055
    ctx.strokeStyle = flecks[Math.floor(random() * flecks.length)]
    ctx.lineWidth = 0.4 + random() * 1.5
    ctx.beginPath()
    const y = random() * size
    ctx.moveTo(-20, y)
    let px = 0
    while (px < size + 20) {
      px += 15 + random() * 30
      ctx.lineTo(px, y + (random() - 0.5) * 14)
    }
    ctx.stroke()
  }

  ctx.globalAlpha = 1
  return element
}

function makeTexture(canvasElement, repeat = [1, 1]) {
  const texture = new THREE.CanvasTexture(canvasElement)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeat[0], repeat[1])
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
  return texture
}

const stoneTexture = makeTexture(
  makeNoiseCanvas(512, '#6b6254', ['#a89a82', '#38332c', '#817664', '#504a41'], 12, 1.15),
  [1.6, 1.6],
)
const paleStoneTexture = makeTexture(
  makeNoiseCanvas(512, '#887d69', ['#c0b49c', '#4a4439', '#a0927a', '#665e50'], 27, 1.05),
  [1.3, 2.1],
)
const soilTexture = makeTexture(
  makeNoiseCanvas(512, '#45392c', ['#766247', '#251f19', '#5e4c38', '#89806a'], 41, 1.35),
  [3, 3],
)
const mossTexture = makeTexture(
  makeNoiseCanvas(512, '#4f5b2d', ['#7d8d42', '#26321b', '#68783a', '#9a9b54'], 73, 1.4),
  [2.3, 2.3],
)
const barkTexture = makeTexture(
  makeNoiseCanvas(512, '#574535', ['#211a15', '#85684b', '#6d5640', '#342920'], 101, 1.25),
  [2.2, 3.4],
)

function material({ color = '#ffffff', map = null, roughness = 0.9, metalness = 0, bump = 0 }) {
  return new THREE.MeshStandardMaterial({
    color,
    map,
    bumpMap: bump ? map : null,
    bumpScale: bump,
    roughness,
    metalness,
  })
}

const stoneMat = material({ color: '#8c8374', map: stoneTexture, roughness: 0.96, bump: 0.08 })
const stoneAltMat = material({ color: '#786f62', map: stoneTexture, roughness: 0.98, bump: 0.1 })
const paleStoneMat = material({ color: '#b1a58e', map: paleStoneTexture, roughness: 0.93, bump: 0.06 })
const paleStoneDarkMat = material({ color: '#8f846f', map: paleStoneTexture, roughness: 0.97, bump: 0.08 })
const soilMat = material({ color: '#6b5941', map: soilTexture, roughness: 1, bump: 0.13 })
const mossMat = material({ color: '#768348', map: mossTexture, roughness: 1, bump: 0.1 })
const barkMat = material({ color: '#705944', map: barkTexture, roughness: 1, bump: 0.1 })
const baseMat = material({ color: '#171512', roughness: 0.98 })
const miniBaseMat = material({ color: '#27231f', roughness: 0.78, metalness: 0.015 })

function castAndReceive(mesh) {
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function addRock(parent, x, y, z, scale = 0.12, mat = stoneAltMat) {
  const geometry = new THREE.DodecahedronGeometry(1, 1)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i += 1) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i)
    const wobble = 0.82 + rand() * 0.34
    v.multiplyScalar(wobble)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geometry.computeVertexNormals()
  const rock = castAndReceive(new THREE.Mesh(geometry, mat))
  rock.position.set(x, y, z)
  rock.scale.set(scale * r(0.7, 1.35), scale * r(0.45, 0.95), scale * r(0.7, 1.4))
  rock.rotation.set(r(-0.5, 0.5), r(0, Math.PI), r(-0.3, 0.3))
  parent.add(rock)
  return rock
}

function addGrassTuft(parent, x, y, z, size = 0.13) {
  const tuft = new THREE.Group()
  tuft.position.set(x, y, z)
  const grassMat = new THREE.MeshStandardMaterial({
    color: rand() > 0.55 ? '#8f843f' : '#69733b',
    roughness: 1,
    side: THREE.DoubleSide,
  })
  for (let i = 0; i < 9; i += 1) {
    const blade = castAndReceive(new THREE.Mesh(new THREE.PlaneGeometry(size * r(0.13, 0.22), size * r(0.75, 1.3)), grassMat))
    blade.position.set(r(-size * 0.22, size * 0.22), size * r(0.35, 0.62), r(-size * 0.22, size * 0.22))
    blade.rotation.set(r(-0.25, 0.25), r(0, Math.PI), r(-0.35, 0.35))
    tuft.add(blade)
  }
  parent.add(tuft)
}

function addMossPatch(parent, x, y, z, radius = 0.13) {
  const count = 3 + Math.floor(rand() * 5)
  for (let i = 0; i < count; i += 1) {
    const moss = castAndReceive(new THREE.Mesh(new THREE.IcosahedronGeometry(radius * r(0.18, 0.42), 1), mossMat))
    moss.position.set(x + r(-radius, radius), y + r(0, 0.025), z + r(-radius, radius))
    moss.scale.y = r(0.25, 0.65)
    parent.add(moss)
  }
}

function createStoneTile(x, z, row, col) {
  const broken = rand() < 0.14
  const width = r(0.86, 0.96) * (broken ? r(0.78, 0.94) : 1)
  const depth = r(0.86, 0.96) * (broken ? r(0.78, 0.94) : 1)
  const height = r(0.105, 0.165)
  const tile = castAndReceive(new THREE.Mesh(
    new RoundedBoxGeometry(width, height, depth, 5, 0.045),
    (row + col) % 3 === 0 ? stoneAltMat : stoneMat,
  ))
  tile.position.set(x + r(-0.035, 0.035), height / 2 - 0.035 + r(-0.018, 0.026), z + r(-0.035, 0.035))
  tile.rotation.set(r(-0.018, 0.018), r(-0.018, 0.018), r(-0.015, 0.015))
  tile.scale.y = r(0.9, 1.12)
  return tile
}

function addRubbleField(parent) {
  const zones = [
    [-4.25, 2.8, 0.65],
    [4.15, -2.65, 0.7],
    [-3.75, -2.85, 0.55],
    [3.7, 2.6, 0.55],
    [0.2, -3.1, 0.36],
  ]
  zones.forEach(([cx, cz, spread]) => {
    const count = 7 + Math.floor(rand() * 8)
    for (let i = 0; i < count; i += 1) {
      addRock(parent, cx + r(-spread, spread), r(0.035, 0.08), cz + r(-spread, spread), r(0.035, 0.11))
    }
  })
}

function addFlutedShaft(group, y, height, radius, mat = paleStoneMat) {
  const shaft = castAndReceive(new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.9, radius, height, 32, 5), mat))
  shaft.position.y = y + height / 2
  group.add(shaft)

  const fluteMat = paleStoneDarkMat
  const ribs = 14
  for (let i = 0; i < ribs; i += 1) {
    const angle = (i / ribs) * Math.PI * 2
    const rib = castAndReceive(new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.045, radius * 0.055, height * 0.92, 8), fluteMat))
    rib.position.set(Math.cos(angle) * radius * 0.88, y + height * 0.5, Math.sin(angle) * radius * 0.88)
    group.add(rib)
  }
}

function createColumn(x, z, height = 1.0, broken = false, rotation = 0) {
  const group = new THREE.Group()
  group.position.set(x, 0.08, z)
  group.rotation.y = rotation

  const base1 = castAndReceive(new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.36, 0.11, 40), paleStoneDarkMat))
  base1.position.y = 0.055
  group.add(base1)
  const base2 = castAndReceive(new THREE.Mesh(new THREE.CylinderGeometry(0.255, 0.30, 0.11, 40), paleStoneMat))
  base2.position.y = 0.15
  group.add(base2)
  const plinth = castAndReceive(new THREE.Mesh(new RoundedBoxGeometry(0.43, 0.10, 0.43, 4, 0.025), paleStoneMat))
  plinth.position.y = 0.25
  group.add(plinth)

  const shaftHeight = broken ? height * r(0.48, 0.78) : height
  addFlutedShaft(group, 0.30, shaftHeight, 0.16)

  if (!broken) {
    const neck = castAndReceive(new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.15, 0.10, 32), paleStoneDarkMat))
    neck.position.y = 0.32 + shaftHeight
    group.add(neck)
    const capital = castAndReceive(new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.13, 0.38, 4, 0.035), paleStoneMat))
    capital.position.y = 0.43 + shaftHeight
    group.add(capital)
  } else {
    for (let i = 0; i < 5; i += 1) {
      const shard = addRock(group, r(-0.13, 0.13), 0.34 + shaftHeight, r(-0.13, 0.13), r(0.035, 0.07), paleStoneDarkMat)
      shard.scale.y *= 0.55
    }
  }

  world.add(group)
  return group
}

function addFallenColumn(x, z, angle = 0) {
  const group = new THREE.Group()
  group.position.set(x, 0.18, z)
  group.rotation.y = angle
  const shaft = castAndReceive(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 1.25, 30, 5), paleStoneMat))
  shaft.rotation.z = Math.PI / 2
  shaft.position.x = 0.1
  group.add(shaft)
  const cap = castAndReceive(new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.14, 0.36, 4, 0.03), paleStoneDarkMat))
  cap.position.x = 0.76
  group.add(cap)
  world.add(group)
}

function connectBranch(parent, start, end, radiusStart, radiusEnd, mat = barkMat) {
  const delta = end.clone().sub(start)
  const length = delta.length()
  const geometry = new THREE.CylinderGeometry(radiusEnd, radiusStart, length, 14, 4)
  const branch = castAndReceive(new THREE.Mesh(geometry, mat))
  branch.position.copy(start).add(end).multiplyScalar(0.5)
  branch.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.clone().normalize())
  parent.add(branch)
  return branch
}

function blobGeometry(radius = 0.4, detail = 2) {
  const geometry = new THREE.IcosahedronGeometry(radius, detail)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i += 1) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i)
    const wave = 0.87 + 0.15 * Math.sin(v.x * 12 + v.z * 7) + r(-0.045, 0.045)
    v.multiplyScalar(wave)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geometry.computeVertexNormals()
  return geometry
}

function createTree() {
  const tree = new THREE.Group()
  tree.position.set(-0.45, 0.05, -2.75)

  const mound = castAndReceive(new THREE.Mesh(new THREE.SphereGeometry(1.18, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), soilMat))
  mound.scale.set(1.35, 0.48, 1.05)
  mound.position.y = -0.04
  tree.add(mound)

  for (let i = 0; i < 26; i += 1) {
    addMossPatch(tree, r(-1.05, 1.05), r(0.02, 0.16), r(-0.72, 0.72), r(0.07, 0.17))
  }

  const trunkStart = new THREE.Vector3(0, 0.12, 0)
  const trunkTop = new THREE.Vector3(0.05, 1.82, 0.02)
  connectBranch(tree, trunkStart, trunkTop, 0.22, 0.13)

  for (let i = 0; i < 7; i += 1) {
    const angle = (i / 7) * Math.PI * 2 + r(-0.25, 0.25)
    const end = new THREE.Vector3(Math.cos(angle) * r(0.48, 0.85), 0.06, Math.sin(angle) * r(0.42, 0.76))
    connectBranch(tree, new THREE.Vector3(r(-0.06, 0.06), 0.18, r(-0.05, 0.05)), end, 0.095, 0.035)
  }

  const branchEnds = []
  for (let i = 0; i < 9; i += 1) {
    const y = r(1.05, 1.8)
    const angle = r(0, Math.PI * 2)
    const reach = r(0.42, 0.92)
    const start = new THREE.Vector3(r(-0.04, 0.08), y - r(0.15, 0.3), r(-0.04, 0.05))
    const end = new THREE.Vector3(Math.cos(angle) * reach, y + r(0.12, 0.42), Math.sin(angle) * reach)
    connectBranch(tree, start, end, r(0.07, 0.11), r(0.025, 0.045))
    branchEnds.push(end)
  }

  const foliageMats = [
    material({ color: '#65763b', map: mossTexture, roughness: 1, bump: 0.05 }),
    material({ color: '#7f8544', map: mossTexture, roughness: 1, bump: 0.05 }),
    material({ color: '#4c622f', map: mossTexture, roughness: 1, bump: 0.05 }),
  ]

  branchEnds.concat([
    new THREE.Vector3(0, 2.24, 0),
    new THREE.Vector3(0.35, 2.03, 0.2),
    new THREE.Vector3(-0.35, 2.05, -0.15),
  ]).forEach((point, index) => {
    const crown = castAndReceive(new THREE.Mesh(blobGeometry(r(0.34, 0.52), 2), foliageMats[index % foliageMats.length]))
    crown.position.copy(point)
    crown.scale.set(r(0.95, 1.35), r(0.78, 1.18), r(0.9, 1.35))
    tree.add(crown)
  })

  world.add(tree)
}

function createShrub(x, z, scale = 1) {
  const shrub = new THREE.Group()
  shrub.position.set(x, 0.08, z)
  const leafMat = material({ color: '#55783f', roughness: 0.9 })
  for (let i = 0; i < 13; i += 1) {
    const angle = r(0, Math.PI * 2)
    const height = r(0.45, 0.95) * scale
    const end = new THREE.Vector3(Math.cos(angle) * r(0.08, 0.28) * scale, height, Math.sin(angle) * r(0.08, 0.28) * scale)
    connectBranch(shrub, new THREE.Vector3(0, 0, 0), end, 0.018 * scale, 0.008 * scale, barkMat)
    for (let j = 0; j < 3; j += 1) {
      const leaf = castAndReceive(new THREE.Mesh(new THREE.SphereGeometry(r(0.055, 0.095) * scale, 10, 7), leafMat))
      leaf.scale.set(0.7, 1.55, 0.48)
      leaf.position.copy(end).multiplyScalar(r(0.55, 1.0))
      leaf.rotation.set(r(-0.8, 0.8), r(0, Math.PI), r(-0.8, 0.8))
      shrub.add(leaf)
    }
  }
  world.add(shrub)
}

function createBoard() {
  const board = new THREE.Group()
  world.add(board)

  const slab = castAndReceive(new THREE.Mesh(
    new RoundedBoxGeometry(10.65, 0.28, 8.62, 8, 0.13),
    baseMat,
  ))
  slab.position.y = -0.24
  board.add(slab)

  const earth = castAndReceive(new THREE.Mesh(
    new RoundedBoxGeometry(10.25, 0.12, 8.22, 6, 0.08),
    soilMat,
  ))
  earth.position.y = -0.08
  board.add(earth)

  let row = 0
  for (let z = -3; z <= 3; z += 1) {
    let col = 0
    for (let x = -4; x <= 4; x += 1) {
      const tile = createStoneTile(x, z, row, col)
      board.add(tile)

      if (rand() < 0.48) addMossPatch(board, x + r(-0.42, 0.42), 0.065, z + r(-0.42, 0.42), r(0.05, 0.13))
      if (rand() < 0.22) addGrassTuft(board, x + r(-0.45, 0.45), 0.09, z + r(-0.45, 0.45), r(0.07, 0.14))
      col += 1
    }
    row += 1
  }

  for (let i = 0; i < 55; i += 1) {
    const edge = rand() < 0.5
    const x = edge ? (rand() < 0.5 ? r(-5.0, -4.25) : r(4.25, 5.0)) : r(-4.9, 4.9)
    const z = edge ? r(-3.75, 3.75) : (rand() < 0.5 ? r(-3.75, -3.15) : r(3.15, 3.75))
    if (rand() < 0.62) addMossPatch(board, x, 0.0, z, r(0.08, 0.2))
    else addGrassTuft(board, x, 0.05, z, r(0.07, 0.15))
  }

  addRubbleField(board)

  createColumn(-3.65, -2.2, 1.18, false, 0.08)
  createColumn(3.55, -2.25, 0.95, true, -0.13)
  createColumn(-3.75, 2.25, 0.82, true, 0.18)
  createColumn(3.72, 2.15, 1.22, false, -0.09)
  createColumn(-1.85, 2.95, 0.72, true, 0.04)
  createColumn(1.95, 2.92, 0.86, false, -0.05)
  addFallenColumn(3.4, 1.2, 0.55)
  addFallenColumn(-2.85, 1.05, -0.48)

  createTree()
  createShrub(-4.25, -0.1, 1.0)
  createShrub(4.15, -0.85, 0.9)
}

createBoard()

const draco = new DRACOLoader()
draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
const loader = new GLTFLoader()
loader.setDRACOLoader(draco)
loader.setMeshoptDecoder(MeshoptDecoder)

const loadedAssets = []

function placement(index) {
  const slots = [
    [0.45, 0.08, 0.55],
    [-1.15, 0.08, -0.55],
    [1.55, 0.08, -0.55],
    [-1.45, 0.08, 1.15],
    [1.55, 0.08, 1.2],
    [0.1, 0.08, 2.0],
    [-2.45, 0.08, 0.25],
    [2.55, 0.08, 0.15],
  ]
  return slots[index] ?? [0, 0.08, 0]
}

function createMiniBase(index) {
  const group = new THREE.Group()
  const isHero = index === 0
  const radius = isHero ? 0.48 : 0.40

  const base = castAndReceive(new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.98, radius, 0.12, 64),
    miniBaseMat,
  ))
  base.position.y = 0.06
  group.add(base)

  const top = castAndReceive(new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.92, radius * 0.92, 0.025, 64),
    material({ color: '#443d34', map: soilTexture, roughness: 0.98, bump: 0.08 }),
  ))
  top.position.y = 0.132
  group.add(top)

  for (let i = 0; i < 7; i += 1) {
    if (rand() < 0.6) addMossPatch(group, r(-radius * 0.7, radius * 0.7), 0.15, r(-radius * 0.7, radius * 0.7), 0.045)
  }

  return { group, topY: 0.152 }
}

function analyze(root) {
  let triangles = 0
  let meshes = 0
  const materials = new Set()

  root.traverse((child) => {
    if (!child.isMesh) return
    meshes += 1
    const geometry = child.geometry
    const count = geometry?.index?.count ?? geometry?.attributes?.position?.count ?? 0
    triangles += Math.floor(count / 3)
    const mats = Array.isArray(child.material) ? child.material : [child.material]
    mats.filter(Boolean).forEach((m) => materials.add(m.uuid))
  })

  return { triangles, meshes, materials: materials.size }
}

function prepareModel(root, index, topY) {
  root.updateMatrixWorld(true)
  const sourceBox = new THREE.Box3().setFromObject(root)
  const sourceSize = new THREE.Vector3()
  sourceBox.getSize(sourceSize)

  const targetHeight = index === 0 ? 1.85 : 1.48
  const scale = targetHeight / Math.max(sourceSize.y, 0.0001)
  root.scale.setScalar(scale)
  root.updateMatrixWorld(true)

  const box = new THREE.Box3().setFromObject(root)
  const center = new THREE.Vector3()
  box.getCenter(center)

  root.position.x -= center.x
  root.position.z -= center.z
  root.position.y += topY - box.min.y

  root.traverse((child) => {
    if (!child.isMesh) return
    child.castShadow = true
    child.receiveShadow = true

    const mats = Array.isArray(child.material) ? child.material : [child.material]
    for (const m of mats) {
      if (!m) continue
      if ('envMapIntensity' in m) m.envMapIntensity = 1.2
      m.needsUpdate = true
    }
  })
}

function formatCount(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return String(value)
}

function qualityLabel(stats) {
  if (stats.triangles >= 100_000) return 'high-detail'
  if (stats.triangles >= 40_000) return 'detailed'
  return 'lightweight'
}

function updateAssetList() {
  assetList.replaceChildren()

  loadedAssets.forEach((asset) => {
    const row = document.createElement('div')
    row.className = 'asset-row'

    const meta = document.createElement('div')
    meta.className = 'asset-meta'

    const name = document.createElement('strong')
    name.textContent = asset.name

    const details = document.createElement('span')
    details.textContent = `${(asset.size / 1024 / 1024).toFixed(1)} MB · ${formatCount(asset.stats.triangles)} tris · ${asset.stats.materials} mats · ${qualityLabel(asset.stats)}`

    meta.append(name, details)

    const remove = document.createElement('button')
    remove.type = 'button'
    remove.className = 'ghost-button'
    remove.textContent = 'Remove'
    remove.addEventListener('click', () => removeAsset(asset.id))

    row.append(meta, remove)
    assetList.append(row)
  })

  dropCallout.hidden = loadedAssets.length > 0
}

function disposeObject(root) {
  root.traverse((child) => {
    if (!child.isMesh) return
    child.geometry?.dispose?.()
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.filter(Boolean).forEach((m) => m.dispose?.())
  })
}

function removeAsset(id) {
  const index = loadedAssets.findIndex((asset) => asset.id === id)
  if (index < 0) return
  const [asset] = loadedAssets.splice(index, 1)
  world.remove(asset.wrapper)
  disposeObject(asset.wrapper)
  URL.revokeObjectURL(asset.url)
  relayoutAssets()
  updateAssetList()
  status.textContent = loadedAssets.length ? `${loadedAssets.length} asset${loadedAssets.length === 1 ? '' : 's'} loaded` : 'Renderer ready'
}

function clearAssets() {
  for (const asset of [...loadedAssets]) removeAsset(asset.id)
}

function relayoutAssets() {
  loadedAssets.forEach((asset, index) => {
    const [x, y, z] = placement(index)
    asset.wrapper.position.set(x, y, z)
  })
}

function loadFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    loader.load(
      url,
      (gltf) => resolve({ gltf, url }),
      undefined,
      (error) => {
        URL.revokeObjectURL(url)
        reject(error)
      },
    )
  })
}

async function ingestFiles(fileList) {
  const room = Math.max(0, MAX_ASSETS - loadedAssets.length)
  const files = [...fileList]
    .filter((file) => file.name.toLowerCase().endsWith('.glb'))
    .slice(0, room)

  if (!files.length) {
    status.textContent = room === 0 ? `Maximum ${MAX_ASSETS} assets` : 'Choose .glb files'
    return
  }

  for (const file of files) {
    status.textContent = `Loading ${file.name}…`
    try {
      const { gltf, url } = await loadFile(file)
      const index = loadedAssets.length
      const { group: base, topY } = createMiniBase(index)
      const model = gltf.scene
      prepareModel(model, index, topY)
      base.add(model)

      const wrapper = new THREE.Group()
      wrapper.add(base)
      world.add(wrapper)

      const [x, y, z] = placement(index)
      wrapper.position.set(x, y, z)

      const stats = analyze(model)
      loadedAssets.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        url,
        wrapper,
        stats,
      })

      updateAssetList()
      status.textContent = `${file.name} loaded · ${formatCount(stats.triangles)} tris`
    } catch (error) {
      console.error(error)
      status.textContent = `Could not load ${file.name}`
    }
  }
}

input.addEventListener('change', (event) => {
  ingestFiles(event.target.files)
  event.target.value = ''
})

clearButton.addEventListener('click', clearAssets)

for (const button of document.querySelectorAll('[data-camera]')) {
  button.addEventListener('click', () => {
    const mode = button.dataset.camera
    document.querySelectorAll('[data-camera]').forEach((item) => item.classList.toggle('active', item === button))

    if (mode === 'miniature') {
      camera.position.set(3.0, 1.18, 4.15)
      controls.target.set(0.25, 0.72, 0.35)
    } else if (mode === 'top') {
      camera.position.set(0.01, 9.8, 0.01)
      controls.target.set(0, 0.15, 0)
    } else {
      camera.position.set(6.3, 5.1, 7.4)
      controls.target.set(0, 0.46, 0.15)
    }
    controls.update()
  })
}

let dragDepth = 0
app.addEventListener('dragenter', (event) => {
  event.preventDefault()
  dragDepth += 1
  dropOverlay.hidden = false
})
app.addEventListener('dragover', (event) => event.preventDefault())
app.addEventListener('dragleave', (event) => {
  event.preventDefault()
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) dropOverlay.hidden = true
})
app.addEventListener('drop', (event) => {
  event.preventDefault()
  dragDepth = 0
  dropOverlay.hidden = true
  ingestFiles(event.dataTransfer.files)
})

function resize() {
  const width = window.innerWidth
  const height = window.innerHeight
  renderer.setSize(width, height, false)
  camera.aspect = width / Math.max(height, 1)
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)
resize()

renderer.setAnimationLoop(() => {
  controls.update()
  renderer.render(scene, camera)
})
