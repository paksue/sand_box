import * as THREE from 'three'

function rng(seed=92017411){let s=seed>>>0;return()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296}}
const rand=rng()

function colorPick(){
  const colors=['#d2d75c','#bfc94e','#a9b943','#dfe16c','#91a53a','#c6c65a']
  return new THREE.Color(colors[Math.floor(rand()*colors.length)])
}

function setSegment(inst,i,a,b,thickness=.012){
  const d=new THREE.Vector3().subVectors(b,a)
  const mid=a.clone().add(b).multiplyScalar(.5)
  const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize())
  const m=new THREE.Matrix4().compose(mid,q,new THREE.Vector3(thickness,d.length(),thickness))
  inst.setMatrixAt(i,m)
  inst.setColorAt(i,colorPick())
}

function addTreeMound(world){
  const moundMat=new THREE.MeshStandardMaterial({color:'#6f7b4c',roughness:1,metalness:0})
  const soilMat=new THREE.MeshStandardMaterial({color:'#51412e',roughness:1,metalness:0})
  const mound=new THREE.Mesh(new THREE.SphereGeometry(1,56,28),moundMat)
  mound.name='hobby_tree_mound'
  mound.scale.set(1.32,.32,1.05);mound.position.set(.28,.14,-2.45);mound.castShadow=mound.receiveShadow=true;world.add(mound)
  const soil=new THREE.Mesh(new THREE.SphereGeometry(1,40,20),soilMat)
  soil.scale.set(1.05,.20,.82);soil.position.set(.22,.19,-2.42);soil.castShadow=soil.receiveShadow=true;world.add(soil)

  const rootMat=new THREE.MeshStandardMaterial({color:'#72513a',roughness:.97})
  const rootGeo=new THREE.CylinderGeometry(.035,.075,1,10,3)
  for(let i=0;i<9;i++){
    const a=i/9*Math.PI*2+rand()*.35
    const start=new THREE.Vector3(.28,.29,-2.45)
    const len=.55+rand()*.62
    const end=new THREE.Vector3(.28+Math.cos(a)*len,.12+rand()*.08,-2.45+Math.sin(a)*len*.72)
    const d=end.clone().sub(start),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize())
    const r=new THREE.Mesh(rootGeo,rootMat);r.position.copy(start).add(end).multiplyScalar(.5);r.quaternion.copy(q);r.scale.set(.7,d.length(),.7);r.castShadow=r.receiveShadow=true;world.add(r)
  }
}

function addLichen(world){
  const segGeo=new THREE.CylinderGeometry(.7,1,1,6,1,false)
  const segMat=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,metalness:0,vertexColors:true,emissive:'#2e3512',emissiveIntensity:.10})
  const maxSeg=4200
  const segs=new THREE.InstancedMesh(segGeo,segMat,maxSeg);segs.name='hobby_lichen_filaments';segs.castShadow=true
  const nodeGeo=new THREE.IcosahedronGeometry(1,1)
  const nodeMat=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,vertexColors:true,emissive:'#303713',emissiveIntensity:.08})
  const nodes=new THREE.InstancedMesh(nodeGeo,nodeMat,1800);nodes.name='hobby_lichen_nodes';nodes.castShadow=true
  let si=0,ni=0

  const lobes=[[-.66,.02,.03,.72],[-.28,.22,-.08,.86],[.12,.20,.04,.92],[.52,.10,-.06,.82],[.79,-.02,.05,.64],[-.20,.53,.04,.67],[.27,.50,-.05,.67],[.02,-.30,.04,.78]]
  function nodeAt(p,r){if(ni>=nodes.count)return;const m=new THREE.Matrix4().makeScale(r,r,r);m.setPosition(p);nodes.setMatrixAt(ni,m);nodes.setColorAt(ni,colorPick());ni++}
  function grow(p,dir,len,depth){
    if(depth<0||si>=maxSeg)return
    const end=p.clone().add(dir.clone().multiplyScalar(len))
    setSegment(segs,si++,p,end,.008+rand()*.009);nodeAt(end,.012+rand()*.015)
    if(depth===0)return
    const n=rand()>.58?3:2
    for(let j=0;j<n;j++){
      const d=dir.clone()
      d.x+=(rand()-.5)*1.05;d.y+=(rand()-.38)*.80;d.z+=(rand()-.5)*1.05;d.normalize()
      grow(end,d,len*(.58+rand()*.14),depth-1)
    }
  }
  for(let c=0;c<185;c++){
    const l=lobes[c%lobes.length]
    const u=Math.pow(rand(),.62),theta=rand()*Math.PI*2,phi=Math.acos(2*rand()-1)
    const p=new THREE.Vector3(.28+l[0]+.66*l[3]*u*Math.sin(phi)*Math.cos(theta),2.68+l[1]+.50*l[3]*u*Math.cos(phi),-2.45+l[2]+.52*l[3]*u*Math.sin(phi)*Math.sin(theta))
    const stems=2+Math.floor(rand()*3)
    for(let s=0;s<stems;s++){
      const d=new THREE.Vector3((rand()-.5)*1.4,(rand()-.30)*1.15,(rand()-.5)*1.4).normalize()
      grow(p,d,.09+rand()*.10,2+Math.floor(rand()*2))
    }
  }
  // Hanging preserved-lichen strands.
  for(let c=0;c<115;c++){
    const a=rand()*Math.PI*2,r=.52+rand()*.72
    let p=new THREE.Vector3(.28+Math.cos(a)*r,2.30+rand()*.45,-2.45+Math.sin(a)*r*.56)
    const steps=3+Math.floor(rand()*4)
    for(let s=0;s<steps&&si<maxSeg;s++){
      const end=p.clone().add(new THREE.Vector3((rand()-.5)*.055,-(.08+rand()*.10),(rand()-.5)*.055))
      setSegment(segs,si++,p,end,.006+rand()*.007);nodeAt(end,.010+rand()*.011);p=end
    }
  }
  segs.count=si;nodes.count=ni;segs.instanceMatrix.needsUpdate=true;nodes.instanceMatrix.needsUpdate=true
  if(segs.instanceColor)segs.instanceColor.needsUpdate=true;if(nodes.instanceColor)nodes.instanceColor.needsUpdate=true
  world.add(segs,nodes)

  // Shadowy interior clumps, almost completely hidden by the lichen network.
  const coreMat=new THREE.MeshStandardMaterial({color:'#596327',roughness:1})
  for(const [x,y,z,sx,sy,sz] of [[-.42,2.66,-2.44,.68,.52,.48],[.15,2.82,-2.47,.72,.58,.50],[.58,2.65,-2.43,.60,.46,.44],[.00,2.35,-2.45,.78,.43,.48]]){
    const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1,3),coreMat);core.scale.set(sx,sy,sz);core.position.set(.28+x,y,z);core.castShadow=true;world.add(core)
  }
}

