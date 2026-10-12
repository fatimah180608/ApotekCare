import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { api } from '../api/fetch';
import { useToast } from '../context/ToastContext';

const money = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

export default function AdminProducts() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [form, setForm] = useState({ id: null, name: '', description: '', price: '', stock: '', categoryId: 1, image: '', unit: '' });
  const [show, setShow] = useState(false);
  const [restock, setRestock] = useState({ show: false, product: null, amount: '' });

  const load = async () => {
    const [p, c] = await Promise.all([api('/products'), api('/products/categories')]);
    setProducts(p); setCategories(c);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => products.filter((p) => {
    const q = query.trim().toLowerCase();
    return (!q || `${p.name} ${p.category?.name || ''}`.toLowerCase().includes(q)) && (category === 'all' || String(p.categoryId) === String(category));
  }), [products, query, category]);

  const lowStock = products.filter((p) => p.stock <= 10).length;
  const totalStock = products.reduce((s, p) => s + Number(p.stock || 0), 0);
  const openAdd = () => { setForm({ id: null, name: '', description: '', price: '', stock: '', categoryId: categories[0]?.id || 1, image: '', unit: '' }); setShow(true); };
  const openEdit = (p) => { setForm({ id: p.id, name: p.name, description: p.description || '', price: p.price, stock: p.stock, categoryId: p.categoryId, image: p.image || '', unit: p.unit || '' }); setShow(true); };
  const handleSubmit = async (e) => { e.preventDefault(); try { await api(form.id ? `/products/${form.id}` : '/products', { method: form.id ? 'PUT' : 'POST', body: JSON.stringify(form) }); showToast(form.id ? 'Produk diperbarui ✅' : 'Produk ditambahkan ✅', 'success'); setShow(false); load(); } catch (err) { showToast(err.message, 'error'); } };
  const handleDelete = async (id) => { if (!confirm('Yakin hapus produk ini?')) return; try { await api(`/products/${id}`, { method: 'DELETE' }); showToast('Produk dihapus', 'success'); load(); } catch (err) { showToast(err.message, 'error'); } };
  const handleRestock = async (e) => { e.preventDefault(); try { await api(`/products/${restock.product.id}/restock`, { method: 'PATCH', body: JSON.stringify({ amount: Number(restock.amount) }) }); showToast(`Stok ${restock.product.name} bertambah 📦`, 'success'); setRestock({ show: false, product: null, amount: '' }); load(); } catch (err) { showToast(err.message, 'error'); } };

  return <div className="admin-layout"><AdminSidebar /><main className="admin-main">
    <header className="admin-topbar compact">
      <div><span className="admin-eyebrow">INVENTORY / PRODUCT CENTER</span><h1>Produk & Stok</h1><p>Kelola katalog, harga, kategori, dan ketersediaan produk.</p></div>
      <button onClick={openAdd} className="btn-primary">＋ Tambah Produk</button>
    </header>

    <section className="admin-stat-grid">
      <div className="admin-stat-card violet"><span className="stat-icon">▦</span><small>Produk Aktif</small><strong>{products.length}</strong><em>Semua katalog</em></div>
      <div className="admin-stat-card blue"><span className="stat-icon">#</span><small>Total Stok</small><strong>{totalStock}</strong><em>Unit tersedia</em></div>
      <div className="admin-stat-card orange"><span className="stat-icon">!</span><small>Stok Menipis</small><strong>{lowStock}</strong><em>≤ 10 unit</em></div>
      <div className="admin-stat-card green"><span className="stat-icon">✓</span><small>Kategori</small><strong>{categories.length}</strong><em>Kategori produk</em></div>
    </section>

    <section className="admin-panel product-admin-panel">
      <div className="product-admin-toolbar">
        <div className="admin-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama produk atau kategori..." /></div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">Semua kategori</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </div>
      <div className="product-admin-table-wrap"><table className="product-admin-table"><thead><tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Status</th><th>Aksi</th></tr></thead><tbody>
        {filtered.map((p) => <tr key={p.id}>
          <td><div className="admin-product-cell"><img src={p.image} alt="" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} /><span><b>{p.name}</b><small>{p.unit || 'Produk kesehatan'}</small></span></div></td>
          <td><span className="category-tag">{p.category?.name || '-'}</span></td><td><b>{money(p.price)}</b></td>
          <td><span className={`stock-number ${p.stock <= 10 ? 'low' : p.stock <= 50 ? 'medium' : 'good'}`}>{p.stock}</span></td>
          <td><span className={`inventory-status ${p.stock <= 0 ? 'danger' : p.stock <= 10 ? 'warning' : 'ok'}`}>{p.stock <= 0 ? 'Habis' : p.stock <= 10 ? 'Menipis' : 'Tersedia'}</span></td>
          <td><div className="table-actions"><button onClick={() => setRestock({ show: true, product: p, amount: '' })} className="action-restock">＋ Stok</button><button onClick={() => openEdit(p)} className="action-edit">Edit</button><button onClick={() => handleDelete(p.id)} className="action-delete">Hapus</button></div></td>
        </tr>)}
      </tbody></table>{filtered.length === 0 && <div className="admin-empty large">Produk tidak ditemukan.</div>}</div>
    </section>

    {show && <div className="admin-modal-backdrop"><div className="admin-modal"><div className="admin-modal-head"><div><span className="panel-kicker">PRODUCT FORM</span><h2>{form.id ? 'Edit Produk' : 'Tambah Produk'}</h2></div><button onClick={() => setShow(false)}>×</button></div><form onSubmit={handleSubmit} className="admin-form">
      <label>Nama Produk<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <div className="form-two"><label>Harga<input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label><label>Stok<input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></label></div>
      <div className="form-two"><label>Kategori<select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Satuan<input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Tablet / Botol" /></label></div>
      <label>Gambar<input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/images/Nama Produk.png" /></label>
      <label>Deskripsi<textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      <div className="modal-actions"><button type="button" onClick={() => setShow(false)} className="modal-cancel">Batal</button><button className="btn-primary">{form.id ? 'Simpan Perubahan' : 'Tambah Produk'}</button></div>
    </form></div></div>}

    {restock.show && <div className="admin-modal-backdrop"><div className="admin-modal small"><div className="admin-modal-head"><div><span className="panel-kicker">STOCK CONTROL</span><h2>Tambah Stok</h2></div><button onClick={() => setRestock({ show: false, product: null, amount: '' })}>×</button></div><p className="modal-note"><b>{restock.product?.name}</b><br />Stok saat ini <strong>{restock.product?.stock}</strong> unit.</p><form onSubmit={handleRestock} className="admin-form"><label>Jumlah tambahan<input autoFocus required min="1" type="number" value={restock.amount} onChange={(e) => setRestock({ ...restock, amount: e.target.value })} /></label><div className="modal-actions"><button type="button" onClick={() => setRestock({ show: false, product: null, amount: '' })} className="modal-cancel">Batal</button><button className="btn-primary">Tambah Stok</button></div></form></div></div>}
  </main></div>;
}
