/* ==========================================
   CPTMARKETS
   ADMIN USER MANAGEMENT
   ========================================== */

import { auth, db } from "./firebase/firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* ==========================================
   VARIABLES
   ========================================== */

let currentUser = null;
let currentUserDoc = null;


/* ==========================================
   ADMIN AUTH CHECK
   ========================================== */

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    console.log(
        "Admin authenticated:",
        user.email
    );

});


/* ==========================================
   SEARCH BUTTON
   ========================================== */

const searchButton =
    document.getElementById("searchUserBtn");


if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchUser
    );

}


/* ==========================================
   SEARCH USER
   ========================================== */

async function searchUser() {

    const uidInput =
        document.getElementById("userUidInput");

    if (!uidInput) {

        console.error(
            "userUidInput not found."
        );

        return;
    }


    const uid =
        uidInput.value.trim();


    if (!uid) {

        alert(
            "Please enter a User UID."
        );

        return;
    }


    try {

        console.log(
            "Searching User ID:",
            uid
        );


        const usersRef =
            collection(
                db,
                "users"
            );


        /*
         * IMPORTANT:
         *
         * The 8 digit UID shown
         * on Mine page is saved
         * in Firestore as:
         *
         * userId
         *
         * NOT:
         *
         * uid
         */

        const userQuery =
            query(
                usersRef,
                where(
                    "userId",
                    "==",
                    uid
                )
            );


        const snapshot =
            await getDocs(
                userQuery
            );


        /* ==================================
           USER NOT FOUND
           ================================== */

        if (snapshot.empty) {

            console.log(
                "User not found:",
                uid
            );

            showNotFound();

            return;
        }


        /* ==================================
           USER FOUND
           ================================== */

        const userDoc =
            snapshot.docs[0];


        currentUserDoc =
            userDoc;


        currentUser =
            userDoc.data();


        console.log(
            "User found:",
            currentUser
        );


        showUser(
            userDoc.id,
            currentUser
        );


    } catch (error) {

        console.error(
            "User search failed:",
            error
        );


        alert(
            "Unable to search user."
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
            userData.userId ||
            "-";

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
        Number(balance)
        .toFixed(2);

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
   ADD BALANCE BUTTON
   ========================================== */

const addButton =
    document.getElementById(
        "addBalanceBtn"
    );


if (addButton) {

    addButton.addEventListener(
        "click",
        async function () {

            await changeBalance(
                "add"
            );

        }
    );

}


/* ==========================================
   REMOVE BALANCE BUTTON
   ========================================== */

const removeButton =
    document.getElementById(
        "removeBalanceBtn"
    );


if (removeButton) {

    removeButton.addEventListener(
        "click",
        async function () {

            await changeBalance(
                "remove"
            );

        }
    );

}


/* ==========================================
   CHANGE BALANCE
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
        !amount ||
        amount <= 0
    ) {

        alert(
            "Enter a valid amount."
        );

        return;
    }


    const oldBalance =
        Number(
            currentUser.balance || 0
        );


    let newBalance;


    /* ==================================
       ADD
       ================================== */

    if (action === "add") {

        newBalance =
            oldBalance +
            amount;

    }


    /* ==================================
       REMOVE
       ================================== */

    else {

        newBalance =
            oldBalance -
            amount;


        if (newBalance < 0) {

            alert(
                "Balance cannot be negative."
            );

            return;
        }

    }


    try {

        /* ==================================
           UPDATE FIRESTORE
           ================================== */

        await updateDoc(

            doc(
                db,
                "users",
                currentUserDoc.id
            ),

            {
                balance:
                    newBalance
            }

        );


        /* ==================================
           UPDATE LOCAL USER
           ================================== */

        currentUser.balance =
            newBalance;


        /* ==================================
           UPDATE SCREEN
           ================================== */

        updateBalanceDisplay(
            newBalance
        );


        amountInput.value =
            "";


        showMessage(

            action === "add"

                ? "Balance added successfully."

                : "Balance removed successfully."

        );


        console.log(
            "Balance updated:",
            newBalance
        );


    } catch (error) {

        console.error(
            "Balance update failed:",
            error
        );


        alert(
            "Balance update failed: " +
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

const logoutButton =
    document.getElementById(
        "adminLogout"
    );


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

            }

        }
    );

}


console.log(
    "CptMarkets Admin User Management loaded."
);
