
/* ==========================================
   CPTMARKETS ADMIN PANEL
   admin.js - ADMIN EMAIL SECURITY
========================================== */

import { auth } from "./firebase/firebase-config.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* ==========================================
   AUTHORIZED ADMIN
========================================== */

const ADMIN_EMAIL = "mdzisanzisan000@gmail.com";


/* ==========================================
   ADMIN LOGIN FORM
========================================== */

const loginForm = document.getElementById("adminLoginForm");
const loginError = document.getElementById("loginError");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document
            .getElementById("adminUsername")
            .value.trim()
            .toLowerCase();

        const password = document
            .getElementById("adminPassword")
            .value;

        if (loginError) {
            loginError.style.display = "none";
        }

        // Check authorized email before login
        if (email !== ADMIN_EMAIL) {

            if (loginError) {
                loginError.textContent =
                    "Access denied. Admin account only.";

                loginError.style.display = "block";
            }

            return;
        }

        try {

            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            if (
                result.user.email?.toLowerCase() !== ADMIN_EMAIL
            ) {
                await signOut(auth);

                throw new Error("Unauthorized admin account.");
            }

            window.location.href = "admin-dashboard.html";

        } catch (error) {

            console.error("Admin login failed:", error);

            if (loginError) {
                loginError.textContent =
                    "Invalid admin email or password.";

                loginError.style.display = "block";
            }
        }

    });

}


/* ==========================================
   ADMIN DASHBOARD AUTH CHECK
========================================== */

onAuthStateChanged(auth, async function (user) {

    const currentPage = window.location.pathname;

    if (currentPage.includes("admin-dashboard.html")) {

        if (!user) {

            window.location.replace("admin.html");
            return;
        }

        if (
            user.email?.toLowerCase() !== ADMIN_EMAIL
        ) {

            await signOut(auth);

            window.location.replace("admin.html");
            return;
        }

        console.log("Authorized Admin:", user.email);
    }

});


/* ==========================================
   ADMIN LOGOUT
========================================== */

const logoutButton = document.getElementById("adminLogout");

if (logoutButton) {

    logoutButton.addEventListener("click", async function () {

        try {

            await signOut(auth);

            window.location.replace("admin.html");

        } catch (error) {

            console.error("Logout failed:", error);

        }

    });

}


console.log("CPTMARKETS Admin Security Loaded.");
