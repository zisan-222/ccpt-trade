// ==========================================
// CPTMARKETS LOGIN
// Firebase Authentication
// Professional Popup System
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

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.querySelector(".password-toggle") || document.getElementById("togglePassword");

if (togglePassword && passwordInput) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePassword.classList.remove(
                    "fa-eye"
                );

                togglePassword.classList.add(
                    "fa-eye-slash"
                );

            } else {

                passwordInput.type = "password";

                togglePassword.classList.remove(
                    "fa-eye-slash"
                );

                togglePassword.classList.add(
                    "fa-eye"
                );

            }

        }
    );

}


// ==========================================
// LOGIN FORM & BUTTON
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const loginButton =
    loginForm
        ? loginForm.querySelector(".login-btn")
        : null;


// ==========================================
// PREVENT AUTO-SUBMIT FROM BROWSER AUTOFILL
// Tracks User Action (Click or Press Enter)
// ==========================================

let isUserInitiated = false;

if (loginButton) {
    loginButton.addEventListener("click", function () {
        isUserInitiated = true;
    });
}

if (loginForm) {
    loginForm.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            isUserInitiated = true;
        }
    });
}


// ==========================================
// LOGIN FORM SUBMIT
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            // ==================================
            // BLOCK AUTOMATIC BROWSER SUBMIT
            // ==================================
            if (!isUserInitiated) {
                return false;
            }

            // Immediately reset after standard trigger
            isUserInitiated = false;


            // ==================================
            // GET USERNAME
            // ==================================

            const usernameInput = document.getElementById("username");
            const username = usernameInput ? usernameInput.value.trim() : "";


            // ==================================
            // GET PASSWORD
            // ==================================

            const password = passwordInput ? passwordInput.value : "";


            // ==================================
            // CHECK EMPTY FIELDS
            // ==================================

            if (!username && !password) {

                showCPTPopup(
                    "error",
                    "Login Required",
                    "Please enter your Username and Password.",
                    null,
                    "Try Again"
                );

                return;

            }


            if (!username) {

                showCPTPopup(
                    "error",
                    "Username Required",
                    "Please enter your Username.",
                    null,
                    "Try Again"
                );

                if (usernameInput) usernameInput.focus();

                return;

            }


            if (!password) {

                showCPTPopup(
                    "error",
                    "Password Required",
                    "Please enter your Password.",
                    null,
                    "Try Again"
                );

                if (passwordInput) passwordInput.focus();

                return;

            }


            // Disable button during loading
            if (loginButton) {
                loginButton.disabled = true;
            }


            // ==================================
            // FIREBASE LOGIN
            // ==================================

            try {

                const email =
                    username.toLowerCase()
                    + "@cptmarkets.local";

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                const firebaseUser =
                    userCredential.user;

                const userDoc =
                    await getDoc(
                        doc(
                            db,
                            "users",
                            firebaseUser.uid
                        )
                    );


                if (!userDoc.exists()) {

                    showCPTPopup(
                        "error",
                        "Account Data Not Found",
                        "Your authentication was successful, but your account data could not be found.",
                        null,
                        "Try Again"
                    );

                    if (loginButton) loginButton.disabled = false;
                    return;

                }


                const userData =
                    userDoc.data();

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

                showCPTPopup(
                    "success",
                    "Login Successful!",
                    "Welcome back, " +
                    (
                        userData.username ||
                        username
                    ) +
                    ". You have successfully signed in.",
                    null,
                    "Continue",
                    function () {

                        window.location.href =
                            "dashboard.html";

                    }
                );

                // পপআপ আসার পর বাটনটি পুনরায় সক্রিয় রাখা যাতে ক্যান্সেল করলেও সমস্যা না হয়
                if (loginButton) {
                    loginButton.disabled = false;
                }


            } catch (error) {

                console.error(
                    "Login failed:",
                    error
                );

                // Enable button back on error
                if (loginButton) {
                    loginButton.disabled = false;
                }


                // ==================================
                // LOGIN ERRORS
                // ==================================

                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    showCPTPopup(
                        "error",
                        "Incorrect Login Details",
                        "The Username or Password you entered is incorrect. Please check your details and try again.",
                        null,
                        "Try Again"
                    );

                }

                else if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    showCPTPopup(
                        "error",
                        "Username Not Found",
                        "No account was found with this Username. Please check your Username or create a new account.",
                        null,
                        "Try Again"
                    );

                }

                else if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    showCPTPopup(
                        "error",
                        "Incorrect Password",
                        "The Password you entered is incorrect. Please try again.",
                        null,
                        "Try Again"
                    );

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    showCPTPopup(
                        "error",
                        "Invalid Username",
                        "Please enter a valid Username.",
                        null,
                        "Try Again"
                    );

                }

                else if (
                    error.code ===
                    "auth/too-many-requests"
                ) {

                    showCPTPopup(
                        "error",
                        "Too Many Attempts",
                        "Too many unsuccessful login attempts. Please wait a moment and try again.",
                        null,
                        "Try Again"
                    );

                }

                else {

                    showCPTPopup(
                        "error",
                        "Login Failed",
                        error.message ||
                        "Unable to sign in. Please try again.",
                        null,
                        "Try Again"
                    );

                }

            }

        }
    );

}
