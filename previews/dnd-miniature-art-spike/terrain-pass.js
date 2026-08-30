import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()
textureLoader.setCrossOrigin('anonymous')

function rng(seed = 837421) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 4294967296
  }
}
const rand = rng()

const STONE_COLORS = ['#a99072','#b49a79','#927a62','#bea382','#a2876b','#806d5c']
const GRASS_COLORS = ['#b5a34a','#9c913b','#c1ad55','#74843a','#89903d','#c6b35c']
const MOSS_COLORS = ['#6f7f35','#81933d','#9c9d42','#596d2f','#a6a64c']
const RUBBLE_COLORS = ['#8b765f','#9c856a','#735f50','#aa9274','#625449']

function ph(asset, map, res = '1k') {
  return `https://dl.polyhaven.org/file/ph-assets/Textures/jpg/${res}/${asset}/${asset}_${map}_${res}.jpg`
}

async function loadTexture(url, color = false) {
  const tex = await textureLoader.loadAsync(url)
  tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1.25, 1.25)
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 8
  return tex
}

async function loadStoneMaps() {
  const results = await Promise.allSettled([
    loadTexture(ph('pavement_01','diff'), true),
    loadTexture(ph('pavement_01','nor_gl')),
    loadTexture(ph('pavement_01','rough')),
  ])
  return {
    map: results[0].status === 'fulfilled' ? results[0].value : null,
    normalMap: results[1].status === 'fulfilled' ? results[1].value : null,
    roughnessMap: results[2].status === 'fulfilled' ? results[2].value : null,
  }
}

function chipShape(w, d, seed) {
  const r = rng(seed)
  const hw = w / 2, hd = d / 2
  const c1 = 0.035 + r() * 0.075
  const c2 = 0.035 + r() * 0.075
  const c3 = 0.035 + r() * 0.075
  const c4 = 0.035 + r() * 0.075
  const sideJ = () => (r() - 0.5) * 0.028

  const pts = [
    [-hw + c1, -hd + sideJ()],[-w * .10, -hd + sideJ()],[hw - c2, -hd + sideJ()],
    [hw + sideJ(), -hd + c2],[hw + sideJ(), d * .04],[hw + sideJ(), hd - c3],
    [hw - c3, hd + sideJ()],[w * .08, hd + sideJ()],[-hw + c4, hd + sideJ()],
    [-hw + sideJ(), hd - c4],[-hw + sideJ(), -d * .06],[-hw + sideJ(), -hd + c1],
  ]
  const shape = new THREE.Shape()
  shape.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i][0], pts[i][1])
  shape.closePath()
  return shape
}

function makeTileGeometry(w, d, h, seed) {
  const geo = new THREE.ExtrudeGeometry(chipShape(w, d, seed), {
    depth: h,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.018 + rand() * 0.012,
    bevelThickness: 0.012 + rand() * 0.010,
    curveSegments: 1,
    steps: 1,
  })
  geo.rotateX(-Math.PI / 2)
  geo.computeVertexNormals()
  return geo
}

function makeStoneMaterials(maps) {
  return STONE_COLORS.map((color, i) => new THREE.MeshStandardMaterial({
    color,
    map: maps.map,
    normalMap: maps.normalMap,
    roughnessMap: maps.roughnessMap,
    normalScale: new THREE.Vector2(0.58 + i * .035, 0.58 + i * .035),
    roughness: 0.98,
    metalness: 0,
  }))
}

function addCrack(tile, topY, idx) {
  if (rand() > 0.24) return
  const mat = new THREE.MeshBasicMaterial({ color: '#322820', toneMapped: true })
  const n = 1 + Math.floor(rand() * 2)
  for (let j = 0; j < n; j++) {
    const len = .14 + rand() * .32
    const line = new THREE.Mesh(new THREE.BoxGeometry(len, .007, .012 + rand() * .012), mat)
    line.position.set((rand()-.5)*.28, topY + .008, (rand()-.5)*.28)
    line.rotation.y = rand() * Math.PI
    tile.add(line)
  }
}

