// ====================================
// CptMarkets Dashboard
// dashboard.js - Part 1
// ====================================

// -------------------------
// Tawk API
// -------------------------
window.Tawk_API = window.Tawk_API || {};

let tawkLoaded = false;

Tawk_API.onLoad = function () {

    tawkLoaded = true;

    if (typeof Tawk_API.hideWidget === "function") {
        Tawk_API.hideWidget();
    }

};

// -------------------------
// Open Customer Service
// -------------------------
function openSupportChat() {

    if (!tawkLoaded) {

        alert("Customer Service is loading...");

        return;

    }

    if (typeof Tawk_API.showWidget === "function") {
        Tawk_API.showWidget();
    }

    if (typeof Tawk_API.maximize === "function") {
        Tawk_API.maximize();
    }

}

// -------------------------
// Balance Show / Hide
// -------------------------
const eyeBtn = document.querySelector(".asset-header i");
const balance = document.getElementById("balance");

const balanceText = "$0.00";

let balanceVisible = true;

if (eyeBtn && balance) {

    eyeBtn.addEventListener("click", function () {

        if (balanceVisible) {

            balance.innerHTML = "********";

            eyeBtn.classList.remove("fa-eye");
            eyeBtn.classList.add("fa-eye-slash");

        } else {

            balance.innerHTML = balanceText;

            eyeBtn.classList.remove("fa-eye-slash");
            eyeBtn.classList.add("fa-eye");

        }

        balanceVisible = !balanceVisible;

    });

}

// -------------------------
// Refresh Button
// -------------------------
const refreshBtn = document.querySelector(".fa-rotate-right");

if (refreshBtn) {

    refreshBtn.addEventListener("click", function () {

        refreshBtn.style.transition = ".6s";

        refreshBtn.style.transform = "rotate(360deg)";

        setTimeout(function () {

            refreshBtn.style.transform = "rotate(0deg)";

        }, 600);

    });

}
// ====================================
// dashboard.js - Part 2
// ====================================

// -------------------------
// Deposit Button
// -------------------------
const depositBtn = document.querySelector(".deposit-btn");

if (depositBtn) {

    depositBtn.addEventListener("click", function (e) {

        e.preventDefault();

        openSupportChat();

    });

}

// -------------------------
// Support Button
// -------------------------
const supportBtn = document.querySelector(".support-btn");

if (supportBtn) {

    supportBtn.addEventListener("click", function (e) {

        e.preventDefault();

        openSupportChat();

    });

}

// -------------------------
// Loan Button
// -------------------------
const loanBtn = document.querySelector(".loan-btn");

if (loanBtn) {

    loanBtn.addEventListener("click", function (e) {

        e.preventDefault();

        openSupportChat();

    });

}

// -------------------------
// Withdraw Button
// -------------------------
const withdrawBtn = document.querySelector(".withdraw-btn");

if (withdrawBtn) {

    withdrawBtn.addEventListener("click", function () {

        alert("Withdraw page coming soon.");

    });

}

// -------------------------
// Transfer Button
// -------------------------
const transferBtn = document.querySelector(".transfer-btn");

if (transferBtn) {

    transferBtn.addEventListener("click", function () {

        alert("Transfer page coming soon.");

    });

}

// -------------------------
// Trade Button
// -------------------------
const tradeBtn = document.querySelector(".trade-btn");

if (tradeBtn) {

    tradeBtn.addEventListener("click", function () {

        window.location.href = "trade.html";

    });

}

// -------------------------
// Menu Animation
// -------------------------
document.querySelectorAll(".menu-item").forEach(function (item) {

    item.addEventListener("click", function () {

        item.style.transform = "scale(0.95)";

        setTimeout(function () {

            item.style.transform = "scale(1)";

        }, 120);

    });

});
// ====================================
// dashboard.js - Part 3
// ====================================

// -------------------------
// Market Flash Animation
// -------------------------
const marketPrices = document.querySelectorAll(".price");

if (marketPrices.length > 0) {

    setInterval(function () {

        marketPrices.forEach(function (price) {

            price.style.color = "#f5c84c";

            setTimeout(function () {

                price.style.color = "";

            }, 500);

        });

    }, 3000);

}

// -------------------------
// Bottom Navigation Active
// -------------------------
const navItems = document.querySelectorAll(".bottom-nav a");

navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        navItems.forEach(function (nav) {

            nav.classList.remove("active");

        });

        item.classList.add("active");

    });

});

// -------------------------
// Dashboard Loaded
// -------------------------
window.addEventListener("load", function () {

    console.log("CptMarkets Dashboard Loaded");

    // Tawk Widget Hide
    const checkTawk = setInterval(function () {

        if (
            window.Tawk_API &&
            typeof window.Tawk_API.hideWidget === "function"
        ) {

            window.Tawk_API.hideWidget();

            clearInterval(checkTawk);

        }

    }, 500);

});
