/* ==========================================
   CPTMARKETS
   balance.js
   FIREBASE BALANCE SYSTEM
   FINAL - TRADE + ADMIN COMPATIBLE
========================================== */


/* ==========================================
   FIREBASE STATE
========================================== */

let CPT_AUTH = null;
let CPT_DB = null;

let currentBalanceUser = null;
let balanceUnsubscribe = null;

let firebaseReady = false;


/* ==========================================
   LOCAL CACHE
========================================== */

const BALANCE_KEY_PREFIX =
    "cptmarkets_balance_";

const DEFAULT_BALANCE = 0.00;


/* ==========================================
   GET LOCAL BALANCE KEY
========================================== */

function getBalanceKey() {

    if (
        currentBalanceUser &&
        currentBalanceUser.uid
    ) {

        return (
            BALANCE_KEY_PREFIX +
            currentBalanceUser.uid
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

function initializeLocalBalance() {

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

    initializeLocalBalance();


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


    return Math.max(
        0,
        value
    );

}


/* ==========================================
   LOCAL BALANCE SET
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


    return amount;

}


/* ==========================================
   USD FORMAT
========================================== */

function formatUSD(
    amount
) {

    return (
        "$" +
        Number(
            amount || 0
        ).toFixed(2)
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
        "currentBalance",
        "userBalance"

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
   CONNECT FIREBASE
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


        firebaseReady = true;


        firebaseAuth.onAuthStateChanged(
            CPT_AUTH,
            async function (user) {

                currentBalanceUser =
                    user || null;


                /* ==========================
                   NO USER
                ========================== */

                if (!user) {

                    if (
                        typeof balanceUnsubscribe ===
                        "function"
                    ) {

                        balanceUnsubscribe();

                        balanceUnsubscribe =
                            null;

                    }


                    initializeLocalBalance();

                    refreshBalanceUI();

                    return;

                }


                /* ==========================
                   USER LOGGED IN
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
   FIREBASE BALANCE LISTENER
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


        currentBalanceUser =
            firebaseUser;


        initializeLocalBalance();


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

            balanceUnsubscribe =
                null;

        }


        /* ==========================
           FIREBASE REAL-TIME LISTENER
        ========================== */

        balanceUnsubscribe =
            firestore.onSnapshot(

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
                     * Firebase is the
                     * MAIN SOURCE OF TRUTH.
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
        !currentBalanceUser ||
        !currentBalanceUser.uid ||
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
                currentBalanceUser.uid
            );


        const finalBalance =
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


                    const userData =
                        snapshot.data();


                    let oldBalance =
                        Number(
                            userData.balance || 0
                        );


                    if (
                        !Number.isFinite(
                            oldBalance
                        )
                    ) {

                        oldBalance =
                            0;

                    }


                    let newBalance =
                        oldBalance +
                        amount;


                    if (
                        newBalance < 0
                    ) {

                        throw new Error(
                            "Insufficient balance."
                        );

                    }


                    newBalance =
                        Number(
                            newBalance.toFixed(2)
                        );


                    transaction.update(

                        userRef,

                        {

                            balance:
                                newBalance

                        }

                    );


                    return newBalance;

                }

            );


        /*
         * Update local cache immediately.
         */

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


    /*
     * Quick local check.
     */

    if (
        getBalance() < amount
    ) {

        return false;

    }


    /*
     * Firebase transaction performs
     * the real balance check.
     */

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
   DIRECT BALANCE SET
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
        !currentBalanceUser ||
        !currentBalanceUser.uid ||
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
                currentBalanceUser.uid
            );


        await firestore.updateDoc(

            userRef,

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
            "Balance set failed:",
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

window.refreshBalance =
    refreshBalanceUI;


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeLocalBalance();

        refreshBalanceUI();

    }
);


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
   ERROR PROTECTION
========================================== */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "CptMarkets Balance JS Error:",
            event.error ||
            event.message
        );

    }
);


/* ==========================================
   END
========================================== */
