import * as THREE from 'three';
import { RCCar } from './car.js';
import { buildWorld, heightAt } from './world.js';

const params=new URLSearchParams(location.search),manual=params.get('manual')==='1';
const root=document.getElementById('game-shell'),viewport=document.getElementById('viewport');
const scene=new THREE.Scene();scene.background=new THREE.Color('#94a38c');scene.fog=new THREE.FogExp2('#899985',.0145);
const camera=new THREE.PerspectiveCamera(57,innerWidth/innerHeight,.04,240);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;viewport.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight('#dce7d2','#394031',2));
const sun=new THREE.DirectionalLight('#fff1cf',3.1);sun.position.set(-22,32,-14);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-45;sun.shadow.camera.right=45;sun.shadow.camera.top=38;sun.shadow.camera.bottom=-38;sun.shadow.bias=-.0003;scene.add(sun);
buildWorld(scene);const car=new RCCar(scene);

const keys=new Set(),touch={gas:0,brake:0,left:0,right:0};
let cameraMode=0,photoMode=false,panelOpen=false,fixedAccumulator=0,last=performance.now(),fpsSamples=[],qualityCooldown=0;
const fixedDt=1/60,cameraModes=['CHASE','BUMPER','WHEEL','ORBIT'];
const discovered=new Set(JSON.parse(localStorage.getItem('tiny-trails-discoveries')||'[]'));
const discoveries=[
  {name:'Under the Shed',x:-31,z:-16,r:5,sub:'A cool, dry world beneath the garden shed.'},
  {name:'Drain Run',x:-14,z:8.5,r:3.2,sub:'Follow the metal rings through the creek bank.'},
  {name:'Stone Crown',x:-14,z:-3,r:4.3,sub:'Loose stone becomes a mountain at this scale.'},
  {name:'Rain Bridge',x:5.5,z:8.5,r:3.2,sub:'Seven wet boards over the backyard creek.'},
  {name:'High Deck',x:28,z:-17,r:7,sub:'A full-size human step is a serious climb.'},
  {name:'Garden Giants',x:28,z:13,r:8,sub:'Leaves tower above the crawler like trees.'},
  {name:'Fence Line',x:0,z:28,r:6,sub:'The far edge of the tiny world.'}
];

class AudioEngine{
  start(){if(this.ctx)return;this.ctx=new AudioContext();this.osc=this.ctx.createOscillator();this.gain=this.ctx.createGain();this.osc.type='sawtooth';this.gain.gain.value=.0001;this.osc.connect(this.gain).connect(this.ctx.destination);this.osc.start()}
  update(speed,throttle){if(!this.ctx)return;const t=this.ctx.currentTime;this.osc.frequency.setTargetAtTime(58+Math.abs(speed)*16+Math.abs(throttle)*60,t,.04);this.gain.gain.setTargetAtTime(.012+Math.abs(throttle)*.028,t,.08)}
}
const audio=new AudioEngine();

function inputState(){
  const gp=navigator.getGamepads?.()[0];let throttle=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0)+touch.gas-touch.brake,brake=keys.has('Space')?1:0,steer=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0)+touch.right-touch.left;
  if(gp){const axis=gp.axes[0]||0;if(Math.abs(axis)>.12)steer=axis;const gas=gp.buttons[7]?.value||0,rev=gp.buttons[6]?.value||0;if(gas>.05||rev>.05)throttle=gas-rev;if(gp.buttons[0]?.pressed)brake=1}
  return{throttle:THREE.MathUtils.clamp(throttle,-1,1),brake,steer:THREE.MathUtils.clamp(steer,-1,1)};
}
function simStep(dt){const inp=inputState();car.setInput(inp);car.update(dt);audio.update(car.speed,inp.throttle);checkDiscoveries();updateHUD()}
function updateCamera(dt){
  const f=new THREE.Vector3(Math.sin(car.yaw),0,-Math.cos(car.yaw)),r=new THREE.Vector3(Math.cos(car.yaw),0,Math.sin(car.yaw)),desired=new THREE.Vector3(),look=car.position.clone().add(new THREE.Vector3(0,.55,0));
  if(photoMode||cameraMode===3){const t=performance.now()*.00005;desired.copy(car.position).add(new THREE.Vector3(Math.sin(t)*6,3.2,Math.cos(t)*6));look.y+=.3}
  else if(cameraMode===0){desired.copy(car.position).addScaledVector(f,-5.5).add(new THREE.Vector3(0,2.6,0));look.addScaledVector(f,2.1)}
  else if(cameraMode===1){desired.copy(car.position).addScaledVector(f,1.1).add(new THREE.Vector3(0,.62,0));look.copy(desired).addScaledVector(f,12)}
  else{desired.copy(car.position).addScaledVector(r,-1.4).addScaledVector(f,.45).add(new THREE.Vector3(0,.55,0));look.copy(car.position).addScaledVector(f,5)}
  desired.y=Math.max(desired.y,heightAt(desired.x,desired.z)+.3);camera.position.lerp(desired,1-Math.exp(-(cameraMode===0?5.5:9)*dt));camera.lookAt(look);camera.fov=THREE.MathUtils.lerp(camera.fov,57+Math.min(Math.abs(car.speed)*.55,6),.05);camera.updateProjectionMatrix();
}
function updateHUD(){const s=car.snapshot();document.getElementById('speed').textContent=Math.round(Math.abs(s.speed)*3.6);document.getElementById('battery-bar').style.transform=`scaleX(${s.battery})`;document.getElementById('surface').textContent=s.surface}
function checkDiscoveries(){for(const d of discoveries){if(discovered.has(d.name))continue;const dx=car.position.x-d.x,dz=car.position.z-d.z;if(dx*dx+dz*dz<d.r*d.r){discovered.add(d.name);localStorage.setItem('tiny-trails-discoveries',JSON.stringify([...discovered]));showDiscovery(d)}}}
let toastTimer;
function showDiscovery(d){document.getElementById('discovery-name').textContent=d.name;document.getElementById('discovery-count').textContent=`${discovered.size} / ${discoveries.length} places found`;document.getElementById('objective-title').textContent=d.name;document.getElementById('objective-sub').textContent=d.sub;const el=document.getElementById('discovery-toast');el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3300)}
function setCamera(n){cameraMode=(n+cameraModes.length)%cameraModes.length;document.getElementById('camera-name').textContent=cameraModes[cameraMode]}
function togglePhoto(){photoMode=!photoMode;root.classList.toggle('photo-mode',photoMode);document.getElementById('photo-ui').classList.toggle('active',photoMode)}
function togglePanel(force){panelOpen=force??!panelOpen;const p=document.getElementById('help-panel');p.classList.toggle('open',panelOpen);p.setAttribute('aria-hidden',String(!panelOpen))}
function toggleLights(){car.headlights=!car.headlights;document.getElementById('lights-btn').classList.toggle('active',car.headlights)}

