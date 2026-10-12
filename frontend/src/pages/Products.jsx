import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import ProductCard from '../components/ProductCard';
import { api } from '../api/fetch';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Products() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(params.get('search') || '');
  const [cartCount, setCartCount] = useState(0);
  const activeCat = params.get('category') || '';

  useEffect(() => { Promise.all([api('/products/categories'), api('/cart')]).then(([c, cart]) => { setCategories(c); setCartCount(cart.reduce((s, i) => s + i.quantity, 0)); }).catch(e => showToast(e.message, 'error')); }, [showToast]);
  useEffect(() => { const q = new URLSearchParams(); if (activeCat) q.set('category', activeCat); if (search) q.set('search', search); api(`/products?${q}`).then(setProducts).catch(e => showToast(e.message, 'error')); }, [activeCat, search, showToast]);

  const handleAdd = async (product) => { try { await api('/cart', { method: 'POST', body: JSON.stringify({ productId: product.id, quantity: 1 }) }); setCartCount(v => v + 1); showToast(`${product.name} masuk keranjang`, 'success'); } catch (e) { showToast(e.message, 'error'); } };
  const chooseCategory = id => { if (id) setParams({ category: String(id), ...(search ? { search } : {}) }); else setParams(search ? { search } : {}); };

  return <div className="customer-app"><CustomerSidebar /><main className="customer-main">
    <div className="page-toolbar"><div className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari obat, produk kesehatan, atau kategori..." /></div><Link to="/cart" className="toolbar-cart">🛒{cartCount > 0 && <b>{cartCount}</b>}</Link><Link to="/profile" className="toolbar-user"><span>{user?.name?.charAt(0)?.toUpperCase() || 'F'}</span><em>{user?.name?.split(' ')[0] || 'Fatim'}</em>⌄</Link></div>
    <div className="dashboard-content">
      <div className="products-title"><div><p className="eyebrow">ApotekCare Store</p><h1>Temukan Produk Kesehatan</h1><p>Pilih obat, vitamin, perawatan pribadi, dan alat kesehatan yang Anda butuhkan.</p></div><div className="result-count">{products.length} produk</div></div>
      <div className="category-filter"><button onClick={() => chooseCategory('')} className={!activeCat ? 'selected' : ''}>Semua</button>{categories.map(c => <button key={c.id} onClick={() => chooseCategory(c.id)} className={String(c.id) === activeCat ? 'selected' : ''}>{c.icon} {c.name}</button>)}</div>
      {products.length ? <div className="product-grid product-grid-large">{products.map(p => <ProductCard key={p.id} product={p} onAdd={handleAdd} />)}</div> : <div className="empty-state"><span>🔎</span><h3>Produk tidak ditemukan</h3><p>Coba kata kunci atau kategori lain.</p></div>}
    </div>
  </main></div>;
}
