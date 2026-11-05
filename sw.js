// FaCare Life · bộ nhớ đệm có phiên bản. Đổi PHIEN_BAN khi đưa bản mới lên.
const PHIEN_BAN = 'efl-0.2.0';
const TEP = ['./', 'index.html', 'quan-tri.html', 'bac-si.html', 'chung.js', 'chung.css', 'icon.svg', 'manifest.webmanifest', 'icon-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(PHIEN_BAN).then((c) => c.addAll(TEP)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== PHIEN_BAN).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // gọi máy chủ luôn đi mạng; không tạo đơn khi mất mạng
  e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(PHIEN_BAN).then((x) => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
