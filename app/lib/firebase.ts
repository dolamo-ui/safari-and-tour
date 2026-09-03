import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDm6ezXKpZSjhWRF29CCIhdlMMmUdyiqwc",
  authDomain: "malinka-tour.firebaseapp.com",
  projectId: "malinka-tour",
  storageBucket: "malinka-tour.firebasestorage.app",
  messagingSenderId: "256112994901",
  appId: "1:256112994901:web:bc4855cd9563ae297342dc",
  measurementId: "G-3J6L6DEQN8",
};

// Prevent double-initialization during Next.js Fast Refresh
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firestore so your booking form can write to the "bookings" collection
export const db = getFirestore(app);

// Export Auth so the admin dashboard can gate access behind a login
export const auth = getAuth(app);

// Initialize Analytics only in the browser (optional)
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) getAnalytics(app);
  });
}