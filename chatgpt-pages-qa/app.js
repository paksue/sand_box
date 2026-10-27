"use strict";
(function () {
  const API = "http://127.0.0.1:42815";
  const STORAGE = "orbit-ask-chats-v1";
  const ACTIVE = "orbit-ask-active-v1";
  const $ = (id) => document.getElementById(id);
  const state = { chats: [], active: null, email: "", sessionToken: sessionStorage.getItem("orbit-session") || "", connected: false, models: [], model: "", busy: false };
  const safe = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const uuid = () => crypto.randomUUID();
  const readStorage = () => { try { return JSON.parse(localStorage.getItem(STORAGE) || "[]"); } catch { return []; } };
  const save = () => { localStorage.setItem(STORAGE, JSON.stringify(state.chats)); localStorage.setItem(ACTIVE, state.active || ""); };
  function toast(msg) { const node = $("toast"); node.textContent = msg; node.classList.add("show"); clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove("show"), 3200); }
  function displayNotice(message) { $("notice").hidden = !message; if(message){$("notice").textContent=message;} }
  function currentChat() { return state.chats.find(c => c.id === state.active); }
  function addChat() {
    const chat = { id: uuid(), title: "New conversation", createdAt: new Date().toISOString(), messages: [] };
    state.chats.unshift(chat); state.active = chat.id; save(); render(); closeSidebar(); $("prompt").focus();
  }
  function setActive(id) { if(!state.chats.some(c => c.id === id)) return; state.active = id; save(); render(); closeSidebar(); }
  function deleteChat(id) {
    if(!confirm("Delete this conversation from this browser?")) return;
    state.chats = state.chats.filter(c => c.id !== id);
    if(state.active === id) state.active = state.chats[0] && state.chats[0].id;
    if(!state.active) addChat(); else { save(); render(); }
  }
  function renderSidebar() {
    $("chatList").replaceChildren();
    if (!state.chats.length) { const e=document.createElement("p"); e.className="empty-sidebar"; e.textContent="Your conversations will appear here."; $("chatList").append(e); }
    for (const chat of state.chats) {
      const item=document.createElement("div"); item.setAttribute("role","button");item.tabIndex=0; item.className="chat-item"+(chat.id === state.active ? " active" : "");
      const icon=document.createElement("span"); icon.className="chat-glyph";icon.textContent="◇";
      const name=document.createElement("span"); name.className="chat-name";name.textContent=chat.title;
      const del=document.createElement("button");del.className="chat-delete";del.textContent="×";del.title="Delete conversation";del.setAttribute("aria-label","Delete "+chat.title);
      del.addEventListener("click",e=>{e.stopPropagation();deleteChat(chat.id);});
      item.append(icon,name,del);item.addEventListener("click",()=>setActive(chat.id));item.addEventListener("keydown",e=>{if(e.target===item&&(e.key==="Enter"||e.key===" ")){e.preventDefault();setActive(chat.id);}});$("chatList").append(item);
    }
  }
  function inlineMd(input) {
    let x=safe(input);
    x=x.replace(/\x60([^\x60\n]+)\x60/g,"<code>$1</code>");
    x=x.replace(/\*\*([^*\n]+)\*\*/g,"<strong>$1</strong>");
    return x;
  }
  function markdown(text) {
    const sections=String(text || "").split(/(\x60\x60\x60[\s\S]*?\x60\x60\x60)/g);
    return sections.map((section)=>{
      if(section.startsWith("\x60\x60\x60") && section.endsWith("\x60\x60\x60")) {
        const code=section.slice(3,-3).replace(/^[^\n]*\n/,"");
        return "<pre><code>"+safe(code)+"</code></pre>";
      }
      return section.split(/\n\n+/).map((p)=>{
        if(!p.trim()) return "";
        const t=p.trim();
        if(t.startsWith("### ")) return "<h3>"+inlineMd(t.slice(4))+"</h3>";
        if(t.startsWith("## ")) return "<h2>"+inlineMd(t.slice(3))+"</h2>";
        if(t.startsWith("- ")) return "<ul>"+t.split("\n").map(line=>"<li>"+inlineMd(line.replace(/^\s*[-*]\s+/,""))+"</li>").join("")+"</ul>";
        return "<p>"+t.split("\n").map(inlineMd).join("<br>")+"</p>";
      }).join("");
    }).join("");
  }
  function renderMessages() {
    const chat=currentChat(); const isEmpty = !chat || chat.messages.length===0;
    $("welcome").hidden=!isEmpty; $("messages").hidden=isEmpty;
    $("messages").replaceChildren(); $("activeChatTitle").textContent=(chat && chat.title)||"New conversation";
    if(isEmpty) return;
    chat.messages.forEach((message)=>{
      const element=document.createElement("article");element.className="message "+message.role;
      if(message.role==="assistant"){const avatar=document.createElement("div");avatar.className="message-avatar";avatar.textContent="✳";element.append(avatar);}
      const box=document.createElement("div");box.className="message-content";
      if(message.role==="assistant"){const speaker=document.createElement("div");speaker.className="speaker";speaker.textContent="ORBIT";box.append(speaker);}
      const body=document.createElement("div");body.className="body";body.innerHTML=message.pending?"<span class='pending-dot'></span><span class='pending-dot'></span><span class='pending-dot'></span>":markdown(message.content);
      box.append(body);
      if(message.role==="assistant" && !message.pending && message.content) {
        const actions=document.createElement("div");actions.className="message-actions";
        const copy=document.createElement("button");copy.textContent="Copy answer";copy.addEventListener("click",()=>{navigator.clipboard.writeText(message.content).then(()=>toast("Copied to clipboard")).catch(()=>toast("Clipboard is unavailable"));});
        actions.append(copy);box.append(actions);
      }
      element.append(box);$("messages").append(element);
    });
    requestAnimationFrame(()=>{const thread=$("thread");thread.scrollTop=thread.scrollHeight;});
  }
  function render() { renderSidebar(); renderMessages(); updateStatus(); }
  function updateStatus() {
    $("sidebarDot").classList.toggle("online",state.connected);
    $("sidebarStatus").textContent=state.connected?"ChatGPT plan connected":state.sessionToken?"Companion paired":"Companion offline";
    $("sidebarSubstatus").textContent=state.connected?"Ready to answer questions":state.sessionToken?"Sign in to ChatGPT":"Connect to enable AI";
    $("composerMode").textContent=state.connected?"Using your authorized ChatGPT plan":"Private, local conversation history";
    $("selectedModel").textContent=state.model ? (state.models.find(m=>m.slug===state.model)?.display_name || state.model) : "Choose a model";
    $("signIn").disabled=!state.sessionToken;
    $("accountDetail").textContent=state.connected?"Authorized as "+(state.email||"ChatGPT user")+". Plan usage enabled. Models available: "+state.models.length+".":state.sessionToken?"Companion paired. Continue with ChatGPT to authorize use of your plan.":"Connect your companion first.";
    $("send").disabled=state.busy;
  }
  async function call(path, opts={}) {
    const headers = Object.assign({"Content-Type":"application/json"},state.sessionToken?{"Authorization":"Bearer "+state.sessionToken}:{},opts.headers||{});
    const response=await fetch(API+path,Object.assign({method:"GET",mode:"cors",headers,targetAddressSpace:"loopback",cache:"no-store"},opts,{headers}));
    const data=await response.json().catch(()=>({error:"Invalid companion response"}));
    if(!response.ok) throw new Error(data.error||"Request failed ("+response.status+")");
    return data;
  }
  async function refreshStatus() {
    if(!state.sessionToken){state.connected=false;updateStatus();return;}
    try {
      const info=await call("/api/status");
      state.email=info.email||"";
      state.connected=Boolean(info.connected && info.sharing);
      if(state.connected){
        state.models=await call("/api/models").then(x=>x.models||[]);
        if(!state.models.some(m=>m.slug===state.model)) state.model=state.models[0] && state.models[0].slug || "";
      } else {state.models=[];state.model="";}
      updateStatus();
    } catch(e) {
      if(e.message.toLowerCase().includes("unauthorized") || e.message.toLowerCase().includes("invalid pairing")){state.sessionToken="";sessionStorage.removeItem("orbit-session");}
      state.connected=false;state.models=[];state.model="";updateStatus();
    }
  }
  async function pair() {
    const code=$("pairCode").value.trim();
    if(!/^\d{6}$/.test(code)){$("pairFeedback").textContent="Enter the exact six-digit code from the companion.";return;}
    $("pairFeedback").textContent="Checking companion…";
    try {
      const info=await call("/api/pair",{method:"POST",body:JSON.stringify({code})});
      state.sessionToken=info.token;sessionStorage.setItem("orbit-session",info.token);
      $("pairFeedback").textContent="Paired successfully. Now authorize ChatGPT.";
      await refreshStatus();toast("Companion paired");
    } catch(e){$("pairFeedback").textContent=e.message+" — make sure the local service is running.";}
  }
  async function signIn() {
    const popup=window.open("about:blank","orbit-chatgpt-signin","width=650,height=760");
    try {
      const {url}=await call("/api/auth/start",{method:"POST",body:"{}"});
      if(popup)popup.location.href=url;else {displayNotice("Pop-up blocked. Allow pop-ups for this site, then try again.");return;}
      toast("Complete ChatGPT authorization in the new window.");
      let n=0;clearInterval(signIn.timer);
      signIn.timer=setInterval(async()=>{
        n++;await refreshStatus();
        if(state.connected){clearInterval(signIn.timer);toast("ChatGPT plan connected");}
        if(n>=80)clearInterval(signIn.timer);
      },1500);
    }catch(e){if(popup)popup.close();toast(e.message);}
  }
  async function sendQuestion(value) {
    const prompt=String(value||"").trim();
    if(!prompt||state.busy) return;
    if(!state.connected||!state.model){showSettings();displayNotice("Connect your companion and authorize ChatGPT plan usage to get a real answer.");return;}
    let chat=currentChat(); if(!chat){addChat();chat=currentChat();}
    const previous=chat.messages.filter(m=>!m.pending).slice(-24).map(m=>({role:m.role,content:m.content}));
    chat.messages.push({role:"user",content:prompt});
    if(chat.title==="New conversation")chat.title=prompt.length>50?prompt.slice(0,49)+"…":prompt;
    const answer={role:"assistant",content:"",pending:true};chat.messages.push(answer);
    state.busy=true;$("prompt").value="";resizePrompt();save();render();
    try {
      const response=await fetch(API+"/api/chat",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+state.sessionToken},body:JSON.stringify({model:state.model,messages:[...previous,{role:"user",content:prompt}]}),targetAddressSpace:"loopback",cache:"no-store"});
      if(!response.ok){const err=await response.json().catch(()=>({}));throw new Error(err.error||"Chat failed");}
      const reader=response.body.getReader();const decoder=new TextDecoder();let buffer="";let completed=false;
      while(true) {
        const {done,value}=await reader.read();if(done)break;
        buffer+=decoder.decode(value,{stream:true});
        let index;
        while((index=buffer.indexOf("\n\n"))!==-1) {
          const packet=buffer.slice(0,index).replace(/\r/g,"");buffer=buffer.slice(index+2);
          const dataLine=packet.split("\n").find(line=>line.startsWith("data: "));
          if(!dataLine)continue;
          const event=JSON.parse(dataLine.slice(6));
          if(event.type==="delta"){answer.content+=event.text||"";answer.pending=false;renderMessages();}
          if(event.type==="done"){completed=true;}
          if(event.type==="error")throw new Error(event.error||"Model response failed");
        }
      }
      if(!completed)throw new Error("Stream interrupted before completion");
      if(!answer.content.trim())answer.content="The model completed without returning any text.";
    }catch(e){
      answer.pending=false;
      answer.content=(answer.content?answer.content+"\n\n":"")+"⚠ Request not completed: "+e.message;
      displayNotice("Response failed. You can retry after checking the companion and your ChatGPT plan limits.");
    }finally{answer.pending=false;state.busy=false;save();render();$("prompt").focus();}
  }
  function showSettings(){$("settingsDialog").showModal();}
  function closeSidebar(){$("sidebar").classList.remove("open");$("scrim").hidden=true;}
  function resizePrompt(){const t=$("prompt");t.style.height="auto";t.style.height=Math.min(t.scrollHeight,220)+"px";}
  function exportChats() {
    const blob=new Blob([JSON.stringify({app:"Orbit Ask",version:1,exportedAt:new Date().toISOString(),chats:state.chats},null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="orbit-ask-chats-"+new Date().toISOString().slice(0,10)+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("Exported conversations");
  }
  $("newChat").addEventListener("click",addChat);
  $("menuButton").addEventListener("click",()=>{$("sidebar").classList.toggle("open");$("scrim").hidden=!$("sidebar").classList.contains("open");});
  $("scrim").addEventListener("click",closeSidebar);
  $("openSettings").addEventListener("click",showSettings);
  $("closeSettings").addEventListener("click",()=>$("settingsDialog").close());
  $("copyCommand").addEventListener("click",()=>navigator.clipboard.writeText("cd companion && node server.mjs").then(()=>toast("Command copied")));
  $("pairButton").addEventListener("click",pair);
  $("pairCode").addEventListener("keydown",e=>{if(e.key==="Enter")pair();});
  $("signIn").addEventListener("click",signIn);
  $("exportAll").addEventListener("click",exportChats);
  $("exportData").addEventListener("click",exportChats);
  $("clearData").addEventListener("click",()=>{
    if(!confirm("Permanently delete all Orbit chats saved in this browser?"))return;
    state.chats=[];state.active=null;addChat();toast("Local chats deleted");
  });
  $("modelToggle").addEventListener("click",()=>{
    const menu=$("modelMenu");menu.hidden=!menu.hidden;menu.replaceChildren();
    if(!state.models.length){const item=document.createElement("button");item.textContent="Connect ChatGPT to list models";item.addEventListener("click",()=>{menu.hidden=true;showSettings();});menu.append(item);}
    else state.models.forEach(m=>{const button=document.createElement("button");button.textContent=(m.slug===state.model?"✓  ":"   ")+(m.display_name||m.slug);button.addEventListener("click",()=>{state.model=m.slug;updateStatus();menu.hidden=true;});menu.append(button);});
  });
  document.addEventListener("click",e=>{if(!$("modelToggle").contains(e.target)&&!$("modelMenu").contains(e.target))$("modelMenu").hidden=true;});
  $("prompt").addEventListener("input",resizePrompt);
  $("prompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();$("composer").requestSubmit();}});
  $("composer").addEventListener("submit",e=>{e.preventDefault();sendQuestion($("prompt").value);});
  $("suggestions").addEventListener("click",e=>{const button=e.target.closest("[data-prompt]");if(button)sendQuestion(button.dataset.prompt);});
  document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="n"){e.preventDefault();addChat();}});
  state.chats=readStorage().filter(c=>c&&typeof c.id==="string"&&Array.isArray(c.messages)).slice(0,120);
  state.active=localStorage.getItem(ACTIVE);
  if(!state.chats.some(c=>c.id===state.active))state.active=state.chats[0]&&state.chats[0].id;
  if(!state.active)addChat();else render();
  refreshStatus();
  if(!state.sessionToken)setTimeout(()=>displayNotice("AI is not connected yet. Open Connection & settings to pair your local companion."),500);
})();
