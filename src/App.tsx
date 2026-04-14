import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/admin/AdminRoute';
import Checkout from './pages/Checkout';
import Brands from './pages/Brands';
import Cart from './pages/Cart';
import CustomerService from './pages/CustomerService';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Main Layout */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/catalog" element={<MainLayout><Catalog /></MainLayout>} />
        <Route path="/catalog/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
        <Route path="/brands" element={<MainLayout><Brands /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
        <Route path="/customer-service" element={<MainLayout><CustomerService /></MainLayout>} />
        <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Admin Dashboard */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
