import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { logoutUser } from '../../services/authService';
import logo from '../../assets/logo.png'; // Make sure this file exists!

const Navbar = () => {
    const { currentUser, userRole } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#007EA7] text-white shadow-md p-4 flex items-center justify-between">
            {/* Brand Logo Area */}
            <Link to="/shop" className="flex items-center gap-2">
                {/* Try to show logo, fallback to text if image fails or missing during dev */}
                <img
                    src={logo}
                    alt="Surya Mobiles"
                    className="h-12 object-contain bg-white rounded-md px-1"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                    }}
                />
                <div style={{ display: 'none' }} className="flex flex-col leading-none">
                    <span className="text-xl font-bold tracking-tight">Surya<span className="font-light text-gray-200">Mobiles</span></span>
                    <span className="text-[10px] italic text-[#ffe500]">Explore <span className="font-bold">Plus</span></span>
                </div>
            </Link>

            {/* Search Bar (Only on Shop Page) */}
            {location.pathname.startsWith('/shop') && (
                <div className="hidden md:block flex-grow max-w-lg mx-6">
                    <input
                        type="text"
                        placeholder="Search for mobiles, accessories..."
                        className="w-full px-4 py-2 rounded text-base text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
                        onChange={(e) => {
                            const search = e.target.value;
                            const newUrl = new URL(window.location);
                            if (search) {
                                newUrl.searchParams.set('search', search);
                            } else {
                                newUrl.searchParams.delete('search');
                            }
                            window.history.pushState({}, '', newUrl);
                            window.dispatchEvent(new Event('popstate'));
                        }}
                    />
                </div>
            )}

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
                <Link to="/service" className="text-white hover:text-yellow-300 font-semibold transition">Services</Link>

                {userRole === 'admin' && <Link to="/admin" className="text-white hover:text-yellow-300 font-semibold transition">Admin</Link>}
                {userRole === 'staff' && <Link to="/staff" className="text-white hover:text-yellow-300 font-semibold transition">Staff</Link>}

                {!currentUser ? (
                    <Link to="/login" className="bg-yellow-400 text-[#003459] px-4 py-2 rounded font-bold hover:bg-yellow-300 transition shadow-sm">Login</Link>
                ) : (
                    <div className="flex gap-4 items-center">
                        <span className="font-medium text-blue-50 hidden md:block">
                            Hello, {currentUser.displayName || currentUser.email?.split('@')[0]}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-white border border-white/30 px-3 py-1 rounded text-sm font-bold hover:bg-white/10 transition">
                            Logout
                        </button>
                    </div>
                )}

                <Link to="/cart" className="relative flex items-center group">
                    <span className="text-2xl group-hover:scale-110 transition pb-1">🛒</span>
                    {getCartCount() > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#007EA7]">
                            {getCartCount()}
                        </span>
                    )}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
