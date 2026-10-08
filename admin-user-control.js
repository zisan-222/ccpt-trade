// ==========================================
// CPTMARKETS USER ACCOUNT CONTROL
// ==========================================

import { auth, db } from "./firebase/firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// ELEMENTS
// ==========================================

const usersList =
    document.getElementById("usersList");

const totalUsers =
    document.getElementById("totalUsers");

const loading =
    document.getElementById("loading");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const showAllBtn =
    document.getElementById("showAllBtn");

const refreshBtn =
    document.getElementById("refreshBtn");

const backBtn =
    document.getElementById("backBtn");

const logoutBtn =
    document.getElementById("adminLogout");

const modal =
    document.getElementById("controlModal");

const closeModal =
    document.getElementById("closeModal");

const confirmCloseBtn =
    document.getElementById("confirmCloseBtn");

const durationSelect =
    document.getElementById("durationSelect");

const selectedUserUid =
    document.getElementById("selectedUserUid");

const modalUsername =
    document.getElementById("modalUsername");

const message =
    document.getElementById("message");


// ==========================================
// DATA
// ==========================================

let allUsers = [];


// ==========================================
// ADMIN LOGIN CHECK
// ==========================================

onAuthStateChanged(auth, function(user) {

    if (!user) {

        window.location.href =
            "admin.html";

        return;
    }

    loadUsers();

});


// ==========================================
// LOAD ALL USERS
// ==========================================

async function loadUsers() {

    loading.style.display = "block";
    usersList.innerHTML = "";
    emptyState.style.display = "none";

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "users"
                )
            );

        allUsers = [];

        snapshot.forEach(function(docSnap) {

            allUsers.push({

                uid:
                    docSnap.id,

                ...docSnap.data()

            });

        });

        totalUsers.textContent =
            allUsers.length;

        renderUsers(allUsers);

    } catch (error) {

        console.error(
            "Unable to load users:",
            error
        );

        showMessage(
            "Unable to load users: " +
            error.message
        );

        emptyState.style.display =
            "block";

    }

    loading.style.display =
        "none";
}


// ==========================================
// RENDER USERS
// ==========================================

function renderUsers(users) {

    usersList.innerHTML = "";

    if (!users.length) {

        emptyState.style.display =
            "block";

        return;
    }

    emptyState.style.display =
        "none";


    users.forEach(function(user) {

        const card =
            document.createElement("div");

        card.className =
            "user-card";


        const statusInfo =
            getAccountStatus(user);


        card.innerHTML = `

            <div class="user-top">

                <div>

                    <div class="user-name">
                        ${escapeHTML(
                            user.username ||
                            user.name ||
                            "Unknown User"
                        )}
                    </div>

                    <div class="user-email">
                        ${escapeHTML(
                            user.email ||
                            "No email"
                        )}
                    </div>

                </div>

                <span class="status ${statusInfo.className}">
                    ${statusInfo.label}
                </span>

            </div>


            <div class="user-details">

                <div class="detail-box">

                    <span>UID</span>

                    <strong>
                        ${escapeHTML(user.uid)}
                    </strong>

                </div>


                <div class="detail-box">

                    <span>User ID</span>

                    <strong>
                        ${escapeHTML(
                            user.userId ||
                            "Not available"
                        )}
                    </strong>

                </div>


                <div class="detail-box">

                    <span>Status</span>

                    <strong>
                        ${statusInfo.detail}
                    </strong>

                </div>


                <div class="detail-box">

                    <span>Balance</span>

                    <strong>
                        $${Number(
                            user.balance || 0
                        ).toFixed(2)}
                    </strong>

                </div>

            </div>


            <div class="user-actions">

                ${
                    statusInfo.disabled
                    ?

                    `
                    <button
                        class="enable-btn"
                        data-enable="${user.uid}"
                    >
                        ✓ Enable Account
                    </button>
                    `

                    :

                    `
                    <button
                        class="close-btn"
                        data-close="${user.uid}"
                        data-name="${
                            escapeAttribute(
                                user.username ||
                                user.name ||
                                "User"
                            )
                        }"
                    >
                        🔒 Close Account
                    </button>
                    `
                }

            </div>

        `;


        usersList.appendChild(card);

    });


    attachUserButtons();

}


// ==========================================
// ACCOUNT STATUS
// ==========================================

function getAccountStatus(user) {

    const status =
        String(
            user.accountStatus ||
            "ACTIVE"
        ).toUpperCase();


    if (status !== "DISABLED") {

        return {

            disabled: false,

            className: "active",

            label: "ACTIVE",

            detail: "Account is active"

        };

    }


    if (
        user.disabledUntil &&
        user.disabledUntil.toMillis
    ) {

        const until =
            user.disabledUntil.toMillis();

        if (until <= Date.now()) {

            return {

                disabled: false,

                className: "active",

                label: "ACTIVE",

                detail: "Previous restriction expired"

            };

        }

        return {

            disabled: true,

            className: "closed",

            label: "CLOSED",

            detail:
                "Until " +
                new Date(
                    until
                ).toLocaleString()

        };

    }


    if (
        user.disabledUntil instanceof Date
    ) {

        if (
            user.disabledUntil.getTime() <=
            Date.now()
        ) {

            return {

                disabled: false,

                className: "active",

                label: "ACTIVE",

                detail: "Restriction expired"

            };

        }

    }


    return {

        disabled: true,

        className: "closed",

        label: "CLOSED",

        detail: "Permanently closed"

    };

}


// ==========================================
// BUTTON EVENTS
// ==========================================

