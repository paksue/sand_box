/* HARRAN FIELD MANUAL — no framework, no login, no network required. */
(function(){
"use strict";
const KEY="harran-field-manual-v2";
const SEED={"Pipes":6,"Metal Parts":8,"String":3,"Plastic":2,"Batteries":3,"Power Cable":2,"Electronics":4,"Duct Tape":5,"Nails":5,"Alcohol":3,"Gauze":2,"Blade":2,"Aerosol":1,"Chemicals":1,"Household Supplies":1,"Tin Can":3};
const BUILDS=[
 {id:"nightclub",title:"Forge the Night Club",short:"Super melee • fire + electricity",kind:"MELEE / FIRST PRIORITY",base:"A regular Pipe (choose your best)",outcome:"A single melee weapon with medium FIRE and medium ELECTRICITY effects. Great early-game crowd control; still uses the base pipe's durability and damage.",description:"Make one useful double-element weapon instead of carrying four unmodified pipes.",recipe:{"Pipes":1,"Metal Parts":2,"Plastic":1,"Batteries":1,"Power Cable":1,"Electronics":2},art:"club",tag:"BEST FIRST BUILD",source:"https://dyinglight.wiki.gg/wiki/Night_Club",steps:[
 ["Check your pipe","Press I → Inventory. Look at your pipes and note which compatible pipe has the best damage and usable durability."],
 ["Find the recipe","Go to BLUEPRINTS and scroll to the DLC WEAPONS section. Highlight Night Club (visible in your screenshot)."],
 ["Start crafting","Press Enter — the CREATE key shown at the bottom of your own game screen."],
 ["Choose a base weapon","When the game asks which pipe to use, choose the one you want to modify; don't consume your last favorite weapon by mistake."],
 ["Confirm and equip","Confirm crafting. Return to Inventory; put the finished weapon into one of your four equipped weapon slots."],
 ["Try the effect","Select it using the Tab weapon wheel and hit an isolated zombie. Watch for electric shock and burning effects."]
 ],note:"Night Club is a modification, not a free new weapon. It consumes one existing pipe. You can still keep a normal pipe in another weapon slot."},
 {id:"bow",title:"Build the Ranger Bow",short:"Stealth • powerful ranged option",kind:"RANGED / BIG POWER JUMP",base:"No existing bow required",outcome:"A Ranger Bow with 400 listed base damage, enabling ranged and quiet headshots. You must craft arrows separately.",description:"Your Harran Ranger DLC already unlocked this bow recipe; you don't need to buy an extra DLC.",recipe:{"Metal Parts":3,"Duct Tape":2,"Nails":2,"String":1},art:"bow",tag:"MOST IMPACTFUL",source:"https://dyinglight.wiki.gg/wiki/Ranger_Bow",steps:[
 ["Open Blueprints","Press I → BLUEPRINTS. Scroll down to the HARRAN RANGER BUNDLE."],
 ["Choose Ranger Bow","Highlight Ranger Bow; check that all four material requirements are green."],
 ["Craft the bow","Press Enter (CREATE). This recipe makes a new bow rather than converting a pipe."],
 ["Equip it","Go back to INVENTORY and put the Ranger Bow into a weapon slot."],
 ["Learn the controls","Hold Right Mouse to aim and use Left Mouse to fire. No ammunition? Complete the next chapter to make arrows."]
 ],note:"The bow's listed base damage is not a promise of one-shot kills against every enemy. Use headshots and stay elevated. Bow attacks are much quieter than gunfire."},
 {id:"arrows",title:"Craft Ranger's Arrows",short:"Ammo • make the bow useful",kind:"RANGED / AMMUNITION",base:"Ranger Bow should be equipped",outcome:"A batch of regular arrows for silent bow practice. Exact number per craft depends on your skills; the planner records the material cost per recipe use.",description:"Your new bow cannot fire until you supply it with ammunition.",recipe:{"Metal Parts":1,"Nails":1},art:"arrows",tag:"BOW SUPPORT",source:"https://dyinglight.wiki.gg/wiki/Arrows",steps:[
 ["Open the same menu","Press I → BLUEPRINTS and find Ranger's Arrows under HARRAN RANGER BUNDLE."],
 ["Check the requirement","Look for 1 Metal Part + 1 Nail. This creates an ammunition batch, not just one arrow."],
 ["Craft a batch","Press Enter to CREATE once. Watch your game's ammunition quantity increase."],
 ["Practice","Select the Ranger Bow with Tab; aim with Right Mouse and fire with Left Mouse. Shoot at a stationary target to learn its arc."],
 ["Recover where possible","After fighting, look for recoverable arrows and avoid wasting rare elemental arrows on ordinary enemies."]
 ],note:"Craft regular arrows first. Your DLC also includes electric, incendiary and exploding arrow recipes; explosions can attract Virals."},
 {id:"medkits",title:"Prepare 2 Medkits",short:"Healing • survive a bad fight",kind:"SURVIVAL / HEALTH",base:"No base weapon",outcome:"At least two medkits without the Crafting Expertise skill; potentially more with it. Medkits normally restore 100 health each.",description:"Turn the gauze and alcohol already in your backpack into emergency healing.",recipe:{"Alcohol":2,"Gauze":2},art:"medkit",tag:"ESSENTIAL",source:"https://dyinglight.wiki.gg/wiki/Medkit",steps:[
 ["Locate the blueprint","Press I → BLUEPRINTS → UTILITIES → Medkit."],
 ["Make one batch","The game requires 1 Alcohol and 1 Gauze per crafting operation. Press Enter to CREATE."],
 ["Make a second batch","Repeat one more time if you still need extra medkits; your guide deducts the two recipe uses together."],
 ["Confirm in Inventory","Open INVENTORY and verify the newly crafted medkits are in your supplies."],
 ["Know the healing key","During gameplay, press H to use a medkit when injured."]
 ],note:"If you have Survivor skill Crafting Expertise (Survivor level 5), one crafting operation can yield two medkits. In that case, do only one craft if you already have enough, and adjust the ledger rather than recording a second unmade batch."},
 {id:"lockpicks",title:"Keep lockpicks ready",short:"Loot • open doors and crates",kind:"TOOLS / OPTIONAL REFILL",base:"No base weapon",outcome:"Three lockpicks per Metal Part before Crafting Expertise; five afterward. Opens locked doors, police vans and chests.",description:"Great to keep handy, but don't craft another batch if you've already got plenty.",recipe:{"Metal Parts":1},art:"picks",tag:"OPTIONAL",source:"https://dyinglight.wiki.gg/wiki/Lockpicks",steps:[
 ["Check your actual count","Open Inventory and see how many lockpicks you already carry; your Blueprint [8] is a possible craft count, not proof of 8 owned lockpicks."],
 ["Decide if you need more","If your supply is low, open BLUEPRINTS → UTILITIES → Lockpicks."],
 ["Create the batch","Press Enter to CREATE once. You will use 1 Metal Part."],
 ["Practice on a safe lock","Use F to interact with a locked chest or door; gently adjust the pick angle and don't force the lock when it resists."]
 ],note:"If you already have enough lockpicks, leave this chapter unfinished or use its Next button. It is intentionally optional so you don't waste Metal Parts."},
 {id:"molotov",title:"Bottle up some fire",short:"Crowd control • emergency tool",kind:"EQUIPMENT / OPTIONAL",base:"No weapon required",outcome:"Molotovs: area fire that helps thin groups of Biters, especially when thrown from a safe raised position.",description:"Use an inexpensive crafted fire option for groups rather than spending your melee durability.",recipe:{"Alcohol":1,"String":1},art:"molotov",tag:"OPTIONAL",source:"https://dyinglight.wiki.gg/wiki/Molotov_(Dying_Light)",steps:[
 ["Locate Molotovs","Press I → BLUEPRINTS → THROWING WEAPONS → Molotovs."],
 ["Check supplies","Confirm 1 Alcohol + 1 String. Save Alcohol if healing supplies are currently low."],
 ["Create and equip","Press Enter to CREATE, then equip Molotovs in an EQUIPMENT slot in Inventory."],
 ["Use from safety","Hold 1 to choose equipment, then use Middle Mouse to throw. Be careful not to set yourself alight."]
 ],note:"Keep some alcohol for healing when possible. A Molotov is area fire, not an upgrade to the Night Club weapon."},
 {id:"watercurrent",title:"Make a backup shock pipe",short:"Water Current • alternate melee",kind:"MELEE / OPTIONAL ALTERNATIVE",base:"Another ordinary Pipe",outcome:"A separate pipe that can cause medium electric discharges. Unlike Night Club, this blueprint doesn't also add burning.",description:"Water Current is an electric modification, not something you mix by hand or pour water into.",recipe:{"Pipes":1,"Metal Parts":1,"String":1,"Plastic":1,"Batteries":2,"Power Cable":1},art:"water",tag:"OPTIONAL",source:"https://dyinglight.wiki.gg/wiki/Water_Current",steps:[
 ["Find the blueprint","Press I → BLUEPRINTS → WEAPONS → Water Current."],
 ["Read the right panel","It says Electricity — adds medium Electric discharge. The BASE WEAPONS line shows Pipe."],
 ["Choose a pipe","Press Enter (CREATE), then select a regular pipe to modify."],
 ["Confirm and equip","Finish crafting and move the new shock pipe into an equipped slot if you want a backup."],
 ["Compare in play","Use Night Club for dual elements; Water Current is your simpler electricity-only alternative."]
 ],note:"This blueprint overlaps with Night Club. It's here to teach the difference, not because you need both. Skip this until you have extra resources."},
 {id:"loadout",title:"Set your four-slot loadout",short:"Routine • stay ready outdoors",kind:"FIELD DRILL / NO MATERIALS",base:"Your existing weapons and gear",outcome:"A reliable quick-select setup: one main melee, one Ranger Bow, one backup melee and one spare; medkits and distractions available without menu panic.",description:"Inventory management is a combat skill. Your backpack can carry materials freely, but only four weapons are on quick-select.",recipe:{},art:"kit",tag:"HABIT TO KEEP",source:"https://dyinglight.wiki.gg/wiki/Weapons_(Dying_Light)",steps:[
 ["Open your Inventory","Press I. Look at EQUIPPED on the right: four WEAPONS slots and four EQUIPMENT slots."],
 ["Give each slot a job","Equip Night Club / Ranger Bow / backup high-damage weapon / spare or specialty item. Swap by selecting an equipped slot."],
 ["Equip useful equipment","Keep Firecrackers plus another usable tool in the EQUIPMENT slots; UV Flashlight can stay equipped."],
 ["Practice two selection wheels","Hold Tab for your four weapons; hold 1 for equipment. Use Middle Mouse to use the currently selected equipment."],
 ["Protect crafting materials","Carry Metal Parts, Gauze and Alcohol. Stash unnecessary extra weapons when weapon slots fill; you do not need a safe house to craft."],
 ["Watch for better base weapons","When new weapons have much higher damage than pipes, stop using rare upgrades on your starter gear."]
 ],note:"Your Juggernaut upgrade improves durability, not raw damage. Save it for a weapon worth keeping. In the Inventory image F6 = upgrade; F7 = craft; Z = dismantle."}
];
const SKILLS=[
 {id:"survivor",title:"Survivor",icon:"✚",description:"Quest completion, survivor rescues and DROP deliveries. Your most useful early support upgrades.",items:[
 ["Survival Starter Kit","Level 2 — unlocks lockpicks, firecrackers, throwing stars and Molotovs."],
 ["Backpacker","Level 3 — carry four additional weapons."],
 ["Crafting Expertise","Level 5 — make more consumables per ingredient batch (two medkits, for example)."],
 ["Master Backpacker","Level 6, needs Backpacker — six more weapon slots."],
 ["Lucky Repair","Level 7, needs Crafting Expertise — repairs may preserve a repair slot."]]},
 {id:"agility",title:"Agility",icon:"↗",description:"Earn agility XP by running, climbing and traversing rooftops. Upgrade escapes before fancy tricks.",items:[
 ["Train through movement","Sprint, jump and climb as you explore; avoid fighting every zombie."],
 ["Prioritize mobility","Check U → Agility for Dodge, landing and traversal abilities as they unlock."],
 ["Build night escape habits","Use rooftops, safe zones and escape routes instead of relying on brute force."]]},
 {id:"power",title:"Power",icon:"⚔",description:"Power XP comes from combat. Use terrain and controlled fights rather than wasting weapons.",items:[
 ["Practice basic combat","Use E to kick, Left Mouse to attack, and the environment to create space."],
 ["Improve weapon economy","Watch for skills that improve damage or save durability as your Power level rises."],
 ["Use one-on-one fights","Learn enemy range and stagger timing before engaging large groups."]]}
];
const LIBRARY=[
 ["Night Club","Melee","Now","Fire + electric pipe modification.","nightclub"],
 ["Water Current","Melee","Now","Electricity-only pipe modification.","watercurrent"],
 ["Ranger Bow","Ranged","Now","Craftable DLC bow; listed base damage 400.","bow"],
 ["Ranger's Arrows","Ammo","Now","Standard ammunition for your bow.","arrows"],
 ["Ranger's Electric Arrows","Ammo","Now","Metal Parts + Batteries; save for strong targets.",null],
 ["Ranger's Incendiary Arrows","Ammo","Now","Metal Parts + Aerosol; applies fire.",null],
 ["Ranger's Exploding Arrows","Ammo","Later","Metal Parts + Chemicals; explosions attract danger.",null],
 ["Medkit","Utility","Now","Alcohol + Gauze. Heals you.","medkits"],
 ["Lockpicks","Utility","Now","One Metal Part makes a batch.","lockpicks"],
 ["Firecrackers","Utility","Now","Plastic + Household Supplies; distract infected.",null],
 ["Molotovs","Utility","Now","Alcohol + String. Area fire.","molotov"],
 ["Throwing Stars","Utility","Now","Blade + String. Quiet thrown tools.",null],
 ["Glowing Stick","Melee","Later","Elemental melee blueprint; check compatible base.",null],
 ["Punk Queen","Melee","Later","DLC melee blueprint; check compatible base.",null],
 ["Buzz Killer","Melee","Later","Needs a sledgehammer as the base weapon.",null],
 ["Lacerator","Melee","Later","Modifies planks or table legs.",null],
 ["The Constable","Melee","Later","Requires a police baton base.",null],
 ["Wrench Kiss","Melee","Later","Additional DLC melee blueprint.",null],
 ["Volatile Hunter weapons","Melee","Later","Maul / Baton / Knife / Sword; appropriate base weapons required.",null],
 ["Gust of Wind","Ranged","Later","Special crossbow; distinct bolt ammunition.",null],
 ["Dragon Ji / Leaping Tiger Dao","Melee","Later","Shu Warrior melee weapons.",null],
 ["Hellbeast","Firearm","Later","5th Anniversary firearm; reserve for when it is craftable.",null],
 ["Marksman Rifle","Firearm","Later","Needs a rifle to modify.",null],
 ["Volkatronix / Vindicator 2000","Firearm","Later","Retrowave firearm blueprints; special bases.",null],
 ["Sunburst / Dawnbreaker / Golden Idol","DLC","Later","10th Anniversary weapon blueprints; check their own requirements.",null],
 ["Boosters","Utility","Later","Speed / night vision / resistance / stamina.",null]
];
const byId=id=>document.getElementById(id);
function fresh(){return{tab:"workbench",selected:"nightclub",found:Object.assign({},SEED),crafted:{},done:{},skipped:{},steps:{},skills:{},updated:null}}
let state=fresh();
try{const stored=JSON.parse(localStorage.getItem(KEY)||"null");if(stored&&stored.found&&typeof stored==="object"){state.tab=["workbench","supplies","skills","library","about"].includes(stored.tab)?stored.tab:"workbench";state.selected=BUILDS.some(b=>b.id===stored.selected)?stored.selected:"nightclub";for(const k of Object.keys(SEED))state.found[k]=clamp(stored.found[k],SEED[k]);for(const k of ["crafted","done","skipped","steps","skills"])if(stored[k]&&typeof stored[k]==="object")state[k]=stored[k];state.updated=stored.updated||null;}}catch(e){/* Reset invalid previous version silently. */}
function clamp(v,fallback){const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(9999,Math.floor(n))):fallback}
function save(){state.updated=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}updateGlobal()}
function completed(b){return b.recipe&&Object.keys(b.recipe).length?!!state.crafted[b.id]:!!state.done[b.id]}
function skipped(b){return !!state.skipped[b.id]}
function finished(b){return completed(b)||skipped(b)}
function balance(){const r=Object.assign({},state.found);for(const b of BUILDS)if(state.crafted[b.id])for(const [k,v] of Object.entries(b.recipe))r[k]=(r[k]||0)-v;return r}
function ready(b){if(completed(b))return true;const r=balance();return Object.entries(b.recipe).every(([k,n])=>(r[k]||0)>=n)}
function toast(msg){const n=byId("toast");n.textContent=msg;n.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>{n.hidden=true},3400)}
function go(tab){state.tab=tab;document.querySelectorAll("[data-tab]").forEach(btn=>{const active=btn.dataset.tab===tab;btn.classList.toggle("active",active);btn.setAttribute("aria-selected",String(active))});document.querySelectorAll(".view").forEach(n=>n.classList.toggle("active",n.id==="tab-"+tab));save();render(tab)}
function select(id){state.selected=id;save();go("workbench");renderWorkbench();byId("workbenchTitle").scrollIntoView({behavior:"smooth",block:"start"})}
function nextIncomplete(){return BUILDS.find(b=>!finished(b))||BUILDS[BUILDS.length-1]}
function updateGlobal(){const count=BUILDS.filter(finished).length;byId("progressFraction").textContent=count+" / "+BUILDS.length;byId("progressFill").style.width=(100*count/BUILDS.length)+"%";byId("metalQuick").textContent=balance()["Metal Parts"];const b=BUILDS.find(b=>b.id===state.selected)||BUILDS[0];byId("currentMission").textContent=b.title;byId("missionCount").textContent=BUILDS.length+" TOTAL";byId("savedNote").textContent=state.updated?"Progress saved in this browser":"Your field notes save in this browser"}
function art(kind){const common='fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"';let a="";
if(kind==="club"||kind==="water"){a='<g transform="rotate(-28 85 54)"><rect x="78" y="12" width="16" height="87" rx="6" fill="#425848" stroke="#243629" stroke-width="3"/><path d="M74 27h24m-24 9h24" stroke="#e4b574" stroke-width="3"/></g><path d="M113 19l-18 24h14l-11 25" '+common+' stroke="#d8a23b"/><path d="M35 70l12-20-2 21 18-10-10 25" '+common+' stroke="#d8a23b"/>';if(kind==="club")a+='<path d="M123 95q30-12 7-33q2 18-10 18q5-24-10-37q5 20-12 35q-14 21 25 17Z" fill="#d97636" stroke="#984523" stroke-width="2"/><path d="M123 94q17-7 2-19q0 11-9 12q-2 9 7 7Z" fill="#f6ce76"/>';}
if(kind==="bow")a='<path d="M48 12q-44 40 0 84M48 12L48 96" '+common+' stroke="#50623e"/><path d="M18 54H143M125 44l18 10-18 10" '+common+' stroke="#a35b35"/><path d="M30 54l-10-7m10 7l-10 7" stroke="#a35b35" stroke-width="3"/><path d="M49 12L68 15M49 96l19-3" stroke="#b58e59" stroke-width="4"/>';
if(kind==="arrows")a='<g stroke="#46563d" stroke-width="4" fill="none"><path d="M27 25L135 82m-108 4L135 29m-79-10L115 93"/></g><g stroke="#a15e35" fill="none" stroke-width="3"><path d="M135 82l-17-2 8-14m9-37l-17 2 8 14m-11 48l-13-11 15-5"/></g><g stroke="#bf9e68" stroke-width="3"><path d="M27 25L14 28m13-3-1-12m1 73-13-3m13 3-1 12"/></g>';
if(kind==="medkit")a='<rect x="38" y="25" width="96" height="71" rx="8" fill="#e4d4ac" stroke="#445b49" stroke-width="4"/><path d="M64 25V14h44v11" '+common+' stroke="#445b49"/><path d="M84 41v40M64 61h40" stroke="#b15a43" stroke-width="13"/><path d="M84 41v40M64 61h40" stroke="#e08c65" stroke-width="5"/>';
if(kind==="picks")a='<path d="M34 15v66q0 10 12 10h18m10-70v63h61" '+common+' stroke="#47594a"/><path d="M18 15h32m8 5h32M119 84h17" stroke="#b47d49" stroke-width="5"/><circle cx="37" cy="15" r="8" fill="none" stroke="#5a6f50" stroke-width="3"/>';
if(kind==="molotov")a='<path d="M67 22h34v20l15 18v34H53V60l14-18z" fill="#9a6435" stroke="#483b2a" stroke-width="4"/><rect x="71" y="11" width="26" height="18" fill="#d4b781" stroke="#544c3a" stroke-width="3"/><path d="M83 14q-25-21-8-31q-1 16 11 18q18-13 8-24q31 14 0 37" fill="#d6762d"/><path d="M70 73h31" stroke="#dfb779" stroke-width="4"/>';
if(kind==="kit")a='<rect x="13" y="22" width="65" height="65" fill="#c9b787" stroke="#4b5d48" stroke-width="3"/><rect x="94" y="22" width="65" height="65" fill="#c9b787" stroke="#4b5d48" stroke-width="3"/><path d="M26 72l40-37m-29-1 17 13m53 9h43m-22-19v39" '+common+' stroke="#58653e"/>';
return '<svg viewBox="0 0 170 108" role="img" aria-label="Original illustrated '+kind+' blueprint"><rect x="1" y="1" width="168" height="106" rx="3" fill="#e4d9bc" stroke="#b9aa86"/><path d="M0 27h170M0 81h170M41 0v108M130 0v108" stroke="#b8ad90" stroke-width="1" opacity=".25"/>'+a+'</svg>'}
function renderWorkbench(){const list=byId("missionList");list.innerHTML=BUILDS.map((b,i)=>'<button class="mission-item '+(state.selected===b.id?'active ':'')+(finished(b)?'done':'')+'" data-select="'+b.id+'" aria-pressed="'+(state.selected===b.id)+'"><span class="number">'+(completed(b)?'✓':skipped(b)?'–':String(i+1).padStart(2,"0"))+'</span><span class="mission-text"><strong>'+b.title+'</strong><small>'+b.short+'</small></span><span class="status '+(finished(b)?'good':'')+'">'+(completed(b)?"DONE":skipped(b)?"SKIP":ready(b)?"READY":"LOOT")+'</span></button>').join("");
list.querySelectorAll("[data-select]").forEach(el=>el.addEventListener("click",()=>{state.selected=el.dataset.select;save();renderWorkbench()}));
const b=BUILDS.find(x=>x.id===state.selected)||BUILDS[0],isDone=completed(b),isSkipped=skipped(b);const bal=balance();const craftable=ready(b);
const recipe=Object.entries(b.recipe).map(([k,v])=>{const shown=(bal[k]||0)+(isDone?v:0);const missing=shown<v;return '<div class="part '+(missing?'missing':'')+'"><div class="qtyline"><b>'+v+'×</b><small>'+(shown)+' in ledger</small></div><strong>'+k+'</strong><small>'+(missing?'NEED '+(v-shown)+' MORE':'AVAILABLE')+'</small></div>'}).join("");
const checks=state.steps[b.id]||{};const nextIndex=b.steps.findIndex((_,i)=>!checks[i]);const steps=b.steps.map((s,i)=>'<label class="step-row '+(checks[i]?'done ':'')+(nextIndex===i?'active':'')+'"><input type="checkbox" data-step="'+i+'" '+(checks[i]?'checked':'')+'><span class="step-index">'+(i+1)+'</span><span><strong>'+s[0]+'</strong><p>'+s[1]+'</p></span></label>').join("");
const count=b.steps.reduce((v,_,i)=>v+(!!checks[i]?1:0),0);
const ingredientStatus=isDone?'RECORDED':isSkipped?'OPTIONAL / SKIPPED':craftable?'ALL INGREDIENTS READY':'MATERIALS MISSING';
const recordedMessage=isDone?'<span class="complete-message">✓ Recorded in pack ledger</span>':'';
const action=Object.keys(b.recipe).length?'<button class="craftbutton" id="completeBuild">'+(isDone?'↶ Undo recorded craft':'✓ I crafted it — record materials')+'</button>':'<button class="craftbutton" id="completeBuild">'+(isDone?'↶ Undo drill':'✓ I completed the loadout drill')+'</button>';
byId("missionDetail").innerHTML='<header class="dossier-head"><div><span class="chapter-num">CHAPTER '+String(BUILDS.indexOf(b)+1).padStart(2,"0")+' / '+b.kind+'</span><h2>'+b.title+'</h2><p>'+b.description+'</p></div><div class="dossier-stamp '+(isDone?'done':'')+'">'+(isDone?'✓ COMPLETED':'FIELD<br>TEST')+'</div></header>'+
'<div class="diagram"><div class="mini-gear"><span>'+b.base+'</span><small>START WITH THIS</small></div><span class="transform">➜</span><div class="mini-gear">'+art(b.art)+'<small>EXPECTED RESULT</small></div></div>'+
'<div class="resultbar"><span class="result-icon">✦</span><div><b>WHAT YOU GAIN</b><p>'+b.outcome+'</p></div></div>'+
'<section class="ingredients-panel"><div class="between"><h3 class="inner-heading">THE PARTS LIST / ONE '+(b.id==='medkits'?'2× RECIPE PLAN':'CRAFTING PLAN')+'</h3><span class="ready '+(isDone?'done':craftable?'':'short')+'">'+ingredientStatus+'</span></div><div class="ingredient-grid">'+(recipe||'<div class="part"><strong>No crafting ingredients</strong><small>Only an equipment check</small></div>')+'</div></section>'+
'<section class="booksection"><div class="between"><h3 class="inner-heading">FOLLOW THE STEPS — ONE AT A TIME</h3><span class="micro">'+count+' / '+b.steps.length+' DONE</span></div><div>'+steps+'</div></section>'+
'<div class="dossier-actions"><button class="plainbutton" id="prevBuild">← Previous</button><button class="plainbutton" id="nextBuild">Next chapter →</button><div class="spacer"></div>'+recordedMessage+skipAction+action+'</div>'+
'<p class="recipe-note"><strong>FIELD NOTE:</strong> '+b.note+'</p>';
byId("missionDetail").querySelectorAll("[data-step]").forEach(el=>el.addEventListener("change",()=>{const idx=Number(el.dataset.step);state.steps[b.id]=state.steps[b.id]||{};state.steps[b.id][idx]=el.checked;save();renderWorkbench()}));
byId("completeBuild").onclick=()=>{if(isDone){if(Object.keys(b.recipe).length)delete state.crafted[b.id];else delete state.done[b.id];toast("↶ Chapter reopened; materials restored")}else if(!craftable){toast("Check the Pack ledger: you need more materials first");go("supplies");return}else{delete state.skipped[b.id];if(Object.keys(b.recipe).length)state.crafted[b.id]=true;else state.done[b.id]=true;state.steps[b.id]=Object.fromEntries(b.steps.map((_,i)=>[i,true]));toast("✓ "+b.title+" recorded in your field journal")}save();renderWorkbench();};
byId("prevBuild").onclick=()=>{state.selected=BUILDS[Math.max(0,BUILDS.indexOf(b)-1)].id;save();renderWorkbench();byId("workbenchTitle").scrollIntoView({behavior:"smooth",block:"start"})};
byId("nextBuild").onclick=()=>{state.selected=BUILDS[Math.min(BUILDS.length-1,BUILDS.indexOf(b)+1)].id;save();renderWorkbench();byId("workbenchTitle").scrollIntoView({behavior:"smooth",block:"start"})};updateGlobal();}
function renderSupplies(){const bal=balance(),spent=BUILDS.filter(b=>state.crafted[b.id]).length;const sum=k=>Object.keys(state.found).reduce((v,key)=>v+(bal[key]>0?bal[key]:0),0);byId("ledgerStats").innerHTML='<div class="statbox"><span class="micro">METAL PARTS</span><b>'+bal["Metal Parts"]+'</b><small>Repair + crafting lifeline</small></div><div class="statbox"><span class="micro">BATTERIES</span><b>'+bal["Batteries"]+'</b><small>Elemental mods</small></div><div class="statbox"><span class="micro">GAUZE</span><b>'+bal["Gauze"]+'</b><small>Healing supplies</small></div><div class="statbox"><span class="micro">CRAFTS RECORDED</span><b>'+spent+'</b><small>Virtual recipe spends</small></div>';
byId("supplyInputs").innerHTML=Object.keys(SEED).map(k=>'<div class="supply-row"><label>'+k+'</label><button data-adjust="'+k+'" data-delta="-1" aria-label="Remove one '+k+'">−</button><input data-input="'+k+'" type="number" inputmode="numeric" min="0" max="9999" aria-label="'+k+' found total" value="'+state.found[k]+'"><button data-adjust="'+k+'" data-delta="1" aria-label="Add one '+k+'">+</button></div>').join("");
byId("supplyInputs").querySelectorAll("[data-adjust]").forEach(el=>el.onclick=()=>{state.found[el.dataset.adjust]=clamp(state.found[el.dataset.adjust]+Number(el.dataset.delta),0);save();renderSupplies()});
byId("supplyInputs").querySelectorAll("[data-input]").forEach(el=>el.onchange=()=>{state.found[el.dataset.input]=clamp(el.value,0);save();renderSupplies()});
byId("supplyBalances").innerHTML=Object.keys(SEED).map(k=>'<div class="balance-row"><span>'+k+'</span><b class="'+(bal[k]<0?'negative':'')+'">'+bal[k]+'</b></div>').join("");
const lack=Object.keys(SEED).filter(k=>bal[k]<0);const el=byId("shortageNote");el.className="note"+(lack.length?" warn":"");el.textContent=lack.length?"Balance is negative for "+lack.join(", ")+". Add loot you found to the totals, or undo a recorded craft.":"No inventory shortfalls. Choose Workbench to find a build you can make right now.";updateGlobal();}
function renderSkills(){byId("skillCards").innerHTML=SKILLS.map(s=>'<section class="skillcard"><span class="micro">'+s.icon+' TRAINING PATH</span><h3>'+s.title+'</h3><p>'+s.description+'</p>'+s.items.map((i,n)=>{const id=s.id+"-"+n;return '<label class="milestone"><input type="checkbox" data-skill="'+id+'" '+(state.skills[id]?'checked':'')+'><span><b>'+i[0]+'</b><small>'+i[1]+'</small></span></label>'}).join("")+'</section>').join("");document.querySelectorAll("[data-skill]").forEach(el=>el.onchange=()=>{state.skills[el.dataset.skill]=el.checked;save();toast(el.checked?"✓ Skill milestone noted":"Milestone unchecked")})}
let libraryFilter="All";
function renderLibrary(){const filters=["All","Now","Later","Melee","Ranged","Ammo","Utility","Firearm","DLC"];byId("libraryFilters").innerHTML=filters.map(f=>'<button class="filterbtn '+(f===libraryFilter?'active':'')+'" data-filter="'+f+'">'+f+'</button>').join("");document.querySelectorAll("[data-filter]").forEach(el=>el.onclick=()=>{libraryFilter=el.dataset.filter;renderLibrary()});const needle=byId("blueprintSearch").value.toLowerCase().trim();const rows=LIBRARY.filter(x=>(libraryFilter==="All"||x[1]===libraryFilter||x[2]===libraryFilter)&&([x[0],x[1],x[3]].join(" ").toLowerCase().includes(needle)));byId("blueprintCards").innerHTML=rows.length?rows.map(x=>{let icon=x[1]==="Ranged"?"🏹":x[1]==="Melee"?"⚔":x[1]==="Ammo"?"➶":x[1]==="Utility"?"✚":x[1]==="Firearm"?"⌖":"✳";return '<article class="library-item"><span class="lib-badge">'+x[2].toUpperCase()+'</span><div class="lib-icon">'+icon+'</div><h3>'+x[0]+'</h3><p>'+x[3]+'</p><span class="lib-tag">'+x[1].toUpperCase()+'</span>'+(x[4]?'<br><button data-open="'+x[4]+'">Open step-by-step chapter ↗</button>':'')+'</article>'}).join(""):'<p>No blueprints match this search.</p>';byId("blueprintCards").querySelectorAll("[data-open]").forEach(el=>el.onclick=()=>select(el.dataset.open))}
function render(tab){if(tab==="workbench")renderWorkbench();if(tab==="supplies")renderSupplies();if(tab==="skills")renderSkills();if(tab==="library")renderLibrary()}
byId("resumeBtn").onclick=()=>select(nextIncomplete().id);
byId("blueprintSearch").addEventListener("input",renderLibrary);
document.querySelectorAll("[data-tab]").forEach(el=>el.onclick=()=>go(el.dataset.tab));
byId("printBtn").onclick=()=>{go("workbench");window.print()};
byId("exportBtn").onclick=()=>{const json=JSON.stringify(Object.assign({},state,{exportedAt:new Date().toISOString()}),null,2);const url=URL.createObjectURL(new Blob([json],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="harran-field-notes.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("Backup downloaded")};
byId("importBtn").onclick=()=>byId("importFile").click();
byId("importFile").addEventListener("change",ev=>{const f=ev.target.files&&ev.target.files[0];if(!f)return;const reader=new FileReader();reader.onload=()=>{try{const obj=JSON.parse(String(reader.result));if(!obj||typeof obj.found!=="object")throw new Error("Missing field-notes inventory");const safe=fresh();for(const k of Object.keys(SEED))safe.found[k]=clamp(obj.found[k],SEED[k]);if(BUILDS.some(b=>b.id===obj.selected))safe.selected=obj.selected;if(["workbench","supplies","skills","library","about"].includes(obj.tab))safe.tab=obj.tab;for(const b of BUILDS){if(obj.crafted&&obj.crafted[b.id]&&Object.keys(b.recipe).length)safe.crafted[b.id]=true;if(obj.done&&obj.done[b.id]&&!Object.keys(b.recipe).length)safe.done[b.id]=true;if(obj.skipped&&obj.skipped[b.id]&&!safe.crafted[b.id])safe.skipped[b.id]=true;const o=obj.steps&&obj.steps[b.id];if(o&&typeof o==="object"){safe.steps[b.id]={};for(let i=0;i<b.steps.length;i++)safe.steps[b.id][i]=!!o[i]}}for(const s of SKILLS)for(let i=0;i<s.items.length;i++){const k=s.id+"-"+i;if(obj.skills&&obj.skills[k])safe.skills[k]=true;}state=safe;save();go(state.tab);toast("Field notes successfully restored")}catch(e){toast("Could not import: "+e.message)}};reader.readAsText(f);ev.target.value=""});
byId("resetBtn").onclick=()=>{if(!confirm("Reset all guide progress and starting inventory? Download a backup first if needed."))return;state=fresh();save();go("workbench");toast("Field notebook reset")};
go(state.tab);updateGlobal();
})();