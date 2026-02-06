import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 py-10 mt-auto">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand & Tagline */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Surya<span className="font-light">Mobiles</span></h3>
                    <p className="text-sm text-gray-400 mb-4">Choose Your World.</p>
                    <p className="text-sm">Premium mobiles, accessories, and expert service at the best prices.</p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/shop" className="hover:text-yellow-400 transition">Shop Now</a></li>
                        <li><a href="/service" className="hover:text-yellow-400 transition">Mobile Service</a></li>
                        <li><a href="/cart" className="hover:text-yellow-400 transition">My Cart</a></li>
                        <li><a href="/login" className="hover:text-yellow-400 transition">Login / Register</a></li>
                    </ul>
                </div>

                {/* Address & Contact */}
                <div>
                    <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
                    <address className="not-italic text-sm space-y-2">
                        <p className="font-semibold text-white">Surya Mobiles</p>
                        <p>77, Manalurpet Main Road</p>
                        <p>Kattampoondi</p>
                        <p>Tiruvannamalai - 606808</p>
                        <p className="mt-4 flex items-center gap-2">
                            <span className="bg-green-600 text-white p-1 rounded text-xs">Ph</span>
                            <a href="tel:8098822944" className="font-bold hover:text-white text-gray-300">8098822944</a>
                        </p>
                    </address>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-6 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Surya Mobiles. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
