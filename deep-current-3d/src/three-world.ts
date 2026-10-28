import * as THREE from 'three';
import type {Game,Ship} from './simulation';
import {RAD,clamp} from './simulation';

/** True WebGL scene — one cinematic renderer for sea, ships, optics, sun and wakes. */
const waterVertex=[
 'uniform float uTime; varying vec3 vWorld; varying float vWave;',
 'float wave(vec2 p){return sin(p.x*.021+p.y*.011+uTime*1.14)*.55+sin(p.y*.035-p.x*.009-uTime*.86)*.35+sin((p.x+p.y)*.092+uTime*2.05)*.10;}',
 'void main(){vec3 p=position;p.y+=wave(p.xz);vec4 w=modelMatrix*vec4(p,1.);vWorld=w.xyz;vWave=p.y;gl_Position=projectionMatrix*viewMatrix*w;}'
].join('\n');
const waterFragment=[
 'precision highp float; uniform float uTime; uniform vec3 uEye; uniform vec3 uSun; uniform float uNight; varying vec3 vWorld; varying float vWave;',
 'float wv(vec2 p){return sin(p.x*.021+p.y*.011+uTime*1.14)*.55+sin(p.y*.035-p.x*.009-uTime*.86)*.35+sin((p.x+p.y)*.092+uTime*2.05)*.10;}',
 'void main(){vec2 p=vWorld.xz;float e=.25;vec3 n=normalize(vec3((wv(p-vec2(e,0.))-wv(p+vec2(e,0.)))/(e*2.),1.,(wv(p-vec2(0.,e))-wv(p+vec2(0.,e)))/(e*2.)));',
 'vec3 toEye=normalize(uEye-vWorld);vec3 sun=normalize(uSun);float ndl=max(0.,dot(n,sun));',
 'float glint=pow(max(0.,dot(reflect(-sun,n),toEye)),56.)*.22+pow(max(0.,dot(reflect(-sun,n),toEye)),230.)*.14;',
 'float fresnel=pow(1.-max(0.,dot(n,toEye)),2.);float deep=.18+.08*sin(p.x*.014+p.y*.022+uTime*.4);',
 'vec3 dark=mix(vec3(.045,.125,.19),vec3(.085,.215,.27),clamp(ndl*.5+deep,0.,1.));',
 'vec3 col=mix(dark,vec3(.18,.31,.35),fresnel*.38);col+=vec3(.88,.55,.34)*glint*(1.-uNight*.72);',
 'float foam=smoothstep(.74,1.1,abs(vWave))*.10;float fine=sin(p.x*.17+uTime*2.1)*sin(p.y*.13-uTime*1.4);float finer=sin(p.x*.44-uTime*3.)*sin(p.y*.37+uTime*2.2);col+=vec3(.25,.42,.44)*foam+vec3(.08,.14,.16)*max(0.,fine)*(.55+ndl)+vec3(.036,.06,.071)*max(0.,finer);',
 'float dist=distance(vWorld.xz,uEye.xz);float fog=1.-exp(-dist*.00028);',
 'col=mix(col,mix(vec3(.39,.40,.42),vec3(.16,.27,.35),uNight),fog*.65);',
 'col=mix(col,col*.33,uNight*.68);gl_FragColor=vec4(col,1.);}'
].join('\n');
const skyVertex='varying vec3 vDir;void main(){vDir=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const skyFragment=[
 'precision highp float; varying vec3 vDir; uniform vec3 uSun; uniform float uNight;',
 'float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
 'float noise21(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),f.x),mix(hash21(i+vec2(0.,1.)),hash21(i+1.),f.x),f.y);}',
 'float fbm(vec2 p){float a=.5,n=0.;for(int i=0;i<5;i++){n+=noise21(p)*a;p=p*2.05+4.17;a*=.5;}return n;}',
 'void main(){vec3 d=normalize(vDir);vec3 sunDir=normalize(uSun);float sd=max(dot(d,sunDir),0.);float h=clamp(d.y,0.,1.);',
 'vec3 horizon=vec3(.52,.48,.50);vec3 midday=vec3(.20,.31,.43);vec3 zenith=vec3(.055,.105,.195);',
 'vec3 sky=mix(horizon,midday,smoothstep(.015,.26,h));sky=mix(sky,zenith,smoothstep(.18,.9,h));',
 'float cloud=fbm(d.xz*17.+vec2(d.y*3.,d.y*7.));float wisps=fbm(d.xz*43.+vec2(d.y*13.,0.));',
 'float cloudMask=smoothstep(.40,.73,cloud*.8+wisps*.2)*(.84-.50*smoothstep(.30,.82,h));',
 'vec3 cloudTone=mix(vec3(.36,.37,.43),vec3(.12,.16,.26),smoothstep(.07,.72,h));',
 'sky=mix(sky,cloudTone,cloudMask*.68);',
 'float glow=pow(sd,18.);float halo=pow(sd,350.);float disc=smoothstep(.99993,.999983,sd);',
 'sky+=vec3(.92,.46,.27)*glow*.18+vec3(1.,.64,.41)*halo*.48+vec3(1.,.81,.60)*disc*.70;',
 'vec3 night=mix(vec3(.038,.067,.11),vec3(.006,.015,.035),smoothstep(.0,.75,h));',
 'sky=mix(sky,night,uNight*.96);gl_FragColor=vec4(sky,1.);}'
].join('\n');

