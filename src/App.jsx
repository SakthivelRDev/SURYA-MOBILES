import { useState, useEffect } from 'react'
import './App.css'
// FIX: Added useNavigate to this import list
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { logoutUser } from './services/authService';

// Auth Components
import Login from './components/Login';
import Register from './components/customer/Register';

// Admin Imports
import AdminDashboard from './components/admin/AdminDashboard';
import CreateStaff from './components/admin/CreateStaff';

// Staff Imports
import StaffDashboard from './components/staff/StaffDashboard';
import MarkAttendance from './components/staff/MarkAttendance';
import RecordOfflineSale from './components/staff/RecordOfflineSale';

// Customer Imports
import ProductList from './components/customer/ProductList';

const Navbar = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate(); // Now this will work
  
  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <nav>
      {/* Brand Logo Area */}
      <Link to="/shop" className="nav-brand">
        Surya<span style={{color:'#f0f0f0', fontWeight:'400'}}>Mobiles</span>
        <div style={{fontSize: '10px', fontStyle:'italic', marginTop:'-5px', color:'#ffe500'}}>
            Explore <span style={{color:'#ffe500', fontWeight:'bold'}}>Plus</span>
        </div>
      </Link>

      {/* Search Bar (Visual Only) */}
      <div className="hidden md:block flex-grow max-w-lg mx-4">
        <input 
            type="text" 
            placeholder="Search for products, brands and more" 
            className="w-full px-4 py-2 rounded-sm text-black outline-none border-none shadow-sm"
        />
      </div>

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

         <Link to="/cart" className="nav-link flex items-center gap-1 font-bold">
            <span>🛒</span> Cart
         </Link>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Navigate to="/shop" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop" element={<ProductList />} />

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
    </AuthProvider>
  );
}

export default App;
