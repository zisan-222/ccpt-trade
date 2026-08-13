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
// CREATE 8 DIGIT USER ID
// =======================================

function generate8DigitUID() {

    return String(
        Math.floor(
            10000000 +
            Math.random() * 90000000
        )
    );

}


// =======================================
// PAGE LOAD
// =======================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const name =
            document.getElementById("username");

        const uidElement =
            document.getElementById("userid");

        const avatar =
            document.querySelector(".avatar");


        // ===================================
        // FIREBASE USER
        // ===================================

        onAuthStateChanged(
            auth,
            async function (firebaseUser) {

                // -----------------------------------
                // NO USER
                // -----------------------------------

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


                    // ===================================
                    // USER NOT FOUND
                    // ===================================

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

                        if (avatar) {
                            avatar.textContent = "U";
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
                    // CUSTOM 8 DIGIT UID
                    // ===================================

                    let customUID =
                        String(
                            userData.userId || ""
                        ).trim();


                    /*
                     * Check whether UID is exactly
                     * 8 numeric digits.
                     *
                     * Example:
                     * 42623883  = VALID
                     *
                     * UID1786607165288230 = INVALID
                     */

                    const validUID =
                        /^\d{8}$/.test(
                            customUID
                        );


                    // ===================================
                    // FIX OLD / INVALID UID
                    // ===================================

                    if (!validUID) {

                        customUID =
                            generate8DigitUID();


                        await updateDoc(
                            userRef,
                            {
                                userId:
                                    customUID
                            }
                        );


                        console.log(
                            "New 8 digit UID created:",
                            customUID
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
                    // SHOW 8 DIGIT UID
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
                    // GET BALANCE
                    // ===================================

                    const balance =
                        Number(
                            userData.balance || 0
                        );


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
                                firebaseUser.email ||
                                "",

                            balance:
                                balance

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

            }
        );


        // ===================================
        // TAWK.TO
        // ===================================

        window.Tawk_API =
            window.Tawk_API || {};

        window.Tawk_LoadStart =
            new Date();


        let tawkLoaded =
            false;


        window.Tawk_API.onLoad =
            function () {

                tawkLoaded = true;


                if (
                    typeof window.Tawk_API
                        .hideWidget ===
                    "function"
                ) {

                    window.Tawk_API.hideWidget();

                }


                console.log(
                    "Tawk.to loaded"
                );

            };


        // ===================================
        // LOAD TAWK
        // ===================================

        function loadTawk() {

            if (
                document.querySelector(
                    'script[src*="embed.tawk.to"]'
                )
            ) {

                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.async = true;


            script.src =
                "https://embed.tawk.to/6a71003c2d507b1d4a9fad4c/1jv4mhrhb";


            script.charset =
                "UTF-8";


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

                // --------------------------------
                // TAWK ALREADY READY
                // --------------------------------

                if (
                    window.Tawk_API &&
                    typeof window.Tawk_API
                        .showWidget ===
                    "function"
                ) {

                    window.Tawk_API.showWidget();


                    setTimeout(
                        function () {

                            if (
                                typeof window
                                    .Tawk_API
                                    .maximize ===
                                "function"
                            ) {

                                window.Tawk_API
                                    .maximize();

                            }

                        },
                        300
                    );


                    return;

                }


                // --------------------------------
                // WAIT FOR TAWK
                // --------------------------------

                let attempts = 0;


                const waitTawk =
                    setInterval(
                        function () {

                            attempts++;


                            if (
                                window.Tawk_API &&
                                typeof window.Tawk_API
                                    .showWidget ===
                                "function"
                            ) {

                                clearInterval(
                                    waitTawk
                                );


                                window.Tawk_API
                                    .showWidget();


                                setTimeout(
                                    function () {

                                        if (
                                            typeof window
                                                .Tawk_API
                                                .maximize ===
                                            "function"
                                        ) {

                                            window.Tawk_API
                                                .maximize();

                                        }

                                    },
                                    300
                                );

                            }


                            // --------------------------------
                            // TIMEOUT
                            // --------------------------------

                            if (
                                attempts >= 30
                            ) {

                                clearInterval(
                                    waitTawk
                                );


                                alert(
                                    "Customer Service is loading. Please try again."
                                );

                            }

                        },
                        500
                    );

            };


        // ===================================
        // HIDE TAWK FLOATING ICON
        // ===================================

        const hideTawk =
            setInterval(
                function () {

                    if (
                        window.Tawk_API &&
                        typeof window.Tawk_API
                            .hideWidget ===
                        "function"
                    ) {

                        window.Tawk_API
                            .hideWidget();


                        clearInterval(
                            hideTawk
                        );

                    }

                },
                500
            );


        // ===================================
        // MENU BUTTONS
        // ===================================

        const menuRows =
            document.querySelectorAll(
                ".menu-row"
            );


        menuRows.forEach(
            function (row) {

                row.addEventListener(
                    "click",
                    function (e) {

                        // --------------------------------
                        // CLICK ANIMATION
                        // --------------------------------

                        this.style.transform =
                            "scale(0.98)";


                        setTimeout(
                            () => {

                                this.style.transform =
                                    "scale(1)";

                            },
                            120
                        );


                        const link =
                            this.getAttribute(
                                "href"
                            );


                        // --------------------------------
                        // REAL LINK
                        // --------------------------------

                        if (
                            link &&
                            link !== "#"
                        ) {

                            return;

                        }


                        const span =
                            this.querySelector(
                                "span"
                            );


                        if (!span) {

                            return;

                        }


                        const buttonName =
                            span.textContent
                                .trim()
                                .toLowerCase();


                        // =================================
                        // MY ASSETS
                        // =================================

                        if (
                            buttonName ===
                            "my assets"
                        ) {

                            e.preventDefault();

                            window.location.href =
                                "assets.html";

                            return;

                        }


                        // =================================
                        // MY ORDERS
                        // =================================

                        if (
                            buttonName ===
                            "my orders"
                        ) {

                            e.preventDefault();

                            window.location.href =
                                "orders.html";

                            return;

                        }


                        // =================================
                        // COPY TRADING
                        // =================================

                        if (
                            buttonName ===
                            "copy trading"
                        ) {

                            e.preventDefault();

                            window.location.href =
                                "copytrade.html";

                            return;

                        }


                        // =================================
                        // LOAN
                        // =================================

                        if (
                            buttonName ===
                            "loan"
                        ) {

                            e.preventDefault();

                            openSupportChat();

                            return;

                        }


                        // =================================
                        // WEALTH / MINING
                        // =================================

                        if (
                            buttonName ===
                            "wealth / mining"
                        ) {

                            e.preventDefault();

                            window.location.href =
                                "investment.html";

                            return;

                        }


                        // =================================
                        // INVITE FRIENDS
                        // =================================

                        if (
                            buttonName ===
                            "invite friends"
                        ) {

                            e.preventDefault();

                            window.location.href =
                                "invite.html";

                            return;

                        }


                        // =================================
                        // WALLET MANAGEMENT
                        // =================================

                        if (
                            buttonName ===
                            "wallet management"
                        ) {

                            e.preventDefault();

                            window.location.href =
                                "transfer.html";

                            return;

                        }


                        // =================================
                        // SECURITY
                        // =================================

                        if (
                            buttonName ===
                            "security"
                        ) {

                            e.preventDefault();

                            openSecurityPage();

                            return;

                        }


                        // =================================
                        // ANNOUNCEMENTS
                        // =================================

                        if (
                            buttonName ===
                            "announcements"
                        ) {

                            e.preventDefault();

                            openAnnouncementsPage();

                            return;

                        }


                        // =================================
                        // SUPPORT
                        // =================================

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

            }
        );


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
            document.querySelector(
                ".bottom-nav"
            );


        if (bottomNav) {

            const navItems =
                bottomNav.querySelectorAll(
                    "a"
                );


            navItems.forEach(
                function (item) {

                    const span =
                        item.querySelector(
                            "span"
                        );


                    if (!span) {

                        return;

                    }


                    const text =
                        span.textContent
                            .trim()
                            .toLowerCase();


                    // --------------------------------
                    // HOME
                    // --------------------------------

                    if (
                        text === "home"
                    ) {

                        item.href =
                            "dashboard.html";

                    }


                    // --------------------------------
                    // MARKETS
                    // --------------------------------

                    if (
                        text === "markets"
                    ) {

                        item.href =
                            "markets.html";

                    }


                    // --------------------------------
                    // ASSETS
                    // --------------------------------

                    if (
                        text === "assets"
                    ) {

                        item.href =
                            "assets.html";

                    }


                    // --------------------------------
                    // MINE
                    // --------------------------------

                    if (
                        text === "mine"
                    ) {

                        item.href =
                            "mine.html";

                    }

                }
            );


            // =================================
            // TRADE BUTTON
            // =================================

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

                        await signOut(
                            auth
                        );


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


        // ===================================
        // READY
        // ===================================

        console.log(
            "CptMarkets Mine Firebase Ready"
        );

    }
);
