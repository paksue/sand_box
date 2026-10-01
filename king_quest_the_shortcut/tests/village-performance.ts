import {chromium} from 'playwright';
import {expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const server=createServer((req,res)=>{const file=resolve('dist',new URL(req.url!,'http://localhost').pathname.slice(1)||'index.html');if(!file.startsWith(resolve('dist')+'/')||!existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':file.endsWith('.webp')?'image/webp':'text/html');res.end(readFileSync(file));});
await new Promise<void>(r=>server.listen(5175,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||resolve('.qa-browser/chromium'),args:['--no-sandbox']});
const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'}),p=await ctx.newPage(),errors:string[]=[];
p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await p.goto('http://127.0.0.1:5175/?debug');await p.getByRole('button',{name:/Continue/}).click();
await p.screenshot({path:'evidence/village-v2/exploration.png'});
const actor=p.locator('.mara');
await p.locator('.village-game').focus();await p.keyboard.press('ArrowUp');await expect(actor).toHaveAttribute('data-direction','back');await p.screenshot({path:'evidence/village-v2/back-walk.png'});await expect(actor).toHaveAttribute('data-walking','false');
await p.keyboard.press('ArrowDown');await expect(actor).toHaveAttribute('data-direction','front');await expect(actor).toHaveAttribute('data-walking','false');
// Measure opaque artwork through the actual SVG transform, including atlas padding.
async function bodyBounds(){return p.evaluate(async()=>{
 const svg=document.querySelector('.mara svg') as SVGSVGElement,image=svg.querySelector('image')!,loaded=new Image();loaded.src=image.getAttribute('href')!;await loaded.decode();
 const box=svg.viewBox.baseVal,canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d')!;ctx.drawImage(loaded,box.x,box.y,256,256,0,0,256,256);const rgba=ctx.getImageData(0,0,256,256).data;let top=256,bottom=0;
 for(let y=0;y<256;y++)for(let x=0;x<256;x++)if(rgba[(y*256+x)*4+3]>128){top=Math.min(top,y);bottom=Math.max(bottom,y+1);}
 const matrix=svg.getScreenCTM()!,a=new DOMPoint(box.x,box.y+top).matrixTransform(matrix),b=new DOMPoint(box.x,box.y+bottom).matrixTransform(matrix);return {height:b.y-a.y,feet:b.y};
});}
await p.keyboard.press('ArrowRight');await expect(actor).toHaveAttribute('data-direction','side');await expect(actor).toHaveAttribute('data-frame','1');const movingSize=await bodyBounds();await p.screenshot({path:'evidence/village-v2/side-walk.png'});await expect(actor).toHaveAttribute('data-walking','false');const idleSize=await bodyBounds();assert.ok(Math.abs(movingSize.height-idleSize.height)<2,`Mara changes height: ${JSON.stringify({movingSize,idleSize})}`);assert.ok(Math.abs(movingSize.feet-idleSize.feet)<2,'Idle feet move off the walk baseline');
await p.keyboard.press('3');await p.locator('[data-hotspot="thread"]').click();await expect(actor).toHaveAttribute('data-performing','true',{timeout:10000});
await expect(actor).toHaveAttribute('data-frame','1');await p.screenshot({path:'evidence/village-v2/reach.png'});await expect(p.locator('.story-dialog')).toBeVisible();await p.keyboard.press('Escape');
assert.ok(await p.evaluate(()=>JSON.parse(localStorage.getItem('the-shortcut:moon-bell:v2')!).inventory.includes('thread')));
await p.keyboard.press('3');await p.locator('[data-hotspot="bottle"]').click();await p.keyboard.press('Escape');await p.waitForTimeout(1000);assert.equal(await p.locator('.story-dialog').count(),0);assert.ok(!await p.evaluate(()=>JSON.parse(localStorage.getItem('the-shortcut:moon-bell:v2')!).inventory.includes('bottle')));
await p.keyboard.press('i');await expect(p.getByRole('dialog',{name:'Satchel'})).toBeVisible();await p.keyboard.press('Escape');
await p.keyboard.press('F10');await expect(p.locator('.toolbar-open')).toBeVisible();await p.getByRole('button',{name:'Menu',exact:true}).click();await p.getByRole('button',{name:'Save',exact:true}).click();await p.reload();assert.ok(await p.evaluate(()=>JSON.parse(localStorage.getItem('the-shortcut:moon-bell:v2')!).inventory.includes('thread')));
for(const width of [390,768,1920]){await p.setViewportSize({width,height:1080});await p.keyboard.press('Escape');await p.screenshot({path:`evidence/village-v2/layout-${width}.png`});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
assert.deepEqual(errors,[]);writeFileSync('evidence/village-v2/performance-results.json',JSON.stringify({idleWalkSize:{movingSize,idleSize},directionalWalk:true,physicalTake:true,cancel:true,inventory:true,toolbarKeyboard:true,saveReload:true,widths:[390,768,1920],errors},null,2));
await browser.close();server.close();console.log('Village performance QA passed');
