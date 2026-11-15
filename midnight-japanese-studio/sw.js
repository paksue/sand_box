/* Offline shell for Midnight Japanese. Scope is limited to this folder. */
const CACHE="midnight-japanese-shell-2026-11-14-v2";
const CORE=["./","./index.html","./styles.css","./data.js","./app.js","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("midnight-japanese-shell-")&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",event=>{
  const request=event.request, url=new URL(request.url);
  if(request.method!=="GET"||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  event.respondWith(fetch(request).then(response=>{
    if(response.ok&&response.type!=="opaque"){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}
    return response;
  }).catch(async()=>{const match=await caches.match(request);if(match)return match;if(request.mode==="navigate")return caches.match("./index.html");return Response.error();}));
});