function mat(color:number,metalness=.15,roughness=.78){return new THREE.MeshStandardMaterial({color,metalness,roughness,flatShading:false})}
function box(parent:THREE.Group,w:number,h:number,d:number,x:number,y:number,z:number,material:THREE.Material){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);parent.add(m);return m;
}
function cylinder(parent:THREE.Group,r1:number,r2:number,h:number,x:number,y:number,z:number,material:THREE.Material){
 const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,10),material);m.position.set(x,y,z);parent.add(m);return m;
}
function beam(parent:THREE.Group,a:THREE.Vector3,b:THREE.Vector3,r:number,material:THREE.Material){
 const mid=a.clone().add(b).multiplyScalar(.5),vec=b.clone().sub(a);
 const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,vec.length(),6),material);
 m.position.copy(mid);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vec.normalize());parent.add(m);
}
function vessel(ship:Ship):THREE.Group{
 const g=new THREE.Group();g.name=ship.name;
 const steel=mat(ship.kind==='merchant'?0x303e45:0x46515a,.28,.66);
 const shadow=mat(0x19272b,.17,.78), deck=mat(0x4c4a45,.15,.85),cream=mat(0x8d9190,.12,.72);
 const brass=mat(0x72705b,.36,.62),black=mat(0x1b2227,.05,.87);
 const L=ship.length, W=ship.kind==='merchant'?19:11, bow=-L*.5,stern=L*.5;
 // Polygonal displacement ship hull: actual 3D geometry, not a 2D billboard.
 const stations=[[-.50,.05],[-.44,.70],[-.31,1],[-.03,1],[.25,.97],[.43,.77],[.50,.42]];
 const verts:number[]=[],indices:number[]=[];
 for(const [loc,w] of stations){const z=loc*L,hw=W*w*.5;
  verts.push(-hw,5,z,hw,5,z,-hw,-4.8,z,hw,-4.8,z);
 }
 for(let i=0;i<stations.length-1;i++){const k=i*4,n=k+4;
  indices.push(k,n,k+2,k+2,n,n+2, k+1,k+3,n+1,k+3,n+3,n+1, k,n,k+1,k+1,n,n+1,
   k+2,k+3,n+2,k+3,n+3,n+2);
 }
 const hullGeom=new THREE.BufferGeometry();hullGeom.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));hullGeom.setIndex(indices);hullGeom.computeVertexNormals();
 const hull=new THREE.Mesh(hullGeom,steel);hull.material.side=THREE.DoubleSide;g.add(hull);
 // Deck, bulwarks, hatch covers, rigging and winches: recognizable merchant silhouette from every angle.
 box(g,W*.86,.7,L*.76,0,5.4,0,deck);
 for(const z of [-L*.25,-L*.06,L*.13]){box(g,W*.78,.9,L*.12,0,6.0,z,shadow);box(g,W*.7,.25,L*.13,0,6.55,z,brass)}
 // Crew quarters / bridge aft.
 box(g,W*.77,7,L*.16,0,9.2,L*.31,cream);
 box(g,W*.52,4,L*.08,0,14.0,L*.31,cream);
 box(g,W*.68,.8,L*.18,0,16.35,L*.31,shadow);
 for(let side of [-1,1])for(let k=0;k<4;k++)box(g,.18,1.0,1.6,side*W*.29,12.5,L*(.26+k*.028),black);
 cylinder(g,2.2,2.55,10,0,21,L*.39,steel);
 cylinder(g,2.23,2.23,2.0,0,26.6,L*.39,black);
 // Bow and stern masts with cross beams and standing rigging.
 for(const z of [-L*.30,L*.18]){
  beam(g,new THREE.Vector3(0,5.9,z),new THREE.Vector3(0,32,z),.32,brass);
  beam(g,new THREE.Vector3(-W*.46,22,z),new THREE.Vector3(W*.46,22,z),.22,brass);
  beam(g,new THREE.Vector3(0,32,z),new THREE.Vector3(W*.46,6,z-12),.06,black);
  beam(g,new THREE.Vector3(0,32,z),new THREE.Vector3(-W*.46,6,z+12),.06,black);
 }
 for(const z of [-L*.18,L*.07]){
  cylinder(g,1.1,1.2,5,0,8,z,brass);
  beam(g,new THREE.Vector3(0,10,z),new THREE.Vector3(W*.43,18,z+17),.23,brass);
 }
 // Railings
 for(const side of [-1,1]){const x=side*W*.46;
  for(let z=bow+L*.12;z<stern-L*.10;z+=6)beam(g,new THREE.Vector3(x,6,z),new THREE.Vector3(x,8.1,z),.075,cream);
  beam(g,new THREE.Vector3(x,8.1,bow+L*.12),new THREE.Vector3(x,8.1,stern-L*.10),.055,cream);
 }
 if(ship.kind==='escort'){
  box(g,W*.7,3,L*.2,0,8,-L*.10,steel);
  cylinder(g,3,3,3,0,8,-L*.34,steel);
  cylinder(g,3,3,3,0,8,L*.35,steel);
 }
 return g;
}
interface ShipView{group:THREE.Group;wake:THREE.LineSegments;smoke:THREE.Group}
function createWake():THREE.LineSegments{
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(120*6),3).setUsage(THREE.DynamicDrawUsage));
 const m=new THREE.LineBasicMaterial({color:0xb6d0cc,transparent:true,opacity:.55,depthWrite:false});
 return new THREE.LineSegments(g,m);
}
function makeSmoke():THREE.Group{
 const group=new THREE.Group();const sm=new THREE.MeshBasicMaterial({color:0x243039,transparent:true,opacity:.15,depthWrite:false});
 for(let i=0;i<8;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),sm.clone());m.scale.setScalar(2+i*.5);group.add(m)}return group;
}

