import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebaseConfig";

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// ✅ Login User
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user role from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    let role = "customer"; // Default role

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role) {
        role = userData.role;
      }
    }
    
    return { user, role };
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// ✅ Register Customer
export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "customer",
      createdAt: new Date().toISOString()
    });

    return user;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

// ✅ Create Staff Account (Calls Cloud Function)
export const createStaffAccount = async (email, password, displayName) => {
  const createStaff = httpsCallable(functions, 'createStaffAccount');
  const result = await createStaff({ email, password, displayName });
  return result.data;
};

// ✅ Logout
export const logoutUser = async () => {
    await signOut(auth);
};

// ✅ Listen to Auth State
export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};