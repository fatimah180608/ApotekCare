import { useEffect, useState } from 'react';
import CustomerSidebar from '../components/CustomerSidebar';
import AdminSidebar from '../components/AdminSidebar';
import { api } from '../api/fetch';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api('/auth/profile').then((u) =>
      setForm({
        name: u.name || '',
        email: u.email || '',
        phone: u.phone || '',
        address: u.address || ''
      })
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: form.name, phone: form.phone, address: form.address })
      });
      setMsg('Profil berhasil diperbarui ✅');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.message);
    }
  };

  const Sidebar = user?.role === 'admin' ? AdminSidebar : CustomerSidebar;

  return (
    <div className="flex">
      <Sidebar />
      <main className="customer-main profile-page">
        <h1 className="text-2xl font-bold mb-6">👤 Profil Saya</h1>
        <div className="bg-white rounded-2xl shadow-sm p-6 max-w-xl">
          {msg && <p className="text-sm text-primary mb-3 bg-primary-light p-2 rounded">{msg}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Nama</label>
              <input type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input type="email" value={form.email} disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="text-sm text-gray-500">No. Telp</label>
              <input type="text" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Alamat</label>
              <textarea value={form.address} rows={3}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <button className="btn-primary w-full">Simpan Perubahan</button>
          </form>
        </div>
      </main>
    </div>
  );
}