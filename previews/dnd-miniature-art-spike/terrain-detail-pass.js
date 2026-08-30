import * as THREE from 'three'

function rng(seed=771204){let s=seed>>>0;return()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296}}
const rand=rng()

const STONE=['#8b694f','#9b7659','#a27b5c','#7e604b','#967055','#ad8767','#89664e','#a07a5d']
const STONE_SIDE=['#60483a','#6c5140','#745744','#594338','#6b503f','#765b48']
const DRY=['#b39a3c','#c1a746','#a78f35','#cbb152','#978232','#baa143']
const MOSS=['#63732f','#75853a','#889342','#9a9b43','#56672b','#7d8938']
const LICHEN=['#c5cb50','#d5d95f','#b4bf47','#dfdd6b','#a6b442','#c0c653']

function canvasTexture(seed, baseHex, mode='stone'){
  const r=rng(seed),c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d')
  const base=new THREE.Color(baseHex)
  ctx.fillStyle=`rgb(${Math.round(base.r*255)},${Math.round(base.g*255)},${Math.round(base.b*255)})`;ctx.fillRect(0,0,512,512)
  const dots=mode==='stone'?8500:6200
  for(let i=0;i<dots;i++){
    const hi=r()>.52,shade=hi?175+Math.floor(r()*65):35+Math.floor(r()*70),a=(mode==='stone'?.025:.035)+r()*(mode==='stone'?.075:.11)
    const s=.5+Math.pow(r(),2)*(mode==='stone'?3.2:4.8)
    ctx.fillStyle=`rgba(${shade},${Math.max(20,shade-(mode==='stone'?12:28))},${Math.max(14,shade-(mode==='stone'?22:42))},${a})`
    ctx.beginPath();ctx.arc(r()*512,r()*512,s,0,Math.PI*2);ctx.fill()
  }
  if(mode==='stone'){
    for(let i=0;i<48;i++){
      ctx.strokeStyle=`rgba(45,32,24,${.035+r()*.075})`;ctx.lineWidth=.5+r()*1.2;ctx.beginPath();let x=r()*512,y=r()*512;ctx.moveTo(x,y)
      for(let j=0;j<2+Math.floor(r()*3);j++){x+=(r()-.5)*52;y+=(r()-.5)*52;ctx.lineTo(x,y)}ctx.stroke()
    }
    // dry-brushed edge/speckle highlight
    for(let i=0;i<1200;i++){ctx.fillStyle=`rgba(235,216,186,${.02+r()*.06})`;const s=.4+r()*1.4;ctx.fillRect(r()*512,r()*512,s,s)}
  }
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.minFilter=THREE.LinearMipmapLinearFilter;t.anisotropy=8;return t
}

function bumpTexture(seed){
  const r=rng(seed),c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#808080';ctx.fillRect(0,0,256,256)
  for(let i=0;i<6000;i++){const g=72+Math.floor(r()*110),a=.05+r()*.15,s=.4+Math.pow(r(),2)*2.8;ctx.fillStyle=`rgba(${g},${g},${g},${a})`;ctx.fillRect(r()*256,r()*256,s,s)}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.NoColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t
}

const stoneTopMats=STONE.map((c,i)=>new THREE.MeshStandardMaterial({map:canvasTexture(4100+i*97,c,'stone'),bumpMap:bumpTexture(6200+i*83),bumpScale:.075,roughness:1,metalness:0}))
const sideMats=STONE_SIDE.map(c=>new THREE.MeshStandardMaterial({color:c,roughness:1,metalness:0}))

function reliefTop(w,d,seed){
  const r=rng(seed),g=new THREE.PlaneGeometry(w,d,8,8);g.rotateX(-Math.PI/2);const p=g.attributes.position
  for(let i=0;i<p.count;i++)p.setY(i,(r()-.5)*.012)
  p.needsUpdate=true;g.computeVertexNormals();return g
}