function addTileField(world, materials) {
  const group = new THREE.Group()
  group.name = 'battle_physical_tile_field'
  const cols = 10, rows = 8
  const spacingX = .84, spacingZ = .82
  const startX = -(cols - 1) * spacingX / 2
  const startZ = -(rows - 1) * spacingZ / 2
  const missing = new Set(['0,0','9,0','0,7','9,7','1,7','8,0','9,5'])
  const brokenCenters = []

  for (let z = 0; z < rows; z++) {
    for (let x = 0; x < cols; x++) {
      const key = `${x},${z}`
      const px = startX + x * spacingX
      const pz = startZ + z * spacingZ
      if (missing.has(key)) {
        brokenCenters.push([px,pz])
        continue
      }
      const w = .735 + (rand()-.5)*.055
      const d = .715 + (rand()-.5)*.055
      const h = .068 + rand()*.048
      const tile = new THREE.Group()
      tile.name = `battle_stone_tile_${x}_${z}`
      const mesh = new THREE.Mesh(makeTileGeometry(w,d,h,1000+z*31+x*7), materials[Math.floor(rand()*materials.length)])
      mesh.castShadow = mesh.receiveShadow = true
      tile.add(mesh)
      tile.position.set(px + (rand()-.5)*.038, .057 + (rand()-.5)*.022, pz + (rand()-.5)*.038)
      tile.rotation.set((rand()-.5)*.022, (rand()-.5)*.055, (rand()-.5)*.022)
      addCrack(tile, h, z*cols+x)
      group.add(tile)
    }
  }
  world.add(group)
  return brokenCenters
}

function addGroutBed(world) {
  const mat = new THREE.MeshStandardMaterial({ color:'#342b23', roughness:1, metalness:0 })
  const bed = new THREE.Mesh(new THREE.BoxGeometry(8.58,.075,6.52), mat)
  bed.name = 'battle_dark_earth_grout_bed'
  bed.position.y = .035
  bed.receiveShadow = true
  world.add(bed)
}

function addRubble(world, brokenCenters) {
  const geo = new THREE.DodecahedronGeometry(1,0)
  const mat = new THREE.MeshStandardMaterial({ color:'#ffffff', roughness:1, metalness:0, vertexColors:true })
  const count = 340
  const inst = new THREE.InstancedMesh(geo, mat, count)
  inst.name = 'battle_edge_rubble'
  inst.castShadow = inst.receiveShadow = true
  const dummy = new THREE.Object3D()
  for (let i=0;i<count;i++) {
    let x,z
    if (i < 90 && brokenCenters.length) {
      const c = brokenCenters[i % brokenCenters.length]
      x = c[0] + (rand()-.5)*.78
      z = c[1] + (rand()-.5)*.78
    } else {
      const side = Math.floor(rand()*4)
      if (side===0) { x=-4.52+rand()*9.04; z=-3.52+rand()*.42 }
      else if (side===1) { x=-4.52+rand()*9.04; z=3.10+rand()*.42 }
      else if (side===2) { x=-4.52+rand()*.42; z=-3.15+rand()*6.3 }
      else { x=4.10+rand()*.42; z=-3.15+rand()*6.3 }
    }
    const s=.025+rand()*.085
    dummy.position.set(x,.10+s*.4,z)
    dummy.rotation.set(rand()*Math.PI,rand()*Math.PI,rand()*Math.PI)
    dummy.scale.set(s*(.8+rand()*1.6),s*(.35+rand()*.7),s*(.7+rand()*1.4))
    dummy.updateMatrix(); inst.setMatrixAt(i,dummy.matrix)
    inst.setColorAt(i,new THREE.Color(RUBBLE_COLORS[Math.floor(rand()*RUBBLE_COLORS.length)]))
  }
  inst.instanceMatrix.needsUpdate=true
  if(inst.instanceColor)inst.instanceColor.needsUpdate=true
  world.add(inst)
}

function edgePoint() {
  const side=Math.floor(rand()*4)
  if(side===0)return[-4.72+rand()*9.44,-3.65+rand()*.66]
  if(side===1)return[-4.72+rand()*9.44,2.99+rand()*.66]
  if(side===2)return[-4.72+rand()*.66,-3.20+rand()*6.4]
  return[4.06+rand()*.66,-3.20+rand()*6.4]
}

