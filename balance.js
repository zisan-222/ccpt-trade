/* ==========================================
   CPTMARKETS
   balance.js
   FIREBASE BALANCE SYNC
========================================== */


/* ==========================================
   LOCAL STORAGE PREFIX
========================================== */

const BALANCE_KEY_PREFIX =
    "cptmarkets_balance_";


/* ==========================================
   DEFAULT BALANCE
========================================== */

const DEFAULT_BALANCE = 0.00;


/* ==========================================
   CURRENT FIREBASE USER
========================================== */

let currentFirebaseUser = null;


/* ==========================================
   FIREBASE LISTENER
========================================== */

let balanceUnsubscribe = null;


/* ==========================================
   GET LOCAL BALANCE KEY
========================================== */

function getBalanceKey() {

    if (
        currentFirebaseUser &&
        currentFirebaseUser.uid
    ) {

        return (
            BALANCE_KEY_PREFIX +
            currentFirebaseUser.uid
        );

    }

    return BALANCE_KEY_PREFIX + "guest";

}


/* ==========================================
   INITIALIZE BALANCE
========================================== */

function initializeBalance() {

    const key =
        getBalanceKey();


    if (
        localStorage.getItem(key) === null
    ) {

        localStorage.setItem(
            key,
            DEFAULT_BALANCE.toFixed(2)
        );

    }

}


/* ==========================================
   GET BALANCE
========================================== */

function getBalance() {

    initializeBalance();


    const value =
        parseFloat(
            localStorage.getItem(
                getBalanceKey()
            )
        );


    return isNaN(value)
        ? 0
        : value;

}


/* ==========================================
   SAVE LOCAL BALANCE
========================================== */

function setLocalBalance(amount) {

    amount = Number(amount);


    if (isNaN(amount)) {

        amount = 0;

    }


    localStorage.setItem(
        getBalanceKey(),
        amount.toFixed(2)
    );


    refreshBalanceUI();

}


/* ==========================================
   FORMAT USD
========================================== */

function formatUSD(amount) {

    return (
        "$" +
        Number(amount || 0).toFixed(2)
    );

}


/* ==========================================
   REFRESH BALANCE UI
========================================== */

function refreshBalanceUI() {

    const balance =
        getBalance();


    /* ======================================
       DASHBOARD
    ====================================== */

    const dashboardBalance =
        document.getElementById(
            "balance"
        );


    if (dashboardBalance) {

        dashboardBalance.textContent =
            formatUSD(balance);

    }


    /* ======================================
       ASSETS
    ====================================== */

    const assetBalance =
        document.getElementById(
            "assetBalance"
        );


    if (assetBalance) {

        assetBalance.textContent =
            formatUSD(balance);

    }


    const availableBalance =
        document.getElementById(
            "availableBalance"
        );


    if (availableBalance) {

        availableBalance.textContent =
            formatUSD(balance);

    }


    const fundingBalance =
        document.getElementById(
            "fundingBalance"
        );


    if (fundingBalance) {

        fundingBalance.textContent =
            formatUSD(balance);

    }


    /* ======================================
       TRADE
    ====================================== */

    const tradeBalance =
        document.getElementById(
            "tradeBalance"
        );


    if (tradeBalance) {

        tradeBalance.textContent =
            formatUSD(balance);

    }


    const demoBalance =
        document.getElementById(
            "demoBalance"
        );


    if (demoBalance) {

        demoBalance.textContent =
            formatUSD(balance);

    }


    /* ======================================
       OTHER BALANCE ELEMENTS
    ====================================== */

    const totalBalance =
        document.getElementById(
            "totalBalance"
        );


    if (totalBalance) {

        totalBalance.textContent =
            formatUSD(balance);

    }


    const currentBalance =
        document.getElementById(
            "currentBalance"
        );


    if (currentBalance) {

        currentBalance.textContent =
            formatUSD(balance);

    }


    /* ======================================
       DATA-BALANCE ELEMENTS
    ====================================== */

    const balanceElements =
        document.querySelectorAll(
            "[data-balance]"
        );


    balanceElements.forEach(
        function (element) {

            element.textContent =
                formatUSD(balance);

        }
    );

}


/* ==========================================
   LOAD FIREBASE BALANCE
========================================== */

