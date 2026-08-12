// ==========================================
// CPTMARKETS FIREBASE CONFIG
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyAbSup8aEQ7bgSyLeqx6RMpnjoFxYu204M",

    authDomain: "cptmarket-5b843.firebaseapp.com",

    databaseURL:
        "https://cptmarket-5b843-default-rtdb.firebaseio.com",

    projectId: "cptmarket-5b843",

    storageBucket:
        "cptmarket-5b843.firebasestorage.app",

    messagingSenderId: "270504953481",

    appId:
        "1:270504953481:web:a108213c2161fcffa16858"

};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);


// ==========================================
// FIREBASE AUTHENTICATION
// ==========================================

const auth = getAuth(app);


// ==========================================
// FIRESTORE DATABASE
// ==========================================

const db = getFirestore(app);


// ==========================================
// EXPORT
// ==========================================

export {
    app,
    auth,
    db
};
