import React, { useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const VerifyOrder = () => {
    const [code, setCode] = useState('');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (code.length !== 6) return setError("Code must be 6 digits");

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const q = query(collection(db, "orders"), where("pickupCode", "==", code), where("status", "==", "pending"));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setError("Invalid or expired code.");
            } else {
                const orderDoc = snapshot.docs[0];
                setOrder({ id: orderDoc.id, ...orderDoc.data() });
            }
        } catch (err) {
            console.error(err);
            setError("Error verifying code.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompletePickup = async () => {
        if (!order) return;
        if (!window.confirm("Confirm handover of items?")) return;

        try {
            await updateDoc(doc(db, "orders", order.id), { status: 'completed' });
            alert("Order completed successfully!");
            setOrder(null);
            setCode('');
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Verify Pickup Order</h2>

            <form onSubmit={handleVerify} className="mb-6">
                <input
                    type="text"
                    placeholder="Enter 6-Digit Code"
                    className="w-full text-center text-3xl tracking-widest p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none uppercase"
                    maxLength="6"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400">
                    {loading ? 'Verifying...' : 'Verify Code'}
                </button>
            </form>

            {order && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h3 className="font-bold text-lg text-green-800 mb-2">Order Found!</h3>
                    <p><b>Customer:</b> {order.customerName}</p>
                    <p><b>Phone:</b> {order.customerPhone}</p>
                    <div className="my-3 border-t border-green-200 pt-2">
                        <p className="font-semibold text-sm text-gray-600">Items:</p>
                        <ul className="text-sm list-disc pl-4 space-y-1">
                            {order.items.map((item, idx) => (
                                <li key={idx}>{item.name} x {item.qty}</li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-right font-bold text-lg">Total: ₹{order.total.toLocaleString()}</p>

                    <button
                        onClick={handleCompletePickup}
                        className="w-full mt-4 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
                        Mark as Handed Over
                    </button>
                </div>
            )}
        </div>
    );
};

export default VerifyOrder;
