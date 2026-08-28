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
const hud = document.querySelector('.hud')
const input = document.querySelector('#file-input')
const clearButton = document.querySelector('#clear-button')
const assetList = document.querySelector('#asset-list')
const dropCallout = document.querySelector('#drop-callout')
const dropOverlay = document.querySelector('#drop-overlay')
const status = document.querySelector('#status')

const scene = new THREE.Scene()
scene.background = new THREE.Color('#18130e')
scene.fog = new THREE.FogExp2('#18130e', 0.026)

const camera = new THREE.PerspectiveCamera(40, 1, 0.04, 160)
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.65 : 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.22
renderer.outputColorSpace = THREE.SRGBColorSpace

const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.028).texture

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.065
controls.target.set(0, 0.55, 0)
controls.minDistance = 2
controls.maxDistance = 32
controls.minPolarAngle = 0.08
controls.maxPolarAngle = Math.PI / 2.015
controls.update()

scene.add(new THREE.HemisphereLight('#c7d2df', '#2b1d12', 1.36))

const key = new THREE.DirectionalLight('#fff0d5', 5.5)
key.position.set(5.8, 9.5, 5.2)
key.castShadow = true
key.shadow.mapSize.set(window.innerWidth < 700 ? 2048 : 3072, window.innerWidth < 700 ? 2048 : 3072)
key.shadow.camera.near = 0.1
key.shadow.camera.far = 34
key.shadow.camera.left = -8
key.shadow.camera.right = 8
key.shadow.camera.top = 8
key.shadow.camera.bottom = -8
key.shadow.bias = -0.0001
key.shadow.normalBias = 0.025
scene.add(key)

const fill = new THREE.DirectionalLight('#a7c1ef', 1.15)
fill.position.set(-5.5, 4.2, -4.4)
scene.add(fill)

const warmRim = new THREE.PointLight('#ffbd78', 42, 18, 2)
warmRim.position.set(2.7, 4.7, -5.7)
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

const rand = mulberry32(0x51a8d14f)
const r = (min, max) => min + (max - min) * rand()
const choose = (items) => items[Math.floor(rand() * items.length)]

function makeCanvasTexture(size, painter, colorSpace = THREE.SRGBColorSpace) {
  const el = document.createElement('canvas')
  el.width = el.height = size
  const ctx = el.getContext('2d')
  painter(ctx, size)
  const texture = new THREE.CanvasTexture(el)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = colorSpace
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
  return texture
}

