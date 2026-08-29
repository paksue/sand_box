import * as THREE from 'three'

const RES = '1k'
const BASE = `https://dl.polyhaven.org/file/ph-assets/Models/jpg/${RES}/moss_01`
const loader = new THREE.TextureLoader()
loader.setCrossOrigin('anonymous')

function load(url, color = false) {
  return loader.loadAsync(url).then(tex => {
    tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.magFilter = THREE.LinearFilter
    return tex
  })
}

function rng(seed = 24681357) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 4294967296
  }
}

async function run() {
  const world = globalThis.__dndArtSpikeWorld
  if (!world) {
    setTimeout(run, 250)
    return
  }

  const [diff, alpha, normal, rough] = await Promise.all([
    load(`${BASE}/moss_01_diff_${RES}.jpg`, true),
    load(`${BASE}/moss_01_alpha_${RES}.jpg`),
    load(`${BASE}/moss_01_nor_gl_${RES}.jpg`),
    load(`${BASE}/moss_01_rough_${RES}.jpg`),
  ])

  const material = new THREE.MeshStandardMaterial({
    name: 'photo_foliage_canopy',
    color: '#d7df9b',
    map: diff,
    alphaMap: alpha,
    normalMap: normal,
    roughnessMap: rough,
    normalScale: new THREE.Vector2(0.52, 0.52),
    roughness: 0.98,
    metalness: 0,
    alphaTest: 0.17,
    transparent: false,
    side: THREE.DoubleSide,
    emissive: new THREE.Color('#344014'),
    emissiveIntensity: 0.07,
  })

  const plane = new THREE.PlaneGeometry(1, 1)
  const rand = rng()
  const dummy = new THREE.Object3D()

  const canopy = new THREE.InstancedMesh(plane, material, 230)
  canopy.name = 'photo_alpha_canopy'
  canopy.castShadow = true
  canopy.receiveShadow = false

  for (let i = 0; i < 230; i++) {
    const u = Math.pow(rand(), 0.56)
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    let rx = 1.34 * u * Math.sin(phi) * Math.cos(theta)
    let rz = 0.82 * u * Math.sin(phi) * Math.sin(theta)
    let ry = 0.78 * u * Math.cos(phi)

    // Hand-built miniature silhouette: asymmetry, lumpy lobes, and drooping moss.
    const lobe = i % 5
    if (lobe === 0) { rx -= 0.18; ry += 0.12 }
    if (lobe === 1) { rx += 0.24; rz += 0.08 }
    if (lobe === 2) { ry -= 0.16; rz -= 0.10 }
    if (rand() > 0.84) ry -= 0.28 + rand() * 0.25
    const edgeKick = rand() > 0.80 ? 1.10 + rand() * 0.14 : 1

    dummy.position.set(0.28 + rx * edgeKick, 2.64 + ry * edgeKick, -2.45 + rz * edgeKick)
    dummy.rotation.set((rand() - 0.5) * 1.45, rand() * Math.PI * 2, (rand() - 0.5) * 1.45)
    const s = 0.30 + rand() * 0.36
    dummy.scale.set(s * (0.78 + rand() * 0.42), s, 1)
    dummy.updateMatrix()
    canopy.setMatrixAt(i, dummy.matrix)
  }
  canopy.instanceMatrix.needsUpdate = true
  world.add(canopy)

  const edgeCards = new THREE.InstancedMesh(plane, material, 120)
  edgeCards.name = 'photo_alpha_ground_flock'
  edgeCards.castShadow = true
  for (let i = 0; i < 120; i++) {
    const side = Math.floor(rand() * 4)
    let x, z
    if (side === 0) { x = -4.65 + rand() * 9.3; z = -3.72 + rand() * 0.34 }
    else if (side === 1) { x = -4.65 + rand() * 9.3; z = 3.38 + rand() * 0.34 }
    else if (side === 2) { x = -4.65 + rand() * 0.34; z = -3.4 + rand() * 6.8 }
    else { x = 4.31 + rand() * 0.34; z = -3.4 + rand() * 6.8 }
    dummy.position.set(x, 0.07 + rand() * 0.12, z)
    dummy.rotation.set(-Math.PI / 2 + (rand() - 0.5) * 0.78, rand() * Math.PI * 2, (rand() - 0.5) * 0.36)
    const s = 0.16 + rand() * 0.24
    dummy.scale.set(s, s, 1)
    dummy.updateMatrix()
    edgeCards.setMatrixAt(i, dummy.matrix)
  }
  edgeCards.instanceMatrix.needsUpdate = true
  world.add(edgeCards)

  const status = document.querySelector('#status')
  if (status) status.textContent += ' · photographed alpha foliage loaded'
}

run().catch(err => console.error('alpha foliage pass failed', err))
