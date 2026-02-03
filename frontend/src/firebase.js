// Firebase Configuration for UrbanShift
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyArhE5NlbXQvkHpKS8XjMONh5sBEEaMOyo",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "urbanshift-b2b1a.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "urbanshift-b2b1a",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "urbanshift-b2b1a.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "936743970859",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:936743970859:web:29326395694b08c2ab226e",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-ZVH78RX8C1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
