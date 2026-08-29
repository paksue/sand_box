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
    color: '#b7c97a',
    map: diff,
    alphaMap: alpha,
    normalMap: normal,
    roughnessMap: rough,
    normalScale: new THREE.Vector2(0.6, 0.6),
    roughness: 0.98,
    metalness: 0,
    alphaTest: 0.22,
    transparent: false,
    side: THREE.DoubleSide,
  })

  const plane = new THREE.PlaneGeometry(1, 1)
  const rand = rng()
  const dummy = new THREE.Object3D()

  const canopy = new THREE.InstancedMesh(plane, material, 180)
  canopy.name = 'photo_alpha_canopy'
  canopy.castShadow = true
  canopy.receiveShadow = false

  for (let i = 0; i < 180; i++) {
    // Filled ellipsoid with noisier outer silhouette, centered over the real trunk.
    const u = Math.pow(rand(), 0.62)
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    const rx = 1.30 * u * Math.sin(phi) * Math.cos(theta)
    const rz = 0.78 * u * Math.sin(phi) * Math.sin(theta)
    const ry = 0.76 * u * Math.cos(phi)
    const edgeKick = rand() > 0.78 ? 1.12 : 1

    dummy.position.set(0.28 + rx * edgeKick, 2.62 + ry * edgeKick, -2.45 + rz * edgeKick)
    dummy.rotation.set((rand() - 0.5) * 1.35, rand() * Math.PI * 2, (rand() - 0.5) * 1.35)
    const s = 0.34 + rand() * 0.38
    dummy.scale.set(s * (0.82 + rand() * 0.36), s, 1)
    dummy.updateMatrix()
    canopy.setMatrixAt(i, dummy.matrix)
  }
  canopy.instanceMatrix.needsUpdate = true
  world.add(canopy)

  // Hobby-diorama perimeter flock using the same photographed atlas at smaller scale.
  const edgeCards = new THREE.InstancedMesh(plane, material, 90)
  edgeCards.name = 'photo_alpha_ground_flock'
  edgeCards.castShadow = true
  for (let i = 0; i < 90; i++) {
    const side = Math.floor(rand() * 4)
    let x, z
    if (side === 0) { x = -4.65 + rand() * 9.3; z = -3.72 + rand() * 0.28 }
    else if (side === 1) { x = -4.65 + rand() * 9.3; z = 3.44 + rand() * 0.28 }
    else if (side === 2) { x = -4.65 + rand() * 0.28; z = -3.4 + rand() * 6.8 }
    else { x = 4.37 + rand() * 0.28; z = -3.4 + rand() * 6.8 }
    dummy.position.set(x, 0.06 + rand() * 0.09, z)
    dummy.rotation.set(-Math.PI / 2 + (rand() - 0.5) * 0.65, rand() * Math.PI * 2, (rand() - 0.5) * 0.3)
    const s = 0.18 + rand() * 0.22
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
