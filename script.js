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

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

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
// LOGIN FORM
// ==========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const username =
                document
                .getElementById("username")
                .value
                .trim();


            const password =
                passwordInput.value;


            // ======================================
            // EMPTY INPUT CHECK
            // ======================================

            if (!username || !password) {

                alert(
                    "Please enter Username and Password."
                );

                return;

            }


            try {

                // ==================================
                // CREATE INTERNAL EMAIL
                // ==================================

                const email =
                    username.toLowerCase()
                    + "@cptmarkets.local";


                // ==================================
                // FIREBASE LOGIN
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
                // GET USER DATA
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
                // SAVE CURRENT SESSION
                // ==================================

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify({

                        uid:
                            firebaseUser.uid,

                        userId:
                            userData.userId ||
                            "",

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
                // DIRECT DASHBOARD
                // ==================================

                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Login failed:",
                    error
                );


                // ==================================
                // LOGIN ERROR
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
                        "Login failed: " +
                        error.message
                    );

                }

            }

        }
    );

}
