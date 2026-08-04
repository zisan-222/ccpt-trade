// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApkKni5c826UoJVoD6pGHrzLYYvTEHK0M",
  authDomain: "ccpt-trade.firebaseapp.com",
  projectId: "ccpt-trade",
  storageBucket: "ccpt-trade.firebasestorage.app",
  messagingSenderId: "461751033270",
  appId: "1:461751033270:web:7fdc3f9a206cbf2218b517",
  measurementId: "G-V11RSJDECT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
