import { db } from '../firebaseConfig';
import { collection, addDoc, runTransaction, doc, query, getDocs, limit } from 'firebase/firestore';

const salesCollection = collection(db, "sales");

// Record an offline sale (Deducts stock + Adds sales record)
export const recordOfflineSale = async (items, totalAmount, soldBy) => {
    try {
        await runTransaction(db, async (transaction) => {
            // 1. Check stock for all items
            const productReads = await Promise.all(
                items.map(item => transaction.get(doc(db, "products", item.id)))
            );

            // 2. Validate stock
            productReads.forEach((productDoc, index) => {
                const item = items[index];
                if (!productDoc.exists()) {
                    throw new Error(`Product ${item.name} does not exist!`);
                }
                const currentStock = productDoc.data().stock || 0;
                if (currentStock < item.qty) {
                    throw new Error(`Insufficient stock for ${item.name}. Available: ${currentStock}`);
                }
            });

            // 3. Deduct stock
            productReads.forEach((productDoc, index) => {
                const item = items[index];
                const currentStock = productDoc.data().stock || 0;
                const newStock = currentStock - item.qty;
                transaction.update(doc(db, "products", item.id), { stock: newStock });
            });

            // 4. Create Sale Record
            const saleData = {
                items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
                totalAmount: Number(totalAmount),
                soldBy: soldBy || 'Admin', // 'Admin' or Staff Name
                type: 'offline', // 'offline' or 'online'
                date: new Date().toISOString()
            };

            // Note: transaction.set is needed for new docs if we want atomicity, 
            // but for a new collection doc, we can just use another write. 
            // However, addDoc isn't part of 'transaction'. 
            // We will use a ref for the new sale to include it in transaction.
            const newSaleRef = doc(salesCollection);
            transaction.set(newSaleRef, saleData);
        });

        return true;
    } catch (error) {
        console.error("Transaction failed: ", error);
        throw error;
    }
};

// Create Online Order (Pickup/Delivery)
export const createOrder = async (orderData) => {
    // Generate Random 6-digit Logic for Pickup
    const pickupCode = orderData.type === 'pickup' ? Math.floor(100000 + Math.random() * 900000).toString() : null;

    try {
        await runTransaction(db, async (transaction) => {
            // 1. Check & Deduct Stock
            const productReads = await Promise.all(
                orderData.items.map(item => transaction.get(doc(db, "products", item.id)))
            );

            productReads.forEach((productDoc, index) => {
                const item = orderData.items[index];
                if (!productDoc.exists()) throw new Error(`Product ${item.name} unavailable.`);
                const currentStock = productDoc.data().stock || 0;
                if (currentStock < item.qty) throw new Error(`Insufficient stock for ${item.name}. Available: ${currentStock}`);

                transaction.update(doc(db, "products", item.id), {
                    stock: currentStock - item.qty
                });
            });

            // 2. Create Order
            const newOrderRef = doc(collection(db, "orders"));
            transaction.set(newOrderRef, {
                ...orderData,
                pickupCode,
                status: 'pending', // pending -> completed
                createdAt: new Date().toISOString()
            });
        });

        return pickupCode; // Return code to show user
    } catch (error) {
        console.error("Order Creation Failed:", error);
        throw error;
    }
};


// Get Dashboard Stats (Recent Sales & Today's Revenue)
export const getDashboardStats = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // 1. Fetch Recent Offline Sales
        const salesQ = query(salesCollection, limit(10)); // Ideally sort by date desc
        const salesSnap = await getDocs(salesQ);
        const sales = salesSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Store Sale' }));

        // 2. Fetch Recent Online Orders
        const ordersQ = query(collection(db, "orders"), limit(10));
        const ordersSnap = await getDocs(ordersQ);
        const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Online Order' }));

        // 3. Merge & Sort
        const allTransactions = [...sales, ...orders].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).slice(0, 10);

        // 4. Calculate Today's Revenue
        // Note: For production, use specific date queries. Here we filter client-side for simplicity.
        const todayRevenue = [...sales, ...orders]
            .filter(t => (t.date || t.createdAt).startsWith(today))
            .reduce((sum, t) => sum + (t.totalAmount || t.total), 0);

        const totalSold = [...sales, ...orders]
            .filter(t => (t.date || t.createdAt).startsWith(today))
            .reduce((sum, t) => sum + (t.items ? t.items.length : 0), 0);

        return {
            recentTransactions: allTransactions,
            todayRevenue,
            todayCount: totalSold
        };

    } catch (error) {
        console.error("Stats Fetch Error:", error);
        return { recentTransactions: [], todayRevenue: 0, todayCount: 0 };
    }
};
