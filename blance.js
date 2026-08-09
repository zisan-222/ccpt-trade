/* ==========================================
   CPTMARKETS
   balance.js
========================================== */

const BALANCE_KEY = "cptmarkets_balance";

/* ==========================================
   DEFAULT BALANCE
========================================== */

function initBalance() {

    if (localStorage.getItem(BALANCE_KEY) === null) {

        localStorage.setItem(BALANCE_KEY, "0.00");

    }

}

/* ==========================================
   GET BALANCE
========================================== */

function getBalance() {

    initBalance();

    return parseFloat(

        localStorage.getItem(BALANCE_KEY)

    ) || 0;

}

/* ==========================================
   SAVE BALANCE
========================================== */

function setBalance(amount) {

    localStorage.setItem(

        BALANCE_KEY,

        Number(amount).toFixed(2)

    );

}

/* ==========================================
   FORMAT USD
========================================== */

function formatBalance(amount) {

    return "$" + Number(amount).toFixed(2);

}
/* ==========================================
   UPDATE BALANCE ON PAGE
========================================== */

function updateBalanceUI() {

    const balance = getBalance();

    /* Dashboard */
    const dashboardBalance =
        document.getElementById("balance");

    if (dashboardBalance) {
        dashboardBalance.textContent =
            formatBalance(balance);
    }

    /* Assets */
    const assetBalance =
        document.getElementById("assetBalance");

    if (assetBalance) {
        assetBalance.textContent =
            formatBalance(balance);
    }

    const availableBalance =
        document.getElementById("availableBalance");

    if (availableBalance) {
        availableBalance.textContent =
            formatBalance(balance);
    }

    const fundingBalance =
        document.getElementById("fundingBalance");

    if (fundingBalance) {
        fundingBalance.textContent =
            formatBalance(balance);
    }

}

/* ==========================================
   INCREASE BALANCE
========================================== */

function addBalance(amount) {

    const current = getBalance();

    setBalance(current + Number(amount));

    updateBalanceUI();

}

/* ==========================================
   DECREASE BALANCE
========================================== */

function subtractBalance(amount) {

    const current = getBalance();

    if (current >= amount) {

        setBalance(current - Number(amount));

        updateBalanceUI();

        return true;

    }

    return false;

}

/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    initBalance();

    updateBalanceUI();

});

/* ==========================================
   END OF balance.js
========================================== */
