import * as THREE from 'three'

const ASSET = 'square_concrete_pavers'
const RES = '1k'
const BASE = `https://dl.polyhaven.org/file/ph-assets/Textures/jpg/${RES}/${ASSET}`
const loader = new THREE.TextureLoader()
loader.setCrossOrigin('anonymous')

function load(map, color = false) {
  return loader.loadAsync(`${BASE}/${ASSET}_${map}_${RES}.jpg`).then(tex => {
    tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    // Coarse tabletop scale: roughly a dozen-plus visible pavers across the board,
    // not the tiny urban-floor grid from the rejected square_tiles_03 pass.
    tex.repeat.set(0.92, 0.70)
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.anisotropy = 8
    return tex
  })
}

async function run() {
  const world = globalThis.__dndArtSpikeWorld
  if (!world) {
    setTimeout(run, 250)
    return
  }

  const [diff, normal, disp, ao] = await Promise.all([
    load('diff', true),
    load('nor_gl'),
    load('disp'),
    load('ao'),
  ])

  const geo = new THREE.PlaneGeometry(8.76, 6.66, 220, 168)
  geo.rotateX(-Math.PI / 2)
  geo.setAttribute('uv1', geo.attributes.uv.clone())

  const mat = new THREE.MeshStandardMaterial({
    name: 'square_concrete_pavers_ab_test',
    color: '#ad967b',
    map: diff,
    normalMap: normal,
    aoMap: ao,
    displacementMap: disp,
    displacementScale: 0.028,
    displacementBias: 0,
    normalScale: new THREE.Vector2(0.82, 0.82),
    // Painted/foam tabletop terrain should stay very matte.
    roughness: 0.99,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  })
  mat.aoMapIntensity = 0.82

  const surface = new THREE.Mesh(geo, mat)
  surface.name = 'ab_square_concrete_pavers_surface'
  surface.position.y = 0.105
  surface.castShadow = true
  surface.receiveShadow = true
  world.add(surface)

  const status = document.querySelector('#status')
  if (status) status.textContent += ' · stone A/B: square_concrete_pavers'
}

run().catch(err => console.error('square concrete paver pass failed', err))
