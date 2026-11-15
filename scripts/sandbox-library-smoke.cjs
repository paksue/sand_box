(function smoke(){
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),{URL}=require("node:url");
const ROOT=path.resolve(__dirname,"..");
const catalog=JSON.parse(fs.readFileSync(path.join(ROOT,"catalog/apps.json"),"utf8"));
const source=fs.readFileSync(path.join(ROOT,"assets/sandbox.js"),"utf8");
function mock(){
 const nodes=new Map(),listeners={};
 const get=id=>{if(!nodes.has(id))nodes.set(id,{
   id,innerHTML:"",textContent:"",value:id==="sortSelect"?"featured":"",hidden:false,open:false,
   dataset:{},listeners:{},classList:{toggle(){},add(){},remove(){}},
   addEventListener(k,fn){this.listeners[k]=fn},setAttribute(){},removeAttribute(){},
   scrollIntoView(){},querySelector(){return null},showModal(){this.open=true},close(){this.open=false}
 });return nodes.get(id);};
 const document={getElementById:get,querySelectorAll(){return[]},addEventListener(k,fn){listeners[k]=fn},activeElement:null};
 const localStorage={values:new Map(),getItem(k){return this.values.get(k)??null},setItem(k,v){this.values.set(k,v)}};
 const window={innerWidth:1200,open(){},Fuse:undefined};
 const fetch=async u=>{if(String(u).startsWith("./catalog/"))return{ok:true,json:async()=>catalog};throw new Error("Offline CI smoke test");};
 vm.runInNewContext(source,{document,window,localStorage,fetch,setTimeout:()=>1,clearTimeout:()=>{},URL});
 return {get,listeners,localStorage};
}
async function test(){
 assert.ok(Array.isArray(catalog.apps)&&catalog.apps.length>20,"Catalog should contain existing projects");
 assert.equal(new Set(catalog.apps.map(x=>x.id)).size,catalog.apps.length,"Duplicate project IDs");
 assert.equal(new Set(catalog.apps.map(x=>x.url)).size,catalog.apps.length,"Duplicate launch URLs");
 assert.ok(!catalog.apps.some(x=>x.id==="food_guide"),"Exclude empty placeholder HTML");
 assert.ok(catalog.apps.some(x=>x.id==="college-sat-act-planner"),"SAT planner missing");
 assert.ok(catalog.apps.some(x=>x.id==="midnight-japanese-studio"),"Japanese studio missing");
 const compiled=catalog.apps.find(x=>x.id==="tag-arena");
 assert.ok(compiled.url.includes("/previews/tag-arena/"),"Compiled app must link to preview");
 const page=mock();
 for(let i=0;i<30;i++)await Promise.resolve();
 const first=page.get("projectGrid").innerHTML;
 assert.ok(first.includes("Midnight Japanese"),"Initial catalog should render");
 assert.equal((first.match(/<article/g)||[]).length,catalog.apps.length,"App cards missing");
 const search=page.get("searchInput");
 search.listeners.input({target:{value:"Midnight Japanese"}});
 const filtered=page.get("projectGrid").innerHTML;
 assert.ok(filtered.includes("Midnight Japanese"),"Search lost requested app");
 assert.ok(!filtered.includes("Harran Field Manual"),"Search did not filter");
 search.listeners.input({target:{value:""}});
 page.listeners.click({target:{closest:s=>s==="[data-fav]"?{dataset:{fav:"midnight-japanese-studio"}}:null}});
 assert.equal(page.get("statFavorites").textContent,1,"Favorite count not updated");
 assert.ok(page.localStorage.values.get("sandbox:library:v1:favorites").includes("midnight-japanese-studio"),"Favorites not persisted");
 console.log("SandBox smoke tests passed: catalog, preview routing, rendering, search and favorites.");
}
test().catch(err=>{console.error(err);process.exitCode=1});
})();