function attachUserButtons() {

    document
        .querySelectorAll("[data-close]")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    openCloseModal(
                        button.dataset.close,
                        button.dataset.name
                    );

                }
            );

        });


    document
        .querySelectorAll("[data-enable]")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                async function() {

                    await enableAccount(
                        button.dataset.enable
                    );

                }
            );

        });

}


// ==========================================
// OPEN MODAL
// ==========================================

function openCloseModal(
    uid,
    username
) {

    selectedUserUid.value =
        uid;

    modalUsername.textContent =
        username;

    durationSelect.value =
        "1h";

    modal.classList.add(
        "show"
    );

}


// ==========================================
// CLOSE MODAL
// ==========================================

function hideModal() {

    modal.classList.remove(
        "show"
    );

}

closeModal.addEventListener(
    "click",
    hideModal
);


// ==========================================
// CONFIRM CLOSE
// ==========================================

confirmCloseBtn.addEventListener(
    "click",
    async function() {

        const uid =
            selectedUserUid.value;

        const duration =
            durationSelect.value;


        if (!uid) {

            return;
        }


        confirmCloseBtn.disabled =
            true;

        confirmCloseBtn.textContent =
            "Closing...";


        try {

            const userRef =
                doc(
                    db,
                    "users",
                    uid
                );


            if (
                duration ===
                "permanent"
            ) {

                await updateDoc(
                    userRef,
                    {

                        accountStatus:
                            "DISABLED",

                        disabledUntil:
                            null,

                        accountClosedAt:
                            serverTimestamp(),

                        accountCloseType:
                            "PERMANENT"

                    }
                );

            } else {

                const milliseconds =
                    getDurationMilliseconds(
                        duration
                    );

                const disabledUntil =
                    new Date(
                        Date.now() +
                        milliseconds
                    );


                await updateDoc(
                    userRef,
                    {

                        accountStatus:
                            "DISABLED",

                        disabledUntil:
                            disabledUntil,

                        accountClosedAt:
                            serverTimestamp(),

                        accountCloseType:
                            duration

                    }
                );

            }


            hideModal();

            showMessage(
                "Account closed successfully."
            );

            await loadUsers();


        } catch (error) {

            console.error(
                "Close account failed:",
                error
            );

            showMessage(
                "Unable to close account: " +
                error.message
            );

        }


        confirmCloseBtn.disabled =
            false;

        confirmCloseBtn.textContent =
            "Close Account";

    }
);


// ==========================================
// ENABLE ACCOUNT
// ==========================================

async function enableAccount(uid) {

    try {

        await updateDoc(
            doc(
                db,
                "users",
                uid
            ),
            {

                accountStatus:
                    "ACTIVE",

                disabledUntil:
                    null,

                accountEnabledAt:
                    serverTimestamp(),

                accountCloseType:
                    null

            }
        );


        showMessage(
            "Account enabled successfully."
        );

        await loadUsers();


    } catch (error) {

        console.error(
            "Enable account failed:",
            error
        );

        showMessage(
            "Unable to enable account: " +
            error.message
        );

    }

}


// ==========================================
// DURATION
// ==========================================

function getDurationMilliseconds(
    duration
) {

    const hour =
        60 * 60 * 1000;

    const day =
        24 * hour;


    switch (duration) {

        case "1h":
            return hour;

        case "5h":
            return 5 * hour;

        case "10h":
            return 10 * hour;

        case "12h":
            return 12 * hour;

        case "24h":
            return 24 * hour;

        case "3d":
            return 3 * day;

        case "7d":
            return 7 * day;

        default:
            return hour;

    }

}


// ==========================================
// SEARCH
// ==========================================

searchBtn.addEventListener(
    "click",
    searchUsers
);


searchInput.addEventListener(
    "keydown",
    function(e) {

        if (
            e.key ===
            "Enter"
        ) {

            searchUsers();

        }

    }
);


function searchUsers() {

    const term =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!term) {

        renderUsers(
            allUsers
        );

        return;
    }


    const filtered =
        allUsers.filter(
            function(user) {

                return (

                    String(
                        user.uid ||
                        ""
                    )
                    .toLowerCase()
                    .includes(term)

                    ||

                    String(
                        user.userId ||
                        ""
                    )
                    .toLowerCase()
                    .includes(term)

                    ||

                    String(
                        user.username ||
                        user.name ||
                        ""
                    )
                    .toLowerCase()
                    .includes(term)

                    ||

                    String(
                        user.email ||
                        ""
                    )
                    .toLowerCase()
                    .includes(term)

                );

            }
        );


    renderUsers(
        filtered
    );

}


// ==========================================
// SHOW ALL
// ==========================================

showAllBtn.addEventListener(
    "click",
    function() {

        searchInput.value =
            "";

        renderUsers(
            allUsers
        );

    }
);


// ==========================================
// REFRESH
// ==========================================

refreshBtn.addEventListener(
    "click",
    loadUsers
);


// ==========================================
// BACK
// ==========================================

backBtn.addEventListener(
    "click",
    function() {

        window.location.href =
            "admin-dashboard.html";

    }
);


// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener(
    "click",
    async function() {

        try {

            await signOut(
                auth
            );

            window.location.href =
                "admin.html";

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

        }

    }
);


// ==========================================
// MESSAGE
// ==========================================

function showMessage(text) {

    message.textContent =
        text;

    message.style.display =
        "block";


    clearTimeout(
        showMessage.timer
    );


    showMessage.timer =
        setTimeout(
            function() {

                message.style.display =
                    "none";

            },
            3500
        );

}


// ==========================================
// SECURITY HELPERS
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return escapeHTML(
        value
    );

}


// ==========================================
// END
// ==========================================

console.log(
    "CptMarkets Account Control loaded."
);
