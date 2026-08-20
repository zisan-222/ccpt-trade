/* ==========================================
   CPTMARKETS
   ADMIN USER MANAGEMENT
   admin-users.js
   FINAL FIREBASE BALANCE + HISTORY VERSION
========================================== */

import {
    auth,
    db
} from "./firebase/firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* ==========================================
   VARIABLES
========================================== */

let currentUser = null;
let currentUserDoc = null;


/* ==========================================
   ADMIN AUTH CHECK
========================================== */

onAuthStateChanged(
    auth,
    function (user) {

        if (!user) {

            window.location.href =
                "index.html";

            return;

        }

        console.log(
            "Admin authenticated:",
            user.email
        );

    }
);


/* ==========================================
   ELEMENTS
========================================== */

const searchButton =
    document.getElementById(
        "searchUserBtn"
    );

const addButton =
    document.getElementById(
        "addBalanceBtn"
    );

const removeButton =
    document.getElementById(
        "removeBalanceBtn"
    );

const profitButton =
    document.getElementById(
        "addProfitBtn"
    );

const lossButton =
    document.getElementById(
        "addLossBtn"
    );

const logoutButton =
    document.getElementById(
        "adminLogout"
    );


/* ==========================================
   SEARCH BUTTON
========================================== */

if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchUser
    );

}


/* ==========================================
   ENTER KEY SEARCH
========================================== */

const uidInput =
    document.getElementById(
        "userUidInput"
    );

if (uidInput) {

    uidInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                searchUser();

            }

        }
    );

}


/* ==========================================
   SEARCH USER
   Supports:
   1. Firebase UID
   2. Visible User ID
========================================== */

async function searchUser() {

    if (!uidInput) {

        return;

    }


    const searchValue =
        uidInput.value.trim();


    if (!searchValue) {

        alert(
            "Please enter Firebase UID or User ID."
        );

        return;

    }


    try {

        currentUser = null;
        currentUserDoc = null;


        const usersRef =
            collection(
                db,
                "users"
            );


        let foundDoc = null;


        /* ==================================
           FIRST:
           TRY FIREBASE DOCUMENT ID / UID
        ================================== */

        const directRef =
            doc(
                db,
                "users",
                searchValue
            );


        const directSnapshot =
            await getDoc(
                directRef
            );


        if (
            directSnapshot.exists()
        ) {

            foundDoc =
                directSnapshot;

        }


        /* ==================================
           SECOND:
           TRY VISIBLE USER ID
        ================================== */

        if (!foundDoc) {

            const userQuery =
                query(
                    usersRef,
                    where(
                        "userId",
                        "==",
                        searchValue
                    )
                );


            const snapshot =
                await getDocs(
                    userQuery
                );


            if (
                !snapshot.empty
            ) {

                foundDoc =
                    snapshot.docs[0];

            }

        }


        /* ==================================
           USER NOT FOUND
        ================================== */

        if (!foundDoc) {

            console.log(
                "User not found:",
                searchValue
            );

            currentUser = null;
            currentUserDoc = null;

            showNotFound();

            return;

        }


        /* ==================================
           USER FOUND
        ================================== */

        currentUserDoc =
            foundDoc;

        currentUser =
            foundDoc.data();


        console.log(
            "User found:",
            currentUser
        );


        showUser(
            foundDoc.id,
            currentUser
        );


    } catch (error) {

        console.error(
            "User search failed:",
            error
        );


        alert(
            "Unable to search user.\n\n" +
            error.message
        );

    }

}


/* ==========================================
   SHOW USER
========================================== */

function showUser(
    docId,
    userData
) {

    const result =
        document.getElementById(
            "userResult"
        );

    const notFound =
        document.getElementById(
            "notFound"
        );


    if (notFound) {

        notFound.style.display =
            "none";

    }


    if (result) {

        result.style.display =
            "block";

    }


    const nameElement =
        document.getElementById(
            "userName"
        );


    if (nameElement) {

        nameElement.textContent =
            userData.username ||
            userData.name ||
            "User";

    }


    const uidElement =
        document.getElementById(
            "userUid"
        );


    if (uidElement) {

        /*
         * Show real Firebase document UID.
         */

        uidElement.textContent =
            docId || "-";

    }


    const emailElement =
        document.getElementById(
            "userEmail"
        );


    if (emailElement) {

        emailElement.textContent =
            userData.email ||
            "-";

    }


    updateBalanceDisplay(
        Number(
            userData.balance || 0
        )
    );

}


/* ==========================================
   BALANCE DISPLAY
========================================== */

