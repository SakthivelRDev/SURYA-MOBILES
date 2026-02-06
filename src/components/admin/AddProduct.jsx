import React, { useState } from 'react';
import { db, storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

const AddProduct = () => {
  const [product, setProduct] = useState({ name: '', price: '', specs: '' });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      // 1. Upload Image if selected
      if (imageFile) {
        // Create a unique reference: products/1739829_iphone.jpg
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        
        // Upload
        const snapshot = await uploadBytes(storageRef, imageFile);
        
        // Get URL
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Save Data to Firestore
      await addDoc(collection(db, "products"), {
        name: product.name,
        price: Number(product.price),
        specs: product.specs,
        imageUrl: imageUrl, // Save the link
        createdAt: new Date().toISOString()
      });

      alert("Product Added Successfully!");
      setProduct({ name: '', price: '', specs: '' });
      setImageFile(null);

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
        
        <input 
          placeholder="Product Name" 
          className="border p-2"
          value={product.name} 
          onChange={(e) => setProduct({...product, name: e.target.value})} 
          required
        />
        
        <input 
          type="number" 
          placeholder="Price" 
          className="border p-2"
          value={product.price} 
          onChange={(e) => setProduct({...product, price: e.target.value})} 
          required
        />

        <input 
          placeholder="Specs (e.g. 128GB, Black)" 
          className="border p-2"
          value={product.specs} 
          onChange={(e) => setProduct({...product, specs: e.target.value})} 
        />

        {/* FILE INPUT */}
        <div>
            <label className="block text-sm font-bold mb-1">Product Image</label>
            <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="border p-2 w-full"
            />
        </div>

        <button disabled={loading} className="bg-orange-600 text-white p-2 rounded">
            {loading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;