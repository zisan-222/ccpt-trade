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


            if (!username || !password) {

                alert(
                    "Please enter Username and Password."
                );

                return;
            }


            // ======================================
            // LOGIN BUTTON
            // ======================================

            const loginButton =
                loginForm.querySelector(
                    'button[type="submit"]'
                );


            /*
             * Prevent multiple clicks
             */

            if (loginButton) {

                loginButton.disabled = true;

                loginButton.innerHTML = `
                    <span
                        style="
                            display:inline-block;
                            width:17px;
                            height:17px;
                            border:3px solid rgba(0,0,0,0.25);
                            border-top-color:#000;
                            border-radius:50%;
                            vertical-align:-3px;
                            margin-right:8px;
                            animation:cptLoginSpin 0.8s linear infinite;
                        "
                    ></span>
                    Please Wait...
                `;

            }


            /*
             * Add loading animation
             * without changing style.css
             */

            if (
                !document.getElementById(
                    "cptLoginSpinnerStyle"
                )
            ) {

                const style =
                    document.createElement("style");

                style.id =
                    "cptLoginSpinnerStyle";

                style.textContent = `
                    @keyframes cptLoginSpin {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `;

                document.head.appendChild(style);

            }


            try {

                /*
                 * Register system creates an
                 * internal Firebase email from
                 * the username.
                 */

                const email =
                    username.toLowerCase()
                    + "@cptmarkets.local";


                /*
                 * Firebase Login
                 */

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const firebaseUser =
                    userCredential.user;


                /*
                 * Get user information
                 * from Firestore.
                 */

                const userDoc =
                    await getDoc(
                        doc(
                            db,
                            "users",
                            firebaseUser.uid
                        )
                    );


                if (!userDoc.exists()) {

                    /*
                     * Restore button
                     */

                    if (loginButton) {

                        loginButton.disabled = false;

                        loginButton.innerHTML =
                            "Go to Sign In";

                    }

                    alert(
                        "User account data was not found."
                    );

                    return;
                }


                const userData =
                    userDoc.data();


                /*
                 * Save current session
                 * for the existing dashboard.
                 */

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


                // ======================================
                // LOADING TIME
                // ======================================

                /*
                 * Keep the loading visible for
                 * about 1.5 seconds.
                 */

                await new Promise(
                    function (resolve) {

                        setTimeout(
                            resolve,
                            1500
                        );

                    }
                );


                // ======================================
                // LOGIN SUCCESS
                // ======================================

                alert(
                    "Login Successful"
                );


                // ======================================
                // GO TO DASHBOARD
                // ======================================

                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Login failed:",
                    error
                );


                /*
                 * Restore button after
                 * unsuccessful login.
                 */

                if (loginButton) {

                    loginButton.disabled =
                        false;

                    loginButton.innerHTML =
                        "Go to Sign In";

                }


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

        }
    );

}
