import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAse2I0D2TlfyXXzhoHTraG5R6QEphllVE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "spliy-expense-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "spliy-expense-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "spliy-expense-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "530776942195",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:530776942195:web:5838e23c250d5e721e2c06",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9ZCE53653E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 