(function sandboxMain(){
"use strict";
const BASE="https://paksue.github.io/sand_box/";
const RAW_CATALOG="https://raw.githubusercontent.com/paksue/sand_box/main/catalog/apps.json";
const GITHUB_TREE="https://api.github.com/repos/paksue/sand_box/git/trees/main?recursive=1";
const LS_PREFIX="sandbox:library:v1:";
const COVER_BASE="https://raw.githubusercontent.com/paksue/sand_box/main/assets/covers/";
const CURATED_COVERS=new Set(["college-sat-act-planner","deep-current-3d","dying-light-survivor-handbook","midnight-japanese-studio","ai-concepts-explorer","camera-safety-notifier","cochrane-integrity-atlas","frontier-journey","reality-check","worldtap-next","study-desk-studio","price-of-tomorrow","snowpro-recall","murder-investigation","night-signal","read-the-room","trip_guide","the-rule","tag-arena","watchdeck","rc-explorer","the-shortcut","the-forge-movie","glow-gut-journal","human-nature-lab","foot-movement-atlas","ma-firearm-training","chatgpt-pages-qa","frontier-painted-sprite-lab","trello-vault","isometric-timer","sci-fi-writing","todo","worldtap","spy-novel-library","nyc-day-planner","hunger-review","dnd-miniature-web-poc","deep-current","frontier-production-spine-hero","food_guide","college-grade-growth","hanover-ballot-2026","insanity-defense-responsibility","political-violence-audit","riemann-ai-explainer","salem-halloween"]);
const CATEGORIES=[
  {id:"learning",name:"Education",glyph:"▤"},
  {id:"games",name:"Games & Worlds",glyph:"♧"},
  {id:"tools",name:"Tools & Productivity",glyph:"⌘"},
  {id:"research",name:"Research & Ideas",glyph:"◇"},
  {id:"wellness",name:"Health & Fitness",glyph:"✳"},
  {id:"creative",name:"Creative Studio",glyph:"✦"},
  {id:"travel",name:"Travel & Places",glyph:"⌖"},
  {id:"other",name:"Other Projects",glyph:"▦"}
];
const PALETTES={
  lime:["#243f42","#a3ca73","#163b3b"],teal:["#092f39","#409c8e","#134d53"],
  ocean:["#0b2038","#276c9c","#0c4a62"],blue:["#22355f","#699fc6","#284c68"],
  mint:["#154d49","#64bb99","#26645a"],violet:["#241b44","#826abf","#42316b"],
  orchid:["#43234f","#bd82bf","#664572"],orange:["#5c3429","#db9665","#88543f"],
  ember:["#442c23","#c76d49","#704132"],sand:["#51452f","#b8a17a","#75664e"],
  forest:["#213d31","#6b9f7d","#345c42"],slate:["#273a46","#829aa1","#3f5361"],
  ink:["#18222f","#7a8896","#313e4e"]
};
const $=id=>document.getElementById(id);
const nodes={
  grid:$("projectGrid"),empty:$("emptyState"),search:$("searchInput"),
  filters:$("filterChips"),sideCategories:$("sideCategories"),sort:$("sortSelect"),
  dialog:$("detailDialog"),dialogContent:$("detailContent")
};
const state={
  all:[],view:"all",category:"all",query:"",sort:readStorage("sort","featured"),
  display:readStorage("display","grid"),favorites:new Set(asArray(readStorage("favorites",[]))),
  history:asArray(readStorage("history",[])),notes:readStorage("notes",{})||{},
  source:"loading",searchEngine:null
};
let toastTimeout=null;
const safeString=v=>typeof v==="string"?v:"";
function asArray(v){return Array.isArray(v)?v:[];}
function readStorage(key,fallback){try{const s=localStorage.getItem(LS_PREFIX+key);return s===null?fallback:JSON.parse(s);}catch(_){return fallback;}}
function writeStorage(key,value){try{localStorage.setItem(LS_PREFIX+key,JSON.stringify(value));}catch(_){}}
function esc(v){return String(v===undefined||v===null?"":v).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[s]));}
function humanize(id){return id.replace(/[-_]/g," ").replace(/\b\w/g,c=>c.toUpperCase());}
function projectURL(path){return BASE+String(path||"").split("/").filter(Boolean).map(encodeURIComponent).join("/")+"/";}
function safeLink(u,kind){
  try{const url=new URL(u);if(url.protocol!=="https:")return"#";
    if(kind==="repo")return url.hostname==="github.com" && url.pathname.startsWith("/paksue/sand_box")?url.href:"#";
    return url.hostname==="paksue.github.io" && url.pathname.startsWith("/sand_box/")?url.href:"#";
  }catch(_){return"#";}
}
function getCategory(id){return CATEGORIES.find(c=>c.id===id)||CATEGORIES[CATEGORIES.length-1];}
function palette(project){const p=PALETTES[project.theme]||PALETTES.slate;return"--cover-a:"+p[0]+";--cover-b:"+p[1]+";--cover-c:"+p[2]+";";}
function normalize(project){
  if(!project||!/^[a-z0-9][a-z0-9_-]{0,90}$/i.test(project.id||""))return null;
  const id=String(project.id),url=safeLink(project.url);
  if(url==="#")return null;
  const variants=asArray(project.variants).filter(v=>safeLink(v.url)!=="#")
    .map(v=>({label:safeString(v.label)||"Alternate version",url:safeLink(v.url),kind:safeString(v.kind)}));
  return {
    id,title:safeString(project.title)||humanize(id),
    description:safeString(project.description)||"Explore this SandBox project.",
    category:getCategory(project.category).id,tags:asArray(project.tags).filter(x=>typeof x==="string").slice(0,12),
    glyph:safeString(project.glyph)||"✳",theme:safeString(project.theme)||"slate",
    url,source:safeLink(project.source,"repo"),kind:project.kind==="preview"?"preview":"app",
    variants,featured:Boolean(project.featured),updatedAt:safeString(project.updatedAt)
  };
}
function upsertCatalog(incoming){
  if(!Array.isArray(incoming))return 0;
  const map=new Map(state.all.map(x=>[x.id,x]));
  for(const item of incoming){const p=normalize(item);if(p)map.set(p.id,{...(map.get(p.id)||{}),...p});}
  state.all=Array.from(map.values());
  buildFuse();render();
  return state.all.length;
}
function buildFuse(){
  state.searchEngine=(typeof window.Fuse==="function")?new window.Fuse(state.all,{keys:[{name:"title",weight:0.42},{name:"description",weight:0.19},{name:"tags",weight:0.25},{name:"id",weight:0.14}],threshold:0.38,distance:70,ignoreLocation:true,includeScore:true}):null;
}
function matchesQuery(){
  const q=state.query.trim();if(!q)return state.all.slice();
  if(state.searchEngine)return state.searchEngine.search(q).map(match=>match.item);
  const terms=q.toLowerCase().split(/\s+/).filter(Boolean);
  return state.all.filter(p=>terms.every(t=>([p.title,p.description,p.id,...p.tags].join(" ").toLowerCase().includes(t))));
}
function lastOpened(id){const h=state.history.find(x=>x&&x.id===id);return h?Number(h.time)||0:0;}
function filteredProjects(){
  let items=matchesQuery();
  if(state.view==="favorites")items=items.filter(x=>state.favorites.has(x.id));
  if(state.view==="recent")items=items.filter(x=>lastOpened(x.id)>0);
  if(state.category!=="all")items=items.filter(x=>x.category===state.category);
  const byName=(a,b)=>a.title.localeCompare(b.title);
  if(state.sort==="recent"||state.view==="recent")items.sort((a,b)=>lastOpened(b.id)-lastOpened(a.id)||byName(a,b));
  else if(state.sort==="name")items.sort(byName);
  else if(state.sort==="updated")items.sort((a,b)=>(Date.parse(b.updatedAt)||0)-(Date.parse(a.updatedAt)||0)||byName(a,b));
  else items.sort((a,b)=>Number(b.featured)-Number(a.featured)||byName(a,b));
  return items;
}
function countCategories(){return new Set(state.all.map(x=>x.category)).size;}
function iconText(item){return esc(item.glyph).slice(0,20);}
function coverImage(p){const id=encodeURIComponent(p.id),shot=COVER_BASE+"screenshots/"+id+".webp";const first=CURATED_COVERS.has(p.id)?COVER_BASE+"curated/"+id+".webp":shot;return `<img class="cover-photo" data-cover="${esc(p.id)}" src="${esc(first)}" data-fallback="${esc(first===shot?"":shot)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;}
function cardTemplate(p,i){
  const f=state.favorites.has(p.id),cat=getCategory(p.category);
  const badges=p.tags.slice(0,2).map(t=>'<span class="card-tag">'+esc(t)+'</span>').join("");
  const url=esc(p.url),id=esc(p.id),title=esc(p.title);
  return `<article class="project-card" data-project="${id}">
   <div class="card-cover" style="${palette(p)}">
    ${coverImage(p)}
    <span class="cover-number">SANDBOX / ${String(i+1).padStart(3,"0")}</span>
    <span class="cover-corner">${p.kind==="preview"?"PREVIEW":"PROJECT"}</span>
    <span class="cover-wordmark">${title.toUpperCase()}</span>
    <button class="favorite-btn ${f?"is-favorite":""}" type="button" data-fav="${id}" aria-label="${f?"Remove from":"Add to"} favorites: ${title}" aria-pressed="${f}">${f?"★":"☆"}</button>
   </div>
   <div class="card-info">
    <div class="card-category"><span class="card-category-dot"></span>${esc(cat.name)}</div>
    <h3><a href="${url}" target="_blank" rel="noopener noreferrer" data-launch="${id}">${title}</a></h3>
    <p class="card-description">${esc(p.description)}</p>
    <div class="card-tags">${badges}</div>
    <div class="card-bottom"><a class="card-open" href="${url}" target="_blank" rel="noopener noreferrer" data-launch="${id}">Launch app <span aria-hidden="true">↗</span></a>
     <button class="card-more" type="button" data-details="${id}" aria-label="Details about ${title}">Details ···</button></div>
   </div></article>`;
}
function renderNav(){
  const counts=Object.fromEntries(CATEGORIES.map(c=>[c.id,state.all.filter(p=>p.category===c.id).length]));
  $("navAllCount").textContent=state.all.length;
  $("navFavCount").textContent=state.favorites.size;
  $("statApps").textContent=state.all.length;
  $("statCategories").textContent=countCategories();
  $("statFavorites").textContent=state.favorites.size;
  document.querySelectorAll("[data-view]").forEach(el=>{
    const selected=el.dataset.view===state.view && state.category==="all";
    el.classList.toggle("is-active",selected);if(selected)el.setAttribute("aria-current","page");else el.removeAttribute("aria-current");
  });
  nodes.sideCategories.innerHTML=CATEGORIES.filter(c=>counts[c.id]).map(c=>`<button type="button" class="side-link ${state.category===c.id?"is-active":""}" data-category="${esc(c.id)}"><span class="side-ico">${c.glyph}</span><span>${esc(c.name)}</span><span class="side-count">${counts[c.id]}</span></button>`).join("");
  nodes.filters.innerHTML=['<button type="button" class="filter-chip '+(state.category==="all"?"is-active":"")+'" data-category="all">All <span class="chip-count">'+state.all.length+'</span></button>']
  .concat(CATEGORIES.filter(c=>counts[c.id]).map(c=>'<button type="button" class="filter-chip '+(state.category===c.id?"is-active":"")+'" data-category="'+esc(c.id)+'">'+esc(c.name)+' <span class="chip-count">'+counts[c.id]+'</span></button>')).join("");
}
function render(){
  renderNav();
  const arr=filteredProjects();
  nodes.grid.classList.toggle("list-view",state.display==="list");
  $("gridButton").classList.toggle("is-active",state.display==="grid");
  $("listButton").classList.toggle("is-active",state.display==="list");
  $("gridButton").setAttribute("aria-pressed",String(state.display==="grid"));
  $("listButton").setAttribute("aria-pressed",String(state.display==="list"));
  if(nodes.sort.value!==state.sort)nodes.sort.value=state.sort;
  $("resultCount").textContent=arr.length+" "+(arr.length===1?"project":"projects")+" found";
  $("clearButton").hidden=state.query===""&&state.category==="all"&&state.view==="all";
  const subtitles={all:"Everything you've created, organized and ready to launch.",favorites:"The projects you've saved for quick access.",recent:"Projects you've opened through this library."};
  $("sectionSubtitle").textContent=subtitles[state.view]||subtitles.all;
  $("libraryHeading").textContent=state.view==="favorites"?"Your favorites.":state.view==="recent"?"Recently opened.":"Explore your projects.";
  nodes.grid.innerHTML=arr.map(cardTemplate).join("");
  nodes.grid.setAttribute("aria-busy","false");
  nodes.empty.hidden=arr.length>0||state.source==="loading";
  if(!arr.length&&state.source!=="loading"){
    if(state.view==="favorites"&&!state.query){$("emptyGlyph").textContent="☆";$("emptyTitle").textContent="No favorites yet";$("emptyText").textContent="Tap the star on an app to save it here.";}
    else if(state.view==="recent"&&!state.query){$("emptyGlyph").textContent="◷";$("emptyTitle").textContent="Nothing opened yet";$("emptyText").textContent="Launch an app from here to add it to your history.";}
    else{$("emptyGlyph").textContent="⌕";$("emptyTitle").textContent="No matching projects";$("emptyText").textContent="Try a different search or clear your filters.";}
  }
}
function setView(view){
  state.view=view;state.category="all";render();
  if(window.innerWidth<750)$("library").scrollIntoView({behavior:"smooth"});
}
function setCategory(category){
  state.category=category;state.view="all";render();
}
function resetAll(){
  state.view="all";state.category="all";state.query="";nodes.search.value="";state.sort="featured";render();
}
function toast(msg){
  const el=$("toast");el.textContent=msg;el.classList.add("is-visible");
  if(toastTimeout)clearTimeout(toastTimeout);
  toastTimeout=setTimeout(()=>el.classList.remove("is-visible"),2300);
}
function toggleFavorite(id){
  const project=state.all.find(p=>p.id===id);if(!project)return;
  if(state.favorites.has(id)){state.favorites.delete(id);toast("Removed from favorites");}
  else{state.favorites.add(id);toast("Added to favorites");}
  writeStorage("favorites",Array.from(state.favorites));render();
}
function trackLaunch(id){
  if(!state.all.some(p=>p.id===id))return;
  state.history=[{id,time:Date.now()},...state.history.filter(x=>x&&x.id!==id)].slice(0,80);
  writeStorage("history",state.history);
  if(state.view==="recent"||state.sort==="recent")render();
}
function dialogTemplate(p){
  const variants=p.variants.map(v=>`<div class="variant-row"><span>${esc(v.label)}</span><a target="_blank" rel="noopener noreferrer" data-launch="${esc(p.id)}" href="${esc(v.url)}">Open ↗</a></div>`).join("");
  const fav=state.favorites.has(p.id);
  return `<div class="detail-art" style="${palette(p)}">${coverImage(p)}</div>
  <div class="detail-body"><div class="detail-kicker">${esc(getCategory(p.category).name)} / ${p.kind==="preview"?"COMPILED PREVIEW":"GITHUB PAGES PROJECT"}</div>
  <h2 id="detailTitle">${esc(p.title)}</h2><p>${esc(p.description)}</p>
  <div class="detail-tags">${p.tags.map(t=>'<span>'+esc(t)+'</span>').join("")}</div>
  <div class="detail-actions"><a class="detail-primary" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" data-launch="${esc(p.id)}">Open project ↗</a>
  ${p.source==="#"?"":'<a class="detail-secondary" href="'+esc(p.source)+'" target="_blank" rel="noopener noreferrer">View source ↗</a>'}
  <button class="detail-secondary" type="button" data-fav="${esc(p.id)}">${fav?"★ Favorited":"☆ Add favorite"}</button></div>
  ${variants?'<div class="detail-subhead">OTHER VERSIONS</div>'+variants:""}
  <label class="detail-note-label" for="projectNote">Your notes</label><textarea class="detail-note" id="projectNote" placeholder="Why did you make this? What should you try next?">${esc(safeString(state.notes[p.id]))}</textarea>
  <div class="detail-note-hint">Notes stay in this browser. They are not committed to GitHub or synchronized across devices.</div></div>`;
}
function openDetails(id){
  const p=state.all.find(x=>x.id===id);if(!p)return;
  $("detailCounter").textContent=String(state.all.indexOf(p)+1).padStart(3,"0");
  nodes.dialogContent.innerHTML=dialogTemplate(p);
  nodes.dialog.dataset.project=id;
  if(typeof nodes.dialog.showModal==="function")nodes.dialog.showModal();else nodes.dialog.setAttribute("open","");
  const note=$("projectNote");
  if(note)note.addEventListener("input",()=>{
    if(!state.notes||typeof state.notes!=="object"||Array.isArray(state.notes))state.notes={};
    state.notes[id]=note.value;writeStorage("notes",state.notes);
  });
}
function markSync(label,kind){
  $("syncLabel").textContent=label;
  $("syncDot").classList.toggle("is-live",kind==="live");
  $("syncDot").classList.toggle("is-cached",kind==="cached");
}
function parseTreePaths(tree){
  if(!tree||!Array.isArray(tree.tree)||tree.truncated)return null;
  const aliases={"sat-planner-2026-27":"college-sat-act-planner"};
  const groups=new Map();
  for(const entry of tree.tree){
    if(entry.type!=="blob"||typeof entry.path!=="string"||entry.size===0)continue;
    const parts=entry.path.split("/");
    if(parts[parts.length-1]!=="index.html")continue;
    let id=null,entryPath=null,kind="app";
    if(parts.length===2&&!["assets","catalog","scripts","skills","previews","tests"].includes(parts[0])){
      id=parts[0];entryPath=parts[0]+"/";
    }else if(parts.length===3&&parts[0]==="previews"){
      id=aliases[parts[1]]||parts[1];entryPath="previews/"+parts[1]+"/";kind="preview";
    }else if(parts.length===3&&parts[0]==="camera-safety-notifier"&&parts[1]==="client"){
      id="camera-safety-notifier";entryPath="camera-safety-notifier/client/";
    }
    if(!id||id==="king_quest_the_shortcut"||!/^[a-z0-9][a-z0-9_-]*$/i.test(id))continue;
    if(!groups.has(id))groups.set(id,[]);
    groups.get(id).push({entryPath,kind});
  }
  const existing=new Map(state.all.map(p=>[p.id,p]));
  const generated=[];
  for(const [id,paths] of groups){
    const current=existing.get(id);
    const preferred=paths.find(x=>x.kind==="preview"&&!x.entryPath.includes("sat-planner-2026-27"))||paths.find(x=>x.kind==="app")||paths[0];
    const main= current?current.url:projectURL(preferred.entryPath);
    const variants=paths.map(x=>({label:(x.kind==="preview"?"Compiled preview":"Source entry"),url:projectURL(x.entryPath),kind:x.kind}))
      .filter(x=>x.url!==main);
    if(current)generated.push({...current,variants:current.variants.length?current.variants:variants});
    else generated.push({
      id,title:humanize(id),description:"Newly discovered SandBox project. Add a description in catalog/project-metadata.json.",
      category:"other",tags:["new","unclassified"],glyph:"✳",theme:"slate",featured:false,
      url:main,source:"https://github.com/paksue/sand_box/tree/main/"+(paths[0].entryPath.split("/")[0]),kind:preferred.kind,variants
    });
  }
  return generated;
}
async function loadCatalog(){
  try{
    const response=await fetch("./catalog/apps.json",{cache:"no-store"});
    if(!response.ok)throw new Error("Catalog unavailable");
    const data=await response.json();
    const count=upsertCatalog(data.apps);
    if(!count)throw new Error("Catalog empty");
    state.source="cached";markSync("Catalog loaded","cached");render();
  }catch(err){
    state.source="error";nodes.grid.setAttribute("aria-busy","false");render();
    $("resultCount").textContent="Unable to load your catalog";
    $("emptyTitle").textContent="Catalog not available";
    $("emptyText").textContent="Refresh the page to try again.";
    nodes.empty.hidden=false;markSync("Catalog unavailable","cached");
  }
  // A current raw catalog picks up GitHub Actions commits even if Pages has not redeployed.
  try{
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),5000);
    const response=await fetch(RAW_CATALOG+"?t="+Math.floor(Date.now()/60000),{signal:controller.signal,cache:"no-store"});
    clearTimeout(timer);
    if(!response.ok)throw new Error("No current catalog");
    const data=await response.json();
    if(data&&Array.isArray(data.apps)&&data.apps.length){upsertCatalog(data.apps);state.source="live";markSync("Catalog updated from GitHub","live");}
  }catch(_){}
  // Optional fallback discovery: the public tree API can see brand-new app folders even before metadata updates.
  try{
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),7000);
    const response=await fetch(GITHUB_TREE,{signal:controller.signal,headers:{"Accept":"application/vnd.github+json"}});
    clearTimeout(timer);
    if(!response.ok)throw new Error("Tree API unavailable");
    const data=await response.json();
    const scanned=parseTreePaths(data);
    if(scanned&&scanned.length){upsertCatalog(scanned);state.source="live";markSync("GitHub projects checked","live");}
  }catch(_){/* Default to the last published catalog when API is unavailable/rate-limited. */}
}
function initEvents(){
  document.addEventListener("error",event=>{const img=event.target;if(!img||!img.matches||!img.matches("img[data-cover]"))return;const fallback=img.dataset.fallback;if(fallback){img.dataset.fallback="";img.src=fallback;}else{img.remove();}},true);
  $("browseButton").addEventListener("click",()=>$("libraryHeading").scrollIntoView({behavior:"smooth",block:"start"}));
  $("surpriseButton").addEventListener("click",()=>{
    if(!state.all.length){toast("No projects available");return;}
    const p=state.all[Math.floor(Math.random()*state.all.length)];trackLaunch(p.id);
    window.open(p.url,"_blank","noopener,noreferrer");toast("Opening "+p.title);
  });
  nodes.search.addEventListener("input",e=>{state.query=e.target.value;render();});
  nodes.sort.addEventListener("change",e=>{state.sort=e.target.value;writeStorage("sort",state.sort);render();});
  $("gridButton").addEventListener("click",()=>{state.display="grid";writeStorage("display",state.display);render();});
  $("listButton").addEventListener("click",()=>{state.display="list";writeStorage("display",state.display);render();});
  ["resetFilters","clearButton","emptyReset"].forEach(id=>$(id).addEventListener("click",resetAll));
  document.addEventListener("click",e=>{
    const view=e.target.closest("[data-view]");if(view){setView(view.dataset.view);return;}
    const category=e.target.closest("[data-category]");if(category){setCategory(category.dataset.category);return;}
    const fav=e.target.closest("[data-fav]");if(fav){toggleFavorite(fav.dataset.fav);if(nodes.dialog.open&&nodes.dialog.dataset.project===fav.dataset.fav){const button=nodes.dialogContent.querySelector("[data-fav]");if(button)button.textContent=state.favorites.has(fav.dataset.fav)?"★ Favorited":"☆ Add favorite";}return;}
    const details=e.target.closest("[data-details]");if(details){openDetails(details.dataset.details);return;}
    const launch=e.target.closest("a[data-launch]");if(launch){trackLaunch(launch.dataset.launch);}
  });
  $("dialogClose").addEventListener("click",()=>nodes.dialog.close());
  nodes.dialog.addEventListener("click",e=>{if(e.target===nodes.dialog)nodes.dialog.close();});
  document.addEventListener("keydown",e=>{
    const tag=(document.activeElement?.tagName||"").toLowerCase();
    if((e.key==="/"&&!["input","textarea","select"].includes(tag))||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k")){
      e.preventDefault();nodes.search.focus();nodes.search.select();
    }else if(e.key==="Escape"&&document.activeElement===nodes.search){nodes.search.value="";state.query="";render();nodes.search.blur();}
  });
}
initEvents();
state.source="loading";
nodes.grid.innerHTML='<div class="project-card" style="padding:24px;color:#728188;min-height:170px">Preparing your collection…</div>';
loadCatalog();
})();
