import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCyLeNScBEBCjGOfYX6PjV453D1pUP4fvc",
  authDomain: "online-shopping-cb024.firebaseapp.com",
  projectId: "online-shopping-cb024",
  storageBucket: "online-shopping-cb024.firebasestorage.app",
  messagingSenderId: "720570940182",
  appId: "1:720570940182:web:8e783a79e8cf8622762e37",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore DB
export const db = getFirestore(app);
export const storage = getStorage(app);
