import * as THREE from 'three'

function rng(seed=92017411){let s=seed>>>0;return()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296}}
const rand=rng()

const LICHEN=['#dadd62','#cad658','#b7ca4c','#e3e674','#9fb343','#c8c85a','#ecea83']
const GRASS=['#b6aa43','#918b35','#71853a','#c0ae4b','#7d963c']
function pick(arr){return new THREE.Color(arr[Math.floor(rand()*arr.length)])}

function setSegment(inst,i,a,b,thickness=.014){
  const d=new THREE.Vector3().subVectors(b,a)
  const mid=a.clone().add(b).multiplyScalar(.5)
  const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize())
  const m=new THREE.Matrix4().compose(mid,q,new THREE.Vector3(thickness,d.length(),thickness))
  inst.setMatrixAt(i,m);inst.setColorAt(i,pick(LICHEN))
}

function addTreeMound(world){
  const moundMat=new THREE.MeshStandardMaterial({color:'#677346',roughness:1,metalness:0})
  const soilMat=new THREE.MeshStandardMaterial({color:'#50402c',roughness:1,metalness:0})
  const mound=new THREE.Mesh(new THREE.SphereGeometry(1,64,32),moundMat)
  mound.name='hobby_tree_mound';mound.scale.set(1.10,.23,.86);mound.position.set(.28,.12,-2.45);mound.castShadow=mound.receiveShadow=true;world.add(mound)
  const soil=new THREE.Mesh(new THREE.SphereGeometry(1,48,24),soilMat)
  soil.name='hobby_tree_soil';soil.scale.set(.82,.14,.62);soil.position.set(.22,.16,-2.42);soil.castShadow=soil.receiveShadow=true;world.add(soil)

  const rootMat=new THREE.MeshStandardMaterial({color:'#76533a',roughness:.98})
  const rootGeo=new THREE.CylinderGeometry(.035,.075,1,12,3)
  for(let i=0;i<10;i++){
    const a=i/10*Math.PI*2+rand()*.30,start=new THREE.Vector3(.28,.26,-2.45),len=.42+rand()*.55
    const end=new THREE.Vector3(.28+Math.cos(a)*len,.105+rand()*.05,-2.45+Math.sin(a)*len*.70)
    const d=end.clone().sub(start),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize())
    const r=new THREE.Mesh(rootGeo,rootMat);r.name='hobby_tree_root';r.position.copy(start).add(end).multiplyScalar(.5);r.quaternion.copy(q);r.scale.set(.7,d.length(),.7);r.castShadow=r.receiveShadow=true;world.add(r)
  }
}

function addLichen(world){
  // Tiny branches read as preserved/model-railroad lichen. MeshBasicMaterial is
  // intentional here: hobby flock is bright diffuse material and should not turn black in micro-shadows.
  const segGeo=new THREE.CylinderGeometry(.72,1,1,6,1,false)
  const segMat=new THREE.MeshBasicMaterial({color:'#ffffff',vertexColors:true,toneMapped:true})
  const maxSeg=7200,segs=new THREE.InstancedMesh(segGeo,segMat,maxSeg);segs.name='hobby_lichen_filaments';segs.castShadow=true
  const nodeGeo=new THREE.IcosahedronGeometry(1,1)
  const nodeMat=new THREE.MeshBasicMaterial({color:'#ffffff',vertexColors:true,toneMapped:true})
  const nodes=new THREE.InstancedMesh(nodeGeo,nodeMat,3400);nodes.name='hobby_lichen_nodes';nodes.castShadow=true
  let si=0,ni=0

  const lobes=[[-.70,.02,.03,.74],[-.36,.23,-.10,.85],[.04,.23,.04,.94],[.43,.13,-.08,.88],[.78,-.01,.05,.68],[-.24,.55,.03,.70],[.25,.52,-.05,.70],[.00,-.30,.04,.80]]
  function nodeAt(p,r){if(ni>=nodes.count)return;const m=new THREE.Matrix4().makeScale(r,r,r);m.setPosition(p);nodes.setMatrixAt(ni,m);nodes.setColorAt(ni,pick(LICHEN));ni++}
  function grow(p,dir,len,depth){
    if(depth<0||si>=maxSeg)return
    const end=p.clone().add(dir.clone().multiplyScalar(len));setSegment(segs,si++,p,end,.010+rand()*.010);nodeAt(end,.014+rand()*.018)
    if(depth===0)return
    const n=rand()>.48?3:2
    for(let j=0;j<n;j++){
      const d=dir.clone();d.x+=(rand()-.5)*1.05;d.y+=(rand()-.40)*.78;d.z+=(rand()-.5)*1.05;d.normalize();grow(end,d,len*(.58+rand()*.15),depth-1)
    }
  }

  for(let c=0;c<315;c++){
    const l=lobes[c%lobes.length],u=Math.pow(rand(),.60),theta=rand()*Math.PI*2,phi=Math.acos(2*rand()-1)
    const p=new THREE.Vector3(.28+l[0]+.65*l[3]*u*Math.sin(phi)*Math.cos(theta),2.69+l[1]+.50*l[3]*u*Math.cos(phi),-2.45+l[2]+.50*l[3]*u*Math.sin(phi)*Math.sin(theta))
    const stems=2+Math.floor(rand()*3)
    for(let s=0;s<stems;s++){
      const d=new THREE.Vector3((rand()-.5)*1.35,(rand()-.36)*1.10,(rand()-.5)*1.35).normalize();grow(p,d,.085+rand()*.10,2+Math.floor(rand()*2))
    }
  }
  for(let c=0;c<170;c++){
    const a=rand()*Math.PI*2,r=.48+rand()*.70;let p=new THREE.Vector3(.28+Math.cos(a)*r,2.28+rand()*.48,-2.45+Math.sin(a)*r*.55)
    const steps=3+Math.floor(rand()*5)
    for(let s=0;s<steps&&si<maxSeg;s++){
      const end=p.clone().add(new THREE.Vector3((rand()-.5)*.052,-(.07+rand()*.095),(rand()-.5)*.052));setSegment(segs,si++,p,end,.008+rand()*.007);nodeAt(end,.012+rand()*.013);p=end
    }
  }
  segs.count=si;nodes.count=ni;segs.instanceMatrix.needsUpdate=true;nodes.instanceMatrix.needsUpdate=true
  if(segs.instanceColor)segs.instanceColor.needsUpdate=true;if(nodes.instanceColor)nodes.instanceColor.needsUpdate=true;world.add(segs,nodes)

  // Small dark mass only to prevent the canopy from reading hollow; it must stay subordinate to lichen.
  const coreMat=new THREE.MeshStandardMaterial({color:'#55602a',roughness:1})
  const coreData=[[-.38,2.66,-2.44,.43,.33,.31],[.08,2.82,-2.47,.47,.37,.33],[.48,2.65,-2.43,.40,.31,.30],[.00,2.37,-2.45,.50,.27,.32]]
  for(const [x,y,z,sx,sy,sz] of coreData){const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1,4),coreMat);core.name='hobby_lichen_core';core.scale.set(sx,sy,sz);core.position.set(.28+x,y,z);core.castShadow=true;world.add(core)}
}