addEventListener('keydown',e=>{keys.add(e.code);audio.start();if(e.repeat)return;if(e.code==='KeyC')setCamera(cameraMode+1);if(e.code==='KeyR')car.reset();if(e.code==='KeyL')toggleLights();if(e.code==='KeyP')togglePhoto();if(e.code==='Escape')togglePanel()});
addEventListener('keyup',e=>keys.delete(e.code));
document.getElementById('camera-btn').onclick=()=>{audio.start();setCamera(cameraMode+1)};document.getElementById('lights-btn').onclick=()=>{audio.start();toggleLights()};document.getElementById('photo-btn').onclick=togglePhoto;document.getElementById('menu-btn').onclick=()=>togglePanel();document.getElementById('close-help').onclick=()=>togglePanel(false);document.getElementById('resume-btn').onclick=()=>togglePanel(false);
document.querySelectorAll('[data-control]').forEach(btn=>{const k=btn.dataset.control,on=e=>{e.preventDefault();audio.start();touch[k]=1},off=e=>{e.preventDefault();touch[k]=0};btn.addEventListener('pointerdown',on);btn.addEventListener('pointerup',off);btn.addEventListener('pointercancel',off);btn.addEventListener('pointerleave',off)});

function adaptiveQuality(dt){if(dt<=0)return;fpsSamples.push(1/dt);if(fpsSamples.length>120)fpsSamples.shift();qualityCooldown-=dt;if(fpsSamples.length===120&&qualityCooldown<=0){const avg=fpsSamples.reduce((a,b)=>a+b,0)/fpsSamples.length;if(avg<42&&renderer.getPixelRatio()>1){renderer.setPixelRatio(Math.max(1,renderer.getPixelRatio()-.2));qualityCooldown=8}}}
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!manual&&!panelOpen&&!photoMode){fixedAccumulator+=dt;while(fixedAccumulator>=fixedDt){simStep(fixedDt);fixedAccumulator-=fixedDt}}updateCamera(dt||fixedDt);renderer.render(scene,camera);adaptiveQuality(dt);requestAnimationFrame(frame)}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

window.__RC_EXPLORER__={
  ready:true,
  reset:()=>car.reset(),
  snapshot:()=>({car:car.snapshot(),cameraMode:cameraModes[cameraMode],discoveries:[...discovered],manual}),
  step:(ticks=1,input={throttle:0,brake:0,steer:0})=>{for(let i=0;i<ticks;i++){car.setInput(input);car.update(fixedDt);checkDiscoveries();updateHUD()}updateCamera(fixedDt);renderer.render(scene,camera);return car.snapshot()},
  teleport:(x,z)=>{car.position.set(x,heightAt(x,z)+.52,z);car.speed=0;car.syncVisual(0);return car.snapshot()},
  discoveries:()=>discoveries.map(d=>({...d,found:discovered.has(d.name)}))
};

updateHUD();setCamera(0);updateCamera(fixedDt);renderer.render(scene,camera);setTimeout(()=>document.getElementById('loading').classList.add('hidden'),350);requestAnimationFrame(frame);
