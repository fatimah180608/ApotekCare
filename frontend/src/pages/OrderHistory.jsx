import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import { api } from '../api/fetch';
import { useAuth } from '../context/AuthContext';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => { api('/orders/my').then(setOrders); }, []);

  const statusColor = (s) => {
    if (s === 'Selesai') return 'bg-green-100 text-green-700';
    if (s === 'Dikirim') return 'bg-blue-100 text-blue-700';
    if (s === 'Diproses') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex">
      <CustomerSidebar />
      <main className="customer-main order-history-page">
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-lg font-bold">🧾 Riwayat Pesanan</h1>
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {orders.length === 0 ? (
              <p className="text-gray-400 text-center py-12">Belum ada pesanan</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-500">
                      <th className="py-3 px-4">ID</th>
                      <th>Tanggal</th>
                      <th>Metode</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-xs">#APC{o.id.toString().padStart(6, '0')}</td>
                        <td>{new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
                        <td>{o.deliveryMethod}{o.courier ? ` • ${o.courier}` : ''}</td>
                        <td>Rp {o.total.toLocaleString('id-ID')}</td>
                        <td>
                          <span className={`px-2 py-1 rounded-full text-xs ${statusColor(o.status)}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <Link to={`/orders/${o.id}`} className="text-primary text-xs hover:underline">
                            Detail →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}