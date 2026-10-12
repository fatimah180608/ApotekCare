import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/fetch';

export default function Landing() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api('/products').then((p) => setProducts(p.slice(0, 6)));
    api('/products/categories').then(setCategories);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-5 max-w-7xl mx-auto">
        <span className="text-primary text-2xl font-bold flex items-center gap-2">
          <span className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center text-white">✚</span>
          ApotekCare
        </span>
        <div className="hidden md:flex gap-8 text-sm text-gray-600 font-medium">
          <a href="#" className="text-primary border-b-2 border-primary pb-1">Beranda</a>
          <a href="#produk" className="hover:text-primary transition">Produk</a>
          <a href="#tentang" className="hover:text-primary transition">Tentang</a>
          <a href="#kontak" className="hover:text-primary transition">Kontak</a>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-5 py-2 text-primary border-2 border-primary rounded-xl hover:bg-primary-light font-semibold transition">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2 gradient-purple text-white rounded-xl hover:opacity-90 font-semibold shadow-lg shadow-primary/30 transition">
            Daftar
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-10 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-gradient-to-r from-violet-100 to-cyan-100 text-primary px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
            🛡️ Apotek Online Terpercaya #1
          </span>
          <h1 className="text-5xl font-bold text-dark mb-4 leading-tight">
            Selamat datang di <br />
            <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
              #ApotekCare
            </span>
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Obat asli, produk kesehatan lengkap, harga terjangkau. Pesan sekarang, sampai dalam hitungan menit.
          </p>
          <div className="flex gap-4 mb-8 flex-wrap">
            <Link to="/login" className="gradient-purple text-white px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 shadow-xl shadow-primary/40 transition">
              Belanja Sekarang →
            </Link>
            <a href="#tentang" className="bg-white border-2 border-violet-200 text-primary px-8 py-3.5 rounded-xl font-semibold hover:bg-violet-50 transition">
              Pelajari Lebih →
            </a>
          </div>
          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-2xl font-bold text-primary">75+</p>
              <p className="text-gray-500 text-xs">Produk Kesehatan</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">5K+</p>
              <p className="text-gray-500 text-xs">Pelanggan Puas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-gray-500 text-xs">Layanan Online</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 gradient-purple rounded-3xl blur-3xl opacity-30"></div>
          <div className="relative bg-gradient-to-br from-violet-100 to-cyan-100 rounded-3xl h-96 overflow-hidden border-4 border-white shadow-2xl">
            <img
              src="/images/hero-pharmacist.png"
              alt="Apoteker"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div className="absolute top-6 right-6 gradient-purple text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl flex items-center gap-2">
            💚 Kesehatan Anda Prioritas
          </div>
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur px-5 py-3 rounded-2xl shadow-xl">
            <p className="text-xs text-gray-500">Pengiriman</p>
            <p className="font-bold text-primary">30 menit ⚡</p>
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section className="max-w-7xl mx-auto px-10 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="w-14 h-14 gradient-purple rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg">
              ✅
            </div>
            <h3 className="font-bold text-dark mb-2">Obat Original & Terpercaya</h3>
            <p className="text-sm text-gray-500">Semua produk bersertifikat BPOM, kualitas terjamin.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg">
              🚚
            </div>
            <h3 className="font-bold text-dark mb-2">Pengiriman Super Cepat</h3>
            <p className="text-sm text-gray-500">Instan 30 menit - 6 jam. JNE/J&T/Express 1-3 hari.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-violet-100 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg">
              💳
            </div>
            <h3 className="font-bold text-dark mb-2">Pembayaran Fleksibel</h3>
            <p className="text-sm text-gray-500">COD, QRIS, OVO, GoPay, DANA, Transfer Bank BNI/BRI/BCA/BSI/Mandiri.</p>
          </div>
        </div>
      </section>

      {/* KATEGORI */}
      <section className="max-w-7xl mx-auto px-10 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-2xl text-dark">🏷️ Kategori Populer</h2>
          <Link to="/login" className="text-primary text-sm font-semibold">Lihat Semua →</Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-white border border-violet-100 rounded-2xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition cursor-pointer">
              <div className="text-4xl mb-2">{c.icon}</div>
              <p className="text-xs text-gray-600 font-semibold">{c.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUK PILIHAN */}
      <section id="produk" className="max-w-7xl mx-auto px-10 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-2xl text-dark">⭐ Produk Pilihan</h2>
          <Link to="/login" className="text-primary text-sm font-semibold">Lihat Semua →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white border border-violet-100 rounded-2xl p-3 hover:shadow-xl hover:-translate-y-1 transition">
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-32 object-cover rounded-xl mb-2"
                  onError={(e) => { e.target.src = '/images/Paracetamol 500mg.png'; }}
                />
                <span className="absolute top-2 left-2 bg-gradient-to-r from-primary to-violet-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold shadow-lg">
                  {p.category?.name}
                </span>
              </div>
              <h3 className="font-semibold text-xs text-dark line-clamp-1">{p.name}</h3>
              <p className="text-[10px] text-gray-500 mb-1">{p.unit}</p>
              <p className="text-primary font-bold text-sm">Rp {p.price.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-gray-400 mb-2">⭐ 4.8 | Stok: {p.stock}</p>
              <Link
                to="/login"
                className="block text-center w-full gradient-purple text-white py-1.5 rounded-lg text-[11px] font-semibold hover:opacity-90 transition"
              >
                🛒 Beli Sekarang
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" className="max-w-7xl mx-auto px-10 py-16 text-center">
        <h2 className="font-bold text-3xl mb-4 text-dark">Mengapa Memilih ApotekCare?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Kami berkomitmen menyediakan obat asli dan produk kesehatan berkualitas untuk keluarga Indonesia.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl p-6 border border-violet-200">
            <div className="text-5xl mb-3">🏆</div>
            <h3 className="font-bold mb-2 text-dark">100% Original</h3>
            <p className="text-sm text-gray-600">Semua produk bersertifikat BPOM & terjamin keasliannya.</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 border border-cyan-200">
            <div className="text-5xl mb-3">⚡</div>
            <h3 className="font-bold mb-2 text-dark">Pengiriman Cepat</h3>
            <p className="text-sm text-gray-600">Estimasi 30 menit - 6 jam untuk kurir instan.</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200">
            <div className="text-5xl mb-3">💳</div>
            <h3 className="font-bold mb-2 text-dark">Pembayaran Fleksibel</h3>
            <p className="text-sm text-gray-600">COD, QRIS, e-wallet, transfer bank, kartu kredit.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-10 py-16">
        <div className="gradient-purple rounded-3xl p-10 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <h2 className="text-3xl font-bold mb-3 relative">Siap Belanja Obat Online?</h2>
          <p className="opacity-90 mb-6 relative">Daftar sekarang dan nikmati kemudahan belanja obat dari rumah.</p>
          <Link to="/register" className="inline-block bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-violet-50 transition shadow-lg relative">
            Daftar Gratis →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="kontak" className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center text-white font-bold">✚</span>
              <span className="text-xl font-bold">ApotekCare</span>
            </div>
            <p className="text-sm opacity-70">Platform apotek online terpercaya #1 di Indonesia.</p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Menu</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100">Beranda</a></li>
              <li><a href="#produk" className="hover:opacity-100">Produk</a></li>
              <li><a href="#tentang" className="hover:opacity-100">Tentang</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Kontak</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>📞 0800-1234-5678</li>
              <li>📧 support@apotekcare.com</li>
              <li>📍 Jl. Merdeka No. 12, Jakarta</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Ikuti Kami</h4>
            <div className="flex gap-3">
              <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/20">📱</span>
              <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/20">📷</span>
              <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/20">🐦</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm opacity-60">
          © 2026 ApotekCare. All rights reserved.
        </div>
      </footer>
    </div>
  );
}