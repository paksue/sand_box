import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { WebGLPathTracer } from 'three-gpu-pathtracer'

const qs = new URLSearchParams(location.search)
const capture = qs.get('visualCapture') === '1'
if (capture) document.documentElement.classList.add('visual-capture')

THREE.ColorManagement.enabled = true
THREE.Cache.enabled = true
RectAreaLightUniformsLib.init()

const canvas = document.querySelector('#scene')
const statusEl = document.querySelector('#status')
const sampleEl = document.querySelector('#samples')
const tabletopBtn = document.querySelector('#tabletop')
const eyeBtn = document.querySelector('#eye')
const modeBtn = document.querySelector('#renderMode')

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight, false)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.70
renderer.outputColorSpace = THREE.SRGBColorSpace

const scene = new THREE.Scene()
scene.background = new THREE.Color('#39201b')
scene.environmentIntensity = 0.45

globalThis.__dndArtSpikeScene = scene

const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.02, 80)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.07
controls.minDistance = 2.4
controls.maxDistance = 18
controls.target.set(0, 0.55, 0)

let beauty = false
let beautyReady = false
let sceneReady = false

const views = {
  tabletop: { pos: [7.4, 5.55, 8.2], target: [0, 0.55, 0] },
  eye: { pos: [4.8, 0.62, 5.9], target: [-0.2, 0.62, -0.6] },
}

function setView(name) {
  const v = views[name]
  camera.position.fromArray(v.pos)
  controls.target.fromArray(v.target)
  controls.update()
  tabletopBtn?.classList.toggle('active', name === 'tabletop')
  eyeBtn?.classList.toggle('active', name === 'eye')
  if (beauty) resetBeauty()
}

setView(qs.get('view') === 'eye' ? 'eye' : 'tabletop')
tabletopBtn?.addEventListener('click', () => setView('tabletop'))
eyeBtn?.addEventListener('click', () => setView('eye'))

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
const gtao = new GTAOPass(scene, camera, innerWidth, innerHeight)
gtao.output = GTAOPass.OUTPUT.Default
gtao.blendIntensity = 0.72
gtao.updateGtaoMaterial({ radius: 0.22, distanceExponent: 1.25, thickness: 1.4, distanceFallOff: 1.0, scale: 1.0, samples: 16 })
composer.addPass(gtao)
composer.addPass(new OutputPass())

const pathTracer = new WebGLPathTracer(renderer)
pathTracer.bounces = 5
pathTracer.tiles.set(2, 2)
pathTracer.textureSize.set(2048, 2048)
pathTracer.renderDelay = 30

function resetBeauty() {
  if (!beautyReady) return
  pathTracer.updateCamera()
  pathTracer.reset()
}
controls.addEventListener('change', resetBeauty)

modeBtn?.addEventListener('click', () => {
  beauty = !beauty
  modeBtn.textContent = beauty ? 'Beauty: on' : 'Beauty: deferred'
  modeBtn.classList.toggle('active', beauty)
  if (beauty && !beautyReady) {
    try {
      pathTracer.setScene(scene, camera)
      beautyReady = true
    } catch (err) {
      beauty = false
      modeBtn.textContent = 'Beauty: deferred'
      statusEl.textContent = err.message
    }
  }
})

function phTexture(asset, map, res = '1k', ext = 'jpg') {
  return `https://dl.polyhaven.org/file/ph-assets/Textures/${ext}/${res}/${asset}/${asset}_${map}_${res}.${ext}`
}
function phModelCandidates(asset, res = '1k') {
  const path = `file/ph-assets/Models/gltf/${res}/${asset}/${asset}_${res}.gltf`
  return [`https://dl.polyhaven.org/${path}`, `https://dl.polyhaven.com/${path}`]
}

const textureLoader = new THREE.TextureLoader()
textureLoader.setCrossOrigin('anonymous')
const gltfLoader = new GLTFLoader()
gltfLoader.setCrossOrigin('anonymous')

