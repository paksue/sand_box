import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { clone as skeletonClone } from 'three/addons/utils/SkeletonUtils.js'

const loader = new GLTFLoader()
loader.setCrossOrigin('anonymous')

const ROOT = 'https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/main/addons/kaykit_character_pack_adventures/Characters/gltf'
const urls = {
  mage: `${ROOT}/Mage.glb`,
  knight: `${ROOT}/Knight.glb`,
  rogue: `${ROOT}/Rogue.glb`,
  barbarian: `${ROOT}/Barbarian.glb`,
}

function prepMaterials(root, tint = null) {
  root.traverse(o => {
    if (!o.isMesh) return
    o.castShadow = true
    o.receiveShadow = true
    const mats = Array.isArray(o.material) ? o.material : [o.material]
    const copies = mats.map(mat => {
      if (!mat) return mat
      const m = mat.clone()
      if (m.map) m.map.colorSpace = THREE.SRGBColorSpace
      m.roughness = Math.max(m.roughness ?? 0.65, 0.62)
      if (tint && m.color) m.color.multiply(new THREE.Color(tint))
      return m
    })
    o.material = Array.isArray(o.material) ? copies : copies[0]
  })
}

function poseStatic(root, animations, phase = 0.32) {
  if (!animations?.length) return
  const clip = animations.find(c => /idle/i.test(c.name)) || animations[0]
  if (!clip) return
  const mixer = new THREE.AnimationMixer(root)
  const action = mixer.clipAction(clip)
  action.play()
  const t = Math.min(Math.max(clip.duration * phase, 0.05), Math.max(clip.duration - 0.02, 0.05))
  mixer.setTime(t)
  mixer.update(0)
}

function fitAndPlace(root, x, z, targetHeight, yaw) {
  root.updateMatrixWorld(true)
  let box = new THREE.Box3().setFromObject(root)
  const size = box.getSize(new THREE.Vector3())
  const scale = targetHeight / Math.max(size.y || 1, 0.001)
  root.scale.multiplyScalar(scale)
  root.updateMatrixWorld(true)
  box = new THREE.Box3().setFromObject(root)
  const center = box.getCenter(new THREE.Vector3())
  root.position.x += x - center.x
  root.position.z += z - center.z
  root.position.y += 0.235 - box.min.y
  root.rotation.y += yaw
  root.updateMatrixWorld(true)
}

async function loadType(type) {
  try {
    return await loader.loadAsync(urls[type])
  } catch (err) {
    console.warn(`miniature ${type} failed`, err)
    return null
  }
}

async function run() {
  const world = globalThis.__dndArtSpikeWorld
  if (!world) { setTimeout(run, 250); return }

  const loaded = Object.fromEntries(await Promise.all(
    Object.keys(urls).map(async k => [k, await loadType(k)])
  ))

  const placements = [
    { type: 'mage', x: 0.05, z: 0.65, h: 0.92, yaw: Math.PI * 0.92, tint: null, phase: 0.18 },
    { type: 'knight', x: -0.70, z: 0.35, h: 0.82, yaw: 1.55, tint: '#b7d9cd', phase: 0.36 },
    { type: 'rogue', x: 0.75, z: 0.20, h: 0.80, yaw: -1.05, tint: '#9bc6bb', phase: 0.48 },
    { type: 'knight', x: -0.15, z: -0.25, h: 0.84, yaw: 0.68, tint: '#a9d3c8', phase: 0.62 },
    { type: 'barbarian', x: 0.55, z: -0.55, h: 0.86, yaw: -0.30, tint: '#b9ccb3', phase: 0.28 },
  ]

  let count = 0
  for (const p of placements) {
    const asset = loaded[p.type]
    if (!asset) continue
    const root = skeletonClone(asset.scene)
    root.name = `benchmark_mini_${p.type}_${count}`
    prepMaterials(root, p.tint)
    poseStatic(root, asset.animations, p.phase)
    fitAndPlace(root, p.x, p.z, p.h, p.yaw)
    world.add(root)
    count++
  }

  const status = document.querySelector('#status')
  if (status) status.textContent += ` · ${count} GLB fantasy miniatures`
}

run().catch(err => console.error('miniature pass failed', err))
