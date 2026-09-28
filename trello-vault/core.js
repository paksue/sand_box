'use strict';

window.TV = {
  API: 'https://api.trello.com/1',
  ORIGIN: 'https://trello.com',
  version: '1.0.0',
  state: {
    apiKey: '',
    token: '',
    member: null,
    workspaces: [],
    scans: new Map(),
    selectedWorkspaceId: null,
    controller: null,
    exporting: false
  }
};

(function () {
  const TV = window.TV;
  const s = TV.state;
  const $ = function (id) { return document.getElementById(id); };
  TV.$ = $;

  TV.ui = {
    apiKey:$('apiKey'), rememberKey:$('rememberKey'), clearKey:$('clearKey'),
    connectionBadge:$('connectionBadge'), connectForm:$('connectForm'), accountBox:$('accountBox'),
    connectBtn:$('connectBtn'), manualToggle:$('manualToggle'), manualBox:$('manualBox'),
    openManual:$('openManual'), manualToken:$('manualToken'), showToken:$('showToken'), useManual:$('useManual'),
    connectError:$('connectError'), originValue:$('originValue'),
    accountName:$('accountName'), accountUser:$('accountUser'), avatar:$('avatar'), disconnectBtn:$('disconnectBtn'),
    workspaceSection:$('workspaceSection'), workspaceGrid:$('workspaceGrid'), workspaceSummary:$('workspaceSummary'),
    exportSection:$('exportSection'), selectedWorkspaceLabel:$('selectedWorkspaceLabel'), selectedCard:$('selectedCard'),
    optComments:$('optComments'), optActivity:$('optActivity'), optAttachments:$('optAttachments'), optPlugins:$('optPlugins'),
    folderMode:$('folderMode'), exportFolderBtn:$('exportFolderBtn'), exportJsonBtn:$('exportJsonBtn'),
    progressSection:$('progressSection'), progressTitle:$('progressTitle'), progressPercent:$('progressPercent'),
    progressBar:$('progressBar'), progressMessage:$('progressMessage'), progressStats:$('progressStats'),
    progressLog:$('progressLog'), cancelBtn:$('cancelBtn'), doneBtn:$('doneBtn')
  };

  TV.authHeader = function () {
    return 'OAuth oauth_consumer_key="' + s.apiKey.replace(/"/g,'') + '", oauth_token="' + s.token.replace(/"/g,'') + '"';
  };

  TV.api = async function (path, params, optional) {
    if (!s.token || !s.apiKey) throw new Error('Connect to Trello first.');
    const url = new URL(TV.API + path);
    Object.entries(params || {}).forEach(function (entry) {
      if (entry[1] !== undefined && entry[1] !== null && entry[1] !== '') url.searchParams.set(entry[0], String(entry[1]));
    });
    try {
      const response = await fetch(url.toString(), {
        method:'GET',
        headers:{Accept:'application/json', Authorization:TV.authHeader()},
        cache:'no-store',
        signal:s.controller ? s.controller.signal : undefined
      });
      if (!response.ok) {
        const body = await response.text().catch(function(){ return ''; });
        const err = new Error('Trello API ' + response.status + (body ? ': ' + body.slice(0,180) : ''));
        err.status = response.status;
        throw err;
      }
      return response.json();
    } catch (err) {
      if (optional && err.name !== 'AbortError') {
        TV.log('Optional API call skipped: ' + path, 'warn');
        return optional === 'array' ? [] : null;
      }
      throw err;
    }
  };

  TV.escape = function (v) {
    return String(v == null ? '' : v).replace(/[&<>'"]/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];
    });
  };

  TV.safeName = function (value) {
    const clean = String(value || 'untitled').normalize('NFKC')
      .replace(/[\\/:*?"<>|\u0000-\u001F]/g,'-').replace(/\s+/g,' ').trim().replace(/[. ]+$/g,'');
    return (clean || 'untitled').slice(0,110);
  };

  TV.friendly = function (err) {
    if (!err) return 'Unknown error';
    if (err.name === 'AbortError') return 'Export cancelled.';
    if (err.status === 401 || /401|unauthorized|invalid token/i.test(err.message || '')) return 'Trello rejected this session. The temporary token may have expired or been revoked.';
    if (err.status === 429 || /429/.test(err.message || '')) return 'Trello rate-limited the export. Wait briefly and try again.';
    if (err instanceof TypeError && /fetch/i.test(err.message || '')) return 'The browser could not reach Trello. Check your network, privacy settings, or CORS restrictions.';
    return err.message || String(err);
  };

  TV.setProgress = function (pct, message) {
    const p = Math.max(0,Math.min(100,Number(pct)||0));
    TV.ui.progressPercent.textContent = p + '%';
    TV.ui.progressBar.style.width = p + '%';
    TV.ui.progressMessage.textContent = message || '';
  };

  TV.log = function (message, level) {
    const line = document.createElement('div');
    line.className = 'log-line ' + (level || 'ok');
    line.textContent = message;
    TV.ui.progressLog.appendChild(line);
    TV.ui.progressLog.scrollTop = TV.ui.progressLog.scrollHeight;
  };

  function readKey() {
    const key = TV.ui.apiKey.value.trim();
    if (!key) throw new Error('Paste your Trello API key first.');
    if (TV.ui.rememberKey.checked) localStorage.setItem('trello-vault-api-key',key);
    else localStorage.removeItem('trello-vault-api-key');
    s.apiKey = key;
    return key;
  }

  function authorizeUrl(popup) {
    const url = new URL(TV.ORIGIN + '/1/authorize');
    url.searchParams.set('expiration','1hour');
    url.searchParams.set('scope','read');
    url.searchParams.set('response_type','token');
    url.searchParams.set('key',s.apiKey || TV.ui.apiKey.value.trim());
    url.searchParams.set('name','Trello Vault');
    if (popup) {
      url.searchParams.set('callback_method','postMessage');
      url.searchParams.set('return_url',location.origin);
    }
    return url.toString();
  }

  function parseMessage(data) {
    if (typeof data === 'string') {
      const text = data.trim();
      if (text.length > 20 && !/error/i.test(text)) return text;
      try { return JSON.parse(text).token || ''; } catch (_) { return ''; }
    }
    return data && typeof data === 'object' ? (data.token || '') : '';
  }

  function showConnectError(message) {
    TV.ui.connectError.textContent = message;
    TV.ui.connectError.hidden = false;
  }

  function clearConnectError() {
    TV.ui.connectError.textContent = '';
    TV.ui.connectError.hidden = true;
  }

  async function finishConnection(token) {
    s.token = token;
    TV.ui.connectBtn.disabled = true;
    try {
      s.member = await TV.api('/members/me',{fields:'id,fullName,username,avatarUrl,url'});
      s.workspaces = await TV.api('/members/me/organizations',{fields:'id,name,displayName,desc,url,prefs'});
      renderConnected();
      renderWorkspaces();
    } catch (err) {
      s.token = '';
      showConnectError(TV.friendly(err));
    } finally {
      TV.ui.connectBtn.disabled = false;
    }
  }

  async function popupAuth() {
    clearConnectError();
    try { readKey(); } catch (err) { showConnectError(err.message); return; }
    const width=470,height=650;
    const left=Math.max(0,window.screenX+(window.outerWidth-width)/2);
    const top=Math.max(0,window.screenY+(window.outerHeight-height)/2);
    const popup=window.open(authorizeUrl(true),'trello-vault-auth','popup=yes,width='+width+',height='+height+',left='+left+',top='+top);
    if (!popup) { showConnectError('The browser blocked the Trello popup. Allow popups or use the manual token option.'); return; }

    TV.ui.connectBtn.disabled=true;
    TV.ui.connectBtn.querySelector('span').textContent='Waiting for Trello…';
    let finished=false, poll, timer;
    const cleanup=function(){
      window.removeEventListener('message',receive);
      clearInterval(poll); clearTimeout(timer);
      TV.ui.connectBtn.disabled=false;
      TV.ui.connectBtn.querySelector('span').textContent='Connect read-only';
    };
    const receive=async function(event){
      if (event.origin!==TV.ORIGIN || event.source!==popup) return;
      finished=true;
      const token=parseMessage(event.data);
      try{popup.close();}catch(_){}
      cleanup();
      if (!token) { showConnectError('Trello did not return a token.'); return; }
      await finishConnection(token);
    };
    window.addEventListener('message',receive);
    poll=setInterval(function(){
      if (!finished && popup.closed) { cleanup(); showConnectError('The authorization window closed before Trello returned a token.'); }
    },500);
    timer=setTimeout(function(){
      if (!finished) { try{popup.close();}catch(_){} cleanup(); showConnectError('Authorization timed out. Try again or use the manual token flow.'); }
    },120000);
  }

  function renderConnected() {
    TV.ui.connectForm.hidden=true;
    TV.ui.accountBox.hidden=false;
    TV.ui.connectionBadge.textContent='Connected';
    TV.ui.connectionBadge.classList.add('connected');
    TV.ui.accountName.textContent=s.member.fullName || s.member.username || 'Trello account';
    TV.ui.accountUser.textContent=s.member.username ? '@'+s.member.username : 'Read-only session';
    const initial=(s.member.fullName || s.member.username || 'T').trim().charAt(0).toUpperCase();
    TV.ui.avatar.textContent=initial;
    if (s.member.avatarUrl) {
      const img=new Image();
      img.alt='';
      img.referrerPolicy='no-referrer';
      img.src=s.member.avatarUrl+'/50.png';
      img.onload=function(){ TV.ui.avatar.textContent=''; TV.ui.avatar.appendChild(img); };
    }
    TV.ui.workspaceSection.hidden=false;
    TV.ui.workspaceSection.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderWorkspaces() {
    TV.ui.workspaceGrid.replaceChildren();
    const list=s.workspaces || [];
    TV.ui.workspaceSummary.textContent=list.length+' Workspace'+(list.length===1?'':'s')+' available';
    if (!list.length) {
      const empty=document.createElement('div');
      empty.className='card';
      empty.textContent='No Trello Workspaces were returned for this account.';
      empty.style.padding='22px';
      TV.ui.workspaceGrid.appendChild(empty);
      return;
    }
    list.forEach(function(ws){
      const scan=s.scans.get(ws.id);
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='workspace-card'+(s.selectedWorkspaceId===ws.id?' selected':'');
      const initial=(ws.displayName || ws.name || 'W').trim().charAt(0).toUpperCase();
      btn.innerHTML='<div class="workspace-icon">'+TV.escape(initial)+'</div>'+
        '<h3>'+TV.escape(ws.displayName || ws.name || 'Untitled Workspace')+'</h3>'+
        '<p>'+TV.escape(ws.desc || ws.name || '')+'</p>'+
        '<div class="workspace-meta"><span><strong>'+(scan?scan.boards.length:'—')+'</strong> boards</span><span>'+(scan?(scan.boards.filter(function(b){return b.closed;}).length+' archived'):'Click to scan')+'</span></div>';
      btn.addEventListener('click',function(){ selectWorkspace(ws.id); });
      TV.ui.workspaceGrid.appendChild(btn);
    });
  }

  async function selectWorkspace(id) {
    s.selectedWorkspaceId=id;
    renderWorkspaces();
    let scan=s.scans.get(id);
    const ws=s.workspaces.find(function(w){return w.id===id;});
    if (!scan) {
      TV.ui.workspaceSummary.textContent='Scanning '+(ws.displayName || ws.name)+'…';
      try {
        const boards=await TV.api('/organizations/'+encodeURIComponent(id)+'/boards',{
          filter:'all',fields:'id,name,desc,closed,url,shortUrl,dateLastActivity,prefs'
        });
        scan={boards:boards||[]};
        s.scans.set(id,scan);
      } catch (err) {
        TV.ui.workspaceSummary.textContent=TV.friendly(err);
        return;
      }
    }
    renderWorkspaces();
    TV.ui.workspaceSummary.textContent=scan.boards.length+' boards · '+scan.boards.filter(function(b){return b.closed;}).length+' archived';
    TV.ui.exportSection.hidden=false;
    TV.ui.selectedWorkspaceLabel.textContent=ws.displayName || ws.name;
    TV.ui.selectedCard.innerHTML='<div class="big-name">'+TV.escape(ws.displayName || ws.name)+'</div><div class="sub">Workspace ID '+TV.escape(ws.id)+'</div>'+
      '<div class="board-counts"><span><strong>'+scan.boards.length+'</strong>boards</span><span><strong>'+scan.boards.filter(function(b){return b.closed;}).length+'</strong>archived</span></div>';
    TV.ui.exportSection.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function disconnect() {
    if (s.exporting) return;
    s.token=''; s.member=null; s.workspaces=[]; s.scans=new Map(); s.selectedWorkspaceId=null;
    TV.ui.manualToken.value='';
    TV.ui.accountBox.hidden=true; TV.ui.connectForm.hidden=false;
    TV.ui.connectionBadge.textContent='Not connected'; TV.ui.connectionBadge.classList.remove('connected');
    TV.ui.workspaceSection.hidden=true; TV.ui.exportSection.hidden=true; TV.ui.progressSection.hidden=true;
    TV.ui.workspaceGrid.replaceChildren();
  }

  function init() {
    const remembered=localStorage.getItem('trello-vault-api-key');
    if (remembered) { TV.ui.apiKey.value=remembered; TV.ui.rememberKey.checked=true; }
    TV.ui.originValue.textContent=location.origin;
    if (!window.showDirectoryPicker) {
      TV.ui.folderMode.innerHTML='<span><b>Browser fallback</b><strong>Folder export unavailable</strong></span><small>Use desktop Chrome or Edge for structured folder export. JSON snapshot still works here.</small>';
      TV.ui.exportFolderBtn.disabled=true;
    }

    TV.ui.clearKey.addEventListener('click',function(){TV.ui.apiKey.value='';localStorage.removeItem('trello-vault-api-key');TV.ui.apiKey.focus();});
    TV.ui.connectBtn.addEventListener('click',popupAuth);
    TV.ui.manualToggle.addEventListener('click',function(){const open=TV.ui.manualBox.hidden;TV.ui.manualBox.hidden=!open;TV.ui.manualToggle.setAttribute('aria-expanded',String(open));});
    TV.ui.openManual.addEventListener('click',function(){clearConnectError();try{readKey();}catch(err){showConnectError(err.message);return;}window.open(authorizeUrl(false),'_blank','noopener,noreferrer');});
    TV.ui.showToken.addEventListener('click',function(){TV.ui.manualToken.type=TV.ui.manualToken.type==='password'?'text':'password';});
    TV.ui.useManual.addEventListener('click',async function(){clearConnectError();try{readKey();}catch(err){showConnectError(err.message);return;}const token=TV.ui.manualToken.value.trim();if(!token){showConnectError('Paste the temporary token Trello showed you.');return;}await finishConnection(token);});
    TV.ui.disconnectBtn.addEventListener('click',disconnect);
    TV.ui.cancelBtn.addEventListener('click',function(){if(s.exporting && s.controller)s.controller.abort();});
    TV.ui.doneBtn.addEventListener('click',function(){TV.ui.progressSection.hidden=true;TV.ui.cancelBtn.hidden=false;TV.ui.doneBtn.hidden=true;});
  }

  init();
})();
