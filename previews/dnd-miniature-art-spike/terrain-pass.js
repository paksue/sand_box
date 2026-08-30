import * as THREE from 'three'

function rng(seed = 837421) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 4294967296
  }
}
const rand = rng()

const STONE_COLORS = ['#a88668','#b59673','#96765e','#c0a07d','#ad8a6d','#806756','#b08d70','#9b7d65','#c5a582','#8d705b','#a98a6c','#b69a79']
const GRASS_COLORS = ['#c1ae55','#aa9a43','#d0b95c','#89933f','#7d8b3c','#bfa74a']
const MOSS_COLORS = ['#74843a','#8f9d44','#a3a34a','#657631','#7f8f39']
const RUBBLE_COLORS = ['#a78a6c','#b69978','#92735b','#c0a282','#806653','#ad8f70']
const LICHEN_COLORS = ['#c9cf55','#d9dc64','#b6c34c','#e1df71','#a8b945','#c0c752']

function makePaintedStoneTexture(seed, baseHex) {
  const r = rng(seed)
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const ctx = c.getContext('2d')
  const base = new THREE.Color(baseHex)
  ctx.fillStyle = `rgb(${Math.round(base.r*255)},${Math.round(base.g*255)},${Math.round(base.b*255)})`
  ctx.fillRect(0,0,512,512)
  for (let i=0;i<5200;i++) {
    const v = r() > .5 ? 1 : -1
    const a = .015 + r()*.065
    const shade = v > 0 ? 220 + Math.floor(r()*30) : 45 + Math.floor(r()*50)
    ctx.fillStyle = `rgba(${shade},${shade},${shade},${a})`
    const s = .5 + Math.pow(r(),2)*3.8
    ctx.fillRect(r()*512,r()*512,s,s)
  }
  for (let i=0;i<70;i++) {
    ctx.strokeStyle = `rgba(50,38,28,${.025+r()*.065})`
    ctx.lineWidth = .6 + r()*1.8
    ctx.beginPath()
    let x=r()*512,y=r()*512
    ctx.moveTo(x,y)
    for(let j=0;j<3;j++){x+=(r()-.5)*70;y+=(r()-.5)*70;ctx.lineTo(x,y)}
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 8
  return tex
}

function makeBumpTexture(seed) {
  const r=rng(seed)
  const c=document.createElement('canvas');c.width=c.height=512
  const ctx=c.getContext('2d');ctx.fillStyle='#777';ctx.fillRect(0,0,512,512)
  for(let i=0;i<9000;i++){
    const g=80+Math.floor(r()*90),a=.04+r()*.10,s=.4+Math.pow(r(),2)*3
    ctx.fillStyle=`rgba(${g},${g},${g},${a})`;ctx.fillRect(r()*512,r()*512,s,s)
  }
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.NoColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.anisotropy=8
  return tex
}

function makeStoneMaterials() {
  return STONE_COLORS.map((color,i)=>new THREE.MeshStandardMaterial({
    color:'#ffffff',
    map:makePaintedStoneTexture(3100+i*71,color),
    bumpMap:makeBumpTexture(7400+i*53),
    bumpScale:.045 + (i%3)*.012,
    roughness:.98,
    metalness:0,
  }))
}

function chipShape(w,d,seed){
  const r=rng(seed),hw=w/2,hd=d/2
  const c=()=>.018+r()*.07,j=()=> (r()-.5)*.032
  const p=[[-hw+c(),-hd+j()],[-w*.12,-hd+j()],[hw-c(),-hd+j()],[hw+j(),-hd+c()],[hw+j(),d*.03],[hw+j(),hd-c()],[hw-c(),hd+j()],[w*.08,hd+j()],[-hw+c(),hd+j()],[-hw+j(),hd-c()],[-hw+j(),-d*.04],[-hw+j(),-hd+c()]]
  const s=new THREE.Shape();s.moveTo(...p[0]);for(let i=1;i<p.length;i++)s.lineTo(...p[i]);s.closePath();return s
}

function makeTileGeometry(w,d,h,seed){
  const geo=new THREE.ExtrudeGeometry(chipShape(w,d,seed),{depth:h,bevelEnabled:true,bevelSegments:2,bevelSize:.012+rand()*.012,bevelThickness:.010+rand()*.009,steps:1})
  geo.rotateX(-Math.PI/2);geo.computeVertexNormals();return geo
}

function addCracks(tile,topY){
  if(rand()>.34)return
  const mat=new THREE.MeshBasicMaterial({color:'#3a2d22',toneMapped:true})
  const branches=1+Math.floor(rand()*3)
  let ox=(rand()-.5)*.25,oz=(rand()-.5)*.25
  for(let j=0;j<branches;j++){
    const len=.09+rand()*.25
    const line=new THREE.Mesh(new THREE.BoxGeometry(len,.006,.009+rand()*.008),mat)
    line.position.set(ox,topY+.008,oz);line.rotation.y=rand()*Math.PI;tile.add(line)
    ox+=(rand()-.5)*.14;oz+=(rand()-.5)*.14
  }
}

function addGroutBed(world){
  const bed=new THREE.Mesh(new THREE.BoxGeometry(8.18,.06,6.22),new THREE.MeshStandardMaterial({color:'#46372b',roughness:1}))
  bed.name='battle_dark_earth_grout_bed_v2';bed.position.y=.045;bed.receiveShadow=true;world.add(bed)
}

function addTileField(world,materials){
  const group=new THREE.Group();group.name='battle_physical_tile_field_v2'
  const cols=10,rows=8,spacingX=.79,spacingZ=.78,startX=-(cols-1)*spacingX/2,startZ=-(rows-1)*spacingZ/2
  const missing=new Set(['0,0','9,7','8,0','1,7'])
  const broken=[]
  for(let z=0;z<rows;z++)for(let x=0;x<cols;x++){
    const px=startX+x*spacingX,pz=startZ+z*spacingZ,key=`${x},${z}`
    if(missing.has(key)){broken.push([px,pz]);continue}
    const w=.755+(rand()-.5)*.045,d=.748+(rand()-.5)*.045,h=.065+rand()*.040
    const tile=new THREE.Group();tile.name=`battle_weathered_stone_${x}_${z}`
    const mesh=new THREE.Mesh(makeTileGeometry(w,d,h,9000+z*41+x*11),materials[Math.floor(rand()*materials.length)])
    mesh.castShadow=mesh.receiveShadow=true;tile.add(mesh)
    tile.position.set(px+(rand()-.5)*.034,.060+(rand()-.5)*.016,pz+(rand()-.5)*.034)
    tile.rotation.set((rand()-.5)*.028,(rand()-.5)*.075,(rand()-.5)*.028)
    addCracks(tile,h);group.add(tile)
  }
  world.add(group);return broken
}

function addRubble(world,broken){
  const geo=new THREE.DodecahedronGeometry(1,0),dummy=new THREE.Object3D()
  const mats=RUBBLE_COLORS.map(c=>new THREE.MeshBasicMaterial({color:c,toneMapped:true}))
  const groups=mats.map((m,i)=>{const inst=new THREE.InstancedMesh(geo,m,55);inst.name=`battle_rubble_${i}`;world.add(inst);return inst})
  const used=new Array(groups.length).fill(0)
  for(let i=0;i<290;i++){
    let x,z
    if(i<70&&broken.length){const c=broken[i%broken.length];x=c[0]+(rand()-.5)*.62;z=c[1]+(rand()-.5)*.62}
    else{const side=Math.floor(rand()*4);if(side===0){x=-4.25+rand()*8.5;z=-3.28+rand()*.42}else if(side===1){x=-4.25+rand()*8.5;z=2.86+rand()*.42}else if(side===2){x=-4.25+rand()*.42;z=-2.95+rand()*5.9}else{x=3.83+rand()*.42;z=-2.95+rand()*5.9}}
    const gi=i%groups.length,idx=used[gi]++,s=.018+rand()*.070
    dummy.position.set(x,.10+s*.32,z);dummy.rotation.set(rand()*Math.PI,rand()*Math.PI,rand()*Math.PI);dummy.scale.set(s*(.8+rand()*1.8),s*(.28+rand()*.48),s*(.7+rand()*1.5));dummy.updateMatrix();groups[gi].setMatrixAt(idx,dummy.matrix)
  }
  groups.forEach((g,i)=>{g.count=used[i];g.instanceMatrix.needsUpdate=true})
}

function edgePoint(){const side=Math.floor(rand()*4);if(side===0)return[-4.48+rand()*8.96,-3.42+rand()*.68];if(side===1)return[-4.48+rand()*8.96,2.74+rand()*.68];if(side===2)return[-4.48+rand()*.68,-3.02+rand()*6.04];return[3.80+rand()*.68,-3.02+rand()*6.04]}

function addFlocking(world){
  const centers=[];for(let i=0;i<190;i++)centers.push(edgePoint());centers.push([-1.5,.9],[1.45,.5],[2.0,-1.2],[-2.6,-1.8],[.9,2.35],[-3.0,1.35])
  const bladeGeo=new THREE.ConeGeometry(.013,1,5,1),dummy=new THREE.Object3D()
  const grassMeshes=GRASS_COLORS.map((c,i)=>{const m=new THREE.InstancedMesh(bladeGeo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),310);m.name=`battle_grass_${i}`;world.add(m);return m})
  const used=new Array(grassMeshes.length).fill(0)
  for(const [cx,cz] of centers)for(let j=0;j<8;j++){
    const gi=Math.floor(rand()*grassMeshes.length),idx=used[gi]++;if(idx>=grassMeshes[gi].count)continue
    const h=.045+rand()*.14,a=rand()*Math.PI*2,r=rand()*.085
    dummy.position.set(cx+Math.cos(a)*r,.09+h*.5,cz+Math.sin(a)*r);dummy.rotation.set((rand()-.5)*.22,rand()*Math.PI*2,(rand()-.5)*.22);dummy.scale.set(.8+rand()*.55,h,.8+rand()*.55);dummy.updateMatrix();grassMeshes[gi].setMatrixAt(idx,dummy.matrix)
  }
  grassMeshes.forEach((g,i)=>{g.count=Math.min(used[i],g.count);g.instanceMatrix.needsUpdate=true})

  const mossGeo=new THREE.IcosahedronGeometry(1,1),mossMeshes=MOSS_COLORS.map((c,i)=>{const m=new THREE.InstancedMesh(mossGeo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),150);m.name=`battle_moss_${i}`;world.add(m);return m})
  const mu=new Array(mossMeshes.length).fill(0)
  for(let i=0;i<620;i++){
    const [x,z]=edgePoint(),gi=i%mossMeshes.length,idx=mu[gi]++,s=.015+rand()*.045
    const m=new THREE.Matrix4().makeScale(s*(1.3+rand()*2.1),s*(.18+rand()*.24),s*(1.2+rand()*1.9));m.setPosition(x,.095,z);mossMeshes[gi].setMatrixAt(idx,m)
  }
  mossMeshes.forEach((g,i)=>{g.count=mu[i];g.instanceMatrix.needsUpdate=true})
}

