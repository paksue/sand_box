import * as THREE from 'three'

const ASSET = 'square_tiles_03'
const RES = '1k'
const BASE = `https://dl.polyhaven.org/file/ph-assets/Textures/jpg/${RES}/${ASSET}`
const loader = new THREE.TextureLoader()
loader.setCrossOrigin('anonymous')

function load(map, color = false) {
  return loader.loadAsync(`${BASE}/${ASSET}_${map}_${RES}.jpg`).then(tex => {
    tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    // Keep texels square in world-space while making the physical tile grid finer.
    tex.repeat.set(3.18, 2.42)
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

  const [diff, normal, rough, disp, ao] = await Promise.all([
    load('diff', true),
    load('nor_gl'),
    load('rough'),
    load('disp'),
    load('ao'),
  ])

  const geo = new THREE.PlaneGeometry(8.76, 6.66, 220, 168)
  geo.rotateX(-Math.PI / 2)
  geo.setAttribute('uv1', geo.attributes.uv.clone())

  const mat = new THREE.MeshStandardMaterial({
    name: 'square_tiles_03_ab_test',
    color: '#9a8067',
    map: diff,
    normalMap: normal,
    roughnessMap: rough,
    aoMap: ao,
    displacementMap: disp,
    // Micro relief only. The authored texture supplies the tile shape; we do not
    // let displacement cross through the already-approved base surface.
    displacementScale: 0.022,
    displacementBias: 0,
    normalScale: new THREE.Vector2(0.70, 0.70),
    roughness: 0.98,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  })
  mat.aoMapIntensity = 0.76

  const surface = new THREE.Mesh(geo, mat)
  surface.name = 'ab_square_tiles_03_surface'
  surface.position.y = 0.105
  surface.castShadow = true
  surface.receiveShadow = true
  world.add(surface)

  const status = document.querySelector('#status')
  if (status) status.textContent += ' · stone A/B: square_tiles_03 isolated'
}

run().catch(err => console.error('square_tiles_03 surface pass failed', err))
