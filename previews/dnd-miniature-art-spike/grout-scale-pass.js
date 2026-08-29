import * as THREE from 'three'

function randLine(i, axis) {
  const n = Math.sin(i * 91.773 + axis * 17.123) * 43758.5453
  return n - Math.floor(n)
}

function addBattleGrid(world) {
  const grout = new THREE.MeshStandardMaterial({ color: '#30251d', roughness: 1, metalness: 0 })
  const spacing = 0.86
  const halfX = 4.32
  const halfZ = 3.26
  let idx = 0
  for (let x=-halfX+spacing;x<halfX;x+=spacing){
    const jitter=(randLine(idx++,0)-.5)*.048
    const line=new THREE.Mesh(new THREE.BoxGeometry(.012,.010,halfZ*2),grout)
    line.position.set(x+jitter,.110,0);line.rotation.y=(randLine(idx,1)-.5)*.012;line.receiveShadow=true;world.add(line)
  }
  for (let z=-halfZ+spacing;z<halfZ;z+=spacing){
    const jitter=(randLine(idx++,2)-.5)*.048
    const line=new THREE.Mesh(new THREE.BoxGeometry(halfX*2,.010,.012),grout)
    line.position.set(0,.111,z+jitter);line.rotation.y=(randLine(idx,3)-.5)*.012;line.receiveShadow=true;world.add(line)
  }
}

function numberTexture(n){
  const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.clearRect(0,0,256,256)
  ctx.fillStyle='white';ctx.font='bold 148px Georgia, serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.22)';ctx.shadowBlur=5;ctx.fillText(String(n),128,132)
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.minFilter=THREE.LinearMipmapLinearFilter;return tex
}
function addNumberPlane(group,n,pos,rot){
  const mat=new THREE.MeshBasicMaterial({map:numberTexture(n),transparent:true,depthWrite:false,side:THREE.DoubleSide})
  const p=new THREE.Mesh(new THREE.PlaneGeometry(.34,.34),mat);p.position.fromArray(pos);p.rotation.set(...rot);p.renderOrder=6;group.add(p)
}
function addDie(world){
  const g=new THREE.Group();const red=new THREE.MeshPhysicalMaterial({color:'#b20c16',roughness:.18,metalness:0,clearcoat:.90,clearcoatRoughness:.10,transmission:.08,thickness:.2})
  const body=new THREE.Mesh(new THREE.BoxGeometry(.52,.52,.52,5,5,5),red);body.castShadow=body.receiveShadow=true;g.add(body)
  const d=.263;addNumberPlane(g,1,[0,d,0],[-Math.PI/2,0,0]);addNumberPlane(g,6,[0,-d,0],[Math.PI/2,0,0]);addNumberPlane(g,2,[d,0,0],[0,Math.PI/2,0]);addNumberPlane(g,5,[-d,0,0],[0,-Math.PI/2,0]);addNumberPlane(g,3,[0,0,d],[0,0,0]);addNumberPlane(g,4,[0,0,-d],[0,Math.PI,0])
  g.position.set(-2.72,.47,2.10);g.rotation.set(.24,-.42,-.18);world.add(g)
}
function addMiniBase(world,x,z,r=.28){
  const dark=new THREE.MeshPhysicalMaterial({color:'#0d0d0c',roughness:.58,clearcoat:.18,clearcoatRoughness:.48})
  const rim=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.03,.085,64),dark);rim.position.set(x,.16,z);rim.castShadow=rim.receiveShadow=true;world.add(rim)
  const top=new THREE.Mesh(new THREE.CylinderGeometry(r*.90,r*.92,.025,64),new THREE.MeshStandardMaterial({color:'#5d6259',roughness:.98}));top.position.set(x,.214,z);top.receiveShadow=true;world.add(top)
}
function addSword(world){
  const steel=new THREE.MeshPhysicalMaterial({color:'#aab1b3',metalness:.82,roughness:.32});const leather=new THREE.MeshStandardMaterial({color:'#473024',roughness:.84});const gold=new THREE.MeshPhysicalMaterial({color:'#9d7a3a',metalness:.72,roughness:.38})
  const g=new THREE.Group();const blade=new THREE.Mesh(new THREE.BoxGeometry(.045,.018,.78),steel);blade.position.z=.28;g.add(blade);const guard=new THREE.Mesh(new THREE.BoxGeometry(.30,.035,.055),gold);guard.position.z=-.12;g.add(guard);const grip=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.30,20),leather);grip.rotation.x=Math.PI/2;grip.position.z=-.29;g.add(grip);const pommel=new THREE.Mesh(new THREE.SphereGeometry(.055,20,12),gold);pommel.position.z=-.46;g.add(pommel)
  g.position.set(1.70,.16,1.96);g.rotation.set(0,-.68,0);g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});world.add(g)
}
function run(){
  const world=globalThis.__dndArtSpikeWorld;if(!world){setTimeout(run,250);return}
  addBattleGrid(world);addDie(world)
  ;[[-.15,-1.35],[-1.10,-.32],[-.15,-.38],[.78,-.62],[1.28,.18],[.78,1.42]].forEach(([x,z])=>addMiniBase(world,x,z))
  addSword(world)
  const status=document.querySelector('#status');if(status)status.textContent+=' · composed bases + softened battle joints'
}
run()
