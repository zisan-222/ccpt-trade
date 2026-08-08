/* ==========================================
   CPTMARKETS DASHBOARD
   dashboard.js - Complete Version
========================================== */


/* ==========================================
   TAWK.TO CUSTOMER SERVICE
========================================== */

// Tawk API initialize
window.Tawk_API = window.Tawk_API || {};
window.Tawk_LoadStart = new Date();

let tawkLoaded = false;


// Tawk.to loaded
window.Tawk_API.onLoad = function () {

    tawkLoaded = true;

    console.log("Tawk.to Customer Service Loaded");

    // Hide Tawk widget when dashboard loads
    if (typeof window.Tawk_API.hideWidget === "function") {
        window.Tawk_API.hideWidget();
    }
};


/* ==========================================
   OPEN CUSTOMER SERVICE
========================================== */

function openSupportChat() {

    // Tawk not loaded yet
    if (!tawkLoaded) {

        // Try to show widget anyway
        if (
            typeof window.Tawk_API !== "undefined" &&
            typeof window.Tawk_API.showWidget === "function"
        ) {

            window.Tawk_API.showWidget();

        } else {

            alert("Customer Service is loading...");

            return;
        }
    }


    // Show Tawk widget
    if (typeof window.Tawk_API.showWidget === "function") {
        window.Tawk_API.showWidget();
    }


    // Open / maximize chat
    setTimeout(function () {

        if (typeof window.Tawk_API.maximize === "function") {
            window.Tawk_API.maximize();
        }

    }, 300);
}


/* ==========================================
   BALANCE SHOW / HIDE
========================================== */

const eyeBtn = document.querySelector(".asset-header i");
const balance = document.getElementById("balance");


// Original balance text
const balanceText = "$0.00";


// Balance visibility
let balanceVisible = true;


if (eyeBtn && balance) {

    eyeBtn.addEventListener("click", function () {

        // Hide balance
        if (balanceVisible) {

            balance.innerHTML = "••••••";

            eyeBtn.classList.remove("fa-eye");
            eyeBtn.classList.add("fa-eye-slash");

            balanceVisible = false;

        }

        // Show balance
        else {

            balance.innerHTML = balanceText;

            eyeBtn.classList.remove("fa-eye-slash");
            eyeBtn.classList.add("fa-eye");

            balanceVisible = true;
        }

    });

}


/* ==========================================
   REFRESH BUTTON
========================================== */

const refreshBtn = document.querySelector(".fa-rotate-right");


if (refreshBtn) {

    refreshBtn.addEventListener("click", function () {

        // Reset previous animation
        refreshBtn.style.transition = "none";
        refreshBtn.style.transform = "rotate(0deg)";


        // Start animation
        setTimeout(function () {

            refreshBtn.style.transition = "0.6s";
            refreshBtn.style.transform = "rotate(360deg)";

        }, 10);


        // Reset rotation
        setTimeout(function () {

            refreshBtn.style.transition = "none";
            refreshBtn.style.transform = "rotate(0deg)";

        }, 650);

    });

}


/* ==========================================
   DEPOSIT BUTTON
   Opens Tawk.to Customer Service
========================================== */

const depositBtn = document.querySelector(".deposit-btn");


if (depositBtn) {

    depositBtn.addEventListener("click", function (e) {

        e.preventDefault();

        openSupportChat();

    });

}


/* ==========================================
   SUPPORT BUTTON
   Opens Tawk.to Customer Service
========================================== */

const supportBtn = document.querySelector(".support-btn");


if (supportBtn) {

    supportBtn.addEventListener("click", function (e) {

        e.preventDefault();

        openSupportChat();

    });

}


/* ==========================================
   LOAN BUTTON
   Opens Tawk.to Customer Service
========================================== */

const loanBtn = document.querySelector(".loan-btn");


if (loanBtn) {

    loanBtn.addEventListener("click", function (e) {

        e.preventDefault();

        openSupportChat();

    });

}


/* ==========================================
   WITHDRAW BUTTON
========================================== */

const withdrawBtn = document.querySelector(".withdraw-btn");


if (withdrawBtn) {

    withdrawBtn.addEventListener("click", function (e) {

        e.preventDefault();

        alert("Withdraw page coming soon.");

    });

}


/* ==========================================
   TRANSFER BUTTON
========================================== */

const transferBtn = document.querySelector(".transfer-btn");


if (transferBtn) {

    transferBtn.addEventListener("click", function (e) {

        e.preventDefault();

        alert("Transfer page coming soon.");

    });

}


/* ==========================================
   TRADE BUTTON
========================================== */

const tradeBtn = document.querySelector(".trade-btn");


if (tradeBtn) {

    tradeBtn.addEventListener("click", function (e) {

        e.preventDefault();

        window.location.href = "trade.html";

    });

}


/* ==========================================
   MENU ITEM ANIMATION
========================================== */

const menuItems = document.querySelectorAll(".menu-item");


menuItems.forEach(function (item) {

    item.addEventListener("click", function () {

        item.style.transform = "scale(0.95)";


        setTimeout(function () {

            item.style.transform = "scale(1)";

        }, 120);

    });

});


/* ==========================================
   MARKET FLASH ANIMATION
========================================== */

const marketPrices = document.querySelectorAll(".price");


if (marketPrices.length > 0) {

    setInterval(function () {

        marketPrices.forEach(function (price) {

            // Save original color
            const originalColor = price.style.color;


            // Flash color
            price.style.color = "#f5c84c";


            // Return to original
            setTimeout(function () {

                price.style.color = originalColor;

            }, 500);

        });

    }, 3000);

}


/* ==========================================
   BOTTOM NAVIGATION ACTIVE
========================================== */

const navItems = document.querySelectorAll(".bottom-nav a");


navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        navItems.forEach(function (nav) {

            nav.classList.remove("active");

        });


        item.classList.add("active");

    });

});


/* ==========================================
   DASHBOARD LOADED
========================================== */

window.addEventListener("load", function () {

    console.log("CptMarkets Dashboard Loaded");

});


/* ==========================================
   TAWK WIDGET AUTO HIDE
========================================== */

const checkTawk = setInterval(function () {

    if (
        typeof window.Tawk_API !== "undefined" &&
        typeof window.Tawk_API.hideWidget === "function"
    ) {

        window.Tawk_API.hideWidget();

        clearInterval(checkTawk);

    }

}, 500);


/* ==========================================
   END OF DASHBOARD.JS
========================================== */
