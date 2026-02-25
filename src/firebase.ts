// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD7-5y1GXj-IaXqhW078c52RgeYIvRqCTs",
    authDomain: "mkterfb.firebaseapp.com",
    projectId: "mkterfb",
    storageBucket: "mkterfb.firebasestorage.app",
    messagingSenderId: "510060612793",
    appId: "1:510060612793:web:649d7ecb0eb663102d1f68",
    measurementId: "G-7LQ7M1SKFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

export { app, analytics, db };
