import React, { useEffect, useState } from 'react';
import { getAllProducts, seedProducts } from '../../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="bg-white p-4">
      
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <div>
            <h2 className="text-xl font-medium">Best of Smartphones</h2>
            <p className="text-sm text-gray-500">Includes top brands</p>
        </div>
        {/* Admin/Debug helper button - keep small */}
        <button onClick={seedProducts} className="text-xs bg-gray-200 text-black px-2 py-1 rounded">
           Load Demo Stock
        </button>
      </div>

      {loading ? (
        <div className="text-center p-10">Loading awesome mobiles...</div>
      ) : (
        <div className="product-grid">
            {products.length === 0 && <p className="col-span-4 text-center">No products found. Click 'Load Demo Stock'.</p>}
            
            {products.map(product => (
            <div key={product.id} className="product-card group">
                {/* Mock Image */}
                <div className="product-img-box">
                     {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full object-contain" />
                     ) : (
                        <div className="product-img-placeholder relative">
                            <span className="text-xs text-gray-400">No Image</span>
                        </div>
                     )}
                </div>
                
                <h3 className="product-title group-hover:text-blue-600 truncate w-full">{product.name}</h3>
                
                {/* Rating Badge Mock */}
                <div className="flex items-center gap-2 justify-center my-1">
                    <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
                        4.4 ★
                    </span>
                    <span className="text-gray-400 text-xs">(1,240)</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <p className="product-price">₹{Number(product.price).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 line-through">₹{Number(product.price * 1.2).toLocaleString()}</p>
                    <p className="text-xs text-green-600 font-bold">20% off</p>
                </div>
                
                <p className="product-specs">{product.specs}</p>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;