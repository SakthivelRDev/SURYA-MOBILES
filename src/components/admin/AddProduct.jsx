import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../../services/productService';

const AddProduct = ({ productToEdit, onClearEdit }) => {
  const [product, setProduct] = useState({ name: '', brand: '', price: '', specs: [], discount: '', stock: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load product data if editing
  useEffect(() => {
    if (productToEdit) {
      setProduct({
        name: productToEdit.name,
        brand: productToEdit.brand || '',
        price: productToEdit.price,
        specs: Array.isArray(productToEdit.specs) ? productToEdit.specs : [], // TODO: Parse string if legacy support needed, for now reset or array
        discount: productToEdit.discount || '',
        stock: productToEdit.stock || ''
      });
      setPreviewUrl(productToEdit.imageUrl);
    } else {
      // Reset form when productToEdit becomes null
      setProduct({ name: '', brand: '', price: '', specs: '', discount: '', stock: '' });
      setImageFile(null);
      setPreviewUrl(null);
    }
  }, [productToEdit]); // ... (Handle file change remains same)

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
        brand: product.brand,
        price: Number(product.price),
        specs: product.specs,
        discount: Number(product.discount) || 0,
        stock: Number(product.stock) || 0
      };

      // ... (rest of submit logic)

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
        if (onClearEdit) onClearEdit();
      } else {
        // ADD MODE
        await Promise.race([
          addProduct(productData, imageFile),
          timeoutPromise
        ]);
        alert("Product Added Successfully!");
      }

      // Reset form
      setProduct({ name: '', brand: '', price: '', specs: '', discount: '', stock: '' });
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
        {/* ... Header ... */}
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

          {/* Left Column: Image Upload */}
          <div className="space-y-6">
            <div className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-400 transition cursor-pointer">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-4" />
              ) : (
                <div className="text-center p-6">
                  <span className="text-4xl">📷</span>
                  <p className="text-sm text-gray-500 mt-2 font-medium">Click to upload product image</p>
                </div>
              )}
              <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                placeholder="e.g. iPhone 15 Pro Max"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                required
              />
            </div>

            {/* BRAND FIELD ADDED HERE */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                placeholder="e.g. Apple, Samsung"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={product.brand}
                onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  placeholder="69999"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={product.discount}
                  onChange={(e) => setProduct({ ...product, discount: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={product.stock}
                    onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Specifications</label>

              <div className="space-y-3">
                {/* If specs is a string (legacy), show it or convert it. Ideally we start fresh or support both. 
                        Let's handle the UI state: we'll convert legacy string to array if needed on load, 
                        or just assume array for new pattern. 
                        But we need to handle the state initialization first.
                    */}

                {(Array.isArray(product.specs) ? product.specs : []).map((spec, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Key (e.g. RAM)"
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-sm"
                      value={spec.key}
                      onChange={(e) => {
                        const newSpecs = [...(product.specs || [])];
                        newSpecs[index] = { ...newSpecs[index], key: e.target.value };
                        setProduct({ ...product, specs: newSpecs });
                      }}
                    />
                    <span className="text-gray-400">:</span>
                    <input
                      type="text"
                      placeholder="Value (e.g. 12GB)"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-sm"
                      value={spec.value}
                      onChange={(e) => {
                        const newSpecs = [...(product.specs || [])];
                        newSpecs[index] = { ...newSpecs[index], value: e.target.value };
                        setProduct({ ...product, specs: newSpecs });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newSpecs = product.specs.filter((_, i) => i !== index);
                        setProduct({ ...product, specs: newSpecs });
                      }}
                      className="text-red-500 hover:text-red-700 font-bold px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newSpecs = [...(Array.isArray(product.specs) ? product.specs : []), { key: '', value: '' }];
                    setProduct({ ...product, specs: newSpecs });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                  + Add Specification
                </button>
              </div>
            </div>
            {/* Submit Button */}
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