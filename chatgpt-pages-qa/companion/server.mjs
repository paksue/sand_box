/**
 * Orbit Ask local companion. Node.js 22+; zero npm dependencies.
 * Open-source ChatGPT plan usage OAuth (authorization code + PKCE + OIDC).
 * OAuth tokens never leave this process. Browser uses only an ephemeral pairing key.
 * Docs: https://developers.openai.com/siwc/token-sharing-open-source
 */
import http from "node:http";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import {randomBytes,randomInt,randomUUID,createHash,createPublicKey,verify,timingSafeEqual} from "node:crypto";

const HOST="127.0.0.1";
const PORT=42815;
const ORIGIN_ALLOW=new Set(["https://paksue.github.io","http://127.0.0.1:5173","http://localhost:5173"]);
const AUTH="https://auth.openai.com";
const RESOURCE="https://api.openai.com/v1";
const AUTH_URL=AUTH+"/api/accounts/authorize";
const TOKEN_URL=AUTH+"/api/accounts/oauth/token";
const DIR=path.join(os.homedir(),".orbit-ask");
const FILE=path.join(DIR,"credentials.json");
const SCOPE="openid profile email offline_access resource.invoke chatgpt.tokens.use.direct";
const PAIR_CODE=String(randomInt(100000,1000000));
let failedPairs=0;
let pairLockedUntil=0;
const PAIR_TOKEN=randomBytes(32).toString("hex");
let credentials;
let pending=null;
let refreshInFlight=null;
const allowedHost=(req)=>(req.headers.host||"")===HOST+":"+PORT;
const b64=(buf)=>Buffer.from(buf).toString("base64url");
const random=(length=32)=>b64(randomBytes(length));
const hashed=(value)=>b64(createHash("sha256").update(value).digest());
const equal=(x,y)=>{const a=Buffer.from(String(x)),b=Buffer.from(String(y));return a.length===b.length&&timingSafeEqual(a,b);};
const now=()=>Math.floor(Date.now()/1000);
async function load(){
  await fs.mkdir(DIR,{recursive:true,mode:0o700});
  try{credentials=JSON.parse(await fs.readFile(FILE,"utf8"));}
  catch(e){if(e.code!=="ENOENT")throw e;credentials={hostId:"urn:uuid:"+randomUUID(),profile:null};await save();}
  if(!credentials.hostId)throw Error("Credentials file missing host identifier");
}
async function save(){
  const tmp=FILE+"."+process.pid+".tmp";
  await fs.writeFile(tmp,JSON.stringify(credentials,null,2),{mode:0o600});
  await fs.rename(tmp,FILE);
  if(process.platform!=="win32")await fs.chmod(FILE,0o600);
}
function send(res,status,body,headers={}){
  if(res.writableEnded)return;
  res.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff",...headers});
  res.end(JSON.stringify(body));
}
async function json(req,limit=110000){
  let text="";
  for await(const chunk of req){text+=chunk.toString("utf8");if(text.length>limit)throw Error("Request too large");}
  try{return JSON.parse(text||"{}");}catch{throw Error("Invalid JSON");}
}
function scopes(profile){return String(profile?.scope||"").split(/\s+/).filter(Boolean);}
function sharing(){return Boolean(credentials.profile?.access_token&&scopes(credentials.profile).includes("chatgpt.tokens.use.direct"));}
function startSignIn(){
  if(pending&&Date.now()-pending.created<120000)throw Error("An authorization attempt is already in progress");
  const verifier=random(64),state=random(24),nonce=random(24);
  const registered=credentials.profile?.client_id;
  const clientId=registered||"dynamic_agent_client";
  const redirectUri="http://"+HOST+":"+PORT+"/auth/callback";
  pending={verifier,state,nonce,clientId,redirectUri,created:Date.now()};
  const params=new URLSearchParams({client_id:clientId,response_type:"code",redirect_uri:redirectUri,scope:SCOPE,resource:RESOURCE,state,nonce,code_challenge_method:"S256",code_challenge:hashed(verifier),ext_agent_host_id:credentials.hostId});
  if(registered){
    if(credentials.profile?.email)params.set("login_hint",credentials.profile.email);
  }else params.set("agent_name_hint","Orbit Ask");
  return AUTH_URL+"?"+params.toString();
}
async function exchange(fields){
  const response=await fetch(TOKEN_URL,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(fields),signal:AbortSignal.timeout(25000)});
  const result=await response.json().catch(()=>({error:"Invalid OAuth response"}));
  if(!response.ok)throw Error("OpenAI authorization failed: "+(result.error_description||result.error||response.status));
  return result;
}
async function oidcVerify(token,expectedClientId,expectedNonce){
  if(typeof token!=="string"||token.split(".").length!==3)throw Error("Invalid identity token");
  const [h,p,s]=token.split(".");
  const header=JSON.parse(Buffer.from(h,"base64url").toString());
  const payload=JSON.parse(Buffer.from(p,"base64url").toString());
  if(!["RS256","ES256"].includes(header.alg)||!header.kid)throw Error("Unsupported identity signature algorithm");
  const configRes=await fetch(AUTH+"/.well-known/openid-configuration",{signal:AbortSignal.timeout(12000)});
  if(!configRes.ok)throw Error("Cannot fetch OpenAI OIDC configuration");
  const config=await configRes.json();
  if(config.issuer!==AUTH||!String(config.jwks_uri||"").startsWith(AUTH+"/"))throw Error("Unexpected OIDC issuer");
  const jwksRes=await fetch(config.jwks_uri,{signal:AbortSignal.timeout(12000)});
  if(!jwksRes.ok)throw Error("Cannot retrieve identity signing keys");
  const jwks=await jwksRes.json();
  const jwk=(jwks.keys||[]).find(k=>k.kid===header.kid&&(!k.alg||k.alg===header.alg)&&(!k.use||k.use==="sig"));
  if(!jwk)throw Error("ID token signing key not found");
  const key=createPublicKey({key:jwk,format:"jwk"});
  const msg=Buffer.from(h+"."+p);
  const sig=Buffer.from(s,"base64url");
  const valid=header.alg==="RS256"?verify("RSA-SHA256",msg,key,sig):verify("sha256",msg,{key,dsaEncoding:"ieee-p1363"},sig);
  if(!valid)throw Error("ID token signature invalid");
  const audience=Array.isArray(payload.aud)?payload.aud:[payload.aud];
  const seconds=now();
  if(payload.iss!==AUTH||!audience.includes(expectedClientId)||payload.nonce!==expectedNonce||!payload.sub||!payload.exp||payload.exp<seconds-30||payload.iat>seconds+60||(payload.nbf&&payload.nbf>seconds+60))throw Error("ID token claim validation failed");
  return {subject:payload.sub,email:payload.email||"",name:payload.name||""};
}
async function callback(req,res,url){
  const attempt=pending;pending=null;
  if(!attempt||Date.now()-attempt.created>120000)throw Error("Authorization attempt expired");
  if(!equal(url.searchParams.get("state")||"",attempt.state))throw Error("OAuth state does not match");
  if(url.searchParams.get("error"))throw Error("Authorization declined: "+url.searchParams.get("error"));
  const code=url.searchParams.get("code"),issued=url.searchParams.get("client_id");
  if(!code)throw Error("Authorization callback missing code");
  const clientId=attempt.clientId==="dynamic_agent_client"?issued:attempt.clientId;
  if(!clientId||clientId==="dynamic_agent_client")throw Error("New client ID was not issued");
  if(attempt.clientId!=="dynamic_agent_client"&&issued&&issued!==clientId)throw Error("Client registration mismatch");
  if(attempt.clientId==="dynamic_agent_client"){
    // Keep the issued registration even if the token exchange fails.
    credentials.profile={client_id:clientId};
    await save();
  }
  const data=await exchange({grant_type:"authorization_code",client_id:clientId,code,code_verifier:attempt.verifier,redirect_uri:attempt.redirectUri,resource:RESOURCE});
  const identity=await oidcVerify(data.id_token,clientId,attempt.nonce);
  if(credentials.profile?.subject&&credentials.profile.subject!==identity.subject)throw Error("A different ChatGPT account was selected");
  if(!data.access_token||!data.refresh_token)throw Error("Missing required OAuth credentials");
  credentials.profile={...credentials.profile,...identity,client_id:clientId,access_token:data.access_token,refresh_token:data.refresh_token,id_token:data.id_token,scope:data.scope||"",expires_at:now()+Number(data.expires_in||3600),earliest_refresh_at:data.earliest_refresh_at||0};
  await save();
  const html="<!doctype html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'></head><body style='font:16px system-ui;background:#0c1022;color:#fff;display:grid;min-height:90vh;place-items:center;text-align:center'><main><h2>ChatGPT connected</h2><p>You can return to Orbit Ask. This window can be closed.</p><script>setTimeout(function(){window.close()},900)</script></main></body></html>";
  res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","Content-Security-Policy":"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'"});
  res.end(html);
}
async function ensureToken(){
  const p=credentials.profile;
  if(!p||!scopes(p).includes("chatgpt.tokens.use.direct"))throw Error("Connect and authorize ChatGPT plan usage first");
  if(p.access_token&&p.expires_at>now()+90)return p.access_token;
  if(refreshInFlight)return refreshInFlight;
  refreshInFlight=(async()=>{
    if(!p.refresh_token)throw Error("ChatGPT authorization expired; sign in again");
    const data=await exchange({grant_type:"refresh_token",client_id:p.client_id,refresh_token:p.refresh_token,resource:RESOURCE});
    if(!data.access_token||!data.refresh_token)throw Error("OpenAI refresh did not return new tokens");
    p.access_token=data.access_token;p.refresh_token=data.refresh_token;p.expires_at=now()+Number(data.expires_in||3600);
    if(data.id_token)p.id_token=data.id_token;
    if(data.scope)p.scope=data.scope;
    await save();return p.access_token;
  })();
  try{return await refreshInFlight;}finally{refreshInFlight=null;}
}
async function listModels(){
  const token=await ensureToken();
  const response=await fetch(RESOURCE+"/models",{headers:{Authorization:"Bearer "+token},signal:AbortSignal.timeout(20000)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(data.error?.message||data.error||"Model listing failed");
  return (data.models||data.data||[]).filter(m=>m.visibility==="list").map(m=>({slug:m.slug,display_name:m.display_name||m.slug})).filter(m=>m.slug);
}
function sse(res,value){res.write("data: "+JSON.stringify(value)+"\n\n");}
async function chat(req,res){
  const input=await json(req);
  if(!input||typeof input.model!=="string"||!/^[\w.-]{2,90}$/.test(input.model))throw Error("Select an available model");
  if(!Array.isArray(input.messages)||!input.messages.length||input.messages.length>30)throw Error("Invalid conversation history");
  const history=input.messages.map(item=>{
    if(!["user","assistant"].includes(item.role)||typeof item.content!=="string"||item.content.length>12000)throw Error("Invalid conversation message");
    return {role:item.role,content:item.content};
  });
  if(history.at(-1).role!=="user"||JSON.stringify(history).length>95000)throw Error("Conversation is too large");
  const token=await ensureToken();
  const upstream=await fetch(RESOURCE+"/responses",{
    method:"POST",
    headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},
    body:JSON.stringify({model:input.model,input:history,store:false,stream:true}),
    signal:AbortSignal.timeout(180000)
  });
  if(!upstream.ok){
    const detail=await upstream.json().catch(()=>({}));
    throw Error(detail.error?.message||detail.error?.code||"OpenAI returned HTTP "+upstream.status);
  }
  res.writeHead(200,{"Content-Type":"text/event-stream; charset=utf-8","Cache-Control":"no-cache, no-store","X-Accel-Buffering":"no"});
  const reader=upstream.body.getReader();const decoder=new TextDecoder();
  let buffer="",completed=false;
  try {
    while(true){
      const {done,value}=await reader.read();
      if(done)break;
      buffer+=decoder.decode(value,{stream:true});buffer=buffer.replace(/\r\n/g,"\n");
      let position;
      while((position=buffer.indexOf("\n\n"))>=0){
        const packet=buffer.slice(0,position);buffer=buffer.slice(position+2);
        const line=packet.split("\n").find(l=>l.startsWith("data:"));
        if(!line)continue;
        if(line.slice(5).trim()==="[DONE]")continue;
        let event;try{event=JSON.parse(line.slice(5));}catch{continue;}
        if(event.type==="response.output_text.delta")sse(res,{type:"delta",text:event.delta||""});
        if(event.type==="response.completed"){completed=true;sse(res,{type:"done"});}
        if(event.type==="response.failed"||event.type==="response.incomplete"||event.type==="error")throw Error(event.response?.error?.message||event.error?.message||event.type);
      }
    }
    if(!completed)throw Error("The model stream ended before response.completed");
  }catch(e){sse(res,{type:"error",error:e.message});}
  finally{res.end();await reader.cancel().catch(()=>{});}
}
function permitted(req){
  const origin=req.headers.origin;
  if(!origin||!ORIGIN_ALLOW.has(origin))return false;
  if(req.headers.authorization!=="Bearer "+PAIR_TOKEN)return false;
  return true;
}
async function main(){
  await load();
  const server=http.createServer(async(req,res)=>{
    try{
      if(!allowedHost(req))return send(res,403,{error:"Invalid host"});
      const origin=req.headers.origin;
      if(origin&&ORIGIN_ALLOW.has(origin)){
        res.setHeader("Access-Control-Allow-Origin",origin);
        res.setHeader("Vary","Origin");
        res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Private-Network","true");
      }
      if(req.method==="OPTIONS")return origin&&ORIGIN_ALLOW.has(origin)?send(res,204,{}):send(res,403,{error:"Origin not allowed"});
      const url=new URL(req.url,"http://"+HOST+":"+PORT);
      if(url.pathname==="/health"&&req.method==="GET")return send(res,200,{ok:true,name:"Orbit Ask Companion"});
      if(url.pathname==="/auth/callback"&&req.method==="GET"){
        try{return await callback(req,res,url);}catch(error){return send(res,400,{error:error.message});}
      }
      if(!origin||!ORIGIN_ALLOW.has(origin))return send(res,403,{error:"Origin not allowed"});
      if(url.pathname==="/api/pair"&&req.method==="POST"){
        const body=await json(req,1000);
        if(Date.now()<pairLockedUntil)return send(res,429,{error:"Too many pairing attempts; try again in a minute"});
        if(!equal(body.code||"",PAIR_CODE)){
          failedPairs++;
          if(failedPairs>=8){pairLockedUntil=Date.now()+60000;failedPairs=0;}
          return send(res,401,{error:"Incorrect pairing code"});
        }
        failedPairs=0;
        return send(res,200,{token:PAIR_TOKEN});
      }
      if(!permitted(req))return send(res,401,{error:"Invalid pairing token. Pair this browser again."});
      if(url.pathname==="/api/status"&&req.method==="GET")return send(res,200,{connected:Boolean(credentials.profile?.access_token),sharing:sharing(),email:credentials.profile?.email||null});
      if(url.pathname==="/api/auth/start"&&req.method==="POST")return send(res,200,{url:startSignIn()});
      if(url.pathname==="/api/models"&&req.method==="GET")return send(res,200,{models:await listModels()});
      if(url.pathname==="/api/chat"&&req.method==="POST")return await chat(req,res);
      if(url.pathname==="/api/logout"&&req.method==="POST"){
        if(credentials.profile){delete credentials.profile.access_token;delete credentials.profile.refresh_token;delete credentials.profile.id_token;await save();}
        return send(res,200,{ok:true});
      }
      return send(res,404,{error:"Not found"});
    }catch(error){console.error("Request failed:",error.message);if(!res.headersSent)send(res,400,{error:error.message});else {sse(res,{type:"error",error:error.message});res.end();}}
  });
  server.listen(PORT,HOST,()=>{console.log("\n  ORBIT ASK — local companion\n  -----------------------------------\n  Listening: http://"+HOST+":"+PORT+"\n  Pairing code: "+PAIR_CODE+"\n  Allowed site: https://paksue.github.io\n  Credentials: "+FILE+"\n  -----------------------------------\n  Keep this window open while chatting.\n");});
}
main().catch(e=>{console.error(e);process.exitCode=1;});
