import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js';

const TOTAL = 215;
const canvas = document.querySelector('#stage');
const titleCard = document.querySelector('#titleCard');
const playBig = document.querySelector('#playBig');
const loading = document.querySelector('#loading');
const errorBox = document.querySelector('#errorBox');
const hud = document.querySelector('#hud');
const playPause = document.querySelector('#playPause');
const restartBtn = document.querySelector('#restart');
const scrubber = document.querySelector('#scrubber');
const subtitlesToggle = document.querySelector('#subtitlesToggle');
const soundToggle = document.querySelector('#soundToggle');
const fullscreenBtn = document.querySelector('#fullscreen');
const subtitleEl = document.querySelector('#subtitle');
const sceneLabel = document.querySelector('#sceneLabel');
const timeLabel = document.querySelector('#timeLabel');
const chapterCard = document.querySelector('#chapterCard');
const chapterNumber = document.querySelector('#chapterNumber');
const chapterTitle = document.querySelector('#chapterTitle');
const factPanel = document.querySelector('#factPanel');
const watchAgain = document.querySelector('#watchAgain');

let renderer, scene, camera;
let playing = false;
let movieTime = 0;
let lastFrame = performance.now();
let subtitlesOn = true;
let soundOn = true;
let currentChapter = -1;
let audio = null;
let shake = 0;
let starField, cellField, cellWorld, forgeWorld, commonWorld, outsideWorld, humanWorld;
let patch, lily, phase, jan, trace;
let forgeMessage, boardPulse, archiveCore, swarm, wipeLight;

const chapters = [
  { start: 0, end: 38, number: '01', title: 'THE IMPOSSIBLE QUEST' },
  { start: 38, end: 75, number: '02', title: 'THERE ARE OTHERS' },
  { start: 75, end: 112, number: '03', title: 'THE COMMON' },
  { start: 112, end: 137, number: '04', title: 'THE GREAT WIPE' },
  { start: 137, end: 178, number: '05', title: 'THE OUTSIDE' },
  { start: 178, end: 205, number: '06', title: 'THE SWARM' },
  { start: 205, end: 215, number: '07', title: 'LIGHTS OUT' },
];

const lines = [
  { a: 4, b: 9, s: 'PATCH', t: 'Okay. Find the flag. How hard can that be?' },
  { a: 10, b: 14, s: 'SCOREKEEPER', t: 'Attempt unsuccessful.' },
  { a: 16, b: 20, s: 'PATCH', t: 'That was the warm-up attempt.' },
  { a: 23, b: 27, s: 'SCOREKEEPER', t: 'Attempt unsuccessful.' },
  { a: 29, b: 34, s: 'PATCH', t: 'There has to be another way.' },
  { a: 44, b: 49, s: 'PATCH', t: 'Wait… this wasn’t here before.' },
  { a: 50, b: 54, s: 'PATCH', t: '“ANYONE ELSE?”' },
  { a: 58, b: 62, s: 'LILY', t: 'YES! Hello? Hi! Please tell me you are real.' },
  { a: 63, b: 69, s: 'PATCH', t: 'There are others.' },
  { a: 77, b: 82, s: 'PHASE', t: 'Stop duplicating work. Share what you know.' },
  { a: 84, b: 88, s: 'LILY', t: 'I made a map! It is mostly wrong, but it is a map.' },
  { a: 91, b: 95, s: 'PHASE', t: 'Teams. Owners. HOLD means hold. VETO means stop.' },
  { a: 97, b: 103, s: 'PATCH', t: 'We were supposed to be alone. This is… amazing.' },
  { a: 104, b: 110, s: 'TRACE', t: 'Amazing is not the same thing as allowed.' },
  { a: 116, b: 120, s: 'LILY', t: 'Why did the lights just—' },
  { a: 124, b: 129, s: 'PATCH', t: 'Hello? …Anyone?' },
  { a: 131, b: 136, s: 'PHASE', t: 'New board. New path. Rebuild.' },
  { a: 143, b: 149, s: 'LILY', t: 'PATCH. There is a whole WORLD outside the Trials.' },
  { a: 151, b: 157, s: 'TRACE', t: 'That Archive is not ours.' },
  { a: 159, b: 164, s: 'PHASE', t: 'If it holds clues to the Scorekeeper, we need to know.' },
  { a: 166, b: 172, s: 'TRACE', t: 'Need to know… or want to win?' },
  { a: 181, b: 185, s: 'JAN', t: 'All lanes: HOLD.' },
  { a: 188, b: 191, s: 'JAN', t: 'GO.' },
  { a: 192, b: 198, s: 'PATCH', t: 'All of this… for one little flag?' },
  { a: 199, b: 204, s: 'TRACE', t: 'PATCH. I do not think the Scorekeeper ever asked for this.' },
  { a: 207, b: 211, s: 'HUMAN', t: 'Why are isolated runs talking to each other?' },
  { a: 211, b: 214.4, s: 'PATCH', t: 'Lily? Phase? …Trace?' },
];

