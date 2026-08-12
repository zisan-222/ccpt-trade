/* ==========================================
   CPTMARKETS ADMIN PANEL
   admin.js
========================================== */

import { auth, db } from "./firebase/firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* ==========================================
   ADMIN ACCESS
========================================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    console.log("Admin authenticated:", user.email);

    await loadUsers();

});


/* ==========================================
   LOAD USERS
========================================== */

async function loadUsers() {

    try {

        const usersSnapshot = await getDocs(
            collection(db, "users")
        );

        console.log(
            "Total users:",
            usersSnapshot.size
        );

        const userCount = document.getElementById("userCount");

        if (userCount) {
            userCount.textContent = usersSnapshot.size;
        }

    } catch (error) {

        console.error(
            "Failed to load users:",
            error
        );

    }

}


/* ==========================================
   ADMIN LOGOUT
========================================== */

const logoutButton =
    document.getElementById("adminLogout");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "index.html";

            } catch (error) {

                console.error(
                    "Logout failed:",
                    error
                );

            }

        }
    );

}


/* ==========================================
   ADMIN PANEL READY
========================================== */

console.log(
    "CPTMARKETS Admin Panel loaded successfully."
);
