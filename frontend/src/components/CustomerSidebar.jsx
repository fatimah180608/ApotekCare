import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menus = [
  { to: '/dashboard', label: 'Beranda', icon: '⌂' },
  { to: '/products', label: 'Kategori', icon: '▦' },
  { to: '/cart', label: 'Keranjang', icon: '🛒' },
  { to: '/orders', label: 'Riwayat', icon: '◷' },
  { to: '/profile', label: 'Profil', icon: '♙' }
];

export default function CustomerSidebar() {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="customer-sidebar">
      <Link to="/dashboard" className="brand-lockup">
        <span className="brand-mark">✚</span>
        <span><b>Apotek<span>Care</span></b><small>Sehat Bersama, Hidup Lebih Baik</small></span>
      </Link>

      <div className="sidebar-scroll-area">
        <nav className="sidebar-nav">
          {menus.map((m) => {
            const active = pathname === m.to || (m.to === '/products' && pathname.startsWith('/products'));
            return <Link key={m.to} to={m.to} className={`side-link ${active ? 'active' : ''}`}>
              <span className="side-icon">{m.icon}</span><span>{m.label}</span>
            </Link>;
          })}
        </nav>

        <div className="sidebar-promo">
          <div className="promo-truck">🚚</div>
          <b>Pengiriman Cepat</b>
          <p>Pesanan diproses dengan aman dan dikirim tepat waktu.</p>
          <Link to="/orders" className="promo-track-btn">Lacak Pesanan <span>→</span></Link>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="mini-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'F'}</div>
        <div className="mini-user"><b>{user?.name?.split(' ')[0] || 'Fatim'}</b><small>Pelanggan</small></div>
        <button className="sidebar-logout" onClick={() => { logout(); navigate('/'); }} title="Logout">
          <span>↪</span><em>Logout</em>
        </button>
      </div>
    </aside>
  );
}
