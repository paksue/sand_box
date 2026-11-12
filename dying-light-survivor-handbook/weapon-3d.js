/* HARRAN FIELD MANUAL — original procedural 3D effects laboratory.
 * Babylon.js/WebGL. Models are educational illustrations, NOT extracted Dying Light assets.
 * No SVG animation or server-side rendering. The engine loads only after a user clicks.
 */
(function(){
"use strict";
function create(canvas,type){
 const B=window.BABYLON;
 if(!B)throw Error("Babylon.js has not loaded.");
 const engine=new B.Engine(canvas,true,{stencil:true,preserveDrawingBuffer:false});
 engine.setHardwareScalingLevel(Math.max(1,Math.min(1.8,(window.devicePixelRatio||1)/1.6)));
 const scene=new B.Scene(engine);
 scene.clearColor=new B.Color4(.055,.08,.066,1);
 scene.ambientColor=new B.Color3(.18,.20,.16);
 const camera=new B.ArcRotateCamera("cinema",-Math.PI/2.85,Math.PI/2.36,4.3,new B.Vector3(0,1,0),scene);
 camera.lowerRadiusLimit=2.2;camera.upperRadiusLimit=7;camera.lowerBetaLimit=.3;camera.upperBetaLimit=Math.PI*.80;
 camera.wheelDeltaPercentage=.013;camera.pinchDeltaPercentage=.015;camera.inertia=.79;camera.attachControl(canvas,true);
 camera.panningSensibility=0;
 const hemi=new B.HemisphericLight("warmAmbient",new B.Vector3(0,1,0),scene);hemi.intensity=.46;hemi.diffuse=new B.Color3(.88,.87,.80);hemi.groundColor=new B.Color3(.10,.14,.13);
 const key=new B.SpotLight("key",new B.Vector3(-3.6,6,3.2),new B.Vector3(.5,-1.2,-.6),Math.PI/2.1,1.7,scene);key.intensity=310;key.diffuse=B.Color3.FromHexString("#f4d1a3");
 const fill=new B.PointLight("fill",new B.Vector3(2.8,2.6,-2),scene);fill.intensity=38;fill.diffuse=B.Color3.FromHexString("#8bc2ad");
 const fxLight=new B.PointLight("electricLight",new B.Vector3(0,1.35,0),scene);fxLight.intensity=0;fxLight.diffuse=B.Color3.FromHexString("#73baff");
 const shadow=new B.ShadowGenerator(1024,key);shadow.useBlurExponentialShadowMap=true;shadow.blurKernel=20;
 const material=(name,color,rough=.45,metal=.15,emissive)=>{const m=new B.PBRMaterial(name,scene);m.albedoColor=B.Color3.FromHexString(color);m.metallic=metal;m.roughness=rough;if(emissive)m.emissiveColor=B.Color3.FromHexString(emissive);return m};
 const darkMetal=material("gunmetal","#4b5550",.33,.86),steel=material("steel","#b0b4a7",.3,.88),
 rust=material("rust","#986543",.78,.6),black=material("tape","#232f2c",.9,.03),brass=material("brass","#c38d4d",.32,.84),
 wood=material("weathered wood","#8b6242",.62,.0),red=material("red medical mark","#cb5d40",.45,.1),
 paper=material("ivory paint","#d1c6a3",.72,.03), glass=material("translucent glass","#d1d5b0",.11,.05),
 oil=material("combustible liquid","#b58437",.19,.12),glowing=material("electro glow","#71d4ff",.3,.1,"#3b9cdb");
 glass.alpha=.38;glass.transparencyMode=B.Material.MATERIAL_ALPHABLEND;oil.alpha=.84;oil.transparencyMode=B.Material.MATERIAL_ALPHABLEND;
 // High-resolution procedural grunge adds material variation without external image downloads.
 function patina(){
   const tex=new B.DynamicTexture("patinaAtlas",{width:512,height:512},scene,false);
   const cx=tex.getContext(),w=512;
   const grad=cx.createLinearGradient(0,0,w,w);grad.addColorStop(0,"#777c6f");grad.addColorStop(.43,"#535b55");grad.addColorStop(1,"#393f3b");
   cx.fillStyle=grad;cx.fillRect(0,0,w,w);
   let seed=27461;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
   for(let i=0;i<4600;i++){const x=random()*w,y=random()*w,rr=.3+random()*9;cx.globalAlpha=.025+random()*.29;cx.fillStyle=random()>.65?"#b77945":random()>.55?"#181f1e":"#c0c5b5";cx.beginPath();cx.ellipse(x,y,rr,rr*(.2+random()),random()*6,0,6.283);cx.fill()}
   for(let i=0;i<270;i++){cx.globalAlpha=.12;cx.strokeStyle=random()>.5?"#a3936d":"#1d2a25";cx.lineWidth=random()*.8+0.2;cx.beginPath();const x=random()*w,y=random()*w;cx.moveTo(x,y);cx.lineTo(x+random()*62-30,y+random()*14-7);cx.stroke()}
   cx.globalAlpha=1;tex.update();darkMetal.albedoTexture=tex;return tex;
 }
 const patinaTex=patina();
 // Museum-grade stage, soft shadows, warm/cool rim lights, and brass inlay.
 const stageMat=material("stage plated iron","#303d35",.55,.56);
 const stage=B.MeshBuilder.CreateCylinder("stage",{height:.22,diameter:3.18,tessellation:96},scene);stage.position.y=-.055;stage.material=stageMat;stage.receiveShadows=true;
 const stageTop=B.MeshBuilder.CreateCylinder("stage top",{height:.018,diameter:2.91,tessellation:96},scene);stageTop.position.y=.065;stageTop.material=darkMetal;stageTop.receiveShadows=true;
 function ring(name,r,y,mat,tube=.016){const m=B.MeshBuilder.CreateTorus(name,{diameter:r*2,thickness:tube,tessellation:96},scene);m.position.y=y;m.material=mat;return m}
 ring("outer gold inlay",1.48,.073,brass,.028);ring("concentric inlay",1.31,.078,steel,.007);
 for(let i=0;i<28;i++){const a=i*Math.PI*2/28,p=B.MeshBuilder.CreateBox("radial score",{width:.025,height:.009,depth:.10},scene);p.position.set(Math.sin(a)*1.41,.09,Math.cos(a)*1.41);p.rotation.y=a;p.material=brass}
 // Three small floating accents give scale, without fake gameplay UI.
 const mount=new B.TransformNode("display mount",scene);
 function add(mesh,mat,parent,cast=true){mesh.material=mat;mesh.parent=parent||mount;if(cast)shadow.addShadowCaster(mesh);return mesh}
 const cylinder=(name,height,diameter,mat,parent,y=0,x=0,z=0)=>{const m=B.MeshBuilder.CreateCylinder(name,{height,diameter,tessellation:48},scene);m.position.set(x,y,z);return add(m,mat,parent)};
 const box=(name,w,h,d,mat,parent,x=0,y=0,z=0)=>{const m=B.MeshBuilder.CreateBox(name,{width:w,height:h,depth:d,wrap:true},scene);m.position.set(x,y,z);return add(m,mat,parent)};
 const tube=(name,pts,r,mat,parent)=>{const m=B.MeshBuilder.CreateTube(name,{path:pts,radius:r,tessellation:12,cap:B.Mesh.CAP_ALL},scene);return add(m,mat,parent)};
 let flame=null,sparks=null,arcLines=[],projectile=null,mark=null,hitGlow=null;
 const temporary=[];
 function createParticleTexture(){
  const dt=new B.DynamicTexture("embersParticle",{width:64,height:64},scene,false);
  const ctx=dt.getContext();ctx.clearRect(0,0,64,64);const grad=ctx.createRadialGradient(32,32,1,32,32,31);grad.addColorStop(0,"rgba(255,250,199,1)");grad.addColorStop(.22,"rgba(255,184,76,.96)");grad.addColorStop(.52,"rgba(255,96,28,.6)");grad.addColorStop(1,"rgba(255,35,8,0)");ctx.fillStyle=grad;ctx.fillRect(0,0,64,64);dt.update();return dt;
 }
 const particleTex=createParticleTexture();
 function makeParticle(name,count,where,isFire){
   const p=new B.ParticleSystem(name,count,scene);p.particleTexture=particleTex;p.emitter=where;p.minSize=isFire?.10:.025;p.maxSize=isFire?.29:.085;p.minLifeTime=isFire?.30:.10;p.maxLifeTime=isFire?.90:.24;p.emitRate=isFire?180:240;
   p.minEmitPower=isFire?.20:.5;p.maxEmitPower=isFire?.75:2.3;p.updateSpeed=.016;
   p.color1=isFire?new B.Color4(1,.64,.19,.9):new B.Color4(.65,.91,1,1);
   p.color2=isFire?new B.Color4(1,.22,.05,.8):new B.Color4(.32,.68,1,.9);
   p.colorDead=new B.Color4(0,0,0,0);p.blendMode=B.ParticleSystem.BLENDMODE_ADD;
   p.direction1=isFire?new B.Vector3(-.20,.25,-.2):new B.Vector3(-2,.2,-2);
   p.direction2=isFire?new B.Vector3(.20,.9,.2):new B.Vector3(2,1.2,2);
   p.gravity=new B.Vector3(0,isFire?.35:-.4,0);p.start();return p;
 }
 const root=new B.TransformNode("weaponRoot",scene);root.parent=mount;
 function createPipe(fire){
   const rod=new B.TransformNode("rod",scene);rod.parent=root;rod.rotation.z=-.30;
   cylinder("steel pipe",2.18,.104,darkMetal,rod,1.16);
   cylinder("main bore",.10,.118,steel,rod,2.28);
   cylinder("threaded coupling",.14,.165,rust,rod,2.05);
   cylinder("end coupling",.12,.15,darkMetal,rod,.21);
   for(let i=0;i<13;i++){const y=.30+i*.047;
    const wrap=B.MeshBuilder.CreateTorus("grip ring",{diameter:.120,thickness:.008,tessellation:36},scene);wrap.position.y=y;add(wrap,i%2===0?black:rust,rod)}
   for(const y of [.16,1.78,2.19]){const collar=B.MeshBuilder.CreateTorus("steel collar",{diameter:.164,thickness:.020,tessellation:40},scene);collar.position.y=y;add(collar,brass,rod)}
   // Gold tape and high-voltage contact nodes evoke an improvised powered weapon.
   for(let i=0;i<5;i++){const n=box("welded lug",.09,.035,.13,brass,rod,i%2===0?.065:-.065,1.24+i*.16,0);n.rotation.z=.3}
   const battery=box("battery pack",.28,.38,.20,black,rod,.16,1.16,0);battery.rotation.z=-.05;
   box("pack label",.21,.17,.015,brass,rod,.16,1.16,.11);
   tube("power wire",Array.from({length:14},(_,i)=>{const a=i/13;return new B.Vector3(.17+Math.sin(a*Math.PI*4)*.055,1.33+a*.65,.11+Math.cos(a*Math.PI*3)*.05)}),.014,glowing,rod);
   const emission=new B.TransformNode("effect source",scene);emission.parent=rod;emission.position.set(0,1.77,0);
   sparks=makeParticle("spark discharge",240,emission,false);
   if(fire){const emitter=new B.TransformNode("flame source",scene);emitter.parent=rod;emitter.position.y=1.94;flame=makeParticle("ember plume",480,emitter,true);}
   return rod;
 }
 function bow(){
   const bows=new B.TransformNode("ranger bow",scene);bows.parent=root;bows.rotation.z=.07;
   const points=[];for(let i=0;i<=36;i++){const u=i/36,y=.45+u*1.72;points.push(new B.Vector3(-.28+Math.sin(u*Math.PI)*.43,y,0))}
   tube("wood composite bow limbs",points,.052,wood,bows);
   tube("laminate inner limb",points.map(p=>p.add(new B.Vector3(.028,0,.025))),.012,brass,bows);
   tube("bowstring",[points[0],new B.Vector3(-.10,1.26,0),points[36]],.012,steel,bows);
   const grip=box("leather grip",.18,.38,.10,black,bows,.11,1.25,0);grip.rotation.z=-.2;
   for(let i=0;i<4;i++){let knot=B.MeshBuilder.CreateTorus("wrap",{diameter:.147,thickness:.009,tessellation:24},scene);knot.rotation.x=Math.PI/2;knot.position.set(.11,1.12+i*.08,0);add(knot,brass,bows)}
   return bows;
 }
 function arrow(parent,offset=0){
   const arr=new B.TransformNode("arrow",scene);arr.parent=parent;
   cylinder("arrow shaft",1.43,.025,wood,arr,1.04);
   const tip=B.MeshBuilder.CreateCylinder("arrowhead",{height:.13,diameterTop:0,diameterBottom:.095,tessellation:24},scene);tip.position.y=1.85;add(tip,steel,arr);
   for(let i=0;i<3;i++){const f=box("fletching",.04,.18,.09,red,arr,0,.48,0);f.rotation.y=i*2*Math.PI/3}
   arr.position.x=offset;return arr;
 }
 function medkit(){
   const med=new B.TransformNode("medical kit",scene);med.parent=root;med.rotation.y=.12;
   box("medical case",1.02,.68,.35,darkMetal,med,0,1.17,0);
   box("medic face",.92,.58,.02,paper,med,0,1.17,.19);
   box("cross vertical",.15,.40,.036,red,med,0,1.17,.218);
   box("cross horizontal",.39,.15,.036,red,med,0,1.17,.232);
   box("lid trim",1.04,.047,.40,brass,med,0,1.51,0);
   const handle=B.MeshBuilder.CreateTorus("handle",{diameter:.37,thickness:.05,tessellation:36},scene);handle.rotation.x=Math.PI/2;handle.position.set(0,1.61,0);add(handle,black,med);
   const glowBall=B.MeshBuilder.CreateSphere("heal pulse",{diameter:1.27,segments:32},scene);glowBall.position.y=1.2;glowBall.material=material("healing field","#72ebc0",.2,0,"#075a3b");glowBall.material.alpha=.09;glowBall.material.transparencyMode=B.Material.MATERIAL_ALPHABLEND;mark=glowBall;
 }
 function lock(){
   const blk=new B.TransformNode("lock arrangement",scene);blk.parent=root;
   const plate=B.MeshBuilder.CreateCylinder("lock plate",{height:.35,diameter:1.4,tessellation:96},scene);plate.rotation.x=Math.PI/2;plate.position.y=1.25;add(plate,darkMetal,blk);
   const edge=B.MeshBuilder.CreateTorus("bevel",{diameter:1.30,thickness:.058,tessellation:96},scene);edge.rotation.x=Math.PI/2;edge.position.set(0,1.25,.23);add(edge,brass,blk);
   const centre=B.MeshBuilder.CreateCylinder("key cylinder",{height:.12,diameter:.62,tessellation:64},scene);centre.rotation.x=Math.PI/2;centre.position.set(0,1.25,.26);add(centre,steel,blk);
   const slot=box("key slot",.09,.36,.018,black,blk,0,1.25,.326);
   const pick=new B.TransformNode("turning pick",scene);pick.parent=blk;pick.position.set(0,1.25,.37);mark=pick;
   const wire=box("lockpick stem",.04,.9,.045,steel,pick,.07,.48,0);wire.rotation.z=.15;
   box("lockpick handle",.095,.38,.07,brass,pick,.15,1.02,0).rotation.z=.15;
 }
 function molotov(){
   const bottle=new B.TransformNode("bottle",scene);bottle.parent=root;bottle.rotation.z=-.14;
   const shape=[[0,0],[.21,.02],[.31,.15],[.32,.34],[.27,.64],[.15,.83],[.135,1.01],[.14,1.13],[0,1.13]].map(([x,y])=>new B.Vector3(x,y,0));
   const body=B.MeshBuilder.CreateLathe("glass bottle",{shape,sideOrientation:B.Mesh.DOUBLESIDE,tessellation:64},scene);body.position.y=.47;add(body,glass,bottle);
   const liquid=B.MeshBuilder.CreateCylinder("amber liquid",{height:.47,diameter:.52,tessellation:64},scene);liquid.position.y=.69;add(liquid,oil,bottle);
   cylinder("bottle neck",.16,.24,glass,bottle,1.57);
   cylinder("cork",.13,.20,wood,bottle,1.69);
   const rag=box("rag fuse",.11,.45,.14,paper,bottle,0,1.96,0);rag.rotation.z=.35;
   const emitter=new B.TransformNode("molotov fire",scene);emitter.parent=bottle;emitter.position.y=2.17;flame=makeParticle("rag fire",500,emitter,true);
   for(let i=0;i<3;i++){const label=box("torn paper label",.22,.065,.007,paper,bottle,0,.8+i*.07,.282);label.rotation.z=(i-1)*.06}
 }
 function equipment(){
   createPipe(false);
   root.rotation.z=-.05;root.position.x=-.48;root.scaling.set(.67,.67,.67);
   const accessory=new B.TransformNode("accessory rack",scene);accessory.parent=mount;accessory.position.x=.74;accessory.scaling.set(.65,.65,.65);
   const arrowNode=arrow(accessory);arrowNode.rotation.z=.7;
   const caseRoot=new B.TransformNode("equipment medkit",scene);caseRoot.parent=mount;caseRoot.position.set(.8,.38,.30);const medB=box("medkit",.54,.34,.12,paper,caseRoot);box("vertical cross",.085,.22,.015,red,caseRoot,0,0,.07);box("horizontal cross",.22,.085,.015,red,caseRoot,0,0,.08);
 }
 let modelRoot;
 if(type==="nightclub"||type==="watercurrent"){modelRoot=createPipe(type==="nightclub");}
 else if(type==="bow"||type==="arrows"){modelRoot=bow();const a=arrow(root);a.rotation.z=Math.PI/2;a.position.set(0,.05,.10);projectile=a;}
 else if(type==="medkits"){medkit();}
 else if(type==="lockpicks"){lock();}
 else if(type==="molotov"){molotov();}
 else equipment();
 // Filmic post-processing. Falls back cleanly on browsers lacking high-end support.
 let glowLayer=null,pipeline=null;
 try{glowLayer=new B.GlowLayer("emissive bloom",scene,{blurKernelSize:32});glowLayer.intensity=.45}catch(e){}
 try{pipeline=new B.DefaultRenderingPipeline("filmic",true,scene,[camera]);pipeline.samples=2;pipeline.fxaaEnabled=true;pipeline.bloomEnabled=true;pipeline.bloomThreshold=.62;pipeline.bloomWeight=.18;pipeline.bloomKernel=32;pipeline.imageProcessing.toneMappingEnabled=true;pipeline.imageProcessing.toneMappingType=B.ImageProcessingConfiguration.TONEMAPPING_ACES;pipeline.imageProcessing.exposure=1.12;pipeline.imageProcessing.contrast=1.17}catch(e){}
 let isPaused=false,elapsed=0,latest=performance.now(),released=false,usingOrbit=false,lastArc=0,visible=true;
 const pointerHandler=()=>{usingOrbit=true};
 canvas.addEventListener("pointerdown",pointerHandler);
 function drawArc(t){
  if(!(type==="watercurrent"||type==="nightclub"))return;
  for(const old of arcLines){try{old.dispose()}catch(e){}}arcLines=[];
  const pulsing=(t%6.4>1.2&&t%6.4<5.1);
  if(!pulsing)return;
  const len=type==="nightclub"?5:4;
  for(let j=0;j<len;j++){
   const coords=[];for(let k=0;k<8;k++){const p=k/7;const twist=p*5.6+j*1.9+t*3;
    coords.push(new B.Vector3(.16*Math.cos(twist)+(Math.random()-.5)*.22, .64+p*1.34, .16*Math.sin(twist)+(Math.random()-.5)*.18))}
   const line=B.MeshBuilder.CreateLines("live electrical arc",{points:coords,updatable:false},scene);line.color=new B.Color3(.52+Math.random()*.4,.78,1);line.alpha=.65+Math.random()*.35;line.parent=modelRoot;arcLines.push(line)
  }
 }
 function animate(ms){
  if(released||document.hidden)return;
  const dt=Math.min(.08,(ms-latest)/1000);latest=ms;
  if(!isPaused){elapsed+=dt;if(elapsed>7.6)elapsed=0}
  const t=elapsed,beat=t%7.6,active=(beat>1.15&&beat<5.2);
  if(!usingOrbit)camera.alpha=-Math.PI/2.7+Math.sin(t*.16)*.21;
  mount.rotation.y=Math.sin(t*.23)*.12;
  mount.position.y=Math.sin(t*.95)*.025;
  if(type==="nightclub"||type==="watercurrent"){modelRoot.rotation.y=Math.sin(t*.32)*.17;fxLight.intensity=active?(type==="nightclub"?17:24)*(0.65+Math.random()*.7):0; if(sparks)sparks.emitRate=active?210:0;if(flame)flame.emitRate=active?165:30;
   if(t-lastArc>.10){drawArc(t);lastArc=t;}
  }
  if(type==="molotov"&&flame){flame.emitRate=beat>1?260:60;fxLight.diffuse=new B.Color3(1,.40,.07);fxLight.intensity=beat>1?17:1;}
  if(type==="bow"||type==="arrows"){if(projectile){const phase=(beat-1.7)/1.3;projectile.position.x=phase>0&&phase<1.2?phase*1.6:0;projectile.position.y=.08+Math.max(0,phase)*.05;projectile.rotation.z=Math.PI/2-Math.max(0,phase)*.09} }
  if(type==="medkits"&&mark){const scale=1.0+Math.max(0,Math.sin(t*2.3))*.32;mark.scaling.set(scale,scale,scale);mark.material.alpha=.03+Math.abs(Math.sin(t*1.4))*.10;fxLight.diffuse=new B.Color3(.20,1,.67);fxLight.intensity=Math.abs(Math.sin(t*1.5))*9}
  if(type==="lockpicks"&&mark){mark.rotation.z=Math.sin(t*2.2)*.22;}
 }
 function loop(){if(released)return;const now=performance.now();if(document.hidden||!visible||canvas.offsetParent===null){latest=now;return;}animate(now);scene.render()}
 engine.runRenderLoop(loop);
 const onResize=()=>{if(!released)engine.resize()};
 const observer=typeof ResizeObserver!=="undefined"?new ResizeObserver(onResize):null;
 if(observer)observer.observe(canvas);else window.addEventListener("resize",onResize);
 const visibility=()=>{latest=performance.now()};
 document.addEventListener("visibilitychange",visibility);
 const viewport=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(entries=>{visible=!!entries[0]?.isIntersecting;latest=performance.now()},{threshold:0.01}):null;
 if(viewport)viewport.observe(canvas);
 return{
  replay(){elapsed=0;isPaused=false;latest=performance.now();},
  togglePause(){isPaused=!isPaused;latest=performance.now();if(sparks)sparks.emitRate=isPaused?0:200;return isPaused},
  dispose(){if(released)return;released=true;engine.stopRenderLoop();canvas.removeEventListener("pointerdown",pointerHandler);document.removeEventListener("visibilitychange",visibility);if(observer)observer.disconnect();else window.removeEventListener("resize",onResize);if(viewport)viewport.disconnect();try{scene.dispose()}catch(e){}try{engine.dispose()}catch(e){}}
 };
}
window.Harran3D={create};
})();