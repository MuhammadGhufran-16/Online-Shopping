import { initializeApp, getApps, getApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCyLeNScBEBCjGOfYX6PjV453D1pUP4fvc",
  authDomain: "online-shopping-cb024.firebaseapp.com",
  projectId: "online-shopping-cb024",

  // IMPORTANT
  storageBucket: "online-shopping-cb024.firebasestorage.app",

  messagingSenderId: "720570940182",
  appId: "1:720570940182:web:8e783a79e8cf8622762e37",
  measurementId: "G-B4GTC7X3GF",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/* FIRESTORE */
export const db = getFirestore(app);
console.log("App:", app);
console.log("DB:", db);
console.log("App name:", app.name);
export default app;