function paintStone(ctx, size, palette, seed, bumpOnly = false) {
  const random = mulberry32(seed)
  ctx.fillStyle = bumpOnly ? '#7e7e7e' : palette.base
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < size * 80; i += 1) {
    const x = random() * size
    const y = random() * size
    const radius = 0.25 + random() * 2.8
    const alpha = 0.02 + random() * 0.09
    ctx.globalAlpha = alpha
    if (bumpOnly) {
      const v = 80 + Math.floor(random() * 110)
      ctx.fillStyle = `rgb(${v},${v},${v})`
    } else {
      ctx.fillStyle = chooseWithRandom(palette.flecks, random)
    }
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let i = 0; i < 55; i += 1) {
    const startX = random() * size
    const startY = random() * size
    let x = startX
    let y = startY
    ctx.globalAlpha = bumpOnly ? 0.24 : 0.18
    ctx.strokeStyle = bumpOnly ? '#303030' : palette.crack
    ctx.lineWidth = 0.35 + random() * 1.1
    ctx.beginPath()
    ctx.moveTo(x, y)
    const segments = 2 + Math.floor(random() * 5)
    for (let s = 0; s < segments; s += 1) {
      x += (random() - 0.5) * 34
      y += (random() - 0.5) * 34
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  for (let i = 0; i < 22; i += 1) {
    ctx.globalAlpha = bumpOnly ? 0.08 : 0.04
    ctx.strokeStyle = bumpOnly ? '#d0d0d0' : palette.highlight
    ctx.lineWidth = 0.8 + random() * 2.3
    ctx.beginPath()
    const y = random() * size
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(size * 0.32, y + (random() - 0.5) * 30, size * 0.7, y + (random() - 0.5) * 24, size, y + (random() - 0.5) * 20)
    ctx.stroke()
  }

  ctx.globalAlpha = 1
}

function chooseWithRandom(items, random) {
  return items[Math.floor(random() * items.length)]
}

const stonePalette = {
  base: '#746b5f',
  flecks: ['#a99a83', '#4c463e', '#8c806e', '#5e574e', '#c0b49e'],
  crack: '#2d2a26',
  highlight: '#d0c5b0',
}
const palePalette = {
  base: '#9a8f78',
  flecks: ['#c6b99f', '#6e6658', '#aa9e86', '#d4c9b3', '#817768'],
  crack: '#50493f',
  highlight: '#e2d9c6',
}

const stoneMap = makeCanvasTexture(768, (ctx, size) => paintStone(ctx, size, stonePalette, 11, false))
stoneMap.repeat.set(1.15, 1.15)
const stoneBump = makeCanvasTexture(768, (ctx, size) => paintStone(ctx, size, stonePalette, 12, true), THREE.NoColorSpace)
stoneBump.repeat.set(1.15, 1.15)
const paleMap = makeCanvasTexture(768, (ctx, size) => paintStone(ctx, size, palePalette, 21, false))
paleMap.repeat.set(1.3, 1.8)
const paleBump = makeCanvasTexture(768, (ctx, size) => paintStone(ctx, size, palePalette, 22, true), THREE.NoColorSpace)
paleBump.repeat.set(1.3, 1.8)

const soilMap = makeCanvasTexture(512, (ctx, size) => {
  const random = mulberry32(31)
  ctx.fillStyle = '#463728'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < size * 75; i += 1) {
    const v = 50 + Math.floor(random() * 85)
    ctx.globalAlpha = 0.02 + random() * 0.12
    ctx.fillStyle = `rgb(${v + 20},${v + 5},${Math.max(20, v - 18)})`
    ctx.beginPath()
    ctx.arc(random() * size, random() * size, 0.3 + random() * 2.8, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
})
soilMap.repeat.set(4.5, 4.5)

const mossStamp = makeCanvasTexture(384, (ctx, size) => {
  const random = mulberry32(44)
  ctx.clearRect(0, 0, size, size)
  for (let i = 0; i < 520; i += 1) {
    const a = random() * Math.PI * 2
    const radius = Math.pow(random(), 0.62) * size * 0.42
    const x = size * 0.5 + Math.cos(a) * radius * rFrom(random, 0.45, 1)
    const y = size * 0.5 + Math.sin(a) * radius * rFrom(random, 0.45, 1)
    const dot = 0.7 + random() * 3.7
    ctx.globalAlpha = 0.18 + random() * 0.65
    ctx.fillStyle = chooseWithRandom(['#5f6e32', '#75843d', '#87944b', '#3f5127', '#a29b55'], random)
    ctx.beginPath()
    ctx.arc(x, y, dot, 0, Math.PI * 2)
    ctx.fill()
  }
  for (let i = 0; i < 85; i += 1) {
    ctx.globalAlpha = 0.3 + random() * 0.45
    ctx.strokeStyle = chooseWithRandom(['#768440', '#9a9650', '#56662f'], random)
    ctx.lineWidth = 0.6 + random() * 1.6
    ctx.beginPath()
    let x = size * (0.25 + random() * 0.5)
    let y = size * (0.25 + random() * 0.5)
    ctx.moveTo(x, y)
    for (let j = 0; j < 4; j += 1) {
      x += (random() - 0.5) * 28
      y += (random() - 0.5) * 28
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
})

function rFrom(random, min, max) {
  return min + (max - min) * random()
}

const foliageMap = makeCanvasTexture(512, (ctx, size) => {
  const random = mulberry32(77)
  ctx.clearRect(0, 0, size, size)
  for (let i = 0; i < 1150; i += 1) {
    const angle = random() * Math.PI * 2
    const radius = Math.pow(random(), 0.72) * size * 0.43
    const x = size * 0.5 + Math.cos(angle) * radius * rFrom(random, 0.55, 1)
    const y = size * 0.5 + Math.sin(angle) * radius * rFrom(random, 0.55, 1)
    const dot = 0.7 + random() * 3
    ctx.globalAlpha = 0.1 + random() * 0.75
    ctx.fillStyle = chooseWithRandom(['#4d5a25', '#697631', '#7e843c', '#92964a', '#38451f', '#a19b55'], random)
    ctx.beginPath()
    ctx.arc(x, y, dot, 0, Math.PI * 2)
    ctx.fill()
  }
  for (let i = 0; i < 240; i += 1) {
    ctx.globalAlpha = 0.18 + random() * 0.55
    ctx.strokeStyle = chooseWithRandom(['#626f32', '#7e843b', '#9b9550', '#485823'], random)
    ctx.lineWidth = 0.5 + random() * 1.5
    ctx.beginPath()
    let x = size * (0.24 + random() * 0.52)
    let y = size * (0.24 + random() * 0.52)
    ctx.moveTo(x, y)
    for (let j = 0; j < 3 + Math.floor(random() * 4); j += 1) {
      x += (random() - 0.5) * 22
      y += (random() - 0.5) * 22
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
})

const leafMap = makeCanvasTexture(256, (ctx, size) => {
  const random = mulberry32(99)
  ctx.clearRect(0, 0, size, size)
  for (let i = 0; i < 90; i += 1) {
    const x = size * (0.18 + random() * 0.64)
    const y = size * (0.15 + random() * 0.7)
    const rx = 3 + random() * 10
    const ry = rx * (1.7 + random())
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((random() - 0.5) * Math.PI)
    ctx.globalAlpha = 0.4 + random() * 0.6
    ctx.fillStyle = chooseWithRandom(['#3f6d2c', '#538137', '#6c9547', '#294e24', '#7ca15a'], random)
    ctx.beginPath()
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  ctx.globalAlpha = 1
})

function standardMaterial({ color = '#fff', map = null, bumpMap = null, bumpScale = 0, roughness = 0.9, metalness = 0 }) {
  return new THREE.MeshStandardMaterial({ color, map, bumpMap, bumpScale, roughness, metalness })
}

const stoneMat = standardMaterial({ color: '#958a7a', map: stoneMap, bumpMap: stoneBump, bumpScale: 0.11, roughness: 0.97 })
const stoneDarkMat = standardMaterial({ color: '#736a5e', map: stoneMap, bumpMap: stoneBump, bumpScale: 0.13, roughness: 0.99 })
const stoneWarmMat = standardMaterial({ color: '#a0907c', map: stoneMap, bumpMap: stoneBump, bumpScale: 0.1, roughness: 0.96 })
const paleStoneMat = standardMaterial({ color: '#b6aa91', map: paleMap, bumpMap: paleBump, bumpScale: 0.08, roughness: 0.95 })
const paleStoneDarkMat = standardMaterial({ color: '#8d826d', map: paleMap, bumpMap: paleBump, bumpScale: 0.09, roughness: 0.98 })
const soilMat = standardMaterial({ color: '#6d5840', map: soilMap, bumpMap: soilMap, bumpScale: 0.16, roughness: 1 })
const barkMat = standardMaterial({ color: '#66503c', map: soilMap, bumpMap: soilMap, bumpScale: 0.11, roughness: 1 })
const blackBaseMat = standardMaterial({ color: '#1d1b18', roughness: 0.84 })

const mossCardMat = new THREE.MeshStandardMaterial({
  color: '#829047',
  map: mossStamp,
  alphaMap: mossStamp,
  transparent: true,
  alphaTest: 0.18,
  roughness: 1,
  side: THREE.DoubleSide,
  depthWrite: false,
})
const foliageMat = new THREE.MeshStandardMaterial({
  color: '#829048',
  map: foliageMap,
  alphaMap: foliageMap,
  transparent: true,
  alphaTest: 0.16,
  roughness: 1,
  side: THREE.DoubleSide,
})
const leafMat = new THREE.MeshStandardMaterial({
  color: '#6f984d',
  map: leafMap,
  alphaMap: leafMap,
  transparent: true,
  alphaTest: 0.18,
  roughness: 1,
  side: THREE.DoubleSide,
})

function castReceive(mesh) {
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function addRock(parent, x, y, z, scale = 0.1, material = stoneDarkMat) {
  const geometry = new THREE.DodecahedronGeometry(1, 1)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i += 1) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i)
    const wobble = 0.78 + rand() * 0.42
    v.multiplyScalar(wobble)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geometry.computeVertexNormals()
  const mesh = castReceive(new THREE.Mesh(geometry, material))
  mesh.position.set(x, y, z)
  mesh.scale.set(scale * r(0.65, 1.5), scale * r(0.38, 0.9), scale * r(0.65, 1.45))
  mesh.rotation.set(r(-0.5, 0.5), r(0, Math.PI), r(-0.35, 0.35))
  parent.add(mesh)
  return mesh
}

function addMossCard(parent, x, y, z, radius = 0.16, verticalTilt = 0) {
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), mossCardMat)
  plane.position.set(x, y, z)
  plane.rotation.set(-Math.PI / 2 + verticalTilt, 0, r(0, Math.PI))
  plane.scale.set(r(0.65, 1.45), r(0.5, 1.2), 1)
  parent.add(plane)
}

function addGrassTuft(parent, x, y, z, size = 0.12, greener = false) {
  const group = new THREE.Group()
  group.position.set(x, y, z)
  const grassMat = new THREE.MeshStandardMaterial({
    color: greener ? choose(['#536d35', '#668241', '#78904b']) : choose(['#897b39', '#9a8d43', '#6d7135']),
    roughness: 1,
    side: THREE.DoubleSide,
  })
  for (let i = 0; i < 14; i += 1) {
    const blade = new THREE.Mesh(new THREE.PlaneGeometry(size * r(0.07, 0.14), size * r(0.65, 1.5)), grassMat)
    blade.position.set(r(-size * 0.28, size * 0.28), size * r(0.28, 0.58), r(-size * 0.28, size * 0.28))
    blade.rotation.set(r(-0.45, 0.45), r(0, Math.PI), r(-0.45, 0.45))
    group.add(blade)
  }
  parent.add(group)
}

function createStoneTile(x, z, row, col) {
  const width = r(0.86, 0.97)
  const depth = r(0.86, 0.97)
  const height = r(0.10, 0.17)
  const material = (row + col) % 5 === 0 ? stoneWarmMat : ((row + col) % 3 === 0 ? stoneDarkMat : stoneMat)
  const tile = castReceive(new THREE.Mesh(new RoundedBoxGeometry(width, height, depth, 3, 0.035), material))
  tile.position.set(x + r(-0.04, 0.04), height * 0.5 - 0.015 + r(-0.026, 0.028), z + r(-0.04, 0.04))
  tile.rotation.set(r(-0.026, 0.026), r(-0.022, 0.022), r(-0.02, 0.02))

  if (rand() < 0.16) {
    const chip = new THREE.Mesh(new THREE.BoxGeometry(r(0.11, 0.22), r(0.035, 0.07), r(0.08, 0.19)), stoneDarkMat)
    chip.position.set(tile.position.x + r(-0.35, 0.35), tile.position.y + height * 0.48, tile.position.z + r(-0.35, 0.35))
    chip.rotation.y = r(0, Math.PI)
    castReceive(chip)
    world.add(chip)
  }
  return tile
}

function makeFlutedGeometry(radiusTop, radiusBottom, height, flutes = 16) {
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 64, 10, false)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const radial = Math.hypot(x, z)
    if (radial > 0.02) {
      const angle = Math.atan2(z, x)
      const groove = 1 - 0.055 * (0.5 + 0.5 * Math.cos(flutes * angle))
      pos.setX(i, x * groove)
      pos.setZ(i, z * groove)
    }
  }
  geometry.computeVertexNormals()
  return geometry
}

function addColumn(parent, x, z, height = 1.25, broken = false, rot = 0) {
  const group = new THREE.Group()
  group.position.set(x, 0.08, z)
  group.rotation.y = rot

  const layers = [
    [new THREE.CylinderGeometry(0.34, 0.39, 0.09, 48), paleStoneDarkMat, 0.045],
    [new THREE.CylinderGeometry(0.29, 0.34, 0.09, 48), paleStoneMat, 0.125],
    [new RoundedBoxGeometry(0.47, 0.09, 0.47, 4, 0.018), paleStoneMat, 0.205],
    [new THREE.CylinderGeometry(0.22, 0.25, 0.08, 48), paleStoneDarkMat, 0.285],
  ]
  for (const [geo, mat, y] of layers) {
    const mesh = castReceive(new THREE.Mesh(geo, mat))
    mesh.position.y = y
    group.add(mesh)
  }

  const shaftHeight = broken ? height * r(0.42, 0.72) : height
  const shaft = castReceive(new THREE.Mesh(makeFlutedGeometry(0.155, 0.175, shaftHeight), paleStoneMat))
  shaft.position.y = 0.35 + shaftHeight * 0.5
  group.add(shaft)

  const ring1 = castReceive(new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.025, 12, 48), paleStoneDarkMat))
  ring1.rotation.x = Math.PI / 2
  ring1.position.y = 0.36
  group.add(ring1)

  if (!broken) {
    const neck = castReceive(new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.16, 0.10, 48), paleStoneDarkMat))
    neck.position.y = 0.36 + shaftHeight + 0.05
    group.add(neck)
    const echinus = castReceive(new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.20, 0.12, 48), paleStoneMat))
    echinus.position.y = 0.36 + shaftHeight + 0.15
    group.add(echinus)
    const capital = castReceive(new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.13, 0.52, 4, 0.025), paleStoneMat))
    capital.position.y = 0.36 + shaftHeight + 0.265
    group.add(capital)
    const capTop = castReceive(new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.07, 0.46, 3, 0.015), paleStoneDarkMat))
    capTop.position.y = 0.36 + shaftHeight + 0.36
    group.add(capTop)
  } else {
    for (let i = 0; i < 5; i += 1) {
      addRock(group, r(-0.13, 0.13), 0.36 + shaftHeight + r(-0.02, 0.05), r(-0.13, 0.13), r(0.035, 0.07), paleStoneDarkMat)
    }
  }

  for (let i = 0; i < 5; i += 1) {
    addMossCard(group, r(-0.28, 0.28), 0.35 + r(0, shaftHeight * 0.55), r(-0.28, 0.28), r(0.05, 0.11), r(-0.5, 0.5))
  }

  parent.add(group)
  return group
}