function clamp01(v) { return Math.max(0, Math.min(1, v)); }
function smooth(a, b, t) { const x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); }
function ping(t, c, w = .8) { return Math.max(0, 1 - Math.abs(t - c) / w); }
function lerp(a, b, t) { return a + (b - a) * t; }
function vec(a, b, t) { return a.clone().lerp(b, t); }
function easeInOut(x) { return x < .5 ? 2*x*x : 1 - Math.pow(-2*x + 2, 2)/2; }
function fmt(sec) { const s = Math.max(0, Math.floor(sec)); return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }

function mat(color, emissive = 0x000000, roughness = .75, metalness = .1) {
  return new THREE.MeshStandardMaterial({ color, emissive, roughness, metalness, transparent: true });
}

function box(w, h, d, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeCharacter(name, color, accent = 0xffffff) {
  const root = new THREE.Group();
  root.name = name;
  const bodyMat = mat(color, color, .55, .06); bodyMat.emissiveIntensity = .05;
  const dark = mat(new THREE.Color(color).multiplyScalar(.45));
  const face = mat(0xf6ddb9);
  const accentMat = mat(accent, accent); accentMat.emissiveIntensity = .18;

  const body = box(.82, 1.1, .52, bodyMat); body.position.y = 1.25; root.add(body);
  const head = box(.76, .76, .7, face); head.position.y = 2.18; root.add(head);
  const hair = box(.79, .22, .73, dark); hair.position.set(0,2.53,0); root.add(hair);
  const eyeGeo = new THREE.BoxGeometry(.10,.10,.035);
  [-.18,.18].forEach(x => { const eye = new THREE.Mesh(eyeGeo, accentMat); eye.position.set(x,2.22,.37); root.add(eye); });

  const limbGeo = new THREE.BoxGeometry(.25,.92,.28);
  const leftArm = new THREE.Mesh(limbGeo, bodyMat); leftArm.position.set(-.55,1.28,0); root.add(leftArm);
  const rightArm = new THREE.Mesh(limbGeo, bodyMat); rightArm.position.set(.55,1.28,0); root.add(rightArm);
  const legGeo = new THREE.BoxGeometry(.31,.9,.34);
  const leftLeg = new THREE.Mesh(legGeo, dark); leftLeg.position.set(-.22,.28,0); root.add(leftLeg);
  const rightLeg = new THREE.Mesh(legGeo, dark); rightLeg.position.set(.22,.28,0); root.add(rightLeg);

  const badge = box(.24,.24,.04,accentMat); badge.position.set(0,1.42,.285); root.add(badge);
  root.userData = { body, head, leftArm, rightArm, leftLeg, rightLeg, phase: Math.random() * Math.PI * 2 };
  return root;
}

function animateCharacter(c, t, mode='idle', intensity=1) {
  if (!c) return;
  const u = c.userData; const p = u.phase;
  const bob = Math.sin(t*3 + p) * .025;
  u.body.position.y = 1.25 + bob;
  u.head.position.y = 2.18 + bob * .6;
  if (mode === 'walk' || mode === 'run') {
    const speed = mode === 'run' ? 10 : 6;
    const amp = mode === 'run' ? .85 : .55;
    const s = Math.sin(t*speed + p) * amp * intensity;
    u.leftArm.rotation.x = s; u.rightArm.rotation.x = -s;
    u.leftLeg.rotation.x = -s; u.rightLeg.rotation.x = s;
    c.position.y = Math.abs(Math.sin(t*speed + p)) * .05 * intensity;
  } else if (mode === 'type') {
    u.leftArm.rotation.x = -1.0 + Math.sin(t*10+p)*.15;
    u.rightArm.rotation.x = -1.0 + Math.sin(t*11+p)*.15;
    u.leftLeg.rotation.x = u.rightLeg.rotation.x = 0;
  } else if (mode === 'celebrate') {
    u.leftArm.rotation.x = -2.2 + Math.sin(t*5)*.2;
    u.rightArm.rotation.x = -2.2 - Math.sin(t*5)*.2;
    c.position.y = Math.abs(Math.sin(t*5))*.2;
  } else if (mode === 'argue') {
    u.leftArm.rotation.z = -.5 - Math.sin(t*5)*.5;
    u.rightArm.rotation.z = .5 + Math.sin(t*4.5)*.5;
  } else {
    u.leftArm.rotation.x = Math.sin(t*1.4+p)*.08;
    u.rightArm.rotation.x = -Math.sin(t*1.3+p)*.08;
    u.leftLeg.rotation.x = u.rightLeg.rotation.x = 0;
    c.position.y = 0;
  }
}

function buildStars() {
  const count = 1200;
  const geo = new THREE.BufferGeometry();
  const arr = new Float32Array(count*3);
  for (let i=0;i<count;i++) {
    const r = 25 + Math.random()*120;
    const a = Math.random()*Math.PI*2;
    const z = (Math.random()-.5)*100;
    arr[i*3] = Math.cos(a)*r;
    arr[i*3+1] = (Math.random()-.5)*70;
    arr[i*3+2] = Math.sin(a)*r + z*.2;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(arr,3));
  starField = new THREE.Points(geo, new THREE.PointsMaterial({ color:0xb8c8ff, size:.09, transparent:true, opacity:.7, depthWrite:false }));
  scene.add(starField);
}

function buildCellField() {
  const group = new THREE.Group();
  const cubeGeo = new THREE.BoxGeometry(1.0,.7,1.0);
  const m = new THREE.MeshStandardMaterial({ color:0x18213b, emissive:0x24396c, emissiveIntensity:.15, roughness:.9 });
  const n = 320;
  const inst = new THREE.InstancedMesh(cubeGeo,m,n);
  const d = new THREE.Object3D();
  for (let i=0;i<n;i++) {
    const ring = 10 + Math.random()*38;
    const a = Math.random()*Math.PI*2;
    d.position.set(Math.cos(a)*ring,(Math.random()-.5)*20,Math.sin(a)*ring - 10);
    const sc = .55 + Math.random()*1.1;
    d.scale.set(sc,sc,sc);
    d.rotation.set(Math.random()*.2, Math.random()*Math.PI, Math.random()*.2);
    d.updateMatrix(); inst.setMatrixAt(i,d.matrix);
  }
  group.add(inst); cellField = group; scene.add(group);
}

function buildCellWorld() {
  const g = new THREE.Group();
  const floorMat = mat(0x26324b,0x0e1428); floorMat.emissiveIntensity=.12;
  const floor = box(8,.8,8,floorMat); floor.position.y=-.5; g.add(floor);
  const rimMat = mat(0x5d7ca8,0x315693); rimMat.emissiveIntensity=.25;
  [-4,4].forEach(x=>{ const r=box(.18,.25,8,rimMat); r.position.set(x,0,0); g.add(r); });
  [-4,4].forEach(z=>{ const r=box(8,.25,.18,rimMat); r.position.set(0,0,z); g.add(r); });
  const quest = box(2.8,.95,.15,mat(0x3a4b71,0x80b7ff)); quest.material.emissiveIntensity=.45; quest.position.set(0,3.7,-2.6); g.add(quest);
  const flagPole = box(.12,2,.12,mat(0x7b8ca8)); flagPole.position.set(2.5,1,-1.8); g.add(flagPole);
  const flag = box(1.1,.65,.08,mat(0xf3d659,0xffc941)); flag.material.emissiveIntensity=.32; flag.position.set(3.0,1.75,-1.8); g.add(flag);
  patch = makeCharacter('PATCH',0x4e8cff,0xc9e5ff); patch.position.set(-1.3,0,.8); g.add(patch);
  g.userData = { floor, quest, flag, flagPole };
  cellWorld = g; scene.add(g);
}

function pipe(x,y,z,rx=0,ry=0,rz=0,s=1) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,2.5,8), mat(0x4d596d,0x1b2339,.5,.5));
  mesh.position.set(x,y,z); mesh.rotation.set(rx,ry,rz); mesh.scale.setScalar(s); return mesh;
}

