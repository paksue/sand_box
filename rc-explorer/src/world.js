import * as THREE from 'three';

export function heightAt(x,z){
  let h=Math.sin(x*.11)*.16+Math.sin(z*.14+1.3)*.12+Math.sin((x+z)*.045)*.18;
  const creek=8+Math.sin(x*.14)*1.5,d=Math.abs(z-creek);
  if(d<2.4&&x>-30&&x<19)h-=(1-d/2.4)*.72;
  const dx=x+14,dz=z+3;h+=Math.exp(-(dx*dx+dz*dz)/60)*.55;
  if(x>20&&z<-12)h=1.28;
  if(x>16&&x<=20&&z<-10&&z>-18)h+=(x-16)/4*1.2;
  if(Math.abs(x-5.5)<1.2&&z>4.5&&z<13)h=.34+Math.sin(x*.1)*.03;
  return h;
}
export function surfaceAt(x,z){
  const creek=8+Math.sin(x*.14)*1.5,d=Math.abs(z-creek);
  if(d<2.25&&!(Math.abs(x-5.5)<1.3&&z>4.5&&z<13))return{name:'SHALLOW WATER',grip:.64,drag:.78};
  if(x<-7&&x>-23&&z<3&&z>-12)return{name:'LOOSE STONE',grip:.76,drag:.9};
  if(x>20&&z<-12)return{name:'WET DECK',grip:.83,drag:.96};
  if(z<-15&&x<17)return{name:'MUDDY LAWN',grip:.72,drag:.86};
  return{name:'WET GRASS',grip:.9,drag:.96};
}
function rng(a){return()=>{let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function addBox(scene,pos,scale,color,rough=.82){
  const m=new THREE.Mesh(new THREE.BoxGeometry(...scale),new THREE.MeshStandardMaterial({color,roughness:rough,metalness:.02}));
  m.position.set(...pos);m.castShadow=m.receiveShadow=true;scene.add(m);return m;
}
function grassTexture(){
  const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
  x.fillStyle='#566b3f';x.fillRect(0,0,512,512);const r=rng(99);
  for(let i=0;i<6500;i++){const g=68+r()*65;x.fillStyle=`rgba(${g*.65},${g},${g*.42},${.08+r()*.18})`;x.fillRect(r()*512,r()*512,1+r()*3,1+r()*4)}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(14,12);t.anisotropy=4;return t;
}
function addSky(scene){
  const sky=new THREE.Mesh(
    new THREE.SphereGeometry(170,28,14),
    new THREE.ShaderMaterial({
      side:THREE.BackSide,depthWrite:false,
      vertexShader:'varying vec3 vWorld;void main(){vec4 w=modelMatrix*vec4(position,1.0);vWorld=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
      fragmentShader:'varying vec3 vWorld;void main(){float h=normalize(vWorld).y;vec3 horizon=vec3(.66,.72,.63);vec3 zenith=vec3(.34,.47,.55);vec3 warm=vec3(.93,.76,.50);float t=smoothstep(-.08,.72,h);vec3 c=mix(horizon,zenith,t);float glow=pow(max(0.0,1.0-length(normalize(vWorld).xz-vec2(-.36,-.20))),7.0);c=mix(c,warm,glow*.22);gl_FragColor=vec4(c,1.0);}'
    })
  );scene.add(sky);
  const sun=new THREE.Mesh(new THREE.SphereGeometry(2.1,16,10),new THREE.MeshBasicMaterial({color:'#ffe4a3'}));sun.position.set(-68,58,-92);scene.add(sun);
}
export function buildWorld(scene){
  const random=rng(1337);addSky(scene);
  const geo=new THREE.PlaneGeometry(84,68,128,104);geo.rotateX(-Math.PI/2);const a=geo.attributes.position;
  for(let i=0;i<a.count;i++)a.setY(i,heightAt(a.getX(i),a.getZ(i)));geo.computeVertexNormals();
  const ground=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:grassTexture(),roughness:.93,color:'#8ca66a'}));ground.receiveShadow=true;scene.add(ground);

  const waterGeo=new THREE.PlaneGeometry(48,4.4,50,3);waterGeo.rotateX(-Math.PI/2);const wa=waterGeo.attributes.position;
  for(let i=0;i<wa.count;i++){const x=wa.getX(i)-6,z=8+Math.sin(x*.14)*1.5+wa.getZ(i);wa.setXYZ(i,x,.02,z)}
  const water=new THREE.Mesh(waterGeo,new THREE.MeshPhysicalMaterial({color:'#6e8f82',transparent:true,opacity:.7,roughness:.12,metalness:.04,transmission:.14}));scene.add(water);

  for(let i=0;i<9;i++)addBox(scene,[28,1.12,-17.2+i*1.45],[15,.18,1.28],i%2?'#7c6248':'#886e50');
  for(let i=0;i<5;i++)addBox(scene,[18.2+i*.8,.35+i*.22,-13.4],[1.2,.18,7],'#806547');
  for(let i=0;i<5;i++)addBox(scene,[21.4+i*3.3,2,-10.8],[.22,2.8,.22],'#6f583e');

  addBox(scene,[-31,3,-22],[13,5.7,10],'#87917f');
  const roof=new THREE.Mesh(new THREE.ConeGeometry(9,3,4),new THREE.MeshStandardMaterial({color:'#485448',roughness:.9}));
  roof.rotation.y=Math.PI/4;roof.position.set(-31,6.55,-22);roof.scale.z=.75;roof.castShadow=true;scene.add(roof);
  addBox(scene,[-31,2.1,-16.85],[4,4,.18],'#596452');

  for(let i=0;i<7;i++)addBox(scene,[5.5,.27,5.2+i*1.18],[2.5,.13,.95],i%2?'#8d7453':'#9a805c');

  const pipeMat=new THREE.MeshStandardMaterial({color:'#626c65',metalness:.15,roughness:.65});
  for(let i=0;i<7;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.45,.16,12,40),pipeMat);ring.position.set(-18+i*1.15,1.1,8.5);ring.rotation.y=Math.PI/2;ring.castShadow=true;scene.add(ring)}

  const rockMat=new THREE.MeshStandardMaterial({color:'#74796b',roughness:1});
  for(let i=0;i<72;i++){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(.2+random()*1.0,0),rockMat);const x=-22+random()*17,z=-12+random()*16;m.position.set(x,heightAt(x,z)+.22+random()*.28,z);m.scale.set(1+random()*1.2,.55+random()*.7,.7+random());m.rotation.set(random()*2,random()*6,random()*2);m.castShadow=m.receiveShadow=true;scene.add(m)}

  const logMat=new THREE.MeshStandardMaterial({color:'#5c4832',roughness:1});
  for(let i=0;i<8;i++){const x=-5+random()*15,z=-8+random()*11;const m=new THREE.Mesh(new THREE.CylinderGeometry(.22,.35,5+random()*4,10),logMat);m.rotation.z=Math.PI/2;m.rotation.y=random()*.6;m.position.set(x,heightAt(x,z)+.35,z);m.castShadow=true;scene.add(m)}

  const bladeGeo=new THREE.ConeGeometry(.055,.9,3),bladeMat=new THREE.MeshStandardMaterial({color:'#769557',roughness:.95});
  const count=2600,blades=new THREE.InstancedMesh(bladeGeo,bladeMat,count),dummy=new THREE.Object3D();
  for(let i=0;i<count;i++){let x=-40+random()*80,z=-32+random()*64;if((x>18&&z<-10)||Math.abs(z-(8+Math.sin(x*.14)*1.5))<2.6){i--;continue}dummy.position.set(x,heightAt(x,z)+.3+random()*.18,z);dummy.rotation.y=random()*6;const s=.5+random()*1.55;dummy.scale.set(s,s,s);dummy.updateMatrix();blades.setMatrixAt(i,dummy.matrix)}blades.receiveShadow=true;scene.add(blades);

  const leafMat=new THREE.MeshStandardMaterial({color:'#4f7b45',roughness:.7,side:THREE.DoubleSide});
  for(let p=0;p<11;p++){const cx=22+random()*14,cz=2+random()*22;for(let l=0;l<9;l++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(1.1,10,6),leafMat);leaf.scale.set(.35,1.5,.08);leaf.position.set(cx+Math.sin(l*.8)*1.2,heightAt(cx,cz)+1.1+random(),cz+Math.cos(l*.8)*1.2);leaf.rotation.z=(l-4)*.18;leaf.rotation.y=l*.8;leaf.castShadow=true;scene.add(leaf)}}

  const puddleMat=new THREE.MeshPhysicalMaterial({color:'#8ca5a1',transparent:true,opacity:.42,roughness:.08});
  [[-5,-19,3.2],[-11,17,2.5],[13,-2,1.7],[28,-5,2.2],[9,18,1.6]].forEach(([x,z,s])=>{const p=new THREE.Mesh(new THREE.CircleGeometry(s,36),puddleMat);p.rotation.x=-Math.PI/2;p.position.set(x,heightAt(x,z)+.025,z);scene.add(p)});

  const fenceMat=new THREE.MeshStandardMaterial({color:'#71604c',roughness:1});
  for(let i=-38;i<=38;i+=3){const post=new THREE.Mesh(new THREE.BoxGeometry(.16,3,.16),fenceMat);post.position.set(i,1.5,31);post.castShadow=true;scene.add(post)}

  // Dense hedge and trees give the miniature yard a real horizon and scale.
  const hedgeGeo=new THREE.IcosahedronGeometry(1.25,1),hedgeMat=new THREE.MeshStandardMaterial({color:'#405f38',roughness:1}),hedges=new THREE.InstancedMesh(hedgeGeo,hedgeMat,92);
  for(let i=0;i<92;i++){const side=i%3;let x,z;if(side===0){x=-39+random()*78;z=30+random()*2}else if(side===1){x=-39+random()*2;z=-29+random()*58}else{x=38+random()*2;z=-29+random()*58}dummy.position.set(x,1.4+random()*.7,z);dummy.scale.set(1.2+random()*1.1,1.2+random()*1.5,1.2+random());dummy.rotation.y=random()*6;dummy.updateMatrix();hedges.setMatrixAt(i,dummy.matrix)}hedges.castShadow=true;scene.add(hedges);

  const trunkMat=new THREE.MeshStandardMaterial({color:'#5a4937',roughness:1}),crownMat=new THREE.MeshStandardMaterial({color:'#456b3d',roughness:.95});
  [[-26,22],[31,25],[-34,7],[35,3]].forEach(([x,z],idx)=>{const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.45,.7,8,10),trunkMat);trunk.position.set(x,4,z);trunk.castShadow=true;scene.add(trunk);for(let k=0;k<5;k++){const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(2.7+random()*.8,1),crownMat);crown.position.set(x+(random()-.5)*3,7.3+random()*2,z+(random()-.5)*3);crown.scale.y=1.15+random()*.45;crown.castShadow=true;scene.add(crown)}});

  return{ground,water};
}
