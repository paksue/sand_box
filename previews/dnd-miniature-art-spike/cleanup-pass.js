import * as THREE from 'three'

const keepName = /photo_alpha|hobby_|benchmark_mini|printed_fantasy|weathered|column|battle|mini/i

function protectedByAncestor(obj) {
  let cur = obj
  while (cur) {
    if (keepName.test(cur.name || '')) return true
    cur = cur.parent
  }
  return false
}

function topLevelLegacyGroup(child) {
  if (!child.visible || !child.isGroup || protectedByAncestor(child)) return false
  const box = new THREE.Box3().setFromObject(child)
  if (box.isEmpty()) return false
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const maxDim = Math.max(size.x,size.y,size.z)

  if (center.y > 1.55 && center.z < -1.25 && center.z > -3.55 && maxDim < 2.05) return true
  if (center.y < 0.9 && maxDim < 1.25 && (Math.abs(center.x) > 3.85 || Math.abs(center.z) > 2.95)) return true
  if (center.y < 1.0 && center.z < -1.65 && center.z > -3.2 && Math.abs(center.x) < 1.7 && maxDim < 1.55) return true

  return false
}

function legacyWhiteMesh(obj) {
  if (!obj.isMesh || !obj.material || protectedByAncestor(obj)) return false
  const mats=Array.isArray(obj.material)?obj.material:[obj.material]
  const pale=mats.some(mat=>{const c=mat?.color;return c&&c.r>.74&&c.g>.74&&c.b>.74})
  if(!pale)return false
  const box=new THREE.Box3().setFromObject(obj);if(box.isEmpty())return false
  const size=box.getSize(new THREE.Vector3())
  return Math.max(size.x,size.y,size.z)<1.15
}

function cleanOnce(world){
  let hidden=0
  for(const child of world.children){if(topLevelLegacyGroup(child)){child.visible=false;hidden++}}
  world.traverse(obj=>{if(legacyWhiteMesh(obj)){obj.visible=false;hidden++}})
  return hidden
}

function cleanup(){
  const world=globalThis.__dndArtSpikeWorld
  if(!world){setTimeout(cleanup,250);return}
  const hidden=cleanOnce(world)
  if(hidden)console.info(`hidden ${hidden} legacy moss/debris objects`)
  if(!globalThis.__legacyCleanupStarted){
    globalThis.__legacyCleanupStarted=true
    let passes=0
    const id=setInterval(()=>{passes++;cleanOnce(world);if(passes>=40)clearInterval(id)},300)
  }
}
cleanup()
