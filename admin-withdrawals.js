
/* ==========================================
   CPTMARKETS ADMIN WITHDRAWAL MANAGEMENT
   admin-withdrawals.js
========================================== */

import { auth, db } from "./firebase/firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    query,
    orderBy,
    doc,
    runTransaction,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* ==========================================
   ADMIN CONFIGURATION
========================================== */

const ADMIN_EMAIL = "mdzisanzisan000@gmail.com";

const list = document.getElementById("requestList");
const message = document.getElementById("pageMessage");

let allRequests = [];
let currentFilter = "Pending";
let pageReady = false;
let unsubscribeRequests = null;
let actionInProgress = false;


/* ==========================================
   SAFE TEXT
========================================== */

function safe(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ==========================================
   MONEY FORMAT
========================================== */

function money(value) {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "$0.00";
    }

    return "$" + amount.toFixed(2);
}


/* ==========================================
   DATE FORMAT
========================================== */

function dateText(value) {
    if (!value) return "Not available";

    const date = value.toDate
        ? value.toDate()
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString();
}


/* ==========================================
   PAYMENT DETAILS
========================================== */

function paymentValue(details, keys) {
    if (!details || typeof details !== "object") {
        return "";
    }

    for (const key of keys) {
        if (details[key] !== undefined &&
            details[key] !== null &&
            String(details[key]).trim() !== "") {
            return details[key];
        }
    }

    return "";
}


function getPaymentDetails(data) {
    const details = data.paymentDetails || {};

    if (typeof details === "string") {
        return {
            account: details,
            holder: "",
            bank: ""
        };
    }

    return {
        account: paymentValue(details, [
            "accountNumber",
            "walletNumber",
            "mobileWalletNumber",
            "phoneNumber",
            "cryptoAddress",
            "address",
            "number"
        ]),

        holder: paymentValue(details, [
            "accountHolder",
            "holderName",
            "bankHolderName",
            "name"
        ]),

        bank: paymentValue(details, [
            "bankName",
            "walletProvider",
            "provider",
            "bankCode"
        ])
    };
}


/* ==========================================
   COUNTERS
========================================== */

function updateCounters() {
    document.getElementById("pendingCount").textContent =
        allRequests.filter(x => x.status === "Pending").length;

    document.getElementById("approvedCount").textContent =
        allRequests.filter(x => x.status === "Successful").length;

    document.getElementById("rejectedCount").textContent =
        allRequests.filter(x => x.status === "Rejected").length;
}


/* ==========================================
   RENDER REQUESTS
========================================== */