function addGroundFlock(world){
  const bladeGeo=new THREE.BoxGeometry(.014,1,.009),bladeMat=new THREE.MeshBasicMaterial({color:'#ffffff',vertexColors:true,toneMapped:true})
  const blades=new THREE.InstancedMesh(bladeGeo,bladeMat,3600);blades.name='hobby_static_grass';const dummy=new THREE.Object3D()
  for(let i=0;i<3600;i++){
    const side=Math.floor(rand()*4);let x,z
    if(side===0){x=-4.68+rand()*9.36;z=-3.72+rand()*.60}else if(side===1){x=-4.68+rand()*9.36;z=3.12+rand()*.60}else if(side===2){x=-4.68+rand()*.60;z=-3.35+rand()*6.7}else{x=4.08+rand()*.60;z=-3.35+rand()*6.7}
    const h=.04+rand()*.15;dummy.position.set(x,.085+h*.5,z);dummy.rotation.set((rand()-.5)*.28,rand()*Math.PI*2,(rand()-.5)*.28);dummy.scale.set(.7+rand()*.7,h,.7+rand()*.7);dummy.updateMatrix();blades.setMatrixAt(i,dummy.matrix);blades.setColorAt(i,pick(GRASS))
  }
  blades.instanceMatrix.needsUpdate=true;if(blades.instanceColor)blades.instanceColor.needsUpdate=true;world.add(blades)

  const mossGeo=new THREE.IcosahedronGeometry(1,1),mossMat=new THREE.MeshBasicMaterial({color:'#ffffff',vertexColors:true,toneMapped:true})
  const moss=new THREE.InstancedMesh(mossGeo,mossMat,1500);moss.name='hobby_moss_scatter'
  for(let i=0;i<1500;i++){
    const side=Math.floor(rand()*4);let x,z
    if(side===0){x=-4.62+rand()*9.24;z=-3.58+rand()*.52}else if(side===1){x=-4.62+rand()*9.24;z=3.06+rand()*.52}else if(side===2){x=-4.62+rand()*.52;z=-3.22+rand()*6.44}else{x=4.10+rand()*.52;z=-3.22+rand()*6.44}
    const s=.018+rand()*.045,m=new THREE.Matrix4().makeScale(s*(1+rand()),s*.42,s*(1+rand()));m.setPosition(x,.12,z);moss.setMatrixAt(i,m);moss.setColorAt(i,new THREE.Color(rand()>.5?'#80933b':'#a2a142'))
  }
  moss.instanceMatrix.needsUpdate=true;if(moss.instanceColor)moss.instanceColor.needsUpdate=true;world.add(moss)
}

function run(){const world=globalThis.__dndArtSpikeWorld;if(!world){setTimeout(run,250);return}addTreeMound(world);addLichen(world);addGroundFlock(world);const status=document.querySelector('#status');if(status)status.textContent+=' · bright dense 3D hobby lichen'}
run()
