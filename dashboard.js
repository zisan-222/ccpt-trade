// ===============================
// CPTMARKETS DASHBOARD
// dashboard.js - Part 1
// ===============================

// ===============================
// Balance Show / Hide
// ===============================

const eyeIcon = document.querySelector(".asset-header i");
const balance = document.getElementById("balance");

let balanceVisible = true;
let currentBalance = "$0.00";

if (eyeIcon && balance) {

    eyeIcon.addEventListener("click", function () {

        if (balanceVisible) {

            balance.textContent = "********";

            eyeIcon.classList.remove("fa-eye");
            eyeIcon.classList.add("fa-eye-slash");

        } else {

            balance.textContent = currentBalance;

            eyeIcon.classList.remove("fa-eye-slash");
            eyeIcon.classList.add("fa-eye");

        }

        balanceVisible = !balanceVisible;

    });

}

// ===============================
// Refresh Animation
// ===============================

const refreshBtn = document.querySelector(".fa-rotate-right");

if (refreshBtn) {

    refreshBtn.addEventListener("click", function () {

        refreshBtn.style.transition = "0.6s";
        refreshBtn.style.transform = "rotate(360deg)";

        setTimeout(function () {

            refreshBtn.style.transform = "rotate(0deg)";

        }, 600);

    });

}

// ===============================
// Open Tawk Live Chat
// ===============================

function openSupportChat() {

    if (
        window.Tawk_API &&
        typeof window.Tawk_API.maximize === "function"
    ) {

        window.Tawk_API.maximize();

    } else {

        console.log("Tawk.to is not loaded yet.");

    }

}

// ===============================
// Buttons
// ===============================

// Deposit Button
const depositBtn = document.querySelector(".deposit-btn");

if (depositBtn) {
    depositBtn.addEventListener("click", function () {
        openSupportChat();
    });
}

// Withdraw Button
const withdrawBtn = document.querySelector(".withdraw-btn");

if (withdrawBtn) {
    withdrawBtn.addEventListener("click", function () {
        alert("Withdraw page coming soon.");
    });
}

// Transfer Button
const transferBtn = document.querySelector(".transfer-btn");

if (transferBtn) {
    transferBtn.addEventListener("click", function () {
        alert("Transfer page coming soon.");
    });
}

// Support Button
const supportBtn = document.querySelector(".support-btn");

if (supportBtn) {
    supportBtn.addEventListener("click", function () {
        openSupportChat();
    });
}

// Loan Button
const loanBtn = document.querySelector(".loan-btn");

if (loanBtn) {
    loanBtn.addEventListener("click", function () {
        openSupportChat();
    });
}

// Trade Button
const tradeBtn = document.querySelector(".trade-btn");

if (tradeBtn) {
    tradeBtn.addEventListener("click", function () {
        window.location.href = "trade.html";
    });
}

// ===============================
// Menu Click Effect
// ===============================

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(function (item) {

    item.addEventListener("click", function () {

        item.style.transform = "scale(0.95)";

        setTimeout(function () {
            item.style.transform = "scale(1)";
        }, 120);

    });

});

// ===============================
// Bottom Navigation Active
// ===============================

const navItems = document.querySelectorAll(".bottom-nav a");

navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        navItems.forEach(function (nav) {
            nav.classList.remove("active");
        });

        item.classList.add("active");

    });

});

// ===============================
// Market Flash Animation
// ===============================

const marketPrices = document.querySelectorAll(".price");

if (marketPrices.length > 0) {

    setInterval(function () {

        marketPrices.forEach(function (price) {

            const oldColor = price.style.color;

            price.style.color = "#f5c84c";

            setTimeout(function () {

                price.style.color = oldColor || "#ffffff";

            }, 500);

        });

    }, 3000);

}

// ===============================
// Welcome
// ===============================

window.addEventListener("load", function () {

    console.log("Welcome to CptMarkets Dashboard");

   if (window.Tawk_API) {
    window.Tawk_API.onLoad = function () {
        window.Tawk_API.hideWidget();
    };
} 
    }

});
