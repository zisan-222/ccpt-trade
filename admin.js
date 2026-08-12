/* ==========================================
   CPTMARKETS ADMIN PANEL
   admin.js
========================================== */

import { auth } from "./firebase/firebase-config.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* ==========================================
   ADMIN LOGIN FORM
========================================== */

const loginForm = document.getElementById("adminLoginForm");
const loginError = document.getElementById("loginError");


if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const usernameInput =
            document.getElementById("adminUsername");

        const passwordInput =
            document.getElementById("adminPassword");

        const email =
            usernameInput.value.trim();

        const password =
            passwordInput.value;

        if (loginError) {
            loginError.style.display = "none";
        }

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            console.log("Admin login successful.");

            /*
             * আপাতত admin.html-এই থাকবে।
             * পরের ধাপে আমরা Admin Dashboard তৈরি করব।
             */

            window.location.href = "admin-dashboard.html";

        } catch (error) {

            console.error(
                "Admin login failed:",
                error
            );

            if (loginError) {

                loginError.textContent =
                    "Invalid email or password.";

                loginError.style.display =
                    "block";
            }

        }

    });

}


/* ==========================================
   ADMIN DASHBOARD AUTH CHECK
========================================== */

onAuthStateChanged(auth, function (user) {

    const currentPage =
        window.location.pathname;

    if (
        currentPage.includes("admin-dashboard.html")
    ) {

        if (!user) {

            window.location.href =
                "admin.html";

            return;
        }

        console.log(
            "Admin dashboard authenticated:",
            user.email
        );
    }

});


/* ==========================================
   ADMIN LOGOUT
========================================== */

const logoutButton =
    document.getElementById("adminLogout");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                await signOut(auth);

                window.location.href =
                    "admin.html";

            } catch (error) {

                console.error(
                    "Logout failed:",
                    error
                );

            }

        }
    );

}


console.log(
    "CPTMARKETS Admin system loaded successfully."
);