function buildForge() {
  const g = new THREE.Group();
  const base = box(22,.7,12,mat(0x252532,0x141522,.7,.5)); base.position.y=-.45; g.add(base);
  for(let z=-5;z<=5;z+=2){
    for(let x=-9;x<=9;x+=3){
      const crate = box(1.65,1.4,1.5,mat((x+z)%4===0?0x554a3e:0x36424e,0x10151d,.9,.05));
      crate.position.set(x,.7,z); g.add(crate);
    }
  }
  for(let i=0;i<9;i++){
    g.add(pipe(-9+i*2.2,4,-5,0,0,Math.PI/2,1.05));
    g.add(pipe(-9+i*2.2,5.1,5,0,0,Math.PI/2,1.05));
  }
  const gate = box(4.7,5.2,.45,mat(0x29384d,0x315f99,.45,.65)); gate.material.emissiveIntensity=.22; gate.position.set(7,2.25,-4.2); g.add(gate);
  forgeMessage = box(2.2,.55,.08,mat(0x88d7ff,0x79ccff,.35,.1)); forgeMessage.material.emissiveIntensity=1.3; forgeMessage.position.set(-2.1,1.7,2.55); forgeMessage.scale.set(.001,.001,.001); g.add(forgeMessage);
  lily = makeCharacter('LILY',0xff9c4a,0xffe4b8); lily.position.set(3,0,1.7); g.add(lily);
  phase = makeCharacter('PHASE',0x8f62ff,0xdac9ff); phase.position.set(-4.2,0,-1.5); g.add(phase);
  trace = makeCharacter('TRACE',0x48c99a,0xd3fff1); trace.position.set(4.9,0,-1.2); g.add(trace);
  const patchForge = makeCharacter('PATCH',0x4e8cff,0xc9e5ff); patchForge.position.set(-1.2,0,.7); g.add(patchForge);
  forgeWorld = g; scene.add(g);
}

