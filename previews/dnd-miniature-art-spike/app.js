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
renderer.toneMappingExposure = 1.05
renderer.outputColorSpace = THREE.SRGBColorSpace

const scene = new THREE.Scene()
scene.background = new THREE.Color('#4b3028')

const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.02, 80)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.07
controls.minDistance = 2.4
controls.maxDistance = 18
controls.target.set(0, 0.55, 0)

const views = {
  tabletop: { pos: [7.4, 5.55, 8.2], target: [0, 0.55, 0] },
  eye: { pos: [4.8, 0.62, 5.9], target: [-0.2, 0.62, -0.6] },
}

function setView(name, instant = false) {
  const v = views[name]
  camera.position.fromArray(v.pos)
  controls.target.fromArray(v.target)
  controls.update()
  tabletopBtn?.classList.toggle('active', name === 'tabletop')
  eyeBtn?.classList.toggle('active', name === 'eye')
  if (beauty) resetBeauty()
}

setView(qs.get('view') === 'eye' ? 'eye' : 'tabletop', true)

tabletopBtn?.addEventListener('click', () => setView('tabletop'))
eyeBtn?.addEventListener('click', () => setView('eye'))

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
const gtao = new GTAOPass(scene, camera, innerWidth, innerHeight)
gtao.output = GTAOPass.OUTPUT.Default
gtao.blendIntensity = 0.82
gtao.updateGtaoMaterial({ radius: 0.26, distanceExponent: 1.35, thickness: 1.7, distanceFallOff: 1.0, scale: 1.0, samples: 16 })
composer.addPass(gtao)
composer.addPass(new OutputPass())

const pathTracer = new WebGLPathTracer(renderer)
pathTracer.bounces = 5
pathTracer.tiles.set(2, 2)
pathTracer.textureSize.set(2048, 2048)
pathTracer.renderDelay = 30
let beauty = false
let beautyReady = false
let sceneReady = false

function resetBeauty() {
  if (!beautyReady) return
  pathTracer.updateCamera()
  pathTracer.reset()
}

controls.addEventListener('change', resetBeauty)

modeBtn?.addEventListener('click', async () => {
  beauty = !beauty
  modeBtn.textContent = beauty ? 'Beauty: on' : 'Beauty: off'
  modeBtn.classList.toggle('active', beauty)
  if (beauty && !beautyReady) {
    statusEl.textContent = 'Building path-tracing scene…'
    try {
      pathTracer.setScene(scene, camera)
      beautyReady = true
      statusEl.textContent = 'Beauty mode converges while the camera is still.'
    } catch (err) {
      console.error(err)
      beauty = false
      modeBtn.textContent = 'Beauty: unavailable'
      statusEl.textContent = `Path tracer rejected this scene: ${err.message}`
    }
  }
})

function phTexture(asset, map, res = '1k', ext = 'jpg') {
  return `https://dl.polyhaven.org/file/ph-assets/Textures/${ext}/${res}/${asset}/${asset}_${map}_${res}.${ext}`
}

function phModelCandidates(asset, res = '1k') {
  const path = `file/ph-assets/Models/gltf/${res}/${asset}/${asset}_${res}.gltf`
  return [
    `https://dl.polyhaven.org/${path}`,
    `https://dl.polyhaven.com/${path}`,
  ]
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
    try {
      const gltf = await gltfLoader.loadAsync(url)
      return gltf.scene
    } catch (err) {
      last = err
      console.warn('Model load failed', url, err)
    }
  }
  throw last || new Error(`Unable to load ${asset}`)
}

