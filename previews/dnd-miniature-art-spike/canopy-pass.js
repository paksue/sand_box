import * as THREE from 'three'

function rng(seed = 92017411) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 4294967296
  }
}

function makeLichenTexture() {
  const rand = rng(31337)
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, 512, 512)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const palette = ['#d7df63', '#c6d357', '#aebf45', '#e2e578', '#94aa3b']

  function branch(x, y, len, angle, depth, width, color) {
    if (depth < 0 || len < 4) return
    const bend = (rand() - 0.5) * 0.24
    const a2 = angle + bend
    const x2 = x + Math.cos(a2) * len
    const y2 = y + Math.sin(a2) * len
    const mx = (x + x2) / 2 + (rand() - 0.5) * len * 0.18
    const my = (y + y2) / 2 + (rand() - 0.5) * len * 0.18
    ctx.strokeStyle = color
    ctx.lineWidth = Math.max(1.3, width)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(mx, my, x2, y2)
    ctx.stroke()

    if (depth === 0) {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x2, y2, 1.2 + rand() * 2.1, 0, Math.PI * 2)
      ctx.fill()
      return
    }

    const n = rand() > 0.56 ? 3 : 2
    for (let i = 0; i < n; i++) {
      const spread = (i - (n - 1) / 2) * (0.54 + rand() * 0.32)
      branch(x2, y2, len * (0.61 + rand() * 0.13), a2 + spread, depth - 1, width * 0.72, color)
    }
  }

  for (let i = 0; i < 26; i++) {
    const x = 256 + (rand() - 0.5) * 180
    const y = 290 + (rand() - 0.5) * 135
    const color = palette[Math.floor(rand() * palette.length)]
    const stems = 3 + Math.floor(rand() * 4)
    for (let s = 0; s < stems; s++) {
      branch(x, y, 34 + rand() * 48, -Math.PI / 2 + (rand() - 0.5) * 2.7, 3, 5 + rand() * 3.5, color)
    }
  }

  // Fine fibrous breakup around the colony edges.
  ctx.globalAlpha = 0.75
  for (let i = 0; i < 650; i++) {
    const a = rand() * Math.PI * 2
    const r = Math.pow(rand(), 0.58) * 205
    const x = 256 + Math.cos(a) * r
    const y = 262 + Math.sin(a) * r * 0.72
    ctx.fillStyle = palette[Math.floor(rand() * palette.length)]
    ctx.fillRect(x, y, 1 + rand() * 2.2, 1 + rand() * 2.2)
  }
  ctx.globalAlpha = 1

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.generateMipmaps = true
  return tex
}

function makeGroundTexture() {
  const rand = rng(7711)
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, 256, 256)
  ctx.lineCap = 'round'
  for (let i = 0; i < 180; i++) {
    const x = 128 + (rand() - 0.5) * 210
    const y = 205 + (rand() - 0.5) * 40
    const h = 18 + rand() * 65
    ctx.strokeStyle = rand() > 0.55 ? '#9cab42' : '#c1b453'
    ctx.lineWidth = 1 + rand() * 2.8
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(x + (rand() - 0.5) * 18, y - h * 0.55, x + (rand() - 0.5) * 24, y - h)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  return tex
}

