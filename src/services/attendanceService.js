import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';

const attendanceCollection = collection(db, "attendance");

// Helper to get today's date string (YYYY-MM-DD)
const getTodayDate = () => new Date().toISOString().split('T')[0];

export const checkTodayStatus = async (userId) => {
    const today = getTodayDate();
    const docId = `${userId}_${today}`;
    const docRef = doc(db, "attendance", docId);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null; // Not punched in yet
};

export const markCheckIn = async (user) => {
    const today = getTodayDate();
    const docId = `${user.uid}_${today}`;
    const docRef = doc(db, "attendance", docId);

    const data = {
        userId: user.uid,
        userName: user.email.split('@')[0], // Simple name derived from email
        date: today,
        checkInTime: new Date().toISOString(),
        checkOutTime: null,
        status: 'present'
    };

    await setDoc(docRef, data);
    return data;
};

export const markCheckOut = async (userId) => {
    const today = getTodayDate();
    const docId = `${userId}_${today}`;
    const docRef = doc(db, "attendance", docId);

    await updateDoc(docRef, {
        checkOutTime: new Date().toISOString()
    });
    return true;
};

// For Admin: Get all attendance for a specific date
export const getAttendanceByDate = async (dateStr) => {
    const q = query(attendanceCollection, where("date", "==", dateStr));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
};

// For Admin: Get Count of Currently Active Staff
export const getActiveStaffCount = async () => {
    const today = getTodayDate();
    const q = query(attendanceCollection, where("date", "==", today), where("checkOutTime", "==", null));
    const snapshot = await getDocs(q);
    return snapshot.size;
};