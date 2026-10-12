import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Selamat datang, ${user.name}! 👋`, 'success');
      if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-violet-600 via-violet-500 to-cyan-500 relative overflow-hidden">
      {/* DEKORASI */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-float"></div>

      {/* KIRI - BRANDING */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center text-white p-12 relative z-10">
        <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center text-4xl font-bold mb-6 shadow-2xl">
          ✚
        </div>
        <h1 className="text-4xl font-bold mb-3">ApotekCare</h1>
        <p className="text-white/80 text-center max-w-md mb-8">
          Platform apotek online terpercaya. Obat asli, pengiriman cepat, harga terjangkau.
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-4 py-2 rounded-xl">
            <span>✅</span> <span className="text-sm">100% Obat Original</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-4 py-2 rounded-xl">
            <span>🚚</span> <span className="text-sm">Pengiriman 30 menit - 3 hari</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-4 py-2 rounded-xl">
            <span>💳</span> <span className="text-sm">COD, QRIS, e-Wallet, Transfer</span>
          </div>
        </div>
      </div>

      {/* KANAN - FORM */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <div className="md:hidden text-center mb-6">
            <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-3">
              ✚
            </div>
            <h2 className="text-2xl font-bold text-dark">ApotekCare</h2>
          </div>

          <h2 className="text-2xl font-bold text-dark mb-2">Selamat Datang 👋</h2>
          <p className="text-gray-500 text-sm mb-6">Masuk untuk melanjutkan</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
              <input
                type="email" placeholder="nama@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
              <input
                type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-4 py-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full gradient-purple text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-primary/40 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun? <Link to="/register" className="text-primary font-semibold hover:underline">Daftar</Link>
          </p>

          <div className="mt-6 text-xs text-gray-400 text-center border-t border-violet-100 pt-4">
            <p className="font-semibold mb-1 text-gray-500">🔑 Demo Login</p>
            <p>Admin: <b>admin@apotekcare.com</b> / <b>admin123</b></p>
            <p>Customer: <b>customer@apotekcare.com</b> / <b>customer123</b></p>
          </div>
        </div>
      </div>
    </div>
  );
}