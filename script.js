// ==========================================
// CPTMARKETS LOGIN
// Firebase Authentication
// ==========================================

import { auth, db } from "./firebase/firebase-config.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");

        } else {

            passwordInput.type = "password";

            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");

        }

    });

}


// ==========================================
// LOGIN FORM
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        // ==================================
        // GET USERNAME
        // ==================================

        const usernameInput =
            document.getElementById("username");

        const username =
            usernameInput
                ? usernameInput.value.trim()
                : "";

        // ==================================
        // GET PASSWORD
        // ==================================

        const password =
            passwordInput
                ? passwordInput.value
                : "";

        // ==================================
        // CHECK EMPTY FIELDS
        // ==================================

        if (!username || !password) {

            alert(
                "Please enter Username and Password."
            );

            return;
        }


        // ==================================
        // DISABLE BUTTON WHILE LOGIN
        // ==================================

        const loginButton =
            loginForm.querySelector(".login-btn");

        if (loginButton) {

            loginButton.disabled = true;

            loginButton.textContent = "Signing In...";

        }


        // ==================================
        // FIREBASE LOGIN
        // ==================================

        try {

            /*
             * Register system uses:
             *
             * username@cptmarkets.local
             */

            const email =
                username.toLowerCase()
                + "@cptmarkets.local";


            // ==================================
            // FIREBASE AUTHENTICATION
            // ==================================

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const firebaseUser =
                userCredential.user;


            // ==================================
            // GET USER DATA FROM FIRESTORE
            // ==================================

            const userDoc =
                await getDoc(
                    doc(
                        db,
                        "users",
                        firebaseUser.uid
                    )
                );


            // ==================================
            // USER DATA NOT FOUND
            // ==================================

            if (!userDoc.exists()) {

                alert(
                    "User account data was not found."
                );

                return;
            }


            const userData =
                userDoc.data();


            // ==================================
            // SAVE CURRENT USER SESSION
            // ==================================

            localStorage.setItem(
                "currentUser",
                JSON.stringify({

                    uid:
                        firebaseUser.uid,

                    username:
                        userData.username ||
                        username,

                    email:
                        userData.email ||
                        email,

                    balance:
                        Number(
                            userData.balance || 0
                        )

                })
            );


            // ==================================
            // LOGIN SUCCESS
            // ==================================

            alert("Login Success");


            // ==================================
            // GO TO DASHBOARD
            // ==================================

            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "Login failed:",
                error
            );


            // ==================================
            // RESTORE BUTTON
            // ==================================

            if (loginButton) {

                loginButton.disabled = false;

                loginButton.textContent =
                    "Go to Sign In";

            }


            // ==================================
            // FIREBASE ERROR HANDLING
            // ==================================

            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                alert(
                    "Wrong Username or Password."
                );

            }

            else if (
                error.code ===
                "auth/user-not-found"
            ) {

                alert(
                    "Username not found."
                );

            }

            else if (
                error.code ===
                "auth/wrong-password"
            ) {

                alert(
                    "Wrong Password."
                );

            }

            else {

                alert(
                    "Login failed: "
                    + error.message
                );

            }

        }

    });

}
