/* ==========================================
   CPTMARKETS
   balance.js
   FIREBASE BALANCE SYSTEM
   FINAL - FIREBASE SOURCE OF TRUTH
========================================== */


/* ==========================================
   FIREBASE STATE
========================================== */

let CPT_AUTH = null;
let CPT_DB = null;

let currentFirebaseUser = null;
let balanceUnsubscribe = null;

let firebaseReady = false;


/* ==========================================
   LOCAL STORAGE
========================================== */

const BALANCE_KEY_PREFIX =
    "cptmarkets_balance_";

const DEFAULT_BALANCE =
    0.00;


/* ==========================================
   FIREBASE INITIALIZATION
========================================== */

async function initializeCPTFirebase() {

    try {

        const config =
            await import(
                "./firebase/firebase-config.js"
            );


        CPT_AUTH =
            config.auth;

        CPT_DB =
            config.db;


        const firebaseAuth =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"
            );


        firebaseAuth.onAuthStateChanged(
            CPT_AUTH,
            async function (user) {

                currentFirebaseUser =
                    user || null;


                firebaseReady =
                    !!user;


                /* ==========================
                   USER LOGGED OUT
                ========================== */

                if (!user) {

                    if (
                        typeof balanceUnsubscribe ===
                        "function"
                    ) {

                        balanceUnsubscribe();

                    }


                    balanceUnsubscribe =
                        null;


                    refreshBalanceUI();

                    return;

                }


                /* ==========================
                   CONNECT USER BALANCE
                ========================== */

                await connectFirebaseBalance(
                    user
                );

            }
        );


    } catch (error) {

        console.error(
            "CptMarkets Firebase initialization failed:",
            error
        );

    }

}


/* ==========================================
   BALANCE KEY
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


    return (
        BALANCE_KEY_PREFIX +
        "guest"
    );

}


/* ==========================================
   INITIALIZE LOCAL BALANCE
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
        Number(
            localStorage.getItem(
                getBalanceKey()
            )
        );


    if (
        !Number.isFinite(value)
    ) {

        return 0;

    }


    return Number(
        value.toFixed(2)
    );

}


/* ==========================================
   SAVE LOCAL BALANCE
========================================== */

function setLocalBalance(
    amount
) {

    amount =
        Number(amount);


    if (
        !Number.isFinite(amount) ||
        amount < 0
    ) {

        amount = 0;

    }


    amount =
        Number(
            amount.toFixed(2)
        );


    localStorage.setItem(
        getBalanceKey(),
        amount.toFixed(2)
    );


    refreshBalanceUI();

}


/* ==========================================
   USD FORMAT
========================================== */

function formatUSD(
    amount
) {

    const safeAmount =
        Number(amount) || 0;


    return (
        "$" +
        safeAmount.toFixed(2)
    );

}


/* ==========================================
   REFRESH BALANCE UI
========================================== */

function refreshBalanceUI() {

    const balance =
        getBalance();


    const ids = [

        "balance",
        "assetBalance",
        "availableBalance",
        "fundingBalance",
        "tradeBalance",
        "demoBalance",
        "totalBalance",
        "currentBalance"

    ];


    ids.forEach(
        function (id) {

            const element =
                document.getElementById(id);


            if (element) {

                element.textContent =
                    formatUSD(balance);

            }

        }
    );


    document
        .querySelectorAll(
            "[data-balance]"
        )
        .forEach(
            function (element) {

                element.textContent =
                    formatUSD(balance);

            }
        );

}


/* ==========================================
   CONNECT FIREBASE BALANCE
========================================== */

async function connectFirebaseBalance(
    firebaseUser
) {

    try {

        if (
            !firebaseUser ||
            !CPT_DB
        ) {

            return;

        }


        currentFirebaseUser =
            firebaseUser;


        initializeBalance();


        const firestore =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
            );


        const userRef =
            firestore.doc(
                CPT_DB,
                "users",
                firebaseUser.uid
            );


        /* ==========================
           REMOVE OLD LISTENER
        ========================== */

        if (
            typeof balanceUnsubscribe ===
            "function"
        ) {

            balanceUnsubscribe();

        }


        balanceUnsubscribe =
            null;


        /* ==========================
           REAL-TIME BALANCE LISTENER
        ========================== */

        balanceUnsubscribe =
            firestore.onSnapshot(

                userRef,

                function (snapshot) {

                    if (
                        !snapshot.exists()
                    ) {

                        console.warn(
                            "CptMarkets: user document does not exist."
                        );

                        setLocalBalance(
                            0
                        );

                        return;

                    }


                    const data =
                        snapshot.data();


                    let firebaseBalance =
                        Number(
                            data.balance || 0
                        );


                    if (
                        !Number.isFinite(
                            firebaseBalance
                        )
                    ) {

                        firebaseBalance =
                            0;

                    }


                    firebaseBalance =
                        Math.max(
                            0,
                            firebaseBalance
                        );


                    firebaseBalance =
                        Number(
                            firebaseBalance.toFixed(2)
                        );


                    /*
                     * FIREBASE IS THE
                     * SOURCE OF TRUTH.
                     */

                    localStorage.setItem(

                        getBalanceKey(),

                        firebaseBalance.toFixed(2)

                    );


                    refreshBalanceUI();


                    console.log(
                        "CptMarkets balance synced:",
                        firebaseBalance
                    );

                },

                function (error) {

                    console.error(
                        "Balance listener error:",
                        error
                    );

                }

            );


    } catch (error) {

        console.error(
            "Firebase balance connection failed:",
            error
        );

    }

}


