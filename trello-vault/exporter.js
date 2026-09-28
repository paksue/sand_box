'use strict';

(function () {
  const TV=window.TV, s=TV.state, ui=TV.ui;

  function options() {
    return {
      comments:ui.optComments.checked,
      activity:ui.optActivity.checked,
      plugins:ui.optPlugins.checked
    };
  }

  function selected() {
    const id=s.selectedWorkspaceId;
    const workspace=s.workspaces.find(function(w){return w.id===id;});
    const scan=s.scans.get(id);
    if (!workspace || !scan) throw new Error('Choose a Workspace first.');
    return {workspace:workspace,boards:scan.boards};
  }

  async function startExport(mode) {
    if (s.exporting) return;
    let choice;
    try { choice=selected(); } catch(err) { showError(err.message); return; }
    if (mode==='folder' && !window.showDirectoryPicker) { showError('Folder export is not available in this browser. Use the card archive ZIP instead.'); return; }

    let root=null;
    if (mode==='folder') {
      try { root=await window.showDirectoryPicker({mode:'readwrite'}); }
      catch(err) { if (err.name!=='AbortError') showError(TV.friendly(err)); return; }
    }

    s.exporting=true;
    s.controller=new AbortController();
    prepareProgress();
    const opt=options();

    try {
      const backup=await collectBackup(choice.workspace,choice.boards,opt);
      assertActive();
      if (mode==='folder') await writeFolder(root,backup,opt);
      else if (mode==='zip') await downloadZip(backup,opt);
      else await downloadSnapshot(backup);
      finish(backup,mode);
    } catch(err) {
      if (err.name==='AbortError') {
        ui.progressTitle.textContent='Export cancelled';
        TV.setProgress(0,mode==='folder'?'No Trello data was changed. A partial local folder may remain if files had already been written.':'No Trello data was changed. The unfinished browser backup was discarded.');
        TV.log('Export cancelled by user.','warn');
      } else {
        ui.progressTitle.textContent='Export stopped';
        TV.setProgress(0,TV.friendly(err));
        TV.log(TV.friendly(err),'error');
      }
      ui.cancelBtn.hidden=true;
      ui.doneBtn.hidden=false;
    } finally {
      s.exporting=false;
      s.controller=null;
    }
  }

  function prepareProgress() {
    ui.progressSection.hidden=false;
    ui.progressSection.scrollIntoView({behavior:'smooth',block:'start'});
    ui.progressTitle.textContent='Building backup';
    ui.progressPercent.textContent='0%';
    ui.progressBar.style.width='0%';
    ui.progressMessage.textContent='Preparing Workspace…';
    ui.progressStats.replaceChildren();
    ui.progressLog.replaceChildren();
    ui.cancelBtn.hidden=false;
    ui.doneBtn.hidden=true;
  }

  async function collectBackup(workspace,boardRefs,opt) {
    const startedAt=new Date().toISOString();
    TV.log('Reading Workspace metadata…');
    const detail=await TV.api('/organizations/'+encodeURIComponent(workspace.id),{fields:'id,name,displayName,desc,url'},'object') || workspace;
    const members=await TV.api('/organizations/'+encodeURIComponent(workspace.id)+'/members/all',{fields:'id,fullName,username,url'},'array');
    const memberships=await TV.api('/organizations/'+encodeURIComponent(workspace.id)+'/memberships',{},'array');

    const backup={
      schema:'trello-vault',
      schemaVersion:2,
      generatedAt:null,
      startedAt:startedAt,
      generator:{name:'Trello Vault',version:TV.version,mode:'client-side'},
      security:{permission:'read-only',tokenPersisted:false,apiKeyIncluded:false},
      sourceAccount:{id:s.member.id,username:s.member.username,fullName:s.member.fullName},
      workspace:detail,
      members:members,
      memberships:memberships,
      boards:[],
      warnings:[],
      exportPolicy:{
        cardDataOnly:true,
        attachmentsIncluded:false,
        imagesIncluded:false,
        attachmentMetadataIncluded:false
      },
      limitations:[
        'Attachments, image files, card cover image metadata, and attachment metadata are intentionally excluded.',
        'Butler automations are not fully exposed by the public Trello REST API.',
        'Some private Power-Up data may not be available through the public API.'
      ]
    };

    const total=Math.max(boardRefs.length,1);
    for (let i=0;i<boardRefs.length;i++) {
      assertActive();
      const ref=boardRefs[i];
      TV.setProgress(5+Math.round((i/total)*77),'Reading board '+(i+1)+' of '+boardRefs.length+': '+ref.name);
      TV.log('Board '+(i+1)+'/'+boardRefs.length+': '+ref.name);
      const item=await collectBoard(ref,opt,backup.warnings);
      backup.boards.push(item);
    }

    backup.generatedAt=new Date().toISOString();
    backup.counts=summarize(backup.boards);
    TV.setProgress(84,'Workspace data captured.');
    TV.log('Workspace capture complete.','ok');
    return backup;
  }

  async function collectBoard(ref,opt,warnings) {
    const id=encodeURIComponent(ref.id);
    const optional=async function(path,params,label) {
      try { return await TV.api(path,params); }
      catch(err) {
        if (err.name==='AbortError') throw err;
        warnings.push({boardId:ref.id,boardName:ref.name,resource:label,error:TV.friendly(err)});
        TV.log(ref.name+': '+label+' unavailable','warn');
        return [];
      }
    };

    const board=await TV.api('/boards/'+id,{fields:'id,name,desc,closed,url,shortUrl,dateLastActivity,idOrganization'});
    const results=await Promise.all([
      optional('/boards/'+id+'/lists',{filter:'all',fields:'id,name,closed,pos,idBoard,subscribed'},'lists'),
      optional('/boards/'+id+'/cards/all',{
        fields:'id,name,desc,closed,idList,idBoard,idMembers,idLabels,url,shortUrl,pos,due,dueComplete,start,dateLastActivity,labels',
        customFieldItems:'true',checklists:'all',checklist_fields:'all'
      },'cards'),
      optional('/boards/'+id+'/checklists',{},'checklists'),
      optional('/boards/'+id+'/labels',{limit:1000,fields:'all'},'labels'),
      optional('/boards/'+id+'/customFields',{},'custom fields'),
      optional('/boards/'+id+'/members',{fields:'id,fullName,username,url'},'members')
    ]);

    let plugins=[];
    if (opt.plugins) plugins=await optional('/boards/'+id+'/plugins',{},'Power-Up metadata');

    let activity=[],comments=[];
    if (opt.activity) {
      activity=await fetchActions(ref.id,null,warnings,ref.name);
      if (opt.comments) comments=activity.filter(function(a){return a.type==='commentCard';});
    } else if (opt.comments) {
      comments=await fetchActions(ref.id,'commentCard',warnings,ref.name);
    }

    return {
      board:board,
      lists:results[0],
      cards:results[1],
      checklists:results[2],
      labels:results[3],
      customFields:results[4],
      members:results[5],
      plugins:plugins,
      comments:comments,
      activity:activity
    };
  }

  async function fetchActions(boardId,filter,warnings,boardName) {
    const all=[];
    let before='';
    const maxPages=50;
    for (let page=0;page<maxPages;page++) {
      assertActive();
      const params={limit:1000,fields:'all',member:'true',memberCreator:'true'};
      if (filter) params.filter=filter;
      if (before) params.before=before;
      let batch;
      try { batch=await TV.api('/boards/'+encodeURIComponent(boardId)+'/actions',params); }
      catch(err) {
        if (err.name==='AbortError') throw err;
        warnings.push({boardId:boardId,boardName:boardName,resource:filter?'comments':'activity',error:TV.friendly(err)});
        TV.log(boardName+': action history stopped after '+all.length+' records','warn');
        break;
      }
      if (!Array.isArray(batch) || !batch.length) break;
      all.push.apply(all,batch);
      if (batch.length<1000) break;
      const last=batch[batch.length-1];
      if (!last || !last.id || last.id===before) break;
      before=last.id;
    }
    return all;
  }

  function summarize(boards) {
    const c={boards:boards.length,archivedBoards:0,lists:0,cards:0,archivedCards:0,comments:0,actions:0,checklists:0};
    boards.forEach(function(b){
      if (b.board && b.board.closed) c.archivedBoards++;
      c.lists+=(b.lists||[]).length;
      c.cards+=(b.cards||[]).length;
      c.archivedCards+=(b.cards||[]).filter(function(x){return x.closed;}).length;
      c.comments+=(b.comments||[]).length;
      c.actions+=(b.activity||[]).length;
      c.checklists+=(b.checklists||[]).length;
    });
    return c;
  }

  async function writeFolder(root,backup,opt) {
    assertActive();
    const folderName=TV.safeName(backup.workspace.displayName || backup.workspace.name || 'trello')+'-trello-vault-'+stamp();
    const out=await root.getDirectoryHandle(folderName,{create:true});
    TV.setProgress(86,'Writing structured backup files…');

    await writeJson(out,'workspace.json',backup.workspace);
    await writeJson(out,'members.json',backup.members);
    await writeJson(out,'memberships.json',backup.memberships);
    const boardsDir=await out.getDirectoryHandle('boards',{create:true});

    for (let i=0;i<backup.boards.length;i++) {
      assertActive();
      const item=backup.boards[i];
      const name=String(i+1).padStart(3,'0')+'-'+TV.safeName(item.board.name || item.board.id);
      const dir=await boardsDir.getDirectoryHandle(name,{create:true});
      await writeJson(dir,'board.json',item.board);
      await writeJson(dir,'lists.json',item.lists);
      await writeJson(dir,'cards.json',item.cards);
      await writeJson(dir,'checklists.json',item.checklists);
      await writeJson(dir,'labels.json',item.labels);
      await writeJson(dir,'custom-fields.json',item.customFields);
      await writeJson(dir,'members.json',item.members);
      if (item.plugins && item.plugins.length) await writeJson(dir,'plugins.json',item.plugins);
      if (item.comments && item.comments.length) await writeJson(dir,'comments.json',item.comments);
      if (item.activity && item.activity.length) await writeJson(dir,'activity.json',item.activity);
    }

    await writeJson(out,'manifest.json',manifest(backup));
    await writeText(out,'README.txt',readmeText(backup));
    TV.setProgress(100,'Backup saved to '+folderName);
    TV.log('Local folder complete: '+folderName,'ok');
  }

  async function downloadZip(backup,opt) {
    assertActive();
    if (!window.TrelloVaultZip || !window.TrelloVaultZip.ZipWriter) throw new Error('The ZIP module did not load. Refresh Trello Vault and try again.');

    const rootName=TV.safeName(backup.workspace.displayName || backup.workspace.name || 'trello')+'-trello-vault-'+stamp();
    const prefix=rootName+'/';
    const zip=new window.TrelloVaultZip.ZipWriter();

    TV.setProgress(86,'Packing structured backup into ZIP…');
    await zip.addJson(prefix+'workspace.json',backup.workspace);
    await zip.addJson(prefix+'members.json',backup.members);
    await zip.addJson(prefix+'memberships.json',backup.memberships);

    for (let i=0;i<backup.boards.length;i++) {
      assertActive();
      const item=backup.boards[i];
      const boardFolder=String(i+1).padStart(3,'0')+'-'+TV.safeName(item.board.name || item.board.id);
      const base=prefix+'boards/'+boardFolder+'/';
      await zip.addJson(base+'board.json',item.board);
      await zip.addJson(base+'lists.json',item.lists);
      await zip.addJson(base+'cards.json',item.cards);
      await zip.addJson(base+'checklists.json',item.checklists);
      await zip.addJson(base+'labels.json',item.labels);
      await zip.addJson(base+'custom-fields.json',item.customFields);
      await zip.addJson(base+'members.json',item.members);
      if (item.plugins && item.plugins.length) await zip.addJson(base+'plugins.json',item.plugins);
      if (item.comments && item.comments.length) await zip.addJson(base+'comments.json',item.comments);
      if (item.activity && item.activity.length) await zip.addJson(base+'activity.json',item.activity);
    }

    await zip.addJson(prefix+'manifest.json',manifest(backup));
    await zip.addText(prefix+'README.txt',readmeText(backup));

    TV.setProgress(98,'Finalizing ZIP locally in your browser…');
    const blob=zip.finalize();
    downloadBlob(blob,rootName+'.zip');
    TV.setProgress(100,'Card archive ZIP downloaded.');
    TV.log('ZIP complete: '+rootName+'.zip','ok');
  }

  async function writeJson(dir,name,value) { await writeText(dir,name,JSON.stringify(value==null?null:value,null,2)); }
  async function writeText(dir,name,text) {
    const handle=await dir.getFileHandle(name,{create:true});
    const writer=await handle.createWritable();
    await writer.write(text);
    await writer.close();
  }

  async function downloadSnapshot(backup) {
    TV.setProgress(90,'Preparing portable JSON snapshot…');
    const json=JSON.stringify(backup,null,2);
    const base=TV.safeName(backup.workspace.displayName || backup.workspace.name || 'trello')+'-trello-vault-'+stamp()+'.json';
    if ('CompressionStream' in window && json.length>2000000) {
      const stream=new Blob([json],{type:'application/json'}).stream().pipeThrough(new CompressionStream('gzip'));
      const blob=await new Response(stream).blob();
      downloadBlob(blob,base+'.gz');
      TV.log('Downloaded compressed JSON snapshot.','ok');
    } else {
      downloadBlob(new Blob([json],{type:'application/json'}),base);
      TV.log('Downloaded JSON snapshot.','ok');
    }
    TV.setProgress(100,'JSON snapshot ready.');
  }

  function downloadBlob(blob,name) {
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=name; a.rel='noreferrer';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},2000);
  }

  function manifest(backup) {
    return {
      schema:backup.schema,
      schemaVersion:backup.schemaVersion,
      generatedAt:backup.generatedAt,
      startedAt:backup.startedAt,
      generator:backup.generator,
      security:backup.security,
      sourceAccount:backup.sourceAccount,
      workspace:{id:backup.workspace.id,name:backup.workspace.name,displayName:backup.workspace.displayName,url:backup.workspace.url},
      counts:backup.counts,
      exportPolicy:backup.exportPolicy,
      warnings:backup.warnings,
      limitations:backup.limitations,
      boards:backup.boards.map(function(item,i){
        return {
          index:i+1,id:item.board.id,name:item.board.name,closed:Boolean(item.board.closed),url:item.board.url,
          counts:{
            lists:(item.lists||[]).length,cards:(item.cards||[]).length,checklists:(item.checklists||[]).length,
            labels:(item.labels||[]).length,comments:(item.comments||[]).length,actions:(item.activity||[]).length
          }
        };
      })
    };
  }

  function readmeText(backup) {
    return 'Trello Vault backup\n===================\n\nWorkspace: '+(backup.workspace.displayName || backup.workspace.name)+
      '\nGenerated: '+backup.generatedAt+
      '\nBoards: '+backup.counts.boards+
      '\nCards: '+backup.counts.cards+
      '\nComments: '+backup.counts.comments+
      '\nChecklists: '+backup.counts.checklists+
      '\n\nThis is a card-data-only archive. Attachments, images, card cover image metadata, and attachment metadata are intentionally excluded.\nThis backup was created entirely in your browser with a read-only Trello token.\nThe token and API key are not stored in this backup.\n\nKnown public API limitations:\n- Butler automations are not fully exportable through the public REST API.\n- Some private Power-Up data is not exposed.\n';
  }

  function finish(backup,mode) {
    const c=backup.counts;
    ui.progressTitle.textContent='Backup complete';
    TV.setProgress(100,mode==='folder'?'Your card-data archive was written directly to the folder you selected.':mode==='zip'?'Your browser downloaded the card-data ZIP. No attachments or images were collected.':'Your browser downloaded the card-data JSON locally.');
    ui.progressStats.innerHTML=stat(c.boards,'boards')+stat(c.cards,'cards')+stat(c.comments,'comments')+stat(c.checklists,'checklists');
    ui.cancelBtn.hidden=true;
    ui.doneBtn.hidden=false;
  }

  function stat(v,label) {
    return '<div class="stat"><strong>'+Number(v||0).toLocaleString()+'</strong><span>'+label+'</span></div>';
  }

  function stamp() {
    return new Date().toISOString().replace(/[:.]/g,'-').replace('T','_').replace('Z','');
  }

  function assertActive() {
    if (s.controller && s.controller.signal.aborted) throw new DOMException('Export cancelled','AbortError');
  }

  function showError(message) {
    ui.progressSection.hidden=false;
    ui.progressTitle.textContent='Export could not start';
    ui.progressMessage.textContent=message;
    ui.progressPercent.textContent='0%';
    ui.progressBar.style.width='0%';
    ui.cancelBtn.hidden=true;
    ui.doneBtn.hidden=false;
    ui.progressSection.scrollIntoView({behavior:'smooth'});
  }

  ui.exportZipBtn.addEventListener('click',function(){startExport('zip');});
  ui.exportFolderBtn.addEventListener('click',function(){startExport('folder');});
  ui.exportJsonBtn.addEventListener('click',function(){startExport('json');});
})();
