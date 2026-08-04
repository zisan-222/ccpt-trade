// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyApkKni5c826UoJVoD6pGHrzLYYvTEHK0M",
  authDomain: "ccpt-trade.firebaseapp.com",
  projectId: "ccpt-trade",
  storageBucket: "ccpt-trade.firebasestorage.app",
  messagingSenderId: "461751033270",
  appId: "1:461751033270:web:7fdc3f9a206cbf2218b517"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export
export const auth = getAuth(app);
export const db = getFirestore(app);
