import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../../services/productService';

const AddProduct = ({ productToEdit, onClearEdit }) => {
  const [product, setProduct] = useState({ name: '', price: '', specs: '', discount: '', stock: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load product data if editing
  useEffect(() => {
    if (productToEdit) {
      setProduct({
        name: productToEdit.name,
        price: productToEdit.price,
        specs: productToEdit.specs,
        discount: productToEdit.discount || '',
        stock: productToEdit.stock || ''
      });
      setPreviewUrl(productToEdit.imageUrl);
    } else {
      // Reset form when productToEdit becomes null
      setProduct({ name: '', price: '', specs: '', discount: '', stock: '' });
      setImageFile(null);
      setPreviewUrl(null);
    }
  }, [productToEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: product.name,
        price: Number(product.price),
        specs: product.specs,
        discount: Number(product.discount) || 0,
        stock: Number(product.stock) || 0
      };

      // Create a timeout promise to prevent stuck loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out. Check your internet connection or CORS settings.")), 15000)
      );

      if (productToEdit) {
        // UPDATE MODE
        await Promise.race([
          updateProduct(productToEdit.id, productData, imageFile),
          timeoutPromise
        ]);
        alert("Product Updated Successfully!");
        if (onClearEdit) onClearEdit(); // Switch back or clear selection
      } else {
        // ADD MODE
        await Promise.race([
          addProduct(productData, imageFile),
          timeoutPromise
        ]);
        alert("Product Added Successfully!");
      }

      // Reset form
      setProduct({ name: '', price: '', specs: '', discount: '', stock: '' });
      setImageFile(null);
      setPreviewUrl(null);

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-gray-500 mt-1">{productToEdit ? 'Update product details.' : 'Add a new mobile phone to the inventory.'}</p>
          </div>
          {productToEdit && (
            <button onClick={onClearEdit} className="text-sm text-gray-500 hover:text-red-500 underline">
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left Column: Input Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
              <input
                placeholder="e.g. iPhone 15 Pro"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Discount (%)</label>
                <input
                  type="number"
                  placeholder="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={product.discount}
                  onChange={(e) => setProduct({ ...product, discount: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
              <input
                type="number"
                placeholder="e.g. 10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Specifications</label>
              <textarea
                placeholder="e.g. 256GB, Titanium Blue, A17 Pro Chip"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                value={product.specs}
                onChange={(e) => setProduct({ ...product, specs: e.target.value })}
              />
            </div>
          </div>

          {/* Right Column: Image Upload & Preview */}
          <div className="flex flex-col space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {previewUrl ? (
                  <div className="relative w-full h-64">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition">
                      Change Image
                    </div>
                  </div>
                ) : (
                  <div className="py-10">
                    <span className="text-4xl mb-2 block">📷</span>
                    <p className="text-gray-500 text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-auto">
              <button
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md transition-all 
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {productToEdit ? 'Updating...' : 'Adding...'}
                  </span>
                ) : (productToEdit ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;