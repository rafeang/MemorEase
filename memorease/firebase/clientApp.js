
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, getDocs, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    // apiKey: `${process.env.FIREBASE_API_KEY}`,
    // authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}`,
    // projectId: `${process.env.FIREBASE_PROJECT_ID}`,
    // storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
    // messagingSenderId: `${process.env.FIREBASE_MESSAGING_SENDER_ID}`,
    // appId: `${process.env.FIREBASE_APP_ID}`,
    // can't get process.env to work for some reason
    apiKey: "AIzaSyDWohX2aFZWDLe47ix_4BaATguSaOHhzkI",
    authDomain: "memorease-9a0bf.firebaseapp.com",
    projectId: "memorease-9a0bf",
    storageBucket: "memorease-9a0bf.appspot.com",
    messagingSenderId: "499880311177",
    appId: "1:499880311177:web:6c69af4849d58cc97dc958"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Create a root reference
const storage = getStorage();


export { app, db, storage, ref, uploadBytesResumable, getDownloadURL };