function normalizeObject(obj, targetSize) {
  const box = new THREE.Box3().setFromObject(obj)
  const size = box.getSize(new THREE.Vector3())
  const max = Math.max(size.x, size.y, size.z) || 1
  obj.scale.multiplyScalar(targetSize / max)
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

const wood = new THREE.MeshStandardMaterial({ color: '#6a412d', roughness: 0.76 })
const table = new THREE.Mesh(new THREE.BoxGeometry(16, 0.35, 12), wood)
table.position.y = -0.48
table.receiveShadow = true
world.add(table)

const boardBase = new THREE.Mesh(new THREE.BoxGeometry(10.7, 0.24, 8.55), new THREE.MeshStandardMaterial({ color: '#191713', roughness: 0.96 }))
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
  const mat = new THREE.MeshStandardMaterial({ color: '#b6a78d', roughness: 0.92 })
  const dark = new THREE.MeshStandardMaterial({ color: '#82745f', roughness: 0.98 })
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
    const x0 = pos.getX(i), z0 = pos.getZ(i)
    const a = Math.atan2(z0, x0)
    const groove = 1 - 0.045 * (0.5 + 0.5 * Math.cos(a * 18))
    pos.setX(i, x0 * groove); pos.setZ(i, z0 * groove)
  }
  geo.computeVertexNormals()
  const shaft = new THREE.Mesh(geo, mat)
  shaft.position.y = 0.28 + shaftH / 2
  g.add(shaft)
  if (!broken) {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.48), mat)
    cap.position.y = 0.34 + shaftH
    g.add(cap)
  }
  g.rotation.y = (x + z) * 0.07
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  parent.add(g)
}

function addDice(parent) {
  const die = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42, 4, 4, 4), new THREE.MeshPhysicalMaterial({ color: '#a71617', roughness: 0.28, clearcoat: 0.32, clearcoatRoughness: 0.22 }))
  die.position.set(-4.45, 0.37, 2.65)
  die.rotation.set(0.35, 0.52, 0.18)
  die.castShadow = die.receiveShadow = true
  parent.add(die)
}

