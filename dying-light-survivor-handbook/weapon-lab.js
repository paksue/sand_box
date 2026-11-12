/* Weapon Lab — authentic YouTube creator embeds + optional original Babylon.js effects studies.
   Videos load only on user click. We never download/rehost footage. */
(function(){
"use strict";
const CLIPS={
 nightclub:{id:"f2q9Wss9OMA",start:1644,end:1700,creator:"Suicide1996",title:"Ultimate Survivor Bundle — Night Club combat",notice:"At 27:24: watch the Night Club connect, spark and ignite infected.",source:"Gameplay footage • verified chapter"},
 bow:{id:"HIU_pZkCupQ",start:134,end:200,creator:"HOG",title:"Dying Light — Ranger Bow weapon showcase",notice:"At 2:14: inspect the Ranger Bow and watch how it handles.",source:"Gameplay footage • verified chapter"},
 arrows:{id:"IWkYi5qHLJA",start:0,end:null,creator:"Suicide1996",title:"Ranger Bow with special arrows — full demonstration",notice:"Watch aiming, arrow trajectories, and special ammunition; this is a longer gameplay showcase.",source:"Gameplay footage • full-length showcase"},
 medkits:{id:"nrov1mMEJPM",start:0,end:null,creator:"80s Kid YT",title:"Dying Light — Crafting a first medkit",notice:"See how the medkit recipe is selected and crafted in the actual game.",source:"Gameplay footage • crafting"},
 lockpicks:{id:"rI14_1hEyhg",start:0,end:null,creator:"Bodhyplees",title:"Dying Light — Quick lockpick tutorial",notice:"Observe how the lockpick moves and when the lock begins to turn.",source:"Gameplay footage • controls"}
};
const INFO={
 nightclub:{label:"Double elemental strike",title:"Night Club",symbols:"✦ + ⚡",watch:"Electricity can interrupt a zombie. Burning adds follow-on damage; the effect is not guaranteed on every hit."},
 bow:{label:"Ranged precision",title:"Ranger Bow",symbols:"↗",watch:"Bow draw, aiming, and the quiet projectile. Aim for the head; the 400 listed damage is not universal kill damage."},
 arrows:{label:"Ammunition field test",title:"Ranger's Arrows",symbols:"➶",watch:"Regular arrows are quiet; special electric, burning and explosive arrows have different effects."},
 medkits:{label:"Survival response",title:"Medkits",symbols:"+",watch:"Craft from Gauze and Alcohol, then press H during gameplay to heal."},
 lockpicks:{label:"Precision mechanism",title:"Lockpicks",symbols:"⌑",watch:"Find the sweet spot by moving the pick gently before trying to turn the lock. Don't force a jammed lock."},
 molotov:{label:"Area-denial effect",title:"Molotovs",symbols:"✶",watch:"Fire spreads in an area. Throw at clustered Biters from distance or a safe high position."},
 watercurrent:{label:"Conductive strike",title:"Water Current",symbols:"⚡",watch:"A modified pipe delivers medium electricity. The actual in-game chance and duration are governed by game mechanics."},
 loadout:{label:"Combat readiness",title:"Four-slot loadout",symbols:"Ⅰ Ⅱ Ⅲ Ⅳ",watch:"Configure fast switching between melee, bow, backup and a spare specialty weapon."}
};
const BABYLON_SRC="https://cdn.jsdelivr.net/npm/babylonjs@8.0.0/babylon.min.js";
let activeStop=null,loadPromise=null;
function escape(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function loadBabylon(){if(window.BABYLON)return Promise.resolve(window.BABYLON);if(loadPromise)return loadPromise;loadPromise=new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=BABYLON_SRC;s.async=true;s.crossOrigin="anonymous";s.onload=()=>window.BABYLON?resolve(window.BABYLON):reject(new Error("3D engine did not initialize"));s.onerror=()=>reject(new Error("The 3D engine could not load from the CDN"));document.head.appendChild(s)}).catch(e=>{loadPromise=null;throw e});return loadPromise}
function youtubeLink(v){return "https://www.youtube.com/watch?v="+v.id+(v.start?"&t="+v.start+"s":"")}
function embedURL(v){const q=new URLSearchParams({rel:"0",playsinline:"1",modestbranding:"1",start:String(v.start||0)});if(v.end)q.set("end",String(v.end));return "https://www.youtube-nocookie.com/embed/"+v.id+"?"+q.toString()}
function stop(){if(activeStop){try{activeStop()}catch(e){}activeStop=null}}
function mount(id,root,context){
 stop();
 if(!root)return;
 const info=INFO[id]||INFO.nightclub,clip=CLIPS[id]||null;
 let mode=clip?"video":"scene",playing=false,sim=null,disposed=false;
 const renderShell=()=>{
  const tabs=clip?'<div class="wl-switch" role="tablist" aria-label="Demonstration type"><button type="button" data-mode="video" role="tab" aria-selected="'+(mode==="video")+'">▶ Real game footage</button><button type="button" data-mode="scene" role="tab" aria-selected="'+(mode==="scene")+'">◉ Interactive 3D study</button></div>':'<div class="wl-switch"><button type="button" role="tab" aria-selected="true" disabled>◉ Interactive 3D study — illustrative, not gameplay</button></div>';
  root.innerHTML='<section class="weapon-lab" aria-label="Weapon effect demonstration"><header class="wl-head"><div><span class="wl-eyebrow">FIELD VIDEO / VISUAL INTELLIGENCE</span><h3>'+escape(info.title)+' — in action</h3></div><span class="wl-label">'+(mode==="video"?"AUTHENTIC GAMEPLAY":"3D EFFECTS STUDY")+'</span></header>'+tabs+
  '<div class="wl-stage" id="wlActiveStage" aria-label="'+escape(info.title)+' demonstration">'+
  (mode==="video"?'<div class="wl-preview"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/'+clip.id+'/hqdefault.jpg"><button type="button" class="wl-load" data-play="video"><span class="wl-load-icon" aria-hidden="true">▶</span><span class="wl-load-title">Watch actual gameplay</span><span class="wl-load-sub">CLICK TO LOAD YOUTUBE • NO AUTOPLAY</span></button></div>':
  '<div class="wl-preview"><div class="wl-poster-3d"><div class="wl-poster-orbit"></div><span class="wl-poster-marker">'+escape(info.symbols)+'</span></div><button type="button" class="wl-load" data-play="scene"><span class="wl-load-icon" aria-hidden="true">◉</span><span class="wl-load-title">Launch real-time 3D</span><span class="wl-load-sub">ROTATE • ZOOM • REPLAY • GPU RENDERED</span></button></div>')+
  '</div>'+
  '<div class="wl-status"><span>'+(mode==="video"?"Original creator video • tap to load":"Original 3D model study • not a recording of Dying Light")+'</span><code>'+(mode==="video"?escape(clip.creator):"BABYLON.JS / WEBGL")+'</code></div>'+
  '<div class="wl-foot"><div class="wl-watch"><b>WHAT TO LOOK FOR</b><p>'+escape(mode==="video"?clip.notice:info.watch)+'</p>'+
   (mode==="video"?'<small>'+escape(clip.source)+' · credited to '+escape(clip.creator)+'</small>':'<small>Visual demonstration of the described effect, not exact in-game models, damage values or physics.</small>')+
   '</div><div class="wl-actions" id="wlActions">'+(mode==="video"?'<a class="wl-action" href="'+youtubeLink(clip)+'" target="_blank" rel="noopener">Open on YouTube ↗</a>':'<button type="button" class="wl-action" data-3d-replay disabled>↺ Replay</button><button type="button" class="wl-action" data-3d-pause disabled>Ⅱ Pause</button>')+'</div></div></section><div class="wl-caption">BEFORE → CRAFT → TEST. Your progress is recorded only when you confirm the craft below.</div>';
  root.querySelectorAll("[data-mode]").forEach(btn=>btn.onclick=()=>{const newMode=btn.dataset.mode;if(mode===newMode)return;stop();mode=newMode;playing=false;renderShell()});
  const play=root.querySelector("[data-play]");if(play)play.onclick=()=>mode==="video"?playVideo():play3D();
 };
 const showErr=(reason)=>{const stage=root.querySelector("#wlActiveStage");if(stage)stage.innerHTML='<div class="wl-error"><strong>Unable to show this demonstration.</strong><span>'+escape(reason)+'</span>'+(clip?'<a href="'+youtubeLink(clip)+'" class="wl-plainlink" target="_blank" rel="noopener">Watch the original on YouTube ↗</a>':'<button class="wl-action" type="button" data-try>Try again</button>')+'</div>';const retry=root.querySelector("[data-try]");if(retry)retry.onclick=play3D};
 function playVideo(){const stage=root.querySelector("#wlActiveStage");if(!stage)return;stage.innerHTML='<iframe title="'+escape(clip.title)+'" loading="eager" referrerpolicy="strict-origin-when-cross-origin" src="'+embedURL(clip)+'" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';playing=true;activeStop=()=>{const f=stage.querySelector("iframe");if(f)f.src="about:blank"};}
 async function play3D(){const stage=root.querySelector("#wlActiveStage");if(!stage)return;const stillCurrent=()=>root.isConnected&&root.querySelector("#wlActiveStage")===stage&&mode==="scene"&&!disposed;
 stage.innerHTML='<div class="wl-loader"><span class="wl-spinner"></span>Preparing GPU demonstration…</div>';
 try{await loadBabylon();if(!stillCurrent())return;
 if(!window.Harran3D||typeof window.Harran3D.create!=="function")throw new Error("3D scene module not installed");
 const canvas=document.createElement("canvas");canvas.setAttribute("aria-label","Interactive animated "+info.title+" model. Drag to orbit; scroll or pinch to zoom.");canvas.tabIndex=0;stage.innerHTML="";stage.appendChild(canvas);
 sim=window.Harran3D.create(canvas,id);playing=true;
 const replay=root.querySelector("[data-3d-replay]"),pause=root.querySelector("[data-3d-pause]");
 if(replay){replay.disabled=false;replay.onclick=()=>sim&&sim.replay()}
 if(pause){pause.disabled=false;pause.onclick=()=>{if(!sim)return;const paused=sim.togglePause();pause.textContent=paused?"▶ Resume":"Ⅱ Pause"}}
 activeStop=()=>{if(sim){sim.dispose();sim=null}};
 }catch(e){showErr((e&&e.message)||"3D unavailable on this device.")}}
 renderShell();
 // Only the owner component can clear itself on rerender. Do not mutate shared saved app state.
 activeStop=()=>{disposed=true;};
}
window.HarranLab={mount,stop};
})();