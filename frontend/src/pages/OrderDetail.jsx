import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import { api } from '../api/fetch';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const BANK_INFO = {
  BNI: { no: '1234567890', name: 'PT ApotekCare Sehat' },
  BRI: { no: '0987654321', name: 'PT ApotekCare Sehat' },
  BCA: { no: '8765432109', name: 'PT ApotekCare Sehat' },
  BSI: { no: '1122334455', name: 'PT ApotekCare Sehat' },
  Mandiri: { no: '5566778899', name: 'PT ApotekCare Sehat' }
};

export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => api(`/orders/${id}`).then(setOrder);
  useEffect(() => { load(); }, [id]);

  if (!order) return <p className="p-6">Loading...</p>;

  const estimasi = order.estimatedArrival
    ? new Date(order.estimatedArrival).toLocaleString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : null;

  const steps = [
    { label: 'Dibuat', time: new Date(order.createdAt), done: true, icon: '📝' },
    { label: 'Diproses', time: new Date(order.createdAt), done: ['Diproses', 'Dikirim', 'Selesai', 'Siap Diambil'].includes(order.status), icon: '⚙️' },
    { label: 'Dikirim', time: order.paidAt ? new Date(order.paidAt) : null, done: ['Dikirim', 'Selesai'].includes(order.status), icon: '🚚' },
    { label: 'Selesai', time: order.completedAt ? new Date(order.completedAt) : null, done: order.status === 'Selesai', icon: '✅' }
  ];

  const handleComplete = async () => {
    if (!confirm('Yakin pesanan sudah diterima?')) return;
    setLoading(true);
    try {
      await api(`/orders/${id}/complete`, { method: 'PATCH' });
      showToast('Terima kasih! Pesanan selesai ✅', 'success');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const isCustomer = user?.role === 'customer';
  const bankInfo = order.paymentBank ? BANK_INFO[order.paymentBank] : null;

  const statusColor = (s) => {
    if (s === 'Selesai') return 'bg-green-100 text-green-700';
    if (s === 'Dikirim') return 'bg-blue-100 text-blue-700';
    if (s === 'Diproses') return 'bg-yellow-100 text-yellow-700';
    if (s === 'Siap Diambil') return 'bg-cyan-100 text-cyan-700';
    if (s === 'Dibatalkan') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const content = (
    <div className="p-6 max-w-5xl mx-auto">
      <Link to="/orders" className="text-primary text-sm">← Kembali</Link>
      <h1 className="text-2xl font-bold mt-2 mb-2">
        Detail Pesanan #APC{order.id.toString().padStart(6, '0')}
      </h1>
      <span className={`inline-block px-3 py-1 rounded-full text-xs mb-6 ${statusColor(order.status)}`}>
        {order.status}
      </span>

      {/* TIMELINE */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-5 border border-violet-100">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center relative">
              {i < steps.length - 1 && (
                <div className={`absolute top-5 left-1/2 w-full h-1 ${s.done ? 'bg-gradient-to-r from-primary to-accent' : 'bg-gray-200'}`} />
              )}
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-xl z-10 transition-all ${
                s.done ? 'gradient-purple text-white shadow-lg shadow-primary/40' : 'bg-gray-200 text-gray-400'
              }`}>
                {s.icon}
              </div>
              <p className={`text-xs mt-2 font-semibold ${s.done ? 'text-primary' : 'text-gray-400'}`}>
                {s.label}
              </p>
              <p className="text-[10px] text-gray-400">
                {s.time ? s.time.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TOMBOL CUSTOMER: PESANAN SELESAI */}
      {isCustomer && ['Dikirim', 'Siap Diambil'].includes(order.status) && (
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-5 mb-5 text-white">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-bold text-lg">Sudah terima pesanan?</h3>
              <p className="text-sm opacity-90">
                {order.deliveryMethod === 'Kurir' 
                  ? 'Klik tombol ini jika paket sudah sampai di tangan Anda'
                  : 'Klik tombol ini jika Anda sudah ambil pesanan di apotek'}
              </p>
            </div>
            <button
              onClick={handleComplete}
              disabled={loading}
              className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-violet-50 transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Memproses...' : '✅ Pesanan Selesai'}
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          {order.deliveryMethod === 'Kurir' && (
            <div className="card">
              <h2 className="font-bold mb-3">📦 Informasi Pengiriman</h2>
              <div className="text-sm space-y-2">
                <p><span className="text-gray-500">Kurir:</span> <b>{order.courier || '-'}</b></p>
                {order.trackingNumber && (
                  <p><span className="text-gray-500">No. Resi:</span> <b className="font-mono">{order.trackingNumber}</b></p>
                )}
                {estimasi && (
                  <p><span className="text-gray-500">Estimasi Tiba:</span> <b className="text-primary">{estimasi}</b></p>
                )}
                <div className="pt-3 border-t">
                  <p className="text-gray-500 text-xs mb-1">Alamat:</p>
                  <p className="text-gray-700">{order.address}</p>
                </div>
              </div>
            </div>
          )}

          {order.deliveryMethod === 'Ambil di Tempat' && (
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-5 border border-cyan-200">
              <h2 className="font-bold mb-3 text-cyan-700">🏪 Ambil di Tempat</h2>
              <p className="text-sm text-gray-700">ApotekCare - Jl. Merdeka No. 12, Jakarta Selatan</p>
              <p className="text-xs text-gray-500 mt-1">Tunjukkan kode pesanan saat mengambil</p>
            </div>
          )}

          <div className="card">
            <h2 className="font-bold mb-3">🛍️ Produk</h2>
            {order.items.map((it) => (
              <div key={it.id} className="flex items-center gap-3 py-3 border-b last:border-0">
                <img
                  src={it.product.image}
                  alt={it.product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{it.product.name}</p>
                  <p className="text-xs text-gray-500">x{it.quantity}</p>
                </div>
                <span className="text-sm font-semibold">
                  Rp {(it.price * it.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-primary pt-3 border-t mt-3 text-lg">
              <span>Total</span>
              <span>Rp {order.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <h2 className="font-bold mb-3">💳 Pembayaran</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Metode</span>
                <span className="font-semibold">
                  {order.paymentMethod}
                  {order.paymentBank && ` - ${order.paymentBank}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-semibold ${order.paymentConfirmed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentConfirmed ? '✅ Terverifikasi' : '⏳ Menunggu Admin'}
                </span>
              </div>
            </div>

            {order.paymentMethod === 'Transfer Bank' && order.paymentBank && bankInfo && !order.paymentConfirmed && (
              <div className="mt-4 p-4 bg-gradient-to-br from-violet-50 to-cyan-50 rounded-xl border border-violet-200">
                <p className="text-xs text-gray-500 mb-1">Transfer ke:</p>
                <p className="font-bold text-lg text-primary">{order.paymentBank}</p>
                <p className="font-mono text-lg font-bold tracking-wider">{bankInfo.no}</p>
                <p className="text-xs text-gray-500 mt-1">a.n. {bankInfo.name}</p>
                <div className="mt-3 pt-3 border-t border-violet-200">
                  <p className="text-xs text-gray-500">Kode:</p>
                  <p className="font-mono text-xs font-bold break-all">{order.paymentCode}</p>
                </div>
              </div>
            )}

            {order.paymentQR && !order.paymentConfirmed && (
              <div className="mt-3 text-center p-4 bg-gradient-to-br from-violet-50 to-cyan-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">Scan QR:</p>
                <img src={order.paymentQR} alt="QR" className="w-40 h-40 mx-auto border-2 border-white rounded-lg shadow" />
                {order.paymentCode && (
                  <p className="text-xs text-gray-500 mt-2 font-mono break-all">{order.paymentCode}</p>
                )}
              </div>
            )}

            {order.paymentConfirmed && (
              <div className="mt-3 p-3 bg-green-50 rounded-xl text-xs border border-green-200">
                ✅ Pembayaran diverifikasi
                {order.paidAt && (
                  <p className="text-gray-500 mt-1">{new Date(order.paidAt).toLocaleString('id-ID')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  if (isCustomer) {
    return (
      <div className="flex">
        <CustomerSidebar />
        <main className="customer-main order-detail-page bg-gradient-to-br from-violet-50 via-white to-cyan-50">{content}</main>
      </div>
    );
  }

  return <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50">{content}</div>;
}