function addFallenColumn(parent, x, z, length = 1.5, rot = 0) {
  const group = new THREE.Group()
  group.position.set(x, 0.18, z)
  group.rotation.y = rot
  group.rotation.z = Math.PI / 2
  const shaft = castReceive(new THREE.Mesh(makeFlutedGeometry(0.17, 0.18, length), paleStoneMat))
  group.add(shaft)
  const ring = castReceive(new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.03, 12, 48), paleStoneDarkMat))
  ring.rotation.y = Math.PI / 2
  ring.position.y = length * 0.49
  group.add(ring)
  parent.add(group)
  for (let i = 0; i < 8; i += 1) {
    addRock(parent, x + r(-0.75, 0.75), r(0.045, 0.11), z + r(-0.34, 0.34), r(0.04, 0.11), paleStoneDarkMat)
  }
}

function cylinderBetween(a, b, radius, mat, radialSegments = 20) {
  const delta = new THREE.Vector3().subVectors(b, a)
  const length = delta.length()
  const mesh = castReceive(new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.76, radius, length, radialSegments, 3), mat))
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.clone().normalize())
  return mesh
}

function addFoliageCluster(parent, center, size = 1) {
  const group = new THREE.Group()
  group.position.copy(center)
  const planes = 7
  for (let i = 0; i < planes; i += 1) {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(size * r(0.8, 1.25), size * r(0.65, 1.0)), foliageMat)
    plane.position.set(r(-size * 0.18, size * 0.18), r(-size * 0.16, size * 0.16), r(-size * 0.18, size * 0.18))
    plane.rotation.set(r(-0.55, 0.55), r(0, Math.PI), r(-0.55, 0.55))
    plane.castShadow = i < 3
    group.add(plane)
  }
  parent.add(group)
}

