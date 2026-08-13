// =======================================
// CPTMARKETS - MINE PAGE
// Firebase User System
// =======================================

import { auth, db } from "./firebase/firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// =======================================
// PAGE LOAD
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    const name =
        document.getElementById("username");

    const uidElement =
        document.getElementById("userid");

    const avatar =
        document.querySelector(".avatar");


    // ===================================
    // FIREBASE USER
    // ===================================

    onAuthStateChanged(auth, async function (firebaseUser) {

        if (!firebaseUser) {

            if (name) {
                name.textContent = "User";
            }

            if (uidElement) {
                uidElement.textContent = "N/A";
            }

            if (avatar) {
                avatar.textContent = "U";
            }

            return;
        }


        try {

            // ===================================
            // GET FIRESTORE USER
            // ===================================

            const userRef =
                doc(
                    db,
                    "users",
                    firebaseUser.uid
                );


            const userSnap =
                await getDoc(userRef);


            if (!userSnap.exists()) {

                console.error(
                    "User data not found in Firestore."
                );

                if (name) {
                    name.textContent = "User";
                }

                if (uidElement) {
                    uidElement.textContent = "N/A";
                }

                return;
            }


            const userData =
                userSnap.data();


            // ===================================
            // USERNAME
            // ===================================

            const username =
                userData.username ||
                "User";


            // ===================================
            // CUSTOM UID
            // ===================================

            let customUID =
                userData.userId;


            /*
             * Older accounts may not have
             * a custom UID.
             *
             * Create one automatically.
             */

            if (!customUID) {

                customUID =
                    "UID" +
                    Date.now() +
                    Math.floor(
                        100 +
                        Math.random() * 900
                    );


                await updateDoc(
                    userRef,
                    {
                        userId: customUID
                    }
                );

            }


            // ===================================
            // SHOW USERNAME
            // ===================================

            if (name) {

                name.textContent =
                    username;

            }


            // ===================================
            // SHOW UID
            // ===================================

            if (uidElement) {

                uidElement.textContent =
                    customUID;

            }


            // ===================================
            // AVATAR
            // ===================================

            if (avatar) {

                avatar.textContent =
                    username
                    .charAt(0)
                    .toUpperCase();

            }


            // ===================================
            // SAVE CURRENT USER
            // ===================================

            localStorage.setItem(
                "currentUser",
                JSON.stringify({

                    uid:
                        firebaseUser.uid,

                    userId:
                        customUID,

                    username:
                        username,

                    email:
                        userData.email ||
                        firebaseUser.email,

                    balance:
                        Number(
                            userData.balance || 0
                        )

                })
            );


            console.log(
                "CptMarkets User Loaded:",
                username,
                customUID
            );


        } catch (error) {

            console.error(
                "Failed to load user:",
                error
            );

        }

    });


    // ===================================
    // TAWK.TO
    // ===================================

    window.Tawk_API =
        window.Tawk_API || {};

    window.Tawk_LoadStart =
        new Date();


    window.Tawk_API.onLoad =
        function () {

            if (
                typeof window.Tawk_API.hideWidget ===
                "function"
            ) {

                window.Tawk_API.hideWidget();

            }

        };


    function loadTawk() {

        if (
            document.querySelector(
                'script[src*="embed.tawk.to"]'
            )
        ) {
            return;
        }


        const script =
            document.createElement("script");


        script.async = true;

        script.src =
            "https://embed.tawk.to/6a71003c2d507b1d4a9fad4c/1jv4mhrhb";

        script.charset = "UTF-8";

        script.setAttribute(
            "crossorigin",
            "*"
        );


        document.body.appendChild(
            script
        );

    }


    loadTawk();


    // ===================================
    // OPEN SUPPORT CHAT
    // ===================================

    window.openSupportChat =
        function () {

            if (
                window.Tawk_API &&
                typeof window.Tawk_API.showWidget ===
                "function"
            ) {

                window.Tawk_API.showWidget();


                setTimeout(function () {

                    if (
                        typeof window.Tawk_API.maximize ===
                        "function"
                    ) {

                        window.Tawk_API.maximize();

                    }

                }, 300);


                return;
            }


            let attempts = 0;


            const waitTawk =
                setInterval(function () {

                    attempts++;


                    if (
                        window.Tawk_API &&
                        typeof window.Tawk_API.showWidget ===
                        "function"
                    ) {

                        clearInterval(waitTawk);


                        window.Tawk_API.showWidget();


                        setTimeout(function () {

                            if (
                                typeof window.Tawk_API.maximize ===
                                "function"
                            ) {

                                window.Tawk_API.maximize();

                            }

                        }, 300);

                    }


                    if (attempts >= 30) {

                        clearInterval(waitTawk);

                        alert(
                            "Customer Service is loading. Please try again."
                        );

                    }

                }, 500);

        };


    // ===================================
    // HIDE TAWK ICON
    // ===================================

    const hideTawk =
        setInterval(function () {

            if (
                window.Tawk_API &&
                typeof window.Tawk_API.hideWidget ===
                "function"
            ) {

                window.Tawk_API.hideWidget();

                clearInterval(hideTawk);

            }

        }, 500);


    // ===================================
    // MENU BUTTONS
    // ===================================

    const menuRows =
        document.querySelectorAll(".menu-row");


    menuRows.forEach(function (row) {

        row.addEventListener(
            "click",
            function (e) {

                this.style.transform =
                    "scale(0.98)";


                setTimeout(() => {

                    this.style.transform =
                        "scale(1)";

                }, 120);


                const link =
                    this.getAttribute("href");


                if (
                    link &&
                    link !== "#"
                ) {

                    return;

                }


                const span =
                    this.querySelector("span");


                if (!span) {
                    return;
                }


                const buttonName =
                    span.textContent
                    .trim()
                    .toLowerCase();


                if (
                    buttonName ===
                    "my assets"
                ) {

                    e.preventDefault();

                    window.location.href =
                        "assets.html";

                    return;

                }


                if (
                    buttonName ===
                    "my orders"
                ) {

                    e.preventDefault();

                    window.location.href =
                        "orders.html";

                    return;

                }


                if (
                    buttonName ===
                    "copy trading"
                ) {

                    e.preventDefault();

                    window.location.href =
                        "copytrade.html";

                    return;

                }


                if (
                    buttonName ===
                    "loan"
                ) {

                    e.preventDefault();

                    openSupportChat();

                    return;

                }


                if (
                    buttonName ===
                    "wealth / mining"
                ) {

                    e.preventDefault();

                    window.location.href =
                        "investment.html";

                    return;

                }


                if (
                    buttonName ===
                    "invite friends"
                ) {

                    e.preventDefault();

                    window.location.href =
                        "invite.html";

                    return;

                }


                if (
                    buttonName ===
                    "wallet management"
                ) {

                    e.preventDefault();

                    window.location.href =
                        "transfer.html";

                    return;

                }


                if (
                    buttonName ===
                    "security"
                ) {

                    e.preventDefault();

                    openSecurityPage();

                    return;

                }


                if (
                    buttonName ===
                    "announcements"
                ) {

                    e.preventDefault();

                    openAnnouncementsPage();

                    return;

                }


                if (
                    buttonName ===
                    "support"
                ) {

                    e.preventDefault();

                    openSupportChat();

                    return;

                }

            }
        );

    });


    // ===================================
    // SECURITY
    // ===================================

    function openSecurityPage() {

        alert(
            "Security settings will be available soon."
        );

    }


    // ===================================
    // ANNOUNCEMENTS
    // ===================================

    function openAnnouncementsPage() {

        alert(
            "No announcements."
        );

    }


    // ===================================
    // BOTTOM NAVIGATION
    // ===================================

    const bottomNav =
        document.querySelector(".bottom-nav");


    if (bottomNav) {

        const navItems =
            bottomNav.querySelectorAll("a");


        navItems.forEach(function (item) {

            const span =
                item.querySelector("span");


            if (!span) {
                return;
            }


            const text =
                span.textContent
                .trim()
                .toLowerCase();


            if (text === "home") {

                item.href =
                    "dashboard.html";

            }


            if (text === "markets") {

                item.href =
                    "markets.html";

            }


            if (text === "assets") {

                item.href =
                    "assets.html";

            }


            if (text === "mine") {

                item.href =
                    "mine.html";

            }

        });


        const tradeButton =
            bottomNav.querySelector(
                ".trade-btn"
            );


        if (tradeButton) {

            tradeButton.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "trade.html";

                }
            );

        }

    }


    // ===================================
    // SIGN OUT
    // ===================================

    const signOutBtn =
        document.querySelector(
            ".signout-btn"
        );


    if (signOutBtn) {

        signOutBtn.addEventListener(
            "click",
            async function () {

                const confirmed =
                    confirm(
                        "Are you sure you want to Sign Out?"
                    );


                if (!confirmed) {
                    return;
                }


                try {

                    await signOut(auth);


                    localStorage.removeItem(
                        "currentUser"
                    );

                    localStorage.removeItem(
                        "user"
                    );


                    window.location.href =
                        "index.html";


                } catch (error) {

                    console.error(
                        "Sign out failed:",
                        error
                    );

                    alert(
                        "Sign out failed."
                    );

                }

            }
        );

    }


    console.log(
        "CptMarkets Mine Firebase Ready"
    );

});