function makeMound(width,depth,height,seed){
  const r=rng(seed),geo=new THREE.PlaneGeometry(width,depth,56,42);geo.rotateX(-Math.PI/2)
  const p=geo.attributes.position
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),z=p.getZ(i),nx=x/(width*.5),nz=z/(depth*.5),rr=Math.sqrt(nx*nx+nz*nz)
    const fall=Math.max(0,1-rr),noise=(Math.sin(x*8.7+z*11.9)+Math.sin(x*17.1-z*9.3))*0.012 + (r()-.5)*.008
    p.setY(i,Math.pow(fall,1.5)*height + noise*fall)
  }
  p.needsUpdate=true;geo.computeVertexNormals();return geo
}

function addCanopy(world){
  const suppress=()=>world.traverse(o=>{if(/hobby_lichen|hobby_tree_mound|hobby_tree_soil|hobby_tree_root|hobby_static_grass|hobby_moss_scatter/i.test(o.name||''))o.visible=false})
  suppress();let ticks=0;const id=setInterval(()=>{suppress();if(++ticks>40)clearInterval(id)},250)
  const geo=new THREE.IcosahedronGeometry(1,2),dummy=new THREE.Object3D()
  const lobes=[[-.65,.02,.00,.76],[-.30,.25,-.07,.88],[.08,.23,.02,.94],[.45,.12,-.05,.84],[.75,-.02,.03,.66],[-.18,.53,.02,.69],[.28,.51,-.04,.67],[.02,-.28,.03,.78]]
  const groups=LICHEN_COLORS.map((c,i)=>{const m=new THREE.InstancedMesh(geo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),190);m.name=`battle_lichen_clumps_${i}`;world.add(m);return m})
  const used=new Array(groups.length).fill(0)
  for(let i=0;i<1050;i++){
    const l=lobes[i%lobes.length],u=Math.pow(rand(),.58),theta=rand()*Math.PI*2,phi=Math.acos(2*rand()-1)
    const x=.28+l[0]+.62*l[3]*u*Math.sin(phi)*Math.cos(theta),y=2.70+l[1]+.46*l[3]*u*Math.cos(phi),z=-2.45+l[2]+.48*l[3]*u*Math.sin(phi)*Math.sin(theta)
    const gi=i%groups.length,idx=used[gi]++;if(idx>=groups[gi].count)continue
    const s=.025+rand()*.065;dummy.position.set(x,y,z);dummy.rotation.set(rand()*Math.PI,rand()*Math.PI,rand()*Math.PI);dummy.scale.set(s*(.8+rand()*.8),s*(.65+rand()*.9),s*(.8+rand()*.8));dummy.updateMatrix();groups[gi].setMatrixAt(idx,dummy.matrix)
  }
  groups.forEach((g,i)=>{g.count=used[i];g.instanceMatrix.needsUpdate=true})
}