async function connectFirebaseBalance(
    firebaseUser
) {

    try {

        if (!firebaseUser) {

            return;

        }


        currentFirebaseUser =
            firebaseUser;


        initializeBalance();


        /*
         * Firebase modules
         */

        const firebaseConfig =
            await import(
                "./firebase/firebase-config.js"
            );


        const firestore =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
            );


        const db =
            firebaseConfig.db;


        const doc =
            firestore.doc;


        const onSnapshot =
            firestore.onSnapshot;


        const userRef =
            doc(
                db,
                "users",
                firebaseUser.uid
            );


        /*
         * Remove old listener
         */

        if (
            typeof balanceUnsubscribe ===
            "function"
        ) {

            balanceUnsubscribe();

        }


        /*
         * REAL-TIME FIRESTORE LISTENER
         */

        balanceUnsubscribe =
            onSnapshot(
                userRef,
                function (snapshot) {

                    if (
                        !snapshot.exists()
                    ) {

                        console.warn(
                            "CptMarkets: User document not found."
                        );

                        return;

                    }


                    const userData =
                        snapshot.data();


                    /*
                     * IMPORTANT:
                     * Admin balance
                     */

                    const firebaseBalance =
                        Number(
                            userData.balance || 0
                        );


                    /*
                     * Save Firebase balance
                     * to local cache
                     */

                    localStorage.setItem(
                        getBalanceKey(),
                        firebaseBalance.toFixed(2)
                    );


                    /*
                     * Update every page element
                     */

                    refreshBalanceUI();


                    console.log(
                        "CptMarkets Firebase Balance:",
                        firebaseBalance
                    );

                },
                function (error) {

                    console.error(
                        "Firebase balance listener error:",
                        error
                    );

                }
            );


    } catch (error) {

        console.error(
            "Failed to connect Firebase balance:",
            error
        );

    }

}


/* ==========================================
   ADD BALANCE
========================================== */

function addBalance(amount) {

    amount =
        Number(amount);


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        return false;

    }


    const current =
        getBalance();


    setLocalBalance(
        current + amount
    );


    return true;

}


/* ==========================================
   SUBTRACT BALANCE
========================================== */

function subtractBalance(amount) {

    amount =
        Number(amount);


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        return false;

    }


    const current =
        getBalance();


    if (
        current < amount
    ) {

        return false;

    }


    setLocalBalance(
        current - amount
    );


    return true;

}


/* ==========================================
   CHECK BALANCE
========================================== */

function hasEnoughBalance(amount) {

    amount =
        Number(amount);


    return (
        getBalance() >= amount
    );

}


/* ==========================================
   RESET LOCAL BALANCE
========================================== */

function resetBalance() {

    setLocalBalance(0);

}


/* ==========================================
   ADMIN SUPPORT
========================================== */

function adminSetBalance(amount) {

    setLocalBalance(amount);

}


/* ==========================================
   MANUAL REFRESH
========================================== */

function reloadBalance() {

    refreshBalanceUI();

}


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeBalance();

        refreshBalanceUI();

    }
);


/* ==========================================
   FIREBASE AUTH
========================================== */

async function initializeFirebaseBalance() {

    try {

        const firebaseConfig =
            await import(
                "./firebase/firebase-config.js"
            );


        const firebaseAuth =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"
            );


        firebaseAuth.onAuthStateChanged(
            firebaseConfig.auth,
            function (user) {

                if (!user) {

                    currentFirebaseUser =
                        null;

                    refreshBalanceUI();

                    return;

                }


                connectFirebaseBalance(
                    user
                );

            }
        );


    } catch (error) {

        console.error(
            "Firebase Auth balance initialization failed:",
            error
        );

    }

}


/* ==========================================
   START FIREBASE BALANCE SYSTEM
========================================== */

initializeFirebaseBalance();


/* ==========================================
   STORAGE SYNC
========================================== */

window.addEventListener(
    "storage",
    function () {

        refreshBalanceUI();

    }
);


/* ==========================================
   GLOBAL CPT BALANCE API
========================================== */

window.CPTBalance = {

    get:
        getBalance,

    set:
        setLocalBalance,

    add:
        addBalance,

    subtract:
        subtractBalance,

    reset:
        resetBalance,

    check:
        hasEnoughBalance,

    refresh:
        refreshBalanceUI,

    adminSet:
        adminSetBalance

};


/* ==========================================
   END
========================================== */
