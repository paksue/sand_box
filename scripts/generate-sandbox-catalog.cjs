(function generateCatalog(){
"use strict";
const fs=require("node:fs"), path=require("node:path"), cp=require("node:child_process");
const ROOT=path.resolve(__dirname,".."), BASE="https://paksue.github.io/sand_box/";
const METADATA=path.join(ROOT,"catalog","project-metadata.json");
const OUTPUT=path.join(ROOT,"catalog","apps.json");
const content=JSON.parse(fs.readFileSync(METADATA,"utf8"));
const aliases=content.aliases||{}, metadata=content.projects||{};
const omitted=new Set(["assets","catalog","scripts","previews",".git",".github","node_modules","skills","tests","docs","king_quest_the_shortcut"]);
function humanize(x){return x.replace(/[-_]/g," ").replace(/\b\w/g,y=>y.toUpperCase());}
function directory(pathname){const file=path.join(ROOT,pathname,"index.html");return fs.existsSync(file)&&fs.statSync(file).isFile()&&fs.statSync(file).size>0;}
function listFolders(pathname){
  const root=path.join(ROOT,pathname);
  if(!fs.existsSync(root))return[];
  return fs.readdirSync(root,{withFileTypes:true}).filter(d=>d.isDirectory()&&!d.name.startsWith(".")).map(d=>d.name);
}
function gitDate(projectPaths){
  try{return cp.execFileSync("git",["log","-1","--format=%cI","--",...projectPaths],{cwd:ROOT,encoding:"utf8",timeout:4500}).trim();}catch(_){return "";}
}
const locations=new Map();
function add(id,location,kind){
  if(!/^[a-z0-9][a-z0-9_-]*$/i.test(id))return;
  if(!locations.has(id))locations.set(id,[]);
  locations.get(id).push({path:location,kind});
}
for(const folder of listFolders("")){
  if(omitted.has(folder))continue;
  if(directory(folder))add(folder,folder,"app");
}
for(const folder of listFolders("previews")){
  if(directory("previews/"+folder))add(aliases[folder]||folder,"previews/"+folder,"preview");
}
if(directory("camera-safety-notifier/client"))add("camera-safety-notifier","camera-safety-notifier/client","app");
const apps=[];
for(const [id,paths] of locations.entries()){
  const md=metadata[id]||{}, chosen=
    (id==="college-sat-act-planner"?paths.find(p=>p.kind==="app"):null)||
    paths.find(p=>p.kind==="preview")||paths[0];
  const primary=BASE+chosen.path+"/";
  const alternates=paths.filter(p=>p!==chosen).map(p=>({label:p.kind==="preview"?"Alternate preview":"Source entry",url:BASE+p.path+"/",kind:p.kind}));
  const sourceFolder=directory(id)||fs.existsSync(path.join(ROOT,id))?id:chosen.path;
  apps.push({
    id,title:md.title||humanize(id),
    description:md.description||"New SandBox app. Add a description in catalog/project-metadata.json.",
    category:md.category||"other",tags:Array.isArray(md.tags)?md.tags:["new"],
    glyph:md.glyph||"✳",theme:md.theme||"slate",featured:Boolean(md.featured),
    url:primary,source:"https://github.com/paksue/sand_box/tree/main/"+sourceFolder,
    kind:chosen.kind,variants:alternates,
    updatedAt:gitDate([id,chosen.path])
  });
}
apps.sort((a,b)=>a.title.localeCompare(b.title));
const data=JSON.stringify({version:1,source:"repository-discovery",apps},null,2)+"\n";
const existing=fs.existsSync(OUTPUT)?fs.readFileSync(OUTPUT,"utf8"):"";
if(existing!==data){fs.writeFileSync(OUTPUT,data,"utf8");console.log("Updated catalog with "+apps.length+" projects.");}
else console.log("Catalog already current: "+apps.length+" projects.");
})();