function addFlocking(world) {
  const tuftCenters=[]
  for(let i=0;i<165;i++) tuftCenters.push(edgePoint())
  // a few deliberate interior tufts, matching the handcrafted reference
  tuftCenters.push([-1.4,.85],[1.4,.55],[2.1,-1.25],[-2.7,-1.8],[.95,2.45],[-3.1,1.45])

  const bladeGeo=new THREE.ConeGeometry(.014,1,5,1)
  const bladeMat=new THREE.MeshBasicMaterial({color:'#ffffff',vertexColors:true,toneMapped:true})
  const bladesPer=7, count=tuftCenters.length*bladesPer
  const grass=new THREE.InstancedMesh(bladeGeo,bladeMat,count)
  grass.name='battle_static_grass_tufts'
  const dummy=new THREE.Object3D(); let n=0
  for(const [cx,cz] of tuftCenters){
    for(let j=0;j<bladesPer;j++){
      const h=.055+rand()*.16
      const a=rand()*Math.PI*2,r=rand()*.08
      dummy.position.set(cx+Math.cos(a)*r,.085+h*.5,cz+Math.sin(a)*r)
      dummy.rotation.set((rand()-.5)*.30,rand()*Math.PI*2,(rand()-.5)*.30)
      dummy.scale.set(.75+rand()*.7,h,.75+rand()*.7)
      dummy.updateMatrix();grass.setMatrixAt(n,dummy.matrix)
      grass.setColorAt(n,new THREE.Color(GRASS_COLORS[Math.floor(rand()*GRASS_COLORS.length)]));n++
    }
  }
  grass.instanceMatrix.needsUpdate=true;if(grass.instanceColor)grass.instanceColor.needsUpdate=true
  world.add(grass)

  const mossGeo=new THREE.IcosahedronGeometry(1,1)
  const mossMat=new THREE.MeshBasicMaterial({color:'#ffffff',vertexColors:true,toneMapped:true})
  const moss=new THREE.InstancedMesh(mossGeo,mossMat,650)
  moss.name='battle_flocking_moss_clumps'
  for(let i=0;i<650;i++){
    const [x,z]=edgePoint();const s=.018+rand()*.052
    const m=new THREE.Matrix4().makeScale(s*(1.2+rand()*2),s*(.22+rand()*.28),s*(1.1+rand()*1.8));m.setPosition(x,.09,z)
    moss.setMatrixAt(i,m);moss.setColorAt(i,new THREE.Color(MOSS_COLORS[Math.floor(rand()*MOSS_COLORS.length)]))
  }
  moss.instanceMatrix.needsUpdate=true;if(moss.instanceColor)moss.instanceColor.needsUpdate=true
  world.add(moss)
}

function deformMoundGeometry() {
  const geo=new THREE.SphereGeometry(1,64,32)
  const p=geo.attributes.position
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i)
    const n=Math.sin(x*8.3+z*11.1+i*.21)*.045 + Math.sin(x*17.7-z*9.4)*.026
    p.setXYZ(i,x*(1+n),y+n*.55,z*(1+n))
  }
  p.needsUpdate=true;geo.computeVertexNormals();return geo
}

function addTreeMound(world) {
  // Hide previous smooth mound/ground-flock helpers if they arrive before or after this pass.
  const suppress = () => world.traverse(o => {
    if (/hobby_tree_mound|hobby_tree_soil|hobby_tree_root|hobby_static_grass|hobby_moss_scatter/i.test(o.name||'')) o.visible=false
  })
  suppress();let passes=0;const timer=setInterval(()=>{suppress();if(++passes>30)clearInterval(timer)},250)

  const earth=new THREE.MeshStandardMaterial({color:'#5c5138',roughness:1})
  const green=new THREE.MeshStandardMaterial({color:'#697342',roughness:1})
  const mound=new THREE.Mesh(deformMoundGeometry(),green)
  mound.name='battle_irregular_tree_mound';mound.scale.set(1.22,.27,.92);mound.position.set(.28,.16,-2.45);mound.castShadow=mound.receiveShadow=true;world.add(mound)
  const soil=new THREE.Mesh(deformMoundGeometry(),earth)
  soil.name='battle_tree_exposed_soil';soil.scale.set(.83,.16,.62);soil.position.set(.22,.19,-2.40);soil.castShadow=soil.receiveShadow=true;world.add(soil)

  const rootMat=new THREE.MeshStandardMaterial({color:'#6f4b33',roughness:.98})
  for(let i=0;i<11;i++){
    const a=i/11*Math.PI*2+rand()*.22
    const start=new THREE.Vector3(.28,.28,-2.45),len=.50+rand()*.58
    const end=new THREE.Vector3(.28+Math.cos(a)*len,.11+rand()*.05,-2.45+Math.sin(a)*len*.72)
    const d=end.clone().sub(start)
    const r=new THREE.Mesh(new THREE.CylinderGeometry(.025,.065,1,10,2),rootMat)
    r.name='battle_exposed_tree_root';r.position.copy(start).add(end).multiplyScalar(.5)
    r.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());r.scale.set(.8,d.length(),.8);r.castShadow=r.receiveShadow=true;world.add(r)
  }
}

async function run(){
  const world=globalThis.__dndArtSpikeWorld
  if(!world){setTimeout(run,250);return}
  const status=document.querySelector('#status')
  if(status)status.textContent='Terrain pass: building individual chipped stones…'
  addGroutBed(world)
  const maps=await loadStoneMaps()
  const materials=makeStoneMaterials(maps)
  const broken=addTileField(world,materials)
  addRubble(world,broken)
  addFlocking(world)
  addTreeMound(world)
  if(status)status.textContent='Terrain pass loaded · individual stones · rubble · flocking · irregular mound'
}
run().catch(err=>console.error('terrain pass failed',err))
