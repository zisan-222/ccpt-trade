/* ==========================================
   CPTMARKETS
   balance.js
   FIREBASE BALANCE SYSTEM
   FINAL FOUNDATION
========================================== */


/* ==========================================
   FIREBASE
========================================== */

let CPT_AUTH = null;
let CPT_DB = null;

let currentFirebaseUser = null;
let balanceUnsubscribe = null;


/* ==========================================
   LOCAL STORAGE
========================================== */

const BALANCE_KEY_PREFIX =
    "cptmarkets_balance_";

const DEFAULT_BALANCE = 0.00;


/* ==========================================
   FIREBASE INITIALIZATION
========================================== */

async function initializeCPTFirebase() {

    try {

        const firebaseConfig =
            await import(
                "./firebase/firebase-config.js"
            );

        CPT_AUTH =
            firebaseConfig.auth;

        CPT_DB =
            firebaseConfig.db;


        const firebaseAuth =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"
            );


        firebaseAuth.onAuthStateChanged(
            CPT_AUTH,
            function (user) {

                currentFirebaseUser =
                    user || null;


                if (!user) {

                    if (
                        typeof balanceUnsubscribe ===
                        "function"
                    ) {

                        balanceUnsubscribe();

                        balanceUnsubscribe =
                            null;

                    }


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


    return value;

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

    return (
        "$" +
        Number(amount || 0)
            .toFixed(2)
    );

}


/* ==========================================
   REFRESH UI
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


        if (
            typeof balanceUnsubscribe ===
            "function"
        ) {

            balanceUnsubscribe();

            balanceUnsubscribe =
                null;

        }


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

                        return;

                    }


                    const data =
                        snapshot.data();


                    const firebaseBalance =
                        Number(
                            data.balance || 0
                        );


                    const safeBalance =
                        Number.isFinite(
                            firebaseBalance
                        )
                            ? Math.max(
                                0,
                                firebaseBalance
                            )
                            : 0;


                    /*
                     * Firebase is the
                     * source of truth.
                     */

                    localStorage.setItem(

                        getBalanceKey(),

                        safeBalance.toFixed(2)

                    );


                    refreshBalanceUI();


                    console.log(
                        "CptMarkets balance synced:",
                        safeBalance
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


        const result =
            await firestore.runTransaction(
                CPT_DB,

                async function (transaction) {

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


                    const newBalance =
                        oldBalance +
                        amount;


                    if (
                        newBalance < 0
                    ) {

                        throw new Error(
                            "Insufficient balance."
                        );

                    }


                    const finalBalance =
                        Number(
                            newBalance.toFixed(2)
                        );


                    transaction.update(

                        userRef,

                        {
                            balance:
                                finalBalance
                        }

                    );


                    return finalBalance;

                }
            );


        /*
         * Immediately update local cache.
         */

        setLocalBalance(
            result
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


    const current =
        getBalance();


    if (
        current < amount
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


        await firestore.updateDoc(

            firestore.doc(
                CPT_DB,
                "users",
                currentFirebaseUser.uid
            ),

            {
                balance:
                    Number(
                        amount.toFixed(2)
                    )
            }

        );


        setLocalBalance(
            amount
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


/* ==========================================
   START
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
