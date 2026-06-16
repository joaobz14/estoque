const CACHE = "estoque-v8";
const ASSETS = ["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",(e)=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));});
self.addEventListener("activate",(e)=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("message",(e)=>{if(e.data==="SKIP_WAITING")self.skipWaiting();});
self.addEventListener("fetch",(e)=>{
  if(e.request.method!=="GET")return;
  const req=e.request;const url=new URL(req.url);
  const isHTML=req.mode==="navigate"||req.destination==="document"||url.pathname.endsWith("/")||url.pathname.endsWith("index.html");
  if(isHTML){e.respondWith(fetch(req).then(res=>{const c=res.clone();caches.open(CACHE).then(ca=>ca.put("./index.html",c));return res;}).catch(()=>caches.match("./index.html").then(h=>h||caches.match("./"))));}
  else{e.respondWith(caches.match(req).then(h=>h||fetch(req)));}
});
