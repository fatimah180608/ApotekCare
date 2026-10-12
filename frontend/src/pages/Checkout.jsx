import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import { api } from '../api/fetch';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const COURIERS = [
  { id: 'Instan', label: 'Instan (Gojek/Grab)', est: '30 menit - 6 jam', ongkir: 15000 },
  { id: 'JNE', label: 'JNE REG', est: '1 - 3 hari', ongkir: 8000 },
  { id: 'J&T', label: 'J&T Express', est: '1 - 3 hari', ongkir: 8000 },
  { id: 'Express', label: 'Express Same Day', est: '1 - 3 hari', ongkir: 10000 }
];

const BANKS = ['BNI', 'BRI', 'BCA', 'BSI', 'Mandiri'];

const PAYMENTS = [
  { id: 'COD', label: '💵 COD (Bayar di Tempat)' },
  { id: 'QRIS', label: '📱 QRIS' },
  { id: 'OVO', label: '💜 OVO' },
  { id: 'GoPay', label: '💚 GoPay' },
  { id: 'DANA', label: '💙 DANA' },
  { id: 'Transfer Bank', label: '🏦 Transfer Bank' },
  { id: 'Kartu Kredit', label: '💳 Kartu Kredit/Debit' }
];

export default function Checkout() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    address: user?.address || '',
    paymentMethod: 'COD',
    paymentBank: '',
    deliveryMethod: 'Kurir',
    courier: 'Instan'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { api('/cart').then(setCart); }, []);

  const subtotal = cart.reduce((s, c) => s + c.product.price * c.quantity, 0);
  const selectedCourier = COURIERS.find((c) => c.id === form.courier);
  const ongkir = form.deliveryMethod === 'Kurir' ? selectedCourier?.ongkir || 0 : 0;
  const total = subtotal + ongkir;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.paymentMethod === 'Transfer Bank' && !form.paymentBank) {
      showToast('Pilih bank terlebih dahulu', 'error');
      return;
    }
    setLoading(true);
    try {
      const order = await api('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      showToast('Pesanan berhasil dibuat! 🎉', 'success');
      setTimeout(() => navigate(`/orders/${order.id}`), 1000);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <CustomerSidebar />
      <main className="customer-main checkout-page">
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-lg font-bold">Checkout</h1>
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {/* PENGIRIMAN */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold mb-3">🚚 Metode Pengiriman</h2>
              <div className="space-y-2 mb-4">
                <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="delivery" value="Kurir"
                    checked={form.deliveryMethod === 'Kurir'}
                    onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
                    className="mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Dikirim via Kurir</p>
                    <p className="text-xs text-gray-500">Estimasi & ongkir tergantung kurir</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="delivery" value="Ambil di Tempat"
                    checked={form.deliveryMethod === 'Ambil di Tempat'}
                    onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
                    className="mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Ambil di Tempat (Gratis)</p>
                    <p className="text-xs text-gray-500">Jl. Merdeka No. 12, Jakarta Selatan</p>
                  </div>
                </label>
              </div>

              {form.deliveryMethod === 'Kurir' && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Pilih Kurir:</p>
                  {COURIERS.map((c) => (
                    <label key={c.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="courier" value={c.id}
                        checked={form.courier === c.id}
                        onChange={(e) => setForm({ ...form, courier: e.target.value })} />
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{c.label}</p>
                          <p className="text-xs text-gray-500">⏱️ Estimasi: {c.est}</p>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          Rp {c.ongkir.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ALAMAT */}
            {form.deliveryMethod === 'Kurir' && (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="font-bold mb-3">🏠 Alamat Pengiriman</h2>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required rows={3}
                  placeholder="Nama penerima, no. telp, alamat lengkap"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            )}

            {/* PEMBAYARAN */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold mb-3">💳 Metode Pembayaran</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {PAYMENTS.map((p) => (
                  <label key={p.id}
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-sm ${
                      form.paymentMethod === p.id ? 'border-primary bg-primary-light' : 'hover:bg-gray-50'
                    }`}>
                    <input type="radio" name="payment" value={p.id}
                      checked={form.paymentMethod === p.id}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>

              {/* PILIHAN BANK (kalau Transfer Bank) */}
              {form.paymentMethod === 'Transfer Bank' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold mb-2">🏦 Pilih Bank:</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {BANKS.map((bank) => (
                      <label key={bank}
                        className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer text-sm font-semibold ${
                          form.paymentBank === bank ? 'border-primary bg-white' : 'border-transparent bg-white/60 hover:bg-white'
                        }`}>
                        <input type="radio" name="bank" value={bank} className="hidden"
                          checked={form.paymentBank === bank}
                          onChange={(e) => setForm({ ...form, paymentBank: e.target.value })} />
                        {bank}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">
                ℹ️ Kode pembayaran / QR akan muncul di halaman detail pesanan. Admin akan konfirmasi setelah Anda bayar.
              </p>
            </div>
          </div>

          {/* RINGKASAN */}
          <div className="bg-white rounded-2xl shadow-sm p-5 h-fit sticky top-20">
            <h2 className="font-bold mb-3">Ringkasan Pesanan</h2>
            <div className="space-y-2 text-sm mb-4">
              {cart.map((c) => (
                <div key={c.id} className="flex justify-between">
                  <span className="text-gray-600">{c.product.name} x{c.quantity}</span>
                  <span>Rp {(c.product.price * c.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
              <hr />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkir</span>
                <span>Rp {ongkir.toLocaleString('id-ID')}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-primary text-base">
                <span>Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <button type="submit" disabled={loading || cart.length === 0}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50">
              {loading ? 'Memproses...' : 'Buat Pesanan'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}