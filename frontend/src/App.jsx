import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminSettings from './pages/AdminSettings';

const Private = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

const CustomerOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  if (user?.role !== 'customer') return <Navigate to="/admin/dashboard" />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* CUSTOMER */}
      <Route path="/dashboard" element={<Private><CustomerOnly><Dashboard /></CustomerOnly></Private>} />
      <Route path="/products" element={<Private><CustomerOnly><Products /></CustomerOnly></Private>} />
      <Route path="/cart" element={<Private><CustomerOnly><Cart /></CustomerOnly></Private>} />
      <Route path="/checkout" element={<Private><CustomerOnly><Checkout /></CustomerOnly></Private>} />
      <Route path="/orders" element={<Private><CustomerOnly><OrderHistory /></CustomerOnly></Private>} />

      {/* SHARED */}
      <Route path="/orders/:id" element={<Private><OrderDetail /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />

      {/* ADMIN */}
      <Route path="/admin/dashboard" element={<Private><AdminOnly><AdminDashboard /></AdminOnly></Private>} />
      <Route path="/admin/products" element={<Private><AdminOnly><AdminProducts /></AdminOnly></Private>} />
      <Route path="/admin/orders" element={<Private><AdminOnly><AdminOrders /></AdminOnly></Private>} />
      <Route path="/admin/settings" element={<Private><AdminOnly><AdminSettings /></AdminOnly></Private>} />
    </Routes>
  );
}