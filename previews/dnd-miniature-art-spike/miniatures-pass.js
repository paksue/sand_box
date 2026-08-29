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
  hooded: `${ROOT}/Rogue_Hooded.glb`,
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
  root.scale.multiplyScalar(targetHeight / Math.max(size.y || 1, 0.001))
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
  try { return await loader.loadAsync(urls[type]) }
  catch (err) { console.warn(`miniature ${type} failed`, err); return null }
}

async function run() {
  const world = globalThis.__dndArtSpikeWorld
  if (!world) { setTimeout(run, 250); return }

  const loaded = Object.fromEntries(await Promise.all(Object.keys(urls).map(async k => [k, await loadType(k)])))

  // Layout follows the physical reference: hero/caster toward the tree, a loose
  // enemy group across the middle, and a cloaked hero closer to the camera.
  const placements = [
    { type:'mage',      x:-0.15, z:-1.35, h:.86, yaw:2.95, tint:null,      phase:.18 },
    { type:'knight',    x:-1.10, z:-0.32, h:.76, yaw:1.25, tint:'#b8d9cf', phase:.36 },
    { type:'rogue',     x:-0.15, z:-0.38, h:.74, yaw:.15, tint:'#9fc8bd', phase:.48 },
    { type:'knight',    x:.78, z:-.62, h:.77, yaw:-.72, tint:'#afd5ca', phase:.62 },
    { type:'barbarian', x:1.28, z:.18, h:.78, yaw:-1.35, tint:'#bdcdb4', phase:.28 },
    { type:'hooded',    x:.78, z:1.42, h:.84, yaw:-2.65, tint:'#7fbab5', phase:.42 },
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
  if (status) status.textContent += ` · ${count} composed GLB miniatures`
}

run().catch(err => console.error('miniature pass failed', err))
