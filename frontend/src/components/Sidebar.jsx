import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isCustomer = user?.role === 'customer';

  const menus = [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/products', label: 'Kategori Produk', icon: '📦' },
    { to: '/orders', label: 'Riwayat Pesanan', icon: '🧾' }
  ];

  if (isCustomer) {
    menus.push({ to: '/cart', label: 'Keranjang', icon: '🛒' });
  }

  menus.push({ to: '/profile', label: 'Profil', icon: '👤' });

  if (user?.role === 'admin') {
    menus.push({ to: '/admin/products', label: 'Kelola Produk', icon: '⚙️' });
    menus.push({ to: '/admin/orders', label: 'Kelola Pesanan', icon: '📋' });
  }

  return (
    <aside className="w-56 bg-white min-h-[calc(100vh-60px)] border-r px-4 py-6">
      <p className="text-xs text-gray-400 uppercase mb-3 px-2">Menu</p>
      <ul className="space-y-1">
        {menus.map((m) => (
          <li key={m.to}>
            <Link
              to={m.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                pathname === m.to
                  ? 'bg-primary-light text-primary font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{m.icon}</span> {m.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}