export class OceanWorld{
 readonly scene=new THREE.Scene();readonly camera=new THREE.PerspectiveCamera(16,1,.15,10000);
 readonly renderer:THREE.WebGLRenderer;
 private water:THREE.Mesh;
 private nearWater:THREE.Mesh;
 private sky:THREE.Mesh;
 private ships=new Map<string,ShipView>();
 private splashes=new Map<number,THREE.Group>();
 private sun=new THREE.Vector3(.94,.075,-.32).normalize();
 private lastW=0;private lastH=0;private observer:ResizeObserver;private time=0;
 private waterUniforms:{uTime:{value:number};uEye:{value:THREE.Vector3};uSun:{value:THREE.Vector3};uNight:{value:number}};
 private skyUniforms:{uSun:{value:THREE.Vector3};uNight:{value:number}};
 constructor(private container:HTMLElement){
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65));
  this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
  this.renderer.toneMappingExposure=1.20;
  this.renderer.setClearColor(0x111a27,1);
  this.renderer.domElement.className='ocean-canvas';
  container.appendChild(this.renderer.domElement);
  this.scene.fog=new THREE.FogExp2(0x7f8b92,.00034);
  this.scene.add(new THREE.HemisphereLight(0xa6c7e0,0x393c3f,2.1));
  const sunLight=new THREE.DirectionalLight(0xffbd84,2.7);sunLight.position.copy(this.sun.clone().multiplyScalar(2800));this.scene.add(sunLight);
  this.skyUniforms={uSun:{value:this.sun},uNight:{value:0}};
  this.sky=new THREE.Mesh(new THREE.SphereGeometry(7800,40,22),new THREE.ShaderMaterial({uniforms:this.skyUniforms,vertexShader:skyVertex,fragmentShader:skyFragment,side:THREE.BackSide,depthWrite:false,fog:false}));
  this.sky.frustumCulled=false;this.scene.add(this.sky);
  this.waterUniforms={uTime:{value:0},uEye:{value:new THREE.Vector3()},uSun:{value:this.sun},uNight:{value:0}};
  const waterGeometry=new THREE.PlaneGeometry(10000,10000,180,180);
  waterGeometry.rotateX(-Math.PI/2); // World-space XZ plane BEFORE vertex-wave displacement.
  const waterMaterial=new THREE.ShaderMaterial({uniforms:this.waterUniforms,vertexShader:waterVertex,fragmentShader:waterFragment,side:THREE.DoubleSide,depthWrite:true});
  this.water=new THREE.Mesh(waterGeometry,waterMaterial);this.water.frustumCulled=false;this.scene.add(this.water);
  const nearGeometry=new THREE.PlaneGeometry(1300,1300,200,200);nearGeometry.rotateX(-Math.PI/2);
  this.nearWater=new THREE.Mesh(nearGeometry,waterMaterial);this.nearWater.frustumCulled=false;this.scene.add(this.nearWater);
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(container);this.resize();
 }
 private resize(){const w=this.container.clientWidth,h=this.container.clientHeight;if(w<2||h<2||(w===this.lastW&&h===this.lastH))return;
  this.lastW=w;this.lastH=h;this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false);
 }
 private syncShips(g:Game){
  for(const s of g.ships){let v=this.ships.get(s.id);if(!v){
   const group=vessel(s);this.scene.add(group);
   const wake=createWake();this.scene.add(wake);
   const smoke=makeSmoke();this.scene.add(smoke);
   v={group,wake,smoke};this.ships.set(s.id,v);
  }
   v.group.visible=!s.sunk;v.wake.visible=!s.sunk;v.smoke.visible=!s.sunk&&s.kind==='merchant';
   if(s.sunk)continue;
   const bob=Math.sin(this.time*.66+s.x*.003)*.56+Math.sin(this.time*1.12+s.z*.003)*.31;
   v.group.position.set(s.x,bob,s.z);v.group.rotation.set(Math.sin(this.time*.39+s.x)*.011,-s.heading*RAD,Math.sin(this.time*.65+s.z)*.021);
   const pos=v.wake.geometry.getAttribute('position') as THREE.BufferAttribute;const dir=new THREE.Vector2(Math.sin(s.heading*RAD),-Math.cos(s.heading*RAD));
   const across=new THREE.Vector2(-dir.y,dir.x);
   for(let i=0;i<120;i++){const trail=6+i*1.65,spread=2+trail*.15;const side=i%2?1:-1;const wob=Math.sin(this.time*.65+i*.78)*2.1;
    const bx=s.x-dir.x*(s.length*.5+trail)+across.x*(side*spread+wob);
    const bz=s.z-dir.y*(s.length*.5+trail)+across.y*(side*spread+wob);
    pos.setXYZ(i*2,bx,.28+Math.sin(this.time+i)*.15,bz);
    pos.setXYZ(i*2+1,bx-dir.x*2.5,.24,bz-dir.y*2.5);
   }
   pos.needsUpdate=true;v.wake.geometry.computeBoundingSphere();
   v.smoke.position.set(s.x+dir.x*s.length*.39,0,s.z+dir.y*s.length*.39);
   let i=0;for(const puff of v.smoke.children){const t=(this.time*.4+i/8)%1;
    puff.position.set(-dir.x*t*22,27+t*48,-dir.y*t*22);
    puff.scale.setScalar(2+t*9);i++;
   }
  }
 }
 private syncImpacts(g:Game){
  // Animated explosion spray and water splash geometry; generated in 3D space.
  for(const [id,group] of this.splashes){if(!g.impacts[id]){this.scene.remove(group);this.splashes.delete(id);}}
  g.impacts.forEach((impact,i)=>{
   let sp=this.splashes.get(i);if(!sp){sp=new THREE.Group();for(let j=0;j<11;j++){
    const m=new THREE.Mesh(new THREE.ConeGeometry(.8,4.5,5),new THREE.MeshBasicMaterial({color:j%2?0xffaa52:0xd7d9cd,transparent:true,opacity:.8}));
    m.position.set(Math.sin(j*2.4)*4,2,Math.cos(j*1.7)*3);sp.add(m);
   }this.scene.add(sp);this.splashes.set(i,sp)}
   sp.position.set(impact.x,0,impact.z);const scale=1+impact.age*2.3;sp.scale.set(scale,Math.max(.12,1-impact.age/5)*scale,scale);
  });
 }
 render(g:Game,dt:number){
  this.time+=Math.min(dt,.07);
  const p=g.player,night=g.mission.id==='black-water'?1:0;
  this.waterUniforms.uTime.value=this.time;
  this.waterUniforms.uNight.value=night;
  this.skyUniforms.uNight.value=night;
  // The periscope optical line of sight follows submarine translation, independent mast height and two-axis aiming.
  const eyeY=-2.8+5.8*p.mast;
  this.camera.position.set(p.x,eyeY,p.z);
  const h=p.scopeYaw*RAD,e=p.scopePitch*RAD;
  this.camera.lookAt(p.x+Math.cos(e)*Math.sin(h)*200,eyeY+Math.sin(e)*200,p.z-Math.cos(e)*Math.cos(h)*200);
  this.camera.fov=clamp(26/p.zoom,4.33,26);this.camera.updateProjectionMatrix();
  this.sky.position.set(p.x,0,p.z);
  this.water.position.set(p.x,0,p.z);
  this.nearWater.position.set(p.x,.025,p.z);
  this.waterUniforms.uEye.value.copy(this.camera.position);
  this.syncShips(g);this.syncImpacts(g);
  this.resize();this.renderer.render(this.scene,this.camera);
 }
 dispose(){
  this.observer.disconnect();this.renderer.dispose();
  this.renderer.domElement.remove();
  this.water.geometry.dispose();this.nearWater.geometry.dispose();(this.water.material as THREE.Material).dispose();this.sky.geometry.dispose();(this.sky.material as THREE.Material).dispose();
  for(const v of this.ships.values()){v.group.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose();const materials=Array.isArray(obj.material)?obj.material:[obj.material];materials.forEach(m=>m.dispose())}});v.wake.geometry.dispose();(v.wake.material as THREE.Material).dispose()}
 }
}
