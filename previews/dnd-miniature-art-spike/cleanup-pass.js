import * as THREE from 'three'

function isLegacyWhiteDebris(obj) {
  if (!obj.isMesh || !obj.material) return false
  if (obj.name === 'photo_alpha_canopy' || obj.name === 'photo_alpha_ground_flock') return false
  const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
  const white = mats.some(mat => {
    const c = mat?.color
    return c && c.r > 0.82 && c.g > 0.82 && c.b > 0.82
  })
  if (!white) return false
  const box = new THREE.Box3().setFromObject(obj)
  const size = box.getSize(new THREE.Vector3())
  // Real columns are tall. Legacy moss atlas planes/fronds are compact.
  return Math.max(size.x, size.y, size.z) < 1.15
}

function cleanup() {
  const world = globalThis.__dndArtSpikeWorld
  if (!world) {
    setTimeout(cleanup, 250)
    return
  }
  let hidden = 0
  world.traverse(obj => {
    if (isLegacyWhiteDebris(obj)) {
      obj.visible = false
      hidden++
    }
  })
  if (hidden) console.info(`hidden ${hidden} legacy white debris meshes`)
  // The original remote assets arrive asynchronously; repeat briefly.
  if (!globalThis.__legacyCleanupStarted) {
    globalThis.__legacyCleanupStarted = true
    let passes = 0
    const id = setInterval(() => {
      passes++
      world.traverse(obj => { if (isLegacyWhiteDebris(obj)) obj.visible = false })
      if (passes >= 20) clearInterval(id)
    }, 500)
  }
}
cleanup()
