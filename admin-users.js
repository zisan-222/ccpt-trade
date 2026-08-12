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
   SEARCH USER
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
   SEARCH FUNCTION
========================================== */

async function searchUser() {

    const uidInput =
        document.getElementById("userUidInput");

    const uid =
        uidInput.value.trim();


    if (!uid) {

        alert("Please enter a User UID.");

        return;
    }


    try {

        const usersRef =
            collection(db, "users");


        const userQuery =
            query(
                usersRef,
                where("uid", "==", uid)
            );


        const snapshot =
            await getDocs(userQuery);


        if (snapshot.empty) {

            showNotFound();

            return;
        }


        const userDoc =
            snapshot.docs[0];


        currentUserDoc = userDoc;
        currentUser = userDoc.data();


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

function showUser(docId, userData) {

    const result =
        document.getElementById("userResult");

    const notFound =
        document.getElementById("notFound");


    notFound.style.display =
        "none";

    result.style.display =
        "block";


    document.getElementById(
        "userName"
    ).textContent =
        userData.username ||
        userData.name ||
        "User";


    document.getElementById(
        "userUid"
    ).textContent =
        userData.uid || "-";


    document.getElementById(
        "userEmail"
    ).textContent =
        userData.email || "-";


    updateBalanceDisplay(
        Number(userData.balance || 0)
    );

}


/* ==========================================
   BALANCE DISPLAY
========================================== */

function updateBalanceDisplay(balance) {

    document.getElementById(
        "userBalance"
    ).textContent =
        "$" + Number(balance).toFixed(2);

}


/* ==========================================
   SHOW NOT FOUND
========================================== */

function showNotFound() {

    document.getElementById(
        "userResult"
    ).style.display = "none";


    document.getElementById(
        "notFound"
    ).style.display = "block";

}


/* ==========================================
   ADD BALANCE
========================================== */

const addButton =
    document.getElementById("addBalanceBtn");


if (addButton) {

    addButton.addEventListener(
        "click",
        async () => {

            await changeBalance(
                "add"
            );

        }
    );

}


/* ==========================================
   REMOVE BALANCE
========================================== */

const removeButton =
    document.getElementById(
        "removeBalanceBtn"
    );


if (removeButton) {

    removeButton.addEventListener(
        "click",
        async () => {

            await changeBalance(
                "remove"
            );

        }
    );

}


/* ==========================================
   CHANGE BALANCE
========================================== */

async function changeBalance(action) {

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


    const amount =
        Number(amountInput.value);


    if (!amount || amount <= 0) {

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


    if (action === "add") {

        newBalance =
            oldBalance + amount;

    } else {

        newBalance =
            oldBalance - amount;


        if (newBalance < 0) {

            alert(
                "Balance cannot be negative."
            );

            return;
        }

    }


    try {

        await updateDoc(

            doc(
                db,
                "users",
                currentUserDoc.id
            ),

            {
                balance: newBalance
            }

        );


        currentUser.balance =
            newBalance;


        updateBalanceDisplay(
            newBalance
        );


        amountInput.value = "";


        showMessage(
            action === "add"
                ? "Balance added successfully."
                : "Balance removed successfully."
        );


    } catch (error) {

        console.error(
            "Balance update failed:",
            error
        );


        alert(
            "Balance update failed."
        );

    }

}


/* ==========================================
   MESSAGE
========================================== */

function showMessage(message) {

    const element =
        document.getElementById(
            "actionMessage"
        );


    element.textContent =
        message;


    setTimeout(() => {

        element.textContent = "";

    }, 3000);

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
        async () => {

            try {

                await signOut(auth);

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
