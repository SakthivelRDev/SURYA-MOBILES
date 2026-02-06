import { db, storage } from '../firebaseConfig';
import { collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Collection ref
const productCollection = collection(db, "products");

// 1. Fetch all products
export const getAllProducts = async () => {
    try {
        const querySnapshot = await getDocs(productCollection);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting products: ", error);
        return [];
    }
};

// 2. Fetch single product
export const getProductById = async (id) => {
    try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting product:", error);
        throw error;
    }
};

// 3. Add a single product
export const addProduct = async (productData, imageFile) => {
    try {
        let imageUrl = "";

        // Upload Image if exists
        if (imageFile) {
            imageUrl = await uploadProductImage(imageFile);
        }

        const newProduct = { ...productData, imageUrl, createdAt: new Date().toISOString() };
        await addDoc(productCollection, newProduct);
        return true;
    } catch (error) {
        console.error("Error adding product: ", error);
        throw error;
    }
};

// 4. Update product
export const updateProduct = async (id, productData, imageFile) => {
    try {
        const docRef = doc(db, "products", id);
        let updatedData = { ...productData };

        if (imageFile) {
            const imageUrl = await uploadProductImage(imageFile);
            updatedData.imageUrl = imageUrl;
        }

        await updateDoc(docRef, updatedData);
        return true;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

// 5. Delete product
export const deleteProduct = async (id) => {
    try {
        await deleteDoc(doc(db, "products", id));
        return true;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

// Helper: Upload Image to Firebase Storage
const uploadProductImage = async (file) => {
    try {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Image upload failed");
    }
};

