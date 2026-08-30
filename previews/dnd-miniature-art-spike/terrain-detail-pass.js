import * as THREE from 'three'

function rng(seed=552019){let s=seed>>>0;return()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296}}
const rand=rng()

const TILE_SIDE=['#96775f','#a08166','#a98a6d','#8d705a','#b09172','#9d7f65','#a38569','#92745d']
const TILE_TOP=['#b39778','#a98b6e','#c0a07f','#ad8e70','#b89a7a','#a9896d']
const LICHEN=['#c9cf55','#d8dc63','#b5c24b','#e0df70','#a9b844','#c1c756']
const FLOCK=['#697a34','#7f8d39','#99a044','#a7a34b','#596c2e']

function surfaceGeometry(w,d,seed){
  const r=rng(seed)
  const geo=new THREE.PlaneGeometry(w,d,12,12);geo.rotateX(-Math.PI/2)
  const p=geo.attributes.position,colors=[]
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),z=p.getZ(i)
    const n=Math.sin(x*23+z*19+i*.13)*.006 + Math.sin(x*47-z*31)*.003 + (r()-.5)*.004
    p.setY(i,.004+n)
    const shade=.82+r()*.20
    colors.push(shade,shade*.96,shade*.90)
  }
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));p.needsUpdate=true;geo.computeVertexNormals();return geo
}

function enhanceTiles(world){
  const topMats=TILE_TOP.map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.98,metalness:0,vertexColors:true}))
  let n=0
  world.traverse(obj=>{
    if(!obj.isGroup||!/battle_weathered_stone_/i.test(obj.name||''))return
    const base=obj.children.find(c=>c.isMesh)
    if(!base||base.userData.surfaceEnhanced)return
    base.userData.surfaceEnhanced=true
    const box=new THREE.Box3().setFromObject(base),size=box.getSize(new THREE.Vector3())
    const side=new THREE.MeshStandardMaterial({color:TILE_SIDE[n%TILE_SIDE.length],roughness:1,metalness:0})
    base.material=side
    const top=new THREE.Mesh(surfaceGeometry(size.x*.90,size.z*.90,7000+n*29),topMats[n%topMats.length])
    top.name=`battle_stone_relief_${n}`
    top.position.y=size.y+.004
    top.castShadow=top.receiveShadow=true
    obj.add(top)
    n++
  })
}

function makeDirtTexture(){
  const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d'),r=rng(9011)
  ctx.fillStyle='#5a4532';ctx.fillRect(0,0,512,512)
  for(let i=0;i<6000;i++){
    const light=r()>.5?115+Math.floor(r()*50):45+Math.floor(r()*45),a=.02+r()*.09,s=.5+r()*3
    ctx.fillStyle=`rgba(${light},${Math.max(30,light-18)},${Math.max(20,light-28)},${a})`;ctx.fillRect(r()*512,r()*512,s,s)
  }
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,2);return t
}

function addEarthBorder(world){
  const mat=new THREE.MeshStandardMaterial({map:makeDirtTexture(),color:'#8a735f',roughness:1,metalness:0})
  const specs=[[8.65,.62,0,-3.33],[8.65,.62,0,3.33],[.62,6.15,-4.06,0],[.62,6.15,4.06,0]]
  specs.forEach(([w,d,x,z],i)=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,.055,d),mat);m.name=`battle_earth_border_${i}`;m.position.set(x,.044,z);m.receiveShadow=true;world.add(m)
  })
}

function hideCoarseMoss(world){
  world.traverse(o=>{if(/^battle_moss_/i.test(o.name||''))o.visible=false})
}

function edgePoint(){const side=Math.floor(rand()*4);if(side===0)return[-4.35+rand()*8.7,-3.42+rand()*.55];if(side===1)return[-4.35+rand()*8.7,2.87+rand()*.55];if(side===2)return[-4.35+rand()*.55,-3.0+rand()*6];return[3.8+rand()*.55,-3.0+rand()*6]}

function addFineFlock(world){
  const geo=new THREE.TetrahedronGeometry(1,1),dummy=new THREE.Object3D()
  const groups=FLOCK.map((c,i)=>{const m=new THREE.InstancedMesh(geo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),230);m.name=`battle_fine_flock_${i}`;world.add(m);return m})
  const used=new Array(groups.length).fill(0)
  for(let i=0;i<1020;i++){
    const [x,z]=edgePoint(),gi=i%groups.length,idx=used[gi]++,s=.008+rand()*.024
    dummy.position.set(x,.092,z);dummy.rotation.set(rand()*Math.PI,rand()*Math.PI,rand()*Math.PI);dummy.scale.set(s*(1+rand()*2),s*(.25+rand()*.4),s*(1+rand()*2));dummy.updateMatrix();groups[gi].setMatrixAt(idx,dummy.matrix)
  }
  groups.forEach((g,i)=>{g.count=used[i];g.instanceMatrix.needsUpdate=true})
}