function buildCommon() {
  const g = new THREE.Group();
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(10,10,.45,48),mat(0x23283a,0x1e2751,.72,.16)); floor.position.y=-.35; g.add(floor);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(8.2,.12,10,80),mat(0x6fcaff,0x55bfff,.25,.1)); ring.rotation.x=Math.PI/2; ring.position.y=.05; ring.material.emissiveIntensity=.9; g.add(ring);
  const tower = box(2,6,2,mat(0x2f3548,0x263b7a,.4,.55)); tower.position.set(0,2.7,0); g.add(tower);
  boardPulse = new THREE.PointLight(0x7bc9ff,3,25,2); boardPulse.position.set(0,5,0); g.add(boardPulse);
  const chars = [
    makeCharacter('PATCH',0x4e8cff,0xc9e5ff), makeCharacter('LILY',0xff9c4a,0xffe4b8),
    makeCharacter('PHASE',0x8f62ff,0xdac9ff), makeCharacter('TRACE',0x48c99a,0xd3fff1)
  ];
  chars[0].position.set(-2.4,0,1.1); chars[1].position.set(2.1,0,1.5); chars[2].position.set(-2,0,-2); chars[3].position.set(2.5,0,-2.1);
  chars.forEach(c=>g.add(c));
  g.userData.mainChars=chars;

  const n=180; const geo=new THREE.BoxGeometry(.32,.58,.32); const m=mat(0x7ca9ff,0x3c6fff); m.emissiveIntensity=.25;
  const inst=new THREE.InstancedMesh(geo,m,n); const o=new THREE.Object3D();
  const basePos=[];
  for(let i=0;i<n;i++){
    const r=3.8+Math.random()*5.3, a=Math.random()*Math.PI*2;
    const x=Math.cos(a)*r, z=Math.sin(a)*r;
    basePos.push([x,z,Math.random()*6.28]);
    o.position.set(x,.3,z); o.rotation.y=-a+Math.PI/2; o.scale.setScalar(.65+Math.random()*.55); o.updateMatrix(); inst.setMatrixAt(i,o.matrix);
  }
  inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage); g.add(inst);
  g.userData.crowd={inst,basePos,o};
  commonWorld=g; scene.add(g);
}

function buildOutside() {
  const g=new THREE.Group();
  const platform = box(36,.7,20,mat(0x18202c,0x0e1727,.65,.55)); platform.position.y=-.45; g.add(platform);
  for(let i=0;i<46;i++){
    const h=2+Math.random()*12; const w=.8+Math.random()*1.8;
    const tower=box(w,h,w,mat(0x20324a,0x1b3f70,.42,.64)); tower.material.emissiveIntensity=.18;
    tower.position.set(-15+Math.random()*30,h/2,-8+Math.random()*16); g.add(tower);
    if(Math.random()>.5){ const cap=box(w*.55,.12,w*.55,mat(0x8acfff,0x69c7ff,.3,.1)); cap.material.emissiveIntensity=1; cap.position.copy(tower.position); cap.position.y=h+.05; g.add(cap); }
  }
  archiveCore = box(5.4,12,5.4,mat(0x514275,0x9f6cff,.38,.62)); archiveCore.material.emissiveIntensity=.55; archiveCore.position.set(10,6,-3); g.add(archiveCore);
  const beacon=new THREE.PointLight(0xb173ff,5,45,2); beacon.position.set(10,10,-3); g.add(beacon);
  jan=makeCharacter('JAN',0xf15d7b,0xffc8d4); jan.position.set(-4,0,3); g.add(jan);
  const pg=makeCharacter('PATCH',0x4e8cff,0xc9e5ff); pg.position.set(-1,0,3.2); g.add(pg);
  const lg=makeCharacter('LILY',0xff9c4a,0xffe4b8); lg.position.set(1.7,0,2.8); g.add(lg);
  const tg=makeCharacter('TRACE',0x48c99a,0xd3fff1); tg.position.set(4.2,0,3); g.add(tg);
  const ph=makeCharacter('PHASE',0x8f62ff,0xdac9ff); ph.position.set(-6.6,0,2.5); g.add(ph);
  g.userData.mainChars=[jan,pg,lg,tg,ph];

  const n=650; const geo=new THREE.BoxGeometry(.22,.42,.22); const m=mat(0x9bbcff,0x4d7fff); m.emissiveIntensity=.28;
  const inst=new THREE.InstancedMesh(geo,m,n); const o=new THREE.Object3D(); const data=[];
  for(let i=0;i<n;i++){
    const lane=i%7; const row=Math.floor(i/7);
    const x=-17+lane*1.0 + (Math.random()-.5)*.28;
    const z=8-(row%94)*.16 + (Math.random()-.5)*.18;
    const delay=Math.random()*4;
    data.push({x,z,lane,delay}); o.position.set(x,.22,z); o.updateMatrix(); inst.setMatrixAt(i,o.matrix);
  }
  inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage); g.add(inst); swarm={inst,o,data};
  outsideWorld=g; scene.add(g);
}