/* ==========================================
   FIREBASE BALANCE CHANGE
========================================== */

async function changeFirebaseBalance(
    amount
) {

    amount =
        Number(amount);


    if (
        !Number.isFinite(amount)
    ) {

        return false;

    }


    if (
        !currentFirebaseUser ||
        !CPT_DB
    ) {

        console.error(
            "Firebase user is not ready."
        );

        return false;

    }


    try {

        const firestore =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
            );


        const userRef =
            firestore.doc(
                CPT_DB,
                "users",
                currentFirebaseUser.uid
            );


        const finalBalance =
            await firestore.runTransaction(

                CPT_DB,

                async function (
                    transaction
                ) {

                    const snapshot =
                        await transaction.get(
                            userRef
                        );


                    if (
                        !snapshot.exists()
                    ) {

                        throw new Error(
                            "User account not found."
                        );

                    }


                    const data =
                        snapshot.data();


                    const oldBalance =
                        Number(
                            data.balance || 0
                        );


                    const safeOldBalance =
                        Number.isFinite(
                            oldBalance
                        )
                            ? oldBalance
                            : 0;


                    const newBalance =
                        safeOldBalance +
                        amount;


                    if (
                        newBalance < 0
                    ) {

                        throw new Error(
                            "Insufficient balance."
                        );

                    }


                    const safeBalance =
                        Number(
                            newBalance.toFixed(2)
                        );


                    transaction.update(

                        userRef,

                        {

                            balance:
                                safeBalance

                        }

                    );


                    return safeBalance;

                }

            );


        /* ==========================
           UPDATE LOCAL CACHE
        ========================== */

        setLocalBalance(
            finalBalance
        );


        return true;


    } catch (error) {

        console.error(
            "Firebase balance change failed:",
            error
        );


        return false;

    }

}


/* ==========================================
   ADD BALANCE
========================================== */

async function addBalance(
    amount
) {

    amount =
        Number(amount);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return false;

    }


    return await changeFirebaseBalance(
        amount
    );

}


/* ==========================================
   SUBTRACT BALANCE
========================================== */

async function subtractBalance(
    amount
) {

    amount =
        Number(amount);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return false;

    }


    return await changeFirebaseBalance(
        -amount
    );

}


/* ==========================================
   CHECK BALANCE
========================================== */

function hasEnoughBalance(
    amount
) {

    amount =
        Number(amount);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        return false;

    }


    return (
        getBalance() >= amount
    );

}


/* ==========================================
   DIRECT FIREBASE SET
========================================== */

async function adminSetBalance(
    amount
) {

    amount =
        Number(amount);


    if (
        !Number.isFinite(amount) ||
        amount < 0
    ) {

        return false;

    }


    if (
        !currentFirebaseUser ||
        !CPT_DB
    ) {

        return false;

    }


    try {

        const firestore =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
            );


        const userRef =
            firestore.doc(
                CPT_DB,
                "users",
                currentFirebaseUser.uid
            );


        const safeAmount =
            Number(
                amount.toFixed(2)
            );


        await firestore.updateDoc(

            userRef,

            {

                balance:
                    safeAmount

            }

        );


        setLocalBalance(
            safeAmount
        );


        return true;


    } catch (error) {

        console.error(
            "Admin balance set failed:",
            error
        );


        return false;

    }

}


/* ==========================================
   RESET BALANCE
========================================== */

async function resetBalance() {

    return await adminSetBalance(
        0
    );

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
   GLOBAL API
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
   GLOBAL FUNCTIONS
========================================== */

window.getBalance =
    getBalance;


window.setLocalBalance =
    setLocalBalance;


window.setBalance =
    setLocalBalance;


window.addBalance =
    addBalance;


window.subtractBalance =
    subtractBalance;


window.hasEnoughBalance =
    hasEnoughBalance;


window.resetBalance =
    resetBalance;


window.adminSetBalance =
    adminSetBalance;


window.reloadBalance =
    reloadBalance;


/*
 * Compatibility:
 *
 * trade.js may call refreshBalance()
 */

window.refreshBalance =
    refreshBalanceUI;


/* ==========================================
   START FIREBASE
========================================== */

initializeCPTFirebase();


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
   END
========================================== */
