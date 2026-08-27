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
scene.background = new THREE.Color('#12100d')
scene.fog = new THREE.Fog('#12100d', 11, 20)

const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 100)
camera.position.set(4.8, 3.1, 5.8)

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
renderer.toneMappingExposure = 1.12
renderer.outputColorSpace = THREE.SRGBColorSpace

const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.075
controls.target.set(0, 0.72, 0.15)
controls.minDistance = 2.0
controls.maxDistance = 13
controls.minPolarAngle = 0.12
controls.maxPolarAngle = Math.PI / 2.02
controls.update()

const ambient = new THREE.AmbientLight('#d9cbb8', 0.32)
scene.add(ambient)

const key = new THREE.DirectionalLight('#fff1dc', 4.4)
key.position.set(4.6, 7.2, 4.1)
key.castShadow = true
key.shadow.mapSize.set(4096, 4096)
key.shadow.camera.near = 0.1
key.shadow.camera.far = 24
key.shadow.camera.left = -7
key.shadow.camera.right = 7
key.shadow.camera.top = 7
key.shadow.camera.bottom = -7
key.shadow.bias = -0.00008
scene.add(key)

const fill = new THREE.DirectionalLight('#b7ccff', 1.25)
fill.position.set(-5.4, 3.5, -3.1)
scene.add(fill)

const rim = new THREE.PointLight('#ffc98f', 36, 15, 2)
rim.position.set(1.8, 3.5, -4.8)
scene.add(rim)

const world = new THREE.Group()
scene.add(world)

function createMaterial(color, roughness = 0.9, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness })
}

function createBoard() {
  const board = new THREE.Group()
  world.add(board)

  const slab = new THREE.Mesh(
    new RoundedBoxGeometry(10.2, 0.24, 8.2, 6, 0.12),
    createMaterial('#181612', 0.98),
  )
  slab.position.y = -0.18
  slab.receiveShadow = true
  board.add(slab)

  const tileGeometry = new RoundedBoxGeometry(0.94, 0.085, 0.94, 4, 0.055)
  const materials = [
    createMaterial('#514b40', 0.96),
    createMaterial('#5a5245', 0.97),
    createMaterial('#474238', 0.95),
    createMaterial('#5e5648', 0.98),
  ]

  let i = 0
  for (let z = -3; z <= 3; z += 1) {
    for (let x = -4; x <= 4; x += 1) {
      const tile = new THREE.Mesh(tileGeometry, materials[i % materials.length])
      tile.position.set(x, -0.06 + (i % 3) * 0.003, z)
      tile.rotation.y = ((i % 5) - 2) * 0.003
      tile.castShadow = true
      tile.receiveShadow = true
      board.add(tile)
      i += 1
    }
  }

  addRuinedColumns(board)
}

function addRuinedColumns(parent) {
  const stone = createMaterial('#8c826f', 0.92)
  const darkStone = createMaterial('#716856', 0.96)
  const spots = [
    [-3.35, -2.15, 1.08],
    [3.25, -2.08, 0.94],
    [-3.1, 2.25, 0.72],
    [3.3, 2.15, 1.18],
  ]

  for (const [x, z, height] of spots) {
    const group = new THREE.Group()
    group.position.set(x, 0.01, z)

    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.36, 0.12, 32), darkStone)
    base1.position.y = 0.06
    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.29, 0.12, 32), stone)
    base2.position.y = 0.16
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, height, 28), stone)
    shaft.position.y = 0.22 + height / 2
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.16, 0.11, 32), darkStone)
    top.position.y = 0.25 + height

    for (const mesh of [base1, base2, shaft, top]) {
      mesh.castShadow = true
      mesh.receiveShadow = true
      group.add(mesh)
    }

    parent.add(group)
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
    [0, 0, 0],
    [-1.35, 0, -0.7],
    [1.35, 0, -0.7],
    [-1.35, 0, 1.0],
    [1.35, 0, 1.0],
    [0, 0, 1.7],
    [-2.35, 0, 0.25],
    [2.35, 0, 0.25],
  ]
  return slots[index] ?? [0, 0, 0]
}

function createMiniBase(index) {
  const group = new THREE.Group()
  const isHero = index === 0
  const radius = isHero ? 0.48 : 0.40

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.98, radius, 0.12, 64),
    createMaterial('#24211d', 0.76, 0.02),
  )
  base.position.y = 0.06
  base.castShadow = true
  base.receiveShadow = true
  group.add(base)

  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.92, radius * 0.92, 0.025, 64),
    createMaterial('#39342c', 0.96),
  )
  top.position.y = 0.132
  top.receiveShadow = true
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
    mats.filter(Boolean).forEach((material) => materials.add(material.uuid))
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
    for (const material of mats) {
      if (!material) continue
      if ('envMapIntensity' in material) material.envMapIntensity = 1.25
      material.needsUpdate = true
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
    materials.filter(Boolean).forEach((material) => material.dispose?.())
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
      camera.position.set(3.15, 1.12, 4.1)
      controls.target.set(0, 0.76, 0.15)
    } else if (mode === 'top') {
      camera.position.set(0.01, 8.6, 0.01)
      controls.target.set(0, 0, 0)
    } else {
      camera.position.set(4.8, 3.1, 5.8)
      controls.target.set(0, 0.72, 0.15)
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
