import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

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
import ServicePage from './components/customer/ServicePage';

// Separate component to use useLocation hook for Navbar visibility
const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const hideNavRoutes = ['/login', '/register'];
  const showNav = !hideNavRoutes.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {showNav && <Navbar />}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      {showNav && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/shop" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Routes */}
              <Route path="/shop" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/service" element={<ServicePage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/create-staff" element={<CreateStaff />} />

              {/* Staff Routes */}
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/staff/attendance" element={<MarkAttendance />} />
              <Route path="/staff/offline-sale" element={<RecordOfflineSale />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