function configureDataTexture(tex) {
  tex.colorSpace = THREE.NoColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
  return tex
}
function configureColorTexture(tex) {
  configureDataTexture(tex)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

async function loadPBR(asset, repeat = [1, 1]) {
  const entries = await Promise.allSettled([
    textureLoader.loadAsync(phTexture(asset, 'diff', '1k')),
    textureLoader.loadAsync(phTexture(asset, 'nor_gl', '1k')),
    textureLoader.loadAsync(phTexture(asset, 'rough', '1k')),
    textureLoader.loadAsync(phTexture(asset, 'disp', '1k')),
  ])
  const [diff, normal, rough, disp] = entries.map(e => e.status === 'fulfilled' ? e.value : null)
  for (const t of [diff, normal, rough, disp]) if (t) t.repeat.set(...repeat)
  if (diff) configureColorTexture(diff)
  if (normal) configureDataTexture(normal)
  if (rough) configureDataTexture(rough)
  if (disp) configureDataTexture(disp)
  return { diff, normal, rough, disp, ok: Boolean(diff && normal && rough) }
}

async function loadModel(asset, res = '1k') {
  let last
  for (const url of phModelCandidates(asset, res)) {
    try { return (await gltfLoader.loadAsync(url)).scene }
    catch (err) { last = err; console.warn('Model load failed', url, err) }
  }
  throw last || new Error(`Unable to load ${asset}`)
}

function normalizeObject(obj, targetSize) {
  const box = new THREE.Box3().setFromObject(obj)
  const size = box.getSize(new THREE.Vector3())
  obj.scale.multiplyScalar(targetSize / (Math.max(size.x, size.y, size.z) || 1))
  const box2 = new THREE.Box3().setFromObject(obj)
  const center = box2.getCenter(new THREE.Vector3())
  obj.position.x -= center.x
  obj.position.z -= center.z
  obj.position.y -= box2.min.y
  obj.traverse(o => {
    if (!o.isMesh) return
    o.castShadow = true
    o.receiveShadow = true
    if (o.material?.map) o.material.map.colorSpace = THREE.SRGBColorSpace
  })
  return obj
}
function cloneAsset(obj) {
  const c = obj.clone(true)
  c.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  return c
}

const world = new THREE.Group()
scene.add(world)
globalThis.__dndArtSpikeWorld = world

const table = new THREE.Mesh(
  new THREE.BoxGeometry(16, 0.35, 12),
  new THREE.MeshStandardMaterial({ color: '#603925', roughness: 0.79 }),
)
table.position.y = -0.48
table.receiveShadow = true
world.add(table)

const boardBase = new THREE.Mesh(
  new THREE.BoxGeometry(10.7, 0.24, 8.55),
  new THREE.MeshStandardMaterial({ color: '#181613', roughness: 0.97 }),
)
boardBase.position.y = -0.25
boardBase.castShadow = boardBase.receiveShadow = true
world.add(boardBase)

function pbrMaterial(set, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color: opts.color || '#ffffff',
    map: set.diff || null,
    normalMap: set.normal || null,
    roughnessMap: set.rough || null,
    displacementMap: set.disp || null,
    displacementScale: opts.displacementScale ?? 0,
    roughness: opts.roughness ?? 0.96,
    metalness: 0,
    normalScale: new THREE.Vector2(opts.normalScale ?? 0.65, opts.normalScale ?? 0.65),
  })
}

function addColumn(parent, x, z, h = 1.5, broken = false) {
  const g = new THREE.Group()
  g.position.set(x, 0.08, z)
  const mat = new THREE.MeshStandardMaterial({ color: '#9b8c73', roughness: 0.96 })
  const dark = new THREE.MeshStandardMaterial({ color: '#6d624f', roughness: 1 })
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.40, 0.12, 64), dark)
  base.position.y = 0.06
  g.add(base)
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.11, 0.52), mat)
  plinth.position.y = 0.17
  g.add(plinth)
  const shaftH = broken ? h * 0.58 : h
  const geo = new THREE.CylinderGeometry(0.16, 0.19, shaftH, 96, 12)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x0 = pos.getX(i), z0 = pos.getZ(i), a = Math.atan2(z0, x0)
    const groove = 1 - 0.045 * (0.5 + 0.5 * Math.cos(a * 18))
    pos.setX(i, x0 * groove); pos.setZ(i, z0 * groove)
  }
  geo.computeVertexNormals()
  const shaft = new THREE.Mesh(geo, mat)
  shaft.position.y = 0.28 + shaftH / 2
  g.add(shaft)
  if (!broken) {
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.16, 0.10, 64), dark)
    neck.position.y = 0.31 + shaftH
    g.add(neck)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.48), mat)
    cap.position.y = 0.41 + shaftH
    g.add(cap)
  }
  g.rotation.y = (x + z) * 0.07
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  parent.add(g)
}

