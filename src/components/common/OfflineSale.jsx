import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../../services/productService';
import { recordOfflineSale } from '../../services/salesService';

const OfflineSale = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const data = await getAllProducts();
        setProducts(data);
    };

    const addToCart = (product) => {
        if (product.stock <= 0) return alert("Out of Stock!");

        const existing = cart.find(c => c.id === product.id);
        if (existing) {
            if (existing.qty >= product.stock) return alert("Stock limit reached!");
            setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(c => c.id !== id));
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                if (newQty > item.stock) {
                    alert(`Only ${item.stock} in stock!`);
                    return item;
                }
                if (newQty < 1) return item;
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => {
            const price = item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price;
            return sum + (price * item.qty);
        }, 0);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return alert("Cart is empty!");
        if (!window.confirm("Confirm Sale?")) return;

        setLoading(true);
        try {
            await recordOfflineSale(cart, calculateTotal(), "Admin"); // TODO: Pass actual user
            alert("Sale Recorded Successfully!");
            setCart([]);
            fetchProducts(); // Refresh stock
        } catch (error) {
            alert("Sale Failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* Left: Product Selection */}
            <div className="flex-1 bg-white rounded-xl shadow-md p-6 overflow-hidden flex flex-col">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-y-auto flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4 content-start">
                    {filteredProducts.map(product => (
                        <div key={product.id}
                            onClick={() => addToCart(product)}
                            className={`border rounded-lg p-3 cursor-pointer transition hover:shadow-md active:scale-95 
                        ${product.stock > 0 ? 'bg-white hover:border-blue-500' : 'bg-gray-100 opacity-60 pointer-events-none'}`}>
                            <div className="h-24 w-full bg-gray-50 mb-2 rounded flex items-center justify-center overflow-hidden">
                                {product.imageUrl ? <img src={product.imageUrl} className="h-full object-contain" /> : "📷"}
                            </div>
                            <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                            <div className="flex justify-between items-center mt-1">
                                <span className="font-bold text-gray-800">₹{product.price}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock < 5 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                    {product.stock} Left
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Cart & Checkout */}
            <div className="w-96 bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
                <div className="p-4 bg-slate-800 text-white shadow-md">
                    <h2 className="text-lg font-bold">New Sale</h2>
                    <p className="text-xs text-slate-400">Total Items: {cart.length}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">Cart is empty</div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex-1">
                                    <p className="font-semibold text-sm truncate">{item.name}</p>
                                    <p className="text-xs text-gray-500">
                                        ₹{item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price} x {item.qty}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-gray-200 rounded text-gray-600 font-bold hover:bg-gray-300">-</button>
                                    <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-blue-100 rounded text-blue-600 font-bold hover:bg-blue-200">+</button>
                                    <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-500 hover:text-red-700">✕</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600 font-medium">Total Amount</span>
                        <span className="text-2xl font-bold text-slate-800">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={loading || cart.length === 0}
                        className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-lg transition
                    ${loading || cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'}`}>
                        {loading ? 'Processing...' : 'Complete Sale'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfflineSale;
