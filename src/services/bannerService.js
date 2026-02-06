import { db, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const bannerCollection = collection(db, "banners");

// Helper: Upload Image
const uploadBannerImage = async (file) => {
    try {
        console.log("Starting banner upload for:", file.name);
        const storageRef = ref(storage, `banners/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        console.log("Banner upload successful, URL:", url);
        return url;
    } catch (error) {
        console.error("Error uploading banner image:", error);
        throw new Error("Image upload failed");
    }
};

// Add a new banner
export const addBanner = async (banner, imageFile) => {
    console.log("Adding banner...", banner, "Image file:", imageFile);
    let imageUrl = "";
    if (imageFile) {
        try {
            imageUrl = await uploadBannerImage(imageFile);
        } catch (e) {
            console.error("Upload failed in addBanner", e);
            throw e;
        }
    }

    const docData = {
        ...banner,
        imageUrl,
        createdAt: new Date().toISOString()
    };

    console.log("Saving banner doc:", docData);
    return await addDoc(bannerCollection, docData);
};

// Get all banners (sorted by creation time for now, or add an 'order' field later)
export const getBanners = async () => {
    // For simple ordering, we can sort client-side or use orderBy("createdAt")
    // Let's use flexible client-side sorting or basic fetch here.
    const q = query(bannerCollection);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Delete a banner
export const deleteBanner = async (id) => {
    const bannerDoc = doc(db, "banners", id);
    return await deleteDoc(bannerDoc);
};