function addGroundFlock(world){
  const bladeGeo=new THREE.BoxGeometry(.012,1,.008)
  const bladeMat=new THREE.MeshStandardMaterial({color:'#ffffff',roughness=1,vertexColors:true})
  const blades=new THREE.InstancedMesh(bladeGeo,bladeMat,2600);blades.name='hobby_static_grass'
  const dummy=new THREE.Object3D()
  for(let i=0;i<2600;i++){
    const side=Math.floor(rand()*4);let x,z
    if(side===0){x=-4.68+rand()*9.36;z=-3.72+rand()*.55}
    else if(side===1){x=-4.68+rand()*9.36;z=3.17+rand()*.55}
    else if(side===2){x=-4.68+rand()*.55;z=-3.35+rand()*6.7}
    else{x=4.13+rand()*.55;z=-3.35+rand()*6.7}
    const h=.035+rand()*.13
    dummy.position.set(x,.08+h*.5,z);dummy.rotation.set((rand()-.5)*.22,rand()*Math.PI*2,(rand()-.5)*.22);dummy.scale.set(.65+rand()*.7,h,.65+rand()*.7);dummy.updateMatrix();blades.setMatrixAt(i,dummy.matrix)
    blades.setColorAt(i,new THREE.Color(rand()>.55?'#a89d3d':'#6f8b36'))
  }
  blades.instanceMatrix.needsUpdate=true;if(blades.instanceColor)blades.instanceColor.needsUpdate=true;blades.castShadow=true;world.add(blades)

  const mossGeo=new THREE.IcosahedronGeometry(1,1),mossMat=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,vertexColors:true})
  const moss=new THREE.InstancedMesh(mossGeo,mossMat,900);moss.name='hobby_moss_scatter'
  for(let i=0;i<900;i++){
    const side=Math.floor(rand()*4);let x,z
    if(side===0){x=-4.62+rand()*9.24;z=-3.55+rand()*.45}else if(side===1){x=-4.62+rand()*9.24;z=3.10+rand()*.45}else if(side===2){x=-4.58+rand()*.45;z=-3.22+rand()*6.44}else{x=4.13+rand()*.45;z=-3.22+rand()*6.44}
    const s=.015+rand()*.035;const m=new THREE.Matrix4().makeScale(s*(1+rand()),s*.45,s*(1+rand()));m.setPosition(x,.12,z);moss.setMatrixAt(i,m);moss.setColorAt(i,new THREE.Color(rand()>.5?'#768d34':'#9a9c36'))
  }
  moss.instanceMatrix.needsUpdate=true;if(moss.instanceColor)moss.instanceColor.needsUpdate=true;world.add(moss)
}

function run(){
  const world=globalThis.__dndArtSpikeWorld;if(!world){setTimeout(run,250);return}
  addTreeMound(world);addLichen(world);addGroundFlock(world)
  const status=document.querySelector('#status');if(status)status.textContent+=' · 3D lichen + static grass'
}
run()