function createTree(parent, x, z) {
  const group = new THREE.Group()
  group.position.set(x, 0, z)

  const mound = castReceive(new THREE.Mesh(new THREE.SphereGeometry(1.35, 48, 28), soilMat))
  mound.scale.set(1.25, 0.42, 1)
  mound.position.y = -0.36
  group.add(mound)

  for (let i = 0; i < 24; i += 1) {
    const angle = rand() * Math.PI * 2
    const radius = r(0.22, 1.18)
    addMossCard(group, Math.cos(angle) * radius, r(0.005, 0.035), Math.sin(angle) * radius, r(0.11, 0.28))
  }
  for (let i = 0; i < 18; i += 1) {
    const angle = rand() * Math.PI * 2
    const radius = r(0.35, 1.25)
    addGrassTuft(group, Math.cos(angle) * radius, 0.035, Math.sin(angle) * radius, r(0.08, 0.16), rand() > 0.6)
  }

  const trunkBase = new THREE.Vector3(0, 0.02, 0)
  const trunkMid = new THREE.Vector3(0.05, 0.95, -0.03)
  const trunkTop = new THREE.Vector3(-0.06, 1.86, 0.06)
  const trunk1 = cylinderBetween(trunkBase, trunkMid, 0.18, barkMat, 28)
  const trunk2 = cylinderBetween(trunkMid, trunkTop, 0.135, barkMat, 28)
  group.add(trunk1, trunk2)

  const branchTargets = [
    new THREE.Vector3(-0.9, 2.2, 0.05),
    new THREE.Vector3(0.75, 2.35, 0.28),
    new THREE.Vector3(-0.25, 2.65, -0.55),
    new THREE.Vector3(0.35, 2.7, 0.55),
    new THREE.Vector3(-0.75, 2.48, -0.32),
  ]
  branchTargets.forEach((target, i) => {
    const start = i < 2 ? trunkMid.clone().add(new THREE.Vector3(0, 0.48, 0)) : trunkTop.clone().add(new THREE.Vector3(0, -0.15, 0))
    group.add(cylinderBetween(start, target, r(0.055, 0.095), barkMat, 18))
  })

  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2 + r(-0.2, 0.2)
    const end = new THREE.Vector3(Math.cos(angle) * r(0.75, 1.3), 0.02, Math.sin(angle) * r(0.62, 1.05))
    const root = cylinderBetween(new THREE.Vector3(0, 0.15, 0), end, r(0.035, 0.07), barkMat, 14)
    group.add(root)
  }

  const clusters = [
    [-0.88, 2.35, 0.04, 1.15],
    [0.74, 2.5, 0.22, 1.05],
    [-0.26, 2.83, -0.48, 1.15],
    [0.32, 2.86, 0.48, 1.0],
    [-0.7, 2.63, -0.35, 0.95],
    [0.02, 2.5, 0.0, 1.25],
    [0.85, 2.75, -0.3, 0.8],
  ]
  clusters.forEach(([cx, cy, cz, size]) => addFoliageCluster(group, new THREE.Vector3(cx, cy, cz), size))

  parent.add(group)
}

