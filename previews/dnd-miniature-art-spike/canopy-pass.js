import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const loader = new GLTFLoader()
loader.setCrossOrigin('anonymous')
const url = 'https://dl.polyhaven.org/file/ph-assets/Models/gltf/1k/shrub_03/shrub_03_1k.gltf'

function normalize(obj, targetSize) {
  const box = new THREE.Box3().setFromObject(obj)
  const size = box.getSize(new THREE.Vector3())
  const max = Math.max(size.x, size.y, size.z) || 1
  obj.scale.multiplyScalar(targetSize / max)
  const box2 = new THREE.Box3().setFromObject(obj)
  const center = box2.getCenter(new THREE.Vector3())
  obj.position.x -= center.x
  obj.position.y -= box2.min.y
  obj.position.z -= center.z
  obj.traverse(o => {
    if (!o.isMesh) return
    o.castShadow = true
    o.receiveShadow = true
    const mats = Array.isArray(o.material) ? o.material : [o.material]
    for (const m of mats) {
      if (!m) continue
      m.side = THREE.DoubleSide
      if (m.map) m.map.colorSpace = THREE.SRGBColorSpace
      if (m.alphaMap || m.transparent) {
        m.transparent = false
        m.alphaTest = Math.max(m.alphaTest || 0, 0.28)
      }
      m.roughness = Math.max(m.roughness ?? 0.8, 0.82)
    }
  })
  return obj
}

function clone(obj) {
  const c = obj.clone(true)
  c.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  return c
}

async function run() {
  const world = globalThis.__dndArtSpikeWorld
  if (!world) {
    setTimeout(run, 250)
    return
  }

  let source
  try {
    source = normalize((await loader.loadAsync(url)).scene, 1.0)
  } catch (err) {
    console.error('shrub canopy load failed', err)
    return
  }

  const canopy = new THREE.Group()
  canopy.name = 'cc0_shrub_canopy'
  canopy.position.set(0.28, 0, -2.45)

  const clusters = [
    [-0.95,2.05,-0.10,0.92,0.15],[-0.46,2.22,-0.30,1.00,0.82],[0.02,2.30,-0.08,1.02,1.55],[0.48,2.18,0.18,0.96,2.20],[0.92,2.02,-0.06,0.88,2.85],
    [-0.70,2.58,0.22,0.86,0.58],[-0.24,2.72,-0.04,0.94,1.20],[0.23,2.70,0.20,0.96,1.94],[0.66,2.55,-0.16,0.88,2.54],
    [-0.42,3.02,0.06,0.76,0.34],[0.02,3.12,-0.18,0.82,1.48],[0.42,3.02,0.04,0.74,2.44],
  ]

  clusters.forEach(([x,y,z,s,ry], i) => {
    const c = clone(source)
    c.scale.multiplyScalar(s)
    c.position.set(x,y,z)
    c.rotation.set((i % 3 - 1) * 0.18, ry, (i % 4 - 1.5) * 0.11)
    canopy.add(c)
  })

  world.add(canopy)

  const edge = [
    [-4.15,0.02,-2.8,0.42,0.5],[-3.7,0.02,2.9,0.34,1.2],[3.85,0.02,2.85,0.38,2.0],[4.05,0.02,-2.75,0.36,2.7],[-4.15,0.02,0.8,0.28,3.1]
  ]
  edge.forEach(([x,y,z,s,ry]) => {
    const c = clone(source)
    c.scale.multiplyScalar(s)
    c.position.set(x,y,z)
    c.rotation.y = ry
    world.add(c)
  })

  const status = document.querySelector('#status')
  if (status) status.textContent += ' · real shrub canopy loaded'
}

run()
