import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import { api } from '../api/fetch';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const load = () => api('/cart').then(setCart);
  useEffect(() => { load(); }, []);

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    await api(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity: qty }) });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Hapus item ini?')) return;
    await api(`/cart/${id}`, { method: 'DELETE' });
    load();
  };

  const subtotal = cart.reduce((s, c) => s + c.product.price * c.quantity, 0);

  return (
    <div className="flex">
      <CustomerSidebar />
      <main className="customer-main cart-page">
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-lg font-bold">🛒 Keranjang</h1>
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm text-center py-12">
              <p className="text-4xl mb-3">🛒</p>
              <p className="text-gray-500 mb-4">Keranjang masih kosong</p>
              <Link to="/products" className="inline-block bg-primary text-white px-6 py-2 rounded-lg">
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-3">
                {cart.map((c) => (
                  <div key={c.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                    <img
                      src={c.product.image}
                      alt={c.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Obat'; }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{c.product.name}</h3>
                      <p className="text-primary font-bold text-sm">
                        Rp {c.product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(c.id, c.quantity - 1)} className="w-7 h-7 border rounded">−</button>
                      <span className="w-8 text-center text-sm">{c.quantity}</span>
                      <button onClick={() => updateQty(c.id, c.quantity + 1)} className="w-7 h-7 border rounded">+</button>
                    </div>
                    <button onClick={() => remove(c.id)} className="text-red-500 text-xs">Hapus</button>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5 h-fit">
                <h2 className="font-bold mb-3">Ringkasan</h2>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-primary">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary text-white py-2 rounded-lg"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}