function addDice(parent) {
  const die = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.42, 0.42, 4, 4, 4),
    new THREE.MeshPhysicalMaterial({ color: '#991719', roughness: 0.3, clearcoat: 0.25, clearcoatRoughness: 0.25 }),
  )
  die.position.set(-4.45, 0.37, 2.65)
  die.rotation.set(0.35, 0.52, 0.18)
  die.castShadow = die.receiveShadow = true
  parent.add(die)
}

function addBranch(parent, a, b, r = 0.07) {
  const d = new THREE.Vector3().subVectors(b, a)
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 0.72, r, d.length(), 20, 4),
    new THREE.MeshStandardMaterial({ color: '#513523', roughness: 0.98 }),
  )
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), d.clone().normalize())
  mesh.castShadow = mesh.receiveShadow = true
  parent.add(mesh)
}

async function build() {
  statusEl.textContent = 'Loading weathered square-stone PBR…'
  const [stone, soil] = await Promise.all([
    loadPBR('pavement_01', [1.35, 1.1]),
    loadPBR('forrest_ground_01', [2.7, 2.25]),
  ])

  const soilGeo = new THREE.PlaneGeometry(10.3, 8.15, 96, 96)
  soilGeo.rotateX(-Math.PI / 2)
  const soilMesh = new THREE.Mesh(soilGeo, pbrMaterial(soil, {
    color: '#6f7658', displacementScale: 0.045, normalScale: 0.55, roughness: 1,
  }))
  soilMesh.position.y = -0.09
  soilMesh.receiveShadow = true
  world.add(soilMesh)

  const pavingGeo = new THREE.PlaneGeometry(8.75, 6.65, 180, 136)
  pavingGeo.rotateX(-Math.PI / 2)
  const paving = new THREE.Mesh(pavingGeo, pbrMaterial(stone, {
    color: '#8f7e69', displacementScale: 0.085, normalScale: 0.72, roughness: 1,
  }))
  paving.position.y = 0.006
  paving.castShadow = paving.receiveShadow = true
  world.add(paving)

  ;[[-3.65,-2.4,1.42,false],[-4.02,0.1,1.52,false],[-2.85,2.18,1.18,true],[3.55,-2.12,1.50,false],[4.0,1.84,1.34,false],[2.8,2.55,1.08,true]].forEach(v => addColumn(world, ...v))
  addDice(world)

  let organicLoaded = 0
  statusEl.textContent = 'Loading scanned CC0 stump, moss and rocks…'

  let stump = null
  try {
    stump = normalizeObject(await loadModel('tree_stump_01', '1k'), 2.15)
    stump.position.set(0.25, 0.04, -2.45)
    stump.scale.set(1.18, 0.72, 1.12)
    world.add(stump)
    organicLoaded++
  } catch (err) { console.warn('stump unavailable', err) }

  let mossSource = null
  try {
    mossSource = normalizeObject(await loadModel('moss_01', '1k'), 0.72)
    organicLoaded++
  } catch (err) { console.warn('moss unavailable', err) }

  if (mossSource) {
    const tree = new THREE.Group()
    tree.position.set(0.28, 0.07, -2.45)
    addBranch(tree, new THREE.Vector3(0,0.15,0), new THREE.Vector3(0.02,2.15,0.01), 0.18)
    addBranch(tree, new THREE.Vector3(0.02,1.25,0.01), new THREE.Vector3(-0.86,2.35,0.12), 0.09)
    addBranch(tree, new THREE.Vector3(0.02,1.35,0.01), new THREE.Vector3(0.85,2.50,0.24), 0.085)
    addBranch(tree, new THREE.Vector3(0.02,1.72,0.01), new THREE.Vector3(-0.34,2.78,-0.48), 0.07)
    addBranch(tree, new THREE.Vector3(0.02,1.78,0.01), new THREE.Vector3(0.45,2.82,0.52), 0.065)
    world.add(tree)

    const canopyCenters = [
      [-0.82,2.35,-2.38],[-0.45,2.38,-2.65],[-0.18,2.42,-2.25],[0.18,2.42,-2.62],[0.52,2.46,-2.28],[0.88,2.43,-2.52],
      [-0.72,2.72,-2.60],[-0.38,2.72,-2.30],[-0.05,2.74,-2.52],[0.30,2.70,-2.20],[0.62,2.76,-2.56],[0.92,2.70,-2.26],
      [-0.48,3.02,-2.48],[-0.13,3.05,-2.22],[0.18,3.04,-2.56],[0.48,3.06,-2.31],[0.02,3.30,-2.42],[-0.70,2.98,-2.18],
    ]
    canopyCenters.forEach(([x,y,z], i) => {
      const c = cloneAsset(mossSource)
      const s = 0.62 + (i % 5) * 0.055
      c.scale.multiplyScalar(s)
      c.position.set(x,y,z)
      c.rotation.set((i%3)*0.64-0.55, i*0.91, (i%4)*0.47-0.6)
      world.add(c)
    })

    const edgeSpots = [
      [-4.55,-3.45,.45],[-3.75,3.58,.40],[-2.45,3.60,.34],[-1.2,3.62,.36],[1.35,3.58,.37],[2.55,3.55,.33],
      [4.48,2.55,.43],[4.50,1.20,.34],[4.49,-.45,.36],[4.40,-2.7,.42],[-4.48,1.7,.36],[-4.50,-.35,.34],
    ]
    edgeSpots.forEach(([x,z,s], i) => {
      const c = cloneAsset(mossSource)
      c.scale.multiplyScalar(s)
      c.position.set(x,0.07,z)
      c.rotation.set((i%3)*0.7, i*0.73, (i%4)*0.42)
      world.add(c)
    })
  }

  try {
    const rockRaw = normalizeObject(await loadModel('rock_moss_set_01', '1k'), 1.15)
    ;[[-4.15,.04,-1.45,.38],[3.8,.04,2.92,.34],[4.18,.04,-3.0,.31],[-2.3,.04,-3.42,.28]].forEach(([x,y,z,s], i) => {
      const r = cloneAsset(rockRaw)
      r.scale.multiplyScalar(s)
      r.position.set(x,y,z)
      r.rotation.y = i * 1.17
      world.add(r)
    })
    organicLoaded++
  } catch (err) { console.warn('rocks unavailable', err) }

  const hemi = new THREE.HemisphereLight('#ead8c5', '#241a15', 0.38)
  scene.add(hemi)
  const key = new THREE.RectAreaLight('#ffd5aa', 4.8, 5.0, 4.0)
  key.position.set(-2.8, 7.2, 4.0)
  key.lookAt(0, 0, 0)
  scene.add(key)
  const rim = new THREE.DirectionalLight('#d7c8ee', 0.42)
  rim.position.set(5, 5, -4)
  rim.castShadow = true
  rim.shadow.mapSize.set(2048,2048)
  rim.shadow.camera.left = -7; rim.shadow.camera.right = 7; rim.shadow.camera.top = 7; rim.shadow.camera.bottom = -7
  scene.add(rim)

  try {
    const hdr = await new HDRLoader().loadAsync('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr')
    hdr.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = hdr
  } catch (err) { console.warn('HDRI unavailable', err) }

  sceneReady = true
  statusEl.textContent = organicLoaded >= 2
    ? 'Raster PBR art spike loaded. Character and sculpted-column assets remain blockers.'
    : 'PBR floor loaded, but organic CC0 assets failed; spike cannot pass.'
}

build().catch(err => {
  console.error(err)
  statusEl.textContent = `Art spike failed: ${err.message}`
  throw err
})

function resize() {
  const w = innerWidth, h = innerHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  composer.setSize(w, h)
  gtao.setSize(w, h)
  if (beautyReady) resetBeauty()
}
addEventListener('resize', resize)

let frame = 0
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  if (beauty && beautyReady) {
    pathTracer.renderSample()
    if (frame++ % 8 === 0) sampleEl.textContent = `${pathTracer.samples.toFixed(0)} samples`
  } else {
    composer.render()
    sampleEl.textContent = sceneReady ? 'Raster · scanned PBR + GTAO' : 'Loading…'
  }
}
animate()