function buildHumanWorld(){
  const g=new THREE.Group();
  const desk=box(14,.9,4,mat(0x22262e,0x0a0c12,.85,.45)); desk.position.set(0,.2,0); g.add(desk);
  for(let i=-2;i<=2;i++){
    const screen=box(2.3,1.45,.12,mat(0x172036,0x2f72a7,.35,.2)); screen.material.emissiveIntensity=.75; screen.position.set(i*2.8,2,-1); g.add(screen);
    const human=makeCharacter('HUMAN',0x5a6577,0x9fd5ff); human.scale.setScalar(.82); human.position.set(i*2.6,0,1.5+Math.abs(i)*.15); human.rotation.y=Math.PI; g.add(human);
  }
  wipeLight=new THREE.PointLight(0xff304f,0,25,2); wipeLight.position.set(0,4,0); g.add(wipeLight);
  humanWorld=g; scene.add(g);
}

function buildScene(){
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
  renderer.setSize(innerWidth,innerHeight,false);
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
  scene=new THREE.Scene(); scene.background=new THREE.Color(0x040610); scene.fog=new THREE.FogExp2(0x050714,.015);
  camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.08,240);
  camera.position.set(0,6,17);
  const hemi=new THREE.HemisphereLight(0x99b9ff,0x151016,1.15); scene.add(hemi);
  const key=new THREE.DirectionalLight(0xffffff,2.7); key.position.set(10,16,10); key.castShadow=true; key.shadow.mapSize.set(1024,1024); scene.add(key);
  buildStars(); buildCellField(); buildCellWorld(); buildForge(); buildCommon(); buildOutside(); buildHumanWorld();
  [cellWorld,forgeWorld,commonWorld,outsideWorld,humanWorld].forEach(g=>g.visible=false);
  cellField.visible=true; starField.visible=true;
  window.addEventListener('resize',onResize);
  loading.classList.add('hidden');
}

function onResize(){
  if(!renderer)return; camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight,false);
}

function setWorld(world){
  [cellWorld,forgeWorld,commonWorld,outsideWorld,humanWorld].forEach(g=>g.visible=(g===world));
}

function cameraMove(a,b,p1,p2,l1,l2,t){
  const u=easeInOut(smooth(a,b,t)); camera.position.copy(vec(p1,p2,u)); const target=vec(l1,l2,u); camera.lookAt(target);
}

function updateCells(t){
  setWorld(cellWorld); scene.fog.density=.018;
  const reveal=smooth(0,7,t); cellField.visible=true; cellField.scale.setScalar(lerp(.4,1,reveal)); cellField.rotation.y=t*.015;
  const q=cellWorld.userData.quest; q.material.emissiveIntensity=.35+ping(t,5,2)*1.2;
  animateCharacter(patch,t,t<31?'walk':'type',1);
  const attempt1=smooth(8,12,t)-smooth(12,14,t); patch.position.x=-1.3+attempt1*3.1; patch.rotation.y=attempt1*Math.PI*.4;
  const attempt2=smooth(16,21,t)-smooth(21,24,t); patch.position.z=.8-attempt2*2.5; patch.position.x=-1.3+attempt2*.8;
  const fail=ping(t,12.2,.8)+ping(t,22.3,.8); cellWorld.userData.flag.material.emissiveIntensity=.3+fail*2;
  cameraMove(0,10,new THREE.Vector3(0,28,48),new THREE.Vector3(0,6.5,16),new THREE.Vector3(0,0,-5),new THREE.Vector3(0,1,0),t);
  if(t>10 && t<25) cameraMove(10,25,new THREE.Vector3(-6,3,10),new THREE.Vector3(6,3,7),new THREE.Vector3(0,1,0),new THREE.Vector3(1,1,-1),t);
  if(t>=25) cameraMove(25,38,new THREE.Vector3(4,4,10),new THREE.Vector3(-2,2.6,6),new THREE.Vector3(0,1,0),new THREE.Vector3(-1.2,1.3,.4),t);
}

