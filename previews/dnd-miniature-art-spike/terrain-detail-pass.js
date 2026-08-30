import * as THREE from 'three'

function rng(seed=552019){let s=seed>>>0;return()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296}}
const rand=rng()

const TILE_SIDE=['#6f5645','#775d4a','#80634e','#69503f','#826751','#725946','#79604c','#684f3e']
const TILE_TOP=['#927056','#9c795d','#86664f','#a17d60','#8d6d54','#97745a']
const LICHEN=['#c7cc54','#d7da62','#b6c04c','#dcda6d','#aab545','#bec453']
const FLOCK=['#667632','#7d8938','#929a40','#a39e46','#59682d']
const DRY=['#ad9737','#bda544','#c9ad4a','#978532','#b7a13f']

function surfaceGeometry(w,d,seed){
  const r=rng(seed)
  const geo=new THREE.PlaneGeometry(w,d,10,10);geo.rotateX(-Math.PI/2)
  const p=geo.attributes.position,colors=[]
  for(let i=0;i<p.count;i++){
    const n=(r()-.5)*.010 + (r()-.5)*.005
    p.setY(i,.004+n)
    const shade=.79+r()*.16
    colors.push(shade,shade*.93,shade*.86)
  }
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));p.needsUpdate=true;geo.computeVertexNormals();return geo
}

function enhanceTiles(world){
  const topMats=TILE_TOP.map(c=>new THREE.MeshStandardMaterial({color:c,roughness:1,metalness:0,vertexColors:true,flatShading:false}))
  let n=0
  world.traverse(obj=>{
    if(!obj.isGroup||!/battle_weathered_stone_/i.test(obj.name||''))return
    const base=obj.children.find(c=>c.isMesh&&!/relief/i.test(c.name||''))
    if(!base)return
    if(!base.userData.surfaceEnhancedV4){
      base.userData.surfaceEnhancedV4=true
      base.material=new THREE.MeshStandardMaterial({color:TILE_SIDE[n%TILE_SIDE.length],roughness:1,metalness:0})
      // Hide older relief plane from the previous loop if present.
      obj.children.forEach(c=>{if(/battle_stone_relief_/i.test(c.name||''))c.visible=false})
      const box=new THREE.Box3().setFromObject(base),size=box.getSize(new THREE.Vector3())
      const top=new THREE.Mesh(surfaceGeometry(size.x*.95,size.z*.95,12000+n*43),topMats[n%topMats.length])
      top.name=`battle_stone_relief_v4_${n}`;top.position.y=size.y+.004;top.castShadow=top.receiveShadow=true;obj.add(top)
    }
    n++
  })
}

function makeDirtTexture(){
  const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d'),r=rng(9011)
  ctx.fillStyle='#4c3829';ctx.fillRect(0,0,512,512)
  for(let i=0;i<7000;i++){
    const light=r()>.5?105+Math.floor(r()*45):35+Math.floor(r()*40),a=.025+r()*.08,s=.5+r()*2.8
    ctx.fillStyle=`rgba(${light},${Math.max(25,light-20)},${Math.max(15,light-30)},${a})`;ctx.fillRect(r()*512,r()*512,s,s)
  }
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,2);return t
}

function addEarthBorder(world){
  const mat=new THREE.MeshStandardMaterial({map:makeDirtTexture(),color:'#705844',roughness:1,metalness:0})
  const specs=[[8.65,.64,0,-3.33],[8.65,.64,0,3.33],[.64,6.15,-4.06,0],[.64,6.15,4.06,0]]
  specs.forEach(([w,d,x,z],i)=>{const old=world.getObjectByName(`battle_earth_border_${i}`);if(old)old.visible=false;const m=new THREE.Mesh(new THREE.BoxGeometry(w,.06,d),mat);m.name=`battle_earth_border_v4_${i}`;m.position.set(x,.048,z);m.receiveShadow=true;world.add(m)})
}

function trimRubble(world){
  world.traverse(o=>{if(/^battle_rubble_/i.test(o.name||'')&&o.isInstancedMesh)o.count=Math.max(12,Math.floor(o.count*.58))})
}

