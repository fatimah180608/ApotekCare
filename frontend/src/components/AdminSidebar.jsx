import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menus = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '⌂', desc: 'Ringkasan toko' },
  { to: '/admin/products', label: 'Produk & Stok', icon: '▦', desc: 'Kelola inventori' },
  { to: '/admin/orders', label: 'Pesanan', icon: '▤', desc: 'Pembayaran & order' }
];

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-inner">
        <div className="admin-brand">
          <Link to="/admin/dashboard" className="admin-brand-link">
            <span className="admin-brand-mark">+</span>
            <span>
              <strong>ApotekCare</strong>
              <small>Admin Console</small>
            </span>
          </Link>
        </div>

        <div className="admin-profile-card">
          <div className="admin-avatar">{user?.name?.charAt(0).toUpperCase() || 'A'}</div>
          <div className="admin-profile-copy">
            <strong>{user?.name || 'Admin'}</strong>
            <span>Administrator</span>
          </div>
          <span className="admin-online-dot" title="Online" />
        </div>

        <div className="admin-menu-label">MENU UTAMA</div>
        <nav className="admin-nav" aria-label="Navigasi admin">
          {menus.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className={`admin-nav-link ${pathname === m.to ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{m.icon}</span>
              <span className="admin-nav-copy"><b>{m.label}</b><small>{m.desc}</small></span>
              <span className="admin-nav-arrow">›</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-spacer" />

        <div className="admin-bottom-panel">
          <Link
            to="/admin/settings"
            className={`admin-bottom-link ${pathname === '/admin/settings' ? 'active' : ''}`}
          >
            <span className="admin-bottom-icon">⚙</span>
            <span><b>Setting</b><small>Pengaturan akun</small></span>
          </Link>
          <button onClick={handleLogout} className="admin-bottom-link logout">
            <span className="admin-bottom-icon">↪</span>
            <span><b>Logout</b><small>Keluar dari admin</small></span>
          </button>
        </div>
      </div>
    </aside>
  );
}
