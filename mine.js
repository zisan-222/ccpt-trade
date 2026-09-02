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
    updateDoc,
    collection,
    query,
    where,
    getDocs
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
// PROFESSIONAL SIGN OUT POPUP
// =======================================

function createSignOutPopup() {

    // Prevent duplicate popup
    if (document.getElementById("cptLogoutModal")) {
        return;
    }


    // ===================================
    // CSS
    // ===================================

    const style = document.createElement("style");

    style.id = "cptLogoutModalStyle";

    style.textContent = `

        /* ==========================================
           LOGOUT OVERLAY
        ========================================== */

        #cptLogoutModal {

            position: fixed;

            inset: 0;

            z-index: 999999;

            display: none;

            align-items: center;

            justify-content: center;

            padding: 22px;

            background:
                rgba(0, 0, 0, 0.82);

            backdrop-filter:
                blur(12px);

            -webkit-backdrop-filter:
                blur(12px);

        }


        /* ==========================================
           MODAL CARD
        ========================================== */

        .cpt-logout-card {

            position: relative;

            width: 100%;

            max-width: 390px;

            padding: 30px 24px 24px;

            border-radius: 28px;

            background:
                linear-gradient(
                    145deg,
                    #151515 0%,
                    #0d0d0d 100%
                );

            border:
                1px solid
                rgba(255, 193, 7, 0.18);

            box-shadow:

                0 30px 80px
                rgba(0, 0, 0, 0.75),

                0 0 45px
                rgba(255, 193, 7, 0.07);

            transform:
                translateY(18px)
                scale(0.96);

            opacity: 0;

            transition:
                transform 0.25s ease,
                opacity 0.25s ease;

        }


        #cptLogoutModal.active
        .cpt-logout-card {

            transform:
                translateY(0)
                scale(1);

            opacity: 1;

        }


        /* ==========================================
           CLOSE BUTTON
        ========================================== */

        .cpt-logout-close {

            position: absolute;

            top: 15px;

            right: 15px;

            width: 38px;

            height: 38px;

            border: 1px solid
                rgba(255,255,255,0.08);

            border-radius: 50%;

            background:
                rgba(255,255,255,0.055);

            color: #a9a9a9;

            font-size: 24px;

            line-height: 1;

            display: flex;

            align-items: center;

            justify-content: center;

            cursor: pointer;

            transition: 0.2s ease;

        }


        .cpt-logout-close:hover {

            color: #ffffff;

            background:
                rgba(255,255,255,0.10);

        }


        /* ==========================================
           ICON
        ========================================== */

        .cpt-logout-icon {

            width: 72px;

            height: 72px;

            margin:
                4px auto 20px;

            border-radius: 22px;

            display: flex;

            align-items: center;

            justify-content: center;

            background:
                linear-gradient(
                    145deg,
                    #ffc107,
                    #ff9800
                );

            color: #111111;

            font-size: 30px;

            box-shadow:

                0 0 0 6px
                rgba(255,193,7,0.06),

                0 0 35px
                rgba(255,193,7,0.25);

        }


        /* ==========================================
           TITLE
        ========================================== */

        .cpt-logout-title {

            margin: 0;

            text-align: center;

            color: #ffffff;

            font-size: 24px;

            font-weight: 700;

            letter-spacing: -0.3px;

        }


        /* ==========================================
           DESCRIPTION
        ========================================== */

        .cpt-logout-text {

            margin: 10px auto 0;

            max-width: 300px;

            text-align: center;

            color: #8e8e8e;

            font-size: 14px;

            line-height: 1.6;

        }


        /* ==========================================
           DIVIDER
        ========================================== */

        .cpt-logout-divider {

            height: 1px;

            margin:
                24px 0 20px;

            background:
                rgba(255,255,255,0.07);

        }


        /* ==========================================
           BUTTON AREA
        ========================================== */

        .cpt-logout-actions {

            display: grid;

            grid-template-columns:
                1fr 1fr;

            gap: 12px;

        }


        /* ==========================================
           CANCEL
        ========================================== */

        .cpt-logout-cancel {

            height: 52px;

            border-radius: 15px;

            border:
                1px solid
                rgba(255,255,255,0.10);

            background:
                #1b1b1b;

            color: #d0d0d0;

            font-size: 15px;

            font-weight: 600;

            cursor: pointer;

            transition: 0.2s ease;

        }


        .cpt-logout-cancel:active {

            transform: scale(0.97);

        }


        /* ==========================================
           CONFIRM
        ========================================== */

        .cpt-logout-confirm {

            height: 52px;

            border: none;

            border-radius: 15px;

            background:
                linear-gradient(
                    135deg,
                    #ffc107,
                    #ff9800
                );

            color: #111111;

            font-size: 15px;

            font-weight: 700;

            cursor: pointer;

            box-shadow:
                0 8px 25px
                rgba(255,193,7,0.20);

            transition: 0.2s ease;

        }


        .cpt-logout-confirm:active {

            transform: scale(0.97);

        }


        .cpt-logout-confirm.loading {

            opacity: 0.65;

            pointer-events: none;

        }


        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 420px) {

            .cpt-logout-card {

                padding:
                    28px 20px 20px;

                border-radius: 25px;

            }

            .cpt-logout-title {

                font-size: 22px;

            }

        }

    `;

    document.head.appendChild(style);


    // ===================================
    // CREATE HTML
    // ===================================

    const modal =
        document.createElement("div");

    modal.id =
        "cptLogoutModal";


    modal.innerHTML = `

        <div class="cpt-logout-card">


            <!-- CLOSE -->

            <button
                type="button"
                class="cpt-logout-close"
                id="cptLogoutClose"
                aria-label="Close"
            >
                ×
            </button>


            <!-- ICON -->

            <div class="cpt-logout-icon">

                <i class="fa-solid fa-arrow-right-from-bracket"></i>

            </div>


            <!-- TITLE -->

            <h2 class="cpt-logout-title">

                Sign Out

            </h2>


            <!-- MESSAGE -->

            <p class="cpt-logout-text">

                Are you sure you want to Sign Out
                from your CptMarkets account?

            </p>


            <!-- DIVIDER -->

            <div class="cpt-logout-divider"></div>


            <!-- BUTTONS -->

            <div class="cpt-logout-actions">


                <button
                    type="button"
                    class="cpt-logout-cancel"
                    id="cptLogoutCancel"
                >

                    Cancel

                </button>


                <button
                    type="button"
                    class="cpt-logout-confirm"
                    id="cptLogoutConfirm"
                >

                    OK

                </button>


            </div>


        </div>

    `;


    document.body.appendChild(modal);


    // ===================================
    // CLOSE FUNCTION
    // ===================================

    function closeLogoutPopup() {

        modal.classList.remove("active");

        setTimeout(
            function () {

                modal.style.display =
                    "none";

            },
            230
        );

    }


    // ===================================
    // OPEN FUNCTION
    // ===================================

    window.openLogoutPopup =
        function () {

            modal.style.display =
                "flex";

            requestAnimationFrame(
                function () {

                    modal.classList.add(
                        "active"
                    );

                }
            );

        };


    // ===================================
    // CLOSE BUTTON
    // ===================================

    document
        .getElementById("cptLogoutClose")
        .addEventListener(
            "click",
            closeLogoutPopup
        );


    // ===================================
    // CANCEL BUTTON
    // ===================================

    document
        .getElementById("cptLogoutCancel")
        .addEventListener(
            "click",
            closeLogoutPopup
        );


    // ===================================
    // CLICK OUTSIDE
    // ===================================

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeLogoutPopup();

            }

        }
    );


    // ===================================
    // ESC KEY
    // ===================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeLogoutPopup();

            }

        }
    );


    // ===================================
    // CONFIRM LOGOUT
    // ===================================

    document
        .getElementById("cptLogoutConfirm")
        .addEventListener(
            "click",
            async function () {

                const confirmButton =
                    this;


                confirmButton.classList.add(
                    "loading"
                );

                confirmButton.textContent =
                    "Signing Out...";


                try {

                    // =========================
                    // FIREBASE SIGN OUT
                    // =========================

                    await signOut(auth);


                    // =========================
                    // CLEAR LOCAL DATA
                    // =========================

                    localStorage.removeItem(
                        "currentUser"
                    );

                    localStorage.removeItem(
                        "user"
                    );


                    // =========================
                    // GO LOGIN PAGE
                    // =========================

                    window.location.href =
                        "index.html";


                } catch (error) {

                    console.error(
                        "Sign out failed:",
                        error
                    );


                    confirmButton.classList.remove(
                        "loading"
                    );

                    confirmButton.textContent =
                        "OK";


                    closeLogoutPopup();


                    // Professional error message
                    setTimeout(
                        function () {

                            alert(
                                "Unable to sign out. Please try again."
                            );

                        },
                        250
                    );

                }

            }
        );

}