function edgePoint(){const side=Math.floor(rand()*4);if(side===0)return[-4.35+rand()*8.7,-3.42+rand()*.55];if(side===1)return[-4.35+rand()*8.7,2.87+rand()*.55];if(side===2)return[-4.35+rand()*.55,-3.0+rand()*6];return[3.8+rand()*.55,-3.0+rand()*6]}

function hideCoarseMoss(world){world.traverse(o=>{if(/^battle_moss_|^battle_fine_flock_/i.test(o.name||''))o.visible=false})}

function addFineFlock(world){
  const geo=new THREE.TetrahedronGeometry(1,1),dummy=new THREE.Object3D()
  const groups=FLOCK.map((c,i)=>{const m=new THREE.InstancedMesh(geo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),180);m.name=`battle_fine_flock_v4_${i}`;world.add(m);return m})
  const used=new Array(groups.length).fill(0)
  for(let i=0;i<760;i++){
    const [x,z]=edgePoint(),gi=i%groups.length,idx=used[gi]++,s=.006+rand()*.018
    dummy.position.set(x,.092,z);dummy.rotation.set(rand()*Math.PI,rand()*Math.PI,rand()*Math.PI);dummy.scale.set(s*(1+rand()*1.7),s*(.20+rand()*.28),s*(1+rand()*1.7));dummy.updateMatrix();groups[gi].setMatrixAt(idx,dummy.matrix)
  }
  groups.forEach((g,i)=>{g.count=used[i];g.instanceMatrix.needsUpdate=true})
}

function addDryGrassCarpet(world){
  const geo=new THREE.ConeGeometry(.010,1,4,1),dummy=new THREE.Object3D()
  const groups=DRY.map((c,i)=>{const m=new THREE.InstancedMesh(geo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),460);m.name=`battle_dry_grass_v4_${i}`;world.add(m);return m})
  const used=new Array(groups.length).fill(0)
  const centers=[];for(let i=0;i<260;i++)centers.push(edgePoint())
  for(const [cx,cz] of centers)for(let j=0;j<8;j++){
    const gi=Math.floor(rand()*groups.length),idx=used[gi]++;if(idx>=groups[gi].count)continue
    const h=.025+rand()*.075,a=rand()*Math.PI*2,rr=rand()*.07
    dummy.position.set(cx+Math.cos(a)*rr,.09+h*.5,cz+Math.sin(a)*rr);dummy.rotation.set((rand()-.5)*.25,rand()*Math.PI*2,(rand()-.5)*.25);dummy.scale.set(.75+rand()*.45,h,.75+rand()*.45);dummy.updateMatrix();groups[gi].setMatrixAt(idx,dummy.matrix)
  }
  groups.forEach((g,i)=>{g.count=Math.min(used[i],g.count);g.instanceMatrix.needsUpdate=true})
}

function hemisphereGeo(seed){
  const r=rng(seed),g=new THREE.SphereGeometry(1,56,24,0,Math.PI*2,0,Math.PI/2),p=g.attributes.position
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i),n=(r()-.5)*.045 + Math.sin(x*13+z*9)*.018
    p.setXYZ(i,x*(1+n),Math.max(0,y+n*.28),z*(1+n))
  }
  p.needsUpdate=true;g.computeVertexNormals();return g
}