function updateBalanceDisplay(
    balance
) {

    const balanceElement =
        document.getElementById(
            "userBalance"
        );


    if (!balanceElement) {

        return;

    }


    balanceElement.textContent =
        "$" +
        Number(
            balance || 0
        ).toFixed(2);

}


/* ==========================================
   SHOW NOT FOUND
========================================== */

function showNotFound() {

    const result =
        document.getElementById(
            "userResult"
        );

    const notFound =
        document.getElementById(
            "notFound"
        );


    if (result) {

        result.style.display =
            "none";

    }


    if (notFound) {

        notFound.style.display =
            "block";

    }

}


/* ==========================================
   NORMAL BALANCE - ADD
========================================== */

if (addButton) {

    addButton.addEventListener(
        "click",
        async function () {

            await changeBalance(
                "ADD"
            );

        }
    );

}


/* ==========================================
   NORMAL BALANCE - REMOVE
========================================== */

if (removeButton) {

    removeButton.addEventListener(
        "click",
        async function () {

            await changeBalance(
                "REMOVE"
            );

        }
    );

}


/* ==========================================
   CHANGE NORMAL BALANCE
========================================== */

async function changeBalance(
    action
) {

    if (!currentUserDoc) {

        alert(
            "Please search for a user first."
        );

        return;

    }


    const amountInput =
        document.getElementById(
            "balanceAmount"
        );


    if (!amountInput) {

        alert(
            "Balance input not found."
        );

        return;

    }


    const amount =
        Number(
            amountInput.value
        );


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Enter a valid amount."
        );

        return;

    }


    const userRef =
        doc(
            db,
            "users",
            currentUserDoc.id
        );


    try {

        let newBalance = 0;
        let oldBalance = 0;


        /*
         * =================================
         * ATOMIC FIRESTORE TRANSACTION
         * =================================
         */

        await runTransaction(
            db,
            async function (transaction) {

                const userSnapshot =
                    await transaction.get(
                        userRef
                    );


                if (
                    !userSnapshot.exists()
                ) {

                    throw new Error(
                        "User document no longer exists."
                    );

                }


                const userData =
                    userSnapshot.data();


                oldBalance =
                    Number(
                        userData.balance || 0
                    );


                if (
                    action === "ADD"
                ) {

                    newBalance =
                        oldBalance +
                        amount;

                } else {

                    newBalance =
                        oldBalance -
                        amount;


                    if (
                        newBalance < 0
                    ) {

                        throw new Error(
                            "Balance cannot be negative."
                        );

                    }

                }


                /*
                 * UPDATE USER BALANCE
                 */

                transaction.update(
                    userRef,
                    {
                        balance:
                            Number(
                                newBalance.toFixed(2)
                            )
                    }
                );


                /*
                 * CREATE ADMIN BALANCE HISTORY
                 */

                const historyRef =
                    doc(
                        collection(
                            db,
                            "tradeHistory"
                        )
                    );


                transaction.set(
                    historyRef,
                    {

                        uid:
                            currentUserDoc.id,

                        userId:
                            userData.userId ||
                            "",

                        username:
                            userData.username ||
                            userData.name ||
                            "User",

                        email:
                            userData.email ||
                            "",

                        side:
                            "ADMIN",

                        entryPrice:
                            0,

                        closePrice:
                            0,

                        amount:
                            Number(
                                amount.toFixed(2)
                            ),

                        profitLoss:
                            Number(
                                (
                                    action === "ADD"
                                        ? amount
                                        : -amount
                                ).toFixed(2)
                            ),

                        type:
                            "ADMIN_BALANCE",

                        action:
                            action,

                        source:
                            "ADMIN",

                        oldBalance:
                            Number(
                                oldBalance.toFixed(2)
                            ),

                        newBalance:
                            Number(
                                newBalance.toFixed(2)
                            ),

                        time:
                            new Date().toLocaleString(),

                        createdAt:
                            serverTimestamp()

                    }
                );

            }
        );


        /*
         * UPDATE LOCAL ADMIN DATA
         */

        currentUser.balance =
            newBalance;


        updateBalanceDisplay(
            newBalance
        );


        amountInput.value =
            "";


        showMessage(

            action === "ADD"

                ? "Balance added successfully."

                : "Balance removed successfully."

        );


        console.log(
            "Balance changed:",
            {
                action,
                oldBalance,
                amount,
                newBalance
            }
        );


    } catch (error) {

        console.error(
            "Balance update failed:",
            error
        );


        alert(
            "Balance update failed.\n\n" +
            error.message
        );

    }

}


/* ==========================================
   PROFIT BUTTON
========================================== */

if (profitButton) {

    profitButton.addEventListener(
        "click",
        async function () {

            await addTradeResult(
                "PROFIT"
            );

        }
    );

}


/* ==========================================
   LOSS BUTTON
========================================== */

