'use strict';
const STORAGE_KEY='snowpro-recall-v1';
const DAY=86400000, NOW=()=>Date.now();
const DOMAINS={loading:{name:'Data loading',short:'Loading',icon:'database',color:'#9dddcf'},architecture:{name:'Architecture & AI',short:'Architecture',icon:'layers',color:'#9cbeed'},governance:{name:'Governance & access',short:'Governance',icon:'shield',color:'#edbe9c'},performance:{name:'Performance & SQL',short:'Performance',icon:'bolt',color:'#c6b5f0'},sharing:{name:'Data collaboration',short:'Sharing',icon:'share',color:'#ecc5a2'}};
const ICONS={
 home:'<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-7h6v7"/>',cards:'<rect x="4" y="5" width="15" height="15" rx="3"/><path d="M8 2h11a3 3 0 0 1 3 3v11"/>',compass:'<circle cx="12" cy="12" r="9"/><path d="m15.8 8.2-2.4 5.2-5.2 2.4 2.4-5.2z"/>',insights:'<path d="M4 20V13M10 20V5M16 20v-9M22 20V8"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15.2 21 16l-2 3.4-1.6-.7a8 8 0 0 1-2.3 1.3l-.3 1.8h-4l-.3-1.8a8 8 0 0 1-2.3-1.3l-1.6.7-2-3.4 1.6-.8a8 8 0 0 1 0-2.6L4.6 12l2-3.4 1.6.7a8 8 0 0 1 2.3-1.3l.3-1.8h4l.3 1.8a8 8 0 0 1 2.3 1.3l1.6-.7 2 3.4-1.6.7a8 8 0 0 1 0 2.5z" transform="translate(-.8 -1)"/>',close:'<path d="M5 5 19 19M19 5 5 19"/>',arrow:'<path d="m4 12 16 0m-6-6 6 6-6 6"/>',back:'<path d="M20 12H4m6-6-6 6 6 6"/>',check:'<path d="m4 13 5 5L20 6"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/>',star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',search:'<circle cx="10.7" cy="10.7" r="7.7"/><path d="m16.5 16.5 5 5"/>',shield:'<path d="m12 2 9 4v6c0 5-3.5 8-9 10-5.5-2-9-5-9-10V6z"/><path d="m8 12 3 3 5-6"/>',database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0"/>',layers:'<path d="m12 2 10 5-10 5L2 7zM2 12l10 5 10-5M2 17l10 5 10-5"/>',bolt:'<path d="m13 2-9 11h7l-1 9 10-13h-7z"/>',share:'<circle cx="19" cy="5" r="3"/><circle cx="5" cy="12" r="3"/><circle cx="19" cy="19" r="3"/><path d="m7.8 10.6 8.4-4.2m-8.4 9 8.4 4.2"/>',flip:'<path d="M4 10a8 8 0 0 1 14-5l2 2M20 14a8 8 0 0 1-14 5l-2-2M20 2v5h-5M4 22v-5h5"/>',spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',book:'<path d="M5 3h14v18H5a3 3 0 0 1 0-6h14"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',download:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>',upload:'<path d="M12 21V8m-5 5 5-5 5 5M4 7V3h16v4"/>',info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10v1"/>'};
const icon=(n)=>`<span class="icon"><svg viewBox="0 0 24 24" role="img" aria-hidden="true">${ICONS[n]||ICONS.spark}</svg></span>`;
const C=new Map(CARD_BANK.map(c=>[c.id,c]));
if(CARD_BANK.length<162||C.size!==CARD_BANK.length)throw Error('Card bank integrity failed');
const currentCards=()=>CARD_BANK.filter(c=>c.status!=='legacy');
const legacyCards=()=>CARD_BANK.filter(c=>c.status==='legacy');
const OBJECTIVES={"1.1": "Architecture, compute and editions", "1.2": "Snowflake interfaces and tools", "1.3": "Object hierarchy, types and session parameters", "1.4": "Virtual warehouse configuration", "1.5": "Storage, tables and view types", "1.6": "AI/ML and applications", "2.1": "Access models and authentication", "2.2": "Governance, encryption and monitoring", "2.3": "FinOps, warehouse credits and Account Usage", "3.1": "Stages, file formats, COPY and error handling", "3.2": "Snowpipe, streams, tasks and dynamic tables", "3.3": "Connectors, drivers and integrations", "4.1": "Query Profile, bottlenecks and workload management", "4.2": "Performance optimization services", "4.3": "Query and warehouse caching", "4.4": "SQL and data transformations", "5.1": "Time Travel, Fail-safe, cloning and replication", "5.2": "Secure sharing, consumers and clean rooms", "5.3": "Marketplace, listings and Native Apps"};
const defaultState=()=>({version:1,cards:{},session:null,sessionArchive:[],history:[],settings:{examDate:'2026-11-19',minutes:5,retention:0.9,haptics:false,dailyNew:16,typing:false},updatedAt:Date.now()});
let state,storageOK=true;
try{let raw=localStorage.getItem(STORAGE_KEY);state=raw?JSON.parse(raw):defaultState();if(state?.version!==1||!state.cards||!state.settings)state=defaultState();}catch(e){storageOK=false;state=defaultState();}
let ui={page:'home',domain:'all',search:'',only:'all',version:'current',objective:'all',drawer:null,activePreview:null,swipeEnabled:true},toastTimer=null,transitioning=false,pointerStart=null;
const $=selector=>document.querySelector(selector);
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const format=s=>esc(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\n/g,'<br>');
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function save(){state.updatedAt=NOW();try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));storageOK=true;}catch(e){storageOK=false;}setSave();}
function setSave(){const el=$('#savedIndicator');if(!el)return;el.classList.toggle('bad',!storageOK);el.querySelector('span').textContent=storageOK?'Saved':'Storage blocked';}
const cardState=id=>state.cards[id]||null;
const reviewed=id=>!!cardState(id)?.reps;
const due=id=>{const v=cardState(id);return v?.reps>0 && v.due<=NOW();};
const weak=id=>{const v=cardState(id);return !!v?.reps&&(v.lapses>0||v.lastGrade<=2||v.difficulty>=7.5);};
const bookmarked=id=>!!cardState(id)?.bookmark;
function allStats(){let seen=0,dueN=0,mastered=0,weakN=0,bookmarks=0,viewed=0,viewedUnrated=0;for(const c of currentCards()){const v=cardState(c.id);if(v?.views)viewed++;if(v?.views&&!v?.reps)viewedUnrated++;if(v?.reps)seen++;if(due(c.id))dueN++;if(v?.reps>=2&&v.stability>=10&&v.lastGrade>=3)mastered++;if(weak(c.id))weakN++;if(v?.bookmark)bookmarks++;}return{seen,due:dueN,new:currentCards().length-seen,mastered,weak:weakN,bookmarks,viewed,viewedUnrated};}
function domainStats(domain){const cards=currentCards().filter(c=>c.domain===domain),count=cards.length,seen=cards.filter(c=>reviewed(c.id)).length;return{count,seen,due:cards.filter(c=>due(c.id)).length,weak:cards.filter(c=>weak(c.id)).length,mastered:cards.filter(c=>{const v=cardState(c.id);return v?.reps>=2&&v.stability>=10&&v.lastGrade>=3;}).length};}
function dateOnly(ms){const d=new Date(ms);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function daysToExam(){if(!state.settings.examDate)return null;const now=new Date(),end=new Date(state.settings.examDate+'T12:00:00');return Math.max(0,Math.ceil((end - new Date(now.getFullYear(),now.getMonth(),now.getDate(),12))/DAY));}
function cardDueLabel(ms){const delta=ms-NOW();if(delta<60000)return'due now';if(delta<3600000)return Math.max(1,Math.ceil(delta/60000))+'m';if(delta<DAY)return Math.max(1,Math.ceil(delta/3600000))+'h';return Math.max(1,Math.round(delta/DAY))+'d';}
function activityMap(){const byDate={};for(const l of state.history){const date=dateOnly(l.time);byDate[date]=(byDate[date]||0)+1;}return byDate;}
function streak(){const a=activityMap();let d=new Date();d.setHours(12,0,0,0);if(!a[dateOnly(d.getTime())])d.setDate(d.getDate()-1);let n=0;while(a[dateOnly(d.getTime())]){n++;d.setDate(d.getDate()-1);}return n;}
function toast(msg){const e=$('#toast');e.textContent=msg;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),2300);}
function haptic(){if(state.settings.haptics&&navigator.vibrate)navigator.vibrate(12);}
function confetti(){if(window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;for(let i=0;i<13;i++){const el=document.createElement('span');el.className='confetti';el.style.setProperty('--dx',`${(Math.random()-.5)*330}px`);el.style.setProperty('--dy',`${(Math.random()-.5)*280}px`);el.style.background=['#88d9c8','#f2c98e','#aabff4','#ffafa9'][i%4];document.body.appendChild(el);setTimeout(()=>el.remove(),800);}}
// FSRS-6 published defaults; with small same-day learning-step safeguards and fixed 90% desired retention.
// See https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm
const W=[0.212,1.2931,2.3065,8.2956,6.4133,0.8334,3.0194,0.001,1.8722,0.1666,0.796,1.4835,0.0614,0.2629,1.6483,0.6014,1.8729,0.5425,0.0912,0.0658,0.1542];
const ratingN={again:1,hard:2,good:3,easy:4};
const initialDifficulty=g=>clamp(W[4]-Math.exp(W[5]*(g-1))+1,1,10);
const forgetCurve=(elapsed,stability)=>Math.pow(1+(Math.pow(.9,-1/W[20])-1)*elapsed/Math.max(.01,stability),-W[20]);
const newInterval=s=>clamp(s/(Math.pow(.9,-1/W[20])-1)*(Math.pow(state.settings.retention,-1/W[20])-1),.01,36500);
function schedule(current,grade,when=NOW()){
 const g=ratingN[grade],old=current||{reps:0,lapses:0};
 let stability,difficulty,intervalDays;
 if(!old.reps){stability=W[g-1];difficulty=initialDifficulty(g);}
 else{
  const elapsed=Math.max(0,(when-old.last)/DAY),R=forgetCurve(elapsed,old.stability),D=old.difficulty;
  difficulty=clamp(W[7]*initialDifficulty(4)+(1-W[7])*(D+(-W[6]*(g-3))*(10-D)/9),1,10);
  if(elapsed<1){
   stability=Math.max(.05,old.stability*Math.exp(W[17]*(g-3+W[18]))*Math.pow(old.stability,-W[19]));
   if(g===1)stability=Math.min(old.stability,.3);
  }else if(g===1){stability=Math.max(.05,W[11]*Math.pow(difficulty,-W[12])*(Math.pow(old.stability+1,W[13])-1)*Math.exp(W[14]*(1-R)));}
  else{let mult=g===2?W[15]:g===4?W[16]:1;stability=Math.max(old.stability,old.stability*(1+Math.exp(W[8])*(11-difficulty)*Math.pow(old.stability,-W[9])*(Math.exp(W[10]*(1-R))-1)*mult));}
 }
 intervalDays=newInterval(stability);
 // A forgotten item returns promptly. Hard is not scheduled *later* than Good on first exposure.
 if(g===1)intervalDays=10/1440;
 if(g===2&&(!old.reps||old.reps<2))intervalDays=Math.min(intervalDays,1);
 if(g===4&&old.reps===0)intervalDays=Math.max(intervalDays,3);
 const dueAt=when+Math.max(60000,Math.round(intervalDays*DAY));
 return{stability,difficulty,intervalDays,due:dueAt};
}
function futureLabels(id){const old=cardState(id);return Object.entries(ratingN).map(([grade])=>({grade,label:cardDueLabel(schedule(old,grade).due)}));}
function setPage(page,opts={}){ui.page=page;if(opts.domain)ui.domain=opts.domain;render();window.scrollTo({top:0,behavior:'instant'});}
function renderNav(){const items=[['home','Today','home'],['decks','Decks','cards'],['browse','Library','search'],['insights','Insights','insights']];const html=items.map(([page,label,ic])=>`<button class="nav-link ${ui.page===page?'active':''}" data-page="${page}" ${ui.page===page?'aria-current="page"':''}>${icon(ic)}<span>${label}</span></button>`).join('');$('#bottomNav').innerHTML=html;$('#desktopNav').innerHTML=html+`<button class="nav-link" data-action="settings">${icon('settings')}<span>Settings</span></button>`;document.body.classList.toggle('in-study',ui.page==='study');}
function render(){renderNav();const m=$('#view');m.innerHTML=ui.page==='home'?renderHome():ui.page==='decks'?renderDecks():ui.page==='browse'?renderBrowse():ui.page==='insights'?renderInsights():ui.page==='coverage'?renderCoverage():ui.page==='sources'?renderSources():ui.page==='study'?renderStudy():renderHome();setSave();}
function examCountdown(){const d=daysToExam();const label=state.settings.examDate?new Date(state.settings.examDate+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric'}):'';return d===null?'Exam date not set':d>0?`${d} day${d===1?'':'s'} to ${label}`:d===0?'Exam day · stay sharp':'Exam date passed';}
function renderHome(){const st=allStats(),remain=daysToExam(),minutes=state.settings.minutes,active=state.session&&!state.session.completedAt&&state.session.index<state.session.queue.length;return `<div class="content"><div class="overline">${new Date().toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'}).toUpperCase()} · THE NEXT REP COUNTS</div><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin:9px 0 21px"><div><h1 style="margin-bottom:7px">Make it<br><span class="serif" style="color:#9ce5d5">stick.</span></h1><div class="countdown-strip"><span class="spark"></span>${esc(examCountdown())}</div></div><div style="text-align:right"><span class="pill green">${st.due?st.due+' due':st.new+' fresh'}</span><div class="small subtle" style="margin-top:7px">${st.seen} rated · ${st.viewed} viewed</div></div></div>
 <section class="hero"><div class="hero-art" aria-hidden="true"><div class="art-card one"></div><div class="art-card two">✳</div><div class="art-dot"></div></div><div class="overline">YOUR DAILY MEMORY RESET</div><h2>${st.due?`${st.due} memories are waiting for you.`:'A few minutes now. Stronger recall later.'}</h2><p>${st.due?`Review what is due, then add new concepts. The hard ones return sooner.`:`Start with the highest-yield Snowflake distinctions. Each card includes a short answer and an optional deep dive.`}</p><button class="btn primary" data-action="${active?'resume':'start'}" data-mode="mix" data-minutes="${minutes}">${icon('spark')} ${active?'Resume your set':`Start ~${minutes}-minute set`} ${icon('arrow')}</button></section>
 <div class="stat-grid"><div class="stat"><span class="stat-label">Due now</span><strong>${st.due}</strong><small>For spaced review</small></div><div class="stat"><span class="stat-label">Still new</span><strong>${st.new}</strong><small>Not rated yet</small></div><div class="stat"><span class="stat-label">Mastered</span><strong>${st.mastered}</strong><small>Delayed recall proved</small></div></div>
 <div class="section-head"><h2>Choose your pace</h2><span class="small subtle">Suggested length · not a timer</span></div><div class="session-presets">${[2,5,10].map(n=>`<button class="preset ${minutes===n?'active':''}" data-minutes-select="${n}" aria-pressed="${minutes===n}">${n} min <span class="subtle">· ${limitFor(n)} cards</span></button>`).join('')}</div>
 <div class="modes"><button class="mode" data-action="start" data-mode="mix"><span class="mode-icon">${icon('flip')}</span><strong>Smart review</strong><small>Due + new, mixed topics</small></button><button class="mode" data-action="start" data-mode="weak"><span class="mode-icon">${icon('bolt')}</span><strong>Exam sprint</strong><small>Weak spots + high yield</small></button><button class="mode" data-action="start" data-mode="sql"><span class="mode-icon">${icon('book')}</span><strong>Write the SQL</strong><small>Recall exact syntax first</small></button></div>
 <div class="section-head"><h2>Focus by domain</h2><button class="btn small quiet" data-page="decks">All decks ${icon('arrow')}</button></div><div class="focus-grid">${Object.entries(DOMAINS).map(([k,v])=>{const t=domainStats(k);return `<button class="focus-card" data-domain="${k}" data-action="focus"><span class="overline" style="color:${v.color};font-size:9px">DOMAIN ${['architecture','governance','loading','performance','sharing'].indexOf(k)+1}</span><div class="number">${t.count}<span class="small subtle"> cards</span></div><div class="t">${esc(v.name)}</div><small>${t.seen} studied · ${t.due} due</small><div class="bar" style="margin-top:12px"><span style="width:${Math.round(100*t.seen/t.count)}%"></span></div></button>`}).join('')}</div>
 <div class="archive-strip"><div><b>${currentCards().length} current cards · ${legacyCards().length} historical</b><span>Review the objective map and see which publicly available exam sources exist.</span></div><div class="archive-actions"><button class="btn small quiet" data-page="coverage">Coverage map →</button><button class="btn small quiet" data-page="sources">Question sources ↗</button></div></div><div class="footer-note">Designed for actual recall, not just familiar-looking answers. Scheduled intervals are estimates, not a guarantee of exam readiness. Private progress is saved in this browser after every rating.</div></div>`;}
function renderDecks(){const st=allStats();return `<div class="content"><span class="overline">YOUR STUDY LIBRARY</span><h1 style="margin:9px 0 11px">Study by <span class="serif" style="color:#9ce5d5">topic.</span></h1><p class="muted">${currentCards().length} current COF-C03 cards plus ${legacyCards().length} clearly labeled historical cards. Choose a domain, browse its cards, or run a focused recall set.</p><div class="stat-grid"><div class="stat"><span class="stat-label">All cards</span><strong>${CARD_BANK.length}</strong></div><div class="stat"><span class="stat-label">Reviewed</span><strong>${st.seen}</strong></div><div class="stat"><span class="stat-label">Saved</span><strong>${st.bookmarks}</strong></div></div><div class="section-head"><h2>Five knowledge decks</h2></div><div class="deck-grid">${Object.entries(DOMAINS).map(([id,v])=>{const s=domainStats(id);return `<button class="deck-card" data-domain="${id}" data-page="browse"><span class="emoji" style="color:${v.color}">${icon(v.icon)}</span><strong>${esc(v.name)}</strong><small>${s.count} cards · ${s.seen} studied · ${s.due} due</small><div class="bar"><span style="width:${100*s.seen/s.count}%"></span></div></button>`}).join('')}</div><div class="archive-strip"><div><b>Cover all 19 published COF-C03 objectives</b><span>The map separates represented topics from verified exam-question coverage.</span></div><div class="archive-actions"><button class="btn small quiet" data-page="coverage">Open coverage map →</button><button class="btn small quiet" data-collection="historical">COF-C01/C02 history →</button></div></div><div class="section-head"><h2>Quick collections</h2></div><div class="modes"><button class="mode" data-collection="bookmarked"><span class="mode-icon">${icon('star')}</span><strong>Saved cards</strong><small>Personally flagged for review</small></button><button class="mode" data-collection="weak"><span class="mode-icon">${icon('bolt')}</span><strong>Hard cards</strong><small>Missed or rated hard</small></button><button class="mode" data-collection="new"><span class="mode-icon">${icon('spark')}</span><strong>Not yet seen</strong><small>Start exploring</small></button></div></div>`;}
function filteredCards(){return CARD_BANK.filter(c=>(ui.version==='all'||(ui.version==='current'?c.status!=='legacy':c.status==='legacy'))&&(ui.objective==='all'||c.objective===ui.objective)&&(ui.domain==='all'||c.domain===ui.domain)&&(ui.only==='all'||ui.only==='bookmarked'&&bookmarked(c.id)||ui.only==='weak'&&weak(c.id)||ui.only==='new'&&!reviewed(c.id)||ui.only==='due'&&due(c.id))&&(!ui.search||(`${c.front} ${c.back} ${c.tag} ${c.domain} ${c.objective||''}`).toLowerCase().includes(ui.search.toLowerCase())));}
function renderBrowse(){const cards=filteredCards();return `<div class="content"><span class="overline">EXPLORE EVERYTHING</span><h1 style="margin:8px 0 10px">Knowledge, <span class="serif" style="color:#a3e3d6">on demand.</span></h1><p class="muted">Search a parameter, browse by domain, and pin the tricky distinctions. You can open any card to study it.</p><div class="toolbar"><input class="field search" id="cardSearch" type="search" placeholder="Search functions, topics, or commands…" value="${esc(ui.search)}" aria-label="Search flashcards"><select class="field" id="domainFilter" aria-label="Filter domain"><option value="all" ${ui.domain==='all'?'selected':''}>All domains</option>${Object.entries(DOMAINS).map(([k,v])=>`<option value="${k}" ${ui.domain===k?'selected':''}>${esc(v.short)}</option>`).join('')}</select><select class="field" id="versionFilter" aria-label="Filter exam version"><option value="current" ${ui.version==='current'?'selected':''}>Current · COF-C03</option><option value="legacy" ${ui.version==='legacy'?'selected':''}>Historical · C01/C02</option><option value="all" ${ui.version==='all'?'selected':''}>All versions</option></select></div><div class="session-presets" style="margin-top:5px">${[['all','All'],['due','Due'],['new','New'],['weak','Needs work'],['bookmarked','Saved']].map(([k,v])=>`<button data-only="${k}" class="preset ${ui.only===k?'active':''}" aria-pressed="${ui.only===k}">${v}</button>`).join('')}</div><div class="section-head"><h2>${cards.length} matching cards</h2><button class="btn small" data-action="start-filtered" ${!cards.length?'disabled':''}>Study results ${icon('arrow')}</button></div><div class="card-list">${cards.length?cards.map(c=>`<button class="list-card" data-preview="${c.id}"><span style="flex:1"><small>${esc(DOMAINS[c.domain].short.toUpperCase())} · ${esc(c.objective||'Core')} · ${esc(c.tag)} ${c.status==='legacy'?' · HISTORICAL':''}</small><strong>${esc(c.front)}</strong></span><span class="arrow">↗</span></button>`).join(''):'<div class="empty"><div class="empty-illustration">✳</div>No matching cards. Try another search or filter.</div>'}</div></div>`;}
function activityHTML(){const values=activityMap();const today=new Date();today.setHours(12,0,0,0);let html='';for(let i=20;i>=0;i--){const day=new Date(today);day.setDate(day.getDate()-i);const n=values[dateOnly(day.getTime())]||0;html+=`<i class="${n>0?(n>=15?'l3':n>=5?'l2':'l1'):''}" title="${dateOnly(day.getTime())}: ${n} reviews" aria-label="${dateOnly(day.getTime())}: ${n} reviews"></i>`;}return html;}
function sessionHistoryHTML(){
 const current=state.session?{...state.session,ratedCount:state.session.rated.length,viewedCount:state.session.viewedIds?.length||0,completed:!!state.session.completedAt}:null;
 const recent=[...(current?[current]:[]),...(state.sessionArchive||[]).slice(-5).reverse()];
 if(!recent.length)return '';
 const labels={mix:'Smart review',weak:'Exam sprint',sql:'Write the SQL',filtered:'Custom set',single:'Single card',saved:'Saved cards'};
 return `<div class="section-head"><h2>Recent study sets</h2><span class="pill neutral">Ratings remain saved</span></div><div class="panel">${recent.map((x,i)=>`<div class="check-row"><div><b>${esc(labels[x.mode]||'Study set')} · ${x.queue?.length||0} cards</b><br><small>${x.viewedCount||0} viewed · ${x.ratedCount||0} rated · ${new Date(x.beganAt).toLocaleDateString()}</small></div><span class="pill ${x.completed?'green':'sand'}">${x.completed?'Finished':i===0&&current?'In progress':'Ended early'}</span></div>`).join('')}</div>`;
}
function renderInsights(){const st=allStats(),total=state.history.length,last=state.history.slice(-30),good=last.filter(l=>l.grade>=3).length,accuracy=last.length?Math.round(good/last.length*100):null;return `<div class="content"><span class="overline">PROGRESS OVER PERFECTION</span><h1 style="margin:9px 0 12px">The memory <span class="serif" style="color:#a1e4d7">map.</span></h1><p class="muted">Measure retention and consistency, not just how fast you flip. Mastery requires successful reviews over time.</p><div class="insight-hero"><span class="overline">YOUR RECALL JOURNEY</span><strong>${total.toLocaleString()}</strong><div class="small muted">Review ratings across ${st.seen} rated concepts · ${st.viewed} cards opened (${st.viewedUnrated} viewed but not rated) · ${st.mastered} mastered</div><div class="stat-split"><div><strong>${st.weak}</strong><small>Concepts needing attention</small></div><div><strong>${accuracy===null?'—':accuracy+'%'}</strong><small>Recent Good/Easy ratings</small></div></div></div><div class="study-note" style="margin-top:15px">Flipping or swiping records a card as viewed. Again / Hard / Good / Easy records the review and updates the memory schedule. A 5-minute set is a suggestion (16 cards), not a countdown. Your rated progress is saved after every answer.</div><div class="section-head"><h2>Last 21 days</h2><span class="pill neutral">${streak()} day${streak()===1?'':'s'} active</span></div><div class="panel"><div class="review-map">${activityHTML()}</div><div class="heatmap-key"><span class="swatch"></span> One or more reviews · darker means fewer</div></div><div class="section-head"><h2>Domain mastery</h2></div><div class="panel">${Object.entries(DOMAINS).map(([k,v])=>{const s=domainStats(k);return `<div class="progress-row"><div class="prog-label"><span>${esc(v.name)}</span><span>${s.seen}/${s.count} seen · ${s.mastered} mastered</span></div><div class="bar"><span style="width:${Math.round(100*s.seen/s.count)}%"></span></div></div>`}).join('')}</div>${sessionHistoryHTML()}<div class="section-head"><h2>Review activity</h2></div>${total?`<div class="panel">${state.history.slice(-8).reverse().map(l=>{const c=C.get(l.id);return `<div class="check-row"><div><b>${esc(c?.tag||'Review')}</b><br><small>${esc(c?.front.slice(0,54)||'')} · ${new Date(l.time).toLocaleDateString()}</small></div><span class="pill ${l.grade===1?'coral':l.grade===2?'sand':'green'}">${['','Again','Hard','Good','Easy'][l.grade]}</span></div>`}).join('')}</div>`:'<div class="empty">Start your first set to build a meaningful recall history.</div>'}<div class="footer-note">The review intervals use default FSRS-6 parameters with short-learning-step safeguards. They are not optimized on your personal history yet. The app never claims a predicted official Snowflake score.</div></div>`;}
function renderCoverage(){const cards=currentCards(),groups=Object.entries(OBJECTIVES).map(([id,title])=>{const items=cards.filter(c=>c.objective===id),done=items.filter(c=>reviewed(c.id)).length;const pct=items.length?Math.round(done/items.length*100):0;return `<button class="objective-card" data-objective="${id}"><div class="objective-head"><b>${esc(id)} · ${esc(title)}</b><span>${done}/${items.length} reviewed</span></div><div class="bar"><span style="width:${pct}%"></span></div><small>${items.length} dedicated original prompts · click to study them</small></button>`}).join('');return `<div class="content"><span class="overline">C03 · OFFICIAL OBJECTIVE MAP</span><h1 style="margin:9px 0 12px">Coverage you can <span class="serif" style="color:#9ce5d5">verify.</span></h1><p class="muted">Every one of the 19 published COF-C03 objectives has dedicated recall cards. That shows <strong>objective representation, not proof of every possible real exam question.</strong> The original 162 cards also contribute to study but predate per-card objective tags.</p><div class="stat-grid"><div class="stat"><span class="stat-label">Published objectives</span><strong>${Object.keys(OBJECTIVES).length}</strong><small>July 2026 guide</small></div><div class="stat"><span class="stat-label">Current cards</span><strong>${cards.length}</strong><small>C03 study queue</small></div><div class="stat"><span class="stat-label">Legacy cards</span><strong>${legacyCards().length}</strong><small>Optional C01/C02</small></div></div><div class="section-head"><h2>Browse each objective</h2><button class="btn small quiet" data-page="sources">Question sources →</button></div><div class="objective-list">${groups}</div><div class="archive-strip"><div><b>Official source of truth</b><span>Compare cards with the July 2026 SnowPro Core Exam Study Guide.</span></div><a href="https://learn.snowflake.com/en/certifications/snowpro-core-c03/" class="btn small quiet" target="_blank" rel="noopener noreferrer">Snowflake guide ↗</a></div></div>`;}
function renderSources(){const links=[['Official COF-C03 guide and sample questions','Snowflake · current · includes 5 published sample questions','https://learn.snowflake.com/en/certifications/snowpro-core-c03/'],['Official SnowPro Core practice exam','Snowflake · optional paid exam; practice items are not the live exam','https://learn.snowflake.com/en/certifications/snowpro-practice-exams/'],['SnowPro Core certification prep course','Snowflake University · free course with knowledge checks','https://learn.snowflake.com/en/courses/OD-COREPREP/'],['Our original 100-question hard mock exam','SnowPro Exam Lab · original authored scenarios','https://paksue.github.io/sand_box/snowpro-cof-c03-exam-lab/'],['Public COF-C03 practice examples','CertSafari · independent, with sources and explanations','https://www.certsafari.com/snowflake/snowpro-core-certification-c03'],['Older COF-C02 public study guide','Historical guide · for comparison only; check modern answer validity','https://www.bene.haus/assets/documents/snowflake/COF-CO2_SnowProCoreStudyGuide_090922.pdf']];return `<div class="content"><span class="overline">SOURCED QUESTION LIBRARY</span><h1 style="margin:9px 0 12px">What exists. <span class="serif" style="color:#9ce5d5">What doesn't.</span></h1><p class="muted">Snowflake has not published the complete pool of real certification questions. These are legitimate study sources and independently authored examples. We do not reproduce unauthorized exam dumps or claim to know every live question.</p><div class="source-list">${links.map(([title,sub,url])=>`<a class="source-card" href="${url}" target="_blank" rel="noopener noreferrer"><strong>${esc(title)}</strong><small>${esc(sub)}</small><span>Open reference ↗</span></a>`).join('')}</div><div class="archive-strip"><div><b>Current vs historical</b><span>Historical COF-C01/COF-C02 cards are separate from your default COF-C03 daily queue.</span></div><button class="btn small quiet" data-collection="historical">Explore legacy cards →</button></div><div class="archive-strip"><div><b>Want to contribute a question source?</b><span>Save or cite a legitimately published source, or use your own practice-bank export. Copyrighted third-party banks are not automatically redistributed.</span></div><button class="btn small quiet" data-page="coverage">Coverage map →</button></div></div>`;}
// Recent sets include *unrated* cards. Otherwise switching modes repeatedly
// replays the same high-priority prompts because those prompts have no review history.
function recentQueueIds(){
 const prior=(state.sessionArchive||[]).slice(-2).flatMap(x=>x.queue||[]);
 return new Set([...(state.session?.queue||[]),...prior]);
}
function preferUnseenSet(items,recent){
 return [...items.filter(x=>!recent.has(x.id)),...items.filter(x=>recent.has(x.id))];
}
function selectQueue(mode='mix',domain='all',limit=null){
 let cards=currentCards().filter(c=>domain==='all'||c.domain===domain);
 if(mode==='sql')cards=cards.filter(c=>c.kind==='sql');
 if(mode==='filtered')cards=filteredCards();
 if(mode==='saved')cards=cards.filter(c=>bookmarked(c.id));
 const recent=recentQueueIds(),max=limit||limitFor(state.settings.minutes);
 const orderedByPriority=(items)=>items.sort((a,b)=>(b.priority||1)-(a.priority||1)||hash(a.id+'order')-hash(b.id+'order'));
 if(mode==='weak'){
  const struggling=cards.filter(c=>weak(c.id)).sort((a,b)=>(cardState(b.id)?.lapses||0)-(cardState(a.id)?.lapses||0)||(cardState(a.id)?.due||0)-(cardState(b.id)?.due||0));
  const highYield=orderedByPriority(cards.filter(c=>!reviewed(c.id)&&(c.priority||1)>=3));
  const extra=orderedByPriority(cards.filter(c=>!reviewed(c.id)&&(c.priority||1)<3));
  const practiced=cards.filter(c=>reviewed(c.id)&&!weak(c.id)).sort((a,b)=>(cardState(a.id)?.due||0)-(cardState(b.id)?.due||0));
  cards=[...preferUnseenSet(struggling,recent),...preferUnseenSet(highYield,recent),...preferUnseenSet(extra,recent),...preferUnseenSet(practiced,recent)];
 }else if(mode==='filtered'||mode==='saved'){
  cards=preferUnseenSet(cards,recent);
 }else{
  const overdue=cards.filter(c=>due(c.id)).sort((a,b)=>cardState(a.id).due-cardState(b.id).due);
  const newToday=new Set(state.history.filter(log=>dateOnly(log.time)===dateOnly(NOW())&&log.wasNew).map(log=>log.id));
  const dailyRemaining=Math.max(0,(state.settings.dailyNew||16)-newToday.size);
  // The daily new preference is a *suggestion*. Explicitly starting another
  // set should not force already-reviewed future-due cards ahead of all new cards.
  const freshCount=Math.max(max,dailyRemaining);
  const newcomers=preferUnseenSet(orderedByPriority(cards.filter(c=>!reviewed(c.id))),recent);
  const fresh=interleaveByDomain(newcomers.slice(0,freshCount));
  const upcoming=cards.filter(c=>reviewed(c.id)&&!due(c.id)).sort((a,b)=>cardState(a.id).due-cardState(b.id).due);
  cards=[...preferUnseenSet(overdue,recent),...fresh,...preferUnseenSet(upcoming,recent),...newcomers.slice(freshCount)];
 }
 return [...new Map(cards.map(c=>[c.id,c])).values()].slice(0,max).map(c=>c.id);
}
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function interleaveByDomain(cards){const grouped={};for(const c of cards)(grouped[c.domain]??=[]).push(c);const order=['loading','performance','architecture','governance','sharing'],out=[];while(out.length<cards.length){for(const d of order){if(grouped[d]?.length)out.push(grouped[d].shift());}}return out;}
function limitFor(mins){return mins===2?7:mins===10?32:16;}
function begin(mode,domain='all',limit=null,queue=null){
 const previous=state.session;
 if(previous&&!previous.completedAt&&previous.index<previous.queue.length){
  if(!confirm(`Start a different set? ${previous.rated.length} ratings will stay recorded. The unfinished set will appear in Insights, but it cannot be resumed after replacement. Choose Resume instead if you want to continue it.`))return;
 }
 const ids=queue||selectQueue(mode,domain,limit||limitFor(state.settings.minutes));
 if(!ids.length){toast('No cards match this collection');return;}
 if(previous){
  state.sessionArchive=Array.isArray(state.sessionArchive)?state.sessionArchive:[];
  if(!state.sessionArchive.some(x=>x.id===previous.id)){
   state.sessionArchive.push({id:previous.id,mode:previous.mode,domain:previous.domain,queue:previous.queue.slice(),ratedCount:previous.rated.length,viewedCount:previous.viewedIds?.length||0,beganAt:previous.beganAt,endedAt:NOW(),completed:!!previous.completedAt});
   state.sessionArchive=state.sessionArchive.slice(-30);
  }
 }
 state.session={id:'r'+NOW(),mode,domain,queue:ids,index:0,rated:[],beganAt:NOW(),revealed:false,completedAt:null,draft:'',retried:{},panelIndex:0,variationRevealed:{},viewedIds:[],skipped:0};
 save();ui.page='study';render();
}
function current(){const s=state.session;return s?C.get(s.queue[s.index]):null;}
function completeSession(){const s=state.session;if(!s||s.completedAt)return;s.completedAt=NOW();save();render();confetti();}
function closeSession(){ui.page='home';render();}
function reveal(){
 const s=state.session,c=current();if(!s||!c||s.revealed)return;
 s.revealed=true;s.panelIndex=0;
 s.viewedIds=Array.isArray(s.viewedIds)?s.viewedIds:[];
 if(!s.viewedIds.includes(c.id)){
  s.viewedIds.push(c.id);
  const old=cardState(c.id)||{};
  state.cards[c.id]={...old,viewedAt:NOW(),views:(old.views||0)+1};
 }
 save();haptic();renderStudyInPlace();
}
// Deep exploration stays within the *same* card. The 405-card corpus supplies real
// nearby contrast questions instead of a fabricated generic explanation.
function relatedVariations(c){
 const terms=(c.related||[]).map(x=>String(x).trim().toLowerCase()).filter(x=>x.length>2);
 const candidates=CARD_BANK.filter(x=>x.id!==c.id&&x.domain===c.domain&&((x.status==='legacy')===(c.status==='legacy'))&&x.front!==c.front&&x.back!==c.back);
 return candidates.map(x=>{
  const hay=(x.front+' '+x.back+' '+x.tag).toLowerCase();
  const exact=terms.some(t=>hay.includes(t));
  const similarity=x.tag===c.tag;
  const objective=!!c.objective&&c.objective===x.objective;
  const score=(exact?50:0)+(similarity?25:0)+(objective?5:0)+(x.priority||1);
  return{x,score,eligible:exact||similarity};
 }).filter(o=>o.eligible).sort((a,b)=>b.score-a.score||a.x.id.localeCompare(b.x.id)).slice(0,2).map(o=>o.x);
}
function explorationPanels(c){
 const panels=[{type:'answer',title:'The answer',id:'answer'},{type:'why',title:'How it works',id:'why'}];
 if(c.code&&c.code.trim())panels.push({type:'code',title:'SQL / syntax',id:'code'});
 panels.push({type:'trap',title:'Exam trap',id:'trap'});
 for(const v of relatedVariations(c))panels.push({type:'variation',title:'Try a variation',id:'variation-'+v.id,card:v});
 panels.push({type:'reference',title:'Reference',id:'reference'});
 return panels;
}
function exploreBack(c,s,panels){
 const index=clamp(Number(s.panelIndex)||0,0,panels.length-1),p=panels[index];
 const top=`<div class="face-top"><span>${esc(p.title)} · ${index+1}/${panels.length}</span><span class="flash-symbol">${p.type==='answer'?'✧':p.type==='variation'?'◇':'✦'}</span></div>`;
 let center='',bottom='';
 if(p.type==='answer'){
  center=`<div class="flash-center"><div class="flash-answer ${c.back.length>65?'compact':''}">${format(c.back)}</div><p class="flash-excerpt">${esc(c.why)}</p></div>`;
  bottom=`<div class="face-bottom"><span>Swipe left for deeper learning</span><span>↻ tap to flip</span></div>`;
 }else if(p.type==='why'){
  center=`<div class="explore-content"><span class="explore-kicker">01 · UNDERSTAND</span><h3>Why this works</h3><p>${format(c.why)}</p><div class="explore-takeaway"><b>Remember</b><span>${format(c.back)}</span></div></div>`;
  bottom=`<div class="face-bottom"><span>Mechanism, not just memorization</span><span>← swipe →</span></div>`;
 }else if(p.type==='code'){
  center=`<div class="explore-content"><span class="explore-kicker">02 · EXACT SYNTAX</span><h3>See it in SQL</h3><pre class="explore-code">${esc(c.code)}</pre><p class="explore-caption">Read the exact names, arguments and punctuation. Practice writing it from memory.</p></div>`;
  bottom=`<div class="face-bottom"><span>Exact syntax matters on COF-C03</span><span>← swipe →</span></div>`;
 }else if(p.type==='trap'){
  center=`<div class="explore-content"><span class="explore-kicker">03 · WATCH OUT</span><h3>The exam trap</h3><div class="explore-trap">${format(c.trap)}</div><p class="explore-caption">What changes the answer? Look for the specific constraint or near-identical option.</p></div>`;
  bottom=`<div class="face-bottom"><span>Spot the plausible wrong choice</span><span>← swipe →</span></div>`;
 }else if(p.type==='variation'){
  const v=p.card,visible=!!(s.variationRevealed||{})[p.id];
  center=`<div class="explore-content variation-content"><span class="explore-kicker">04 · APPLY IT DIFFERENTLY</span><h3>Related challenge</h3><p class="variation-question">${esc(v.front)}</p>${visible?`<div class="variation-solution"><strong>${format(v.back)}</strong><p>${esc(v.why)}</p></div>`:`<div class="variation-placeholder">Recall the answer before you reveal it.</div>`}</div>`;
  bottom=`<div class="face-bottom"><span>${visible?'Swipe for more':'Tap to reveal the variation'}</span><span>${visible?'← swipe →':'✦ test yourself'}</span></div>`;
 }else{
  center=`<div class="explore-content"><span class="explore-kicker">05 · CONNECT & VERIFY</span><h3>Put it in context</h3><p>${esc(c.tag)} · ${esc(DOMAINS[c.domain].name)}</p>${c.related?.length?`<div class="explore-tags">${c.related.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:''}<p class="explore-caption">Official Snowflake documentation and your personal notes are available in Learn more below.</p><a class="explore-doc-link" href="${esc(c.doc)}" target="_blank" rel="noopener noreferrer">Read official documentation ↗</a></div>`;
  bottom=`<div class="face-bottom"><span>All panels complete — rate when ready</span><span>${index+1}/${panels.length}</span></div>`;
 }
 return top+center+bottom;
}
function explorationNav(c,s,panels){
 if(!s.revealed)return'';
 const index=clamp(Number(s.panelIndex)||0,0,panels.length-1);
 return `<div class="explore-navigation" aria-label="Explore this topic"><button class="panel-arrow" data-panel-step="-1" aria-label="Previous learning panel" ${index===0?'disabled':''}>‹</button><div class="panel-navigation-center"><div class="panel-dots" role="group" aria-label="Learning panels">${panels.map((p,i)=>`<button class="panel-dot ${i===index?'active':''}" data-panel-index="${i}" aria-label="${esc(p.title)}, panel ${i+1} of ${panels.length}" ${i===index?'aria-current="step"':''}></button>`).join('')}</div><span class="panel-name">${esc(panels[index].title)} · ${index+1} of ${panels.length}</span></div><button class="panel-arrow" data-panel-step="1" aria-label="Next learning panel" ${index===panels.length-1?'disabled':''}>›</button></div>`;
}
function movePanel(index){const s=state.session,c=current();if(!s?.revealed||!c||ui.page!=='study')return;
 const panels=explorationPanels(c),next=clamp(index,0,panels.length-1),previous=Number(s.panelIndex)||0;
 if(next===previous)return;s.panelIndex=next;save();haptic();renderStudyInPlace({slide:next>previous?1:-1});
}
function tapFlashcard(){const s=state.session,c=current();if(!s||!c)return;
 if(!s.revealed){reveal();return;}
 const panels=explorationPanels(c),p=panels[clamp(Number(s.panelIndex)||0,0,panels.length-1)];
 if(p.type==='variation'){
  s.variationRevealed=s.variationRevealed||{};
  s.variationRevealed[p.id]=!s.variationRevealed[p.id];save();renderStudyInPlace();return;
 }
 if(p.type==='answer'){s.revealed=false;s.panelIndex=0;save();haptic();renderStudyInPlace();}
}
function renderStudy(){const s=state.session;if(!s)return `<div class="content"><h1>Start a recall session</h1><button class="btn primary" data-action="start" data-mode="mix">Start 5-minute review</button></div>`;
 if(s.index>=s.queue.length || s.completedAt)return renderCompletion();
 const c=current(),flipped=s.revealed,panels=explorationPanels(c),index=clamp(Number(s.panelIndex)||0,0,panels.length-1),est=Math.round((s.index/s.queue.length)*100),isTyping=s.mode==='sql';
 return `<div class="study-page"><div class="study-top"><button class="icon-btn" data-action="close-study" aria-label="Close session">${icon('close')}</button><div class="study-head"><span class="overline">${esc(s.mode==='sql'?'WRITE THE SQL':s.mode==='weak'?'EXAM SPRINT':'SMART RECALL')}</span><b>${s.index+1} of ${s.queue.length} · ${s.rated.length} rated</b></div><span class="pill ${due(c.id)?'sand':'green'}">${due(c.id)?'Due':reviewed(c.id)?'Practice':'New'}</span></div><div class="study-meter" role="progressbar" aria-valuenow="${s.index}" aria-valuemin="0" aria-valuemax="${s.queue.length}"><span style="width:${est}%"></span></div>
 <div class="flash-scene ${flipped?'explore-scene':''}" id="flashScene" data-card-id="${c.id}" data-panel-index="${index}" role="button" tabindex="0" aria-label="${!flipped?'Flashcard question. Tap to reveal answer.':index===0?'Answer revealed. Tap to flip back, or swipe left to learn more.':panels[index].type==='variation'?'Related challenge. Tap to reveal its answer or swipe to explore.':'Explore '+esc(panels[index].title)+'. Swipe left or right to navigate.'}"><div class="card-stack"></div><div class="flip-card ${flipped?'flipped':''}" id="flipCard"><article class="flash-face front-face"><div class="face-top"><span>${esc(DOMAINS[c.domain].short)} · ${esc(c.tag)}</span><span class="flash-symbol">✳</span></div><div class="flash-center"><div class="flash-question ${c.front.length>112?'compact':''}">${esc(c.front)}</div></div><div class="face-bottom"><span class="card-call">${icon('flip')} Tap to reveal</span><span>${c.priority>=3?'HIGH YIELD':'CORE REVIEW'}</span></div></article><article class="flash-face back-face">${exploreBack(c,s,panels)}</article></div></div>
 ${explorationNav(c,s,panels)}
 ${isTyping&&!flipped?`<textarea class="type-answer" id="typedDraft" placeholder="Recall the function or write the syntax here, then flip…" aria-label="Write your answer first">${esc(s.draft||'')}</textarea>`:''}
 <div class="card-status">${flipped?`Swipe to explore. Choose a rating to record your recall.`:'Tap to explore; only a recall rating marks a review complete.'}</div>
 <div class="rating-wrap">${flipped?`<div class="rating-label">HOW WELL DID YOU REMEMBER? · YOUR RATING AUTOSAVES</div><div class="rating-grid">${futureLabels(c.id).map(({grade,label})=>`<button class="rating ${grade}" data-grade="${grade}"><strong>${grade[0].toUpperCase()+grade.slice(1)}</strong><small>${label}</small></button>`).join('')}</div>`:`<button class="btn primary full" data-action="reveal">Reveal answer ${icon('flip')}</button>`}</div><div class="study-tools"><button class="btn quiet small" data-action="bookmark" data-id="${c.id}">${bookmarked(c.id)?'★ Saved':'☆ Save'}</button>${flipped?`<button class="btn quiet small" data-action="details" data-id="${c.id}">${icon('book')} Notes & sources</button>`:''}<button class="btn quiet small" data-action="skip">Skip ${icon('arrow')}</button></div></div>`;
}
// Preserve the physical card node so revealing it animates the 3D rotation,
// and changing panels animates horizontally without resetting the whole session.
function renderStudyInPlace({slide=0}={}){
 if(ui.page!=='study')return;
 const old=$('#flashScene'),oldIndex=Number(old?.dataset.panelIndex||0),wasFlipped=old?.querySelector('#flipCard')?.classList.contains('flipped');
 $('#view').innerHTML=renderStudy();
 const fresh=$('#flashScene');
 if(!old||!fresh||old.dataset.cardId!==fresh.dataset.cardId)return;
 old.querySelector('.back-face').innerHTML=fresh.querySelector('.back-face').innerHTML;
 old.dataset.panelIndex=fresh.dataset.panelIndex;
 old.setAttribute('aria-label',fresh.getAttribute('aria-label'));
 old.classList.toggle('explore-scene',state.session?.revealed===true);
 fresh.replaceWith(old);
 if(slide&&oldIndex!==Number(old.dataset.panelIndex)){
  const face=old.querySelector('.back-face');
  face.classList.remove('swipe-enter-right','swipe-enter-left');
  void face.offsetWidth;
  face.classList.add(slide>0?'swipe-enter-right':'swipe-enter-left');
 }
 const flipped=!!state.session?.revealed,flip=old.querySelector('#flipCard');
 if(flipped!==wasFlipped){requestAnimationFrame(()=>{if(flip.isConnected)flip.classList.toggle('flipped',flipped);});}
}

function renderCompletion(){const s=state.session;if(!s)return'';const total=s.rated.length,good=s.rated.filter(x=>x.grade>=3).length,again=s.rated.filter(x=>x.grade===1).length;return `<div class="content completion"><div class="overline">A LITTLE BETTER THAN BEFORE</div><div class="big-star pop">✳</div><h1>That memory work<br><span style="color:#9ae5d5">adds up.</span></h1><p class="muted">You completed your set. Review the hard concepts again when they're due. The strongest knowledge survives a delay.</p><div class="completion-stats"><div><strong>${total}</strong><small>Review ratings</small></div><div><strong>${good}</strong><small>Good / Easy</small></div><div><strong>${s.skipped||0}</strong><small>Skipped (unrated)</small></div></div><div class="btn-row" style="justify-content:center"><button class="btn primary" data-action="start" data-mode="mix">Another quick set ${icon('arrow')}</button><button class="btn" data-page="insights">See progress</button></div></div>`;}
function gradeCurrent(grade){const s=state.session,c=current();if(!s||!c||!s.revealed||transitioning)return;const currentState=cardState(c.id)||{reps:0,lapses:0,bookmark:false,note:''},prev=currentState.lastGrade;const out=schedule(currentState,grade),g=ratingN[grade];state.cards[c.id]={...currentState,...out,reps:(currentState.reps||0)+1,lapses:(currentState.lapses||0)+(g===1?1:0),lastGrade:g,last:NOW()};const log={id:c.id,time:NOW(),grade:g,interval:out.intervalDays,mode:s.mode,wasNew:!currentState.reps};state.history.push(log);s.rated.push(log);if(g===1&&!s.retried[c.id]&&s.queue.length<55){s.retried[c.id]=true;s.queue.splice(Math.min(s.index+4,s.queue.length),0,c.id);}
 s.index++;s.revealed=false;s.panelIndex=0;s.variationRevealed={};s.draft='';if(s.index>=s.queue.length)s.completedAt=NOW();save();haptic();if(g>=3&&prev===1){confetti();toast('You recovered a previously missed concept ✦');}else if(g===1)toast('Again recorded · this card returns soon');else toast(`${grade[0].toUpperCase()+grade.slice(1)} recorded · ${s.rated.length} ratings saved`);render();}
function studySkip(){const s=state.session;if(!s)return;s.skipped=(s.skipped||0)+1;s.index++;s.revealed=false;s.panelIndex=0;s.variationRevealed={};s.draft='';if(s.index>=s.queue.length)s.completedAt=NOW();save();render();}
function detailsHTML(c,preview=false){const st=cardState(c.id)||{};return `<div class="sheet-backdrop" data-action="close-layer"></div><section class="sheet" role="dialog" aria-modal="true" aria-label="Card deep dive"><div class="sheet-handle"></div><div class="sheet-head"><div><div class="overline">${esc(DOMAINS[c.domain].name)} · ${esc(c.objective||'Core')} · ${esc(c.tag)} ${c.status==='legacy'?'· HISTORICAL':''}</div><h2>${preview?'Explore this card':'Go one layer deeper.'}</h2></div><button class="icon-btn" data-action="close-layer" aria-label="Close">${icon('close')}</button></div><div class="sheet-section"><h3>Recall prompt</h3><p style="font-family:var(--serif);font-size:22px;color:#f0faf8">${esc(c.front)}</p></div><div class="sheet-section"><h3>Quick answer</h3><p style="font-size:18px;color:#aeead8;font-weight:700">${format(c.back)}</p></div><div class="sheet-section"><h3>Understand why</h3><p>${esc(c.why)}</p></div>${c.code?`<div class="sheet-section"><h3>Snowflake SQL / syntax</h3><pre class="code-block">${esc(c.code)}</pre></div>`:''}<div class="sheet-section"><h3>Common exam trap</h3><div class="warning-note">${esc(c.trap)}</div></div>${c.related?.length?`<div class="sheet-section"><h3>Connect the ideas</h3><div class="chip-row">${c.related.map(s=>`<button class="chip" data-related="${esc(s)}">${esc(s)} ↗</button>`).join('')}</div></div>`:''}<div class="sheet-section"><h3>Coverage and origin</h3><p>${c.status==='legacy'?'Historical COF-C01/COF-C02 context. This may no longer be an active COF-C03 objective.':'Current COF-C03 study concept.'} ${c.objective&&c.objective!=='Legacy'?'Official objective '+esc(c.objective)+'.':''} This is an original recall prompt, not a confidential certification question.</p></div><div class="sheet-section"><h3>Official documentation</h3><a class="link-chip" href="${esc(c.doc)}" target="_blank" rel="noopener noreferrer">Snowflake documentation ↗</a></div><div class="sheet-section"><h3>Your note</h3><textarea class="note-editor" id="cardNote" data-id="${c.id}" placeholder="Why did you miss this? A short memory hook…">${esc(st.note||'')}</textarea></div><div class="btn-row" style="margin-bottom:8px"><button class="btn ${bookmarked(c.id)?'primary':'quiet'}" data-action="bookmark" data-id="${c.id}">${bookmarked(c.id)?'★ Saved':'☆ Save this card'}</button>${preview?`<button class="btn primary" data-action="study-single" data-id="${c.id}">Study this card ${icon('arrow')}</button>`:''}</div></section>`;}
function showLayer(html){const el=$('#layer');el.innerHTML=html;el.classList.add('show');document.body.style.overflow='hidden';el.querySelector('.sheet')?.focus?.();}
function closeLayer(){const el=$('#layer');el.classList.remove('show');el.innerHTML='';document.body.style.overflow='';}
function settingsHTML(){const s=state.settings;return `<div class="sheet-backdrop" data-action="close-layer"></div><section class="sheet" role="dialog" aria-modal="true" aria-label="Settings"><div class="sheet-handle"></div><div class="sheet-head"><div><div class="overline">PERSONALIZE THE RITUAL</div><h2>Settings & backups</h2></div><button class="icon-btn" data-action="close-layer" aria-label="Close settings">${icon('close')}</button></div><div class="sheet-section"><h3>Review preferences</h3><div class="input-row"><label for="examDate">Certification date</label><input type="date" id="examDate" class="field" value="${esc(s.examDate)}"></div><div class="input-row"><label for="dailyNew">New cards per day (soft target)</label><select id="dailyNew" class="field">${[8,16,24,40].map(v=>`<option value="${v}" ${v===s.dailyNew?'selected':''}>${v}</option>`).join('')}</select></div><div class="input-row"><label for="retention">Target recall rate</label><select id="retention" class="field">${[[.85,'85%'],[.9,'90%'],[.95,'95%']].map(([v,t])=>`<option value="${v}" ${v===s.retention?'selected':''}>${t}</option>`).join('')}</select></div><div class="input-row"><label for="haptics">Subtle haptics (where supported)</label><input type="checkbox" class="switch" id="haptics" ${s.haptics?'checked':''}></div><div class="input-row"><label for="typing">Default to typing in SQL practice</label><input type="checkbox" class="switch" id="typing" ${s.typing?'checked':''}></div></div><div class="sheet-section"><h3>Your data belongs to you</h3><p>All review history, notes, confidence ratings and bookmarks live in this browser and are saved after every action. GitHub Pages does not receive your answers. Different devices and origins do not automatically sync.</p><div class="btn-row" style="margin-top:17px"><button class="btn primary" data-action="export">${icon('download')} Export JSON backup</button><button class="btn quiet" data-action="import">${icon('upload')} Import backup</button></div><div style="margin-top:18px"><button class="btn small warn" data-action="reset">Reset all local study progress</button></div></div><div class="sheet-section"><h3>Install on your phone</h3><p>On iPhone Safari: Share → Add to Home Screen. On supported Android browsers: open the menu → Install app. After its first online visit, the app’s shell and built-in deck can be used offline.</p><div class="btn-row" style="margin-top:14px"><button class="btn quiet" data-action="install" id="installButton">Install if available ${icon('arrow')}</button></div></div><div class="sheet-section"><h3>Scheduling and sources</h3><p>Review scheduling uses published default FSRS-6 parameters with short learning-step safeguards. Current cards follow the July 2026 COF-C03 guide; historical COF-C01/C02 topics are clearly separated and excluded from default sessions. No complete or confidential certification question bank is available.</p><a class="link-chip" target="_blank" rel="noopener noreferrer" href="https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm">FSRS algorithm reference ↗</a></div></section>`;}
function downloadBackup(){const out={app:'SnowPro Recall',exportedAt:new Date().toISOString(),...state};const blob=new Blob([JSON.stringify(out,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='snowpro-recall-'+dateOnly(NOW())+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),900);toast('Backup downloaded');}
function importBackup(file){const reader=new FileReader();reader.onload=()=>{try{const v=JSON.parse(reader.result);if(v.version!==1||!v.cards||!Array.isArray(v.history)||!v.settings)throw Error('Not a SnowPro Recall backup');if(!confirm('Restore this backup? It will replace local review progress and settings on this device.'))return;state={...defaultState(),...v,version:1};save();closeLayer();ui.page='home';render();toast('Progress restored');}catch(e){alert('Cannot import backup: '+e.message)}};reader.readAsText(file);}
let deferredInstallPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;});
function install(){if(deferredInstallPrompt){deferredInstallPrompt.prompt();deferredInstallPrompt=null;}else toast('On iPhone Safari use Share → Add to Home Screen');}
function toggleBookmark(id){const prior=cardState(id)||{};state.cards[id]={...prior,bookmark:!prior.bookmark};save();haptic();if(ui.page==='study')renderStudyInPlace();else if(ui.page==='browse')render();if($('#layer').classList.contains('show')){const l=$('#layer');const a=l.querySelector(`[data-action="bookmark"][data-id="${id}"]`);if(a){a.textContent=bookmarked(id)?'★ Saved':'☆ Save this card';a.classList.toggle('primary',bookmarked(id));a.classList.toggle('quiet',!bookmarked(id));}}}
function setupGestures(){/* Drag interaction only on active card; ratings always explicitly confirmed. */}
document.body.addEventListener('click',e=>{const b=e.target.closest('button,[data-action],[data-page],[data-preview],[data-grade],[data-only]');if(!b)return;
 if(b.dataset.page){setPage(b.dataset.page,{domain:b.dataset.domain});return;}
 if(b.dataset.objective){ui.version='current';ui.objective=b.dataset.objective;ui.only='all';ui.domain='all';ui.search='';setPage('browse');return;}
 if(b.dataset.only){ui.only=b.dataset.only;render();return;}
 if(b.dataset.collection){ui.only=b.dataset.collection==='historical'?'all':b.dataset.collection;ui.version=b.dataset.collection==='historical'?'legacy':'current';ui.objective='all';ui.domain='all';ui.search='';setPage('browse');return;}
 if(b.dataset.related){ui.only='all';ui.domain='all';ui.search=b.dataset.related;closeLayer();setPage('browse');return;}
 if(b.dataset.minutesSelect){state.settings.minutes=Number(b.dataset.minutesSelect);save();render();return;}
 if(b.dataset.preview){const c=C.get(b.dataset.preview);if(c)showLayer(detailsHTML(c,true));return;}
 if(b.dataset.grade){gradeCurrent(b.dataset.grade);return;}
 if(b.dataset.panelStep){movePanel((Number(state.session?.panelIndex)||0)+Number(b.dataset.panelStep));return;}
 if(b.dataset.panelIndex!==undefined){movePanel(Number(b.dataset.panelIndex));return;}
 const action=b.dataset.action;if(!action)return;
 if(action==='settings'){showLayer(settingsHTML());return;}
 if(action==='start'){begin(b.dataset.mode||'mix','all',limitFor(Number(b.dataset.minutes)||state.settings.minutes));return;}
 if(action==='resume'){ui.page='study';render();return;}
 if(action==='focus'){begin('mix',b.dataset.domain,limitFor(state.settings.minutes));return;}
 if(action==='start-filtered'){begin('filtered','all',limitFor(state.settings.minutes));return;}
 if(action==='reveal'){reveal();return;}
 if(action==='close-study'){closeSession();return;}
 if(action==='bookmark'){toggleBookmark(b.dataset.id);return;}
 if(action==='details'){const c=C.get(b.dataset.id);if(c)showLayer(detailsHTML(c));return;}
 if(action==='close-layer'){closeLayer();return;}
 if(action==='study-single'){const id=b.dataset.id;closeLayer();begin('single','all',1,[id]);return;}
 if(action==='skip'){studySkip();return;}
 if(action==='export'){downloadBackup();return;}
 if(action==='import'){$('#importPicker').click();return;}
 if(action==='install'){install();return;}
 if(action==='reset'){if(confirm('Permanently reset all your review history and notes on this browser? This cannot be undone without an exported backup.')){if(confirm('Confirm reset one final time?')){state=defaultState();save();closeLayer();ui.page='home';render();toast('Local progress reset');}}return;}
 });
document.body.addEventListener('change',e=>{const t=e.target;
 if(t.id==='domainFilter'){ui.domain=t.value;renderBrowseInto();}
 if(t.id==='versionFilter'){ui.version=t.value;ui.objective='all';renderBrowseInto();}
 if(t.id==='examDate'){state.settings.examDate=t.value;save();toast('Exam date saved');}
 if(t.id==='dailyNew'){state.settings.dailyNew=Number(t.value);save();}
 if(t.id==='retention'){state.settings.retention=Number(t.value);save();}
 if(t.id==='haptics'){state.settings.haptics=t.checked;save();}
 if(t.id==='typing'){state.settings.typing=t.checked;save();}
 if(t.id==='importPicker'&&t.files[0]){importBackup(t.files[0]);t.value='';}
 });
function renderBrowseInto(){const input=$('#cardSearch'),pos=input?.selectionStart||0;$('#view').innerHTML=renderBrowse();const x=$('#cardSearch');if(x&&document.activeElement===input){x.focus();x.setSelectionRange(pos,pos);}}
document.body.addEventListener('input',e=>{const t=e.target;if(t.id==='cardSearch'){const start=t.selectionStart;ui.search=t.value;const v=$('#view');v.innerHTML=renderBrowse();const field=$('#cardSearch');field.focus();field.setSelectionRange(start,start);}
 if(t.id==='typedDraft'&&state.session){state.session.draft=t.value;save();}
 if(t.id==='cardNote'){const v=cardState(t.dataset.id)||{};state.cards[t.dataset.id]={...v,note:t.value};save();}
 });
const sceneSelector=e=>e.target.closest('#flashScene');
let suppressNextSceneClick=false;
document.body.addEventListener('click',e=>{const scene=sceneSelector(e);if(!scene||ui.page!=='study')return; if(e.target.closest('button,a,textarea'))return; if(suppressNextSceneClick){suppressNextSceneClick=false;return;}tapFlashcard();});
document.body.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&$('#layer').classList.contains('show')){closeLayer();return;}
 if(ui.page!=='study'||$('#layer').classList.contains('show')||e.target.matches('input,textarea,select'))return;
 if(e.target.closest('button,a')&&e.target.id!=='flashScene')return;
 if(state.session?.revealed && e.key==='ArrowRight'){movePanel((Number(state.session.panelIndex)||0)+1);e.preventDefault();return;}
 if(state.session?.revealed && e.key==='ArrowLeft'){movePanel((Number(state.session.panelIndex)||0)-1);e.preventDefault();return;}
 if(e.key===' '||e.key==='Enter'){tapFlashcard();e.preventDefault();return;}
 if(state.session?.revealed&&['1','2','3','4'].includes(e.key)){gradeCurrent(['again','hard','good','easy'][Number(e.key)-1]);}
});
let touch=null;
document.body.addEventListener('pointerdown',e=>{
 const scene=sceneSelector(e);if(!scene||ui.page!=='study'||e.target.closest('button,a,textarea'))return;
 if(e.pointerType==='mouse'&&e.button!==0)return;
 touch={x:e.clientX,y:e.clientY,id:e.pointerId,card:scene,started:NOW(),horizontal:false};
},{passive:true});
document.body.addEventListener('pointermove',e=>{
 if(!touch||e.pointerId!==touch.id||!state.session?.revealed)return;
 const dx=e.clientX-touch.x,dy=e.clientY-touch.y;
 if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.3){
  touch.horizontal=true;
  const face=touch.card.querySelector('.back-face');
  if(face){face.style.transition='none';face.style.setProperty('--drag-x',clamp(dx*.28,-45,45)+'px');face.classList.add('is-dragging');}
 }
},{passive:true});
document.body.addEventListener('pointerup',e=>{
 if(!touch||touch.id!==e.pointerId)return;
 const dx=e.clientX-touch.x,dy=e.clientY-touch.y,wasHorizontal=touch.horizontal;
 touch.card.querySelector('.back-face')?.classList.remove('is-dragging');
 const face=touch.card.querySelector('.back-face');if(face){face.style.removeProperty('--drag-x');face.style.removeProperty('transition');}
 touch=null;
 if(wasHorizontal&&Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.15&&state.session?.revealed){
  suppressNextSceneClick=true;
  movePanel((Number(state.session.panelIndex)||0)+(dx<0?1:-1));
  // Browsers may not fire click after a drag; reset the suppression shortly.
  setTimeout(()=>{suppressNextSceneClick=false;},320);
 }
},{passive:true});
document.body.addEventListener('pointercancel',()=>{
 if(touch?.card){const face=touch.card.querySelector('.back-face');if(face){face.classList.remove('is-dragging');face.style.removeProperty('--drag-x');face.style.removeProperty('transition');}}
 touch=null;
},{passive:true});
window.addEventListener('storage',e=>{if(e.key===STORAGE_KEY){try{const value=JSON.parse(e.newValue);if(value?.version===1){state=value;render();}}catch(e){}}});
const picker=document.createElement('input');picker.type='file';picker.accept='.json,application/json';picker.id='importPicker';picker.hidden=true;document.body.appendChild(picker);
if('serviceWorker' in navigator && location.protocol==='https:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));}
render();
