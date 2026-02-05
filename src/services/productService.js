import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// Fetch all products
export const getAllProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting products: ", error);
        return [];
    }
};

// Add a single product (Admin helper)
export const addProduct = async (productData) => {
    try {
        await addDoc(collection(db, "products"), productData);
    } catch (error) {
        console.error("Error adding product: ", error);
        throw error;
    }
};

// Seed demo products
export const seedProducts = async () => {
    const sampleProducts = [
        { name: "iPhone 15", price: 79999, specs: "128GB, Midnight Black" },
        { name: "Samsung Galaxy S24 Ultra", price: 129999, specs: "256GB, Titanium Grey" },
        { name: "OnePlus 12 5G", price: 64999, specs: "16GB RAM, Flowy Emerald" },
        { name: "Redmi Note 13 Pro+", price: 31999, specs: "12GB RAM, 256GB" },
        { name: "Vivo V30 Pro", price: 41999, specs: "Portrait Master, Andaman Blue" }
    ];

    try {
        for (const product of sampleProducts) {
            await addDoc(collection(db, "products"), product);
        }
        alert("Demo products added! Refresh the page.");
    } catch (error) {
        console.error("Error seeding products:", error);
    }
};