import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { api } from '../api/fetch';
import { useToast } from '../context/ToastContext';

const money = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
const statusClass = (s) => ({ Selesai: 'is-success', Dikirim: 'is-info', Diproses: 'is-warning', 'Siap Diambil': 'is-cyan', Dibatalkan: 'is-danger' }[s] || 'is-neutral');

export default function AdminOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [query, setQuery] = useState('');
  const load = () => api('/orders/all').then(setOrders).catch((e) => showToast(e.message, 'error'));
  useEffect(() => { load(); }, []);

  const confirmPayment = async (id) => {
    if (!confirm('Verifikasi pembayaran pesanan ini?')) return;
    try { await api(`/orders/${id}/confirm`, { method: 'PATCH' }); showToast('Pembayaran berhasil diverifikasi ✅', 'success'); load(); }
    catch (e) { showToast(e.message, 'error'); }
  };
  const cancelOrder = async (id) => {
    if (!confirm('Yakin batalkan pesanan ini?')) return;
    try { await api(`/orders/${id}/cancel`, { method: 'PATCH' }); showToast('Pesanan dibatalkan', 'success'); load(); }
    catch (e) { showToast(e.message, 'error'); }
  };
  const updateStatus = async (id, status) => {
    try { await api(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }); showToast('Status diperbarui', 'success'); load(); }
    catch (e) { showToast(e.message, 'error'); }
  };

  const counts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter((o) => o.status === 'Diproses' && o.paymentMethod !== 'COD' && !o.paymentConfirmed).length,
    Diproses: orders.filter((o) => o.status === 'Diproses').length,
    Dikirim: orders.filter((o) => o.status === 'Dikirim').length,
    'Siap Diambil': orders.filter((o) => o.status === 'Siap Diambil').length,
    Selesai: orders.filter((o) => o.status === 'Selesai').length,
    Dibatalkan: orders.filter((o) => o.status === 'Dibatalkan').length
  }), [orders]);

  const filtered = orders.filter((o) => {
    const matchFilter = filter === 'all' ? true : filter === 'pending' ? (o.status === 'Diproses' && o.paymentMethod !== 'COD' && !o.paymentConfirmed) : o.status === filter;
    const q = query.toLowerCase().trim();
    return matchFilter && (!q || `apc${o.id} ${o.user?.name || ''} ${o.user?.email || ''}`.toLowerCase().includes(q));
  });

  return (
    <div className="admin-layout"><AdminSidebar /><main className="admin-main">
      <header className="admin-topbar compact">
        <div><span className="admin-eyebrow">TRANSAKSI / ORDER CENTER</span><h1>Pesanan & Pembayaran</h1><p>Verifikasi pembayaran dan pantau proses setiap pesanan.</p></div>
        <button className="admin-refresh-btn" onClick={load}>↻ Refresh</button>
      </header>

      <div className="order-summary-grid">
        <div className="order-summary pending"><span>⏳</span><div><small>Menunggu verifikasi</small><strong>{counts.pending}</strong></div></div>
        <div className="order-summary"><span>📦</span><div><small>Diproses</small><strong>{counts.Diproses}</strong></div></div>
        <div className="order-summary"><span>🚚</span><div><small>Dikirim</small><strong>{counts.Dikirim}</strong></div></div>
        <div className="order-summary"><span>✓</span><div><small>Selesai</small><strong>{counts.Selesai}</strong></div></div>
      </div>

      <section className="admin-panel order-panel">
        <div className="order-toolbar">
          <div className="order-filters">
            {[['pending', `Menunggu (${counts.pending})`], ['all', `Semua (${counts.all})`], ['Diproses', `Diproses (${counts.Diproses})`], ['Dikirim', `Dikirim (${counts.Dikirim})`], ['Siap Diambil', `Diambil (${counts['Siap Diambil']})`], ['Selesai', `Selesai (${counts.Selesai})`]].map(([id, label]) => <button key={id} onClick={() => setFilter(id)} className={filter === id ? 'selected' : ''}>{label}</button>)}
          </div>
          <div className="admin-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari ID atau customer..." /></div>
        </div>

        <div className="admin-order-list">
          {filtered.map((o) => (
            <article key={o.id} className={`order-card ${!o.paymentConfirmed && o.paymentMethod !== 'COD' && o.status === 'Diproses' ? 'needs-review' : ''}`}>
              <div className="order-card-main">
                <div className="order-id-block"><span className="order-icon">🛍</span><div><b>#APC{o.id.toString().padStart(6, '0')}</b><small>{new Date(o.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</small></div></div>
                <div className="order-customer"><b>{o.user?.name || 'Customer'}</b><small>{o.user?.email || '-'}</small></div>
                <div className="order-payment"><span className="payment-method">{o.paymentMethod}</span><small>{o.paymentBank || (o.paymentMethod === 'COD' ? 'Bayar saat diterima' : 'Pembayaran online')}</small>{o.paymentCode && <small className="mono">{o.paymentCode}</small>}</div>
                <div className="order-total"><small>Total</small><b>{money(o.total)}</b></div>
                <span className={`status-pill ${statusClass(o.status)}`}>{o.status}</span>
              </div>
              <div className="order-card-footer">
                <span>{o.paymentConfirmed ? '✓ Pembayaran terverifikasi' : o.paymentMethod === 'COD' ? 'Bayar saat barang diterima' : '⚠ Pembayaran belum diverifikasi'}</span>
                <div className="order-actions">
                  {o.status === 'Diproses' && o.paymentMethod !== 'COD' && !o.paymentConfirmed && <button className="btn-verify" onClick={() => confirmPayment(o.id)}>✓ Verifikasi Pembayaran</button>}
                  {o.status === 'Diproses' && o.paymentMethod === 'COD' && <button className="btn-process" onClick={() => confirmPayment(o.id)}>→ Proses Pesanan</button>}
                  {o.status === 'Diproses' && <button className="btn-cancel" onClick={() => cancelOrder(o.id)}>Batalkan</button>}
                  {['Dikirim', 'Siap Diambil'].includes(o.status) && <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}><option>Dikirim</option><option>Siap Diambil</option><option>Selesai</option></select>}
                  <Link to={`/orders/${o.id}`} className="btn-detail">Detail →</Link>
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <div className="admin-empty large">Tidak ada pesanan pada filter ini.</div>}
        </div>
      </section>
    </main></div>
  );
}
