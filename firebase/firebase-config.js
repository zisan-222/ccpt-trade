// ==========================================
// CPTMARKETS
// Firebase Configuration
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAbSup8aEQ7bgSyLeqx6RMpnjoFxYu204M",
    authDomain: "cptmarket-5b843.firebaseapp.com",
    databaseURL: "https://cptmarket-5b843-default-rtdb.firebaseio.com",
    projectId: "cptmarket-5b843",
    storageBucket: "cptmarket-5b843.firebasestorage.app",
    messagingSenderId: "270504953481",
    appId: "1:270504953481:web:a108213c2161fcffa16858"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
const auth = getAuth(app);

// Firestore Database
const db = getFirestore(app);

// Realtime Database
const realtimeDB = getDatabase(app);

// Export for other files
export {
    app,
    auth,
    db,
    realtimeDB
};
