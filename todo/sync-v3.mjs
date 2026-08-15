import {
  clone,
  normalizeTask,
  planV3Migration,
  classifySyncState,
  shouldAutoAdoptRemote,
  threeWay,
  pullResult
} from './sync-core.mjs';

(() => {
  'use strict';

  const STORAGE_KEY = 'paksue-today-tasks-v1';
  const TOKEN_KEY = 'paksue-github-token-v1';
  const V2_KEY = 'paksue-github-source-state-v2';
  const V3_KEY = 'paksue-github-source-state-v3';
  const REPO_OWNER = 'paksue';
  const REPO_NAME = 'sand_box';
  const REPO_BRANCH = 'main';
  const REMOTE_PATH = 'todo/tasks.json';
  const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REMOTE_PATH}`;

  const nowStamp = () => new Date().toISOString();
  let state = loadV3State();
  let remoteChanged = false;
  let busy = false;
  let lastCheckAt = 0;
  let localSnapshot = loadTasks();
  let syncBarVisible = true;
  let captureTimer = null;

  const oldPull = document.getElementById('pullButton');
  const oldPush = document.getElementById('pushButton');
  if (!oldPull || !oldPush) return;

  const pullButton = oldPull.cloneNode(true);
  const pushButton = oldPush.cloneNode(true);
  oldPull.replaceWith(pullButton);
  oldPush.replaceWith(pushButton);

  const statusRow = document.getElementById('syncStatus');
  const message = document.getElementById('syncMessage');
  const detail = document.getElementById('syncTime');
  const syncSummary = statusRow?.closest('.sync-summary');
  const syncBar = statusRow?.closest('.sync-bar');
  const list = document.getElementById('taskList');

  if (syncSummary && !syncSummary.querySelector('.source-truth-label')) {
    const label = document.createElement('div');
    label.className = 'source-truth-label';
    label.textContent = '☁ GitHub · source of truth';
    syncSummary.insertBefore(label, statusRow);
  }

  const tip = document.querySelector('.tip');
  if (tip) tip.textContent = 'GitHub is the source of truth. Only changes actually made on this device are marked unsaved.';

  const floating = document.createElement('button');
  floating.type = 'button';
  floating.className = 'sync-float';
  floating.hidden = true;
  floating.setAttribute('aria-label', 'Synchronization status');
  document.body.append(floating);

  const style = document.createElement('style');
  style.textContent = `
    .source-truth-label{margin:0 0 4px 16px;color:var(--muted);font-size:11px;font-weight:800;letter-spacing:.035em;text-transform:uppercase}
    #syncStatus[data-type="dirty"] .sync-dot,#syncStatus[data-type="remote"] .sync-dot{background:var(--warning)}
    #syncStatus[data-type="both"] .sync-dot{background:var(--danger)}
    #pushButton.needs-save{box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 24%,transparent)}
    .sync-float{position:fixed;z-index:1000;top:max(12px,env(safe-area-inset-top));right:14px;min-width:auto;min-height:46px;padding:0 16px;border:1px solid var(--line);border-radius:999px;background:color-mix(in srgb,var(--card) 92%,transparent);color:var(--text);box-shadow:0 10px 30px rgba(0,0,0,.16);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);font-size:14px;font-weight:850;white-space:nowrap;transition:opacity .18s ease,transform .18s ease;transform-origin:top right}
    .sync-float[data-state="dirty"]{background:color-mix(in srgb,var(--accent-soft) 88%,var(--card));color:var(--text)}
    .sync-float[data-state="diverged"]{box-shadow:0 0 0 2px color-mix(in srgb,var(--danger) 45%,transparent),0 10px 30px rgba(0,0,0,.16)}
    .sync-float[data-state="synced"]{width:48px;padding:0;border-radius:999px;color:var(--accent)}
    .sync-float[hidden]{display:none}
    .sync-conflict-dialog{width:min(calc(100% - 28px),560px);max-height:80svh;border:1px solid var(--line);border-radius:22px;padding:0;background:var(--card);color:var(--text);box-shadow:0 24px 70px rgba(0,0,0,.35)}
    .sync-conflict-dialog::backdrop{background:rgba(0,0,0,.48);backdrop-filter:blur(3px)}
    .sync-conflict-box{padding:20px}.sync-conflict-box h2{margin:0 0 6px;font-size:21px}.sync-conflict-box p{line-height:1.45}
    .sync-conflict-lead{margin:0 0 16px;color:var(--muted);font-size:14px}.sync-conflict-field{margin:0 0 10px;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
    .sync-conflict-choice{width:100%;min-height:auto;margin:0 0 10px;padding:13px 14px;border:1px solid var(--line);border-radius:14px;background:transparent;color:var(--text);text-align:left;white-space:normal}
    .sync-conflict-choice strong{display:block;margin-bottom:5px;color:var(--accent);font-size:12px;text-transform:uppercase}.sync-conflict-value{display:block;overflow-wrap:anywhere;white-space:pre-wrap;font-size:15px;line-height:1.4}
    .sync-conflict-counter{margin:13px 0 0;color:var(--muted);font-size:12px;text-align:center}
    @media(max-width:520px){.sync-float{top:max(10px,env(safe-area-inset-top));right:10px}}
  `;
  document.head.append(style);

  function loadTasks() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(parsed) ? parsed.map((task, index) => normalizeTask(task, index, nowStamp())) : [];
    } catch { return []; }
  }

  function loadJson(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }

  function loadV3State() {
    const parsed = loadJson(V3_KEY);
    if (!parsed || typeof parsed !== 'object') return { ready:false, baseSha:'', baseTasks:[], lastSyncedAt:'', pending:{} };
    const pending = parsed.pending && typeof parsed.pending === 'object' && !Array.isArray(parsed.pending) ? parsed.pending : {};
    return {
      ready:Boolean(parsed.ready),
      baseSha:String(parsed.baseSha || ''),
      baseTasks:Array.isArray(parsed.baseTasks) ? parsed.baseTasks.map((task,index)=>normalizeTask(task,index)) : [],
      lastSyncedAt:String(parsed.lastSyncedAt || ''),
      pending
    };
  }

  function saveState() { localStorage.setItem(V3_KEY, JSON.stringify(state)); }
  function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
  function pendingCount() { return Object.keys(state.pending || {}).length; }

  function setStatus(text, type, subtext) {
    if (statusRow) statusRow.dataset.type = type;
    if (message) message.textContent = text;
    if (detail) detail.textContent = subtext;
  }

  function updateFloating(syncState) {
    const count = pendingCount();
    floating.dataset.state = syncState;
    if (syncState === 'local_dirty') floating.textContent = `● ${count} ${count === 1 ? 'change' : 'changes'}  ↑ Save`;
    else if (syncState === 'diverged') floating.textContent = `⚠ ${count} local + GitHub`;
    else if (syncState === 'remote_ahead') floating.textContent = '↓ GitHub changed';
    else if (syncState === 'synced') floating.textContent = '☁ ✓';
    else if (syncState === 'offline') floating.textContent = count ? `○ ${count} offline` : '○ Offline';
    else floating.textContent = count ? `● ${count} local` : '☁';
    floating.hidden = syncBarVisible;
  }

  function updateUi() {
    if (busy) return;
    const count = pendingCount();
    const syncState = classifySyncState({ready:state.ready,token:getToken(),pendingCount:count,remoteChanged,online:navigator.onLine});
    pullButton.disabled = false;
    pushButton.classList.toggle('needs-save', count > 0);
    pushButton.textContent = count > 0 ? `Save ${count} ↑` : 'Saved ✓';
    pushButton.disabled = !getToken() || !state.ready || count === 0;

    if (syncState === 'local_only_dirty') setStatus(`${count} local ${count===1?'change':'changes'}`,'dirty','Add a GitHub token to publish to the source of truth.');
    else if (syncState === 'local_only') setStatus('Local working copy','idle','Add a GitHub token to synchronize.');
    else if (syncState === 'initializing') setStatus('Checking GitHub…','working','Establishing the source-of-truth baseline.');
    else if (syncState === 'diverged') setStatus('This device and GitHub both changed','both',`${count} real local ${count===1?'change':'changes'} · Save will reconcile.`);
    else if (syncState === 'local_dirty') setStatus(`${count} unsaved ${count===1?'change':'changes'}`,'dirty','These changes were made on this device and are not yet on GitHub.');
    else if (syncState === 'remote_ahead') setStatus('GitHub has newer changes','remote','No local work to protect · updating this device automatically.');
    else if (syncState === 'offline') setStatus(count?`${count} unsaved ${count===1?'change':'changes'}`:'Working locally','both','GitHub is unavailable; local work is preserved.');
    else {
      const when = state.lastSyncedAt ? new Date(state.lastSyncedAt).toLocaleString() : 'just now';
      setStatus('Synced with GitHub','success',`Working copy matches source of truth · ${when}`);
    }
    updateFloating(syncState);
  }

  function setBusy(text, subtext) {
    busy = true;
    pullButton.disabled = true;
    pushButton.disabled = true;
    floating.disabled = true;
    setStatus(text,'working',subtext);
  }

  function headers() {
    const result = {Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
    const token = getToken();
    if (token) result.Authorization = `Bearer ${token}`;
    return result;
  }

  function decodeBase64Utf8(value) {
    const binary = atob(String(value || '').replace(/\s/g,''));
    return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
  }

  function encodeBase64Utf8(value) {
    const bytes = new TextEncoder().encode(value); let binary='';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }

  async function apiError(response) {
    try { const body = await response.json(); return body.message || `GitHub returned ${response.status}`; }
    catch { return `GitHub returned ${response.status}`; }
  }

  async function fetchRemote() {
    const response = await fetch(`${API_URL}?ref=${encodeURIComponent(REPO_BRANCH)}&_=${Date.now()}`,{headers:headers(),cache:'no-store'});
    if (!response.ok) throw new Error(await apiError(response));
    const payload = await response.json();
    const parsed = JSON.parse(decodeBase64Utf8(payload.content));
    return {sha:payload.sha||'',tasks:Array.isArray(parsed.tasks)?parsed.tasks.map((task,index)=>normalizeTask(task,index,nowStamp())):[]};
  }

  async function putRemote(tasks, sha) {
    const documentValue={version:3,updatedAt:nowStamp(),tasks};
    const response=await fetch(API_URL,{method:'PUT',headers:{...headers(),'Content-Type':'application/json'},body:JSON.stringify({message:`Sync todo list ${new Date().toLocaleString()}`,content:encodeBase64Utf8(`${JSON.stringify(documentValue,null,2)}\n`),branch:REPO_BRANCH,sha})});
    if(!response.ok){const error=new Error(await apiError(response));error.status=response.status;throw error;}
    const payload=await response.json();
    return {sha:payload?.content?.sha||'',updatedAt:documentValue.updatedAt};
  }

  function establish(remote) {
    state={ready:true,baseSha:remote.sha,baseTasks:clone(remote.tasks),lastSyncedAt:nowStamp(),pending:{}};
    saveState(); remoteChanged=false;
  }

  function writeRemoteToLocal(remote) {
    localStorage.setItem(STORAGE_KEY,JSON.stringify(pullResult(remote.tasks)));
    localSnapshot=pullResult(remote.tasks);
    establish(remote);
  }

  function operationAt(key,type,taskId=null) {
    state.pending[key]={key,type,taskId,at:nowStamp()};
  }

  function baseMap() { return new Map((state.baseTasks||[]).map((task,index)=>{const n=normalizeTask(task,index);return[n.id,n];})); }
  function localMap(tasks) { return new Map((tasks||[]).map((task,index)=>{const n=normalizeTask(task,index);return[n.id,n];})); }

  function prunePending(currentTasks) {
    if (!state.ready) return;
    const base=baseMap(), current=localMap(currentTasks);
    for (const [key,op] of Object.entries(state.pending||{})) {
      if (op.type==='reorder') {
        const ids=new Set([...base.keys(),...current.keys()]);
        const changed=[...ids].some(id=>base.get(id)&&current.get(id)&&Number(base.get(id).order)!==Number(current.get(id).order));
        if(!changed) delete state.pending[key];
        continue;
      }
      if (op.type==='clear_completed') {
        const changed=[...base.keys()].some(id=>base.get(id)?.deleted!==current.get(id)?.deleted);
        if(!changed) delete state.pending[key];
        continue;
      }
      const b=base.get(op.taskId)||null, c=current.get(op.taskId)||null;
      if (op.type==='add') { if (!c || c.deleted || b) delete state.pending[key]; continue; }
      if (!b || !c) continue;
      if (op.type==='edit' && b.title===c.title && b.details===c.details) delete state.pending[key];
      if (op.type==='done' && Boolean(b.done)===Boolean(c.done)) delete state.pending[key];
      if (op.type==='delete' && Boolean(b.deleted)===Boolean(c.deleted)) delete state.pending[key];
    }
  }

  function recordDiff(previous,current,hint='') {
    if (!state.ready) { localSnapshot=current; return; }
    const before=localMap(previous), after=localMap(current), base=baseMap();
    const ids=new Set([...before.keys(),...after.keys()]);
    let sawOrder=false, sawDelete=false;
    for(const id of ids){
      const p=before.get(id)||null,c=after.get(id)||null,b=base.get(id)||null;
      if(!p&&c){operationAt(`add:${id}`,'add',id);continue;}
      if(!p||!c)continue;
      if(p.title!==c.title||p.details!==c.details){if(!state.pending[`add:${id}`])operationAt(`edit:${id}`,'edit',id);}
      if(Boolean(p.done)!==Boolean(c.done))operationAt(`done:${id}`,'done',id);
      if(Boolean(p.deleted)!==Boolean(c.deleted)){sawDelete=true;if(hint!=='clear_completed'&&!state.pending[`add:${id}`])operationAt(`delete:${id}`,'delete',id);}
      if(Number(p.order)!==Number(c.order))sawOrder=true;
      if(!b&&c?.deleted){delete state.pending[`add:${id}`];delete state.pending[`delete:${id}`];}
    }
    if(sawOrder)operationAt('reorder','reorder');
    if(sawDelete&&hint==='clear_completed')operationAt('clear-completed','clear_completed');
    prunePending(current); saveState(); localSnapshot=current; updateUi();
  }

  function captureAfterEvent(hint='') {
    clearTimeout(captureTimer);
    captureTimer=setTimeout(()=>recordDiff(localSnapshot,loadTasks(),hint),0);
  }

  async function migrateIfNeeded(remote) {
    if (state.ready) return false;
    const v2=loadJson(V2_KEY);
    const local=loadTasks();
    const plan=planV3Migration({v2State:v2,localTasks:local,remote});
    if(plan.action==='adopt_remote'){
      writeRemoteToLocal(remote);
      sessionStorage.setItem('todo-v3-migration-note','Updated this browser from GitHub; no post-baseline local edits were found.');
      location.reload();
      return true;
    }
    state={ready:true,baseSha:plan.baseSha,baseTasks:clone(plan.baseTasks),lastSyncedAt:String(v2?.lastSyncedAt||''),pending:Object.fromEntries(plan.pending.map(op=>[op.key,op]))};
    saveState(); remoteChanged=plan.remoteChanged; localSnapshot=local; updateUi();
    return false;
  }

  async function checkRemote(force=false) {
    if(busy||!getToken()){updateUi();return;}
    const now=Date.now();if(!force&&now-lastCheckAt<10000)return;lastCheckAt=now;
    try{
      const remote=await fetchRemote();
      if(await migrateIfNeeded(remote))return;
      remoteChanged=remote.sha!==state.baseSha;
      if(shouldAutoAdoptRemote({ready:state.ready,pendingCount:pendingCount(),remoteChanged})){
        setBusy('Updating from GitHub…','No local changes to protect; refreshing the stale working copy.');
        writeRemoteToLocal(remote);
        sessionStorage.setItem('todo-v3-migration-note','Updated from GitHub because this browser had no unsaved local changes.');
        location.reload();
        return;
      }
      updateUi();
    }catch(error){setStatus(pendingCount()?`${pendingCount()} unsaved changes`:'Working locally','both',`GitHub check failed · ${error.message}`);updateFloating('offline');}
  }

  function conflictValue(value){if(typeof value==='boolean')return value?'Yes':'No';if(value===''||value===null||value===undefined)return'(empty)';return String(value);}

  function resolveConflicts(conflicts){return new Promise(resolve=>{
    if(!conflicts.length){resolve();return;}
    const dialog=document.createElement('dialog');dialog.className='sync-conflict-dialog';dialog.innerHTML=`<div class="sync-conflict-box"><h2>Both copies changed</h2><p class="sync-conflict-lead"></p><p class="sync-conflict-field"></p><button class="sync-conflict-choice local" type="button"><strong>This device</strong><span class="sync-conflict-value"></span></button><button class="sync-conflict-choice remote" type="button"><strong>GitHub</strong><span class="sync-conflict-value"></span></button><p class="sync-conflict-counter"></p></div>`;document.body.append(dialog);
    let index=0;const lead=dialog.querySelector('.sync-conflict-lead'),field=dialog.querySelector('.sync-conflict-field'),localButton=dialog.querySelector('.local'),remoteButton=dialog.querySelector('.remote'),localValue=localButton.querySelector('.sync-conflict-value'),remoteValue=remoteButton.querySelector('.sync-conflict-value'),counter=dialog.querySelector('.sync-conflict-counter'),labels={title:'Task title',details:'Details',done:'Completed',deleted:'Deleted',order:'Order'};
    const show=()=>{const c=conflicts[index],label=labels[c.field]||c.field;lead.textContent=`${c.taskTitle} changed in both places. Choose the ${label.toLowerCase()} to keep.`;field.textContent=label;localValue.textContent=conflictValue(c.local);remoteValue.textContent=conflictValue(c.remote);counter.textContent=`Conflict ${index+1} of ${conflicts.length}`;};
    const choose=value=>{const c=conflicts[index];c.target[c.field]=value;index+=1;if(index>=conflicts.length){dialog.close();dialog.remove();resolve();}else show();};
    localButton.addEventListener('click',()=>choose(conflicts[index].local));remoteButton.addEventListener('click',()=>choose(conflicts[index].remote));show();dialog.showModal();
  });}

  async function pull(){
    if(busy)return;const count=pendingCount();if(count>0&&!window.confirm(`You have ${count} unsaved ${count===1?'change':'changes'} made on this device.\n\nPulling will discard them and replace this browser with GitHub.`))return;
    setBusy('Pulling from GitHub…','Replacing this working copy with the source of truth.');
    try{const remote=await fetchRemote();writeRemoteToLocal(remote);location.reload();}catch(error){busy=false;setStatus('Pull failed','both',error.message);updateUi();}
  }

  async function save(){
    if(busy||!getToken()||!state.ready||pendingCount()===0)return;
    setBusy('Checking GitHub…','Reconciling real local work with the source of truth.');
    try{
      let remote=await fetchRemote();let outgoing;
      if(remote.sha===state.baseSha)outgoing=loadTasks();
      else{const result=threeWay(state.baseTasks,loadTasks(),remote.tasks);await resolveConflicts(result.conflicts);outgoing=result.merged;}
      let saved;
      try{saved=await putRemote(outgoing,remote.sha);}catch(error){if(error.status!==409)throw error;remote=await fetchRemote();const retry=threeWay(state.baseTasks,outgoing,remote.tasks);await resolveConflicts(retry.conflicts);outgoing=retry.merged;saved=await putRemote(outgoing,remote.sha);}
      localStorage.setItem(STORAGE_KEY,JSON.stringify(outgoing));state={ready:true,baseSha:saved.sha,baseTasks:clone(outgoing),lastSyncedAt:saved.updatedAt,pending:{}};saveState();remoteChanged=false;sessionStorage.setItem('todo-v3-migration-note','Saved to GitHub.');location.reload();
    }catch(error){busy=false;setStatus('Save failed','both',error.message);updateUi();}
  }

  pullButton.textContent='Pull ↓';pushButton.textContent='Saved ✓';
  pullButton.addEventListener('click',pull);pushButton.addEventListener('click',save);
  floating.addEventListener('click',()=>{const count=pendingCount();if(count>0)save();else if(remoteChanged)pull();});

  document.addEventListener('submit',event=>{if(event.target?.id==='taskForm')captureAfterEvent('add');});
  document.addEventListener('input',event=>{if(list?.contains(event.target))captureAfterEvent('edit');});
  document.addEventListener('click',event=>{if(event.target?.id==='clearCompleted')captureAfterEvent('clear_completed');else if(list?.contains(event.target))captureAfterEvent('task');});
  document.addEventListener('keydown',event=>{if(list?.contains(event.target)&&(event.key==='ArrowUp'||event.key==='ArrowDown'))captureAfterEvent('reorder');});
  document.addEventListener('touchend',()=>captureAfterEvent('reorder'));
  document.addEventListener('mouseup',()=>captureAfterEvent('reorder'));

  if(syncBar&&'IntersectionObserver'in window){new IntersectionObserver(entries=>{syncBarVisible=entries[0]?.isIntersecting??true;updateUi();},{threshold:.15}).observe(syncBar);}
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkRemote();});
  window.addEventListener('pageshow',()=>checkRemote());
  window.addEventListener('online',()=>checkRemote(true));
  window.addEventListener('offline',updateUi);
  document.getElementById('saveTokenButton')?.addEventListener('click',()=>setTimeout(()=>checkRemote(true),40));
  document.getElementById('clearTokenButton')?.addEventListener('click',()=>setTimeout(updateUi,40));

  const note=sessionStorage.getItem('todo-v3-migration-note');if(note){sessionStorage.removeItem('todo-v3-migration-note');setStatus(note,'success','GitHub remains the source of truth.');setTimeout(updateUi,1800);}else updateUi();
  checkRemote(true);
})();
