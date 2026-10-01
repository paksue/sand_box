import {useEffect,useRef,useState} from 'react';
import Scene from '../render/Scene';
import {dispatch,save,reload,reset,snapshot,saveStatus} from '../simulation/store';
import {type State,timeLabel} from '../simulation/game';
import {type Hotspot,type Point,itemNames,itemDescriptions} from '../content/world';
import AdventureIcon,{ItemArt,type Verb} from './AdventureIcon';
import './village.css';
import {villageWalkPoint as clamp,villageWalkPath,villageDepth,villageDirection,type MaraDirection} from '../content/villageWalk';
const verbs:Verb[]=['Walk','Look','Hand','Talk'];
type Panel='Satchel'|'Journal'|'Menu'|'Wait'|null;
export default function VillageAdventure({s}:{s:State}){
 const [verb,setVerb]=useState<Verb>('Walk'),[selected,setSelected]=useState<string>(),[panel,setPanel]=useState<Panel>(null),[reveal,setReveal]=useState(false),[hover,setHover]=useState(''),[message,setMessage]=useState<string|null>(s.events.length===0?s.message:null),[speaker,setSpeaker]=useState('Aldus Reed'),[position,setPosition]=useState(s.player),[walking,setWalking]=useState(false),[facing,setFacing]=useState(1),[direction,setDirection]=useState<MaraDirection>('front'),[performing,setPerforming]=useState(false),[toolbar,setToolbar]=useState(false),[frame,setFrame]=useState(0),[destination,setDestination]=useState<Point|null>(null),[notice,setNotice]=useState('');
 const pos=useRef(position),animation=useRef(0),root=useRef<HTMLElement>(null),returnFocus=useRef<HTMLElement|null>(null),modal=useRef<HTMLElement>(null);
 function stop(){cancelAnimationFrame(animation.current);setWalking(false);setPerforming(false);setDestination(null);if(pos.current.x!==snapshot().player.x||pos.current.y!==snapshot().player.y)dispatch({type:'move',point:pos.current});}
 function walk(point:Point,done?:()=>void){
  stop();const path=villageWalkPath(pos.current,clamp(point)),target=path.at(-1)!;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){pos.current=target;setPosition(target);dispatch({type:'move',point:target});done?.();return;}
  setDestination(target);setWalking(true);setFrame(0);
  let segment=1,last=0,stride=0;
  function tick(now:number){
   const dt=last?Math.min((now-last)/1000,.05):0;last=now;
   let budget=dt*112*villageDepth(pos.current.y);
   while(segment<path.length){
    const end=path[segment],start=pos.current,dx=end.x-start.x,dy=end.y-start.y,distance=Math.hypot(dx,dy);
    if(distance<.01){segment++;continue;}
    setDirection(villageDirection(dx,dy));if(Math.abs(dx)>.1)setFacing(dx<0?-1:1);
    const vertical=Math.abs(dy)>Math.abs(dx)*.65?.72:1,step=Math.min(distance,budget*vertical);
    const t=step/distance,next={x:start.x+dx*t,y:start.y+dy*t};pos.current=next;setPosition(next);
    stride+=step/villageDepth(next.y);setFrame(Math.floor(stride/12)%6);
    if(step<distance)break;budget-=step/vertical;segment++;if(budget<=0)break;
   }
   if(segment<path.length)animation.current=requestAnimationFrame(tick);
   else{setWalking(false);setFrame(0);setDestination(null);dispatch({type:'move',point:target});done?.();}
  }
  animation.current=requestAnimationFrame(tick);
 }
 function perform(h:Hotspot,action:string,done:()=>void){
  setDirection('side');setFacing(h.x<pos.current.x?-1:1);setFrame(0);
  if(action==='Talk'||matchMedia('(prefers-reduced-motion: reduce)').matches){done();return;}
  setPerforming(true);let began=0;
  function tick(now:number){if(!began)began=now;const frame=Math.min(5,Math.floor((now-began)/120));setFrame(['thread','mirror','bottle','cake'].includes(h.id)?[0,1,1,4,5,0][frame]:frame);if(now-began<720)animation.current=requestAnimationFrame(tick);else{setPerforming(false);setFrame(0);done();}}
  animation.current=requestAnimationFrame(tick);
 }
 useEffect(()=>()=>cancelAnimationFrame(animation.current),[]);
 useEffect(()=>{if(!walking){pos.current=s.player;setPosition(s.player);}},[s.player.x,s.player.y]);
 const blocked=!!message||!!panel;
 useEffect(()=>{if(blocked){returnFocus.current=document.activeElement as HTMLElement;modal.current?.focus();}else{returnFocus.current?.focus();}},[blocked]);
 function say(text:string,name='Mara'){setSpeaker(name);setMessage(text);}
 function choose(v:Verb){stop();setSelected(undefined);setVerb(v);setHover('');}
 function act(h:Hotspot){
  if(blocked||performing)return;
  const approach={x:h.id==='aldus'?395:h.id==='courier'?h.x-45:h.id==='road'?730:h.exit?915:Math.max(145,Math.min(310,h.x>245?h.x-55:h.x+55)),y:h.exit?535:['aldus','courier'].includes(h.id)?490:h.id==='road'?490:395};
  const run=(action:string)=>{dispatch({type:'interact',id:h.id,verb:action,item:selected});if(snapshot().location==='village')say(snapshot().message,action==='Talk'&&h.id==='aldus'?'Aldus Reed':action==='Look'?'The storyteller':'Mara');};
  if(selected){walk(approach,()=>perform(h,'Use',()=>run('Use')));return;}
  if(verb==='Walk'){walk(approach,h.exit?()=>dispatch({type:'travel',to:h.exit!}):undefined);return;}
  if(verb==='Look'){stop();run('Look');return;}
  if(verb==='Talk'){if(h.verbs?.includes('Talk'))walk(approach,()=>perform(h,'Talk',()=>run('Talk')));else say('Mara tries a friendly greeting. The '+h.name.toLowerCase()+' keeps its own counsel.');return;}
  if(h.verbs?.includes('Take'))walk(approach,()=>perform(h,'Take',()=>run('Take')));
  else if(h.id==='courier')walk(approach,()=>perform(h,'Give',()=>run('Entrust key')));
  else say(h.id==='aldus'?'Aldus rests his injured leg. A word would be kinder than a tug.':'Mara can see no useful way to move that with her bare hands.');
 }
 const command=selected?`Use ${itemNames[selected]}`:verb;
 function open(p:Panel){stop();setPanel(p);}
 return <main className="village-game" ref={root} tabIndex={-1} onContextMenu={e=>{e.preventDefault();if(!blocked){setSelected(undefined);setVerb(verbs[(verbs.indexOf(verb)+1)%4]);}}} onKeyDown={e=>{
  if(e.key==='Escape'){e.preventDefault();setToolbar(false);if(message)setMessage(null);else if(panel)setPanel(null);else{stop();setSelected(undefined);setVerb('Walk');}return;}
  if(blocked){if(e.key==='Tab'){const controls=Array.from(modal.current?.querySelectorAll<HTMLElement>('button,[tabindex="0"]')||[]);if(!controls.length){e.preventDefault();return;}const at=controls.indexOf(document.activeElement as HTMLElement);if(e.shiftKey&&(at<=0)){e.preventDefault();controls.at(-1)?.focus();}else if(!e.shiftKey&&(at===controls.length-1||at<0)){e.preventDefault();controls[0]?.focus();}}return;}
  if(/^[1-4]$/.test(e.key)){choose(verbs[Number(e.key)-1]);return;}
  if(e.key==='F10'){e.preventDefault();setToolbar(v=>!v);}if(e.key.toLowerCase()==='i')open('Satchel');if(e.key.toLowerCase()==='h')setReveal(v=>!v);
  if(e.key.startsWith('Arrow')){e.preventDefault();setSelected(undefined);setVerb('Walk');const delta:Record<string,Point>={ArrowLeft:{x:-65,y:0},ArrowRight:{x:65,y:0},ArrowUp:{x:0,y:-35},ArrowDown:{x:0,y:35}};const d=delta[e.key];if(d)walk({x:pos.current.x+d.x,y:pos.current.y+d.y});}
 }}>
 <div className="adventure-frame">
 <header className="adventure-title"><span>Vale Locksmith</span><span>The Shortcut: The Moon Bell</span><time>{timeLabel(s)}</time></header>
 <button className="toolbar-toggle" aria-label="Adventure controls" aria-expanded={toolbar} onClick={()=>setToolbar(v=>!v)}><AdventureIcon name={verb}/><span>{selected?itemNames[selected]:verb}</span></button>
 <nav className={`icon-bar${toolbar?" toolbar-open":""}`} aria-label="Adventure controls">
 <div className="verb-icons">{verbs.map((v,i)=><button key={v} aria-label={`${v} (${i+1})`} title={`${v} · ${i+1}`} aria-pressed={!selected&&verb===v} disabled={blocked} onClick={()=>choose(v)}><AdventureIcon name={v}/><span>{v}</span></button>)}</div>
 <div className="utility-icons">{(['Satchel','Journal','Wait','Menu'] as const).map(p=><button key={p} aria-label={p==='Satchel'?'Satchel (I)':p} title={p} disabled={blocked} onClick={()=>open(p)}><AdventureIcon name={p}/><span>{p}</span></button>)}<button aria-label="Look around (H)" title="Reveal visible objects · H" disabled={blocked} aria-pressed={reveal} onClick={()=>setReveal(v=>!v)}><AdventureIcon name="Reveal"/><span>Reveal</span></button></div>
 </nav>
 <div className={`village-playfield cursor-${selected?'Use':verb}`} aria-busy={walking||performing} style={selected&&['thread','mirror','bottle','cake'].includes(selected)?{cursor:`url(${import.meta.env.BASE_URL}art/cursor-${selected}.png) 16 16, crosshair`}:selected&&selected!=='sun'?{cursor:'crosshair'}:undefined}>
 <Scene s={s} player={position} walking={walking} facing={facing} walkFrame={frame} direction={direction} performing={performing} reveal={reveal} onHover={setHover} onObject={act} onWalk={p=>{if(blocked||performing)return;if(verb==='Walk'&&!selected)walk(p);else say(selected?'Choose a person or object for '+itemNames[selected]+'.':'The rain has left shining cobbles and the scent of wet leaves. Beyond the lane, the river is still running high.','The storyteller');}}/>
 {destination&&<svg className="walk-marker" viewBox="0 0 1000 650" aria-hidden="true"><ellipse cx={destination.x} cy={destination.y+20} rx="9" ry="3"/></svg>}
 {blocked&&<div className="adventure-shade"/>}
 {message&&<section className="story-dialog" role="dialog" aria-modal="true" aria-label={speaker} ref={modal} tabIndex={-1} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setMessage(null);}}}>
 {speaker==='Aldus Reed'&&<div className="dialog-portrait"><svg viewBox="560 0 270 270" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><image href={`${import.meta.env.BASE_URL}art/characters.png`} width="1774" height="887"/></svg></div>}
 <div><h2>{speaker}</h2><p aria-live="polite">{message.replace(/^Aldus Reed: /,'')}</p><button onClick={()=>setMessage(null)}>Continue <span>↵</span></button></div></section>}
 {panel&&<section className={`classic-panel panel-${panel.toLowerCase()}`} ref={modal} tabIndex={-1} role="dialog" aria-modal="true" aria-label={panel}>
 <h2>{panel==='Satchel'?'Mara’s satchel':panel==='Journal'?'A locksmith’s notes':panel==='Wait'?'Let the road breathe':'The Moon Bell'}</h2>
 {panel==='Satchel'&&<><div className="items">{s.inventory.map(id=><button key={id} title={itemDescriptions[id]} aria-label={itemNames[id]} onClick={()=>{setSelected(id);setPanel(null);}}><ItemArt id={id}/><span>{itemNames[id]}</span></button>)}</div><p>Choose an object, then use it on the scene. Escape puts it away.</p><div className="inventory-description">{s.inventory.map(id=><details key={id}><summary>{itemNames[id]}</summary><p>{itemDescriptions[id]}</p></details>)}</div></>}
 {panel==='Journal'&&<><p>Carry the Sun Key to Castle Arden before the ninth evening bell.</p>{s.clues.map(c=><p key={c}>{c}</p>)}<button onClick={()=>{dispatch({type:'hint'});setPanel(null);say(snapshot().message,'A thought');}}>A thought, please</button></>}
 {panel==='Wait'&&<><p>Watch the changing light for a little while.</p>{[1,5,15,30].map(minutes=><button key={minutes} onClick={()=>dispatch({type:'wait',minutes})}>Wait {minutes} {minutes===1?'minute':'minutes'}</button>)}</>}
 {panel==='Menu'&&<><p>Choose a cursor, then click the scene. Mara walks to people and objects before speaking, taking or using.</p><p><b>F10</b> controls · <b>1–4</b> Walk / Look / Hand / Talk · <b>Right click</b> cycles cursors · <b>Arrows</b> walk · <b>I</b> satchel · <b>H</b> reveal · <b>Tab / Enter</b> select objects · <b>Escape</b> close or cancel.</p><button onClick={()=>{root.current?.requestFullscreen().catch(()=>setNotice('Full screen is unavailable in this browser.'));}}>Full screen</button><button onClick={()=>{save();setNotice(saveStatus());}}>Save</button><button onClick={()=>{stop();reload();pos.current=snapshot().player;setPosition(snapshot().player);setSelected(undefined);setNotice(saveStatus());}}>Restore</button><button onClick={()=>{if(confirm('Begin a fresh adventure?')){stop();reset();pos.current=snapshot().player;setPosition(snapshot().player);setPanel(null);setSelected(undefined);setVerb('Walk');say(snapshot().message,'Aldus Reed');}}}>New adventure</button><p role="status">{notice}</p></>}
 <button className="close-panel" onClick={()=>setPanel(null)}>Close</button></section>}
 </div>
 <footer className="adventure-status" aria-live="polite"><span>{performing?'Mara is reaching…':walking?'Mara is walking…':selected?`${command} with${hover?' '+hover:'…'}`:hover?`${verb==='Hand'?'Touch':verb} ${hover}`:`${command} cursor`}</span><span>Right click: change cursor <i>·</i> 1–4 <i>·</i> I: satchel</span></footer>
 </div></main>;
}
