// =======================================
// CPTMARKETS - MINE PAGE
// mine.js
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    // ===================================
    // LOAD USER DATA
    // ===================================

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const name = document.querySelector("#username");
    const uid = document.querySelector("#userid");
    const avatar = document.querySelector(".avatar");

    if (currentUser) {

        if (name) {
            name.textContent = currentUser.username || "User";
        }

        if (uid) {
            uid.textContent = currentUser.userId || "N/A";
        }

        if (avatar) {
            avatar.textContent =
                (currentUser.username || "U").charAt(0).toUpperCase();
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
    // MINE MENU BUTTONS
    // ===================================

    const menuRows = document.querySelectorAll(".menu-row");


    menuRows.forEach(function (row) {

        row.addEventListener("click", function (event) {

            // Button press animation
            this.style.transform = "scale(0.98)";

            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 120);


            // --------------------------------
            // Do not interfere with real href
            // --------------------------------

            const link = this.getAttribute("href");

            if (link && link !== "#") {
                return;
            }


            // --------------------------------
            // Get button text
            // --------------------------------

            const textElement = this.querySelector("span");

            if (!textElement) {
                return;
            }

            const buttonName =
                textElement.textContent.trim().toLowerCase();


            // =================================
            // EXISTING CPTMARKETS INTERFACES
            // =================================

            // My Assets
            if (buttonName === "my assets") {
                window.location.href = "assets.html";
                return;
            }


            // My Orders
            if (buttonName === "my orders") {
                window.location.href = "orders.html";
                return;
            }


            // Copy Trading
            if (buttonName === "copy trading") {
                window.location.href = "copytrade.html";
                return;
            }


            // Loan
            if (buttonName === "loan") {
                openSupportChat();
                return;
            }


            // Wealth / Mining
            if (buttonName === "wealth / mining") {
                window.location.href = "investment.html";
                return;
            }


            // Invite Friends
            if (buttonName === "invite friends") {
                window.location.href = "invite.html";
                return;
            }


            // Wallet Management
            if (buttonName === "wallet management") {
                window.location.href = "transfer.html";
                return;
            }


            // Security
            if (buttonName === "security") {
                alert("Security settings will be available soon.");
                return;
            }


            // Announcements
            if (buttonName === "announcements") {
                alert("Announcements will be available soon.");
                return;
            }


            // Support
            if (buttonName === "support") {
                openSupportChat();
                return;
            }

        });

    });


    // ===================================
    // TAWK.TO SUPPORT
    // ===================================

    window.openSupportChat = function () {

        if (
            typeof Tawk_API !== "undefined" &&
            typeof Tawk_API.maximize === "function"
        ) {

            Tawk_API.maximize();

        } else {

            console.log("Tawk.to is not loaded yet.");

            alert("Customer Service is loading. Please try again.");

        }

    };


    // ===================================
    // BOTTOM NAVIGATION
    // ===================================

    const bottomNav = document.querySelector(".bottom-nav");

    if (bottomNav) {

        const navItems =
            bottomNav.querySelectorAll("a");

        navItems.forEach(function (item) {

            const text =
                item.querySelector("span");

            if (!text) {
                return;
            }

            const name =
                text.textContent.trim().toLowerCase();


            // Home
            if (name === "home") {
                item.href = "dashboard.html";
            }


            // Markets
            if (name === "markets") {
                item.href = "markets.html";
            }


            // Assets
            if (name === "assets") {
                item.href = "assets.html";
            }


            // Mine
            if (name === "mine") {
                item.href = "mine.html";
            }

        });


        // Trade middle button
        const tradeButton =
            bottomNav.querySelector(".trade-btn");

        if (tradeButton) {

            tradeButton.addEventListener("click", function () {

                window.location.href = "trade.html";

            });

        }

    }


    // ===================================
    // SIGN OUT
    // ===================================

    const signOutBtn =
        document.querySelector(".signout-btn");

    if (signOutBtn) {

        signOutBtn.addEventListener("click", function () {

            const confirmLogout =
                confirm("Are you sure you want to Sign Out?");

            if (confirmLogout) {

                localStorage.removeItem("user");

                window.location.href = "index.html";

            }

        });

    }


    // ===================================
    // CONSOLE
    // ===================================

    console.log("CptMarkets Mine Page Loaded");

});
