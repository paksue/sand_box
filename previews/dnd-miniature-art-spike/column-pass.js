import * as THREE from 'three'

const ASSET = 'rock_08'
const RES = '1k'
const BASE = `https://dl.polyhaven.org/file/ph-assets/Textures/jpg/${RES}/${ASSET}`
const loader = new THREE.TextureLoader()
loader.setCrossOrigin('anonymous')

function load(map) {
  return loader.loadAsync(`${BASE}/${ASSET}_${map}_${RES}.jpg`).then(tex => {
    tex.colorSpace = THREE.NoColorSpace
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(2.2, 2.2)
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.anisotropy = 8
    return tex
  })
}

function lum(mat) {
  const c = mat?.color
  return c ? c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722 : 0
}

function isColumnGroup(group) {
  if (!group?.isGroup) return false
  let shaft = false
  group.traverse(o => {
    if (!o.isMesh) return
    if (o.geometry?.type === 'CylinderGeometry' && lum(o.material) > 0.28) shaft = true
  })
  return shaft
}

function weatherGeometry(mesh) {
  if (!mesh.geometry?.attributes?.position) return
  mesh.geometry = mesh.geometry.clone()
  const p = mesh.geometry.attributes.position
  const cylinder = mesh.geometry.type === 'CylinderGeometry'
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i)
    const n1 = Math.sin(x * 47.17 + y * 73.31 + z * 91.07 + i * 0.31)
    const n2 = Math.sin(x * 131.1 - y * 41.7 + z * 67.3)
    const n = n1 * 0.65 + n2 * 0.35
    if (cylinder) {
      const radial = 1 + n * 0.010
      x *= radial
      z *= radial
      if (i % 17 === 0) { x *= 0.965; z *= 0.965 }
      y += n * 0.003
    } else {
      x += n * 0.005
      y += n2 * 0.004
      z += n1 * 0.005
    }
    p.setXYZ(i, x, y, z)
  }
  p.needsUpdate = true
  mesh.geometry.computeVertexNormals()
}

function addDetail(group) {
  const box = new THREE.Box3().setFromObject(group)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const localCenter = group.worldToLocal(center.clone())
  const localBottom = group.worldToLocal(new THREE.Vector3(center.x, box.min.y, center.z)).y
  const localTop = group.worldToLocal(new THREE.Vector3(center.x, box.max.y, center.z)).y

  const ivory = new THREE.MeshStandardMaterial({ color: '#b9aa8e', roughness: 0.96, metalness: 0 })
  const grime = new THREE.MeshStandardMaterial({ color: '#514838', roughness: 1 })
  const r = Math.min(size.x, size.z) * 0.34

  // Additional stepped collars make the silhouette read like a miniature classical ruin.
  for (const [y, rr, h] of [[localBottom + 0.18, r * 1.20, 0.055],[localBottom + 0.27, r * 0.93, 0.045],[localTop - 0.17, r * 0.94, 0.045]]) {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr * 1.03, h, 48), ivory)
    ring.position.set(localCenter.x, y, localCenter.z)
    ring.castShadow = ring.receiveShadow = true
    group.add(ring)
  }

  // Tiny dark pits/chips around the foot — hobby paint wash / accumulated grime.
  for (let i = 0; i < 9; i++) {
    const a = i * 2.399 + group.position.x * 0.3
    const chip = new THREE.Mesh(new THREE.SphereGeometry(0.025 + (i % 3) * 0.008, 8, 6), grime)
    chip.scale.set(1.6, 0.35, 0.7)
    chip.position.set(localCenter.x + Math.cos(a) * r * 1.35, localBottom + 0.055 + (i % 2) * 0.025, localCenter.z + Math.sin(a) * r * 1.35)
    chip.rotation.y = a
    chip.castShadow = true
    group.add(chip)
  }
}

async function run() {
  const world = globalThis.__dndArtSpikeWorld
  if (!world) { setTimeout(run, 250); return }
  const [normal, rough] = await Promise.all([load('nor_gl'), load('rough')])

  let count = 0
  for (const child of world.children) {
    if (!isColumnGroup(child)) continue
    child.traverse(o => {
      if (!o.isMesh) return
      weatherGeometry(o)
      const old = o.material
      if (!old) return
      const m = old.clone()
      m.normalMap = normal
      m.normalScale = new THREE.Vector2(0.55, 0.55)
      m.roughnessMap = rough
      m.roughness = 0.98
      m.metalness = 0
      // A slightly warmer bone/limestone paint tone like the physical pieces.
      if (lum(m) > 0.28) m.color.multiply(new THREE.Color('#d9c8a8'))
      m.needsUpdate = true
      o.material = m
      o.castShadow = o.receiveShadow = true
    })
    addDetail(child)
    count++
  }

  const status = document.querySelector('#status')
  if (status) status.textContent += ` · weathered ruin columns (${count})`
}

run().catch(err => console.error('column weather pass failed', err))
