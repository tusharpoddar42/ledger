var C='ledger-v26';
var ASSETS=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',function(e){ e.waitUntil(caches.open(C).then(function(c){return c.addAll(ASSETS);}).then(function(){return self.skipWaiting();})); });
self.addEventListener('activate',function(e){ e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==C)return caches.delete(k);}));}).then(function(){return self.clients.claim();})); });
self.addEventListener('fetch',function(e){
  var url=e.request.url;
  if(e.request.method!=='GET' || url.indexOf('script.google')>-1 || url.indexOf('googleusercontent')>-1) return; // let sync + writes hit the network
  e.respondWith(caches.open(C).then(function(c){ return c.match(e.request).then(function(cached){
    var net=fetch(e.request).then(function(resp){ if(resp&&resp.status===200&&resp.type==='basic') c.put(e.request,resp.clone()); return resp; }).catch(function(){ return cached||c.match('index.html'); });
    return cached||net;
  })); });
});
