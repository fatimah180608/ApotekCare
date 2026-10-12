import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import ProductCard from '../components/ProductCard';
import { api } from '../api/fetch';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const categoryStyles = ['cat-purple','cat-blue','cat-green','cat-orange','cat-sky','cat-pink'];
const categoryIcons = ['💊','😷','🧴','🧼','🩺','👶'];

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    Promise.all([api('/products'), api('/products/categories'), api('/cart')])
      .then(([p, c, cart]) => { setProducts(p.slice(0, 6)); setCategories(c); setCartCount(cart.reduce((s, i) => s + i.quantity, 0)); })
      .catch((e) => showToast(e.message, 'error'));
  }, [showToast]);

  const handleAdd = async (product) => {
    try { await api('/cart', { method: 'POST', body: JSON.stringify({ productId: product.id, quantity: 1 }) }); setCartCount(v => v + 1); showToast(`${product.name} masuk keranjang`, 'success'); }
    catch (e) { showToast(e.message, 'error'); }
  };

  const submitSearch = (e) => { if (e.key === 'Enter' && search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`); };

  return <div className="customer-app">
    <CustomerSidebar />
    <main className="customer-main">
      <div className="page-toolbar">
        <div className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={submitSearch} placeholder="Cari obat, produk kesehatan, atau kategori..." /></div>
        <Link to="/cart" className="toolbar-cart">🛒{cartCount > 0 && <b>{cartCount}</b>}</Link>
        <Link to="/profile" className="toolbar-user"><span>{user?.name?.charAt(0)?.toUpperCase() || 'F'}</span><em>{user?.name?.split(' ')[0] || 'Fatim'}</em>⌄</Link>
      </div>

      <div className="dashboard-content">
        <section className="modern-hero">
          <div className="hero-copy">
            <div className="hero-pill">ApotekCare <span># SehatSetiapHari</span></div>
            <h1>Obat asli, produk kesehatan <span>lengkap, harga terjangkau</span></h1>
            <p>Dukung hidup sehat Anda dan keluarga dengan produk berkualitas dari ApotekCare.</p>
            <div className="hero-features"><span>🛡️ Obat Original & Terpercaya</span><span>🚚 Pengiriman Cepat & Aman</span><span>🔒 Transaksi Aman</span></div>
            <Link to="/products" className="hero-button">Belanja Sekarang <span>→</span></Link>
          </div>
          <div className="hero-visual"><div className="hero-orb"></div><img className="hero-photo" src="/images/hero-pharmacist.png" alt="Apoteker ApotekCare" /></div>
        </section>

        <section className="section-block">
          <div className="section-heading"><h2>✚ Kategori Pilihan</h2><Link to="/products">Lihat Semua →</Link></div>
          <div className="category-grid">
            {categories.map((c, i) => <Link key={c.id} to={`/products?category=${c.id}`} className={`category-card ${categoryStyles[i % categoryStyles.length]}`}><span>{categoryIcons[i % categoryIcons.length]}</span><b>{c.name}</b></Link>)}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading"><h2>🔥 Produk Terlaris</h2><Link to="/products">Lihat Semua →</Link></div>
          <div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p} onAdd={handleAdd} />)}</div>
        </section>

        <section className="benefit-grid">
          <div><span>🛡️</span><b>100% Produk Original</b><small>Kami menyediakan produk kesehatan berkualitas.</small></div>
          <div><span>🚚</span><b>Pengiriman Cepat</b><small>Pesanan sampai di tangan Anda dengan aman.</small></div>
          <div><span>🎧</span><b>Customer Service 24 Jam</b><small>Siap membantu Anda kapan saja.</small></div>
          <div><span>♥</span><b>Mudah & Aman</b><small>Transaksi aman dengan berbagai metode.</small></div>
        </section>
      </div>
    </main>
  </div>;
}
