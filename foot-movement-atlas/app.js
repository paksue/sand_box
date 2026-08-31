(function(){
  const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const ex = window.EXERCISES || [];
  const byId = id => ex.find(x=>x.id===id);
  const favKey='foot-rehab-atlas-favorites';
  const getFavs=()=>new Set(JSON.parse(localStorage.getItem(favKey)||'[]'));
  const saveFavs=s=>localStorage.setItem(favKey,JSON.stringify([...s]));
  function badge(status){return `<span class="badge ${status.toLowerCase()}">${status}</span>`}
  function renderRoutine(elId, ids){const el=$(elId); if(!el)return; el.innerHTML=ids.map((id,i)=>{const x=byId(id);return x?`<div class="routine-item"><span>${i+1}</span><div><strong>${x.name}</strong><br><small>${x.dose}</small></div></div>`:''}).join('')}
  renderRoutine('#morningList',window.ROUTINES?.morning||[]);renderRoutine('#morseList',window.ROUTINES?.morse||[]);renderRoutine('#microbreakList',window.ROUTINES?.microbreak||[]);renderRoutine('#footList',window.ROUTINES?.footFoundation||[]);

  const grid=$('#exerciseGrid');
  if(grid){
    const search=$('#search'), region=$('#region'), phase=$('#phase'), status=$('#status'), stats=$('#libraryStats'), favBar=$('#favBar'), favCount=$('#favCount');
    const values=(k)=>[...new Set(ex.map(x=>x[k]))].sort();
    values('region').forEach(v=>region.insertAdjacentHTML('beforeend',`<option>${v}</option>`));
    values('phase').forEach(v=>phase.insertAdjacentHTML('beforeend',`<option>${v}</option>`));
    ['Green','Yellow','Red'].forEach(v=>status.insertAdjacentHTML('beforeend',`<option>${v}</option>`));
    let routineOnly=false;
    const card=x=>`<article class="exercise-card" data-id="${x.id}"><div class="exercise-top"><div><div class="badges">${badge(x.status)}<span class="badge">${x.region}</span><span class="badge">${x.phase}</span></div><h3>${x.name}</h3></div><button class="bookmark" aria-label="Add ${x.name} to my routine">☆</button></div><p>${x.why}</p><div class="meta"><div class="meta-row"><b>Dose</b><span>${x.dose}</span></div><div class="meta-row"><b>Source</b><span>${x.source}</span></div><div class="meta-row"><b>Caution</b><span>${x.caution}</span></div></div></article>`;
    function render(){
      const favs=getFavs(); const q=search.value.trim().toLowerCase();
      const filtered=ex.filter(x=>(!q||[x.name,x.region,x.category,x.source,x.why].join(' ').toLowerCase().includes(q))&&(!region.value||x.region===region.value)&&(!phase.value||x.phase===phase.value)&&(!status.value||x.status===status.value)&&(!routineOnly||favs.has(x.id)));
      grid.innerHTML=filtered.map(card).join('');
      $$('.exercise-card',grid).forEach(c=>{const b=$('.bookmark',c); const id=c.dataset.id;if(favs.has(id)){b.classList.add('on');b.textContent='★'} b.onclick=()=>{const s=getFavs();s.has(id)?s.delete(id):s.add(id);saveFavs(s);render();};});
      stats.innerHTML=`<span class="stat-pill"><strong>${filtered.length}</strong> shown</span><span class="stat-pill"><strong>${ex.length}</strong> total</span><span class="stat-pill"><strong>${getFavs().size}</strong> in My Routine</span>`;
      favCount.textContent=getFavs().size; favBar.hidden=getFavs().size===0;
    }
    [search,region,phase,status].forEach(c=>c.addEventListener(c===search?'input':'change',render));
    $('#showFavs').onclick=()=>{routineOnly=!routineOnly;$('#showFavs').textContent=routineOnly?'Show all':'Show My Routine';render();};
    $('#clearFilters').onclick=()=>{search.value='';region.value='';phase.value='';status.value='';routineOnly=false;render();};
    render();
  }
  const printBtn=$('#printBtn'); if(printBtn) printBtn.onclick=()=>window.print();
})();