function enhanceTiles(world){
  let n=0
  world.traverse(obj=>{
    if(!obj.isGroup||!/battle_weathered_stone_/i.test(obj.name||''))return
    const base=obj.children.find(c=>c.isMesh&&!/relief/i.test(c.name||''));if(!base)return
    obj.children.forEach(c=>{if(/battle_stone_relief/i.test(c.name||''))c.visible=false})
    base.material=sideMats[n%sideMats.length]
    if(!obj.getObjectByName(`battle_stone_top_v5_${n}`)){
      const box=new THREE.Box3().setFromObject(base),size=box.getSize(new THREE.Vector3())
      const top=new THREE.Mesh(reliefTop(size.x*.955,size.z*.955,9700+n*31),stoneTopMats[n%stoneTopMats.length]);top.name=`battle_stone_top_v5_${n}`;top.position.y=size.y+.002;top.castShadow=top.receiveShadow=true;obj.add(top)
    }
    n++
  })
}

function hideOldTerrainDetail(world){
  world.traverse(o=>{
    const name=o.name||''
    if(/^battle_(earth_border_|fine_flock_|dry_grass_|mound_v4_|mound_scatter_|lichen_clumps_|lichen_filament_|moss_|grass_)/i.test(name))o.visible=false
  })
}

function trimRubble(world){
  world.traverse(o=>{if(/^battle_rubble_/i.test(o.name||'')&&o.isInstancedMesh&&!o.userData.trimmedV5){o.count=Math.min(o.count,10);o.userData.trimmedV5=true}})
}

function addBorder(world){
  const dirt=canvasTexture(8021,'#5a422f','earth')
  dirt.repeat.set(3,2)
  const mat=new THREE.MeshStandardMaterial({map:dirt,color:'#80664e',roughness:1,metalness:0})
  const specs=[[8.75,.78,0,-3.34],[8.75,.78,0,3.34],[.78,6.10,-4.10,0],[.78,6.10,4.10,0]]
  specs.forEach(([w,d,x,z],i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,.075,d),mat);m.name=`battle_scenic_earth_border_v5_${i}`;m.position.set(x,.052,z);m.receiveShadow=true;world.add(m)})
}

function edgePoint(width=.64){const side=Math.floor(rand()*4);if(side===0)return[-4.38+rand()*8.76,-3.50+rand()*width];if(side===1)return[-4.38+rand()*8.76,3.50-rand()*width];if(side===2)return[-4.48+rand()*width,-3.0+rand()*6.0];return[4.48-rand()*width,-3.0+rand()*6.0]}

function addDenseBasing(world){
  const dummy=new THREE.Object3D()
  // low moss/foam carpet: many small, broad clumps
  const mossGeo=new THREE.IcosahedronGeometry(1,1)
  const mossGroups=MOSS.map((c,i)=>{const m=new THREE.InstancedMesh(mossGeo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),430);m.name=`battle_scenic_moss_v5_${i}`;world.add(m);return m})
  const mu=new Array(mossGroups.length).fill(0)
  for(let i=0;i<2350;i++){
    const [x,z]=edgePoint(.72),gi=i%mossGroups.length,idx=mu[gi]++;if(idx>=mossGroups[gi].count)continue
    const s=.010+rand()*.030;dummy.position.set(x,.105,z);dummy.rotation.set(rand()*Math.PI,rand()*Math.PI,rand()*Math.PI);dummy.scale.set(s*(1.5+rand()*2.5),s*(.18+rand()*.28),s*(1.4+rand()*2.3));dummy.updateMatrix();mossGroups[gi].setMatrixAt(idx,dummy.matrix)
  }
  mossGroups.forEach((g,i)=>{g.count=Math.min(mu[i],g.count);g.instanceMatrix.needsUpdate=true})

  // dense short preserved/static grass rather than isolated black spikes
  const grassGeo=new THREE.ConeGeometry(.012,1,4,1)
  const grassGroups=DRY.map((c,i)=>{const m=new THREE.InstancedMesh(grassGeo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),650);m.name=`battle_scenic_grass_v5_${i}`;world.add(m);return m})
  const gu=new Array(grassGroups.length).fill(0)
  const centers=[];for(let i=0;i<390;i++)centers.push(edgePoint(.66))
  for(const [cx,cz] of centers)for(let j=0;j<8;j++){
    const gi=Math.floor(rand()*grassGroups.length),idx=gu[gi]++;if(idx>=grassGroups[gi].count)continue
    const h=.025+rand()*.090,a=rand()*Math.PI*2,rr=rand()*.075
    dummy.position.set(cx+Math.cos(a)*rr,.105+h*.5,cz+Math.sin(a)*rr);dummy.rotation.set((rand()-.5)*.18,rand()*Math.PI*2,(rand()-.5)*.18);dummy.scale.set(.75+rand()*.5,h,.75+rand()*.5);dummy.updateMatrix();grassGroups[gi].setMatrixAt(idx,dummy.matrix)
  }
  grassGroups.forEach((g,i)=>{g.count=Math.min(gu[i],g.count);g.instanceMatrix.needsUpdate=true})
}