function createShrub(parent, x, z, scale = 1) {
  const group = new THREE.Group()
  group.position.set(x, 0.05, z)
  for (let i = 0; i < 11; i += 1) {
    const angle = r(0, Math.PI * 2)
    const height = r(0.45, 0.95) * scale
    const start = new THREE.Vector3(r(-0.08, 0.08), 0, r(-0.08, 0.08))
    const end = new THREE.Vector3(Math.cos(angle) * r(0.05, 0.22), height, Math.sin(angle) * r(0.05, 0.22))
    group.add(cylinderBetween(start, end, 0.012 * scale, barkMat, 8))
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(r(0.28, 0.44) * scale, r(0.34, 0.55) * scale), leafMat)
    plane.position.copy(end).add(new THREE.Vector3(0, r(-0.04, 0.06), 0))
    plane.rotation.set(r(-0.5, 0.5), r(0, Math.PI), r(-0.5, 0.5))
    group.add(plane)
  }
  parent.add(group)
}

function createBoard() {
  const board = new THREE.Group()
  world.add(board)

  const slab = castReceive(new THREE.Mesh(new RoundedBoxGeometry(10.9, 0.23, 8.9, 5, 0.07), blackBaseMat))
  slab.position.y = -0.18
  board.add(slab)

  const soil = castReceive(new THREE.Mesh(new RoundedBoxGeometry(10.55, 0.18, 8.55, 5, 0.06), soilMat))
  soil.position.y = -0.08
  board.add(soil)

  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const x = col - 4
      const z = row - 3
      const tile = createStoneTile(x, z, row, col)
      board.add(tile)

      if (rand() < 0.24) addMossCard(board, x + r(-0.42, 0.42), r(0.09, 0.13), z + r(-0.42, 0.42), r(0.06, 0.15))
      if (rand() < 0.13) addGrassTuft(board, x + r(-0.43, 0.43), 0.12, z + r(-0.43, 0.43), r(0.055, 0.105), rand() > 0.72)
    }
  }

  for (let i = 0; i < 70; i += 1) {
    const edge = Math.floor(rand() * 4)
    let x
    let z
    if (edge === 0) { x = r(-5.05, 5.05); z = r(3.45, 4.05) }
    else if (edge === 1) { x = r(-5.05, 5.05); z = r(-4.05, -3.45) }
    else if (edge === 2) { x = r(-5.05, -4.45); z = r(-3.5, 3.5) }
    else { x = r(4.45, 5.05); z = r(-3.5, 3.5) }
    if (rand() < 0.62) addMossCard(board, x, r(0.03, 0.08), z, r(0.10, 0.25))
    if (rand() < 0.56) addGrassTuft(board, x, 0.055, z, r(0.07, 0.16), rand() > 0.5)
    if (rand() < 0.42) addRock(board, x + r(-0.15, 0.15), r(0.04, 0.09), z + r(-0.15, 0.15), r(0.035, 0.095))
  }

  const columns = [
    [-3.55, -2.45, 1.15, false, 0.1],
    [-2.85, 1.9, 0.82, true, -0.12],
    [-4.25, 0.05, 1.36, false, 0.04],
    [3.45, -2.05, 1.27, false, -0.1],
    [4.0, 1.88, 1.1, false, 0.08],
    [2.85, 2.55, 0.74, true, 0],
  ]
  columns.forEach(([x, z, h, broken, rot]) => addColumn(board, x, z, h, broken, rot))

  addFallenColumn(board, 3.4, 3.05, 1.38, -0.35)
  addFallenColumn(board, -2.75, -3.18, 1.05, 0.45)

  const rubbleZones = [
    [-4.1, 2.9, 0.55],
    [4.15, -2.9, 0.58],
    [-3.9, -3.05, 0.46],
    [3.65, 2.8, 0.52],
    [0.35, -3.35, 0.34],
  ]
  rubbleZones.forEach(([cx, cz, spread]) => {
    for (let i = 0; i < 12; i += 1) {
      addRock(board, cx + r(-spread, spread), r(0.035, 0.095), cz + r(-spread, spread), r(0.025, 0.1), rand() > 0.65 ? paleStoneDarkMat : stoneDarkMat)
    }
  })

  createTree(board, 0.45, -2.35)
  createShrub(board, -4.38, -1.65, 1.05)
  createShrub(board, 3.55, -2.85, 0.82)
  createShrub(board, 4.3, 0.15, 0.7)

  for (let i = 0; i < 55; i += 1) {
    const x = r(-4.8, 4.8)
    const z = r(-3.8, 3.8)
    if (rand() < 0.55) addMossCard(board, x, r(0.105, 0.14), z, r(0.035, 0.09))
  }
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
    [0, 0.08, 0.35],
    [-1.3, 0.08, -0.45],
    [1.35, 0.08, -0.45],
    [-1.45, 0.08, 1.2],
    [1.45, 0.08, 1.2],
    [0, 0.08, 2.0],
    [-2.4, 0.08, 0.4],
    [2.4, 0.08, 0.4],
  ]
  return slots[index] ?? [0, 0.08, 0]
}

