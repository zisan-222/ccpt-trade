/* ==========================================
   CPTMARKETS
   assets.js - Part 1
========================================== */

/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    if (typeof refreshBalanceUI === "function") {
        refreshBalanceUI();
    }
});


/* ==========================================
   BALANCE SHOW / HIDE
========================================== */

const eyeButton = document.getElementById("assetEye");
const assetBalance = document.getElementById("assetBalance");

let balanceVisible = true;
let originalBalance = "";

if (assetBalance) {
    originalBalance = assetBalance.textContent;
}

if (eyeButton && assetBalance) {
    eyeButton.addEventListener("click", function () {
        if (balanceVisible) {
            originalBalance = assetBalance.textContent;
            assetBalance.textContent = "••••••";
            eyeButton.classList.remove("fa-eye");
            eyeButton.classList.add("fa-eye-slash");
            balanceVisible = false;
        } else {
            assetBalance.textContent = originalBalance;
            eyeButton.classList.remove("fa-eye-slash");
            eyeButton.classList.add("fa-eye");
            balanceVisible = true;
        }
    });
}


/* ==========================================
   REFRESH BUTTON
========================================== */

const refreshButton = document.querySelector(".fa-rotate-right");

if (refreshButton) {
    refreshButton.addEventListener("click", function () {
        refreshButton.style.transition = "0.6s";
        refreshButton.style.transform = "rotate(360deg)";

        setTimeout(function () {
            refreshButton.style.transition = "none";
            refreshButton.style.transform = "rotate(0deg)";
            if (typeof refreshBalanceUI === "function") {
                refreshBalanceUI();
            }
        }, 650);
    });
}


/* ==========================================
   CPTMARKETS
   assets.js - Part 2
========================================== */

/* ==========================================
   DEPOSIT BUTTON (Fixed to open deposit.html directly)
========================================== */

const depositBtn = document.querySelector(".deposit-btn");

if (depositBtn) {
    depositBtn.addEventListener("click", function (e) {
        // কোনো বাধা না দিয়ে সরাসরি deposit.html এ যাওয়ার অনুমতি দেওয়া হলো
        window.location.href = "deposit.html";
    });
}


/* ==========================================
   WITHDRAWAL INFORMATION INTERFACE
========================================== */

const withdrawBtn = document.querySelector(".withdraw-btn");
const withdrawInfoPage = document.getElementById("withdrawInfoPage");
const withdrawClose = document.getElementById("withdrawClose");
const withdrawMainAccount = document.getElementById("withdrawMainAccount");


/* OPEN */
if (withdrawBtn && withdrawInfoPage) {
    withdrawBtn.addEventListener("click", function (e) {
        e.preventDefault();
        withdrawInfoPage.style.display = "flex";
        document.body.style.overflow = "hidden";
    });
}


/* CLOSE */
if (withdrawClose && withdrawInfoPage) {
    withdrawClose.addEventListener("click", function () {
        withdrawInfoPage.style.display = "none";
        document.body.style.overflow = "";
    });
}


/* GO TO MAIN ACCOUNT */
if (withdrawMainAccount) {
    withdrawMainAccount.addEventListener("click", function () {
        window.location.href = "dashboard.html";
    });
}


/* ==========================================
   UPDATE BALANCE INTERVAL
========================================== */

setInterval(function () {
    if (typeof refreshBalanceUI === "function") {
        refreshBalanceUI();
    }
}, 1000);