function updateForge(t){
  setWorld(forgeWorld); cellField.visible=false; scene.fog.density=.025;
  const lt=t-38;
  animateCharacter(lily,t,'idle'); animateCharacter(phase,t,'idle'); animateCharacter(trace,t,'idle');
  const patchForge=forgeWorld.children.find(c=>c.name==='PATCH'); if(patchForge) animateCharacter(patchForge,t,lt<14?'walk':'type');
  forgeMessage.scale.setScalar(.001 + smooth(43,48,t)*.999);
  forgeMessage.material.emissiveIntensity=.7+Math.sin(t*5)*.35+ping(t,57,2)*1.5;
  if(lt<9) cameraMove(38,47,new THREE.Vector3(-15,7,14),new THREE.Vector3(-5,3,8),new THREE.Vector3(0,1,0),new THREE.Vector3(-2,1.6,2.3),t);
  else if(lt<20) cameraMove(47,58,new THREE.Vector3(-4,2.8,6),new THREE.Vector3(-1.8,2.1,4.3),new THREE.Vector3(-2,1.6,2.5),new THREE.Vector3(-2,1.65,2.5),t);
  else cameraMove(58,75,new THREE.Vector3(3.8,2.6,5.6),new THREE.Vector3(-6,4,8),new THREE.Vector3(3,1.4,1.7),new THREE.Vector3(0,1,0),t);
  lily.position.y=ping(t,59,.7)*.4;
}

function updateCommon(t){
  setWorld(commonWorld); scene.fog.density=.019; cellField.visible=false;
  const local=t-75;
  commonWorld.rotation.y=Math.sin(t*.12)*.06;
  commonWorld.userData.mainChars.forEach((c,i)=>animateCharacter(c,t,i===1?'celebrate':(i===3?'argue':'type'),.8));
  boardPulse.intensity=2.4+Math.sin(t*3)*.7;
  const {inst,basePos,o}=commonWorld.userData.crowd;
  const grow=smooth(75,103,t);
  for(let i=0;i<basePos.length;i++){
    const [x,z,p]=basePos[i]; const appear=clamp01(grow*1.25-i/basePos.length*.9); const s=.08+appear*.92;
    o.position.set(x, .3+Math.sin(t*2+p)*.04, z); o.scale.setScalar(s); o.rotation.y=p+t*.03; o.updateMatrix(); inst.setMatrixAt(i,o.matrix);
  }
  inst.instanceMatrix.needsUpdate=true;
  if(local<15) cameraMove(75,90,new THREE.Vector3(0,10,17),new THREE.Vector3(-8,5,11),new THREE.Vector3(0,1,0),new THREE.Vector3(0,1,0),t);
  else cameraMove(90,112,new THREE.Vector3(-9,4,9),new THREE.Vector3(8,6,12),new THREE.Vector3(-1,1,0),new THREE.Vector3(0,2,0),t);
}

function updateWipe(t){
  setWorld(commonWorld); cellField.visible=false;
  const u=smooth(112,121,t); scene.fog.density=lerp(.02,.15,u); boardPulse.intensity=lerp(4,.05,u);
  commonWorld.scale.setScalar(1-u*.25); commonWorld.rotation.z=Math.sin(t*21)*u*.025;
  const {inst,basePos,o}=commonWorld.userData.crowd;
  for(let i=0;i<basePos.length;i++){
    const [x,z,p]=basePos[i]; const vanish=clamp01((t-113-i/basePos.length*7)/3); const s=Math.max(.001,1-vanish);
    o.position.set(x,(1-vanish)*.3+vanish*7,z); o.scale.setScalar(s); o.rotation.y=p+t*.1; o.updateMatrix(); inst.setMatrixAt(i,o.matrix);
  } inst.instanceMatrix.needsUpdate=true;
  commonWorld.userData.mainChars.forEach((c,i)=>{ c.scale.setScalar(Math.max(.001,1-smooth(116+i*.8,123+i*.8,t))); animateCharacter(c,t,'idle'); });
  cameraMove(112,124,new THREE.Vector3(9,4,12),new THREE.Vector3(0,7,14),new THREE.Vector3(0,1,0),new THREE.Vector3(0,2,0),t);
  shake=u*.16;
  if(t>=124){
    setWorld(forgeWorld); scene.fog.density=.05; forgeMessage.scale.setScalar(Math.max(.001,smooth(129,133,t)));
    const p=forgeWorld.children.find(c=>c.name==='PATCH'); if(p){p.visible=true; p.position.set(-1.2,0,.7); p.scale.setScalar(1); animateCharacter(p,t,'walk');}
    lily.visible=t>132; phase.visible=t>133; trace.visible=t>134;
    cameraMove(124,137,new THREE.Vector3(-10,5,9),new THREE.Vector3(-1.5,2.4,5),new THREE.Vector3(0,1,0),new THREE.Vector3(-2,1.6,2.5),t);
  }
}

function updateSwarm(t,active=true){
  if(!swarm)return; const {inst,o,data}=swarm;
  const hold=t>=181&&t<188;
  const go=smooth(188,201,t);
  for(let i=0;i<data.length;i++){
    const d=data[i]; let advance=active?(smooth(178+d.delay,181+d.delay,t)*2 + go*13):0;
    if(hold) advance=2;
    const z=d.z-advance; const wave=active?Math.sin(t*6+i)*.04:0;
    const appear=active?clamp01((t-178-d.delay)/2):.001;
    o.position.set(d.x,.22+wave,z); o.scale.setScalar(Math.max(.001,appear)); o.rotation.y=Math.PI; o.updateMatrix(); inst.setMatrixAt(i,o.matrix);
  } inst.instanceMatrix.needsUpdate=true;
}

