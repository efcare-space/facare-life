// FaCare Life · phần dùng chung cho App công khai và Dashboard.
// Cấu hình: window.EFC_URL (máy chủ EF-ID dùng chung), window.EFL_URL (máy chủ FaCare Life). ?db=thu → kho thử.
(function () {
  const q = new URLSearchParams(location.search), THU = q.get('db') === 'thu' ? '?db=thu' : '';
  const EFC = (window.EFC_URL || '') + THU, EFL = (window.EFL_URL || '') + THU;
  const KHOA = 'efl-phien' + (THU ? '-thu' : '');
  const doc = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const ghi = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };
  async function post(url, body) {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) });
    return r.json();
  }
  const F = window.FL = {
    THU: !!THU,
    phien: () => doc(KHOA),
    // Đăng nhập, tạo tài khoản ở máy chủ EF-ID (không qua máy chủ FaCare Life, FaCare Life không giữ PIN)
    async dangNhap(sdt, pin) { const r = await post(EFC, { fn: 'idDangNhap', args: [sdt, pin, navigator.userAgent.slice(0, 60)] }); const d = r.data || r; if (!r.ok || !d.ok) throw new Error(d.msg || r.error || 'Không đăng nhập được.'); ghi(KHOA, d.phien); return d; },
    async taoTaiKhoan(p) { const r = await post(EFC, { fn: 'idDangKy', args: [Object.assign({ thietBi: navigator.userAgent.slice(0, 60), kenh: 'facare_life' }, p)] }); const d = r.data || r; if (!r.ok || !d.ok) throw new Error(d.msg || r.error || 'Không tạo được tài khoản.'); ghi(KHOA, d.phien); return d; },
    dangXuat() { const p = doc(KHOA); ghi(KHOA, null); if (p) post(EFC, { fn: 'idDangXuat', args: [p] }).catch(() => {}); },
    async goi(fn, ...args) {
      const r = await post(EFL, { fn, args, phien: doc(KHOA) });
      if (r.canDangNhap) { ghi(KHOA, null); throw Object.assign(new Error(r.error), { canDangNhap: true }); }
      if (!r.ok) throw new Error(r.error || 'Có lỗi.');
      return r.data;
    },
    tien: (n) => (Math.round(Number(n) || 0)).toLocaleString('vi-VN') + 'đ',
    esc: (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
    ngay: (iso) => (iso ? String(iso).slice(0, 10).split('-').reverse().join('/') : ''),
    TT: { moi: 'Chờ thanh toán', da_thu: 'Đã thu', da_giao: 'Đã giao', da_kich_hoat: 'Đã kích hoạt', huy: 'Đã huỷ', tra_lai: 'Trả lại' },
    bao(el, msg, tot) { el.innerHTML = msg ? `<div class="bao ${tot ? 'tot' : ''}">${F.esc(msg)}</div>` : ''; },
    logo: `<svg viewBox="0 0 100 100" aria-hidden="true"><path fill="#009574" d="M53 47c0-26 15-39 43-43 2 27-7 43-31 43z"/><path fill="#009574" d="M4 96c2-26 17-42 44-44v29c0 9-6 15-15 15z"/><path fill="#233A77" d="M52 52h44c0 27-16 44-44 44z"/></svg>`,
  };
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
