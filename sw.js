// FaCare Life · bộ nhớ đệm có phiên bản. Đổi PHIEN_BAN khi đưa bản mới lên.
const PHIEN_BAN = 'efl-0.5.0';
const TEP = ['./', 'index.html', 'quan-tri.html', 'bac-si.html', 'chung.js?v=0.5.0', 'chung.css?v=0.5.0', 'icon.svg', 'manifest.webmanifest', 'icon-192.png', 'cai-dat.html', 'gioi-thieu.html', 'banner/vali.png', 'banner/goi.png', 'banner/ctv.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(PHIEN_BAN).then((c) => c.addAll(TEP)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== PHIEN_BAN).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // gọi máy chủ luôn đi mạng; không tạo đơn khi mất mạng
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((r) => { const c = r.clone(); caches.open(PHIEN_BAN).then((x) => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
// Thông báo đẩy (GĐ2 mới gửi; GĐ0 chỉ lưu đăng ký). Nội dung không chứa dữ liệu y khoa.
self.addEventListener('push', (e) => { let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { tieuDe: 'FaCare Life', noiDung: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.tieuDe || 'FaCare Life', { body: d.noiDung || '', icon: 'icon-192.png', badge: 'icon-192.png', data: { url: d.url || './' } })); });
self.addEventListener('notificationclick', (e) => { e.notification.close(); e.waitUntil(self.clients.openWindow((e.notification.data && e.notification.data.url) || './')); });