function hemisphereGeo(seed){
  const r=rng(seed),g=new THREE.SphereGeometry(1,56,24,0,Math.PI*2,0,Math.PI/2),p=g.attributes.position
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i),n=(Math.sin(x*8.1+z*10.3+i*.09)+Math.sin(x*17-z*12))*0.025+(r()-.5)*.015
    p.setXYZ(i,x*(1+n),Math.max(0,y+n*.35),z*(1+n))
  }
  p.needsUpdate=true;g.computeVertexNormals();return g
}

function rebuildMound(world){
  world.traverse(o=>{if(/battle_natural_tree_mound|battle_tree_soil_patch/i.test(o.name||''))o.visible=false})
  const green=new THREE.MeshStandardMaterial({color:'#6b7345',roughness:1}),earth=new THREE.MeshStandardMaterial({color:'#57412d',roughness:1})
  const lumps=[
    [.25,.10,-2.45,1.05,.31,.76,green,801],[-.32,.09,-2.43,.58,.22,.48,green,913],[.80,.085,-2.39,.48,.19,.42,green,1041],
    [.20,.115,-2.38,.72,.15,.51,earth,1201]
  ]
  lumps.forEach(([x,y,z,sx,sy,sz,mat,seed],i)=>{const m=new THREE.Mesh(hemisphereGeo(seed),mat);m.name=`battle_mound_lobe_${i}`;m.scale.set(sx,sy,sz);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;world.add(m)})
}

function segmentMatrix(a,b,thick){
  const d=b.clone().sub(a),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize())
  return new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(.5),q,new THREE.Vector3(thick,d.length(),thick))
}

function addLichenFilaments(world){
  const geo=new THREE.CylinderGeometry(.70,1,1,5,1,false)
  const groups=LICHEN.map((c,i)=>{const m=new THREE.InstancedMesh(geo,new THREE.MeshBasicMaterial({color:c,toneMapped:true}),300);m.name=`battle_lichen_filament_${i}`;world.add(m);return m})
  const used=new Array(groups.length).fill(0)
  const lobes=[[-.60,2.70,-2.43,.68],[-.25,2.92,-2.50,.75],[.14,2.90,-2.40,.78],[.52,2.75,-2.47,.70],[.02,2.48,-2.43,.72]]
  for(let chain=0;chain<390;chain++){
    const l=lobes[chain%lobes.length],a=rand()*Math.PI*2,rr=Math.sqrt(rand())*l[3]
    let p=new THREE.Vector3(.28+l[0]+Math.cos(a)*rr,l[1]+(rand()-.5)*.52,-2.45+(l[2]+2.45)+Math.sin(a)*rr*.58)
    const steps=2+Math.floor(rand()*4)
    for(let s=0;s<steps;s++){
      const end=p.clone().add(new THREE.Vector3((rand()-.5)*.13,(rand()-.43)*.14,(rand()-.5)*.13))
      const gi=(chain+s)%groups.length,idx=used[gi]++;if(idx<groups[gi].count)groups[gi].setMatrixAt(idx,segmentMatrix(p,end,.005+rand()*.006));p=end
    }
  }
  groups.forEach((g,i)=>{g.count=Math.min(used[i],g.count);g.instanceMatrix.needsUpdate=true})
}

function run(){
  const world=globalThis.__dndArtSpikeWorld;if(!world){setTimeout(run,250);return}
  let tries=0
  const apply=()=>{enhanceTiles(world);hideCoarseMoss(world);if(!world.getObjectByName('battle_earth_border_0'))addEarthBorder(world);if(!world.getObjectByName('battle_fine_flock_0'))addFineFlock(world);if(!world.getObjectByName('battle_mound_lobe_0'))rebuildMound(world);if(!world.getObjectByName('battle_lichen_filament_0'))addLichenFilaments(world)}
  apply();const id=setInterval(()=>{apply();if(++tries>20)clearInterval(id)},250)
  const status=document.querySelector('#status');if(status)status.textContent='Terrain detail pass loaded · relief stone tops · earth border · fine flock · lichen fibers'
}
run()