function hemi(seed){
  const r=rng(seed),g=new THREE.SphereGeometry(1,48,22,0,Math.PI*2,0,Math.PI/2),p=g.attributes.position
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),n=(r()-.5)*.055+Math.sin(x*11+z*8)*.014;p.setXYZ(i,x*(1+n),Math.max(0,y+n*.28),z*(1+n))}
  p.needsUpdate=true;g.computeVertexNormals();return g
}

function addMound(world){
  const mossTex=canvasTexture(9055,'#65713f','earth'),earthTex=canvasTexture(9111,'#503927','earth')
  const green=new THREE.MeshStandardMaterial({map:mossTex,color:'#88905a',roughness:1}),earth=new THREE.MeshStandardMaterial({map:earthTex,color:'#785b45',roughness:1})
  const lobes=[[-.25,.12,-2.45,.82,.34,.68,green,21],[.42,.11,-2.43,.94,.38,.72,green,22],[.06,.14,-2.34,.72,.29,.56,earth,23],[.86,.09,-2.46,.45,.20,.40,green,24]]
  lobes.forEach(([x,y,z,sx,sy,sz,mat,seed],i)=>{const m=new THREE.Mesh(hemi(seed),mat);m.name=`battle_scenic_mound_v5_${i}`;m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=m.receiveShadow=true;world.add(m)})

  const gritGeo=new THREE.IcosahedronGeometry(1,1),colors=['#74803e','#9a9446','#5b4a32','#8b8140','#665b36'],groups=colors.map((c,i)=>{const m=new THREE.InstancedMesh(gritGeo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),90);m.name=`battle_mound_grit_v5_${i}`;world.add(m);return m}),used=new Array(groups.length).fill(0),dummy=new THREE.Object3D()
  for(let i=0;i<420;i++){
    const a=rand()*Math.PI*2,rr=Math.sqrt(rand())*1.02,x=.22+Math.cos(a)*rr,z=-2.44+Math.sin(a)*rr*.68,gi=i%groups.length,idx=used[gi]++,s=.008+rand()*.023
    dummy.position.set(x,.16+Math.max(0,.20*(1-rr)),z);dummy.rotation.set(rand()*Math.PI,rand()*Math.PI,rand()*Math.PI);dummy.scale.set(s*(1+rand()),s*.40,s*(1+rand()));dummy.updateMatrix();groups[gi].setMatrixAt(idx,dummy.matrix)
  }
  groups.forEach((g,i)=>{g.count=used[i];g.instanceMatrix.needsUpdate=true})
}

function lichenPoint(lobe){const a=rand()*Math.PI*2,rr=Math.pow(rand(),.72)*lobe[3];return new THREE.Vector3(.28+lobe[0]+Math.cos(a)*rr,lobe[1]+(rand()-.5)*.52,-2.45+lobe[2]+Math.sin(a)*rr*.60)}

