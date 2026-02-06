import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { createOrder } from '../../services/salesService';

const Cart = () => {
    const { cart, removeFromCart, updateQty, getCartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const [step, setStep] = useState('cart');
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null); // { code, type }

    // Pre-fill user data
    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                name: currentUser.email?.split('@')[0] || '', // Simple fallback name
                // In a real app, fetch profile from Firestore 'users' collection
            }));
        }
    }, [currentUser]);

    const handleCheckout = (type) => {
        setStep(type);
    };

    const confirmOrder = async () => {
        if (!formData.name || !formData.phone) return alert("Please fill details");
        if (step === 'delivery' && !formData.address) return alert("Address required");

        setIsProcessing(true);

        // Simulate Payment Gateway Delay
        if (paymentMethod !== 'cod') {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        try {
            const orderData = {
                items: cart,
                total: getCartTotal(),
                type: step,
                customerName: formData.name,
                customerPhone: formData.phone,
                address: formData.address || '',
                paymentMethod: paymentMethod,
                paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid'
            };

            const pickupCode = await createOrder(orderData);
            setOrderSuccess({ code: pickupCode, type: step });
            clearCart();
        } catch (error) {
            alert("Order Failed: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-green-600">Order Placed Successfully!</h2>

                {orderSuccess.type === 'pickup' ? (
                    <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <p className="text-gray-600 mb-2">Your Pickup Code</p>
                        <h1 className="text-4xl font-mono font-bold text-blue-800 tracking-widest">{orderSuccess.code}</h1>
                        <p className="text-xs text-blue-500 mt-2">Show this code at the store to collect your items.</p>
                    </div>
                ) : (
                    <p className="mt-4 text-gray-600">Your items will be delivered to <b>{formData.address}</b> soon!</p>
                )}

                <Link to="/shop" className="block mt-8 text-blue-600 font-bold hover:underline">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-800">Your cart is empty!</h2>
                <p className="text-gray-500 mt-2 mb-6">Add items to it now.</p>
                <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded font-bold shadow hover:bg-blue-700">
                    Shop Now
                </Link>
            </div>
        );
    }

    if (step === 'delivery' || step === 'pickup') {
        return (
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
                {isProcessing ? (
                    <div className="text-center py-10">
                        <div className="text-4xl animate-spin mb-4">⏳</div>
                        <h2 className="text-xl font-bold text-gray-700">Processing Payment...</h2>
                        <p className="text-gray-500">Please do not close this window.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold mb-4">{step === 'delivery' ? 'Home Delivery' : 'Store Pickup'}</h2>
                        <div className="space-y-4">
                            <input
                                className="w-full p-2 border rounded"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                className="w-full p-2 border rounded"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                            {step === 'delivery' && (
                                <textarea
                                    className="w-full p-2 border rounded"
                                    placeholder="Full Address"
                                    rows="3"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            )}

                            {/* Payment Method Selection */}
                            <div className="pt-4">
                                <h3 className="font-bold mb-2">Payment Method</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                        <span>💳 Credit / Debit Card</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                                        <span>📱 UPI (GPay, PhonePe)</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                        <span>💵 Cash on Delivery</span>
                                    </label>
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between font-bold text-lg mb-4">
                                    <span>Total to Pay:</span>
                                    <span>₹{getCartTotal().toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={confirmOrder}
                                    className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700">
                                    {paymentMethod === 'cod' ? 'Confirm Order' : 'Pay & Order'}
                                </button>
                                <button
                                    onClick={() => setStep('cart')}
                                    className="w-full mt-2 text-gray-500 hover:text-gray-800">
                                    Back
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart ({cart.length})</h1>

            <div className="bg-white rounded shadow text-left">
                {cart.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 border-b">
                        <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                            {item.imageUrl ? <img src={item.imageUrl} className="max-h-full max-w-full" /> : '📷'}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg hover:text-blue-600 cursor-pointer">
                                <Link to={`/product/${item.id}`}>{item.name}</Link>
                            </h3>
                            <p className="text-gray-500 text-sm">{item.specs}</p>
                            <div className="mt-2 flex items-center gap-4">
                                <span className="font-bold">
                                    ₹{(item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price).toLocaleString()}
                                </span>
                                {item.discount > 0 && <span className="text-xs text-gray-400 line-through">₹{item.price}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateQty(item.id, -1, item.stock)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold">-</button>
                                <span className="w-4 text-center">{item.qty}</span>
                                <button onClick={() => updateQty(item.id, 1, item.stock)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500 hover:underline">Remove</button>
                        </div>
                    </div>
                ))}

                <div className="p-6 bg-gray-50">
                    <div className="flex justify-between items-center text-xl font-bold mb-6">
                        <span>Total Amount</span>
                        <span>₹{getCartTotal().toLocaleString()}</span>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => handleCheckout('pickup')}
                            className="flex-1 py-3 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded hover:bg-orange-50 transition">
                            🏬 Store Pickup
                        </button>
                        <button
                            onClick={() => handleCheckout('delivery')}
                            className="flex-1 py-3 bg-orange-600 text-white font-bold rounded hover:bg-orange-700 transition shadow-lg shadow-orange-200">
                            🚚 Home Delivery
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