function renderRequests() {

    const filtered = currentFilter === "All"
        ? allRequests
        : allRequests.filter(
            item => item.status === currentFilter
        );

    if (!filtered.length) {
        list.innerHTML =
            '<div class="panel empty">No withdrawal requests found.</div>';
        return;
    }

    list.innerHTML = filtered.map(data => {

        const payment = getPaymentDetails(data);

        const statusClass =
            data.status === "Successful" ? "successful" :
            data.status === "Rejected" ? "rejected" :
            "pending";

        const id = safe(data.id);

        const customerUID = data.uid || data.userId || "";

        const actionButtons = data.status === "Pending"
            ? `
                <div class="actions">
                    <button
                        class="approve"
                        data-action="approve"
                        data-id="${id}">
                        Approve
                    </button>

                    <button
                        class="reject"
                        data-action="reject"
                        data-id="${id}">
                        Reject
                    </button>
                </div>

                <p class="subtitle">
                    Before approving, manually deduct the withdrawal
                    amount from the customer's balance.
                </p>
            `
            : `
                <p class="subtitle">
                    ${
                        data.status === "Rejected"
                            ? "Rejection reason: " +
                              safe(data.rejectionReason || "Not provided")
                            : "This request has been approved."
                    }
                </p>
            `;

        return `
        <article class="request">

            <div class="request-top">

                <div>
                    <div class="amount">
                        ${money(data.amount)}
                    </div>

                    <div class="subtitle">
                        Request ID: ${id}
                    </div>
                </div>

                <span class="status ${statusClass}">
                    ${safe(data.status || "Pending")}
                </span>

            </div>


            <div class="details">

                <div class="detail">
                    <small>Customer Name</small>
                    <strong>
                        ${safe(data.username || data.name || "Not provided")}
                    </strong>
                </div>


                <div class="detail">
                    <small>Customer UID</small>

                    <div class="copy-row">
                        <strong>${safe(customerUID || "Not provided")}</strong>

                        ${
                            customerUID
                                ? `<button class="copy-btn"
                                    data-copy="${safe(customerUID)}">
                                    Copy
                                   </button>`
                                : ""
                        }
                    </div>
                </div>


                <div class="detail">
                    <small>Email</small>
                    <strong>${safe(data.email || "Not provided")}</strong>
                </div>


                <div class="detail">
                    <small>Country</small>
                    <strong>${safe(data.country || "Not provided")}</strong>
                </div>


                <div class="detail">
                    <small>Payment Method</small>
                    <strong>
                        ${safe(data.paymentMethodLabel ||
                            data.paymentMethod || "Not provided")}
                    </strong>
                </div>


                <div class="detail">
                    <small>Wallet Provider / Bank</small>
                    <strong>
                        ${safe(payment.bank || "Not provided")}
                    </strong>
                </div>


                <div class="detail">
                    <small>Account / Wallet Number</small>

                    <div class="copy-row">
                        <strong>
                            ${safe(payment.account || "Not provided")}
                        </strong>

                        ${
                            payment.account
                                ? `<button class="copy-btn"
                                    data-copy="${safe(payment.account)}">
                                    Copy
                                   </button>`
                                : ""
                        }
                    </div>
                </div>


                <div class="detail">
                    <small>Account Holder</small>
                    <strong>
                        ${safe(payment.holder || "Not provided")}
                    </strong>
                </div>


                <div class="detail">
                    <small>Request Date</small>
                    <strong>${safe(dateText(data.createdAt))}</strong>
                </div>

            </div>

            ${actionButtons}

        </article>`;

    }).join("");
}


/* ==========================================
   REAL-TIME REQUEST LOADING
========================================== */

function loadRequests() {

    if (unsubscribeRequests) {
        unsubscribeRequests();
        unsubscribeRequests = null;
    }

    list.textContent = "Loading withdrawal requests...";
    message.textContent = "";

    const requestsQuery = query(
        collection(db, "withdrawalRequests"),
        orderBy("createdAt", "desc")
    );

    unsubscribeRequests = onSnapshot(
        requestsQuery,

        snapshot => {

            allRequests = snapshot.docs.map(item => ({
                id: item.id,
                ...item.data()
            }));

            updateCounters();
            renderRequests();

            message.textContent = "";
        },

        error => {

            console.error("Withdrawal loading error:", error);

            list.textContent =
                "Could not load withdrawal requests.";

            message.textContent =
                "Firebase error: " + error.message;
        }
    );
}


/* ==========================================
   APPROVE REQUEST
========================================== */

async function approveRequest(id) {

    if (actionInProgress) return;

    const item = allRequests.find(x => x.id === id);

    if (!item || item.status !== "Pending") {
        alert("This request is no longer pending.");
        return;
    }

    const amount = Number(item.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Invalid withdrawal amount.");
        return;
    }

    const confirmed = window.confirm(
        "Have you manually deducted " + money(amount) +
        " from this customer's balance?\n\n" +
        "Only continue after completing the deduction."
    );

    if (!confirmed) return;

    actionInProgress = true;

    try {

        const requestRef = doc(
            db,
            "withdrawalRequests",
            id
        );

        await runTransaction(db, async transaction => {

            const requestSnapshot =
                await transaction.get(requestRef);

            if (!requestSnapshot.exists()) {
                throw new Error("Withdrawal request not found.");
            }

            const currentData = requestSnapshot.data();

            if (currentData.status !== "Pending") {
                throw new Error(
                    "This request has already been processed."
                );
            }

            transaction.update(requestRef, {
                status: "Successful",
                approvedAt: serverTimestamp(),
                approvedBy: auth.currentUser.email
            });

        });

        alert("Withdrawal request approved.");

    } catch (error) {

        console.error("Approval error:", error);

        alert(
            "Could not approve request:\n" +
            error.message
        );

    } finally {

        actionInProgress = false;
    }
}


