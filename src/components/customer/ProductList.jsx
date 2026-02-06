import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import BannerCarousel from '../common/BannerCarousel';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
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
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen">

      {/* Full Width Carousel */}
      <BannerCarousel />

      <div className="p-4">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b pb-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Latest Smartphones</h2>
            <p className="text-sm text-gray-500">Handpicked collection just for you</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center p-20 text-gray-500 text-xl">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {products.length === 0 && <p className="col-span-full text-center py-10 text-gray-500">No products found. Add some from Admin panel.</p>}

            {products.map(product => (
              <div key={product.id}
                className="bg-white border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-lg overflow-hidden cursor-pointer group flex flex-col"
                onClick={() => window.location.href = `/product/${product.id}`}
              >
                {/* Image Area */}
                <div className="h-48 p-4 flex items-center justify-center bg-gray-50 relative">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-medium text-gray-800 group-hover:text-blue-600 truncate mb-1" title={product.name}>{product.name}</h3>

                  <div className="flex items-center gap-1 mb-2">
                    <span className="bg-green-600 text-white text-[10px] px-1.5 rounded flex items-center">4.4 ★</span>
                    <span className="text-gray-400 text-xs">(1,240)</span>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{Math.round(product.price * (1 - (product.discount || 0) / 100)).toLocaleString()}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">₹{Number(product.price).toLocaleString()}</span>
                      )}
                    </div>

                    {/* Stock Logic */}
                    {(product.stock || 0) <= 0 ? (
                      <div className="mt-3 w-full py-2 bg-red-50 text-red-500 text-center text-xs font-bold uppercase tracking-wide border border-red-100 rounded">
                        Out of Stock
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="mt-3 w-full py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded hover:bg-yellow-500 transition shadow-sm">
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;