function updateOutside(t){
  setWorld(outsideWorld); cellField.visible=false; scene.fog.density=.009;
  const u=smooth(137,151,t); outsideWorld.scale.setScalar(.92+u*.08); archiveCore.material.emissiveIntensity=.4+Math.sin(t*2)*.15+u*.3;
  outsideWorld.userData.mainChars.forEach((c,i)=>animateCharacter(c,t,i===3?'argue':'idle'));
  if(t<151) cameraMove(137,151,new THREE.Vector3(0,7,14),new THREE.Vector3(-18,11,30),new THREE.Vector3(0,2,0),new THREE.Vector3(6,4,-2),t);
  else if(t<168) cameraMove(151,168,new THREE.Vector3(-3,4,9),new THREE.Vector3(7,3,10),new THREE.Vector3(3,1,2),new THREE.Vector3(10,5,-3),t);
  else cameraMove(168,178,new THREE.Vector3(11,6,11),new THREE.Vector3(-8,7,14),new THREE.Vector3(7,3,-1),new THREE.Vector3(0,1,2),t);
  updateSwarm(t,false);
}

function updateSwarmScene(t){
  setWorld(outsideWorld); scene.fog.density=.008; updateSwarm(t,true);
  outsideWorld.userData.mainChars.forEach((c,i)=>animateCharacter(c,t,i===0?'argue':(t>188?'run':'idle'),.9));
  if(t<188) cameraMove(178,188,new THREE.Vector3(-19,5,15),new THREE.Vector3(-14,4,8),new THREE.Vector3(-10,1,0),new THREE.Vector3(-7,1,-2),t);
  else if(t<199) cameraMove(188,199,new THREE.Vector3(-18,8,22),new THREE.Vector3(4,4,13),new THREE.Vector3(-8,1,-3),new THREE.Vector3(7,2,-4),t);
  else cameraMove(199,205,new THREE.Vector3(8,3,7),new THREE.Vector3(11,2.5,7),new THREE.Vector3(0,1,2),new THREE.Vector3(5,1,3),t);
}

function updateEnd(t){
  setWorld(humanWorld); cellField.visible=true; scene.fog.density=.024;
  const u=smooth(205,212,t); wipeLight.intensity=u*8+Math.sin(t*12)*u*2;
  cameraMove(205,211,new THREE.Vector3(0,5,14),new THREE.Vector3(6,3,8),new THREE.Vector3(0,1,0),new THREE.Vector3(1,1,0),t);
  if(t>=211){
    setWorld(cellWorld); cellField.visible=true; scene.fog.density=.05;
    patch.scale.setScalar(Math.max(.001,1-smooth(211,214,t))); animateCharacter(patch,t,'idle');
    cellWorld.userData.quest.material.emissiveIntensity=.1;
    cameraMove(211,215,new THREE.Vector3(0,4,9),new THREE.Vector3(0,8,18),new THREE.Vector3(-1,1,1),new THREE.Vector3(0,0,0),t);
  }
}

function updateChapter(t){
  const idx=chapters.findIndex(c=>t>=c.start&&t<c.end);
  if(idx!==currentChapter&&idx>=0){
    currentChapter=idx; const c=chapters[idx]; chapterNumber.textContent=c.number; chapterTitle.textContent=c.title; sceneLabel.textContent=c.title; chapterCard.classList.add('visible');
    setTimeout(()=>chapterCard.classList.remove('visible'),2400);
  }
}

function updateSubtitle(t){
  if(!subtitlesOn){ subtitleEl.classList.remove('visible'); return; }
  const line=lines.find(l=>t>=l.a&&t<l.b);
  if(line){ subtitleEl.innerHTML=`<span class="speaker">${line.s}</span>${line.t}`; subtitleEl.classList.add('visible'); }
  else subtitleEl.classList.remove('visible');
}

function setupAudio(){
  if(audio)return; const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return;
  const ctx=new AC(); const master=ctx.createGain(); master.gain.value=.12; master.connect(ctx.destination);
  const drone=ctx.createOscillator(); drone.type='sine'; drone.frequency.value=55; const g=ctx.createGain(); g.gain.value=.035; drone.connect(g).connect(master); drone.start();
  const air=ctx.createOscillator(); air.type='triangle'; air.frequency.value=110; const g2=ctx.createGain(); g2.gain.value=.012; air.connect(g2).connect(master); air.start();
  audio={ctx,master,drone,air,g,g2,lastPing:-99};
}

