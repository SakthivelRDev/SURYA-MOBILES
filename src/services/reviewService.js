import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';

const reviewCollection = collection(db, "reviews");
const ordersCollection = collection(db, "orders");

// 1. Add Review (Verified Only)
export const addVerifiedReview = async (productId, userId, userName, rating, comment) => {
    // A. Check if user bought product
    const ordersQ = query(ordersCollection, where("userId", "==", userId));
    const ordersSnap = await getDocs(ordersQ);

    let hasPurchased = false;
    ordersSnap.forEach(doc => {
        const order = doc.data();
        if (order.items && order.items.some(item => item.id === productId)) {
            hasPurchased = true;
        }
    });

    if (!hasPurchased) {
        throw new Error("You must purchase this product to leave a review.");
    }

    // B. Check if already reviewed (Optional, but good practice)
    const existingReviewQ = query(reviewCollection, where("productId", "==", productId), where("userId", "==", userId));
    const existingSnap = await getDocs(existingReviewQ);
    if (!existingSnap.empty) {
        throw new Error("You have already reviewed this product.");
    }

    // C. Add Review
    return await addDoc(reviewCollection, {
        productId,
        userId,
        userName,
        rating: Number(rating),
        comment,
        createdAt: new Date().toISOString(),
        verifiedPurchase: true
    });
};

// 2. Get Reviews for Product
export const getProductReviews = async (productId) => {
    try {
        // Note: Removed orderBy("createdAt") to avoid needing a manual Firestore Index. Sorting in JS instead.
        const q = query(reviewCollection, where("productId", "==", productId));
        const snapshot = await getDocs(q);
        const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort by Newest First
        return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};

// 3. Check purchase status (Helper for UI)
export const checkPurchaseStatus = async (userId, productId) => {
    if (!userId) return false;
    const ordersQ = query(ordersCollection, where("userId", "==", userId));
    const ordersSnap = await getDocs(ordersQ);

    let hasPurchased = false;
    ordersSnap.forEach(doc => {
        const order = doc.data();
        if (order.items && order.items.some(item => item.id === productId)) {
            hasPurchased = true;
        }
    });
    return hasPurchased;
};
