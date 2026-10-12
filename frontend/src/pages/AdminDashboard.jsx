import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { api } from '../api/fetch';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const money = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
const statusClass = (s) => ({
  Selesai: 'is-success', Dikirim: 'is-info', Diproses: 'is-warning',
  'Siap Diambil': 'is-cyan', Dibatalkan: 'is-danger'
}[s] || 'is-neutral');

export default function AdminDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [statsData, productsData] = await Promise.all([api('/orders/stats'), api('/products')]);
      setStats(statsData);
      setInventoryProducts(Array.isArray(productsData) ? productsData : []);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Gagal memperbarui dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /> Memuat dashboard...</div>;
  if (!stats) return <div className="admin-loading error">Gagal memuat statistik.</div>;

  const maxSales = Math.max(...stats.salesChart.map((d) => d.total), 1);
  const maxTopQty = Math.max(...stats.topProducts.map((p) => p._sum.quantity || 1), 1);
  const chartTotal = stats.salesChart.reduce((s, d) => s + Number(d.total || 0), 0);
  const hasSales = chartTotal > 0;
  const inventoryRows = stats.topProducts.length > 0
    ? stats.topProducts.map((tp) => ({ ...tp, quantity: Number(tp._sum.quantity || 0) }))
    : [...inventoryProducts].sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0)).slice(0, 6).map((product) => ({
        productId: product.id, product, quantity: 0
      }));
  const maxInventory = Math.max(...inventoryRows.map((p) => stats.topProducts.length ? p.quantity : Number(p.product?.stock || 0)), 1);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">APOTEKCARE / OVERVIEW</span>
            <h1>Dashboard Admin</h1>
            <p>Selamat datang kembali, <b>{user?.name || 'Admin'}</b>. Pantau toko dari satu tempat.</p>
            {lastRefreshed && <small className="last-refreshed">Terakhir diperbarui {lastRefreshed.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</small>}
          </div>
          <div className="admin-top-actions">
            <button
              className={`admin-refresh-btn ${loading ? 'is-loading' : ''}`}
              onClick={load}
              disabled={loading}
              title="Muat ulang data dashboard"
            >
              <span className="refresh-symbol">↻</span>
              <span>{loading ? 'Memuat...' : 'Refresh'}</span>
            </button>
            <Link to="/admin/orders" className="admin-top-user">
              <span className="admin-top-avatar">{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
              <span><b>{user?.name || 'Admin'}</b><small>Administrator</small></span>
            </Link>
          </div>
        </header>

        {stats.pendingPayments > 0 && (
          <Link to="/admin/orders" className="admin-alert-card">
            <span className="admin-alert-icon">!</span>
            <span className="admin-alert-copy"><b>{stats.pendingPayments} pembayaran menunggu verifikasi</b><small>Periksa bukti/metode pembayaran sebelum pesanan diproses.</small></span>
            <span className="admin-alert-arrow">Lihat pesanan →</span>
          </Link>
        )}

        <section className="admin-stat-grid">
          <div className="admin-stat-card violet"><span className="stat-icon">▦</span><small>Total Produk</small><strong>{stats.totalProducts}</strong><em>Produk aktif di katalog</em></div>
          <div className="admin-stat-card blue"><span className="stat-icon">▤</span><small>Total Pesanan</small><strong>{stats.totalOrders}</strong><em>{stats.pendingPayments} perlu perhatian</em></div>
          <div className="admin-stat-card green"><span className="stat-icon">◎</span><small>Pelanggan</small><strong>{stats.totalCustomers}</strong><em>Akun customer terdaftar</em></div>
          <div className="admin-stat-card orange"><span className="stat-icon">Rp</span><small>Pendapatan</small><strong className="money">{money(stats.totalRevenue)}</strong><em>Total transaksi selesai</em></div>
        </section>

        <section className="admin-content-grid">
          <div className="admin-panel sales-panel">
            <div className="admin-panel-head"><div><span className="panel-kicker">PERFORMA</span><h2>Penjualan 7 Hari Terakhir</h2><p className="panel-subtitle">Ringkasan transaksi yang sudah diproses</p></div><span className="panel-total">{money(chartTotal)}</span></div>
            <div className="sales-chart">
              <div className="sales-grid-lines" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
              {stats.salesChart.map((d, i) => (
                <div className={`sales-bar-col ${Number(d.total || 0) === maxSales && Number(d.total || 0) > 0 ? 'peak' : ''}`} key={i}>
                  <span className="sales-value">{Number(d.total || 0) > 0 ? money(d.total) : 'Rp 0'}</span>
                  <div className="sales-bar-track"><div className={`sales-bar ${Number(d.total || 0) === 0 ? 'is-zero' : ''}`} style={{ height: `${Number(d.total || 0) > 0 ? Math.max((d.total / maxSales) * 100, 12) : 3}%` }} /></div>
                  <small>{d.label}</small>
                </div>
              ))}
            </div>
            {!hasSales && <div className="sales-note">Belum ada penjualan pada 7 hari terakhir. Grafik akan otomatis terisi setelah transaksi diproses.</div>}
          </div>

          <div className="admin-panel recent-panel">
            <div className="admin-panel-head"><div><span className="panel-kicker">AKTIVITAS</span><h2>Pesanan Terbaru</h2></div><Link to="/admin/orders">Semua →</Link></div>
            <div className="recent-list">
              {stats.recentOrders.length === 0 && <div className="admin-empty">Belum ada pesanan.</div>}
              {stats.recentOrders.map((o) => (
                <Link key={o.id} to={`/orders/${o.id}`} className="recent-order">
                  <span className="recent-order-icon">🛍</span>
                  <span className="recent-order-copy"><b>#APC{o.id.toString().padStart(6, '0')}</b><small>{o.user?.name || 'Customer'}</small></span>
                  <span className={`status-pill ${statusClass(o.status)}`}>{o.status}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-panel top-products-panel">
          <div className="admin-panel-head"><div><span className="panel-kicker">INVENTORI</span><h2>{stats.topProducts.length ? 'Produk Terlaris' : 'Ringkasan Inventori'}</h2><p className="panel-subtitle">{stats.topProducts.length ? 'Produk dengan jumlah terjual tertinggi' : 'Produk dengan stok paling perlu diperhatikan'}</p></div><Link to="/admin/products">Kelola produk →</Link></div>
          {inventoryRows.length === 0 ? <div className="inventory-empty"><span>▦</span><div><b>Belum ada data inventori</b><small>Produk akan muncul setelah data katalog tersedia.</small></div></div> : (
            <div className="top-product-list">
              {inventoryRows.map((tp, i) => {
                const value = stats.topProducts.length ? tp.quantity : Number(tp.product?.stock || 0);
                return (
                  <div key={tp.productId} className="top-product-row">
                    <span className="rank">{i + 1}</span>
                    <img src={tp.product?.image || '/images/Paracetamol 500mg.png'} alt={tp.product?.name || 'Produk'} onError={(e) => { e.currentTarget.src = '/images/Paracetamol 500mg.png'; }} />
                    <div className="top-product-copy"><b>{tp.product?.name || 'Produk'}</b><div className="inventory-progress"><span style={{ width: `${Math.max((value / maxInventory) * 100, 6)}%` }} /></div></div>
                    <strong>{stats.topProducts.length ? value : Number(tp.product?.stock || 0)} <small>{stats.topProducts.length ? 'terjual' : 'stok'}</small></strong>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
