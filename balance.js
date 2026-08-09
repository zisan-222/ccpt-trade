/* ==========================================
   CPTMARKETS
   balance.js (Final)
========================================== */

const BALANCE_KEY = "cptmarkets_balance";
const DEFAULT_BALANCE = 0.00;

/* ==========================================
   INITIALIZE BALANCE
========================================== */

function initializeBalance() {

    if (localStorage.getItem(BALANCE_KEY) === null) {

        localStorage.setItem(
            BALANCE_KEY,
            DEFAULT_BALANCE.toFixed(2)
        );

    }

}

/* ==========================================
   GET BALANCE
========================================== */

function getBalance() {

    initializeBalance();

    const value = parseFloat(
        localStorage.getItem(BALANCE_KEY)
    );

    return isNaN(value) ? 0 : value;

}

/* ==========================================
   SAVE BALANCE
========================================== */

function setBalance(amount) {

    amount = Number(amount);

    if (isNaN(amount)) amount = 0;

    localStorage.setItem(
        BALANCE_KEY,
        amount.toFixed(2)
    );

    refreshBalanceUI();

}

/* ==========================================
   FORMAT USD
========================================== */

function formatUSD(amount) {

    return "$" + Number(amount).toFixed(2);

}

/* ==========================================
   REFRESH BALANCE UI
========================================== */

function refreshBalanceUI() {

    const balance = getBalance();

    /* Dashboard */
    const dashboardBalance =
        document.getElementById("balance");

    if (dashboardBalance) {
        dashboardBalance.textContent =
            formatUSD(balance);
    }

    /* Assets */
    const assetBalance =
        document.getElementById("assetBalance");

    if (assetBalance) {
        assetBalance.textContent =
            formatUSD(balance);
    }

    const availableBalance =
        document.getElementById("availableBalance");

    if (availableBalance) {
        availableBalance.textContent =
            formatUSD(balance);
    }

    const fundingBalance =
        document.getElementById("fundingBalance");

    if (fundingBalance) {
        fundingBalance.textContent =
            formatUSD(balance);
    }

}

/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    initializeBalance();

    refreshBalanceUI();

});

/* ==========================================
   AUTO SYNC
========================================== */

window.addEventListener("storage", function () {

    refreshBalanceUI();

});

/* ==========================================
   MANUAL REFRESH
========================================== */

function reloadBalance() {

    refreshBalanceUI();

}
/* ==========================================
   ADD BALANCE
========================================== */

function addBalance(amount) {

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        return false;
    }

    const current = getBalance();

    setBalance(current + amount);

    return true;

}

/* ==========================================
   SUBTRACT BALANCE
========================================== */

function subtractBalance(amount) {

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        return false;
    }

    const current = getBalance();

    if (current < amount) {
        return false;
    }

    setBalance(current - amount);

    return true;

}

/* ==========================================
   CHECK BALANCE
========================================== */

function hasEnoughBalance(amount) {

    amount = Number(amount);

    return getBalance() >= amount;

}

/* ==========================================
   RESET BALANCE
========================================== */

function resetBalance() {

    setBalance(0);

}

/* ==========================================
   ADMIN SUPPORT
========================================== */

function adminSetBalance(amount) {

    setBalance(amount);

}

/* ==========================================
   FUTURE SUPPORT
========================================== */

window.CPTBalance = {

    get: getBalance,
    set: setBalance,
    add: addBalance,
    subtract: subtractBalance,
    reset: resetBalance,
    check: hasEnoughBalance,
    refresh: refreshBalanceUI,
    adminSet: adminSetBalance

};

/* ==========================================
   END OF balance.js
========================================== */
