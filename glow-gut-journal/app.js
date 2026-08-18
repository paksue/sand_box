import {
  putEntry, deleteEntry, getEntriesByDate, getAllEntries,
  putDay, getDay, getAllDays, getSetting, setSetting,
  putWeekly, getWeekly, exportAll, importAll, clearAll
} from './db.js';

const app = document.querySelector('#app');
const sheetRoot = document.querySelector('#sheet-root');
const toastRoot = document.querySelector('#toast-root');
const importFile = document.querySelector('#import-file');

const state = {
  tab: 'today',
  selectedDate: localDate(),
  sheet: null,
  draftPoop: null,
  settings: { onboarded: false, periodEnabled: true, terminology: 'Poop', units: 'oz', bottleOz: 16 }
};

const BRISTOL = {
  1: ['Separate hard lumps', 'Very hard'],
  2: ['Lumpy, hard, sausage-shaped', 'Hard'],
  3: ['Sausage-shaped with cracks', 'OK / improving'],
  4: ['Smooth, soft and snake-like', 'Usual target'],
  5: ['Soft blobs with clear edges', 'Softer than usual'],
  6: ['Fluffy or mushy pieces', 'Loose'],
  7: ['Entirely watery', 'Watery']
};

const LIQUID_OZ = {
  fewSips: 1,
  halfCup: 4,
  oneCup: 8,
  twoCups: 16,
  halfSmallBottle: 8,
  fullSmallBottle: 16,
  fullLargeBottle: 32
};

const LIQUID_LABELS = {
  fewSips: 'Few sips',
  halfCup: '½ cup',
  oneCup: '1 cup',
  twoCups: '2 cups',
  halfSmallBottle: '½ small bottle',
  fullSmallBottle: 'Full small bottle',
  fullLargeBottle: 'Full large bottle',
  custom: 'Custom'
};

const DEFAULT_QUESTIONS = `Could this be chronic constipation with stool backup?\nWhat is the safest treatment plan and dose?\nShould labs be checked for thyroid, anemia/iron, celiac, glucose/A1c, or hormones/PCOS?\nWhen should the missed period be evaluated?\nWhat symptoms mean urgent care?`;

function localDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function nowTime() { return new Date().toTimeString().slice(0,5); }
function uid(prefix='e') { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }
function esc(value='') { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function dateObj(date) { return new Date(`${date}T12:00:00`); }
function addDays(date, days) { const d = dateObj(date); d.setDate(d.getDate() + days); return localDate(d); }
function formatDate(date, opts={weekday:'long', month:'long', day:'numeric'}) { return new Intl.DateTimeFormat(undefined, opts).format(dateObj(date)); }
function shortDate(date) { return new Intl.DateTimeFormat(undefined, {month:'short', day:'numeric'}).format(dateObj(date)); }
function displayTime(value) {
  if (!value) return '';
  const [h,m] = value.slice(0,5).split(':').map(Number);
  return new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'}).format(new Date(2000,0,1,h,m));
}
function timeOf(entry) { return entry.dateTime?.slice(11,16) || entry.time || ''; }
function dateTime(date, time) { return `${date}T${time || nowTime()}:00`; }
function startOfWeek(date) {
  const d = dateObj(date); const day = d.getDay(); const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate()+diff); return localDate(d);
}
function weekDates(date) { const start = startOfWeek(date); return Array.from({length:7},(_,i)=>addDays(start,i)); }
function maxNum(values) { const nums = values.filter(v => Number.isFinite(Number(v))).map(Number); return nums.length ? Math.max(...nums) : null; }
function avgNum(values) { const nums = values.filter(v => Number.isFinite(Number(v))).map(Number); return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : null; }
function download(name, content, type='application/json') {
  const blob = content instanceof Blob ? content : new Blob([content], {type});
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href=url; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function toast(message) {
  toastRoot.innerHTML = `<div class="toast">${esc(message)}</div>`;
  setTimeout(()=>{ toastRoot.innerHTML=''; }, 2200);
}

function stoolSvg(type) {
  const fill = ['','#84584f','#8a5d51','#8e5b4c','#9b644f','#b77c55','#c18b5a','#cba06e'][type];
  const common = `fill="${fill}" stroke="rgba(92,52,40,.15)" stroke-width="2"`;
  let shapes = '';
  if (type===1) shapes = '<circle cx="16" cy="25" r="8"/><circle cx="34" cy="16" r="9"/><circle cx="53" cy="26" r="9"/><circle cx="72" cy="16" r="8"/><circle cx="87" cy="29" r="7"/>';
  if (type===2) shapes = '<path d="M8 28c4-15 16-19 28-14 6-8 18-5 22 2 10-4 22 3 24 12 5 2 7 8 3 13-7 8-20 6-28 6H25C14 47 5 41 8 28Z"/>';
  if (type===3) shapes = '<path d="M7 23c6-8 14-11 25-10h42c11 0 19 7 19 16s-8 16-20 16H26C15 45 7 38 7 29v-6Z"/><path d="M30 16l5 9M52 14l4 9M71 17l4 8" fill="none" stroke="#d9ab87" stroke-width="3" stroke-linecap="round"/>';
  if (type===4) shapes = '<path d="M7 38c15-21 34-22 49-15 13 6 23 4 37-8 3-3 8 1 5 5-15 20-31 27-48 20-14-6-24-3-35 7-6 5-13-3-8-9Z"/>';
  if (type===5) shapes = '<path d="M11 17c7-6 17-4 21 4 3 7-2 14-11 15-9 1-16-2-17-8-1-4 2-8 7-11ZM41 11c8-5 18 0 19 8 1 8-7 13-16 11-8-2-12-13-3-19ZM68 20c8-6 21-2 22 7 1 8-8 14-17 12-9-2-13-13-5-19ZM36 34c7-4 17 1 17 9 0 7-8 11-15 8-8-3-10-13-2-17Z"/>';
  if (type===6) shapes = '<path d="M10 26c1-9 11-13 20-9 3-8 15-9 21-2 7-6 19-3 21 5 10-3 19 4 17 12-2 9-14 10-22 7-5 7-17 7-23 1-7 7-18 5-21-3-9 3-14-3-13-11Z"/><path d="M20 45c6-6 15-5 20 1M55 47c8-7 18-5 22 1" fill="none" stroke="#c18b5a" stroke-width="6" stroke-linecap="round"/>';
  if (type===7) shapes = '<path d="M8 35c5-16 18-23 35-21 10-7 25-4 31 4 14 0 22 8 20 18-3 14-22 17-35 13-13 6-28 5-39-1C10 45 6 41 8 35Z"/><path d="M24 27c10 4 19 4 27 0M53 39c9-3 16-3 23 0" fill="none" stroke="#efd4ac" stroke-width="5" stroke-linecap="round"/>';
  return `<svg class="stool-shape" viewBox="0 0 100 60" aria-hidden="true"><g ${common}>${shapes}</g></svg>`;
}

async function init() {
  state.settings = { ...state.settings, ...(await getSetting('preferences', {})) };
  if (!state.settings.onboarded) renderWelcome(); else await renderApp();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
}

function renderWelcome() {
  app.innerHTML = `<main style="padding-top:calc(36px + env(safe-area-inset-top,0px)); min-height:100dvh; display:grid; align-content:center; gap:20px;">
    <div class="brand"><span class="brand-mark">✦</span> Glow</div>
    <div>
      <div class="eyebrow">Private gut journal</div>
      <h1>A clearer way to remember how you've been feeling.</h1>
      <p class="subtle">Quickly log meals, drinks, poop, bloating and daily habits. Glow organizes the details without calories, food grades or streak pressure.</p>
    </div>
    <div class="card">
      <div class="summary-list">
        <div class="summary-row"><span>Quick logging</span><strong>A few taps</strong></div>
        <div class="summary-row"><span>Data storage</span><strong>On this device</strong></div>
        <div class="summary-row"><span>Sharing</span><strong>Only when you choose</strong></div>
      </div>
    </div>
    <button class="primary" data-action="finish-onboarding">Start using Glow</button>
    <p class="subtle" style="font-size:12px;text-align:center">Glow records what you enter and summarizes patterns. It does not diagnose medical conditions.</p>
  </main>`;
  app.onclick = async e => {
    if (e.target.closest('[data-action="finish-onboarding"]')) {
      state.settings.onboarded = true; await setSetting('preferences', state.settings); await renderApp();
    }
  };
}

function renderShell(content) {
  return `<header class="topbar">
    <div class="brand"><span class="brand-mark">✦</span> Glow</div>
    <button class="icon-btn" data-action="open-log" aria-label="Log something">＋</button>
  </header>
  <main>${content}</main>
  <nav class="bottom-nav" aria-label="Main navigation">
    ${navButton('today','⌂','Today')}${navButton('history','◷','History')}${navButton('insights','⌁','Insights')}${navButton('more','•••','More')}
  </nav>`;
}
function navButton(tab, icon, label) { return `<button class="nav-btn ${state.tab===tab?'active':''}" data-tab="${tab}"><span class="nav-icon">${icon}</span>${label}</button>`; }

async function renderApp() {
  let content = '';
  if (state.tab==='today') content = await renderToday();
  if (state.tab==='history') content = await renderHistory();
  if (state.tab==='insights') content = await renderInsights();
  if (state.tab==='more') content = await renderMore();
  app.innerHTML = renderShell(content);
  bindAppActions();
}

async function renderToday() {
  const date = state.selectedDate = localDate();
  const [entries, day] = await Promise.all([getEntriesByDate(date), getDay(date)]);
  const drinks = entries.filter(e=>e.type==='drink');
  const meals = entries.filter(e=>e.type==='meal');
  const poops = entries.filter(e=>e.type==='poop');
  const symptoms = entries.filter(e=>e.type==='symptom');
  const totalOz = [...drinks,...meals].reduce((sum,e)=>sum+(Number(e.estimatedOz)||Number(e.liquidOz)||0),0);
  const latestPoop = poops.at(-1);
  const latestSymptom = symptoms.at(-1);
  const wrap = entries.filter(e=>e.type==='wrap').at(-1);
  return `<section class="hero">
      <div class="eyebrow">${formatDate(date,{weekday:'long'})}</div>
      <h1>Today</h1>
      <div class="subtle">${formatDate(date,{month:'long',day:'numeric'})} · Log only what you remember.</div>
    </section>
    <section class="card">
      <div class="section-head"><h2>At a glance</h2><button class="text-btn" data-action="day-details">Day details</button></div>
      <div class="glance">
        <div class="glance-item"><div class="glance-label">Drinks</div><div class="glance-value">${totalOz?`${Math.round(totalOz)} oz`:'—'}</div><div class="glance-meta">estimated</div></div>
        <div class="glance-item"><div class="glance-label">Latest poop</div><div class="glance-value">${latestPoop?(latestPoop.bristol?`Type ${latestPoop.bristol}`:'Not sure'):'—'}</div><div class="glance-meta">${latestPoop?displayTime(timeOf(latestPoop)):'none logged'}</div></div>
        <div class="glance-item"><div class="glance-label">Bloating</div><div class="glance-value">${latestSymptom?.bloating!==undefined?`${latestSymptom.bloating}/10`:'—'}</div><div class="glance-meta">${latestSymptom?displayTime(timeOf(latestSymptom)):'not checked'}</div></div>
      </div>
      ${day ? `<div class="subtle" style="font-size:12px;margin-top:12px">${esc(day.dayType||'day')} · Wake ${day.wakeTime?displayTime(day.wakeTime):'—'} · Bed ${day.bedTime?displayTime(day.bedTime):'—'}</div>`:''}
    </section>
    <section class="section">
      <button class="primary" data-action="open-log">＋ &nbsp; Log something</button>
      <div class="quick-actions">
        ${quick('meal','⌁','Meal')}${quick('drink','◉','Drink')}${quick('poop','●','Poop')}${quick('symptom','≈','Symptoms')}
      </div>
    </section>
    <section class="section">
      <div class="section-head"><h2>Your day</h2><span class="subtle" style="font-size:12px">${entries.length} ${entries.length===1?'entry':'entries'}</span></div>
      ${entries.length ? `<div class="timeline">${entries.slice().reverse().map(entryCard).join('')}</div>` : `<div class="card empty"><div class="empty-icon">✦</div><strong>Nothing logged yet</strong><div style="margin-top:5px">Start with whatever happened most recently.</div></div>`}
    </section>
    <section class="section card checkin">
      <div class="checkin-row"><div class="checkin-badge">✓</div><div style="flex:1"><h3>${wrap?'Evening check-in saved':'Evening check-in'}</h3><div class="subtle" style="font-size:13px;margin-top:3px">${wrap?'You can edit it anytime.':'Fill the gaps in about 30 seconds.'}</div></div><button class="secondary" data-action="open-wrap">${wrap?'Edit':'Check in'}</button></div>
    </section>`;
}
function quick(type, icon, label) { return `<button class="quick" data-log="${type}"><span class="qi">${icon}</span>${label}</button>`; }

function entryCard(e) {
  const d = describeEntry(e);
  return `<article class="entry" data-entry-id="${esc(e.id)}">
    <div class="entry-icon">${d.icon}</div>
    <div><div class="entry-title">${esc(d.title)}</div><div class="entry-meta">${d.meta}</div></div>
    <div><div class="entry-time">${displayTime(timeOf(e))}</div><button class="icon-btn" style="min-width:36px;min-height:36px" data-action="entry-menu" data-id="${esc(e.id)}" aria-label="Entry options">•••</button></div>
  </article>`;
}
function describeEntry(e) {
  if (e.type==='meal') {
    const tags = (e.tags||[]).slice(0,3).map(humanize).join(' · ');
    const liquid = e.liquidEstimate ? ` · ${LIQUID_LABELS[e.liquidEstimate]||e.liquidEstimate}` : '';
    return {icon:'⌁', title: `${cap(e.mealType||'Meal')} · ${e.description||'Meal'}`, meta:`${tags?esc(tags):'Short meal note'}${liquid}`};
  }
  if (e.type==='drink') return {icon:'◉',title:`${cap(e.drinkType||'Drink')} · ${LIQUID_LABELS[e.estimate]||(e.customOz?e.customOz+' oz':'Drink')}`,meta:e.estimatedOz?`About ${esc(e.estimatedOz)} oz`:'Estimated amount'};
  if (e.type==='poop') return {icon:'●',title:`Poop · ${e.bristol ? `Type ${e.bristol}` : 'Not sure'}`,meta:`${e.bristol?BRISTOL[e.bristol]?.[1]||'':'Shape not sure'} · ${esc(e.amount||'amount not set')} · pain ${esc(e.pain??'—')}/10${e.blood==='yes'?' · blood: yes':''}`};
  if (e.type==='symptom') return {icon:'≈',title:`Symptoms · bloating ${e.bloating}/10`,meta:`Pain ${e.pain}/10 · gas ${esc(e.gas)} · hard/swollen ${esc(e.hardSwollen)}`};
  if (e.type==='checkin') return {icon:'♡',title:'Period & habits',meta:`Stress ${esc(e.stress||'—')} · activity ${esc(e.activity||'—')} · urine ${esc(e.urineColor||'—')} · appetite ${esc(e.appetite||'—')}`};
  if (e.type==='wrap') return {icon:'✓',title:'Evening check-in',meta:`Water ${esc(e.waterRating||'—')} · fiber ${esc(e.fiberRating||'—')} · worst bloat ${esc(e.worstBloat)}/10`};
  if (e.type==='safety') return {icon:'!',title:'Safety symptom note',meta:(e.flags||[]).map(humanize).join(' · ')};
  return {icon:'•',title:cap(e.type),meta:''};
}
function cap(s='') { return s ? s[0].toUpperCase()+s.slice(1) : ''; }
function humanize(s='') { return s.replace(/([A-Z])/g,' $1').replace(/^./,m=>m.toUpperCase()); }

async function renderHistory() {
  const dates = Array.from({length:14},(_,i)=>addDays(localDate(), i-13));
  const entries = await getEntriesByDate(state.selectedDate);
  const day = await getDay(state.selectedDate);
  return `<section class="hero"><div class="eyebrow">Your journal</div><h1>History</h1><div class="subtle">Review or edit any day.</div></section>
    <div class="day-strip">${dates.map(d=>`<button class="day-pill ${d===state.selectedDate?'selected':''}" data-date="${d}"><span>${formatDate(d,{weekday:'short'})}</span><strong>${dateObj(d).getDate()}</strong></button>`).join('')}</div>
    <section class="section card">
      <div class="section-head"><div><h2>${formatDate(state.selectedDate,{weekday:'long',month:'short',day:'numeric'})}</h2><div class="subtle" style="font-size:12px;margin-top:4px">${day?`${esc(day.dayType||'day')} · wake ${day.wakeTime?displayTime(day.wakeTime):'—'} · bed ${day.bedTime?displayTime(day.bedTime):'—'}`:'No day details yet'}</div></div><button class="text-btn" data-action="day-details">Edit</button></div>
      ${entries.length?`<div class="timeline">${entries.slice().reverse().map(entryCard).join('')}</div>`:`<div class="empty">No entries on this day.</div>`}
    </section>`;
}

async function getWeekSummary(date=state.selectedDate) {
  const dates = weekDates(date);
  const all = await getAllEntries();
  const entries = all.filter(e=>dates.includes(e.date));
  const poops = entries.filter(e=>e.type==='poop');
  const symptoms = entries.filter(e=>e.type==='symptom');
  const meals = entries.filter(e=>e.type==='meal');
  const checkins = entries.filter(e=>e.type==='checkin');
  const wraps = entries.filter(e=>e.type==='wrap');
  const weekly = await getWeekly(dates[0]);
  const poopsByDay = new Set(poops.map(e=>e.date));
  const type1Days = new Set(poops.filter(e=>Number(e.bristol)===1).map(e=>e.date));
  const darkUrineDays = new Set(checkins.filter(e=>e.urineColor==='dark').map(e=>e.date));
  const fiberDays = new Set(meals.filter(e=>{
    const tags=e.tags||[]; const f=e.fiberFoods||{};
    return tags.some(t=>['fruit','vegetables','oats','beans'].includes(t)) || Object.values(f).some(Boolean);
  }).map(e=>e.date));
  const dairyDays = new Set(meals.filter(e=>(e.tags||[]).some(t=>['dairyCheeseHeavy'].includes(t))).map(e=>e.date));
  const whiteCarbDays = new Set(meals.filter(e=>(e.tags||[]).some(t=>['whiteCarbHeavy'].includes(t))).map(e=>e.date));
  const pruneDays = new Set(meals.filter(e=>e.fiberFoods?.prunes).map(e=>e.date));
  const repeated = new Map();
  meals.forEach(m=>{ const key=(m.description||'').trim().toLowerCase(); if(key) repeated.set(key,(repeated.get(key)||0)+1); });
  const repeatedMeals = [...repeated.entries()].filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const lastPeriod = checkins.filter(e=>e.periodStartedToday==='yes').sort((a,b)=>b.date.localeCompare(a.date))[0]?.date;
  const lastCheckin = checkins.slice().sort((a,b)=>(b.dateTime||'').localeCompare(a.dateTime||''))[0];
  const stoolCounts = Array.from({length:7},(_,i)=>poops.filter(p=>Number(p.bristol)===i+1).length);
  return {
    dates, entries, poops, symptoms, meals, checkins, wraps, weekly,
    totalPoops: poops.length,
    daysNoLoggedPoop: 7-poopsByDay.size,
    type1Days: type1Days.size,
    stoolCounts,
    highestPoopPain: maxNum(poops.map(p=>p.pain)),
    blood: poops.some(p=>p.blood==='yes'),
    highestBellyPain: maxNum(symptoms.map(s=>s.pain)),
    avgBloat: avgNum(symptoms.map(s=>s.bloating)),
    worstBloat: maxNum(symptoms.map(s=>s.bloating)),
    darkUrineDays: darkUrineDays.size,
    fiberDays: fiberDays.size,
    dairyDays: dairyDays.size,
    whiteCarbDays: whiteCarbDays.size,
    pruneDays: pruneDays.size,
    lastPeriod,
    daysLate: lastCheckin?.daysLate || '',
    maxCramps: maxNum(checkins.map(c=>c.crampsPain)),
    heldPoopDays: new Set(checkins.filter(c=>c.heldPoop==='yes').map(c=>c.date)).size,
    satAfterMealDays: new Set(checkins.filter(c=>c.satAfterMeal==='yes').map(c=>c.date)).size,
    repeatedMeals
  };
}

async function renderInsights() {
  const s = await getWeekSummary(localDate());
  const bloatPoints = s.dates.map(date=>{
    const vals=s.symptoms.filter(x=>x.date===date).map(x=>Number(x.bloating));
    return vals.length?Math.max(...vals):null;
  });
  const points = bloatPoints.map((v,i)=>v===null?null:`${15+i*(270/6)},${145-v*12}`).filter(Boolean).join(' ');
  return `<section class="hero"><div class="eyebrow">Patterns, not diagnoses</div><h1>Insights</h1><div class="subtle">${shortDate(s.dates[0])} – ${shortDate(s.dates[6])}</div></section>
    <div class="note info">Glow summarizes what you logged. It does not determine what caused a symptom.</div>
    <section class="section metric-grid">
      <div class="metric"><div class="metric-label">Bowel movements</div><div class="metric-value">${s.totalPoops}</div><div class="metric-foot">${s.daysNoLoggedPoop} days with no logged poop</div></div>
      <div class="metric"><div class="metric-label">Worst bloating</div><div class="metric-value">${s.worstBloat??'—'}${s.worstBloat!==null?'<small>/10</small>':''}</div><div class="metric-foot">Average ${s.avgBloat!==null?s.avgBloat.toFixed(1):'—'}</div></div>
      <div class="metric"><div class="metric-label">Fiber-food days</div><div class="metric-value">${s.fiberDays}<small>/7</small></div><div class="metric-foot">from logged meals</div></div>
      <div class="metric"><div class="metric-label">Dark urine days</div><div class="metric-value">${s.darkUrineDays}</div><div class="metric-foot">from daily check-ins</div></div>
    </section>
    <section class="section card"><div class="section-head"><h2>Bristol types</h2><button class="text-btn" data-action="bristol-guide">Guide</button></div>
      <div class="bar-chart">${s.stoolCounts.map((n,i)=>`<div class="bar-col"><div class="bar" style="height:${Math.max(3,n?18+n*22:3)}px"></div><div class="bar-label">${i+1}</div></div>`).join('')}</div>
      <div class="subtle" style="font-size:12px;margin-top:8px">Counts of each stool type logged this week.</div>
    </section>
    <section class="section card"><div class="section-head"><h2>Bloating over time</h2><span class="subtle" style="font-size:12px">highest each day</span></div>
      ${points ? `<svg class="line-chart" viewBox="0 0 300 160" role="img" aria-label="Highest bloating score by day"><line x1="15" y1="145" x2="285" y2="145" stroke="#dfe4e1"/><line x1="15" y1="25" x2="15" y2="145" stroke="#dfe4e1"/><polyline points="${points}" fill="none" stroke="#267c74" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${bloatPoints.map((v,i)=>v===null?'':`<circle cx="${15+i*(270/6)}" cy="${145-v*12}" r="5" fill="#fff" stroke="#267c74" stroke-width="3"/>`).join('')}</svg>` : '<div class="empty">More symptom entries are needed before a trend can be shown.</div>'}
      <div class="legend">${s.dates.map((d,i)=>`<span>${formatDate(d,{weekday:'short'})}: ${bloatPoints[i]??'—'}</span>`).join('')}</div>
    </section>
    <section class="section card"><div class="section-head"><h2>Repeated meals</h2></div>
      ${s.repeatedMeals.length?s.repeatedMeals.map(([name,count])=>`<div class="summary-row"><span>${esc(name)}</span><strong>${count}×</strong></div>`).join(''):'<div class="empty">No repeated meal labels yet.</div>'}
    </section>
    <section class="section"><button class="primary" data-action="weekly-review">Weekly pattern review</button></section>`;
}

async function renderMore() {
  return `<section class="hero"><div class="eyebrow">Tools & privacy</div><h1>More</h1><div class="subtle">Your data stays on this device unless you export it.</div></section>
    <section class="list-menu">
      ${menu('bristol-guide','Bristol stool guide','Compare all seven shapes')}
      ${menu('doctor-report','Share with a doctor','Weekly summary + questions')}
      ${menu('safety','Safety information','Record concerning symptoms')}
      ${menu('day-details','Today details','Day type, wake and bed times')}
    </section>
    <section class="section card">
      <h2>Preferences</h2>
      <div class="switch-row"><div><strong>Period tracking</strong><div class="subtle" style="font-size:12px;margin-top:2px">Show period questions in daily check-in</div></div><button class="toggle ${state.settings.periodEnabled?'on':''}" data-action="toggle-period" aria-label="Toggle period tracking"><span></span></button></div>
      <div class="switch-row"><div><strong>Wording</strong><div class="subtle" style="font-size:12px;margin-top:2px">${esc(state.settings.terminology)}</div></div><button class="secondary" data-action="toggle-terminology">Change</button></div>
    </section>
    <section class="section card">
      <h2>Data</h2>
      <div style="display:grid;gap:10px;margin-top:14px">
        <button class="secondary" data-action="export-json">Export complete backup</button>
        <button class="secondary" data-action="export-csv">Export CSV</button>
        <button class="secondary" data-action="import-json">Restore backup</button>
        <button class="secondary danger-btn" data-action="clear-data">Delete all Glow data</button>
      </div>
    </section>
    <section class="section note info">No account is required. Nothing is shared automatically.</section>`;
}
function menu(action,title,sub) { return `<button class="menu-row" data-action="${action}"><div><strong>${title}</strong><small>${sub}</small></div><span>›</span></button>`; }

function bindAppActions() {
  app.onclick = async e => {
    const tab = e.target.closest('[data-tab]')?.dataset.tab;
    if (tab) { state.tab=tab; if(tab==='today') state.selectedDate=localDate(); await renderApp(); return; }
    const date = e.target.closest('[data-date]')?.dataset.date;
    if (date) { state.selectedDate=date; await renderApp(); return; }
    const logType = e.target.closest('[data-log]')?.dataset.log;
    if (logType) { openLog(logType); return; }
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    if (action==='open-log') return showSheet('log');
    if (action==='open-wrap') return showSheet('wrap');
    if (action==='day-details') return showSheet('day');
    if (action==='bristol-guide') return showSheet('bristolGuide');
    if (action==='weekly-review') return showSheet('weeklyReview');
    if (action==='doctor-report') return showSheet('doctorReport');
    if (action==='safety') return showSheet('safety');
    if (action==='entry-menu') return showEntryMenu(e.target.closest('[data-id]').dataset.id);
    if (action==='toggle-period') { state.settings.periodEnabled=!state.settings.periodEnabled; await setSetting('preferences',state.settings); await renderApp(); }
    if (action==='toggle-terminology') { state.settings.terminology=state.settings.terminology==='Poop'?'Bowel movement':'Poop'; await setSetting('preferences',state.settings); await renderApp(); }
    if (action==='export-json') { const data=await exportAll(); download(`glow-backup-${localDate()}.json`,JSON.stringify(data,null,2)); toast('Backup exported'); }
    if (action==='export-csv') return exportCsv();
    if (action==='import-json') return importFile.click();
    if (action==='clear-data') { if(confirm('Delete all Glow entries and settings from this device? This cannot be undone.')) { await clearAll(); state.settings={onboarded:true,periodEnabled:true,terminology:'Poop',units:'oz',bottleOz:16}; await setSetting('preferences',state.settings); await renderApp(); toast('All journal data deleted'); } }
  };
}

function openLog(type) {
  if (type==='meal') showSheet('meal');
  if (type==='drink') showSheet('drink');
  if (type==='poop') showSheet('poopType');
  if (type==='symptom') showSheet('symptom');
  if (type==='checkin') showSheet('checkin');
}

async function showSheet(name, payload={}) {
  state.sheet={name,payload};
  sheetRoot.innerHTML = `<div class="sheet-backdrop"><section class="sheet" role="dialog" aria-modal="true" aria-label="${esc(name)}"><div class="grabber"></div><div id="sheet-content"><div class="empty">Loading…</div></div></section></div>`;
  sheetRoot.querySelector('.sheet-backdrop').onclick=e=>{ if(e.target.classList.contains('sheet-backdrop')) closeSheet(); };
  const content = await sheetContent(name,payload);
  sheetRoot.querySelector('#sheet-content').innerHTML=content;
  bindSheet();
}
function closeSheet() { state.sheet=null; sheetRoot.innerHTML=''; }
function sheetHead(title, subtitle='') { return `<div class="sheet-head"><div><h2 class="sheet-title">${title}</h2>${subtitle?`<p class="sheet-subtitle">${subtitle}</p>`:''}</div><button class="icon-btn" data-sheet-action="close" aria-label="Close">×</button></div>`; }

async function sheetContent(name,payload) {
  if (name==='log') return `${sheetHead('What happened?','Choose the quickest match.')}
    <div class="log-menu">${logChoice('meal','⌁','Meal','Photo or a short label')}${logChoice('drink','◉','Drink','A few sips, cup or bottle')}${logChoice('poop','●','Poop','Shape and a few details')}${logChoice('symptom','≈','Symptoms','Bloating, pain or gas')}${logChoice('checkin','♡','Period & habits','Daily details — optional')}</div>`;
  if (name==='meal') return mealForm();
  if (name==='drink') return drinkForm();
  if (name==='poopType') return poopTypeForm();
  if (name==='poopDetails') return poopDetailsForm();
  if (name==='symptom') return symptomForm();
  if (name==='checkin') return checkinForm();
  if (name==='wrap') return wrapForm(await getEntriesByDate(state.selectedDate));
  if (name==='day') return dayForm(await getDay(state.selectedDate));
  if (name==='bristolGuide') return bristolGuide();
  if (name==='entryMenu') return entryMenu(payload.entry);
  if (name==='safety') return safetyForm();
  if (name==='weeklyReview') return weeklyReviewForm(await getWeekSummary(localDate()));
  if (name==='doctorReport') return doctorReport(await getWeekSummary(localDate()));
  return '';
}
function logChoice(type,icon,title,sub) { return `<button class="log-choice" data-open-log="${type}"><span class="choice-icon">${icon}</span><span><strong>${title}</strong><small>${sub}</small></span><span>›</span></button>`; }

function mealForm() {
  return `${sheetHead('Log a meal','Short is enough.')}
  <form class="form" data-form="meal">
    <div class="input-row"><div class="field"><label>Meal</label><select name="mealType"><option>breakfast</option><option>lunch</option><option>snack</option><option>dinner</option><option>other</option></select></div><div class="field"><label>Time</label><input class="input" type="time" name="time" value="${nowTime()}"></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button type="button" class="secondary" data-sheet-action="repeat-last-meal">Repeat last meal</button><button type="button" class="secondary" data-sheet-action="same-yesterday">Same as yesterday</button></div>
    <div class="field"><label>What did you have?</label><textarea name="description" placeholder="rice + chicken + vegetables"></textarea><div class="help">A short freehand label is enough. Write “unsure” if unclear.</div></div>
    <div class="field"><label>Optional photo</label><input class="input" type="file" name="photo" accept="image/*" capture="environment"></div>
    <div class="field"><div class="label">Helpful tags</div><div class="chips" id="meal-tags">
      ${['fruit','vegetables','oats','beans','dairy','riceNoodles','friedFastFood','dairyCheeseHeavy','whiteCarbHeavy','unsure'].map(v=>`<button type="button" class="chip" data-multi="tag" data-value="${v}">${humanize(v)}</button>`).join('')}
    </div></div>
    <details class="details"><summary>Prunes / kiwi / pear</summary><div class="details-body"><div class="input-row"><div class="field"><label>Prunes amount</label><input class="input" name="prunes" placeholder="e.g. 3"></div><div class="field"><label>Kiwi amount</label><input class="input" name="kiwi" placeholder="e.g. 1"></div></div><div class="field"><label>Pear amount</label><input class="input" name="pear" placeholder="e.g. ½"></div></div></details>
    <details class="details"><summary>Add drink with meal</summary><div class="details-body"><div class="input-row"><div class="field"><label>Drink</label><select name="drinkType"><option value="">None</option><option>water</option><option>milk</option><option>juice</option><option>tea</option><option>soup</option><option>other</option></select></div><div class="field"><label>Amount</label><select name="liquidEstimate"><option value="">None</option>${liquidOptions()}</select></div></div></div></details>
    <div class="sticky-actions"><button class="primary" type="submit">Save meal</button></div>
  </form>`;
}
function liquidOptions() { return Object.entries(LIQUID_LABELS).map(([v,l])=>`<option value="${v}">${l}${LIQUID_OZ[v]?` · ~${LIQUID_OZ[v]} oz`:''}</option>`).join(''); }
function drinkForm() {
  return `${sheetHead('Log a drink','About how much?')}
  <form class="form" data-form="drink">
    <div class="input-row"><div class="field"><label>Drink</label><select name="drinkType"><option>water</option><option>milk</option><option>juice</option><option>tea</option><option>soup</option><option>other</option></select></div><div class="field"><label>Time</label><input class="input" type="time" name="time" value="${nowTime()}"></div></div>
    <div class="field"><label>Estimate</label><select name="estimate">${liquidOptions()}</select><div class="help">Soup counts as liquid in the source journal.</div></div>
    <div class="field"><label>Custom ounces, if needed</label><input class="input" type="number" min="0" step="0.5" name="customOz" placeholder="optional"></div>
    <div class="sticky-actions"><button class="primary" type="submit">Add drink</button></div>
  </form>`;
}
function poopTypeForm() {
  return `${sheetHead('Which shape looked closest?','Not sure is okay. Tap the closest match.')}
    <div class="bristol-list">${Object.entries(BRISTOL).map(([type,[desc,meaning]])=>`<button class="bristol" data-bristol="${type}"><span class="bristol-num">TYPE ${type}</span>${stoolSvg(Number(type))}<span><strong>${desc}</strong><small>${meaning}</small></span><span class="check"></span></button>`).join('')}</div>
    <button class="secondary" style="width:100%;margin-top:10px" data-sheet-action="bristol-unsure">Not sure</button>`;
}
function poopDetailsForm() {
  const b = state.draftPoop?.bristol;
  return `${sheetHead('A few details', b?`Type ${b}: ${BRISTOL[b][0]}`:'Shape: not sure')}
  <form class="form" data-form="poop">
    <div class="field"><label>Time</label><input class="input" type="time" name="time" value="${nowTime()}"></div>
    <div class="field"><label>Amount</label><select name="amount"><option>tiny</option><option>small</option><option selected>medium</option><option>large</option><option>not sure</option></select></div>
    ${rangeField('pain','Pain',0)}
    <div class="field"><label>Blood?</label><select name="blood"><option value="no">No</option><option value="yes">Yes</option><option value="not sure">Not sure</option></select></div>
    <details class="details"><summary>Add optional details</summary><div class="details-body"><div class="chips" id="poop-details">${['hardToPass','straining','urgent','feltIncomplete','couldNotPassStool','stoolLeakageAccident'].map(v=>`<button type="button" class="chip" data-multi="detail" data-value="${v}">${humanize(v)}</button>`).join('')}</div><div class="field"><label>Note</label><textarea name="note" placeholder="Anything else to remember"></textarea></div></div></details>
    <div class="sticky-actions"><button class="primary" type="submit">Save poop</button></div>
  </form>`;
}
function symptomForm() {
  return `${sheetHead('How are you feeling?','Add only what you remember.')}
  <form class="form" data-form="symptom">
    <div class="input-row"><div class="field"><label>When</label><select name="when"><option>morning</option><option>afternoon</option><option>bedtime</option><option selected>custom</option></select></div><div class="field"><label>Time</label><input class="input" type="time" name="time" value="${nowTime()}"></div></div>
    ${rangeField('bloating','Bloating',0)}${rangeField('pain','Belly / pelvic pain',0)}
    <div class="input-row"><div class="field"><label>Gas</label><select name="gas"><option>none</option><option>mild</option><option>a lot</option></select></div><div class="field"><label>Hard / swollen?</label><select name="hardSwollen"><option>no</option><option>yes</option><option>not sure</option></select></div></div>
    <div class="field"><label>Optional note</label><textarea name="note" placeholder="Anything else to remember"></textarea></div>
    <div class="sticky-actions"><button class="primary" type="submit">Save symptoms</button></div>
  </form>`;
}
function rangeField(name,label,value) { return `<div class="field"><label>${label}</label><div class="range-wrap"><input type="range" min="0" max="10" step="1" name="${name}" value="${value}" data-range><output class="range-value">${value}</output></div><div class="help">0 none · 5 moderate · 10 worst</div></div>`; }

function checkinForm() {
  return `${sheetHead('Period & habits','Every field can be skipped.')}
  <form class="form" data-form="checkin">
    ${state.settings.periodEnabled?`<div class="card" style="padding:15px"><h3>Period</h3><div class="input-row" style="margin-top:12px"><div class="field"><label>Started today?</label><select name="periodStartedToday"><option value="">Skip</option><option>no</option><option>yes</option></select></div><div class="field"><label>Spotting?</label><select name="spotting"><option value="">Skip</option><option>no</option><option>yes</option><option>not sure</option></select></div></div><div class="input-row"><div class="field"><label>Days late</label><input class="input" type="number" min="0" name="daysLate" placeholder="optional"></div><div class="field"><label>Cramps / pelvic pain 0–10</label><input class="input" type="number" min="0" max="10" name="crampsPain" placeholder="optional"></div></div></div>`:''}
    <div class="field"><label>Held poop / avoided a public bathroom?</label><select name="heldPoop"><option value="">Skip</option><option>no</option><option>yes</option></select></div>
    <div class="input-row"><div class="field"><label>Sat after meal 5–10 min?</label><select name="satAfterMeal"><option value="">Skip</option><option>no</option><option>yes</option></select></div><div class="field"><label>Feet supported?</label><select name="feetSupported"><option value="">Skip</option><option>no</option><option>yes</option></select></div></div>
    <div class="input-row"><div class="field"><label>Activity / walk</label><select name="activity"><option value="">Skip</option><option>none</option><option>some</option><option>good</option></select></div><div class="field"><label>Stress</label><select name="stress"><option value="">Skip</option><option>low</option><option>medium</option><option>high</option></select></div></div>
    <div class="input-row"><div class="field"><label>Urine color</label><select name="urineColor"><option value="">Skip</option><option>pale</option><option>yellow</option><option>dark</option></select></div><div class="field"><label>Appetite</label><select name="appetite"><option value="">Skip</option><option>normal</option><option>low</option></select></div></div>
    <div class="sticky-actions"><button class="primary" type="submit">Save daily check-in</button></div>
  </form>`;
}
function wrapForm(entries) {
  const old = entries.filter(e=>e.type==='wrap').at(-1) || {};
  return `${sheetHead('Evening check-in','Your own impression of the day.')}
  <form class="form" data-form="wrap" data-existing-id="${old.id||''}">
    <div class="input-row"><div class="field"><label>Water</label><select name="waterRating"><option value="">Skip</option>${opts(['low','OK','good'],old.waterRating)}</select></div><div class="field"><label>Fiber</label><select name="fiberRating"><option value="">Skip</option>${opts(['low','OK','good'],old.fiberRating)}</select></div></div>
    ${rangeField('worstBloat','Worst bloating today',old.worstBloat??0)}
    <div class="field"><label>Poop summary</label><select name="poopSummary"><option value="">Skip</option>${opts(['none','pebbly','hard','normal','loose'],old.poopSummary)}</select></div>
    <div class="field"><label>Prunes</label><select name="prunesSummary"><option value="">Skip</option>${opts(['no','little','yes','more gas'],old.prunesSummary)}</select></div>
    <div class="sticky-actions"><button class="primary" type="submit">Finish today</button></div>
  </form>`;
}
function opts(values,selected='') { return values.map(v=>`<option ${String(v)===String(selected)?'selected':''}>${v}</option>`).join(''); }
function dayForm(day={}) {
  day=day||{};
  return `${sheetHead('Day details',formatDate(state.selectedDate,{weekday:'long',month:'long',day:'numeric'}))}
  <form class="form" data-form="day"><div class="field"><label>Day type</label><select name="dayType">${opts(['home','camp','outing','travel'],day.dayType||'home')}</select></div><div class="input-row"><div class="field"><label>Wake</label><input class="input" type="time" name="wakeTime" value="${day.wakeTime||''}"></div><div class="field"><label>Bed</label><input class="input" type="time" name="bedTime" value="${day.bedTime||''}"></div></div><div class="sticky-actions"><button class="primary" type="submit">Save day details</button></div></form>`;
}
function bristolGuide() {
  return `${sheetHead('Bristol stool guide','Match the closest shape. It does not need to be exact.')}
    <div class="bristol-list">${Object.entries(BRISTOL).map(([type,[desc,meaning]])=>`<div class="bristol" style="cursor:default"><span class="bristol-num">TYPE ${type}</span>${stoolSvg(Number(type))}<span><strong>${desc}</strong><small>${meaning}</small></span><span></span></div>`).join('')}</div>
    <div class="note info" style="margin-top:12px">Types 3–4 are the usual target in the source guide. Types 1–2 are harder; Types 6–7 are loose/watery.</div>`;
}
function entryMenu(entry) {
  return `${sheetHead('Entry options',describeEntry(entry).title)}<div class="list-menu"><button class="menu-row" data-sheet-action="delete-entry" data-id="${entry.id}"><div><strong style="color:var(--red)">Delete entry</strong><small>Remove this entry from the journal</small></div><span>›</span></button></div>`;
}
function safetyForm() {
  const flags = [
    'severeOrWorseningBellyPelvicPain','vomiting','bloodInStool','blackStool','weightLoss','fever','hardSwollenBelly','cannotPassStoolOrGas','fainting','painWakingFromSleep','stoolAccidentOrLeakage','positivePregnancyTestWithPainOrBleeding','noPeriodAbout90Days'
  ];
  return `${sheetHead('Safety information','Record concerning symptoms if useful.')}
    <div class="note danger">The source journal says to contact a pediatrician sooner / urgent care for severe or worsening symptoms in this list. Glow cannot tell what is causing a symptom.</div>
    <form class="form" data-form="safety"><div class="field"><label>Symptoms to record</label><div class="chips">${flags.map(v=>`<button type="button" class="chip" data-multi="safety" data-value="${v}">${humanize(v)}</button>`).join('')}</div></div><div class="field"><label>Optional note</label><textarea name="note"></textarea></div><button class="primary" type="submit">Save safety note</button></form>`;
}

function weeklyReviewForm(s) {
  const w=s.weekly||{};
  return `${sheetHead('Weekly pattern review',`${shortDate(s.dates[0])} – ${shortDate(s.dates[6])}`)}
  <div class="note info">Objective counts below are calculated from logs. These questions capture the subjective items from the paper weekly review.</div>
  <div class="card" style="margin-top:12px"><div class="summary-list"><div class="summary-row"><span>Total poops</span><strong>${s.totalPoops}</strong></div><div class="summary-row"><span>Days with no logged poop</span><strong>${s.daysNoLoggedPoop}</strong></div><div class="summary-row"><span>Days with Type 1</span><strong>${s.type1Days}</strong></div><div class="summary-row"><span>Worst bloating</span><strong>${s.worstBloat??'—'}/10</strong></div></div></div>
  <form class="form" data-form="weekly" style="margin-top:18px">
    <input type="hidden" name="weekStart" value="${s.dates[0]}">
    <div class="input-row"><div class="field"><label>Best stool type</label><select name="bestStoolType"><option value="">Unsure</option>${[1,2,3,4,5,6,7].map(n=>`<option ${String(w.bestStoolType)===String(n)?'selected':''}>${n}</option>`).join('')}</select></div><div class="field"><label>Water usually</label><select name="waterUsually"><option value="">Unsure</option>${opts(['low','OK','good'],w.waterUsually)}</select></div></div>
    <div class="field"><label>Away-from-home hydration</label><select name="awayHydration"><option value="">Unsure</option>${opts(['low','OK','good'],w.awayHydration)}</select></div>
    <div class="input-row"><div class="field"><label>Worse after meals?</label><select name="worseAfterMeals">${opts(['unsure','no','yes'],w.worseAfterMeals||'unsure')}</select></div><div class="field"><label>Better after poop / gas?</label><select name="betterAfterPoopGas">${opts(['unsure','no','yes'],w.betterAfterPoopGas||'unsure')}</select></div></div>
    <div class="input-row"><div class="field"><label>Held poop / public bathroom</label><select name="heldPoopFrequency">${opts(['no','sometimes','often'],w.heldPoopFrequency||'no')}</select></div><div class="field"><label>Sat after meals</label><select name="satAfterMealFrequency">${opts(['no','sometimes','often'],w.satAfterMealFrequency||'no')}</select></div></div>
    <div class="field"><label>Repeated meal pattern 1</label><input class="input" name="meal1" value="${esc(w.meal1||s.repeatedMeals[0]?.[0]||'')}"></div>
    <div class="input-row"><div class="field"><label>How many times?</label><input class="input" type="number" name="meal1Count" value="${esc(w.meal1Count||s.repeatedMeals[0]?.[1]||'')}"></div><div class="field"><label>Pebbly stool same days?</label><select name="meal1Pebbly">${opts(['unsure','no','yes'],w.meal1Pebbly||'unsure')}</select></div></div>
    <div class="field"><label>High bloating same days?</label><select name="meal1Bloat">${opts(['unsure','no','yes'],w.meal1Bloat||'unsure')}</select></div>
    <details class="details"><summary>Repeated meal patterns 2–3</summary><div class="details-body">${[2,3].map(i=>`<div class="field"><label>Meal pattern ${i}</label><input class="input" name="meal${i}" value="${esc(w[`meal${i}`]||s.repeatedMeals[i-1]?.[0]||'')}"></div><div class="input-row"><div class="field"><label>Times</label><input class="input" type="number" name="meal${i}Count" value="${esc(w[`meal${i}Count`]||s.repeatedMeals[i-1]?.[1]||'')}"></div><div class="field"><label>Pebbly same days?</label><select name="meal${i}Pebbly">${opts(['unsure','no','yes'],w[`meal${i}Pebbly`]||'unsure')}</select></div></div><div class="field"><label>High bloating same days?</label><select name="meal${i}Bloat">${opts(['unsure','no','yes'],w[`meal${i}Bloat`]||'unsure')}</select></div>`).join('')}</div></details>
    <div class="field"><label>Questions for the pediatrician</label><textarea name="questions" style="min-height:180px">${esc(w.questions||DEFAULT_QUESTIONS)}</textarea></div>
    <div class="sticky-actions"><button class="primary" type="submit">Save weekly review</button></div>
  </form>`;
}

function doctorReport(s) {
  const w=s.weekly||{};
  return `${sheetHead('Doctor report','A one-week summary of user-entered information.')}
    <div class="no-print" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px"><button class="secondary" data-sheet-action="weekly-review">Edit weekly review</button><button class="primary" data-sheet-action="print">Print / Save PDF</button></div>
    <article class="report" id="doctor-report">
      <div class="eyebrow">Glow · Gut & Symptom Journal</div><h1 style="font-size:28px">Weekly Pattern Summary</h1><small>${shortDate(s.dates[0])} – ${shortDate(s.dates[6])} · Generated ${new Date().toLocaleDateString()}</small>
      <div class="note info" style="margin-top:14px">This report summarizes user-entered information and calculated counts. It is not a diagnosis.</div>
      <h2>Bowel pattern</h2><div class="summary-list"><div class="summary-row"><span>Total poops</span><strong>${s.totalPoops}</strong></div><div class="summary-row"><span>Days with no logged poop</span><strong>${s.daysNoLoggedPoop}</strong></div><div class="summary-row"><span>Days with pebbly Type 1</span><strong>${s.type1Days}</strong></div><div class="summary-row"><span>Best stool type (user review)</span><strong>${w.bestStoolType||'—'}</strong></div></div>
      <h2>Pain & blood</h2><div class="summary-list"><div class="summary-row"><span>Highest poop pain</span><strong>${s.highestPoopPain??'—'}/10</strong></div><div class="summary-row"><span>Blood recorded</span><strong>${s.blood?'yes':'no'}</strong></div><div class="summary-row"><span>Highest belly / pelvic pain</span><strong>${s.highestBellyPain??'—'}/10</strong></div></div>
      <h2>Bloating</h2><div class="summary-list"><div class="summary-row"><span>Average logged bloating</span><strong>${s.avgBloat!==null?s.avgBloat.toFixed(1):'—'}/10</strong></div><div class="summary-row"><span>Worst logged bloating</span><strong>${s.worstBloat??'—'}/10</strong></div><div class="summary-row"><span>Worse after meals?</span><strong>${w.worseAfterMeals||'unsure'}</strong></div><div class="summary-row"><span>Better after poop/gas?</span><strong>${w.betterAfterPoopGas||'unsure'}</strong></div></div>
      <h2>Liquid</h2><div class="summary-list"><div class="summary-row"><span>Water usually</span><strong>${w.waterUsually||'—'}</strong></div><div class="summary-row"><span>Away-from-home hydration</span><strong>${w.awayHydration||'—'}</strong></div><div class="summary-row"><span>Dark urine days</span><strong>${s.darkUrineDays}</strong></div></div>
      <h2>Food pattern</h2><div class="summary-list"><div class="summary-row"><span>Fiber-food days</span><strong>${s.fiberDays}/7</strong></div><div class="summary-row"><span>Dairy/cheese-heavy days</span><strong>${s.dairyDays}/7</strong></div><div class="summary-row"><span>White-carb-heavy days</span><strong>${s.whiteCarbDays}/7</strong></div><div class="summary-row"><span>Prune days</span><strong>${s.pruneDays}/7</strong></div></div>
      <h2>Period</h2><div class="summary-list"><div class="summary-row"><span>Last logged period start</span><strong>${s.lastPeriod?shortDate(s.lastPeriod):'—'}</strong></div><div class="summary-row"><span>Days late by latest check-in</span><strong>${s.daysLate||'—'}</strong></div><div class="summary-row"><span>Highest cramps/pelvic pain</span><strong>${s.maxCramps??'—'}/10</strong></div></div>
      <h2>Routine / bathroom</h2><div class="summary-list"><div class="summary-row"><span>Held poop / avoided public bathroom</span><strong>${w.heldPoopFrequency||`${s.heldPoopDays} logged day(s)`}</strong></div><div class="summary-row"><span>Sat after meal 5–10 min</span><strong>${w.satAfterMealFrequency||`${s.satAfterMealDays} logged day(s)`}</strong></div></div>
      <h2>Repeated meal patterns</h2><div class="table-wrap"><table><thead><tr><th>Meal pattern</th><th>Times</th><th>Pebbly stool same days?</th><th>High bloating same days?</th></tr></thead><tbody>${[1,2,3].map(i=>`<tr><td>${esc(w[`meal${i}`]||s.repeatedMeals[i-1]?.[0]||'—')}</td><td>${esc(w[`meal${i}Count`]||s.repeatedMeals[i-1]?.[1]||'—')}</td><td>${esc(w[`meal${i}Pebbly`]||'unsure')}</td><td>${esc(w[`meal${i}Bloat`]||'unsure')}</td></tr>`).join('')}</tbody></table></div>
      <h2>Questions for the pediatrician</h2><div style="white-space:pre-line;line-height:1.55">${esc(w.questions||DEFAULT_QUESTIONS)}</div>
    </article>`;
}

function bindSheet() {
  const root=sheetRoot;
  root.querySelectorAll('[data-range]').forEach(r=>r.addEventListener('input',()=>{ r.nextElementSibling.value=r.value; r.nextElementSibling.textContent=r.value; }));
  root.querySelectorAll('[data-multi]').forEach(btn=>btn.addEventListener('click',()=>btn.classList.toggle('selected')));
  root.querySelectorAll('[data-bristol]').forEach(btn=>btn.addEventListener('click',()=>{ state.draftPoop={bristol:Number(btn.dataset.bristol)}; showSheet('poopDetails'); }));
  root.querySelectorAll('[data-open-log]').forEach(btn=>btn.addEventListener('click',()=>openLog(btn.dataset.openLog)));
  root.querySelectorAll('form[data-form]').forEach(form=>form.addEventListener('submit',handleForm));
  root.onclick = async e => {
    const action=e.target.closest('[data-sheet-action]')?.dataset.sheetAction;
    if(!action) return;
    if(action==='close') return closeSheet();
    if(action==='bristol-unsure') { state.draftPoop={bristol:null}; return showSheet('poopDetails'); }
    if(action==='delete-entry') { const id=e.target.closest('[data-id]').dataset.id; if(confirm('Delete this entry?')) { await deleteEntry(id); closeSheet(); await renderApp(); toast('Entry deleted'); } }
    if(action==='repeat-last-meal') return prefillMeal('last');
    if(action==='same-yesterday') return prefillMeal('yesterday');
    if(action==='weekly-review') return showSheet('weeklyReview');
    if(action==='print') return window.print();
  };
}

async function handleForm(event) {
  event.preventDefault();
  const form=event.currentTarget; const fd=new FormData(form); const kind=form.dataset.form; const date=state.selectedDate;
  try {
    if(kind==='meal') {
      const estimate=fd.get('liquidEstimate'); const customPhoto=fd.get('photo');
      const entry={id:uid('meal'),type:'meal',date,dateTime:dateTime(date,fd.get('time')),mealType:fd.get('mealType'),description:String(fd.get('description')||'').trim(),tags:selectedValues('tag'),fiberFoods:{prunes:String(fd.get('prunes')||'').trim(),kiwi:String(fd.get('kiwi')||'').trim(),pear:String(fd.get('pear')||'').trim()},drinkType:fd.get('drinkType'),liquidEstimate:estimate,liquidOz:LIQUID_OZ[estimate]||0};
      if(customPhoto instanceof File && customPhoto.size) entry.photo=customPhoto;
      await putEntry(entry); closeSheet(); await renderApp(); toast('Meal saved');
    }
    if(kind==='drink') { const est=fd.get('estimate'); const custom=Number(fd.get('customOz'))||0; await putEntry({id:uid('drink'),type:'drink',date,dateTime:dateTime(date,fd.get('time')),drinkType:fd.get('drinkType'),estimate:est,customOz:custom||'',estimatedOz:custom||LIQUID_OZ[est]||0}); closeSheet(); await renderApp(); toast('Drink added'); }
    if(kind==='poop') { const blood=fd.get('blood'); await putEntry({id:uid('poop'),type:'poop',date,dateTime:dateTime(date,fd.get('time')),bristol:state.draftPoop?.bristol||null,amount:fd.get('amount'),pain:Number(fd.get('pain')),blood,details:selectedValues('detail'),note:String(fd.get('note')||'').trim()}); state.draftPoop=null; closeSheet(); await renderApp(); toast('Poop saved'); if(blood==='yes') setTimeout(()=>showSheet('safety'),250); }
    if(kind==='symptom') { const hard=fd.get('hardSwollen'); const pain=Number(fd.get('pain')); await putEntry({id:uid('symptom'),type:'symptom',date,dateTime:dateTime(date,fd.get('time')),when:fd.get('when'),bloating:Number(fd.get('bloating')),pain,gas:fd.get('gas'),hardSwollen:hard,note:String(fd.get('note')||'').trim()}); closeSheet(); await renderApp(); toast('Symptoms saved'); if((pain>=8)||hard==='yes') setTimeout(()=>showSheet('safety'),250); }
    if(kind==='checkin') { await putEntry({id:uid('checkin'),type:'checkin',date,dateTime:dateTime(date,nowTime()),periodStartedToday:fd.get('periodStartedToday')||'',spotting:fd.get('spotting')||'',daysLate:fd.get('daysLate')||'',crampsPain:fd.get('crampsPain')===''?'':Number(fd.get('crampsPain')),heldPoop:fd.get('heldPoop')||'',satAfterMeal:fd.get('satAfterMeal')||'',feetSupported:fd.get('feetSupported')||'',activity:fd.get('activity')||'',stress:fd.get('stress')||'',urineColor:fd.get('urineColor')||'',appetite:fd.get('appetite')||''}); closeSheet(); await renderApp(); toast('Daily check-in saved'); }
    if(kind==='wrap') { const id=form.dataset.existingId||uid('wrap'); await putEntry({id,type:'wrap',date,dateTime:dateTime(date,nowTime()),waterRating:fd.get('waterRating'),fiberRating:fd.get('fiberRating'),worstBloat:Number(fd.get('worstBloat')),poopSummary:fd.get('poopSummary'),prunesSummary:fd.get('prunesSummary')}); closeSheet(); await renderApp(); toast('Done for today'); }
    if(kind==='day') { await putDay({date,dayType:fd.get('dayType'),wakeTime:fd.get('wakeTime'),bedTime:fd.get('bedTime')}); closeSheet(); await renderApp(); toast('Day details saved'); }
    if(kind==='safety') { const flags=selectedValues('safety'); if(!flags.length){toast('Choose a symptom or close this sheet');return;} await putEntry({id:uid('safety'),type:'safety',date,dateTime:dateTime(date,nowTime()),flags,note:String(fd.get('note')||'').trim()}); closeSheet(); await renderApp(); toast('Safety note saved'); }
    if(kind==='weekly') { const record={weekStart:fd.get('weekStart')}; for(const [k,v] of fd.entries()) if(k!=='weekStart') record[k]=v; await putWeekly(record); closeSheet(); await renderApp(); toast('Weekly review saved'); }
  } catch(err) { console.error(err); toast('Your entry wasn’t saved. Please try again.'); }
}
function selectedValues(group) { return [...sheetRoot.querySelectorAll(`[data-multi="${group}"].selected`)].map(b=>b.dataset.value); }

async function prefillMeal(mode) {
  const all=await getAllEntries(); let meals=all.filter(e=>e.type==='meal');
  if(mode==='yesterday') meals=meals.filter(e=>e.date===addDays(state.selectedDate,-1));
  else meals=meals.filter(e=>e.date<=state.selectedDate);
  const meal=meals.at(-1); if(!meal){toast(mode==='yesterday'?'No meal found yesterday':'No earlier meal found');return;}
  const form=sheetRoot.querySelector('form[data-form="meal"]');
  form.elements.description.value=meal.description||''; form.elements.mealType.value=meal.mealType||'breakfast';
  (meal.tags||[]).forEach(v=>sheetRoot.querySelector(`[data-multi="tag"][data-value="${v}"]`)?.classList.add('selected'));
  if(meal.fiberFoods){ form.elements.prunes.value=meal.fiberFoods.prunes||''; form.elements.kiwi.value=meal.fiberFoods.kiwi||''; form.elements.pear.value=meal.fiberFoods.pear||''; }
  toast(mode==='yesterday'?'Copied yesterday’s meal':'Copied last meal');
}

async function showEntryMenu(id) { const all=await getAllEntries(); const entry=all.find(e=>e.id===id); if(entry) showSheet('entryMenu',{entry}); }

async function exportCsv() {
  const all=await getAllEntries();
  const rows=[['date','time','type','summary','details_json']];
  all.forEach(e=>{ const d=describeEntry(e); rows.push([e.date,timeOf(e),e.type,d.title,JSON.stringify({...e,photo:e.photo?'[photo stored locally]':undefined})]); });
  const csv=rows.map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n');
  download(`glow-journal-${localDate()}.csv`,csv,'text/csv'); toast('CSV exported');
}

importFile.addEventListener('change', async () => {
  const file=importFile.files?.[0]; if(!file) return;
  try { const data=JSON.parse(await file.text()); if(confirm('Replace the current Glow data with this backup?')) { await importAll(data); state.settings={...state.settings,...(await getSetting('preferences',{}))}; await renderApp(); toast('Backup restored'); } }
  catch(err){ console.error(err); toast(err.message||'Could not restore that backup'); }
  importFile.value='';
});

init();