function addTreeMound(world){
  const mound=new THREE.Mesh(makeMound(2.45,1.85,.36,441),new THREE.MeshStandardMaterial({color:'#6f7749',roughness:1}))
  mound.name='battle_natural_tree_mound';mound.position.set(.28,.095,-2.45);mound.castShadow=mound.receiveShadow=true;world.add(mound)
  const soil=new THREE.Mesh(makeMound(1.5,1.05,.14,622),new THREE.MeshStandardMaterial({color:'#5a4732',roughness:1}))
  soil.name='battle_tree_soil_patch';soil.position.set(.22,.13,-2.38);soil.castShadow=soil.receiveShadow=true;world.add(soil)
  const rootMat=new THREE.MeshStandardMaterial({color:'#765239',roughness:.98})
  for(let i=0;i<10;i++){
    const a=i/10*Math.PI*2+rand()*.25,start=new THREE.Vector3(.28,.29,-2.45),len=.45+rand()*.55,end=new THREE.Vector3(.28+Math.cos(a)*len,.11+rand()*.045,-2.45+Math.sin(a)*len*.70),d=end.clone().sub(start)
    const root=new THREE.Mesh(new THREE.CylinderGeometry(.022,.058,1,10,2),rootMat);root.name='battle_exposed_root';root.position.copy(start).add(end).multiplyScalar(.5);root.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());root.scale.set(.85,d.length(),.85);root.castShadow=root.receiveShadow=true;world.add(root)
  }
}

function run(){
  const world=globalThis.__dndArtSpikeWorld;if(!world){setTimeout(run,250);return}
  [...world.children].forEach(o=>{if(/^battle_(physical_tile_field|dark_earth_grout_bed|edge_rubble|static_grass_tufts|flocking_moss_clumps|irregular_tree_mound|tree_exposed_soil)/i.test(o.name||''))o.visible=false})
  const status=document.querySelector('#status');if(status)status.textContent='Terrain loop 2: tightening joints and rebuilding hobby materials…'
  addGroutBed(world);const materials=makeStoneMaterials();const broken=addTileField(world,materials);addRubble(world,broken);addFlocking(world);addTreeMound(world);addCanopy(world)
  if(status)status.textContent='Terrain loop 2 loaded · tight stone joints · painted stone · bright flocking · natural mound'
}
run()
