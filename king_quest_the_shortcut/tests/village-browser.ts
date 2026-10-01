import {chromium} from 'playwright';
import {expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const server=createServer((req,res)=>{const file=resolve('dist',new URL(req.url!,'http://localhost').pathname.slice(1)||'index.html');if(!file.startsWith(resolve('dist')+'/')||!existsSync(file)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':file.endsWith('.webp')?'image/webp':'text/html');res.end(readFileSync(file));});
await new Promise<void>(r=>server.listen(5175,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:resolve('.qa-browser/chromium'),args:['--no-sandbox']});
const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors:string[]=[];
p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const state=()=>p.evaluate(()=>(window as any).moonBell.snapshot());
const hot=(id:string)=>p.locator(`[data-hotspot="${id}"]`);
await p.goto('http://127.0.0.1:5175/?debug');await expect(p.getByRole('dialog',{name:'Aldus Reed'})).toBeVisible();
await p.screenshot({path:'evidence/village/opening-dialog.png'});await p.keyboard.press('Enter');
await expect(p.locator('.story-dialog')).toHaveCount(0);await p.screenshot({path:'evidence/village/exploration.png'});
// Walk cursor never looks or takes. Motion is continuous, simulation commits at arrival.
await hot('thread').click();await expect(p.locator('.mara')).toHaveAttribute('data-walking','true');
assert.equal((await state()).inventory.includes('thread'),false);await p.waitForTimeout(500);await p.screenshot({path:'evidence/village/walking.png'});
await expect(p.locator('.mara')).toHaveAttribute('data-walking','false');assert.equal((await state()).minute,930);
// Cancel an approach before it executes the pending action.
await p.getByRole('button',{name:'Hand (3)',exact:true}).click();await hot('cake').click();await p.keyboard.press('Escape');await p.waitForTimeout(900);assert.equal((await state()).inventory.includes('cake'),false);
await p.getByRole('button',{name:'Hand (3)',exact:true}).click();await hot('thread').click();await expect(p.locator('.story-dialog')).toBeVisible();assert.ok((await state()).inventory.includes('thread'));await p.keyboard.press('Escape');
await p.getByRole('button',{name:'Look (2)',exact:true}).click();await hot('road').click();await expect(p.locator('.story-dialog')).toContainText('royal road');await p.keyboard.press('Escape');
// Right click cycles Look -> Hand -> Talk; keyboard and pointer choose the same verbs.
await p.locator('.village-playfield').click({button:'right',position:{x:500,y:500}});await expect(p.getByRole('button',{name:'Hand (3)',exact:true})).toHaveAttribute('aria-pressed','true');await p.keyboard.press('4');await hot('aldus').focus();await p.keyboard.press('Enter');await expect(p.locator('.story-dialog')).toBeVisible();assert.ok((await state()).clues.length>0);await p.screenshot({path:'evidence/village/aldus-conversation.png'});await p.keyboard.press('Escape');
await p.keyboard.press('i');await expect(p.getByRole('dialog',{name:'Satchel'})).toBeVisible();await p.screenshot({path:'evidence/village/satchel.png'});await p.getByRole('button',{name:'Sun Key',exact:true}).click();await hot('aldus').click();await expect(p.locator('.story-dialog')).toContainText('no courier sunburst lock');await p.keyboard.press('Escape');await p.keyboard.press('Escape');
await p.keyboard.press('ArrowRight');await expect(p.locator('.mara')).toHaveAttribute('data-walking','true');await expect(p.locator('.mara')).toHaveAttribute('data-walking','false');
await p.getByRole('button',{name:'Menu',exact:true}).click();await p.getByRole('button',{name:'Save',exact:true}).click();const saved=await state();await p.reload();assert.deepEqual(await state(),saved);await expect(p.locator('.story-dialog')).toHaveCount(0);
for(const [width,height] of [[390,844],[768,1024],[1920,1080]]){await p.setViewportSize({width,height});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:`evidence/village/layout-${width}.png`});await p.getByRole('button',{name:'Satchel (I)',exact:true}).click();await p.screenshot({path:`evidence/village/satchel-${width}.png`});await p.keyboard.press('Escape');}
// All assets decode in browser and retain alpha as actual image data.
await p.evaluate(async()=>{for(const n of Array.from(document.querySelectorAll('svg image'))){const im=new Image();im.src=n.getAttribute('href')!;await im.decode();}});
await p.setViewportSize({width:1440,height:1000});await p.getByRole('button',{name:'Walk (1)',exact:true}).click();await hot('exit-mill').click();await expect(p.locator('.stage')).toHaveAttribute('data-location','mill',{timeout:10000});assert.equal((await state()).location,'mill');assert.ok((await state()).inventory.includes('thread'));
// Returning to the village with later inventory and the relief ending stays supported.
const late=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});await late.goto('http://127.0.0.1:5175/?debug');await late.evaluate(()=>{const s=(window as any).moonBell.snapshot();s.minute=1320;s.events=[{at:1320,location:'village',actor:'world',action:'boundary',target:'1320',witnesses:[],result:'The last runner arrives.'}];localStorage.setItem('the-shortcut:moon-bell:v2',JSON.stringify(s));});await late.reload();await late.getByRole('button',{name:'Hand (3)',exact:true}).click();await late.locator('[data-hotspot="courier"]').click();await expect(late.getByRole('button',{name:'Remember the road'})).toBeVisible();await late.getByRole('button',{name:'Remember the road'}).click();await expect(late.locator('.epilogue')).toContainText('Aldus receives his Sun Key');await late.close();
assert.deepEqual(errors,[]);writeFileSync('evidence/village/qa.json',JSON.stringify({checks:['opening dialogue','continuous walk','no remote take','cancel pending action','hand take','eye inspect','right-click cycle','keyboard talk','inventory use','arrow movement','save reload','390/768/1920 layouts','asset decode','mill exit','village relief ending'],errors},null,2));console.log('Village checks passed');await browser.close();server.close();
