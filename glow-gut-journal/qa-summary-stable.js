import { getAllEntries, getSetting, getWeekly } from './db.js';

const app = document.querySelector('#app');
const sheetRoot = document.querySelector('#sheet-root');
let timer = null;
let running = false;

function localDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function dateObj(date) { return new Date(`${date}T12:00:00`); }
function addDays(date, n) { const d = dateObj(date); d.setDate(d.getDate()+n); return localDate(d); }
function fmt(date) { return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(dateObj(date)); }
function setText(node, value) { const next = String(value); if (node && node.textContent !== next) node.textContent = next; }
function nums(values) { return values.filter(v => v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v))).map(Number); }
function max(values) { const n=nums(values); return n.length ? Math.max(...n) : null; }
function avg(values) { const n=nums(values); return n.length ? n.reduce((a,b)=>a+b,0)/n.length : null; }

async function summary() {
  const prefs = await getSetting('preferences', {});
  const start = prefs.startDate || localDate();
  const dates = Array.from({length:7},(_,i)=>addDays(start,i));
  const all = await getAllEntries();
  const entries = all.filter(e => dates.includes(e.date));
  const poops = entries.filter(e=>e.type==='poop');
  const symptoms = entries.filter(e=>e.type==='symptom');
  const meals = entries.filter(e=>e.type==='meal');
  const checkins = entries.filter(e=>e.type==='checkin');
  const wraps = entries.filter(e=>e.type==='wrap');
  const elapsed = dates.filter(d=>d<=localDate());
  const poopDays = new Set(poops.map(e=>e.date));
  const confirmed = new Set(wraps.filter(w=>w.poopSummary==='none'&&!poopDays.has(w.date)).map(w=>w.date));
  const unconfirmed = elapsed.filter(d=>!poopDays.has(d)&&!confirmed.has(d));
  const type1 = new Set(poops.filter(p=>Number(p.bristol)===1).map(p=>p.date));
  const dark = new Set(checkins.filter(c=>c.urineColor==='dark').map(c=>c.date));
  const fiber = new Set(meals.filter(m=>(m.tags||[]).some(t=>['fruit','vegetables','oats','beans'].includes(t))||Object.values(m.fiberFoods||{}).some(Boolean)).map(m=>m.date));
  const dairy = new Set(meals.filter(m=>(m.tags||[]).includes('dairyCheeseHeavy')).map(m=>m.date));
  const white = new Set(meals.filter(m=>(m.tags||[]).includes('whiteCarbHeavy')).map(m=>m.date));
  const prune = new Set(meals.filter(m=>m.fiberFoods?.prunes).map(m=>m.date));
  const lastCheckin = checkins.slice().sort((a,b)=>(b.dateTime||'').localeCompare(a.dateTime||''))[0];
  const allCheckins = all.filter(e=>e.type==='checkin');
  const lastPeriod = allCheckins.filter(e=>e.periodStartedToday==='yes').sort((a,b)=>(b.dateTime||b.date||'').localeCompare(a.dateTime||a.date||''))[0]?.date;
  const blood = poops.map(p=>p.blood).filter(Boolean);
  return {
    start, end:dates[6], dates, poops, symptoms, meals, checkins,
    totalPoops:poops.length, confirmedNoPoopDays:confirmed.size, unconfirmedDays:unconfirmed.length,
    type1Days:type1.size, highestPoopPain:max(poops.map(p=>p.pain)),
    blood:blood.includes('yes')?'yes':(poops.length&&blood.length===poops.length?'no':'not fully recorded'),
    highestBellyPain:max(symptoms.map(s=>s.pain)), avgBloat:avg(symptoms.map(s=>s.bloating)), worstBloat:max(symptoms.map(s=>s.bloating)),
    darkUrineDays:dark.size, fiberDays:fiber.size, dairyDays:dairy.size, whiteCarbDays:white.size, pruneDays:prune.size,
    lastPeriod, daysLate:lastCheckin?.daysLate||'', maxCramps:max(checkins.map(c=>c.crampsPain)),
    heldPoopDays:new Set(checkins.filter(c=>c.heldPoop==='yes').map(c=>c.date)).size,
    satAfterMealDays:new Set(checkins.filter(c=>c.satAfterMeal==='yes').map(c=>c.date)).size,
    weekly:await getWeekly(start)
  };
}

function row(container, oldLabel, value, newLabel = null) {
  for (const r of container.querySelectorAll('.summary-row')) {
    const label = r.querySelector('span');
    if (label?.textContent.trim() === oldLabel || (newLabel && label?.textContent.trim() === newLabel)) {
      if (newLabel) setText(label,newLabel);
      setText(r.querySelector('strong'),value);
    }
  }
}

function cleanDuplicateChoices() {
  for (const form of document.querySelectorAll('form[data-form="meal"],form[data-form="drink"]')) {
    for (const name of ['mealType','drinkType']) {
      const select = form.elements[name];
      const group = select?.nextElementSibling;
      group?.querySelector('.qa-choice[data-value=""]')?.remove();
    }
  }
}