if (lossButton) {

    lossButton.addEventListener(
        "click",
        async function () {

            await addTradeResult(
                "LOSS"
            );

        }
    );

}


/* ==========================================
   ADD PROFIT / LOSS
========================================== */

async function addTradeResult(
    type
) {

    if (!currentUserDoc) {

        alert(
            "Please search for a user first."
        );

        return;

    }


    const amountInput =
        document.getElementById(
            "tradePLAmount"
        );


    if (!amountInput) {

        alert(
            "Trade P/L input not found."
        );

        return;

    }


    const amount =
        Number(
            amountInput.value
        );


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Enter a valid profit/loss amount."
        );

        return;

    }


    const userRef =
        doc(
            db,
            "users",
            currentUserDoc.id
        );


    try {

        let oldBalance = 0;
        let newBalance = 0;
        let profitLoss = 0;


        /*
         * =================================
         * ATOMIC TRANSACTION
         * =================================
         */

        await runTransaction(
            db,
            async function (transaction) {

                const userSnapshot =
                    await transaction.get(
                        userRef
                    );


                if (
                    !userSnapshot.exists()
                ) {

                    throw new Error(
                        "User document no longer exists."
                    );

                }


                const userData =
                    userSnapshot.data();


                oldBalance =
                    Number(
                        userData.balance || 0
                    );


                /* ==========================
                   PROFIT
                ========================== */

                if (
                    type === "PROFIT"
                ) {

                    profitLoss =
                        amount;

                    newBalance =
                        oldBalance +
                        amount;

                }


                /* ==========================
                   LOSS
                ========================== */

                else {

                    profitLoss =
                        -amount;

                    newBalance =
                        oldBalance -
                        amount;


                    if (
                        newBalance < 0
                    ) {

                        throw new Error(
                            "Loss cannot be greater than the user's balance."
                        );

                    }

                }


                newBalance =
                    Number(
                        newBalance.toFixed(2)
                    );


                profitLoss =
                    Number(
                        profitLoss.toFixed(2)
                    );


                /*
                 * UPDATE BALANCE
                 */

                transaction.update(
                    userRef,
                    {
                        balance:
                            newBalance
                    }
                );


                /*
                 * CREATE TRADE HISTORY
                 */

                const historyRef =
                    doc(
                        collection(
                            db,
                            "tradeHistory"
                        )
                    );


                transaction.set(
                    historyRef,
                    {

                        uid:
                            currentUserDoc.id,

                        userId:
                            userData.userId ||
                            "",

                        username:
                            userData.username ||
                            userData.name ||
                            "User",

                        email:
                            userData.email ||
                            "",

                        side:
                            "ADMIN",

                        entryPrice:
                            0,

                        closePrice:
                            0,

                        amount:
                            Number(
                                amount.toFixed(2)
                            ),

                        profitLoss:
                            profitLoss,

                        type:
                            type,

                        source:
                            "ADMIN",

                        oldBalance:
                            Number(
                                oldBalance.toFixed(2)
                            ),

                        newBalance:
                            newBalance,

                        time:
                            new Date().toLocaleString(),

                        createdAt:
                            serverTimestamp()

                    }

                );

            }
        );


        /*
         * UPDATE ADMIN SCREEN
         */

        currentUser.balance =
            newBalance;


        updateBalanceDisplay(
            newBalance
        );


        amountInput.value =
            "";


        showMessage(

            type === "PROFIT"

                ? "Trade profit added successfully."

                : "Trade loss added successfully."

        );


        console.log(
            "Admin trade result saved:",
            {
                type,
                profitLoss,
                oldBalance,
                newBalance
            }
        );


    } catch (error) {

        console.error(
            "Trade P/L update failed:",
            error
        );


        alert(
            "Trade P/L update failed.\n\n" +
            error.message
        );

    }

}


/* ==========================================
   SUCCESS MESSAGE
========================================== */

function showMessage(
    message
) {

    const element =
        document.getElementById(
            "actionMessage"
        );


    if (!element) {

        alert(message);

        return;

    }


    element.textContent =
        message;


    clearTimeout(
        showMessage.timer
    );


    showMessage.timer =
        setTimeout(
            function () {

                element.textContent =
                    "";

            },
            3000
        );

}


/* ==========================================
   LOGOUT
========================================== */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                await signOut(
                    auth
                );


                window.location.href =
                    "index.html";


            } catch (error) {

                console.error(
                    "Logout failed:",
                    error
                );


                alert(
                    "Logout failed.\n\n" +
                    error.message
                );

            }

        }
    );

}


/* ==========================================
   END
========================================== */

console.log(
    "CptMarkets Admin User Management loaded."
);