async function build() {
  statusEl.textContent = 'Loading Poly Haven pavement + forest-ground PBR…'
  const [stone, soil] = await Promise.all([
    loadPBR('checkered_pavement_tiles', [2.6, 2.0]),
    loadPBR('forrest_ground_01', [2.8, 2.3]),
  ])

  const soilGeo = new THREE.PlaneGeometry(10.3, 8.15, 96, 96)
  soilGeo.rotateX(-Math.PI / 2)
  const soilMesh = new THREE.Mesh(soilGeo, pbrMaterial(soil, { displacementScale: 0.055, normalScale: 0.5, roughness: 1 }))
  soilMesh.position.y = -0.09
  soilMesh.receiveShadow = true
  world.add(soilMesh)

  const pavingGeo = new THREE.PlaneGeometry(8.75, 6.65, 160, 128)
  pavingGeo.rotateX(-Math.PI / 2)
  const paving = new THREE.Mesh(pavingGeo, pbrMaterial(stone, { displacementScale: 0.095, normalScale: 0.78, roughness: 0.99 }))
  paving.position.y = 0.005
  paving.castShadow = paving.receiveShadow = true
  world.add(paving)

  const seamMat = new THREE.MeshStandardMaterial({ color: '#2d291f', roughness: 1 })
  for (let x = -4; x <= 4; x++) {
    const groove = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.025, 6.55), seamMat)
    groove.position.set(x, 0.026, 0)
    world.add(groove)
  }
  for (let z = -3; z <= 3; z++) {
    const groove = new THREE.Mesh(new THREE.BoxGeometry(8.65, 0.025, 0.018), seamMat)
    groove.position.set(0, 0.027, z)
    world.add(groove)
  }

  ;[[-3.65,-2.4,1.42,false],[-4.02,0.1,1.52,false],[-2.85,2.18,1.18,true],[3.55,-2.12,1.50,false],[4.0,1.84,1.34,false],[2.8,2.55,1.08,true]].forEach(v => addColumn(world, ...v))
  addDice(world)

  let organicLoaded = 0
  statusEl.textContent = 'Loading scanned CC0 organic models…'

  try {
    const stumpRaw = await loadModel('tree_stump_01', '1k')
    const stump = normalizeObject(stumpRaw, 2.7)
    stump.position.set(0.3, 0.03, -2.45)
    stump.scale.y *= 0.68
    world.add(stump)
    organicLoaded++
  } catch (err) { console.warn('stump unavailable', err) }

  let mossSource = null
  try {
    mossSource = normalizeObject(await loadModel('moss_01', '1k'), 1.0)
    organicLoaded++
  } catch (err) { console.warn('moss unavailable', err) }

  if (mossSource) {
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#4c3426', roughness: 0.98 })
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.29, 2.25, 28, 8), trunkMat)
    trunk.position.set(0.32, 1.02, -2.44)
    trunk.rotation.z = -0.045
    trunk.castShadow = trunk.receiveShadow = true
    world.add(trunk)

    const canopy = [
      [-0.55,2.48,-2.45,1.35],[0.45,2.68,-2.58,1.45],[1.15,2.52,-2.34,1.25],
      [-0.18,3.12,-2.53,1.25],[0.72,3.12,-2.26,1.22],[-0.82,2.96,-2.22,1.10],
    ]
    for (const [x,y,z,s] of canopy) {
      const c = cloneAsset(mossSource)
      c.scale.multiplyScalar(s)
      c.position.set(x,y,z)
      c.rotation.set((x+y)*0.08, x*0.44, z*0.06)
      world.add(c)
    }
    const edgeSpots = [[-4.5,-3.4,.55],[-3.8,3.55,.52],[-1.9,3.6,.42],[1.5,3.55,.45],[4.45,2.5,.52],[4.48,-.3,.45],[3.6,-3.52,.55],[-4.45,1.6,.44]]
    edgeSpots.forEach(([x,z,s], i) => {
      const c = cloneAsset(mossSource)
      c.scale.multiplyScalar(s)
      c.position.set(x,0.08,z)
      c.rotation.y = i * 0.83
      world.add(c)
    })
  }

  try {
    const rockRaw = normalizeObject(await loadModel('rock_moss_set_01', '1k'), 1.35)
    ;[[-4.15,.04,-1.45,.48],[3.8,.04,2.92,.42],[4.18,.04,-3.0,.36],[-2.3,.04,-3.42,.32]].forEach(([x,y,z,s], i) => {
      const r = cloneAsset(rockRaw)
      r.scale.multiplyScalar(s)
      r.position.set(x,y,z)
      r.rotation.y = i * 1.17
      world.add(r)
    })
    organicLoaded++
  } catch (err) { console.warn('rocks unavailable', err) }

  const key = new THREE.RectAreaLight('#ffd8ac', 28, 5.0, 4.0)
  key.position.set(-2.8, 7.2, 4.0)
  key.lookAt(0, 0, 0)
  scene.add(key)
  const rim = new THREE.DirectionalLight('#d9c6ff', 1.1)
  rim.position.set(5, 5, -4)
  rim.castShadow = true
  rim.shadow.mapSize.set(2048,2048)
  rim.shadow.camera.left = -7; rim.shadow.camera.right = 7; rim.shadow.camera.top = 7; rim.shadow.camera.bottom = -7
  scene.add(rim)

  try {
    const hdr = await new HDRLoader().loadAsync('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr')
    hdr.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = hdr
    scene.backgroundBlurriness = 0.42
    scene.backgroundIntensity = 0.52
  } catch (err) {
    console.warn('HDRI unavailable', err)
    scene.add(new THREE.HemisphereLight('#e8d6c4', '#34261d', 2.0))
  }

  sceneReady = true
  statusEl.textContent = organicLoaded >= 2
    ? 'Scan-quality PBR pipeline loaded. Columns and figures remain explicit blockers.'
    : 'PBR textures loaded; some remote model assets failed, so this spike is not eligible to pass.'
}

build().catch(err => {
  console.error(err)
  statusEl.textContent = `Art spike failed: ${err.message}`
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
    sampleEl.textContent = sceneReady ? 'Raster · PBR + GTAO' : 'Loading…'
  }
}
animate()
