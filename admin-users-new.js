/* ==========================================
   CPTMARKETS
   NEW ADMIN USER MANAGEMENT
   admin-users-new.js
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
   ELEMENTS
========================================== */

const searchButton =
    document.getElementById("searchUserBtn");

const uidInput =
    document.getElementById("userUidInput");

const addButton =
    document.getElementById("addBalanceBtn");

const removeButton =
    document.getElementById("removeBalanceBtn");

const profitButton =
    document.getElementById("addProfitBtn");

const lossButton =
    document.getElementById("addLossBtn");

const logoutButton =
    document.getElementById("adminLogout");


/* ==========================================
   ADMIN AUTH CHECK
========================================== */

onAuthStateChanged(
    auth,
    function (user) {

        if (!user) {

            window.location.href = "index.html";

            return;
        }

        console.log(
            "Admin authenticated:",
            user.email
        );

    }
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

if (uidInput) {

    uidInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                searchUser();

            }

        }
    );

}


/* ==========================================
   SEARCH USER
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


        /* ======================================
           TRY FIREBASE UID / DOCUMENT ID
        ====================================== */

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


        if (directSnapshot.exists()) {

            foundDoc =
                directSnapshot;

        }


        /* ======================================
           TRY VISIBLE USER ID
        ====================================== */

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


            if (!snapshot.empty) {

                foundDoc =
                    snapshot.docs[0];

            }

        }


        /* ======================================
           NOT FOUND
        ====================================== */

        if (!foundDoc) {

            currentUser = null;
            currentUserDoc = null;

            showNotFound();

            return;
        }


        /* ======================================
           USER FOUND
        ====================================== */

        currentUserDoc =
            foundDoc;

        currentUser =
            foundDoc.data();


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


    /* Change avatar initial */

    const avatar =
        document.querySelector(
            ".user-avatar"
        );


    if (avatar) {

        const username =
            userData.username ||
            userData.name ||
            "U";

        avatar.textContent =
            username
                .charAt(0)
                .toUpperCase();

    }


    console.log(
        "User loaded:",
        userData
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
            "flex";

    }

}


/* ==========================================
   ADD BALANCE
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
   REMOVE BALANCE
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
   BALANCE CONTROL
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


        await runTransaction(
            db,
            async function (transaction) {

                const userSnapshot =
                    await transaction.get(
                        userRef
                    );


                if (!userSnapshot.exists()) {

                    throw new Error(
                        "User document no longer exists."
                    );

                }


                const userData =
                    userSnapshot.data();


                const oldBalance =
                    Number(
                        userData.balance || 0
                    );


                if (action === "ADD") {

                    newBalance =
                        oldBalance + amount;

                } else {

                    newBalance =
                        oldBalance - amount;


                    if (newBalance < 0) {

                        throw new Error(
                            "Balance cannot be negative."
                        );

                    }

                }


                newBalance =
                    Number(
                        newBalance.toFixed(2)
                    );


                /* UPDATE BALANCE */

                transaction.update(
                    userRef,
                    {
                        balance: newBalance
                    }
                );


                /* BALANCE HISTORY */

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
                            userData.userId || "",

                        username:
                            userData.username ||
                            userData.name ||
                            "User",

                        email:
                            userData.email || "",

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

                        status:
                            "COMPLETED",

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


        currentUser.balance =
            newBalance;


        updateBalanceDisplay(
            newBalance
        );


        amountInput.value = "";


        showMessage(
            action === "ADD"
                ? "Balance added successfully."
                : "Balance removed successfully."
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
   ADD PROFIT
========================================== */

if (profitButton) {

    profitButton.addEventListener(
        "click",
        async function () {

            await setPendingTradeResult(
                "PROFIT"
            );

        }
    );

}


/* ==========================================
   ADD LOSS
========================================== */

if (lossButton) {

    lossButton.addEventListener(
        "click",
        async function () {

            await setPendingTradeResult(
                "LOSS"
            );

        }
    );

}


/* ==========================================
   PENDING TRADE RESULT
========================================== */

async function setPendingTradeResult(
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

        await runTransaction(
            db,
            async function (transaction) {

                const userSnapshot =
                    await transaction.get(
                        userRef
                    );


                if (!userSnapshot.exists()) {

                    throw new Error(
                        "User document no longer exists."
                    );

                }


                const pendingResult = {

                    type:
                        type,

                    amount:
                        Number(
                            amount.toFixed(2)
                        ),

                    profitLoss:
                        Number(
                            (
                                type === "PROFIT"
                                    ? amount
                                    : -amount
                            ).toFixed(2)
                        ),

                    source:
                        "ADMIN",

                    status:
                        "PENDING",

                    createdAt:
                        new Date().toISOString()

                };


                /* IMPORTANT:
                   BALANCE IS NOT CHANGED HERE.
                */

                transaction.update(
                    userRef,
                    {
                        pendingAdminTradeResult:
                            pendingResult
                    }
                );

            }
        );


        amountInput.value = "";


        showMessage(

            type === "PROFIT"

                ? "Profit saved as PENDING. It will be applied when the trade closes."

                : "Loss saved as PENDING. It will be applied when the trade closes."

        );


    } catch (error) {

        console.error(
            "Pending trade result failed:",
            error
        );


        alert(
            "Unable to save pending trade result.\n\n" +
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
            4000
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
    "CptMarkets New Admin User Management loaded."
);
