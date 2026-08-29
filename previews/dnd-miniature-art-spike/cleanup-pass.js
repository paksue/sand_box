import * as THREE from 'three'

function isLegacyWhiteDebris(obj) {
  if (!obj.isMesh || !obj.material) return false
  if (/photo_alpha|hobby_|benchmark_mini|printed_fantasy/.test(obj.name || '')) return false
  const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
  const white = mats.some(mat => {
    const c = mat?.color
    return c && c.r > 0.76 && c.g > 0.76 && c.b > 0.76
  })
  if (!white) return false
  const box = new THREE.Box3().setFromObject(obj)
  const size = box.getSize(new THREE.Vector3())
  return Math.max(size.x, size.y, size.z) < 1.15
}

function hideLegacyCanopyGroups(world) {
  let hidden = 0
  for (const child of world.children) {
    if (!child.visible) continue
    if (/photo_alpha|hobby_|benchmark_mini|printed_fantasy|ab_|weathered/.test(child.name || '')) continue
    if (!child.isGroup) continue
    const box = new THREE.Box3().setFromObject(child)
    if (box.isEmpty()) continue
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    // The original moss_01 clone groups are compact and float around the tree.
    // Keep the large branch/trunk group, miniatures and architectural groups.
    if (center.y > 1.75 && center.z < -1.45 && center.z > -3.35 && maxDim < 1.22) {
      child.visible = false
      hidden++
    }
  }
  return hidden
}

function cleanup() {
  const world = globalThis.__dndArtSpikeWorld
  if (!world) { setTimeout(cleanup, 250); return }

  let hidden = hideLegacyCanopyGroups(world)
  world.traverse(obj => {
    if (isLegacyWhiteDebris(obj)) {
      obj.visible = false
      hidden++
    }
  })

  if (hidden) console.info(`hidden ${hidden} legacy foliage/debris objects`)

  if (!globalThis.__legacyCleanupStarted) {
    globalThis.__legacyCleanupStarted = true
    let passes = 0
    const id = setInterval(() => {
      passes++
      hideLegacyCanopyGroups(world)
      world.traverse(obj => { if (isLegacyWhiteDebris(obj)) obj.visible = false })
      if (passes >= 28) clearInterval(id)
    }, 400)
  }
}
cleanup()