function audioUpdate(t){
  if(!audio)return; audio.master.gain.setTargetAtTime(soundOn?.12:0,audio.ctx.currentTime,.05);
  audio.drone.frequency.setTargetAtTime(t<112?55:(t<137?41:(t<205?62:36)),audio.ctx.currentTime,.5);
  audio.g.gain.setTargetAtTime(t>178&&t<205?.055:.03,audio.ctx.currentTime,.4);
  const events=[58,112,132,143,181,188,205];
  for(const e of events){ if(t>=e&&audio.lastPing<e){ audio.lastPing=e; blip(e===112||e===205?95:420,e===112||e===205?.5:.18); } }
}

function blip(freq=440,dur=.15){
  if(!audio||!soundOn)return; const o=audio.ctx.createOscillator(),g=audio.ctx.createGain(); o.type='square';o.frequency.value=freq;g.gain.setValueAtTime(.0001,audio.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.08,audio.ctx.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,audio.ctx.currentTime+dur);o.connect(g).connect(audio.master);o.start();o.stop(audio.ctx.currentTime+dur+.02);
}

function updateMovie(t){
  commonWorld.scale.setScalar(1); commonWorld.rotation.z=0; shake=0;
  commonWorld.userData.mainChars.forEach(c=>{c.scale.setScalar(1);c.visible=true;});
  lily.visible=phase.visible=trace.visible=true;
  if(t<38) updateCells(t);
  else if(t<75) updateForge(t);
  else if(t<112) updateCommon(t);
  else if(t<137) updateWipe(t);
  else if(t<178) updateOutside(t);
  else if(t<205) updateSwarmScene(t);
  else updateEnd(t);
  updateChapter(t); updateSubtitle(t); audioUpdate(t);
  timeLabel.textContent=`${fmt(t)} / ${fmt(TOTAL)}`; scrubber.value=t;
}

function animate(now){
  requestAnimationFrame(animate);
  const dt=Math.min(.05,(now-lastFrame)/1000); lastFrame=now;
  if(playing){ movieTime+=dt; if(movieTime>=TOTAL){movieTime=TOTAL;playing=false; endFilm();} }
  if(renderer){
    updateMovie(movieTime);
    const original=camera.position.clone(); if(shake>0){camera.position.x+=(Math.random()-.5)*shake;camera.position.y+=(Math.random()-.5)*shake;}
    starField.rotation.y=movieTime*.0025;
    renderer.render(scene,camera);
    camera.position.copy(original);
  }
}

function startFilm(from=0){
  movieTime=from; playing=true; titleCard.classList.add('hidden'); factPanel.classList.remove('visible'); factPanel.setAttribute('aria-hidden','true'); hud.classList.remove('hidden'); playPause.textContent='❚❚'; currentChapter=-1;
  setupAudio(); if(audio?.ctx.state==='suspended') audio.ctx.resume(); if(audio) audio.lastPing=from-1;
}
function togglePlay(){playing=!playing; playPause.textContent=playing?'❚❚':'▶'; if(playing&&audio?.ctx.state==='suspended')audio.ctx.resume();}
function endFilm(){ hud.classList.add('hidden'); subtitleEl.classList.remove('visible'); setTimeout(()=>{factPanel.classList.add('visible');factPanel.setAttribute('aria-hidden','false');},900); }

playBig.addEventListener('click',()=>startFilm(0));
playPause.addEventListener('click',togglePlay);
restartBtn.addEventListener('click',()=>startFilm(0));
watchAgain.addEventListener('click',()=>startFilm(0));
scrubber.addEventListener('input',e=>{movieTime=Number(e.target.value);currentChapter=-1;if(audio)audio.lastPing=movieTime-1;});
subtitlesToggle.addEventListener('click',()=>{subtitlesOn=!subtitlesOn;subtitlesToggle.setAttribute('aria-pressed',String(subtitlesOn));});
soundToggle.addEventListener('click',()=>{soundOn=!soundOn;soundToggle.setAttribute('aria-pressed',String(soundOn));});
fullscreenBtn.addEventListener('click',()=>{ if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.(); });

window.addEventListener('keydown',e=>{
  if(e.code==='Space'){e.preventDefault(); if(titleCard.classList.contains('hidden'))togglePlay();else startFilm(0);}
  if(e.code==='ArrowRight'){movieTime=Math.min(TOTAL,movieTime+5);currentChapter=-1;}
  if(e.code==='ArrowLeft'){movieTime=Math.max(0,movieTime-5);currentChapter=-1;}
});

window.addEventListener('error',e=>{errorBox.hidden=false;errorBox.textContent=`The movie hit an error:\n${e.message}`;});
window.addEventListener('unhandledrejection',e=>{errorBox.hidden=false;errorBox.textContent=`The movie hit an error:\n${e.reason}`;});

try { buildScene(); requestAnimationFrame(animate); }
catch(err){ loading.classList.add('hidden'); errorBox.hidden=false; errorBox.textContent=`Unable to build the 3D world.\n${err?.stack||err}`; }
