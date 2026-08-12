// =======================================
// CPTMARKETS - MINE PAGE
// mine.js
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    // ===================================
    // USER DATA
    // ===================================

    const currentUser =
        JSON.parse(localStorage.getItem("user"));

    const name =
        document.getElementById("username");

    const uid =
        document.getElementById("userid");

    const avatar =
        document.querySelector(".avatar");


    if (currentUser) {

        if (name) {
            name.textContent =
                currentUser.username || "User";
        }

        if (uid) {
            uid.textContent =
                currentUser.userId || "N/A";
        }

        if (avatar) {
            avatar.textContent =
                (currentUser.username || "U")
                .charAt(0)
                .toUpperCase();
        }

    } else {

        if (name) {
            name.textContent = "User";
        }

        if (uid) {
            uid.textContent = "N/A";
        }

        if (avatar) {
            avatar.textContent = "U";
        }

    }


    // ===================================
    // TAWK.TO - SAME AS DASHBOARD
    // ===================================

    window.Tawk_API =
        window.Tawk_API || {};

    window.Tawk_LoadStart =
        new Date();


    let tawkLoaded = false;


    window.Tawk_API.onLoad =
        function () {

            tawkLoaded = true;

            if (
                typeof window.Tawk_API.hideWidget ===
                "function"
            ) {
                window.Tawk_API.hideWidget();
            }

            console.log("Tawk.to loaded");
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
            document.createElement("script");


        script.async = true;


        script.src =
            "https://embed.tawk.to/6a71003c2d507b1d4a9fad4c/1jv4mhrhb";


        script.charset = "UTF-8";


        script.setAttribute(
            "crossorigin",
            "*"
        );


        document.body.appendChild(script);

    }


    loadTawk();


    // ===================================
    // OPEN CUSTOMER SERVICE
    // SAME AS DASHBOARD
    // ===================================

    window.openSupportChat =
        function () {

            // Hide floating widget

            if (
                window.Tawk_API &&
                typeof window.Tawk_API.hideWidget ===
                "function"
            ) {

                window.Tawk_API.hideWidget();

            }


            // Tawk already ready

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


            // Tawk still loading

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
    // HIDE TAWK FLOATING ICON
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

        row.addEventListener("click", function (e) {

            // Animation

            this.style.transform =
                "scale(0.98)";


            setTimeout(() => {

                this.style.transform =
                    "scale(1)";

            }, 120);


            const link =
                this.getAttribute("href");


            // Existing real link

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


            // =================================
            // MY ASSETS
            // =================================

            if (
                buttonName === "my assets"
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
                buttonName === "my orders"
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
                buttonName === "copy trading"
            ) {

                e.preventDefault();

                window.location.href =
                    "copytrade.html";

                return;
            }


            // =================================
            // LOAN
            // SAME AS DASHBOARD
            // =================================

            if (
                buttonName === "loan"
            ) {

                e.preventDefault();

                openSupportChat();

                return;
            }


            // =================================
            // WEALTH / MINING
            // =================================

            if (
                buttonName === "wealth / mining"
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
                buttonName === "invite friends"
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
                buttonName === "wallet management"
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
                buttonName === "security"
            ) {

                e.preventDefault();

                openSecurityPage();

                return;
            }


            // =================================
            // ANNOUNCEMENTS
            // =================================

            if (
                buttonName === "announcements"
            ) {

                e.preventDefault();

                openAnnouncementsPage();

                return;
            }


            // =================================
            // SUPPORT
            // SAME AS DASHBOARD
            // =================================

            if (
                buttonName === "support"
            ) {

                e.preventDefault();

                openSupportChat();

                return;
            }

        });

    });


    // ===================================
    // SECURITY INTERFACE
    // ===================================

    function openSecurityPage() {

        const old =
            document.getElementById(
                "cptSecurityPage"
            );


        if (old) {
            old.remove();
        }


        const page =
            document.createElement("div");


        page.id =
            "cptSecurityPage";


        page.innerHTML = `

            <div class="security-header">

                <button
                    id="securityBack"
                    class="security-back"
                >
                    ‹
                </button>

                <h1>Security</h1>

            </div>


            <div class="security-content">

                <div class="security-card">

                    <div class="security-row">

                        <div class="security-icon">
                            🔑
                        </div>

                        <div class="security-title">
                            Login Password
                        </div>

                        <div class="security-action">
                            Edit ›
                        </div>

                    </div>


                    <div class="security-divider"></div>


                    <div class="security-row">

                        <div class="security-icon">
                            📱
                        </div>

                        <div class="security-title">
                            Two-Factor (2FA)
                        </div>

                        <div class="security-action">
                            Off
                        </div>

                    </div>

                </div>

            </div>
        `;


        document.body.appendChild(page);


        const style =
            document.createElement("style");


        style.id =
            "cptSecurityStyle";


        style.textContent = `

            #cptSecurityPage {

                position: fixed;

                inset: 0;

                z-index: 999999;

                background:
                    linear-gradient(
                        180deg,
                        #081126 0%,
                        #020817 100%
                    );

                color: #ffffff;

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

                overflow-y: auto;

            }


            .security-header {

                height: 108px;

                display: flex;

                align-items: center;

                justify-content: center;

                position: relative;

                background: #0b1428;

                border-bottom:
                    1px solid
                    rgba(255,255,255,.07);

            }


            .security-header h1 {

                margin: 0;

                font-size: 30px;

                font-weight: 700;

            }


            .security-back {

                position: absolute;

                left: 20px;

                top: 50%;

                transform:
                    translateY(-50%);

                border: none;

                background: transparent;

                color: #ffffff;

                font-size: 44px;

                line-height: 1;

                padding: 5px;

            }


            .security-content {

                padding: 34px 30px;

            }


            .security-card {

                background:
                    linear-gradient(
                        145deg,
                        #122440,
                        #10233d
                    );

                border:
                    1px solid
                    rgba(255,255,255,.12);

                border-radius: 32px;

                overflow: hidden;

                box-shadow:
                    0 15px 45px
                    rgba(0,0,0,.25);

            }


            .security-row {

                min-height: 155px;

                display: flex;

                align-items: center;

                padding:
                    0 38px;

                gap: 24px;

            }


            .security-icon {

                width: 78px;

                height: 78px;

                flex-shrink: 0;

                display: flex;

                align-items: center;

                justify-content: center;

                border-radius: 24px;

                background:
                    rgba(60,100,160,.25);

                border:
                    1px solid
                    rgba(150,180,220,.25);

                font-size: 40px;

            }


            .security-title {

                flex: 1;

                font-size: 25px;

                font-weight: 700;

            }


            .security-action {

                color: #78869f;

                font-size: 24px;

                white-space: nowrap;

            }


            .security-divider {

                height: 1px;

                margin:
                    0 30px;

                background:
                    rgba(255,255,255,.08);

            }


            @media(max-width:480px) {

                .security-content {

                    padding:
                        30px;

                }


                .security-row {

                    min-height: 145px;

                    padding:
                        0 28px;

                    gap: 20px;

                }


                .security-icon {

                    width: 70px;

                    height: 70px;

                    font-size: 34px;

                }


                .security-title {

                    font-size: 22px;

                }


                .security-action {

                    font-size: 20px;

                }

            }

        `;


        document.head.appendChild(style);


        // Back

        document
            .getElementById("securityBack")
            .addEventListener(
                "click",
                function () {

                    page.remove();

                    const s =
                        document.getElementById(
                            "cptSecurityStyle"
                        );

                    if (s) {
                        s.remove();
                    }

                }
            );

    }


    // ===================================
    // ANNOUNCEMENTS INTERFACE
    // ===================================

    function openAnnouncementsPage() {

        const old =
            document.getElementById(
                "cptAnnouncementsPage"
            );


        if (old) {
            old.remove();
        }


        const page =
            document.createElement("div");


        page.id =
            "cptAnnouncementsPage";


        page.innerHTML = `

            <div class="announcement-header">

                <button
                    id="announcementBack"
                    class="announcement-back"
                >
                    ‹
                </button>

                <h1>Announcements</h1>

            </div>


            <div class="announcement-empty">
                No announcements
            </div>

        `;


        document.body.appendChild(page);


        const style =
            document.createElement("style");


        style.id =
            "cptAnnouncementsStyle";


        style.textContent = `

            #cptAnnouncementsPage {

                position: fixed;

                inset: 0;

                z-index: 999999;

                background:
                    linear-gradient(
                        180deg,
                        #081126 0%,
                        #020817 100%
                    );

                color: #ffffff;

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

            }


            .announcement-header {

                height: 108px;

                display: flex;

                align-items: center;

                justify-content: center;

                position: relative;

                background: #0b1428;

                border-bottom:
                    1px solid
                    rgba(255,255,255,.07);

            }


            .announcement-header h1 {

                margin: 0;

                font-size: 30px;

                font-weight: 700;

            }


            .announcement-back {

                position: absolute;

                left: 20px;

                top: 50%;

                transform:
                    translateY(-50%);

                border: none;

                background: transparent;

                color: #ffffff;

                font-size: 44px;

                line-height: 1;

                padding: 5px;

            }


            .announcement-empty {

                text-align: center;

                margin-top: 125px;

                color: #64738d;

                font-size: 25px;

            }

        `;


        document.head.appendChild(style);


        // Back

        document
            .getElementById("announcementBack")
            .addEventListener(
                "click",
                function () {

                    page.remove();

                    const s =
                        document.getElementById(
                            "cptAnnouncementsStyle"
                        );

                    if (s) {
                        s.remove();
                    }

                }
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
            function () {

                if (
                    confirm(
                        "Are you sure you want to Sign Out?"
                    )
                ) {

                    localStorage.removeItem(
                        "user"
                    );

                    window.location.href =
                        "index.html";

                }

            }
        );

    }


    console.log(
        "CptMarkets Mine Page Ready"
    );

});