/* ==========================================
   REJECT REQUEST
========================================== */

async function rejectRequest(id) {

    if (actionInProgress) return;

    const item = allRequests.find(x => x.id === id);

    if (!item || item.status !== "Pending") {
        alert("This request is no longer pending.");
        return;
    }

    const reason = window.prompt(
        "Enter the reason for rejecting this withdrawal:"
    );

    if (reason === null) return;

    if (!reason.trim()) {
        alert("Please enter a rejection reason.");
        return;
    }

    actionInProgress = true;

    try {

        const requestRef = doc(
            db,
            "withdrawalRequests",
            id
        );

        await runTransaction(db, async transaction => {

            const requestSnapshot =
                await transaction.get(requestRef);

            if (!requestSnapshot.exists()) {
                throw new Error("Withdrawal request not found.");
            }

            const currentData = requestSnapshot.data();

            if (currentData.status !== "Pending") {
                throw new Error(
                    "This request has already been processed."
                );
            }

            transaction.update(requestRef, {
                status: "Rejected",
                rejectionReason: reason.trim(),
                rejectedAt: serverTimestamp(),
                rejectedBy: auth.currentUser.email
            });

        });

        alert("Withdrawal request rejected.");

    } catch (error) {

        console.error("Rejection error:", error);

        alert(
            "Could not reject request:\n" +
            error.message
        );

    } finally {

        actionInProgress = false;
    }
}


/* ==========================================
   FILTER TABS
========================================== */

document.querySelectorAll(".tab").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".tab").forEach(tab => {
            tab.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderRequests();
    });

});


/* ==========================================
   COPY BUTTON & ACTION BUTTONS
========================================== */

list.addEventListener("click", async event => {

    const copyButton = event.target.closest("[data-copy]");

    if (copyButton) {

        const value = copyButton.dataset.copy || "";

        if (!value) return;

        try {

            await navigator.clipboard.writeText(value);

            copyButton.textContent = "Copied";

            window.setTimeout(() => {
                copyButton.textContent = "Copy";
            }, 1200);

        } catch (error) {

            console.error("Copy error:", error);

            alert("Copy failed. Please copy manually.");
        }

        return;
    }


    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) return;

    const id = actionButton.dataset.id;

    if (actionButton.dataset.action === "approve") {
        await approveRequest(id);
    }

    if (actionButton.dataset.action === "reject") {
        await rejectRequest(id);
    }

});


/* ==========================================
   ADMIN AUTHENTICATION
========================================== */

onAuthStateChanged(auth, async user => {

    const authorized =
        user &&
        user.emailVerified !== false &&
        (user.email || "").toLowerCase() ===
        ADMIN_EMAIL.toLowerCase();

    if (!authorized) {

        if (unsubscribeRequests) {
            unsubscribeRequests();
            unsubscribeRequests = null;
        }

        if (user) {
            try {
                await signOut(auth);
            } catch (error) {
                console.error("Sign out error:", error);
            }
        }

        window.location.replace("admin.html");
        return;
    }

    if (!pageReady) {

        pageReady = true;

        loadRequests();
    }

});


/* ==========================================
   CLEANUP
========================================== */

window.addEventListener("pagehide", () => {

    if (unsubscribeRequests) {
        unsubscribeRequests();
        unsubscribeRequests = null;
    }

});


console.log("CPTMarkets Withdrawal Admin Loaded.");