function createMiniBase(index) {
  const group = new THREE.Group()
  const radius = index === 0 ? 0.45 : 0.39
  const base = castReceive(new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.98, radius, 0.12, 64), blackBaseMat))
  base.position.y = 0.06
  group.add(base)
  const top = castReceive(new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.92, radius * 0.92, 0.025, 64), stoneDarkMat))
  top.position.y = 0.132
  group.add(top)
  return { group, topY: 0.145 }
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
    mats.filter(Boolean).forEach((mat) => materials.add(mat.uuid))
  })
  return { triangles, meshes, materials: materials.size }
}

function prepareModel(root, index, topY) {
  root.updateMatrixWorld(true)
  const sourceBox = new THREE.Box3().setFromObject(root)
  const sourceSize = new THREE.Vector3()
  sourceBox.getSize(sourceSize)
  const targetHeight = index === 0 ? 1.78 : 1.48
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
    mats.forEach((mat) => {
      if (!mat) return
      if ('envMapIntensity' in mat) mat.envMapIntensity = 1.2
      mat.needsUpdate = true
    })
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
    const mats = Array.isArray(child.material) ? child.material : [child.material]
    mats.filter(Boolean).forEach((mat) => mat.dispose?.())
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
  status.textContent = loadedAssets.length ? `${loadedAssets.length} asset${loadedAssets.length === 1 ? '' : 's'} loaded` : 'Diorama terrain ready'
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
    loader.load(url, (gltf) => resolve({ gltf, url }), undefined, (error) => {
      URL.revokeObjectURL(url)
      reject(error)
    })
  })
}

