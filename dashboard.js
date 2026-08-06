// ===============================
// CPTMARKETS DASHBOARD
// dashboard.js
// ===============================

// Balance Show / Hide

const eyeIcon = document.querySelector(".asset-header i");
const balance = document.getElementById("balance");

let visible = true;

if (eyeIcon && balance) {
    eyeIcon.addEventListener("click", () => {

        if (visible) {
            balance.innerText = "********";
            eyeIcon.classList.remove("fa-eye");
            eyeIcon.classList.add("fa-eye-slash");
        } else {
            balance.innerText = "$0.00";
            eyeIcon.classList.remove("fa-eye-slash");
            eyeIcon.classList.add("fa-eye");
        }

        visible = !visible;
    });
}

// Refresh Animation

const refreshBtn = document.querySelector(".fa-rotate-right");

if (refreshBtn) {

    refreshBtn.addEventListener("click", () => {

        refreshBtn.style.transform = "rotate(360deg)";
        refreshBtn.style.transition = "0.6s";

        setTimeout(() => {
            refreshBtn.style.transform = "rotate(0deg)";
        }, 600);

    });

}

// Open Tawk Live Chat
function openSupportChat() {
    if (typeof Tawk_API !== "undefined") {
        Tawk_API.maximize();
    }
}

// Deposit Button
const depositBtn = document.querySelector(".deposit-btn");

if (depositBtn) {
    depositBtn.addEventListener("click", openSupportChat);
}

// Withdraw Button

const withdrawBtn = document.querySelector(".withdraw-btn");

if (withdrawBtn) {
    withdrawBtn.addEventListener("click", () => {
        alert("Withdraw page coming soon.");
    });
}

// Transfer Button

const transferBtn = document.querySelector(".transfer-btn");

if (transferBtn) {
    transferBtn.addEventListener("click", () => {
        alert("Transfer page coming soon.");
    });
}
// Support Button
const supportBtn = document.querySelector(".support-btn");

if (supportBtn) {
    supportBtn.addEventListener("click", openSupportChat);
}

// Loan Button
const loanBtn = document.querySelector(".loan-btn");

if (loanBtn) {
    loanBtn.addEventListener("click", openSupportChat);
}
// Menu Click Effect

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        item.style.transform = "scale(0.95)";

        setTimeout(() => {
            item.style.transform = "scale(1)";
        }, 120);

    });

});

// Bottom Navigation Active

const navItems = document.querySelectorAll(".bottom-nav a");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(nav => nav.classList.remove("active"));

        item.classList.add("active");

    });

});

// Market Flash Animation

const marketPrices = document.querySelectorAll(".price");

setInterval(() => {

    marketPrices.forEach(price => {

        price.style.color = "#f5c84c";

        setTimeout(() => {
            price.style.color = "#ffffff";
        }, 500);

    });

}, 3000);

// Welcome Message

window.addEventListener("load", () => {

    console.log("Welcome to CptMarkets Dashboard");

});
