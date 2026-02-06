import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { logoutUser } from './services/authService';

// Auth Components
import Login from './components/Login';
import Register from './components/customer/Register';

// Admin Imports
import AdminDashboard from './components/admin/AdminDashboard';
import CreateStaff from './components/admin/CreateStaff';
import StaffAttendance from './components/admin/StaffAttendance';

// Staff Imports
import StaffDashboard from './components/staff/StaffDashboard';
import MarkAttendance from './components/staff/MarkAttendance';
import RecordOfflineSale from './components/staff/RecordOfflineSale';

// Customer Components
import ProductList from './components/customer/ProductList';
import Cart from './components/customer/Cart';
import ProductDetail from './components/customer/ProductDetail';

const Navbar = () => {
  const { currentUser, userRole } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <nav>
      {/* Brand Logo Area */}
      <Link to="/shop" className="nav-brand">
        Surya<span style={{ color: '#f0f0f0', fontWeight: '400' }}>Mobiles</span>
        <div style={{ fontSize: '10px', fontStyle: 'italic', marginTop: '-5px', color: '#ffe500' }}>
          Explore <span style={{ color: '#ffe500', fontWeight: 'bold' }}>Plus</span>
        </div>
      </Link>

      {/* Search Bar (Only on Shop Page) */}
      {window.location.pathname.startsWith('/shop') && (
        <div className="hidden md:block flex-grow max-w-lg mx-4">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full px-4 py-2 rounded-sm text-black outline-none border-none shadow-sm"
            onChange={(e) => {
              const search = e.target.value;
              const newUrl = new URL(window.location);
              if (search) {
                newUrl.searchParams.set('search', search);
              } else {
                newUrl.searchParams.delete('search');
              }
              // Force reactivity by dispatching event or just relying on ProductList location check which might be tricky without Context.
              // Let's use simple navigation which triggers re-renders
              window.history.pushState({}, '', newUrl);
              // Dispatch event so ProductList can listen
              window.dispatchEvent(new Event('popstate'));
            }}
          />
        </div>
      )}

      <div className="nav-links">
        {userRole === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
        {userRole === 'staff' && <Link to="/staff" className="nav-link">Staff</Link>}

        {!currentUser ? (
          <Link to="/login" className="login-btn-nav">Login</Link>
        ) : (
          <div className="flex gap-4 items-center">
            <span className="font-bold text-white hidden md:block">
              {currentUser.email?.split('@')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="text-white bg-transparent border border-white px-3 py-1 text-sm font-bold hover:bg-white hover:text-blue-600 transition">
              Logout
            </button>
          </div>
        )}

        <Link to="/cart" className="nav-link flex items-center gap-1 font-bold relative">
          <span>🛒</span> Cart
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

// Separate component to use useLocation hook
const LayoutWithNavbar = () => {
  const { pathname } = useLocation();
  const hideNavbarRoutes = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname);

  return shouldShowNavbar ? <Navbar /> : null;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <LayoutWithNavbar />
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<Navigate to="/shop" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shop" element={<ProductList />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductDetail />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/create-staff" element={<CreateStaff />} />

                {/* Staff Routes */}
                <Route path="/staff" element={<StaffDashboard />} />
                <Route path="/staff/attendance" element={<MarkAttendance />} />
                <Route path="/staff/offline-sale" element={<RecordOfflineSale />} />
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
