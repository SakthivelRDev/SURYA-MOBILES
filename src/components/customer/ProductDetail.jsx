import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("No such product!");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Loading product details...</div>;
    if (!product) return <div className="p-10 text-center text-red-500">Product not found.</div>;

    const isOutOfStock = (product.stock || 0) <= 0;
    const discountedPrice = product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    return (
        <div className="bg-white p-6 max-w-6xl mx-auto mt-4 rounded shadow-sm min-h-[500px]">
            <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">← Back to Shop</button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Image Section */}
                <div className="flex justify-center items-center border p-4 rounded-lg">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="max-h-[400px] object-contain" />
                    ) : (
                        <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center text-gray-400">No Image Available</div>
                    )}
                </div>

                {/* Details Section */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-green-600 text-white text-sm px-2 py-0.5 rounded">4.4 ★</span>
                        <span className="text-gray-500 text-sm">1,240 Ratings & 102 Reviews</span>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold">₹{discountedPrice.toLocaleString()}</span>
                            {product.discount > 0 && (
                                <>
                                    <span className="text-gray-500 line-through text-lg">₹{product.price.toLocaleString()}</span>
                                    <span className="text-green-600 font-bold text-lg">{product.discount}% off</span>
                                </>
                            )}
                        </div>
                        {isOutOfStock ? (
                            <span className="text-red-600 font-bold mt-2 block text-lg">Currently Out of Stock</span>
                        ) : (
                            product.stock < 5 && <span className="text-orange-600 font-bold text-sm mt-1 block">Hurry, only {product.stock} left!</span>
                        )}
                    </div>

                    {/* Generic Specs Display (List format for card) */}
                    <div className="mb-8">
                        <h3 className="font-bold text-gray-700 mb-2">Highlights</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            {Array.isArray(product.specs)
                                ? product.specs.map((spec, i) => (
                                    <li key={i}><strong>{spec.key}:</strong> {spec.value}</li>
                                ))
                                : (product.specs ? <li>{product.specs}</li> : <li>No specifications listed</li>) // Fallback for legacy strings
                            }
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            disabled={isOutOfStock}
                            onClick={() => { addToCart(product); navigate('/cart'); }}
                            className={`flex-1 py-4 rounded font-bold text-lg ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                        >
                            {isOutOfStock ? "SOLD OUT" : "BUY NOW"}
                        </button>
                        <button
                            disabled={isOutOfStock}
                            onClick={() => addToCart(product)}
                            className={`flex-1 py-4 rounded font-bold text-lg ${isOutOfStock ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
                        >
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