function rebuildMound(world){
  world.traverse(o=>{if(/battle_natural_tree_mound|battle_tree_soil_patch|battle_mound_lobe_/i.test(o.name||''))o.visible=false})
  const green=new THREE.MeshStandardMaterial({color:'#59633b',roughness:1}),earth=new THREE.MeshStandardMaterial({color:'#4f3928',roughness:1})
  const lumps=[
    [.25,.10,-2.45,1.10,.36,.79,green,801],[-.34,.09,-2.43,.62,.25,.50,green,913],[.82,.085,-2.39,.51,.22,.44,green,1041],[.18,.12,-2.38,.74,.17,.53,earth,1201]
  ]
  lumps.forEach(([x,y,z,sx,sy,sz,mat,seed],i)=>{const m=new THREE.Mesh(hemisphereGeo(seed),mat);m.name=`battle_mound_v4_${i}`;m.scale.set(sx,sy,sz);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;world.add(m)})

  const scatterGeo=new THREE.IcosahedronGeometry(1,1),colors=['#7c823e','#8b8b43','#665b37','#9a9148','#514632'],dummy=new THREE.Object3D()
  const groups=colors.map((c,i)=>{const m=new THREE.InstancedMesh(scatterGeo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),55);m.name=`battle_mound_scatter_${i}`;world.add(m);return m})
  const used=new Array(groups.length).fill(0)
  for(let i=0;i<240;i++){
    const a=rand()*Math.PI*2,rr=Math.sqrt(rand())*.95,x=.25+Math.cos(a)*rr,z=-2.45+Math.sin(a)*rr*.65,top=.11+.33*Math.sqrt(Math.max(0,1-rr*rr)),gi=i%groups.length,idx=used[gi]++,s=.009+rand()*.025
    dummy.position.set(x,top,z);dummy.rotation.set(rand()*Math.PI,rand()*Math.PI,rand()*Math.PI);dummy.scale.set(s*(1+rand()),s*.45,s*(1+rand()));dummy.updateMatrix();groups[gi].setMatrixAt(idx,dummy.matrix)
  }
  groups.forEach((g,i)=>{g.count=used[i];g.instanceMatrix.needsUpdate=true})
}

function segmentMatrix(a,b,thick){const d=b.clone().sub(a),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());return new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(.5),q,new THREE.Vector3(thick,d.length(),thick))}

function addLichenFilaments(world){
  world.traverse(o=>{if(/^battle_lichen_filament_/i.test(o.name||''))o.visible=false})
  const geo=new THREE.CylinderGeometry(.72,1,1,5,1,false)
  const groups=LICHEN.map((c,i)=>{const m=new THREE.InstancedMesh(geo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),420);m.name=`battle_lichen_filament_v4_${i}`;world.add(m);return m})
  const used=new Array(groups.length).fill(0)
  const lobes=[[-.60,2.70,-2.43,.68],[-.25,2.92,-2.50,.75],[.14,2.90,-2.40,.78],[.52,2.75,-2.47,.70],[.02,2.48,-2.43,.72]]
  for(let chain=0;chain<620;chain++){
    const l=lobes[chain%lobes.length],a=rand()*Math.PI*2,rr=(.35+rand()*.65)*l[3]
    let p=new THREE.Vector3(.28+l[0]+Math.cos(a)*rr,l[1]+(rand()-.5)*.48,-2.45+(l[2]+2.45)+Math.sin(a)*rr*.56)
    const steps=3+Math.floor(rand()*4)
    for(let s=0;s<steps;s++){
      const end=p.clone().add(new THREE.Vector3((rand()-.5)*.14,(rand()-.46)*.13,(rand()-.5)*.14))
      const gi=(chain+s)%groups.length,idx=used[gi]++;if(idx<groups[gi].count)groups[gi].setMatrixAt(idx,segmentMatrix(p,end,.008+rand()*.006));p=end
    }
  }
  groups.forEach((g,i)=>{g.count=Math.min(used[i],g.count);g.instanceMatrix.needsUpdate=true})
}

function run(){
  const world=globalThis.__dndArtSpikeWorld;if(!world){setTimeout(run,250);return}
  let tries=0
  const apply=()=>{
    enhanceTiles(world);hideCoarseMoss(world);trimRubble(world)
    if(!world.getObjectByName('battle_earth_border_v4_0'))addEarthBorder(world)
    if(!world.getObjectByName('battle_fine_flock_v4_0'))addFineFlock(world)
    if(!world.getObjectByName('battle_dry_grass_v4_0'))addDryGrassCarpet(world)
    if(!world.getObjectByName('battle_mound_v4_0'))rebuildMound(world)
    if(!world.getObjectByName('battle_lichen_filament_v4_0'))addLichenFilaments(world)
  }
  apply();const id=setInterval(()=>{apply();if(++tries>20)clearInterval(id)},250)
  const status=document.querySelector('#status');if(status)status.textContent='Terrain loop 4 loaded · warm pitted stone · dense dry flock · granular mound · lichen fibers'
}
run()