function addLichen(world){
  // remove the round berry-like canopy from prior passes
  world.traverse(o=>{if(/^battle_lichen_(clumps|filament)/i.test(o.name||''))o.visible=false})
  const lobes=[[-.62,2.70,.00,.72],[-.28,2.96,-.06,.78],[.12,2.92,.03,.80],[.52,2.74,-.03,.72],[.02,2.50,.03,.72]]
  const arcGeo=new THREE.TorusGeometry(1,.16,4,7,Math.PI*1.28),arcGroups=LICHEN.map((c,i)=>{const m=new THREE.InstancedMesh(arcGeo,new THREE.MeshBasicMaterial({color:c,toneMapped:true,side:THREE.DoubleSide}),260);m.name=`battle_lichen_arc_v5_${i}`;world.add(m);return m}),used=new Array(arcGroups.length).fill(0),dummy=new THREE.Object3D()
  for(let i=0;i<1450;i++){
    const l=lobes[i%lobes.length],p=lichenPoint(l),gi=i%arcGroups.length,idx=used[gi]++;if(idx>=arcGroups[gi].count)continue
    const s=.027+rand()*.050;dummy.position.copy(p);dummy.rotation.set(rand()*Math.PI,rand()*Math.PI,rand()*Math.PI);dummy.scale.set(s*(.7+rand()*.7),s*(.7+rand()*.7),s*(.7+rand()*.7));dummy.updateMatrix();arcGroups[gi].setMatrixAt(idx,dummy.matrix)
  }
  arcGroups.forEach((g,i)=>{g.count=Math.min(used[i],g.count);g.instanceMatrix.needsUpdate=true})

  const strandGeo=new THREE.CylinderGeometry(.65,1,1,5,1),strandGroups=LICHEN.map((c,i)=>{const m=new THREE.InstancedMesh(strandGeo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),140);m.name=`battle_lichen_strand_v5_${i}`;world.add(m);return m}),su=new Array(strandGroups.length).fill(0)
  for(let i=0;i<700;i++){
    const l=lobes[i%lobes.length],p=lichenPoint(l),end=p.clone().add(new THREE.Vector3((rand()-.5)*.10,-(.04+rand()*.14),(rand()-.5)*.10)),d=end.clone().sub(p),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize()),gi=i%strandGroups.length,idx=su[gi]++;if(idx>=strandGroups[gi].count)continue
    const m=new THREE.Matrix4().compose(p.clone().add(end).multiplyScalar(.5),q,new THREE.Vector3(.006+rand()*.006,d.length(),.006+rand()*.006));strandGroups[gi].setMatrixAt(idx,m)
  }
  strandGroups.forEach((g,i)=>{g.count=Math.min(su[i],g.count);g.instanceMatrix.needsUpdate=true})

  // subdued cores provide depth but should never read as round foliage balls
  const coreMat=new THREE.MeshStandardMaterial({color:'#59622f',roughness:1})
  [[-.30,2.73,-2.44,.42,.30,.34],[.23,2.82,-2.45,.46,.34,.36],[.58,2.68,-2.46,.34,.25,.29],[-.02,2.48,-2.43,.48,.26,.34]].forEach(([x,y,z,sx,sy,sz],i)=>{const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1,3),coreMat);m.name=`battle_lichen_core_v5_${i}`;m.position.set(.28+x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;world.add(m)})
}

function run(){
  const world=globalThis.__dndArtSpikeWorld;if(!world){setTimeout(run,250);return}
  hideOldTerrainDetail(world);trimRubble(world);enhanceTiles(world)
  addBorder(world);addDenseBasing(world);addMound(world);addLichen(world)
  let ticks=0;const id=setInterval(()=>{hideOldTerrainDetail(world);trimRubble(world);enhanceTiles(world);if(++ticks>28)clearInterval(id)},250)
  const status=document.querySelector('#status');if(status)status.textContent='Terrain loop 5 loaded · warm pitted stone · dense scenic basing · granular mound · lichen canopy'
}
run()
