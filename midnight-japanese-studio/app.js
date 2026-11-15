/* Midnight Japanese Studio — all core features run entirely in your browser.
   Audio: native speech synthesis or your own locally stored licensed audio.
   Recordings stay in memory until you explicitly download them. Progress stays on-device. */
(function () {
"use strict";
const C = window.MJ_CONTENT;
if (!C || !Array.isArray(C.phrases)) { document.getElementById("view").textContent = "Lesson data could not load. Refresh to retry."; return; }
const P = C.phrases, U = C.units;
const KEY = "midnight-japanese-studio-v1";
const $ = function (s) { return document.querySelector(s); };
const esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); };
const fmt = function (n) { return String(n).padStart(2,"0"); };
const dateKey = function (d) { d = d || new Date(); return [d.getFullYear(),fmt(d.getMonth()+1),fmt(d.getDate())].join("-"); };
const def = { current:0, rate:.88, kana:true, romaji:false, english:true, voice:"", narrator:"warm", favorite:[], learned:{}, reviews:{}, activity:[], reviewMode:"listen", lastRoute:"home" };
function loadState() {
  try { const raw = JSON.parse(localStorage.getItem(KEY) || "{}"); return normalize(raw); }
  catch (_) { return normalize({}); }
}
function normalize(x) {
  const r = Object.assign({}, def, x && typeof x==="object" ? x : {});
  r.current = Math.max(0,Math.min(P.length-1,Number(r.current)||0));
  r.rate = [.7,.85,.88,1,1.15].includes(Number(r.rate)) ? Number(r.rate) : .88;
  r.favorite = Array.isArray(r.favorite) ? r.favorite.filter(function(id){return P.some(function(p){return p.id===id;});}) : [];
  r.learned = r.learned && typeof r.learned==="object" && !Array.isArray(r.learned) ? r.learned : {};
  r.reviews = r.reviews && typeof r.reviews==="object" && !Array.isArray(r.reviews) ? r.reviews : {};
  r.activity = Array.isArray(r.activity) ? r.activity.filter(function(d){return typeof d==="string" && /^\d{4}-\d\d-\d\d$/.test(d);}).slice(-500) : [];
  r.kana = r.kana!==false; r.romaji = !!r.romaji; r.english = r.english!==false;
  r.voice = typeof r.voice==="string" ? r.voice : ""; r.narrator = r.narrator==="natural"?"natural":"warm"; r.reviewMode = r.reviewMode==="speak" ? "speak":"listen";
  return r;
}
let state=loadState(), route="home", search="", selectedUnit="all", libraryFilter="all";
let ttsSession=0, activeSound=null, isSpeaking=false, voices=[];
let recording=null, stream=null, audioCtx=null, analyser=null, raf=0, lastTake=null, lastTakePhrase=null, micStarted=0;
const customAudio={}; let dbPromise;
function save(){ try{localStorage.setItem(KEY, JSON.stringify(state));}catch(e){toast("Storage full or unavailable; export your progress.");} updateBadge(); }
function activity(){ const today=dateKey(); if(!state.activity.includes(today))state.activity.push(today); state.activity=state.activity.slice(-500); save(); }
function streak(){ let s=0,d=new Date(); if(!state.activity.includes(dateKey(d)))d.setDate(d.getDate()-1); while(state.activity.includes(dateKey(d))){s++;d.setDate(d.getDate()-1);}return s; }
function dueList(){return P.filter(function(p){const r=state.reviews[p.id];return r && Number(r.dueAt)<=Date.now();}).sort(function(a,b){return state.reviews[a.id].dueAt-state.reviews[b.id].dueAt;});}
function known(){return Object.keys(state.learned).filter(function(id){return P.some(function(p){return p.id===id;});}).length;}
function mastered(){return P.filter(function(p){const r=state.reviews[p.id];return r && r.correct>=3 && r.interval>=7;}).length;}
function percent(n,total){return total?Math.round(100*n/total):0;}
function unitKnown(i){return P.filter(function(p){return p.unit===i && state.learned[p.id];}).length;}
function unitTotal(i){return P.filter(function(p){return p.unit===i;}).length;}
function updateBadge(){const n=dueList().length;const e=$("#nav-due");if(e)e.textContent=n?String(n):"0";}
function toast(message){const el=$("#toast"); if(!el)return;el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(function(){el.classList.remove("show");},3200);}
function setRoute(r,opts){if(!["home","studio","library","review","progress"].includes(r))r="home"; if(recording)stopRecording();stopSound();route=r;render(); if(!(opts&&opts.noScroll))window.scrollTo({top:0,behavior:"instant"});}
function openPhrase(i){state.current=Math.max(0,Math.min(P.length-1,Number(i)||0));save();setRoute("studio");}
function markPracticed(id){
  if(!state.learned[id]) state.learned[id]={first:Date.now(), count:0};
  state.learned[id].count=(state.learned[id].count||0)+1;
  state.learned[id].last=Date.now();
  if(!state.reviews[id])state.reviews[id]={dueAt:Date.now(),interval:0,ease:2.5,reps:0,correct:0,lapses:0};
  activity();save();
  toast("Added to your active review deck.");
  render();
}
function rateReview(id,grade) {
  const r=state.reviews[id]||{interval:0,ease:2.5,reps:0,correct:0,lapses:0};
  if(grade==="again"){
    r.reps=0;r.lapses=(r.lapses||0)+1;r.interval=0;r.ease=Math.max(1.3,(r.ease||2.5)-.18);
    r.dueAt=Date.now()+10*60*1000;
  }else if(grade==="hard"){
    r.reps=(r.reps||0)+1;r.correct=(r.correct||0)+1;r.interval=Math.max(1,Math.round((r.interval||0)*1.2));
    r.ease=Math.max(1.3,(r.ease||2.5)-.12);r.dueAt=Date.now()+r.interval*86400000;
  }else if(grade==="good"){
    r.reps=(r.reps||0)+1;r.correct=(r.correct||0)+1;
    r.interval=r.interval===0?1:r.interval===1?3:Math.max(2,Math.round(r.interval*r.ease));
    r.dueAt=Date.now()+r.interval*86400000;
  }else{
    r.reps=(r.reps||0)+1;r.correct=(r.correct||0)+1;
    r.interval=r.interval===0?4:Math.max(4,Math.round(r.interval*r.ease*1.3));
    r.ease=Math.min(3.1,(r.ease||2.5)+.12);r.dueAt=Date.now()+r.interval*86400000;
  }
  r.lastGrade=grade;r.lastAt=Date.now();state.reviews[id]=r;
  if(!state.learned[id])state.learned[id]={first:Date.now(),count:1};
  activity();save();revealed=false;render();
}
function favorite(id){state.favorite=state.favorite.includes(id)?state.favorite.filter(function(s){return s!==id;}):state.favorite.concat(id);save();render();}
const actions = {
  home:"Overview",studio:"Listening Studio",library:"Phrase Library",review:"Daily Review",progress:"Progress & Settings"
};
function render(){
  const view=$("#view");if(!view)return;
  $("#breadcrumb-page").textContent=actions[route];
  document.querySelectorAll("[data-route]").forEach(function(b){b.classList.toggle("active",b.dataset.route===route);if(b.dataset.route===route)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
  view.innerHTML=route==="home"?home():route==="studio"?studio():route==="library"?library():route==="review"?review():progress();
  updateBadge(); if(route==="progress")hydrateVoices();if(route==="studio"&&recording)drawMic();
}
function pageHead(eyebrow,title,desc){return '<div class="page-head"><span class="eyebrow">'+esc(eyebrow)+'</span><h1>'+esc(title)+'</h1><p>'+esc(desc)+'</p></div>';}
function metric(title,num,sub,cls){return '<div class="metric '+(cls||"")+'"><label>'+title+'</label><strong>'+esc(num)+'</strong><small>'+sub+'</small></div>';}
function home(){
  const practiced=known(), unit=U[P[state.current].unit], due=dueList().length;
  return '<section class="hero"><div class="lantern" aria-hidden="true"></div><div class="hero-content"><span class="eyebrow">深夜食堂 · INSPIRED JAPANESE LEARNING</span><h1>When the city sleeps,<br><em>your Japanese begins.</em></h1><p>A private listening and speaking studio. Hear natural Japanese, imitate every phrase, record your voice, read with help, and remember it tomorrow.</p><div class="hero-actions"><button class="button button-primary" data-go="studio">▶ Enter the listening studio</button><button class="button button-ghost" data-action="quick-listen">♫ Hear your first phrase</button></div></div></section>'+
    '<div class="metric-grid">'+metric("Phrases started",practiced+' / '+P.length,"Your growing vocabulary")+
    metric("Ready to review",due,"Spaced recall practice","gold")+metric("Practice streak",streak()+' days',"Every little session counts")+
    metric("Strongly retained",mastered(),"3+ successful reviews, 7+ days")+'</div>'+
    '<div class="section-bar"><div><span class="section-eyebrow">WHAT YOU WILL TRAIN</span><h2>Four skills. One quiet ritual.</h2></div></div>'+
    '<div class="card-grid">'+
    feature("♫","Listen deeply","Hear spoken Japanese at different speeds. Replay three times, or follow an entire unit.","studio","Open the player")+
    feature("◉","Speak and compare","Record yourself on your phone. Replay your take beside the reference voice.","studio","Open the recorder")+
    feature("文","Read and understand","Toggle kana, romaji, translations, word meanings and sentence grammar.","library","Browse the phrases")+
    '</div>'+
    '<div class="section-bar"><div><span class="section-eyebrow">YOUR SIX CHAPTERS</span><h2>Learn through the night</h2></div><button class="text-button" data-go="library">Explore all '+P.length+' phrases →</button></div>'+
    '<div class="unit-list">'+U.map(function(u,i){const n=unitKnown(i),t=unitTotal(i);return '<button class="unit-row" data-unit-open="'+i+'"><span class="unit-num">'+fmt(i+1)+'</span><span style="flex:1"><strong>'+esc(u.name)+'</strong><small>'+esc(u.japanese)+' · '+esc(u.subtitle)+'</small><div class="bar-track bar-inline"><div class="bar-fill" style="width:'+percent(n,t)+'%"></div></div></span><span class="trailing">'+n+'/'+t+' ↗</span></button>';}).join("")+'</div>'+
    '<div class="section-bar"><div><span class="section-eyebrow">CONTINUE WHERE YOU LEFT OFF</span><h2>'+esc(unit.name)+'</h2></div></div>'+
    '<div class="card"><div class="oneline"><span class="pill">PHRASE '+fmt(state.current+1)+'</span><span class="pill muted">'+esc(unit.japanese)+'</span></div><h3 style="font:29px/1.55 var(--jp);margin:16px 0 6px">'+esc(P[state.current].jp)+'</h3><p>'+esc(P[state.current].en)+'</p><div class="hero-actions"><button class="button button-primary" data-go="studio">Continue learning →</button><button class="button" data-go="review">Review due phrases ('+due+')</button></div></div>';
}
function feature(icon,title,desc,go,cta){return '<div class="card"><div class="card-icon">'+icon+'</div><h3>'+title+'</h3><p>'+desc+'</p><button class="card-link" data-go="'+go+'">'+cta+' →</button></div>';}
function glyphwave(){return '<div class="waveform" id="tts-wave" aria-hidden="true">'+Array.from({length:65},function(_,i){let h=5+Math.round(33*(.25+.75*Math.abs(Math.sin(i*1.37)*Math.cos(i*.41))));return '<span style="--h:'+h+'px;--d:'+(i%11)*-.07+'s"></span>';}).join("")+'</div>';}
function studio(){
  const p=P[state.current],u=U[p.unit],hasAudio=!!customAudio[p.id],fav=state.favorite.includes(p.id);
  return pageHead("YOUR PRIVATE AUDIO BOOTH","Listening Studio","Hear it. Speak it. Read it. Remember it. Every phrase has its own practice loop.")+
    '<div class="studio-layout"><div class="card player">'+
    '<div class="player-top"><div><div class="player-label">CHAPTER '+fmt(p.unit+1)+' · '+esc(u.name.toUpperCase())+'</div><small style="color:var(--muted)">PHRASE '+fmt(state.current+1)+' OF '+P.length+'</small></div><span class="pill '+(state.learned[p.id]?"green":"")+'">'+(state.learned[p.id]?"IN YOUR REVIEW DECK":"NEW PHRASE")+'</span></div>'+
    '<div class="phrase-screen"><div class="phrase-jp">'+esc(p.jp)+'</div>'+
    (state.kana?'<div class="phrase-kana">'+esc(p.kana)+'</div>':'')+
    (state.romaji?'<div class="phrase-romaji">'+esc(p.romaji)+'</div>':'')+
    (state.english?'<div class="phrase-translation">'+esc(p.en)+'</div>':'<button class="hidden-text" data-action="toggle-english">Translation hidden — tap to reveal</button>')+'</div>'+
    '<div class="player-bottom"><div class="seek-controls"><div class="segmented" aria-label="Playback speed">'+[.7,.85,1,1.15].map(function(n){return '<button data-rate="'+n+'" class="'+(Math.abs(state.rate-n)<.04?"selected":"")+'">'+n+'×</button>';}).join("")+'</div><label class="toggle"><input type="checkbox" data-pref="kana" '+(state.kana?"checked":"")+'> Kana</label><label class="toggle"><input type="checkbox" data-pref="romaji" '+(state.romaji?"checked":"")+'> Romaji</label><label class="toggle"><input type="checkbox" data-pref="english" '+(state.english?"checked":"")+'> English</label></div>'+
    glyphwave()+'<div class="transport"><button class="button" data-action="slow" title="Play slowly">↘ Slow</button><button class="play-circle" data-action="play" aria-label="Hear this Japanese phrase">▶</button><button class="button" data-action="repeat" title="Hear three times">⟲ 3×</button><button class="button" data-action="play-unit" title="Play all phrases in this chapter">▤ Unit</button><button class="button" data-action="stop" title="Stop">■</button></div>'+
    '<div class="transport-label" id="audio-status">'+(hasAudio?"Your imported reference recording":selectedVoiceInfo().label+" · "+state.rate+"× speed")+'</div></div>'+
    '<div class="player-nav"><button class="button button-sm" data-action="previous" '+(state.current===0?"disabled":"")+'>← Previous</button><span>'+fmt(state.current+1)+' / '+fmt(P.length)+'</span><button class="button button-sm" data-action="next" '+(state.current===P.length-1?"disabled":"")+'>Next →</button></div></div>'+
    '<div class="side-panel"><section class="card panel-section"><div class="oneline"><span class="mini-heading">SPEAKING BOOTH</span><span class="pill muted" id="rec-flag">'+(recording?'<span class="recording-light"></span> Recording':"PRIVATE MIC")+'</span></div><h3>Make it your voice.</h3><p>Listen first. Record your imitation, then play both back-to-back.</p><div class="mic-visual"><canvas width="640" height="90" id="mic-canvas" aria-label="Microphone level"></canvas></div><div class="status-text" id="mic-status">'+(recording?"Recording… tap Stop when finished.":"No recording sent to any server.")+'</div><div class="take-actions"><button class="button '+(recording?"button-danger":"button-primary")+'" data-action="record">'+(recording?"■ Stop recording":"● Record my voice")+'</button><button class="button" data-action="compare" '+(!lastTake||lastTakePhrase!==p.id?"disabled":"")+'>♫ Compare</button></div>'+
    (lastTake&&lastTakePhrase===p.id?'<audio class="audio-take" src="'+esc(lastTake.url)+'" controls preload="metadata"></audio><div class="take-actions"><button class="button button-sm" data-action="download-take">↓ Save my recording</button></div>':'')+
    '<div class="separator"></div><span class="mini-heading">YOUR REFERENCE AUDIO</span><p style="margin:7px 0 10px">Use the Japanese system voice or attach your own short audio clip for this phrase, stored only in this browser.</p><div class="take-actions"><label class="button button-sm button-ghost" for="reference-file">＋ Add my audio</label>'+(hasAudio?'<button class="button button-sm button-danger" data-action="remove-reference">Remove audio</button>':'')+'</div><input type="file" id="reference-file" accept="audio/*" hidden></section>'+
    '<section class="card panel-section"><div class="oneline"><span class="mini-heading">DECIPHER THE JAPANESE</span><button class="text-button" data-action="favorite">'+(fav?"★ Saved":"☆ Save")+'</button></div><h3>Phrase breakdown</h3><div class="breakdown">'+p.tokens.map(function(t,i){return '<button class="token" data-token="'+i+'" title="View word details"><ruby>'+esc(t[0])+'<rt>'+esc(t[1])+'</rt></ruby><small>'+esc(t[2])+'</small></button>';}).join("")+'</div><div class="lesson-tip">'+esc(p.grammar)+'</div><div class="mini-heading" style="margin-top:17px">PRONUNCIATION COACH</div><div class="lesson-tip">'+esc(p.speaking)+'</div></section>'+
    '<section class="card panel-section"><span class="mini-heading">LOCK IT INTO MEMORY</span><h3>Learn → Recall</h3><div class="practice-steps"><div class="practice-step"><span class="step-circle">1</span>Hear it with your eyes closed.</div><div class="practice-step"><span class="step-circle">2</span>Shadow it out loud twice.</div><div class="practice-step"><span class="step-circle">3</span>Record one natural attempt.</div><div class="practice-step"><span class="step-circle">4</span>Hide the translation and retrieve the meaning.</div></div><button style="width:100%;margin-top:18px" class="button '+(state.learned[p.id]?"":"button-primary")+'" data-action="practiced">'+(state.learned[p.id]?"✓ Practiced — reinforce again":"✓ I've practiced this phrase")+'</button><button class="text-button" style="margin-top:9px" data-go="review">Go to spaced review →</button></section></div></div>'+
    '<div class="info-box" style="margin-top:18px">♫ The built-in voice is Japanese text-to-speech, not the actor’s original performance. To hear the genuine narration, use your own lawful source such as <a class="link" href="https://www.netflix.com/title/80113541" target="_blank" rel="noopener">Netflix</a>. You can attach personally held short audio to a phrase without uploading it to this app’s server.</div>';
}
function libraryRows(){
  let rows=P.filter(function(p){
    const match=(p.jp+" "+p.kana+" "+p.romaji+" "+p.en+" "+p.tokens.map(function(t){return t.join(" ");}).join(" ")).toLowerCase().includes(search.toLowerCase());
    return match&&(selectedUnit==="all"||p.unit===Number(selectedUnit))&&(libraryFilter==="all"||(libraryFilter==="saved"&&state.favorite.includes(p.id))||(libraryFilter==="learned"&&state.learned[p.id]));
  });
  if(!rows.length)return '<div class="empty-state">No matching phrases. Try another search or filter.</div>';
  return rows.map(function(p){
    const i=P.indexOf(p), saved=state.favorite.includes(p.id);
    return '<div class="phrase-row"><button style="text-align:left;background:none;border:0;color:inherit;flex:1;min-width:0;padding:0;cursor:pointer" data-phrase="'+i+'"><div class="phrase-meta"><span class="mini-heading">CH. '+fmt(p.unit+1)+' · '+fmt(i+1)+'</span>'+(state.learned[p.id]?'<span class="pill green">Learned</span>':'')+'</div><h3>'+esc(p.jp)+'</h3><p>'+esc(p.en)+'</p></button><button class="button button-sm icon-only" title="'+(saved?"Remove saved phrase":"Save phrase")+'" aria-label="'+(saved?"Remove saved phrase":"Save phrase")+'" data-favorite="'+esc(p.id)+'">'+(saved?"★":"☆")+'</button><span class="arrow">›</span></div>';
  }).join("");
}
function library(){
  return pageHead("THE AFTER-HOURS PHRASEBOOK","Phrase Library","36 carefully structured phrases in six chapters, each with spoken Japanese, kana, English and grammatical details.")+
    '<div class="library-toolbar"><input class="search-input" id="library-search" type="search" placeholder="Search Japanese, romaji or English…" value="'+esc(search)+'" aria-label="Search phrases">'+
    '<select class="select" id="unit-filter" aria-label="Filter by chapter"><option value="all">All chapters</option>'+U.map(function(u,i){return '<option value="'+i+'" '+(String(selectedUnit)===String(i)?"selected":"")+'>'+fmt(i+1)+' · '+esc(u.name)+'</option>';}).join("")+'</select>'+
    '<select class="select" id="library-filter" aria-label="Filter phrases"><option value="all" '+(libraryFilter==="all"?"selected":"")+'>All phrases</option><option value="saved" '+(libraryFilter==="saved"?"selected":"")+'>★ Favorites</option><option value="learned" '+(libraryFilter==="learned"?"selected":"")+'>Practiced</option></select></div>'+
    '<div class="oneline" style="margin-bottom:12px"><span class="mini-heading">TAP ANY PHRASE TO OPEN THE AUDIO STUDIO</span><button class="text-button" data-action="play-all-filtered">♫ Play selected chapter</button></div>'+
    '<div class="phrase-list" id="library-results">'+libraryRows()+'</div>';
}
let revealed=false;
function review(){
  const due=dueList(), p=due[0], totalKnown=known();
  if(!p)return pageHead("SPACED MEMORY","Daily Review","A little recall today helps tomorrow's Japanese feel more natural.")+
    '<div class="card review-empty"><span style="font-size:49px;color:var(--accent)">☾</span><h2>Nothing due right now.</h2><p>'+(totalKnown?"Your practiced phrases are on schedule. Return when they become due.":"Start in the Listening Studio, then mark a phrase practiced to add it to your memory deck.")+'</p><button class="button button-primary" data-go="studio">Go practice a phrase →</button></div>'+
    '<div class="section-bar"><div><span class="section-eyebrow">YOUR MEMORY DECK</span><h2>'+totalKnown+' phrases started</h2></div></div><div class="info-box">After a review, cards come back after increasing intervals. “Again” returns in 10 minutes. Progress never leaves this device unless you export it.</div>';
  return pageHead("SPACED MEMORY","Daily Review","Retrieve the phrase without reading it first, reveal the answer, then rate how difficult it felt.")+
    '<div class="review-layout"><div class="card review-card"><div class="oneline" style="width:100%"><span class="pill">DUE '+due.length+'</span><span class="pill muted">'+esc(U[p.unit].name)+'</span></div>'+
    '<span class="mini-heading" style="margin-top:26px">'+(state.reviewMode==="listen"?"LISTEN AND UNDERSTAND":"SPEAK FROM MEMORY")+'</span>'+
    (state.reviewMode==="listen"?'<div class="review-jp" style="color:#a8b9a8">♪</div><p class="review-prompt">Tap Play. What does the spoken Japanese mean?</p><button class="button button-primary" data-action="review-play">▶ Play Japanese</button>':
    '<div class="review-prompt" style="margin-top:34px">Say this in Japanese, out loud:</div><div style="font:italic 26px/1.4 var(--serif);margin:15px 0;color:var(--ink)">'+esc(p.en)+'</div><p class="hint" style="margin-bottom:15px">No text prompt. Try speaking from memory.</p>')+
    (revealed?'<div class="review-answer"><h3>'+esc(p.jp)+'</h3><p>'+esc(p.kana)+'<br>'+esc(p.romaji)+'</p><strong>'+esc(p.en)+'</strong><p>'+esc(p.grammar)+'</p><button class="text-button" data-action="review-play">♫ Hear it again</button></div><div class="review-ratings"><button class="button button-danger" data-grade="again">Again<br><small>10 min</small></button><button class="button" data-grade="hard">Hard</button><button class="button" data-grade="good">Good</button><button class="button button-primary" data-grade="easy">Easy</button></div>':
    '<button class="button button-primary" style="margin-top:22px" data-action="reveal">Reveal answer →</button>')+
    '</div><aside class="side-panel"><section class="card panel-section"><span class="mini-heading">RECALL SETTINGS</span><h3>Choose a challenge</h3><div class="segmented" style="margin-top:15px"><button data-review-mode="listen" class="'+(state.reviewMode==="listen"?"selected":"")+'">♫ Listen → meaning</button><button data-review-mode="speak" class="'+(state.reviewMode==="speak"?"selected":"")+'">◉ English → speak</button></div><p style="margin-top:14px">Say your answer before revealing it. Mark yourself honestly.</p></section><section class="card panel-section"><span class="mini-heading">TODAY’S DECK</span><h3>'+due.length+' due right now</h3><p>'+known()+' phrases started · '+mastered()+' strongly retained</p><div class="bar-track" style="margin-top:14px"><div class="bar-fill" style="width:'+percent(mastered(),Math.max(known(),1))+'%"></div></div><div class="lesson-tip">Again: repeat in 10 minutes.<br>Hard: shorter spacing.<br>Good: normal interval.<br>Easy: longer interval.</div></section></aside></div>';
}
function progress(){
  const k=known(),m=mastered(),due=dueList().length;
  return pageHead("STAY CONSISTENT","Progress & Settings","Your studies are private. See your learning momentum, choose a voice, and back up your progress.")+
    '<div class="metric-grid">'+metric("Total phrases",P.length,"Six story-inspired chapters")+metric("Practiced",k,"Phrases in your deck")+metric("Strong retention",m,"Reviewed successfully","gold")+metric("Due now",due,"Spaced recall")+'</div>'+
    '<div class="section-bar"><div><span class="section-eyebrow">CHAPTER PROGRESS</span><h2>Your journey</h2></div></div>'+
    '<div class="progress-grid"><section class="card"><div class="unit-progress">'+U.map(function(u,i){return '<div class="statbar"><div class="statbar-top"><span>'+fmt(i+1)+' · '+esc(u.name)+'</span><strong>'+unitKnown(i)+' / '+unitTotal(i)+'</strong></div><div class="bar-track"><div class="bar-fill" style="width:'+percent(unitKnown(i),unitTotal(i))+'%"></div></div></div>';}).join("")+'</div></section>'+
    '<section class="card"><span class="mini-heading">YOUR PRACTICE HABIT</span><h3 style="font-size:28px;margin-bottom:15px">'+streak()+' day streak</h3><p>'+state.activity.length+' distinct practice days tracked in this browser.</p><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin:20px 0 17px">'+Array.from({length:28},function(_,i){const d=new Date();d.setDate(d.getDate()-(27-i));const yes=state.activity.includes(dateKey(d));return '<div title="'+dateKey(d)+'" style="height:24px;border-radius:5px;background:'+(yes?"#c8a676":"#34463a")+'"></div>';}).join("")+'</div><p class="hint">Each golden block represents a day with a marked practice session or completed review. This is not a microphone accuracy score.</p><div class="separator"></div><span class="mini-heading">PRACTICE GOAL</span><p>12 minutes a day: 2 review, 3 listen, 3 shadow, 2 read, 2 recall.</p></section></div>'+
    '<div class="section-bar"><div><span class="section-eyebrow">SOUND & READING</span><h2>Your studio preferences</h2></div></div>'+
    '<div class="progress-grid"><section class="card"><div class="settings-row"><div><strong>Japanese male narrator</strong><small>Automatically uses Otoya or another recognized male Japanese voice, if available.</small></div><select id="voice-select" class="select" aria-label="Japanese narrator selection"><option value="">Auto-select male Japanese voice</option></select></div><div id="male-voice-status" class="info-box" role="status" style="margin:9px 0 13px">Checking installed Japanese voices…</div><div class="settings-row"><div><strong>Narration character</strong><small>Warm & unhurried is a little deeper; natural preserves ordinary pitch.</small></div><select class="select" id="narrator-select"><option value="warm">Warm & unhurried</option><option value="natural">Natural pronunciation</option></select></div>'+
    '<div class="settings-row"><div><strong>Audio playback speed</strong><small>Also adjustable inside each phrase</small></div><select class="select" id="rate-select"><option value=".7" '+(state.rate===.7?"selected":"")+'>0.70× Slow</option><option value=".85" '+(state.rate===.85||state.rate===.88?"selected":"")+'>0.85× Learning</option><option value="1" '+(state.rate===1?"selected":"")+'>1.00× Natural</option><option value="1.15" '+(state.rate===1.15?"selected":"")+'>1.15× Fast</option></select></div>'+
    '<div class="settings-row"><div><strong>Sound check</strong><small>Hear a short Japanese voice sample</small></div><button class="button button-sm" data-action="test-voice">▶ Test audio</button></div><div class="info-box" style="margin-top:16px">If you hear nothing, increase your volume and try another Japanese system voice. On iPhone, Japanese voices may need to be installed in iOS accessibility speech settings. Recording requires microphone permission and HTTPS.</div></section>'+
    '<section class="card"><span class="mini-heading">OWN YOUR LEARNING DATA</span><h3>Local & private</h3><p>Progress, saved phrases and spaced reviews remain in this browser’s storage. Your microphone recordings are not uploaded. Added reference clips are stored in this device’s IndexedDB.</p><div class="settings-actions"><button class="button button-primary" data-action="export">↓ Export progress</button><label class="button" for="import-progress">↑ Import progress</label><input type="file" accept="application/json,.json" id="import-progress" hidden><button class="button button-danger" data-action="reset">Reset progress</button></div><p class="hint" style="margin-top:15px">Progress does not automatically synchronize between iPhone and desktop. Export a backup to transfer it. Imported reference audio clips and voice recordings are not included in the JSON backup.</p><div class="separator"></div><span class="mini-heading">ACKNOWLEDGMENTS</span><p>Independent Japanese lessons inspired by the atmosphere of Midnight Diner, unaffiliated with its creators or distributors. One brief quoted line is used for language study; all other practice sentences are original.</p><p><a class="link" href="https://www.netflix.com/title/80113541" target="_blank" rel="noopener">Watch the original series ↗</a> · <a class="link" href="https://www.gavo.t.u-tokyo.ac.jp/ojad/eng/pages/home" target="_blank" rel="noopener">Study pronunciation with OJAD ↗</a></p></section></div>';
}
/* Web Speech exposes name/language but no gender. Heuristic male-name selection. */
const MALE_JA_NAMES=["otoya","hattori","daichi","masaru","naoki","keita","takumi","ichiro","akira","haruto","koji","kenji","hiroshi","yuma","shinji","nobu","kazuki","takeru"];
function isJapaneseVoice(v){return /^ja(?:-|$)/i.test(String(v.lang||""));}
function isLikelyMaleJapanese(v){
  if(!isJapaneseVoice(v))return false;
  const name=(String(v.name||"")+" "+String(v.voiceURI||"")).toLowerCase();
  return MALE_JA_NAMES.some(function(n){return new RegExp("(^|[^a-z])"+n+"($|[^a-z])").test(name);});
}
function bestMaleVoice(list){
  const males=list.filter(isLikelyMaleJapanese);
  return males.sort(function(a,b){
    const rank=function(v){const name=(v.name+" "+v.voiceURI).toLowerCase();const i=MALE_JA_NAMES.findIndex(function(n){return new RegExp("(^|[^a-z])"+n+"($|[^a-z])").test(name);});return i<0?100:i;};
    return rank(a)-rank(b);
  })[0]||null;
}
function selectedVoiceInfo(){
  const list=window.speechSynthesis?window.speechSynthesis.getVoices():[];
  const choice=state.voice?list.find(function(v){return v.voiceURI===state.voice&&isJapaneseVoice(v);}):null;
  const preferred=bestMaleVoice(list);
  const voice=choice||(state.voice?null:preferred)||list.find(isJapaneseVoice)||null;
  const male=!!voice&&isLikelyMaleJapanese(voice);
  return {voice:voice,male:male,missingRequested:!!state.voice&&!choice,
    label:voice?(voice.name+(male?" · male Japanese":" · gender unverified")):"No Japanese voice found"};
}
function hydrateVoices(){
  const sel=$("#voice-select"); if(!sel)return;
  voices=window.speechSynthesis?window.speechSynthesis.getVoices():[];
  const japanese=voices.filter(isJapaneseVoice).sort(function(a,b){return Number(isLikelyMaleJapanese(b))-Number(isLikelyMaleJapanese(a))||a.name.localeCompare(b.name);});
  sel.innerHTML='<option value="" '+(!state.voice?"selected":"")+'>Auto-select male Japanese voice</option>'+
    japanese.map(function(v){return '<option value="'+esc(v.voiceURI)+'" '+(state.voice===v.voiceURI?"selected":"")+'>'+esc(v.name)+(isLikelyMaleJapanese(v)?" · male":"")+' ('+esc(v.lang)+')</option>';}).join("");
  if(state.voice&&!japanese.some(function(v){return v.voiceURI===state.voice;}))sel.innerHTML+='<option value="'+esc(state.voice)+'" selected>Previously chosen voice unavailable</option>';
  if(!japanese.length)sel.innerHTML+='<option disabled>No Japanese voices exposed by browser</option>';
  const info=selectedVoiceInfo(),status=$("#male-voice-status");
  if(status)status.innerHTML=info.male?'<span class="privacy-dot"></span>Selected: '+esc(info.voice.name)+' · likely male Japanese':
    '<strong>Male Japanese voice not detected.</strong> '+(info.missingRequested?"Your saved voice is unavailable here. Select Auto or another Japanese voice. ":"")+"For iPhone, download Otoya in Settings → Accessibility → Read & Speak → Voices → Japanese, then reopen Safari.";
  const style=$("#narrator-select");if(style)style.value=state.narrator;
}
function stopSound(){
  ttsSession++;isSpeaking=false;
  if(window.speechSynthesis)try{window.speechSynthesis.cancel();}catch(_){}
  if(activeSound){try{activeSound.pause();activeSound.currentTime=0;}catch(_){}activeSound=null;}
  const wave=$("#tts-wave");if(wave)wave.classList.remove("playing");
  const stat=$("#audio-status");if(stat)stat.textContent="Playback stopped";
}
function showWave(on,status){isSpeaking=on;const e=$("#tts-wave");if(e)e.classList.toggle("playing",on);const s=$("#audio-status");if(s&&status)s.textContent=status;}
function speakTTS(text,session,rate){
  return new Promise(function(resolve){
    if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){toast("Speech synthesis is unavailable in this browser.");resolve(false);return;}
    const synth=window.speechSynthesis;try{synth.cancel();}catch(_){}
    const u=new SpeechSynthesisUtterance(text);
    u.lang="ja-JP";u.rate=rate||state.rate;u.pitch=state.narrator==="warm"?.92:1;u.volume=1;
    const picked=selectedVoiceInfo(),voice=picked.voice;
    if(voice)u.voice=voice;
    if(!picked.male)toast((picked.missingRequested?"Chosen voice unavailable. ":"")+"No recognized male Japanese voice installed. Try installing Otoya.");
    let settled=false;
    const finish=function(ok){if(settled)return;settled=true;clearTimeout(failsafe);if(session===ttsSession)showWave(false,ok?"Finished · tap Play to repeat":"Could not play Japanese speech");resolve(ok);};
    u.onstart=function(){if(session===ttsSession)showWave(true,(picked.male?"Male Japanese voice":"Japanese device voice")+" · "+(voice?voice.name:"default")+" · "+Number(rate||state.rate).toFixed(2)+"×");};
    u.onend=function(){finish(true);};u.onerror=function(){finish(false);};
    const failsafe=setTimeout(function(){finish(false);},22000);
    try{synth.speak(u);}catch(e){finish(false);}
  });
}
function playFile(file,session,rate){
  return new Promise(function(resolve){
    const audio=new Audio(file.url);activeSound=audio;audio.playbackRate=rate||state.rate;
    let done=false;
    const finish=function(ok){if(done)return;done=true;audio.onended=null;audio.onerror=null;if(session===ttsSession){showWave(false,ok?"Finished":"Audio could not play");if(activeSound===audio)activeSound=null;}resolve(ok);};
    audio.onplay=function(){if(session===ttsSession)showWave(true,"Your reference audio · "+audio.playbackRate.toFixed(2)+"×");};
    audio.onended=function(){finish(true);};audio.onerror=function(){finish(false);};audio.onpause=function(){if(!audio.ended)finish(false);};
    audio.play().catch(function(){toast("Audio playback was blocked. Tap Play again.");finish(false);});
  });
}
async function playReference(index,rate,session){
  const p=P[index],file=customAudio[p.id];
  return file?playFile(file,session,rate):speakTTS(p.jp,session,rate);
}
async function playOne(times,forceSlow){
  stopSound();const session=ttsSession;const index=state.current;const rate=forceSlow ? 0.7 : state.rate;
  for(let i=0;i<times;i++){if(session!==ttsSession)break;const ok=await playReference(index,rate,session);if(!ok||session!==ttsSession)break;if(i<times-1)await new Promise(function(r){setTimeout(r,420);});}
}
async function playUnit(unitIndex){
  stopSound();const session=ttsSession;const pp=P.filter(function(p){return p.unit===unitIndex;});
  for(const p of pp){if(session!==ttsSession)break;showWave(false,"Playing chapter · "+(P.indexOf(p)+1)+"/"+P.length);const ok=await playReference(P.indexOf(p),state.rate,session);if(!ok)break;}
}
function formatBlobName(blob){const m=blob.type||"";return m.includes("mp4")?".m4a":m.includes("ogg")?".ogg":".webm";}
function releaseTake(){if(lastTake&&lastTake.url)URL.revokeObjectURL(lastTake.url);lastTake=null;lastTakePhrase=null;}
async function startRecording(){
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){toast("Recording is not supported in this browser.");return;}
  if(recording)return;
  stopSound();
  try{
    stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:false});
    let mime=["audio/mp4","audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus"].find(function(m){return window.MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(m);});
    recording=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
    const chunks=[],recordPhrase=P[state.current].id;
    recording.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};
    recording.onstop=function(){const b=new Blob(chunks,{type:recording&&recording.mimeType||mime||"audio/webm"});if(b.size){releaseTake();lastTake={url:URL.createObjectURL(b),blob:b};lastTakePhrase=recordPhrase;toast("Recording ready. Compare or save your take.");}else toast("The recording was empty. Try again.");recording=null;closeMic();render();};
    recording.onerror=function(){toast("Microphone recording encountered an error.");stopRecording();};
    try{const AC=window.AudioContext||window.webkitAudioContext; if(AC){audioCtx=new AC();const source=audioCtx.createMediaStreamSource(stream);analyser=audioCtx.createAnalyser();analyser.fftSize=2048;source.connect(analyser);}}catch(_){}
    recording.start(250);micStarted=Date.now();render();drawMic();
  }catch(e){closeMic();recording=null;toast("Microphone permission was denied or unavailable.");}
}
function stopRecording(){if(recording&&recording.state!=="inactive"){try{recording.stop();}catch(_){closeMic();recording=null;}}else closeMic();}
function closeMic(){cancelAnimationFrame(raf);raf=0;if(stream){stream.getTracks().forEach(function(t){t.stop();});stream=null;}if(audioCtx){audioCtx.close().catch(function(){});audioCtx=null;}analyser=null;}
function drawMic(){
  cancelAnimationFrame(raf);const canvas=$("#mic-canvas");if(!canvas)return;const ctx=canvas.getContext("2d");if(!ctx)return;
  const loop=function(){const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle="#122019";ctx.fillRect(0,0,w,h);
    ctx.strokeStyle="#435a48";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
    ctx.lineWidth=2.1;ctx.strokeStyle=recording?"#dfb37b":"#526c58";ctx.beginPath();
    const a=new Uint8Array(analyser?analyser.fftSize:1024);if(analyser)analyser.getByteTimeDomainData(a);
    for(let i=0;i<a.length;i++){const x=i/(a.length-1)*w;const y=analyser?a[i]/255*h:h/2+(Math.sin(i*.23)*Math.sin(i*.071))*2;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
    if(recording){const s=$("#mic-status");if(s)s.textContent="● Recording · "+Math.round((Date.now()-micStarted)/1000)+"s · tap Stop when finished";raf=requestAnimationFrame(loop);}
  };loop();
}
async function compareTake(){
  const p=P[state.current];if(!lastTake||lastTakePhrase!==p.id){toast("Record your voice first.");return;}
  stopSound();const session=ttsSession;showWave(true,"1 / 2 · Listen to the Japanese reference");
  await playReference(state.current,state.rate,session);
  if(session!==ttsSession)return;
  showWave(true,"2 / 2 · Your recording");
  const audio=new Audio(lastTake.url);activeSound=audio;
  audio.onended=function(){if(session===ttsSession)showWave(false,"Comparison finished");};
  audio.play().catch(function(){toast("Tap the recording’s play bar to hear your take.");showWave(false,"Play your recording manually below");});
}
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},15000);}
function openDB(){
  if(!window.indexedDB)return Promise.reject(new Error("IndexedDB unavailable"));
  if(!dbPromise)dbPromise=new Promise(function(resolve,reject){const req=indexedDB.open("midnight-japanese-audio",1);req.onupgradeneeded=function(){if(!req.result.objectStoreNames.contains("clips"))req.result.createObjectStore("clips");};req.onsuccess=function(){resolve(req.result);};req.onerror=function(){reject(req.error);};});
  return dbPromise;
}
async function getAllClips(){
  try{const db=await openDB();await Promise.all(P.map(function(p){return new Promise(function(resolve){const req=db.transaction("clips","readonly").objectStore("clips").get(p.id);req.onsuccess=function(){if(req.result&&req.result instanceof Blob)customAudio[p.id]={blob:req.result,url:URL.createObjectURL(req.result)};resolve();};req.onerror=function(){resolve();};});}));if(route==="studio")render();}
  catch(_) {}
}
async function saveClip(id,file){
  if(file.size>30*1024*1024){toast("Choose an audio file under 30 MB.");return;}
  try{const db=await openDB();await new Promise(function(resolve,reject){const t=db.transaction("clips","readwrite");t.objectStore("clips").put(file,id);t.oncomplete=resolve;t.onerror=function(){reject(t.error);};});
    if(customAudio[id])URL.revokeObjectURL(customAudio[id].url);
    customAudio[id]={blob:file,url:URL.createObjectURL(file)};toast("Your personal reference audio was saved on this device.");render();
  }catch(_){toast("Could not save audio on this device. Check available storage.");}
}
async function removeClip(id){
  try{const db=await openDB();await new Promise(function(resolve,reject){const t=db.transaction("clips","readwrite");t.objectStore("clips").delete(id);t.oncomplete=resolve;t.onerror=function(){reject(t.error);};});if(customAudio[id])URL.revokeObjectURL(customAudio[id].url);delete customAudio[id];toast("Reference audio removed.");render();}
  catch(_){toast("Could not remove the audio clip.");}
}
function showDialog(html){$("#dialog-content").innerHTML=html;$("#dialog-backdrop").hidden=false;$("#dialog-close").focus();}
function closeDialog(){$("#dialog-backdrop").hidden=true;}
function exportProgress(){const data={type:"midnight-japanese-backup",version:1,exportedAt:new Date().toISOString(),progress:state};download(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),"midnight-japanese-progress-"+dateKey()+".json");toast("Progress backup downloaded.");}
async function importProgress(file){
  try{if(file.size>2000000)throw new Error("too large");const d=JSON.parse(await file.text());if(d.type!=="midnight-japanese-backup"||d.version!==1||!d.progress||typeof d.progress!=="object")throw new Error("invalid backup");state=normalize(d.progress);save();render();toast("Progress imported successfully.");}
  catch(_){toast("Invalid backup. Choose a Midnight Japanese JSON export.");}
}
function askReset(){showDialog('<span class="mini-heading">IRREVERSIBLE ACTION</span><h2 id="dialog-title">Reset your learning?</h2><p>This deletes saved phrases, learning progress and your review history in this browser. Your personally imported audio clips are not removed.</p><div class="settings-actions"><button class="button button-ghost" data-action="close-dialog">Cancel</button><button class="button button-danger" data-action="confirm-reset">Delete all progress</button></div>');}
function handleAction(a,element){
  const p=P[state.current];
  if(a==="quick-listen"){playOne(1,false);return;}
  if(a==="play"){playOne(1,false);return;}
  if(a==="repeat"){playOne(3,false);return;}
  if(a==="slow"){playOne(1,true);return;}
  if(a==="stop"){stopSound();return;}
  if(a==="play-unit"){playUnit(p.unit);return;}
  if(a==="play-all-filtered"){playUnit(selectedUnit==="all"?P[state.current].unit:Number(selectedUnit));return;}
  if(a==="record"){recording?stopRecording():startRecording();return;}
  if(a==="compare"){compareTake();return;}
  if(a==="download-take"&&lastTake){download(lastTake.blob,"my-japanese-"+p.id+formatBlobName(lastTake.blob));return;}
  if(a==="remove-reference"){removeClip(p.id);return;}
  if(a==="previous"){openPhrase(state.current-1);return;}
  if(a==="next"){openPhrase(state.current+1);return;}
  if(a==="practiced"){markPracticed(p.id);return;}
  if(a==="favorite"){favorite(p.id);return;}
  if(a==="toggle-english"){state.english=true;save();render();return;}
  if(a==="review-play"){stopSound();const due=dueList()[0];if(due)playReference(P.indexOf(due),state.rate,ttsSession);return;}
  if(a==="reveal"){revealed=true;render();return;}
  if(a==="test-voice"){stopSound();speakTTS("こんばんは。日本語を練習しましょう。",ttsSession,state.rate);return;}
  if(a==="export"){exportProgress();return;}
  if(a==="reset"){askReset();return;}
  if(a==="close-dialog"){closeDialog();return;}
  if(a==="confirm-reset"){state=normalize({});save();closeDialog();render();toast("Progress reset.");return;}
}
document.addEventListener("click",function(e){
  if(e.target===$("#dialog-backdrop")){closeDialog();return;}
  const r=e.target.closest("[data-route],[data-go],[data-action],[data-phrase],[data-unit-open],[data-favorite],[data-rate],[data-grade],[data-token],[data-review-mode]");
  if(!r)return;
  if(r.dataset.route){e.preventDefault();setRoute(r.dataset.route);return;}
  if(r.dataset.go){e.preventDefault();setRoute(r.dataset.go);return;}
  if(r.dataset.phrase!==undefined){openPhrase(Number(r.dataset.phrase));return;}
  if(r.dataset.unitOpen!==undefined){const first=P.findIndex(function(p){return p.unit===Number(r.dataset.unitOpen);});openPhrase(first);return;}
  if(r.dataset.favorite){favorite(r.dataset.favorite);return;}
  if(r.dataset.rate){state.rate=Number(r.dataset.rate);save();render();return;}
  if(r.dataset.grade){const d=dueList()[0];if(d)rateReview(d.id,r.dataset.grade);return;}
  if(r.dataset.token!==undefined){const t=P[state.current].tokens[Number(r.dataset.token)];showDialog('<span class="mini-heading">WORD FOCUS</span><h2 id="dialog-title" style="font-family:var(--jp)">'+esc(t[0])+'</h2><div class="pill">'+esc(t[1])+'</div><p><strong>'+esc(t[2])+'</strong></p><button class="button button-primary" data-action="say-token">▶ Hear this word</button>');return;}
  if(r.dataset.reviewMode){state.reviewMode=r.dataset.reviewMode;revealed=false;save();render();return;}
  if(r.dataset.action==="say-token"){const active=P[state.current];const label=$("#dialog-content h2");if(label){stopSound();speakTTS(label.textContent,ttsSession,.85);}return;}
  if(r.dataset.action){handleAction(r.dataset.action,r);return;}
});
document.addEventListener("change",function(e){
  const el=e.target;
  if(el.id==="unit-filter"){selectedUnit=el.value;render();return;}
  if(el.id==="library-filter"){libraryFilter=el.value;render();return;}
  if(el.dataset.pref){state[el.dataset.pref]=el.checked;save();render();return;}
  if(el.id==="voice-select"){state.voice=el.value;save();hydrateVoices();toast("Narrator voice preference saved.");return;}
  if(el.id==="narrator-select"){state.narrator=el.value==="natural"?"natural":"warm";save();toast("Narration style saved.");return;}
  if(el.id==="rate-select"){state.rate=Number(el.value);save();return;}
  if(el.id==="import-progress"&&el.files[0]){importProgress(el.files[0]);return;}
  if(el.id==="reference-file"&&el.files[0]){if(!el.files[0].type.startsWith("audio/")){toast("Please choose an audio file.");return;}saveClip(P[state.current].id,el.files[0]);return;}
});
document.addEventListener("input",function(e){
  if(e.target.id==="library-search"){search=e.target.value;const list=$("#library-results");if(list)list.innerHTML=libraryRows();}
});
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"){closeDialog();return;}
  const tag=document.activeElement&&document.activeElement.tagName;
  if(["INPUT","TEXTAREA","SELECT"].includes(tag))return;
  if(route==="studio"&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){e.preventDefault();openPhrase(state.current+(e.key==="ArrowRight"?1:-1));}
});
document.addEventListener("visibilitychange",function(){if(document.hidden&&recording)stopRecording();});
window.addEventListener("beforeunload",function(){stopSound();closeMic();releaseTake();Object.values(customAudio).forEach(function(v){URL.revokeObjectURL(v.url);});});
if(window.speechSynthesis){voices=speechSynthesis.getVoices();speechSynthesis.addEventListener&&speechSynthesis.addEventListener("voiceschanged",hydrateVoices);}
$("#dialog-close").addEventListener("click",closeDialog);
$("#today-date").textContent=new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const initial=location.hash.slice(1).toLowerCase();if(actions[initial])route=initial;
window.addEventListener("hashchange",function(){const v=location.hash.slice(1).toLowerCase();if(actions[v]&&v!==route)setRoute(v,{noScroll:true});});
render();getAllClips();
if("serviceWorker" in navigator)window.addEventListener("load",function(){navigator.serviceWorker.register("./sw.js").catch(function(){});});
})();