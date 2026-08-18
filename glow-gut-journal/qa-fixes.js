import { getAllEntries, getSetting, getWeekly, putEntry } from './db.js';

const app = document.querySelector('#app');
const sheetRoot = document.querySelector('#sheet-root');
const toastRoot = document.querySelector('#toast-root');
let busy = false;

const KNOWN_OZ = { halfCup:4, oneCup:8, twoCups:16, halfSmallBottle:8, fullSmallBottle:16, fullLargeBottle:32 };
const LIQUID_LABELS = {
  fewSips:'Few sips', halfCup:'½ cup · ~4 oz', oneCup:'1 cup · ~8 oz', twoCups:'2 cups · ~16 oz',
  halfSmallBottle:'½ small bottle · ~8 oz', fullSmallBottle:'Full small bottle · ~16 oz', fullLargeBottle:'Full large bottle · ~32 oz', custom:'Custom'
};

function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function dateObj(d){return new Date(`${d}T12:00:00`);}
function addDays(d,n){const x=dateObj(d);x.setDate(x.getDate()+n);return localDate(x);}
function fmt(d){return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(dateObj(d));}
function activeDate(){return document.querySelector('.day-pill.selected')?.dataset.date||localDate();}
function nowTime(){return new Date().toTimeString().slice(0,5);}
function dt(date,time){return `${date}T${time||nowTime()}:00`;}
function uid(p='e'){return `${p}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;}
function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function timeOf(e){return e.dateTime?.slice(11,16)||e.time||'';}
function missingNumber(v){return v===''||v===null||v===undefined?undefined:Number(v);}
function nums(values){return values.filter(v=>v!==''&&v!==null&&v!==undefined&&Number.isFinite(Number(v))).map(Number);}
function max(values){const n=nums(values);return n.length?Math.max(...n):null;}
function avg(values){const n=nums(values);return n.length?n.reduce((a,b)=>a+b,0)/n.length:null;}
function setText(node,value){const s=String(value);if(node&&node.textContent!==s)node.textContent=s;}
function toast(message){if(!toastRoot)return;toastRoot.innerHTML=`<div class="toast">${esc(message)}</div>`;setTimeout(()=>{if(toastRoot.textContent===message)toastRoot.innerHTML='';},2200);}
function refresh(){document.querySelector('.nav-btn.active')?.click();}
function closeSheet(){sheetRoot.innerHTML='';}

function inferMealType(time=nowTime()){
  const [h,m]=String(time).split(':').map(Number);const x=h*60+(m||0);
  if(x<630)return'breakfast';if(x<870)return'lunch';if(x<1035)return'snack';if(x<1290)return'dinner';return'other';
}

function ensureBlank(select,label='Not recorded'){
  if(!select)return;let option=[...select.options].find(o=>o.value==='');
  if(!option){option=document.createElement('option');option.value='';option.textContent=label;select.prepend(option);}else option.textContent=label;
}
function choiceButtons(select,choices,clearLabel='Not recorded'){
  if(!select||select.dataset.qaEnhanced)return;
  select.dataset.qaEnhanced='1';ensureBlank(select,clearLabel);select.classList.add('qa-hidden-control');
  const group=document.createElement('div');group.className='qa-choice-grid';
  const sync=()=>group.querySelectorAll('.qa-choice').forEach(b=>{const on=b.dataset.value===select.value;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));});
  [...choices,['',clearLabel]].forEach(([value,label])=>{const b=document.createElement('button');b.type='button';b.className='qa-choice';b.dataset.value=value;b.textContent=label;b.setAttribute('aria-pressed','false');b.onclick=()=>{select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));sync();};group.append(b);});
  select.after(group);sync();
}
function scorePicker(field,name){
  if(!field||field.dataset.qaScore)return;field.dataset.qaScore='1';const original=field.querySelector(`input[name="${name}"]`);if(!original)return;
  original.removeAttribute('name');field.querySelector('.range-wrap')?.remove();
  const hidden=document.createElement('input');hidden.type='hidden';hidden.name=name;hidden.value='';
  const group=document.createElement('div');group.className='qa-score-grid';
  const clear=document.createElement('button');clear.type='button';clear.className='qa-score-clear selected';clear.textContent='Not checked';
  const sync=()=>{group.querySelectorAll('.qa-score').forEach(b=>b.classList.toggle('selected',b.dataset.value===hidden.value));clear.classList.toggle('selected',hidden.value==='');};
  for(let i=0;i<=10;i++){const b=document.createElement('button');b.type='button';b.className='qa-score';b.dataset.value=String(i);b.textContent=String(i);b.onclick=()=>{hidden.value=String(i);sync();};group.append(b);}clear.onclick=()=>{hidden.value='';sync();};
  field.append(hidden,group,clear);const help=field.querySelector('.help');if(help)help.textContent='Optional · 0 none · 5 moderate · 10 worst';
}

function enhanceForms(){
  const meal=document.querySelector('form[data-form="meal"]');
  if(meal&&!meal.dataset.qaForm){meal.dataset.qaForm='1';const t=meal.elements.time;const type=meal.elements.mealType;type.value=inferMealType(t?.value);choiceButtons(type,[['breakfast','Breakfast'],['lunch','Lunch'],['snack','Snack'],['dinner','Dinner'],['other','Other']],'Other');t?.addEventListener('change',()=>{if(type.dataset.userPicked)return;type.value=inferMealType(t.value);type.dispatchEvent(new Event('change',{bubbles:true}));type.nextElementSibling?.querySelector(`[data-value="${type.value}"]`)?.click();});type.nextElementSibling?.addEventListener('click',()=>{type.dataset.userPicked='1';});const est=meal.elements.liquidEstimate;if(est){est.value='';choiceButtons(est,Object.entries(LIQUID_LABELS),'No drink amount');}}
  const drink=document.querySelector('form[data-form="drink"]');
  if(drink&&!drink.dataset.qaForm){drink.dataset.qaForm='1';choiceButtons(drink.elements.drinkType,[['water','Water'],['milk','Milk'],['juice','Juice'],['tea','Tea'],['soup','Soup'],['other','Other']],'Other');drink.elements.estimate.value='';choiceButtons(drink.elements.estimate,Object.entries(LIQUID_LABELS),'Not recorded');}
  const poop=document.querySelector('form[data-form="poop"]');
  if(poop&&!poop.dataset.qaForm){poop.dataset.qaForm='1';poop.elements.amount.value='';choiceButtons(poop.elements.amount,[['tiny','Tiny'],['small','Small'],['medium','Medium'],['large','Large']],'Not sure / skip');poop.elements.blood.value='';choiceButtons(poop.elements.blood,[['no','No'],['yes','Yes'],['not sure','Not sure']],'Skip');scorePicker([...poop.querySelectorAll('.field')].find(f=>f.querySelector('label')?.textContent.trim()==='Pain'),'pain');}
  const symptom=document.querySelector('form[data-form="symptom"]');
  if(symptom&&!symptom.dataset.qaForm){symptom.dataset.qaForm='1';scorePicker([...symptom.querySelectorAll('.field')].find(f=>f.querySelector('label')?.textContent.trim()==='Bloating'),'bloating');scorePicker([...symptom.querySelectorAll('.field')].find(f=>f.querySelector('label')?.textContent.includes('Belly / pelvic pain')),'pain');symptom.elements.gas.value='';choiceButtons(symptom.elements.gas,[['none','None'],['mild','Mild'],['a lot','A lot']],'Skip');symptom.elements.hardSwollen.value='';choiceButtons(symptom.elements.hardSwollen,[['no','No'],['yes','Yes'],['not sure','Not sure']],'Skip');}
}
function selected(group){return[...sheetRoot.querySelectorAll(`[data-multi="${group}"].selected`)].map(b=>b.dataset.value);}
function bristolFromSheet(){const m=(sheetRoot.querySelector('.sheet-subtitle')?.textContent||'').match(/Type\s+(\d)/i);return m?Number(m[1]):undefined;}

async function saveFast(form){
  const fd=new FormData(form),kind=form.dataset.form,date=activeDate();
  if(kind==='meal'){
    const e={id:uid('meal'),type:'meal',date,dateTime:dt(date,fd.get('time')),mealType:String(fd.get('mealType')||inferMealType(fd.get('time'))),description:String(fd.get('description')||'').trim(),tags:selected('tag'),fiberFoods:{prunes:String(fd.get('prunes')||'').trim(),kiwi:String(fd.get('kiwi')||'').trim(),pear:String(fd.get('pear')||'').trim()}};
    const photo=fd.get('photo');if(photo instanceof File&&photo.size)e.photo=photo;const drinkType=String(fd.get('drinkType')||''),est=String(fd.get('liquidEstimate')||'');if(drinkType)e.drinkType=drinkType;if(est){e.liquidEstimate=est;const custom=Number(fd.get('mealCustomOz'))||0;if(est==='custom'&&custom>0)e.liquidOz=custom;else if(KNOWN_OZ[est])e.liquidOz=KNOWN_OZ[est];}await putEntry(e);return{message:'Meal saved'};
  }
  if(kind==='drink'){
    const est=String(fd.get('estimate')||''),custom=Number(fd.get('customOz'))||0;const e={id:uid('drink'),type:'drink',date,dateTime:dt(date,fd.get('time')),drinkType:String(fd.get('drinkType')||'other')};if(est)e.estimate=est;if(est==='custom'&&custom>0)e.estimatedOz=custom;else if(KNOWN_OZ[est])e.estimatedOz=KNOWN_OZ[est];const note=String(fd.get('drinkNote')||'').trim();if(note)e.note=note;const photo=fd.get('drinkPhoto');if(photo instanceof File&&photo.size)e.photo=photo;await putEntry(e);return{message:'Drink added'};
  }
  if(kind==='poop'){
    const e={id:uid('poop'),type:'poop',date,dateTime:dt(date,fd.get('time')),bristol:bristolFromSheet(),details:selected('detail'),note:String(fd.get('note')||'').trim()};const amount=String(fd.get('amount')||''),pain=missingNumber(fd.get('pain')),blood=String(fd.get('blood')||'');if(amount)e.amount=amount;if(pain!==undefined)e.pain=pain;if(blood)e.blood=blood;await putEntry(e);return{message:'Poop saved',safety:blood==='yes'||pain>=8};
  }
  if(kind==='symptom'){
    const e={id:uid('symptom'),type:'symptom',date,dateTime:dt(date,fd.get('time')),when:String(fd.get('when')||'custom'),note:String(fd.get('note')||'').trim()};const b=missingNumber(fd.get('bloating')),p=missingNumber(fd.get('pain')),gas=String(fd.get('gas')||''),hard=String(fd.get('hardSwollen')||'');if(b!==undefined)e.bloating=b;if(p!==undefined)e.pain=p;if(gas)e.gas=gas;if(hard)e.hardSwollen=hard;await putEntry(e);return{message:'Symptoms saved',safety:hard==='yes'||p>=8};
  }
}

document.addEventListener('submit',async event=>{
  const form=event.target.closest('form[data-form]');if(!form||!['meal','drink','poop','symptom'].includes(form.dataset.form))return;
  event.preventDefault();event.stopImmediatePropagation();try{const result=await saveFast(form);closeSheet();refresh();toast(result.message);if(result.safety)setTimeout(()=>{document.querySelector('[data-tab="more"]')?.click();setTimeout(()=>document.querySelector('[data-action="safety"]')?.click(),80);},180);}catch(error){console.error(error);toast('Your entry wasn’t saved. Please try again.');}
},true);

function opts(values,selected,blank='Not recorded'){return `<option value="">${blank}</option>${values.map(v=>`<option value="${esc(v)}" ${String(v)===String(selected??'')?'selected':''}>${esc(v)}</option>`).join('')}`;}
function scores(selected){return `<option value="">Not checked</option>${Array.from({length:11},(_,i)=>`<option value="${i}" ${String(i)===String(selected??'')?'selected':''}>${i}</option>`).join('')}`;}
function field(label,control){return `<div class="field"><label>${label}</label>${control}</div>`;}
async function showEditor(id){
  const e=(await getAllEntries()).find(x=>x.id===id);if(!e)return;let body=field('Time',`<input class="input" type="time" name="time" value="${esc(timeOf(e))}">`);
  if(e.type==='meal'){body+=field('Meal',`<select name="mealType">${opts(['breakfast','lunch','snack','dinner','other'],e.mealType,'Choose')}</select>`)+field('What did you have?',`<textarea name="description">${esc(e.description||'')}</textarea>`);}
  else if(e.type==='drink'){body+=field('Drink',`<select name="drinkType">${opts(['water','milk','juice','tea','soup','other'],e.drinkType,'Choose')}</select>`)+field('Amount',`<select name="estimate">${opts(Object.keys(LIQUID_LABELS),e.estimate)}</select>`)+field('Custom ounces',`<input class="input" type="number" min="0" step=".5" name="customOz" value="${esc(e.estimatedOz||'')}">`)+field('Note',`<input class="input" name="note" value="${esc(e.note||'')}">`);}
  else if(e.type==='poop'){body+=field('Bristol type',`<select name="bristol">${opts(['1','2','3','4','5','6','7'],e.bristol,'Not sure')}</select>`)+field('Amount',`<select name="amount">${opts(['tiny','small','medium','large'],e.amount)}</select>`)+field('Pain',`<select name="pain">${scores(e.pain)}</select>`)+field('Blood?',`<select name="blood">${opts(['no','yes','not sure'],e.blood)}</select>`)+field('Note',`<textarea name="note">${esc(e.note||'')}</textarea>`);}
  else if(e.type==='symptom'){body+=field('Bloating',`<select name="bloating">${scores(e.bloating)}</select>`)+field('Pain',`<select name="pain">${scores(e.pain)}</select>`)+field('Gas',`<select name="gas">${opts(['none','mild','a lot'],e.gas)}</select>`)+field('Hard / swollen?',`<select name="hardSwollen">${opts(['no','yes','not sure'],e.hardSwollen)}</select>`)+field('Note',`<textarea name="note">${esc(e.note||'')}</textarea>`);}
  else{body+=field('Note',`<textarea name="note">${esc(e.note||'')}</textarea>`);}
  sheetRoot.innerHTML=`<div class="sheet-backdrop"><section class="sheet" role="dialog" aria-modal="true"><div class="grabber"></div><div class="sheet-head"><div><h2 class="sheet-title">Edit ${esc(e.type)}</h2><p class="sheet-subtitle">Correct only what needs changing.</p></div><button class="icon-btn" data-qa-close aria-label="Close">×</button></div><form id="qa-edit-form" class="form" data-id="${esc(e.id)}" data-type="${esc(e.type)}">${body}<div class="sticky-actions"><button class="primary" type="submit">Save changes</button></div></form></section></div>`;
}
async function saveEditor(form){
  const all=await getAllEntries(),e=all.find(x=>x.id===form.dataset.id);if(!e)throw new Error('Entry not found');const fd=new FormData(form),next={...e};next.dateTime=dt(e.date,String(fd.get('time')||timeOf(e)));
  const str=n=>{const v=String(fd.get(n)||'');if(v)next[n]=v;else delete next[n];},num=n=>{const v=missingNumber(fd.get(n));if(v===undefined)delete next[n];else next[n]=v;};
  if(e.type==='meal'){next.mealType=String(fd.get('mealType')||'other');next.description=String(fd.get('description')||'').trim();}
  else if(e.type==='drink'){next.drinkType=String(fd.get('drinkType')||'other');str('estimate');const custom=Number(fd.get('customOz'))||0;if(next.estimate==='custom'&&custom>0)next.estimatedOz=custom;else if(KNOWN_OZ[next.estimate])next.estimatedOz=KNOWN_OZ[next.estimate];else delete next.estimatedOz;next.note=String(fd.get('note')||'').trim();}
  else if(e.type==='poop'){num('bristol');str('amount');num('pain');str('blood');next.note=String(fd.get('note')||'').trim();}
  else if(e.type==='symptom'){num('bloating');num('pain');str('gas');str('hardSwollen');next.note=String(fd.get('note')||'').trim();}
  else next.note=String(fd.get('note')||'').trim();await putEntry(next);
}
function enhanceEntryMenu(){const title=sheetRoot.querySelector('.sheet-title');if(title?.textContent.trim()!=='Entry options'||sheetRoot.querySelector('[data-qa-edit-id]'))return;const del=sheetRoot.querySelector('[data-sheet-action="delete-entry"][data-id]');if(!del)return;const b=document.createElement('button');b.className='menu-row';b.dataset.qaEditId=del.dataset.id;b.innerHTML='<div><strong>Edit entry</strong><small>Correct time or details without deleting it</small></div><span>›</span>';del.before(b);}
document.addEventListener('click',async event=>{const e=event.target.closest('[data-qa-edit-id]');if(e){event.preventDefault();event.stopImmediatePropagation();await showEditor(e.dataset.qaEditId);}if(event.target.closest('[data-qa-close]')){event.preventDefault();closeSheet();}},true);
document.addEventListener('submit',async event=>{const form=event.target.closest('#qa-edit-form');if(!form)return;event.preventDefault();try{await saveEditor(form);closeSheet();refresh();toast('Entry updated');}catch(error){console.error(error);toast('Changes weren’t saved. Please try again.');}},true);

async function sourceSummary(){
  const prefs=await getSetting('preferences',{}),start=prefs.startDate||localDate(),dates=Array.from({length:7},(_,i)=>addDays(start,i)),end=dates[6],all=await getAllEntries(),entries=all.filter(e=>dates.includes(e.date)),poops=entries.filter(e=>e.type==='poop'),symptoms=entries.filter(e=>e.type==='symptom'),meals=entries.filter(e=>e.type==='meal'),drinks=entries.filter(e=>e.type==='drink'),checkins=entries.filter(e=>e.type==='checkin'),wraps=entries.filter(e=>e.type==='wrap'),elapsed=dates.filter(d=>d<=localDate()),poopDays=new Set(poops.map(e=>e.date)),confirmed=new Set(wraps.filter(w=>w.poopSummary==='none'&&!poopDays.has(w.date)).map(w=>w.date)),unconfirmed=elapsed.filter(d=>!poopDays.has(d)&&!confirmed.has(d));
  const type1=new Set(poops.filter(p=>Number(p.bristol)===1).map(p=>p.date)),dark=new Set(checkins.filter(c=>c.urineColor==='dark').map(c=>c.date)),fiber=new Set(meals.filter(m=>(m.tags||[]).some(t=>['fruit','vegetables','oats','beans'].includes(t))||Object.values(m.fiberFoods||{}).some(Boolean)).map(m=>m.date)),dairy=new Set(meals.filter(m=>(m.tags||[]).includes('dairyCheeseHeavy')).map(m=>m.date)),white=new Set(meals.filter(m=>(m.tags||[]).includes('whiteCarbHeavy')).map(m=>m.date)),prune=new Set(meals.filter(m=>m.fiberFoods?.prunes).map(m=>m.date));
  const repeated=new Map();meals.forEach(m=>{const k=(m.description||'').trim().toLowerCase();if(k)repeated.set(k,(repeated.get(k)||0)+1);});const repeatedMeals=[...repeated.entries()].filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const allCheckins=all.filter(e=>e.type==='checkin'),lastPeriod=allCheckins.filter(e=>e.periodStartedToday==='yes').sort((a,b)=>(b.dateTime||b.date||'').localeCompare(a.dateTime||a.date||''))[0]?.date,lastCheck=checkins.slice().sort((a,b)=>(b.dateTime||'').localeCompare(a.dateTime||''))[0],bloodValues=poops.map(p=>p.blood).filter(Boolean),fewSips=[...drinks,...meals].filter(e=>e.estimate==='fewSips'||e.liquidEstimate==='fewSips').length,knownOz=[...drinks,...meals].reduce((s,e)=>s+(Number(e.estimatedOz)||Number(e.liquidOz)||0),0);
  return{start,end,dates,entries,poops,symptoms,meals,checkins,wraps,totalPoops:poops.length,confirmedNoPoopDays:confirmed.size,unconfirmedDays:unconfirmed.length,type1Days:type1.size,stoolCounts:Array.from({length:7},(_,i)=>poops.filter(p=>Number(p.bristol)===i+1).length),highestPoopPain:max(poops.map(p=>p.pain)),blood:bloodValues.includes('yes')?'yes':(poops.length&&bloodValues.length===poops.length?'no':'not fully recorded'),highestBellyPain:max(symptoms.map(s=>s.pain)),avgBloat:avg(symptoms.map(s=>s.bloating)),worstBloat:max(symptoms.map(s=>s.bloating)),darkUrineDays:dark.size,fiberDays:fiber.size,dairyDays:dairy.size,whiteCarbDays:white.size,pruneDays:prune.size,lastPeriod,daysLate:lastCheck?.daysLate||'',maxCramps:max(checkins.map(c=>c.crampsPain)),heldPoopDays:new Set(checkins.filter(c=>c.heldPoop==='yes').map(c=>c.date)).size,satAfterMealDays:new Set(checkins.filter(c=>c.satAfterMeal==='yes').map(c=>c.date)).size,repeatedMeals,fewSips,knownOz,weekly:await getWeekly(start)};
}
function updateRow(container,label,value,newLabel){for(const row of container.querySelectorAll('.summary-row')){const s=row.querySelector('span');if(s?.textContent.trim()===label){if(newLabel)setText(s,newLabel);setText(row.querySelector('strong'),value);}}}
function summarySignature(s){return JSON.stringify([s.start,s.totalPoops,s.confirmedNoPoopDays,s.unconfirmedDays,s.type1Days,s.worstBloat,s.avgBloat,s.darkUrineDays,s.fiberDays,s.knownOz,s.fewSips,s.repeatedMeals]);}
function updateToday(s){if(app.querySelector('.hero h1')?.textContent.trim()!=='Today')return;const item=[...app.querySelectorAll('.glance-item')].find(x=>x.querySelector('.glance-label')?.textContent.trim()==='Drinks');if(!item)return;let v=s.knownOz?`${Math.round(s.knownOz)} oz`:'—';if(s.fewSips)v=s.knownOz?`${Math.round(s.knownOz)} oz + sips`:`${s.fewSips} “few sips”`;setText(item.querySelector('.glance-value'),v);setText(item.querySelector('.glance-meta'),s.fewSips?'known amounts + qualitative sips':'estimated');}
function updateInsights(s){if(app.querySelector('.hero h1')?.textContent.trim()!=='Insights')return;setText(app.querySelector('.hero .subtle'),`${fmt(s.start)} – ${fmt(s.end)} · tracking period`);for(const m of app.querySelectorAll('.metric')){const l=m.querySelector('.metric-label')?.textContent.trim();if(l==='Bowel movements'){setText(m.querySelector('.metric-value'),s.totalPoops);setText(m.querySelector('.metric-foot'),`${s.confirmedNoPoopDays} confirmed no-poop · ${s.unconfirmedDays} unconfirmed`);}if(l==='Worst bloating'){m.querySelector('.metric-value').innerHTML=s.worstBloat===null?'—':`${s.worstBloat}<small>/10</small>`;setText(m.querySelector('.metric-foot'),`Average ${s.avgBloat===null?'—':s.avgBloat.toFixed(1)}`);}if(l==='Fiber-food days')m.querySelector('.metric-value').innerHTML=`${s.fiberDays}<small>/7</small>`;if(l==='Dark urine days')setText(m.querySelector('.metric-value'),s.darkUrineDays);}app.querySelector('#week-progress-note')?.remove();if(!app.querySelector('#qa-tracking-note')){const n=document.createElement('div');n.id='qa-tracking-note';n.className='note';n.style.marginTop='8px';n.style.background='var(--surface-2)';n.textContent=`Uses the journal start date (${fmt(s.start)}), not Monday–Sunday. Missing entries are not treated as “no poop.”`;app.querySelector('.note.info')?.after(n);}}
function updateReport(s){const r=sheetRoot.querySelector('#doctor-report');if(!r)return;const small=r.querySelector('small');if(small)setText(small,`${fmt(s.start)} – ${fmt(s.end)} · tracking period · Generated ${new Date().toLocaleDateString()}`);updateRow(r,'Total poops',s.totalPoops);updateRow(r,'Days with no logged poop',s.confirmedNoPoopDays,'Confirmed days with no poop');updateRow(r,'Days with pebbly Type 1',s.type1Days);updateRow(r,'Highest poop pain',s.highestPoopPain===null?'—':`${s.highestPoopPain}/10`);updateRow(r,'Blood recorded',s.blood);updateRow(r,'Highest belly / pelvic pain',s.highestBellyPain===null?'—':`${s.highestBellyPain}/10`);updateRow(r,'Average logged bloating',s.avgBloat===null?'—':`${s.avgBloat.toFixed(1)}/10`);updateRow(r,'Worst logged bloating',s.worstBloat===null?'—':`${s.worstBloat}/10`);updateRow(r,'Dark urine days',s.darkUrineDays);updateRow(r,'Fiber-food days',`${s.fiberDays}/7`);updateRow(r,'Dairy/cheese-heavy days',`${s.dairyDays}/7`);updateRow(r,'White-carb-heavy days',`${s.whiteCarbDays}/7`);updateRow(r,'Prune days',`${s.pruneDays}/7`);updateRow(r,'Last logged period start',s.lastPeriod?fmt(s.lastPeriod):'—');updateRow(r,'Days late by latest check-in',s.daysLate||'—');updateRow(r,'Highest cramps/pelvic pain',s.maxCramps===null?'—':`${s.maxCramps}/10`);updateRow(r,'Held poop / avoided public bathroom',`${s.heldPoopDays} logged day(s)`);updateRow(r,'Sat after meal 5–10 min',`${s.satAfterMealDays} logged day(s)`);let n=r.querySelector('#qa-unknown-days');if(!n){n=document.createElement('div');n.id='qa-unknown-days';n.className='note';n.style.marginTop='10px';n.style.background='var(--surface-2)';r.querySelector('.note.info')?.after(n);}setText(n,`${s.unconfirmedDays} elapsed day${s.unconfirmedDays===1?' is':'s are'} unconfirmed: no poop entry and no explicit “none” evening summary.`);}
async function updateWeekly(s){if(sheetRoot.querySelector('.sheet-title')?.textContent.trim()!=='Weekly pattern review')return;setText(sheetRoot.querySelector('.sheet-subtitle'),`${fmt(s.start)} – ${fmt(s.end)}`);const form=sheetRoot.querySelector('form[data-form="weekly"]');if(form?.elements.weekStart)form.elements.weekStart.value=s.start;updateRow(sheetRoot,'Total poops',s.totalPoops);updateRow(sheetRoot,'Days with no logged poop',s.confirmedNoPoopDays,'Confirmed days with no poop');updateRow(sheetRoot,'Days with Type 1',s.type1Days);updateRow(sheetRoot,'Worst bloating',s.worstBloat===null?'—':`${s.worstBloat}/10`);if(form&&s.weekly&&!form.dataset.qaPrefilled){form.dataset.qaPrefilled='1';for(const[k,v]of Object.entries(s.weekly)){if(k!=='weekStart'&&form.elements[k])form.elements[k].value=v;}}}
async function enhanceSummary(){const s=await sourceSummary(),sig=summarySignature(s),hero=app.querySelector('.hero'),sheet=sheetRoot.querySelector('.sheet'),sheetTitle=sheetRoot.querySelector('.sheet-title')?.textContent.trim()||'';if(hero&&hero.dataset.qaSummary!==sig){updateToday(s);updateInsights(s);hero.dataset.qaSummary=sig;}const sheetSig=`${sheetTitle}|${sig}`;if(sheet&&sheet.dataset.qaSummary!==sheetSig){updateReport(s);await updateWeekly(s);sheet.dataset.qaSummary=sheetSig;}}

async function enhance(){if(busy)return;busy=true;try{enhanceForms();enhanceEntryMenu();await enhanceSummary();}finally{busy=false;}}
const observer=new MutationObserver(()=>queueMicrotask(enhance));observer.observe(document.body,{childList:true,subtree:true});enhance();