function applyInsights(s) {
  if (app.querySelector('.hero h1')?.textContent.trim() !== 'Insights') return;
  setText(app.querySelector('.hero .subtle'),`${fmt(s.start)} – ${fmt(s.end)} · tracking period`);
  for (const metric of app.querySelectorAll('.metric')) {
    const label = metric.querySelector('.metric-label')?.textContent.trim();
    if (label === 'Bowel movements') {
      setText(metric.querySelector('.metric-value'),s.totalPoops);
      setText(metric.querySelector('.metric-foot'),`${s.confirmedNoPoopDays} confirmed no-poop · ${s.unconfirmedDays} unconfirmed`);
    }
    if (label === 'Worst bloating') {
      const value = metric.querySelector('.metric-value');
      const wanted = s.worstBloat===null?'—':`${s.worstBloat}/10`;
      if (value && value.textContent.trim() !== wanted) value.textContent = wanted;
      setText(metric.querySelector('.metric-foot'),`Average ${s.avgBloat===null?'—':s.avgBloat.toFixed(1)}`);
    }
    if (label === 'Fiber-food days') setText(metric.querySelector('.metric-value'),`${s.fiberDays}/7`);
    if (label === 'Dark urine days') setText(metric.querySelector('.metric-value'),s.darkUrineDays);
  }
  app.querySelector('#week-progress-note')?.remove();
  let note=app.querySelector('#qa-tracking-note');
  if(!note){note=document.createElement('div');note.id='qa-tracking-note';note.className='note';note.style.marginTop='8px';note.style.background='var(--surface-2)';app.querySelector('.note.info')?.after(note);}
  setText(note,`Uses the journal start date (${fmt(s.start)}), not Monday–Sunday. Missing entries are not treated as “no poop.”`);
}

function applyDoctor(s) {
  const report=sheetRoot.querySelector('#doctor-report'); if(!report)return;
  const small=report.querySelector('small'); if(small)setText(small,`${fmt(s.start)} – ${fmt(s.end)} · tracking period · Generated ${new Date().toLocaleDateString()}`);
  row(report,'Total poops',s.totalPoops);
  row(report,'Days with no logged poop',s.confirmedNoPoopDays,'Confirmed days with no poop');
  row(report,'Days with pebbly Type 1',s.type1Days);
  row(report,'Highest poop pain',s.highestPoopPain===null?'—':`${s.highestPoopPain}/10`);
  row(report,'Blood recorded',s.blood);
  row(report,'Highest belly / pelvic pain',s.highestBellyPain===null?'—':`${s.highestBellyPain}/10`);
  row(report,'Average logged bloating',s.avgBloat===null?'—':`${s.avgBloat.toFixed(1)}/10`);
  row(report,'Worst logged bloating',s.worstBloat===null?'—':`${s.worstBloat}/10`);
  row(report,'Dark urine days',s.darkUrineDays);
  row(report,'Fiber-food days',`${s.fiberDays}/7`);
  row(report,'Dairy/cheese-heavy days',`${s.dairyDays}/7`);
  row(report,'White-carb-heavy days',`${s.whiteCarbDays}/7`);
  row(report,'Prune days',`${s.pruneDays}/7`);
  row(report,'Last logged period start',s.lastPeriod?fmt(s.lastPeriod):'—');
  row(report,'Days late by latest check-in',s.daysLate||'—');
  row(report,'Highest cramps/pelvic pain',s.maxCramps===null?'—':`${s.maxCramps}/10`);
  const w=s.weekly||{};
  row(report,'Best stool type (user review)',w.bestStoolType||'—');
  row(report,'Worse after meals?',w.worseAfterMeals||'unsure');
  row(report,'Better after poop/gas?',w.betterAfterPoopGas||'unsure');
  row(report,'Water usually',w.waterUsually||'—');
  row(report,'Away-from-home hydration',w.awayHydration||'—');
  row(report,'Held poop / avoided public bathroom',w.heldPoopFrequency||`${s.heldPoopDays} logged day(s)`);
  row(report,'Sat after meal 5–10 min',w.satAfterMealFrequency||`${s.satAfterMealDays} logged day(s)`);
  let note=report.querySelector('#qa-unknown-days');if(!note){note=document.createElement('div');note.id='qa-unknown-days';note.className='note';note.style.marginTop='10px';note.style.background='var(--surface-2)';report.querySelector('.note.info')?.after(note);}setText(note,`${s.unconfirmedDays} elapsed day${s.unconfirmedDays===1?' is':'s are'} unconfirmed: no poop entry and no explicit “none” evening summary.`);
}

function applyWeekly(s) {
  if(sheetRoot.querySelector('.sheet-title')?.textContent.trim()!=='Weekly pattern review')return;
  setText(sheetRoot.querySelector('.sheet-subtitle'),`${fmt(s.start)} – ${fmt(s.end)}`);
  const form=sheetRoot.querySelector('form[data-form="weekly"]');if(form?.elements.weekStart)form.elements.weekStart.value=s.start;
  row(sheetRoot,'Total poops',s.totalPoops);row(sheetRoot,'Days with no logged poop',s.confirmedNoPoopDays,'Confirmed days with no poop');row(sheetRoot,'Days with Type 1',s.type1Days);row(sheetRoot,'Worst bloating',s.worstBloat===null?'—':`${s.worstBloat}/10`);
  if(form&&s.weekly&&!form.dataset.qaStablePrefilled){form.dataset.qaStablePrefilled='1';for(const[k,v]of Object.entries(s.weekly)){if(k!=='weekStart'&&form.elements[k])form.elements[k].value=v;}}
}

async function apply() {
  if(running)return;running=true;
  try { cleanDuplicateChoices(); const s=await summary(); applyInsights(s); applyDoctor(s); applyWeekly(s); }
  finally { running=false; }
}
function schedule(delay=40){clearTimeout(timer);timer=setTimeout(apply,delay);}

document.addEventListener('click',event=>{
  if(event.target.closest('[data-tab="insights"],[data-action="doctor-report"],[data-action="weekly-review"],[data-sheet-action="weekly-review"]')) schedule(100);
},true);
const observer=new MutationObserver(()=>schedule());
observer.observe(document.body,{childList:true,subtree:true});
schedule(0);
