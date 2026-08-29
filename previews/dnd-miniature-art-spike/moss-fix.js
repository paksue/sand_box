import * as THREE from 'three'

const RES = '1k'
const BASE = `https://dl.polyhaven.org/file/ph-assets/Models/jpg/${RES}/moss_01`
const urls = {
  diff: `${BASE}/moss_01_diff_${RES}.jpg`,
  alpha: `${BASE}/moss_01_alpha_${RES}.jpg`,
  normal: `${BASE}/moss_01_nor_gl_${RES}.jpg`,
  rough: `${BASE}/moss_01_rough_${RES}.jpg`,
}

const loader = new THREE.TextureLoader()
loader.setCrossOrigin('anonymous')

function configure(tex, color = false) {
  tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  return tex
}

async function loadTextures() {
  const [diff, alpha, normal, rough] = await Promise.all([
    loader.loadAsync(urls.diff),
    loader.loadAsync(urls.alpha),
    loader.loadAsync(urls.normal),
    loader.loadAsync(urls.rough),
  ])
  return {
    diff: configure(diff, true),
    alpha: configure(alpha),
    normal: configure(normal),
    rough: configure(rough),
  }
}

function looksLikeBrokenMossMaterial(mat) {
  if (!mat) return false
  const n = (mat.name || '').toLowerCase()
  if (/moss|fern|plant|leaf|foliage/.test(n)) return true
  const c = mat.color
  const nearlyWhite = c && c.r > 0.86 && c.g > 0.86 && c.b > 0.86
  const alphaLike = mat.transparent || mat.alphaTest > 0 || mat.opacity < 0.999
  return Boolean(nearlyWhite && (alphaLike || !mat.map))
}

function buildMaterial(tex) {
  return new THREE.MeshStandardMaterial({
    name: 'moss_01_repaired',
    color: '#c5cfa0',
    map: tex.diff,
    alphaMap: tex.alpha,
    normalMap: tex.normal,
    roughnessMap: tex.rough,
    normalScale: new THREE.Vector2(0.8, 0.8),
    roughness: 0.96,
    metalness: 0,
    alphaTest: 0.34,
    transparent: false,
    side: THREE.DoubleSide,
  })
}

async function repair() {
  const tex = await loadTextures()
  const repaired = buildMaterial(tex)

  for (let attempt = 0; attempt < 60; attempt++) {
    const world = globalThis.__dndArtSpikeWorld
    if (!world) {
      await new Promise(r => setTimeout(r, 250))
      continue
    }

    let count = 0
    world.traverse(obj => {
      if (!obj.isMesh) return
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      const shouldRepair = mats.some(looksLikeBrokenMossMaterial)
      if (!shouldRepair) return
      obj.material = Array.isArray(obj.material)
        ? obj.material.map(m => looksLikeBrokenMossMaterial(m) ? repaired : m)
        : repaired
      obj.castShadow = true
      obj.receiveShadow = true
      count++
    })

    if (count > 0) {
      const status = document.querySelector('#status')
      if (status && !status.textContent.includes('moss')) {
        status.textContent += ` · moss atlas repaired (${count} meshes)`
      }
      return
    }
    await new Promise(r => setTimeout(r, 250))
  }
}

repair().catch(err => console.error('moss material repair failed', err))
