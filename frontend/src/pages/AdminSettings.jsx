import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminSettings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || 'Admin');
  const [notifications, setNotifications] = useState(true);

  const save = (e) => { e.preventDefault(); showToast('Pengaturan berhasil disimpan untuk sesi ini ✅', 'success'); };

  return <div className="admin-layout"><AdminSidebar /><main className="admin-main">
    <header className="admin-topbar compact"><div><span className="admin-eyebrow">SYSTEM / SETTINGS</span><h1>Pengaturan Admin</h1><p>Atur profil dan preferensi panel administrasi.</p></div></header>
    <div className="settings-grid">
      <section className="admin-panel settings-profile">
        <div className="settings-cover"><div className="settings-avatar">{name?.charAt(0).toUpperCase() || 'A'}</div></div>
        <div className="settings-body"><span className="panel-kicker">PROFIL ADMIN</span><h2>{user?.email || 'admin@apotekcare.com'}</h2><p>Akun dengan akses penuh untuk mengelola produk, stok, pesanan, dan pembayaran.</p><div className="settings-badge">✓ Administrator Aktif</div></div>
      </section>
      <section className="admin-panel settings-form-panel"><div className="settings-body"><span className="panel-kicker">PREFERENSI</span><h2>Pengaturan Dasar</h2><form className="admin-form" onSubmit={save}><label>Nama Admin<input value={name} onChange={(e) => setName(e.target.value)} /></label><label className="setting-toggle"><span><b>Notifikasi pesanan</b><small>Tampilkan pengingat ketika ada pembayaran yang menunggu verifikasi.</small></span><input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} /></label><button className="btn-primary">Simpan Pengaturan</button></form></div></section>
    </div>
  </main></div>;
}
