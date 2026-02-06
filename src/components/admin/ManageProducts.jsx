import React, { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '../../services/productService';

const ManageProducts = ({ onEdit }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                alert("Failed to delete: " + error.message);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading inventory...</div>;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Manage Inventory</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{products.length} Products</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4 font-semibold">Product</th>
                            <th className="p-4 font-semibold">Price</th>
                            <th className="p-4 font-semibold">Discount</th>
                            <th className="p-4 font-semibold">Stock</th>
                            <th className="p-4 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">No products found. Add some!</td>
                            </tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden border">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-xs text-gray-400">N/A</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{product.name}</p>
                                            <p className="text-xs text-gray-500 truncate w-40">
                                                {Array.isArray(product.specs)
                                                    ? product.specs.map(s => `${s.key}: ${s.value}`).join(', ')
                                                    : product.specs
                                                }
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-700 font-medium">₹{Number(product.price).toLocaleString()}</td>
                                    <td className="p-4 text-green-600">
                                        {product.discount ? `${product.discount}%` : '-'}
                                    </td>
                                    <td className="p-4">
                                        {product.stock > 0 ? (
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock < 5 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                                {product.stock} in stock
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Out of Stock</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded hover:bg-red-100 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProducts;