async function ingestFiles(fileList) {
  const room = Math.max(0, MAX_ASSETS - loadedAssets.length)
  const files = [...fileList].filter((file) => file.name.toLowerCase().endsWith('.glb')).slice(0, room)
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
      loadedAssets.push({ id: crypto.randomUUID(), name: file.name, size: file.size, url, wrapper, stats })
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

let currentCamera = 'tabletop'
function applyCamera(mode, force = false) {
  currentCamera = mode
  const portrait = window.innerWidth < 700 && window.innerHeight > window.innerWidth
  if (mode === 'miniature') {
    camera.fov = portrait ? 52 : 40
    camera.position.set(portrait ? 5.6 : 3.6, 1.4, portrait ? 7.4 : 4.5)
    controls.target.set(0, 0.78, 0.2)
  } else if (mode === 'top') {
    camera.fov = portrait ? 50 : 39
    camera.position.set(0.01, portrait ? 18.5 : 11.2, 0.01)
    controls.target.set(0, 0, 0)
  } else {
    camera.fov = portrait ? 50 : 38
    camera.position.set(portrait ? 10.8 : 6.6, portrait ? 9.4 : 5.4, portrait ? 13.2 : 7.8)
    controls.target.set(0, 0.48, 0)
  }
  camera.updateProjectionMatrix()
  controls.update()
  if (!force) {
    document.querySelectorAll('[data-camera]').forEach((button) => button.classList.toggle('active', button.dataset.camera === mode))
  }
}

document.querySelectorAll('[data-camera]').forEach((button) => {
  button.addEventListener('click', () => applyCamera(button.dataset.camera))
})

const hudToggle = document.createElement('button')
hudToggle.type = 'button'
hudToggle.className = 'hud-toggle'
hudToggle.setAttribute('aria-label', 'Toggle renderer controls')
hudToggle.textContent = '–'
hud.append(hudToggle)

function setHudExpanded(expanded) {
  hud.classList.toggle('expanded', expanded)
  hudToggle.textContent = expanded ? '–' : '+'
}
hudToggle.addEventListener('click', () => setHudExpanded(!hud.classList.contains('expanded')))
setHudExpanded(window.innerWidth >= 700)

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

let lastPortrait = null
function resize() {
  const width = window.innerWidth
  const height = window.innerHeight
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 700 ? 1.65 : 2))
  camera.aspect = width / Math.max(height, 1)
  const portrait = width < 700 && height > width
  if (lastPortrait !== portrait) {
    applyCamera(currentCamera, true)
    lastPortrait = portrait
  } else {
    camera.updateProjectionMatrix()
  }
}
window.addEventListener('resize', resize)
resize()
applyCamera('tabletop')
status.textContent = 'Diorama terrain ready'

renderer.setAnimationLoop(() => {
  controls.update()
  renderer.render(scene, camera)
})
