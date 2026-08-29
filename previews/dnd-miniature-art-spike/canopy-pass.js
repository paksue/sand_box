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
    color: '#dfe47a',
    map: diff,
    alphaMap: alpha,
    normalMap: normal,
    roughnessMap: rough,
    normalScale: new THREE.Vector2(0.46, 0.46),
    roughness: 0.99,
    metalness: 0,
    alphaTest: 0.11,
    transparent: false,
    side: THREE.DoubleSide,
    emissive: new THREE.Color('#71802a'),
    emissiveIntensity: 0.16,
  })

  const plane = new THREE.PlaneGeometry(1, 1)
  const rand = rng()
  const dummy = new THREE.Object3D()

  // Dense model-railroad / hobby-lichen canopy. Small overlapping cards create
  // porous depth rather than a few visible leaf planes.
  const canopy = new THREE.InstancedMesh(plane, material, 680)
  canopy.name = 'photo_alpha_canopy'
  canopy.castShadow = true
  canopy.receiveShadow = false

  const lobes = [
    [-0.70, 0.02, 0.02, 0.76], [-0.30, 0.20, -0.12, 0.88], [0.10, 0.17, 0.03, 0.94],
    [0.50, 0.10, -0.08, 0.86], [0.78, -0.04, 0.08, 0.70], [-0.18, 0.53, 0.03, 0.72],
    [0.28, 0.50, -0.08, 0.70], [0.03, -0.34, 0.04, 0.82],
  ]

  for (let i = 0; i < 680; i++) {
    const l = lobes[i % lobes.length]
    const u = Math.pow(rand(), 0.62)
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    const rx = l[0] + 0.68 * l[3] * u * Math.sin(phi) * Math.cos(theta)
    const rz = l[2] + 0.56 * l[3] * u * Math.sin(phi) * Math.sin(theta)
    let ry = l[1] + 0.54 * l[3] * u * Math.cos(phi)
    if (rand() > 0.87) ry -= 0.20 + rand() * 0.34

    dummy.position.set(0.28 + rx, 2.69 + ry, -2.45 + rz)
    dummy.rotation.set((rand() - 0.5) * 1.35, rand() * Math.PI * 2, (rand() - 0.5) * 1.35)
    const s = 0.18 + rand() * 0.22
    dummy.scale.set(s * (0.72 + rand() * 0.52), s, 1)
    dummy.updateMatrix()
    canopy.setMatrixAt(i, dummy.matrix)
  }
  canopy.instanceMatrix.needsUpdate = true
  world.add(canopy)

  // Drooping strands around the bottom silhouette imitate preserved lichen.
  const drips = new THREE.InstancedMesh(plane, material, 150)
  drips.name = 'photo_alpha_lichen_drips'
  drips.castShadow = true
  for (let i = 0; i < 150; i++) {
    const a = rand() * Math.PI * 2
    const radius = 0.62 + rand() * 0.68
    dummy.position.set(
      0.28 + Math.cos(a) * radius,
      2.16 + rand() * 0.52,
      -2.45 + Math.sin(a) * radius * 0.58,
    )
    dummy.rotation.set((rand() - 0.5) * 0.34, a + Math.PI / 2, (rand() - 0.5) * 0.28)
    dummy.scale.set(0.14 + rand() * 0.14, 0.42 + rand() * 0.45, 1)
    dummy.updateMatrix()
    drips.setMatrixAt(i, dummy.matrix)
  }
  drips.instanceMatrix.needsUpdate = true
  world.add(drips)

  const edgeCards = new THREE.InstancedMesh(plane, material, 360)
  edgeCards.name = 'photo_alpha_ground_flock'
  edgeCards.castShadow = true
  for (let i = 0; i < 360; i++) {
    const side = Math.floor(rand() * 4)
    let x, z
    if (side === 0) { x = -4.65 + rand() * 9.3; z = -3.72 + rand() * 0.48 }
    else if (side === 1) { x = -4.65 + rand() * 9.3; z = 3.24 + rand() * 0.48 }
    else if (side === 2) { x = -4.65 + rand() * 0.48; z = -3.4 + rand() * 6.8 }
    else { x = 4.17 + rand() * 0.48; z = -3.4 + rand() * 6.8 }
    dummy.position.set(x, 0.08 + rand() * 0.15, z)
    dummy.rotation.set(-Math.PI / 2 + (rand() - 0.5) * 0.72, rand() * Math.PI * 2, (rand() - 0.5) * 0.30)
    const s = 0.13 + rand() * 0.23
    dummy.scale.set(s * (0.8 + rand() * 0.4), s, 1)
    dummy.updateMatrix()
    edgeCards.setMatrixAt(i, dummy.matrix)
  }
  edgeCards.instanceMatrix.needsUpdate = true
  world.add(edgeCards)

  const status = document.querySelector('#status')
  if (status) status.textContent += ' · dense photographed lichen foliage'
}

run().catch(err => console.error('alpha foliage pass failed', err))