function run() {
  const world = globalThis.__dndArtSpikeWorld
  if (!world) { setTimeout(run, 250); return }

  const lichenTex = makeLichenTexture()
  const material = new THREE.MeshStandardMaterial({
    name: 'procedural_hobby_lichen',
    color: '#eef09a',
    map: lichenTex,
    alphaTest: 0.08,
    transparent: false,
    side: THREE.DoubleSide,
    roughness: 0.99,
    metalness: 0,
    emissive: new THREE.Color('#748526'),
    emissiveIntensity: 0.20,
  })

  const rand = rng()
  const dummy = new THREE.Object3D()
  const plane = new THREE.PlaneGeometry(1, 1)
  const canopy = new THREE.InstancedMesh(plane, material, 520)
  canopy.name = 'photo_alpha_canopy'
  canopy.castShadow = true

  const lobes = [
    [-0.72,0.00,0.04,.78],[-0.32,.18,-.10,.90],[.08,.18,.03,.98],[.50,.08,-.06,.88],[.82,-.02,.06,.70],
    [-.24,.53,.04,.72],[.26,.50,-.08,.70],[.02,-.32,.05,.84],
  ]
  for (let i = 0; i < 520; i++) {
    const l = lobes[i % lobes.length]
    const u = Math.pow(rand(), .64)
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    const rx = l[0] + .66 * l[3] * u * Math.sin(phi) * Math.cos(theta)
    const rz = l[2] + .52 * l[3] * u * Math.sin(phi) * Math.sin(theta)
    let ry = l[1] + .50 * l[3] * u * Math.cos(phi)
    if (rand() > .86) ry -= .20 + rand() * .34
    dummy.position.set(.28 + rx, 2.67 + ry, -2.45 + rz)
    dummy.rotation.set((rand()-.5)*1.15, rand()*Math.PI*2, (rand()-.5)*1.15)
    const s = .23 + rand() * .29
    dummy.scale.set(s * (.72 + rand()*.46), s, 1)
    dummy.updateMatrix()
    canopy.setMatrixAt(i, dummy.matrix)
  }
  canopy.instanceMatrix.needsUpdate = true
  world.add(canopy)

  const drips = new THREE.InstancedMesh(plane, material, 120)
  drips.name = 'photo_alpha_lichen_drips'
  drips.castShadow = true
  for (let i = 0; i < 120; i++) {
    const a = rand() * Math.PI * 2
    const radius = .58 + rand() * .66
    dummy.position.set(.28 + Math.cos(a)*radius, 2.10 + rand()*.54, -2.45 + Math.sin(a)*radius*.56)
    dummy.rotation.set((rand()-.5)*.25, a + Math.PI/2, (rand()-.5)*.25)
    dummy.scale.set(.15 + rand()*.13, .38 + rand()*.48, 1)
    dummy.updateMatrix()
    drips.setMatrixAt(i, dummy.matrix)
  }
  drips.instanceMatrix.needsUpdate = true
  world.add(drips)

  const grassTex = makeGroundTexture()
  const grassMat = new THREE.MeshStandardMaterial({
    name: 'hobby_static_grass', map: grassTex, alphaTest: .08, side: THREE.DoubleSide,
    roughness: 1, metalness: 0, color: '#d2c66d', emissive: new THREE.Color('#554c16'), emissiveIntensity: .06,
  })
  const edgeCards = new THREE.InstancedMesh(plane, grassMat, 420)
  edgeCards.name = 'photo_alpha_ground_flock'
  for (let i = 0; i < 420; i++) {
    const side = Math.floor(rand()*4)
    let x,z
    if (side===0){x=-4.65+rand()*9.3;z=-3.75+rand()*.54}
    else if(side===1){x=-4.65+rand()*9.3;z=3.21+rand()*.54}
    else if(side===2){x=-4.68+rand()*.54;z=-3.4+rand()*6.8}
    else{x=4.14+rand()*.54;z=-3.4+rand()*6.8}
    dummy.position.set(x,.075+rand()*.13,z)
    dummy.rotation.set(-Math.PI/2+(rand()-.5)*.62,rand()*Math.PI*2,(rand()-.5)*.25)
    const s=.12+rand()*.20
    dummy.scale.set(s,s,1)
    dummy.updateMatrix()
    edgeCards.setMatrixAt(i,dummy.matrix)
  }
  edgeCards.instanceMatrix.needsUpdate=true
  world.add(edgeCards)

  const status=document.querySelector('#status')
  if(status)status.textContent+=' · branching hobby-lichen canopy'
}
run()
