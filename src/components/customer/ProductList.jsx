import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import BannerCarousel from '../common/BannerCarousel';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Filter States
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [maxPrice, setMaxPrice] = useState(200000);

  // Read URL Search Param
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Listen for URL changes (search)
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('search') || '');
    };

    window.addEventListener('popstate', handleUrlChange);
    handleUrlChange(); // Initial check

    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);

        // Extract unique brands
        const uniqueBrands = [...new Set(data.map(p => p.brand).filter(b => b))];
        setBrands(uniqueBrands);

        // Calculate max price
        const max = Math.max(...data.map(p => p.price), 200000);
        setMaxPrice(max);
        setPriceRange([0, max]);

      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply Filters
  useEffect(() => {
    let result = products;

    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    // 2. Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // 3. Price Filter
    result = result.filter(p => {
      const price = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    setFilteredProducts(result);
  }, [products, searchQuery, selectedBrands, priceRange]);

  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <BannerCarousel />

      <div className="max-w-[1600px] mx-auto p-4 flex gap-6">

        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0 bg-white p-4 border rounded h-fit sticky top-20">
          <h3 className="font-bold text-lg mb-4 border-b pb-2">Filters</h3>

          {/* Price Filter */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-sm">Price Range</h4>
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>₹0</span>
              <span className="font-bold">Up to ₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h4 className="font-semibold mb-2 text-sm">Brands</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center border-b pb-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {searchQuery ? `Results for "${searchQuery}"` : "Latest Smartphones"}
              </h2>
              <p className="text-sm text-gray-500">
                Showing {filteredProducts.length} items
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center p-20 text-gray-500 text-xl">Loading products...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No products match your criteria.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedBrands([]); setPriceRange([0, maxPrice]); }}
                    className="mt-2 text-blue-600 font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {filteredProducts.map(product => (
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
    </div>
  );
};

export default ProductList;