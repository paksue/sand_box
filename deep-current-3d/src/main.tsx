import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {OceanWorld} from './three-world';
import {MISSIONS,startMission,tick,execute,contacts,bearing,range,fmtDeg,clock,clamp,norm} from './simulation';
import type {Action,Game,Ship} from './simulation';
import './style.css';

const SAVE_KEY='deep-current-3d-save-v1';
function save(g:Game){try{localStorage.setItem(SAVE_KEY,JSON.stringify(g))}catch{/* unavailable */}}
function load():Game|null{try{const o=JSON.parse(localStorage.getItem(SAVE_KEY)||'null') as Game|null;return o?.player&&o.ships&&o.mission?o:null}catch{return null}}
function Tone(){return null}
function Icon({name}:{name:'scope'|'map'|'sonar'|'damage'}){
 if(name==='scope')return <span className="station-symbol">⊕</span>;
 if(name==='map')return <span className="station-symbol">⌖</span>;
 if(name==='sonar')return <span className="station-symbol">◉</span>;
 return <span className="station-symbol">⌁</span>;
}
function App(){
 const [screen,setScreen]=useState<'menu'|'brief'|'game'|'result'>('menu');
 const [missionId,setMissionId]=useState(MISSIONS[0].id);
 const [game,setGame]=useState<Game|null>(null);
 const [error,setError]=useState('');
 const [sound,setSound]=useState(true);
 const [revision,setRevision]=useState(0);
 const gameRef=useRef<Game|null>(null);
 const viewport=useRef<HTMLDivElement|null>(null);
 const world=useRef<OceanWorld|null>(null);
 const pointer=useRef<{x:number,y:number,id:number}|null>(null);
 const soundCtx=useRef<AudioContext|null>(null);
 const raf=useRef(0);
 const [touchHelp,setTouchHelp]=useState(false);
 const g=gameRef.current||game;
 function chirp(freq=380,duration=.08){
  if(!sound)return;
  try{if(!soundCtx.current)soundCtx.current=new AudioContext();
   const ctx=soundCtx.current;void ctx.resume();
   const osc=ctx.createOscillator(),gain=ctx.createGain();
   osc.type='triangle';osc.frequency.setValueAtTime(freq,ctx.currentTime);
   gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.035,ctx.currentTime+.012);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);
   osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration+.02);
  }catch{/* audio optional */}
 }
 function act(c:Action){const g=gameRef.current;if(!g)return;execute(g,c);setRevision(x=>x+1);
  if(c.type==='FIRE')chirp(130,.34);else if(c.type==='MAST')chirp(260,.16);else if(c.type!=='SCOPE_YAW'&&c.type!=='SCOPE_PITCH')chirp(410,.045);
 }
 function begin(id=missionId){
  const next=startMission(id,19430312);gameRef.current=next;setGame(next);setError('');setScreen('game');setRevision(x=>x+1);
 }
 function resume(){const old=load();if(old){old.paused=false;gameRef.current=old;setGame(old);setError('');setScreen('game')}}
 useEffect(()=>{
  if(screen!=='game'||!gameRef.current||!viewport.current)return;
  const host=viewport.current;let scene:OceanWorld;
  try{scene=new OceanWorld(host);world.current=scene;setError('')}
  catch(e){setError('3D rendering could not start: '+(e instanceof Error?e.message:'WebGL unavailable')+'. Try current Chrome, Safari, or Edge with graphics acceleration enabled.');return}
  let last=performance.now(),acc=0,ui=0,autosave=0,previousEvents=gameRef.current?.logs.length||0;
  const frame=(now:number)=>{
   const state=gameRef.current;if(!state)return;
   const delta=Math.min((now-last)/1000,.075);last=now;
   if(!state.paused&&state.status==='running'){
    acc+=delta*state.speedFactor;
    let steps=0;while(acc>=1/30&&steps<90){tick(state,1/30);acc-=1/30;steps++}
    if(steps>=90)acc=0;
   }
   scene.render(state,delta);
   if(now-ui>130){
    ui=now;setRevision(x=>x+1);
    if(state.logs.length>previousEvents){previousEvents=state.logs.length;chirp(275,.1)}
    if(state.status!=='running'&&!state.missionEnded){state.missionEnded=true;save(state);setScreen('result')}
   }
   if(now-autosave>15000){autosave=now;save(state)}
   raf.current=requestAnimationFrame(frame);
  };
  raf.current=requestAnimationFrame(frame);
  return()=>{cancelAnimationFrame(raf.current);world.current=null;scene.dispose();save(gameRef.current||game!)}
 // Deliberately only recreate WebGL scene on mission/screen transition.
 },[screen,game]);
 useEffect(()=>{
  if(screen!=='game')return;
  function key(e:KeyboardEvent){
   if((e.target as HTMLElement)?.tagName==='INPUT')return;
   const state=gameRef.current;if(!state)return;
   let action:Action|null=null;const p=state.player;
   switch(e.key.toLowerCase()){
    case 'arrowleft':action={type:'SCOPE_YAW',value:p.scopeYaw-1.6};break;
    case 'arrowright':action={type:'SCOPE_YAW',value:p.scopeYaw+1.6};break;
    case 'arrowup':action={type:'SCOPE_PITCH',value:p.scopePitch+1.1};break;
    case 'arrowdown':action={type:'SCOPE_PITCH',value:p.scopePitch-1.1};break;
    case 'q':action={type:'ZOOM',value:p.zoom+.5};break;
    case 'e':action={type:'ZOOM',value:p.zoom-.5};break;
    case 'w':action={type:'SPEED',value:p.orderedSpeed+1};break;
    case 's':action={type:'SPEED',value:p.orderedSpeed-1};break;
    case 'a':action={type:'HEADING',value:p.orderedHeading-5};break;
    case 'd':action={type:'HEADING',value:p.orderedHeading+5};break;
    case 'z':action={type:'DEPTH',value:p.orderedDepth+15};break;
    case 'x':action={type:'DEPTH',value:p.orderedDepth-15};break;
    case 'r':action={type:'MAST',value:1};break;
    case 'f':action={type:'MAST',value:0};break;
    case ' ':action={type:'FIRE'};break;
    case '1':action={type:'STATION',value:'scope'};break;
    case '2':action={type:'STATION',value:'map'};break;
    case '3':action={type:'STATION',value:'sonar'};break;
    case '4':action={type:'STATION',value:'damage'};break;
    case 'escape':action={type:'PAUSE'};break;
   }
   if(action){e.preventDefault();execute(state,action);setRevision(x=>x+1)}
  }
  document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);
 },[screen]);
 useEffect(()=>{const onHide=()=>{if(document.hidden&&gameRef.current){gameRef.current.paused=true;save(gameRef.current)}};document.addEventListener('visibilitychange',onHide);return()=>document.removeEventListener('visibilitychange',onHide)},[]);
 function onPointerDown(e:React.PointerEvent<HTMLDivElement>){if(!g||g.station!=='scope')return;pointer.current={x:e.clientX,y:e.clientY,id:e.pointerId};e.currentTarget.setPointerCapture(e.pointerId)}
 function onPointerMove(e:React.PointerEvent<HTMLDivElement>){if(!pointer.current||!g||g.station!=='scope')return;const dx=e.clientX-pointer.current.x,dy=e.clientY-pointer.current.y;
  execute(g,{type:'SCOPE_YAW',value:g.player.scopeYaw+dx*.115/Math.sqrt(g.player.zoom)});
  execute(g,{type:'SCOPE_PITCH',value:g.player.scopePitch-dy*.10/Math.sqrt(g.player.zoom)});
  pointer.current={x:e.clientX,y:e.clientY,id:e.pointerId};setRevision(x=>x+1);
 }
 function onPointerUp(){pointer.current=null}
 function wheel(e:React.WheelEvent<HTMLDivElement>){if(!g||g.station!=='scope')return;execute(g,{type:'ZOOM',value:g.player.zoom+(e.deltaY<0?.3:-.3)});setRevision(x=>x+1)}
 const selected:Ship|null=g?.ships.find(s=>s.id===g.selectedShip&&!s.sunk)||null;
 const sight=g?contacts(g):[];
 const near=sight[0];
 const rangeYd=selected&&g?Math.round(range(g.player,selected)/.9144):0;
 const bearingDisplay=selected&&g?fmtDeg(bearing(g.player,selected)):'---';
 const p=g?.player;
 const clockText=g?clock(g):'05:42';
 const shotStatus=p? (p.torpedoes<=0?'EMPTY':p.tubes[p.selectedTube]>0?'RELOADING':'READY'):'READY';
 const mastState=p?(p.mast>.94?'RAISED':p.mast<.06?'SUBMERGED':'MOVING'):'';
 return <>
 <div className="app">
 {screen==='menu'&&<section className="menu">
  <div className="menu-nav"><span className="eyebrow">MICROPROSE-ERA TACTICS · MODERN 3D WORLD</span><span className="build-label">CINEMATIC 3D · BUILD 0.5</span></div>
  <div className="menu-content"><div className="menu-overline">A NEW SUBMARINE SIMULATION</div><h1>DEEP CURRENT</h1><div className="title-underline"/><h2>PACIFIC PATROL</h2><p>Take command beneath the Pacific. Watch the horizon. Plot your attack. Survive the hunt.</p><button className="hero-button" id="start-button" onClick={()=>{setScreen('brief');chirp(480,.14)}}>BEGIN PATROL <span>→</span></button>
  {load()&&<button className="ghost-button" onClick={resume}>CONTINUE SAVED PATROL</button>}
  <p className="menu-note">REAL-TIME 3D OCEAN & SHIPS <b>·</b> FULL PERISCOPE AIMING <b>·</b> NO DOWNLOAD</p></div>
  <div className="menu-bottom"><span>1943 · THE PACIFIC</span><span>AN ORIGINAL NAVAL GAME</span></div>
 </section>}
 {screen==='brief'&&<section className="brief-screen">
  <header className="brief-top"><button onClick={()=>setScreen('menu')}>← BACK</button><b>COMMAND BRIEFING</b><span>TACTICAL OPERATIONS / PACIFIC</span></header>
  <div className="brief-inner"><span className="eyebrow amber">SELECT A PATROL</span><h1>YOUR ORDERS, CAPTAIN</h1><p>The sea will not wait. Choose an engagement to begin your patrol.</p><div className="mission-grid">{MISSIONS.map((m,i)=><button key={m.id} className={'mission-tile '+(missionId===m.id?'active':'')} onClick={()=>setMissionId(m.id)}><span>PATROL 0{i+1}</span><strong>{m.name}</strong><small>{m.subtitle}</small><em>{m.objective.toLocaleString()} GRT TARGET</em></button>)}</div>
  <div className="brief-objectives"><h3>OPERATIONAL INTELLIGENCE</h3><p>{MISSIONS.find(m=>m.id===missionId)?.description}</p><div className="brief-line"><span>SCENARIO</span><b>{MISSIONS.find(m=>m.id===missionId)?.name}</b></div><div className="brief-line"><span>TIME AT STATION</span><b>{MISSIONS.find(m=>m.id===missionId)?.time} LOCAL</b></div></div>
  <button className="hero-button" id="launch" onClick={()=>begin()}>LAUNCH PATROL <span>→</span></button>
  </div>
 </section>}
 {(screen==='game'||screen==='result')&&g&&p&&<section className="game-shell">
  <header className="game-top">
   <div className="brand"><span>DEEP CURRENT</span><small>PACIFIC PATROL</small></div>
   <div className="location"><span className="eyebrow">SECTOR 07 / PACIFIC</span><b>{g.mission.name}</b></div>
   <div className="top-stats"><span>MAR 12, 1943</span><b>{clockText}</b><span className={'alert-indicator '+(g.alerts?'danger':'')}>{g.alerts?'ESCORT ALERT':'NO ALERT'}</span></div>
   <button className="top-icon" onClick={()=>act({type:'PAUSE'})}>{g.paused?'▶ RESUME':'Ⅱ PAUSE'}</button>
   <button className="top-icon" onClick={()=>{save(g);setScreen('menu')}}>SAVE / EXIT</button>
  </header>
  <div className="play-layout">
   <aside className="station-rail"><div className="rail-head">BATTLE STATIONS</div>{(['scope','map','sonar','damage'] as const).map(name=><button key={name} className={'station-tab '+(g.station===name?'on':'')} onClick={()=>act({type:'STATION',value:name})}><Icon name={name}/><span>{name==='scope'?'PERISCOPE':name==='map'?'TACTICAL MAP':name==='sonar'?'HYDROPHONES':'SHIP STATUS'}</span><small>{name==='scope'?'01':name==='map'?'02':name==='sonar'?'03':'04'}</small></button>)}
    <div className="rail-spacer"/><div className="rail-caption">USS NIGHTFALL</div><div className="rail-metric"><span>HEADING</span><b>{fmtDeg(p.heading)}</b></div><div className="rail-metric"><span>SPEED</span><b>{p.speed.toFixed(1)} KTS</b></div><div className="rail-metric"><span>DEPTH</span><b>{p.depth.toFixed(0)} FT</b></div>
    <div className="rail-note">ONE WORLD. NO ARCADE FILTERS.</div>
   </aside>
   <main className="middle">
    <div className="view-head"><span><i className="live-dot"/> {g.station==='scope'?'OPTICAL PERISCOPE':g.station==='map'?'NAVIGATION CHART':g.station==='sonar'?'PASSIVE HYDROPHONES':'SYSTEM CONDITION'}</span><span>{g.station==='scope'?'OPTICS LIVE · '+p.zoom.toFixed(1)+'×':'WORLD TIME '+clockText}</span></div>
    <div className="view-frame" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={wheel}>
     <div className="webgl-host" ref={viewport}/>
     {g.station==='scope'&&<div className="scope-overlay"><div className="scope-mask scope-mask-left"/><div className="scope-mask scope-mask-right"/><div className="reticle reticle-h"/><div className="reticle reticle-v"/><div className="reticle-center"/><div className="reticle-top">340&nbsp;&nbsp; 350&nbsp;&nbsp; 000&nbsp;&nbsp; 010&nbsp;&nbsp; 020</div><span className="scope-bearing">BEARING {fmtDeg(p.scopeYaw)}</span><span className="scope-pitch">ELEV {p.scopePitch>0?'+':''}{p.scopePitch.toFixed(1)}°</span><span className="scope-zoom">{p.zoom.toFixed(1)}× OPTICAL</span>
       {p.mast<.94&&<div className="submerged-overlay">{mastState}<small>{p.mastTarget?'RAISING OPTICS':'OPTICS BELOW SURFACE'}</small></div>}
      </div>}
     {g.station==='map'&&<div className="overlay-station chart"><div className="overlay-heading"><span>CONTACT PLOT</span><span>GRID 50 NM · TRUE NORTH ↑</span></div><svg viewBox="0 0 900 540" preserveAspectRatio="xMidYMid meet"><defs><pattern id="gridmap" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0H0V56" fill="none" stroke="#4b7b88" strokeOpacity=".23"/></pattern></defs><rect width="900" height="540" fill="url(#gridmap)"/><circle cx="450" cy="270" r="130" className="map-ring"/><circle cx="450" cy="270" r="250" className="map-ring"/><path d="M450 0V540 M0 270H900" className="map-axis"/><path d="M450 262l-11 24h22Z" fill="#e3bd7e" transform={'rotate('+p.heading+',450,270)'}/>{g.ships.filter(s=>!s.sunk).map(s=>{const x=450+(s.x-p.x)*.14,y=270+(s.z-p.z)*.14;return <g key={s.id}><path d="M0 -12L6 10L0 6L-6 10Z" transform={'translate('+x+','+y+') rotate('+s.heading+')'} fill={s.kind==='escort'?'#db8c77':'#82c9c2'}/><text x={x+12} y={y-10} fill="#c9d7d3" fontSize="13">{s.id}</text></g>})}</svg><span className="chart-footer">YOUR SUBMARINE ▲ / CONTACTS ◇ · {g.ships.filter(s=>!s.sunk).length} TRACKS</span></div>}
     {g.station==='sonar'&&<div className="overlay-station sonar"><div className="overlay-heading"><span>HYDROPHONE ARRAY / PASSIVE</span><span>SONAR ROOM</span></div><svg viewBox="0 0 900 540"><circle cx="450" cy="270" r="226" className="sonar-ring"/><circle cx="450" cy="270" r="175" className="sonar-ring"/><circle cx="450" cy="270" r="120" className="sonar-ring"/><circle cx="450" cy="270" r="65" className="sonar-ring"/><path d="M450 35V505M215 270H685" className="sonar-axis"/><path d="M450 262l-9 18h18Z" fill="#95d7b4"/>{sight.map(c=>{const th=c.bearing*Math.PI/180,rr=Math.min(220,c.range*.06+35);const x=450+Math.sin(th)*rr,y=270-Math.cos(th)*rr;return <g key={c.id}><circle cx={x} cy={y} r={c.type==='escort'?9:6} fill={c.type==='escort'?'#d69a83':'#8cf0b8'} opacity=".87"/><circle cx={x} cy={y} r="15" fill="none" stroke="#8cf0b8" strokeOpacity=".32"/><text x={x+16} y={y-8} fill="#a7d5c5" fontSize="13">{fmtDeg(c.bearing)}</text></g>})}</svg><span className="chart-footer">BEARING PLOTS ARE ESTIMATES · PASSIVE LISTENING</span></div>}
     {g.station==='damage'&&<div className="overlay-station damage"><div className="overlay-heading"><span>SHIP'S CONDITION</span><span>DAMAGE CONTROL</span></div><div className="damage-grid"><div><span>HULL INTEGRITY</span><strong>{Math.round(p.hull)}%</strong><div className="bar"><i style={{width:p.hull+'%'}}/></div></div><div><span>BATTERY REMAINING</span><strong>{Math.round(p.battery)}%</strong><div className="bar"><i style={{width:p.battery+'%'}}/></div></div><div><span>TORPEDO INVENTORY</span><strong>{p.torpedoes} / 12</strong></div><div><span>PERISCOPE MAST</span><strong>{mastState}</strong></div><div><span>COMPARTMENTS</span><strong>{p.hull<40?'FLOODING':'SECURE'}</strong></div><div><span>ENEMY CONTACT</span><strong>{g.alerts?'HIGH ALERT':'UNDETECTED'}</strong></div></div><button className="metal-button" onClick={()=>act({type:'REPAIR'})}>DISPATCH DAMAGE PARTY</button></div>}
     {error&&<div className="render-error">{error}</div>}
     {g.paused&&screen==='game'&&<div className="paused-overlay"><h2>PAUSED</h2><button className="hero-button" onClick={()=>act({type:'PAUSE'})}>RESUME PATROL</button></div>}
    </div>
    <div className="optic-controls"><div className="control-label">PERISCOPE OPTICS <small>DRAG TO LOOK IN BOTH DIRECTIONS</small></div><div className="micro-group"><button onClick={()=>act({type:'SCOPE_YAW',value:p.scopeYaw-3})}>←</button><button onClick={()=>act({type:'SCOPE_PITCH',value:p.scopePitch+2})}>↑</button><button onClick={()=>act({type:'SCOPE_PITCH',value:p.scopePitch-2})}>↓</button><button onClick={()=>act({type:'SCOPE_YAW',value:p.scopeYaw+3})}>→</button></div><div className="control-label righted">ZOOM</div><div className="micro-group"><button onClick={()=>act({type:'ZOOM',value:p.zoom-.5})}>−</button><span>{p.zoom.toFixed(1)}×</span><button onClick={()=>act({type:'ZOOM',value:p.zoom+.5})}>+</button></div></div>
    <div className="lower-console">
     <div className="console-segment"><div className="mini-label">PERISCOPE MAST <span>{mastState}</span></div><div className="button-pair"><button className={p.mastTarget>0?'active':''} onClick={()=>act({type:'MAST',value:1})}>↑ RAISE</button><button className={p.mastTarget===0?'active':''} onClick={()=>act({type:'MAST',value:0})}>↓ LOWER</button></div></div>
     <div className="console-segment"><div className="mini-label">SUBMARINE DEPTH <span>{p.depth.toFixed(0)} FT</span></div><div className="button-pair"><button onClick={()=>act({type:'DEPTH',value:p.orderedDepth-15})}>↑ RISE</button><button onClick={()=>act({type:'DEPTH',value:p.orderedDepth+15})}>↓ DIVE</button></div></div>
     <div className="console-segment"><div className="mini-label">SPEED ORDER <span>{p.orderedSpeed.toFixed(0)} KTS</span></div><div className="button-pair"><button onClick={()=>act({type:'SPEED',value:p.orderedSpeed-1})}>− SLOW</button><button onClick={()=>act({type:'SPEED',value:p.orderedSpeed+1})}>+ AHEAD</button></div></div>
     <div className="console-segment"><div className="mini-label">HEADING ORDER <span>{fmtDeg(p.orderedHeading)}</span></div><div className="button-pair"><button onClick={()=>act({type:'HEADING',value:p.orderedHeading-5})}>← PORT</button><button onClick={()=>act({type:'HEADING',value:p.orderedHeading+5})}>STARBOARD →</button></div></div>
    </div>
   </main>
   <aside className="target-panel">
    <div className="target-title">TARGET DATA <span className="live-dot"/></div><div className="target-silhouette"><svg viewBox="0 0 200 70"><path d="M20 44L174 44L166 57L31 57Z" fill="#9fa9a3"/><path d="M113 44V25H152V44M123 25V17H141V25M81 44V13M63 44V20M45 44V31M161 44V20" fill="none" stroke="#a7ada5" strokeWidth="2"/><rect x="91" y="36" width="20" height="8" fill="#adb0a7"/></svg></div>
    <div className="data-line"><span>CLASS</span><b>{selected?(selected.kind==='merchant'?'MERCHANT':'DESTROYER'):'NO CONTACT'}</b></div>
    <div className="data-line"><span>RANGE</span><b>{rangeYd.toLocaleString()} <small>YD</small></b></div>
    <div className="data-line"><span>BEARING</span><b>{bearingDisplay}</b></div>
    <div className="data-line"><span>COURSE</span><b>{selected?fmtDeg(selected.heading):'---'}</b></div>
    <div className="data-line"><span>SPEED</span><b>{selected?selected.speed.toFixed(0):'--'} <small>KTS</small></b></div>
    <div className="data-line"><span>NAME</span><b className="small-value">{selected?.name||'UNKNOWN'}</b></div>
    <button className="next-contact" onClick={()=>{if(!g)return;const all=g.ships.filter(s=>!s.sunk);const i=all.findIndex(s=>s.id===g.selectedShip);const next=all[(i+1)%all.length];if(next){g.selectedShip=next.id;execute(g,{type:'SCOPE_YAW',value:bearing(p,next)});setRevision(x=>x+1)}}}>◈ NEXT CONTACT</button>
    <div className="compass-panel"><div className="compass-circle"><div className="compass-ticks">N<br/><span>E &nbsp;&nbsp;&nbsp;&nbsp; W</span><br/>S</div><div className="needle" style={{transform:'rotate('+p.scopeYaw+'deg)'}}/><div className="compass-degree">{fmtDeg(p.scopeYaw)}</div></div><div className="compass-caption">TRUE PERISCOPE BEARING</div></div>
    <div className="weapons"><div className="target-title">TORPEDO CONTROL <span>MARK 14</span></div><div className="mini-label">GYRO OFFSET <span>{p.gyro>=0?'+':''}{Math.round(p.gyro)}°</span></div><div className="button-pair"><button onClick={()=>act({type:'GYRO',value:p.gyro-1})}>− 1°</button><button onClick={()=>act({type:'GYRO',value:p.gyro+1})}>+ 1°</button></div><button className="solve-button" onClick={()=>act({type:'SOLVE'})}>⌖ COMPUTE LEAD</button><div className="mini-label">TORPEDO TUBES <span>{p.torpedoes} REMAIN</span></div><div className="tubes">{p.tubes.map((t,i)=><button key={i} className={(p.selectedTube===i?'active ':'')+(t===0?'ready':'reloading')} onClick={()=>act({type:'TUBE',value:i})}>{i+1}</button>)}</div><div className={'tube-ready '+(shotStatus==='READY'?'is-ready':'')}>TUBE {p.selectedTube+1}: {shotStatus}</div><button className="fire-button" id="fire" disabled={shotStatus!=='READY'} onClick={()=>act({type:'FIRE'})}><span>FIRE TORPEDO</span><small>SPACE / CLICK</small></button></div>
   </aside>
  </div>
  <footer className="game-bottom"><div><span className="green-signal">●</span> {g.logs[0]||'STANDING BY'}</div><div className="footer-actions"><button onClick={()=>act({type:'QUIET'})} className={p.quiet?'is-silent':''}>{p.quiet?'◉ SILENT RUNNING':'○ QUIET RUNNING'}</button><button onClick={()=>act({type:'FACTOR',value:g.speedFactor===1?4:g.speedFactor===4?12:1})}>{g.speedFactor}× TIME</button><button onClick={()=>setTouchHelp(x=>!x)}>CONTROLS ?</button><button onClick={()=>setSound(x=>!x)}>{sound?'♫ ON':'♫ OFF'}</button></div></footer>
  {touchHelp&&<div className="help-card"><button onClick={()=>setTouchHelp(false)}>✕</button><h3>BRIDGE CONTROLS</h3><p>Drag the ocean to look left, right, up or down. Wheel or ± zoom. Raise/lower the optical mast independently of diving the submarine. W/S speed · A/D helm · Z/X dive/rise · R/F mast · SPACE torpedo.</p></div>}
  </section>}
 {screen==='result'&&g&&<div className="result-screen"><div className="result-box"><span className="eyebrow">PATROL REPORT</span><h1>{g.status==='won'?'MISSION COMPLETE':g.status==='lost'?'SUBMARINE LOST':'PATROL RECALLED'}</h1><div className="result-stats"><div><span>TONNAGE</span><b>{g.tonnage.toLocaleString()}</b></div><div><span>HITS / SHOTS</span><b>{g.hits} / {g.shots}</b></div><div><span>HULL</span><b>{g.player.hull.toFixed(0)}%</b></div></div><button className="hero-button" onClick={()=>{setScreen('brief');gameRef.current=null;setGame(null)}}>NEW PATROL →</button></div></div>}
 </div>
 </>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