// =======================================
// PAGE LOAD
// =======================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ===================================
        // CREATE LOGOUT POPUP
        // ===================================

        createSignOutPopup();


        const name =
            document.getElementById("username");

        const uidElement =
            document.getElementById("userid");

        const avatar =
            document.querySelector(".avatar");

        const todayPLEl =
            document.getElementById("todayPL");

        const totalPLEl =
            document.getElementById("totalPL");

        const openTradesEl =
            document.getElementById("openTrades");


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
                        name.textContent =
                            "User";
                    }

                    if (uidElement) {
                        uidElement.textContent =
                            "N/A";
                    }

                    if (avatar) {
                        avatar.textContent =
                            "U";
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
                            name.textContent =
                                "User";
                        }

                        if (uidElement) {
                            uidElement.textContent =
                                "N/A";
                        }

                        if (avatar) {
                            avatar.textContent =
                                "U";
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
                    // BALANCE
                    // ===================================

                    const balance =
                        Number(
                            userData.balance || 0
                        );


                    // ===================================
                    // FETCH ORDERS / TRADES FOR P/L
                    // ===================================

                    try {
                        const ordersRef = collection(db, "orders");
                        const q = query(ordersRef, where("userId", "==", firebaseUser.uid));
                        const querySnapshot = await getDocs(q);

                        let todayPL = 0;
                        let totalPL = 0;
                        let openCount = 0;

                        const todayStr = new Date().toISOString().split('T')[0];

                        querySnapshot.forEach((docSnap) => {
                            const orderData = docSnap.data();
                            const profit = Number(orderData.profit) || Number(orderData.pl) || 0;
                            const status = (orderData.status || "").toLowerCase();

                            if (status === "open" || status === "running" || status === "active") {
                                openCount++;
                            } else {
                                totalPL += profit;

                                if (orderData.createdAt || orderData.timestamp) {
                                    const orderDate = new Date(orderData.createdAt?.toDate ? orderData.createdAt.toDate() : orderData.timestamp).toISOString().split('T')[0];
                                    if (orderDate === todayStr) {
                                        todayPL += profit;
                                    }
                                }
                            }
                        });

                        if (todayPLEl) {
                            todayPLEl.textContent = (todayPL >= 0 ? "+" : "") + todayPL.toFixed(2);
                        }
                        if (totalPLEl) {
                            totalPLEl.textContent = (totalPL >= 0 ? "+" : "") + totalPL.toFixed(2);
                        }
                        if (openTradesEl) {
                            openTradesEl.textContent = openCount;
                        }

                    } catch (err) {
                        console.error("Error fetching trades for P/L:", err);
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


                        // MY ASSETS

                        if (
                            buttonName ===
                            "my assets"
                        ) {

                            e.preventDefault();

                            window.location.href =
                                "assets.html";

                            return;

                        }


                        // MY ORDERS

                        if (
                            buttonName ===
                            "my orders"
                        ) {

                            e.preventDefault();

                            window.location.href =
                                "orders.html";

                            return;

                        }


                        // COPY TRADING

                        if (
                            buttonName ===
                            "copy trading"
                        ) {

                            e.preventDefault();

                            window.location.href =
                                "copytrade.html";

                            return;

                        }


                        // LOAN

                        if (
                            buttonName ===
                            "loan"
                        ) {

                            e.preventDefault();

                            openSupportChat();

                            return;

                        }


                        // WEALTH / MINING

                        if (
                            buttonName ===
                            "wealth / mining"
                        ) {

                            e.preventDefault();

                            window.location.href =
                                "investment.html";

                            return;

                        }


                        // INVITE FRIENDS

                        if (
                            buttonName ===
                            "invite friends"
                        ) {

                            e.preventDefault();

                            window.location.href =
                                "invite.html";

                            return;

                        }


                        // WALLET MANAGEMENT

                        if (
                            buttonName ===
                            "wallet management"
                        ) {

                            e.preventDefault();

                            window.location.href =
                                "transfer.html";

                            return;

                        }


                        // SECURITY

                        if (
                            buttonName ===
                            "security"
                        ) {

                            e.preventDefault();

                            openSecurityPage();

                            return;

                        }


                        // ANNOUNCEMENTS

                        if (
                            buttonName ===
                            "announcements"
                        ) {

                            e.preventDefault();

                            openAnnouncementsPage();

                            return;

                        }


                        // SUPPORT

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


                    if (
                        text === "home"
                    ) {

                        item.href =
                            "dashboard.html";

                    }


                    if (
                        text === "markets"
                    ) {

                        item.href =
                            "markets.html";

                    }


                    if (
                        text === "assets"
                    ) {

                        item.href =
                            "assets.html";

                    }


                    if (
                        text === "mine"
                    ) {

                        item.href =
                            "mine.html";

                    }

                }
            );


            // TRADE BUTTON

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
                function (event) {

                    event.preventDefault();

                    // IMPORTANT:
                    // No browser confirm()
                    // Professional popup instead

                    if (
                        typeof window.openLogoutPopup ===
                        "function"
                    ) {

                        window.openLogoutPopup();

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
