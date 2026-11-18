(function coverCapture(){
"use strict";
const fs=require("node:fs"),path=require("node:path");
const { chromium }=require("playwright");
const sharp=require("sharp");
const ROOT=path.resolve(__dirname,"..");
const catalog=JSON.parse(fs.readFileSync(path.join(ROOT,"catalog","apps.json"),"utf8"));
const targetRoot=path.join(ROOT,"assets","covers","screenshots");
const args=new Set(process.argv.slice(2));
const refresh=args.has("--refresh");
const concurrency=3;
const server="http://127.0.0.1:8765/sand_box/";
const filenames=[];
function locationFromUrl(url){
  const u=new URL(url);
  if(u.hostname!=="paksue.github.io"||!u.pathname.startsWith("/sand_box/"))throw Error("Unexpected external project URL: "+url);
  return server+u.pathname.slice("/sand_box/".length)+u.search;
}
async function capture(browser,app){
 const id=app.id;
 if(!/^[a-z0-9][a-z0-9_-]{0,90}$/i.test(id))throw Error("Invalid app ID: "+id);
 const dest=path.join(targetRoot,id+".webp");
 if(!refresh&&fs.existsSync(dest)&&fs.statSync(dest).size>3000)return {status:"existing",id};
 const page=await browser.newPage({viewport:{width:1320,height:742},deviceScaleFactor:1,reducedMotion:"reduce",javaScriptEnabled:true});
 try{
  page.on("dialog",dialog=>dialog.dismiss());
  const response=await page.goto(locationFromUrl(app.url),{waitUntil:"domcontentloaded",timeout:16000});
  if(!response||response.status()>=400)throw Error("HTTP "+response?.status());
  // Leave time for hydrated React, fonts and small async visualizations.
  await page.waitForTimeout(1600);
  await page.evaluate(()=>document.fonts?.ready).catch(()=>{});
  const substantive=await page.evaluate(()=>{
   const body=document.body;
   if(!body)return false;
   const text=(body.innerText||"").trim().length;
   return text>=20||Boolean(document.querySelector("canvas,video,svg,main,.app"));
  }).catch(()=>false);
  if(!substantive)throw Error("Empty or non-substantive app page");
  let shot;
  try{
    shot=await page.screenshot({type:"jpeg",quality:83,animations:"disabled",timeout:22000});
  }catch(primaryError){
    // WebGL apps can keep Playwright's screenshot-stability wait busy forever.
    // Capture directly from Chrome's rendering pipeline as a fallback.
    const cdp=await page.context().newCDPSession(page);
    try{
      const image=await cdp.send("Page.captureScreenshot",{format:"jpeg",quality:78,captureBeyondViewport:false});
      shot=Buffer.from(image.data,"base64");
    }finally{await cdp.detach().catch(()=>{});}
  }
  const resized=await sharp(shot).resize({width:850,height:478,fit:"cover",position:"attention"}).webp({quality:80,effort:5}).toBuffer();
  const stats=await sharp(resized).stats();
  if(stats.channels.every(c=>c.stdev<5))throw Error("Blank-looking screenshot");
  fs.writeFileSync(dest,resized);
  return {status:"created",id,bytes:resized.length};
 }catch(error){return{status:"failed",id,error:String(error.message||error).slice(0,180)};}
 finally{await page.close().catch(()=>{});}
}
async function main(){
 fs.mkdirSync(targetRoot,{recursive:true});
 const browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader"]});
 const tasks=catalog.apps.filter(a=>a&&a.id&&a.url);
 let cursor=0;const result=[];
 try{
  await Promise.all(Array.from({length:Math.min(concurrency,tasks.length)},async()=>{
   while(cursor<tasks.length){const current=tasks[cursor++];const r=await capture(browser,current);result.push(r);console.log(r.status+": "+r.id+(r.error?" — "+r.error:""));}
  }));
 }finally{await browser.close();}
 const done=result.filter(x=>x.status==="created").length;
 const failed=result.filter(x=>x.status==="failed");
 console.log(JSON.stringify({total:tasks.length,created:done,alreadyCaptured:result.filter(x=>x.status==="existing").length,failed:failed.length,errors:failed},null,2));
 if(done===0&&failed.length===tasks.length)process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exitCode=1});
})();
