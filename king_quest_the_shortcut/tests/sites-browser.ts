import {chromium, type Page} from 'playwright';
import {expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFileSync,readFileSync,existsSync} from 'node:fs';
import {createServer} from 'node:http';
import {resolve} from 'node:path';
import {routes} from './routes';
import {initialState, SAVE_KEY,serialize,type State} from '../src/simulation/game';
const server=createServer((req,res)=>{const path=resolve('dist',decodeURIComponent(new URL(req.url!,'http://localhost').pathname).slice(1)||'index.html');if(!path.startsWith(resolve('dist')+'/')||!existsSync(path)){res.writeHead(404);res.end();return;}const type=path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.webp')?'image/webp':'text/html';res.setHeader('Content-Type',type);res.end(readFileSync(path));});
if(!process.env.SITE_URL)await new Promise<void>(r=>server.listen(5174,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||resolve('.qa-browser/chromium'),args:['--no-sandbox']});
const base=process.env.SITE_URL||'http://127.0.0.1:5174/';
const errors:string[]=[],results:any[]=[];
async function state(p:Page):Promise<State>{return p.evaluate(()=>JSON.parse(localStorage.getItem('the-shortcut:moon-bell:v2')||'null'));}
async function boot(p:Page,s=initialState()) {await p.goto(base+'?debug');await p.evaluate(({key,raw})=>{(window as any).moonBell.replace(JSON.parse(raw));localStorage.setItem(key,raw);},{key:SAVE_KEY,raw:serialize(s)});await p.reload();await p.locator('.painted-plate').waitFor();}
async function activate(p:Page,id:string,keyboard=false){const h=p.locator(`[data-hotspot="${id}"]`);await h.waitFor();if(keyboard){await h.focus();await p.keyboard.press('Enter');}else await h.click();}
async function escape(p:Page){await p.keyboard.press('Escape');}
async function waitUntil(p:Page,minute:number){await escape(p);await p.getByRole('button',{name:'Wait',exact:true}).click();while((await state(p)).minute<minute){const left=minute-(await state(p)).minute;const step=[30,15,5,1].find(x=>x<=left)!;await p.getByRole('button',{name:`Wait ${step} ${step===1?'minute':'minutes'}`,exact:true}).click();}await escape(p);}
for(const [name,steps] of Object.entries(routes).filter(()=>!process.env.LAYOUT_ONLY)){
 const c=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const p=await c.newPage();p.on('pageerror',e=>errors.push(name+': '+e.message));p.on('console',m=>{if(m.type()==='error')errors.push(name+': '+m.text());});await boot(p);
 const visited=new Set<string>();
 for(const step of steps){await escape(p);let s=await state(p);
  if(!visited.has(s.location)){visited.add(s.location);await p.screenshot({path:`evidence/sites/${name.toLowerCase()}-${s.location}.png`});}
  if(step.type==='until'){await waitUntil(p,step.minute);continue;}
  if(step.type==='travel'){if(s.location==='village')await p.getByRole('button',{name:'Walk (1)',exact:true}).click();await activate(p,'exit-'+step.to);if(s.location==='village')await expect(p.locator('.village-game')).toHaveCount(0);continue;}
  if(step.type!=='interact')continue;
  if(step.id==='ysabet'&&!await p.locator('[data-hotspot="ysabet"]').count())await waitUntil(p,1080);
  const keyboard=name==='Minimal';
  if(step.verb==='Use'){
   await p.getByRole('button',{name:/Satchel/}).click();const item=p.locator('.items button').filter({hasText:({'sun':'Sun Key','thread':'Red thread','mirror':'Brass mirror','bottle':'Blue bottle','cake':'Honey cake','lantern':'True-Path Lantern','glowjar':'Glowjar','disc':'Moon-disc','water':'Moonwater','charm':'Bridge charm','rope':'Rope scrap','hen':'Mallow','key':'Brass gate key'} as Record<string,string>)[step.item!]});
   if(keyboard){await item.focus();await p.keyboard.press('Enter');}else await item.click();await activate(p,step.id,keyboard);
  } else if(s.location==='village'){await p.getByRole('button',{name:step.verb==='Look'?'Look (2)':step.verb==='Talk'?'Talk (4)':'Hand (3)',exact:true}).click();await activate(p,step.id,keyboard);await expect(p.locator('.story-dialog')).toBeVisible();} else {await activate(p,step.id,keyboard);if(step.verb!=='Look'){const b=p.locator('.context').getByRole('button',{name:step.verb,exact:true});if(keyboard){await b.focus();await p.keyboard.press('Enter');}else await b.click();}}
 }
 let s=await state(p);if(!s.finished&&s.flags['rope-damaged']){await escape(p);await activate(p,'rope');await p.locator('.context').getByRole('button',{name:'Tie',exact:true}).click();await p.locator('.context').getByRole('button',{name:'Pull',exact:true}).click();s=await state(p);}
 assert.equal(s.finished,true,`${name}: ${s.location} ${s.minute} ${s.message}`);assert.ok(s.flags['bell-rung']);await escape(p);await p.getByRole('button',{name:'Remember the road'}).click();await p.screenshot({path:`evidence/sites/${name.toLowerCase()}-epilogue.png`});
 await p.reload();assert.deepEqual(await state(p),s);results.push({route:name,finished:s.finished,minute:s.minute,visited:[...visited],input:name==='Minimal'?'keyboard':'pointer',flags:s.flags,memories:s.memories});await c.close();
}
// Boundary fixtures are separate from the four normal UI routes above.
const c=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),p=await c.newPage();
if(!process.env.LAYOUT_ONLY){
p.on('pageerror',e=>errors.push('boundaries: '+e.message));
for(const [location,minute,target,present] of [['cottage',1049,'ysabet',false],['cottage',1079,'ysabet',true],['castle',1259,'sella',false]] as const){const s=initialState();s.location=location;s.minute=minute;await boot(p,s);await waitUntil(p,minute+1);await expect(p.locator(`[data-hotspot="${target}"]`)).toHaveCount(present?1:0);const before=await state(p);await p.reload();assert.deepEqual(await state(p),before);results.push({boundary:`${location}:${minute+1}`,saveReload:true});}
for(const minute of [1109,1110,1154,1155,1260,1295]){const s=initialState();s.location=minute>=1260?'tower':minute>=1154?'bridge':'moonwell';s.minute=minute;await boot(p,s);await waitUntil(p,minute+1);const before=await state(p);await p.reload();assert.deepEqual(await state(p),before);if(s.location==='bridge')await expect(p.locator('.keeper')).toHaveCount(minute+1>=1155?1:0);results.push({boundary:`${s.location}:${minute+1}`,saveReload:true});}
// Every painting plus changing palette, registered targets, and all three responsive sizes.
for(const location of ['village','mill','crossroads','cottage','chapel','hollow','moonwell','bridge','castle','tower'] as const){const s=initialState();s.location=location;s.minute=1141;await boot(p,s);await p.screenshot({path:`evidence/sites/night-${location}.png`});await p.evaluate(async()=>{await Promise.all(Array.from(document.querySelectorAll('svg image')).map(async node=>{const url=node.getAttribute('href')!;const image=new Image();image.src=url;await image.decode();if(!image.naturalWidth)throw Error('Undecodable '+url);}));});const resource=await p.locator('.painted-plate').getAttribute('href');assert.ok(resource?.endsWith(location+'.webp'));await escape(p);await p.getByRole('button',{name:/Look around/}).click();assert.ok(await p.locator('.scene-objects button').count()>0);await p.screenshot({path:`evidence/sites/anchors-${location}.png`});}
}
for(const [width,height] of [[390,844],[768,1024],[1920,1080]]){await p.setViewportSize({width,height});await boot(p);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await escape(p);await p.getByRole('button',{name:/Look around/}).click();await p.screenshot({path:`evidence/sites/layout-${width}.png`});await p.getByRole('button',{name:'Hand (3)',exact:true}).click();await p.locator('.scene-objects').getByRole('button',{name:'Red thread',exact:true}).click();await expect(p.locator('.story-dialog')).toBeVisible();assert.ok((await state(p)).inventory.includes('thread'));await escape(p);await p.getByRole('button',{name:'Menu',exact:true}).click();await p.getByRole('button',{name:'Save',exact:true}).click();await p.reload();assert.ok((await state(p)).inventory.includes('thread'));results.push({viewport:`${width}x${height}`,overflow:false,pointer:true,saveReload:true});}
await c.close();assert.deepEqual(errors,[]);writeFileSync(process.env.LAYOUT_ONLY?'evidence/sites/layout-results.json':'evidence/sites/browser-results.json',JSON.stringify({results,errors},null,2));console.log(JSON.stringify({checks:results.length,routes:results.slice(0,4).map(r=>({route:r.route,finished:r.finished,minute:r.minute})),errors},null,2));await browser.close();server.close();
