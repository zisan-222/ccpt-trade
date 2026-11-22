
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
    where,
    doc,
    runTransaction,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* ADMIN CONFIGURATION */
const ADMIN_EMAIL = "mdzisanzisan000@gmail.com";

const list = document.getElementById("requestList");
const message = document.getElementById("pageMessage");

let allRequests = [];
let currentFilter = "Pending";
let pageReady = false;
let unsubscribeRequests = null;
let actionInProgress = false;

/* SAFE TEXT */
function safe(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* MONEY */
function money(value) {
    const amount = Number(value);
    return Number.isFinite(amount) ? "$" + amount.toFixed(2) : "$0.00";
}

/* DATE */
function dateText(value) {
    if (!value) return "Not available";

    const date = value.toDate ? value.toDate() : new Date(value);

    return Number.isNaN(date.getTime())
        ? "Not available"
        : date.toLocaleString();
}

/* PAYMENT DETAILS */
function paymentValue(details, keys) {
    if (!details || typeof details !== "object") return "";

    for (const key of keys) {
        const value = details[key];

        if (value !== undefined && value !== null && String(value).trim()) {
            return value;
        }
    }

    return "";
}

function getPaymentDetails(data) {
    const details = data.paymentDetails || {};

    if (typeof details === "string") {
        return { account: details, holder: "", bank: "" };
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

/* NOTIFICATION MESSAGE */
function showMessage(text, isError = false) {
    if (!message) return;

    message.textContent = text;
    message.style.color = isError ? "#dc2626" : "#16a34a";
}

/* COUNTERS */
function updateCounters() {
    const pending = document.getElementById("pendingCount");
    const approved = document.getElementById("approvedCount");
    const rejected = document.getElementById("rejectedCount");

    if (pending) {
        pending.textContent =
            allRequests.filter(x => x.status === "Pending").length;
    }

    if (approved) {
        approved.textContent =
            allRequests.filter(x => x.status === "Successful").length;
    }

    if (rejected) {
        rejected.textContent =
            allRequests.filter(x => x.status === "Rejected").length;
    }
}

/* COPY BUTTON HTML */
function copyButton(value) {
    if (!value) return "";

    return `
        <button type="button"
            class="copy-btn"
            data-copy="${safe(value)}">
            Copy
        </button>
    `;
}

/* RENDER REQUESTS */
function renderRequests() {
    if (!list) return;

    const filtered = currentFilter === "All"
        ? allRequests
        : allRequests.filter(item => item.status === currentFilter);

    if (!filtered.length) {
        list.innerHTML =
            '<div class="panel empty">No withdrawal requests found.</div>';
        return;
    }

    list.innerHTML = filtered.map(data => {
        const payment = getPaymentDetails(data);
        const status = data.status || "Pending";

        const statusClass =
            status === "Successful" ? "successful" :
            status === "Rejected" ? "rejected" :
            "pending";

        const id = safe(data.id);
        const uid = data.uid || data.userId || "";

        const actions = status === "Pending"
            ? `
                <div class="actions">
                    <button type="button"
                        class="approve"
                        data-action="approve"
                        data-id="${id}">
                        Approve
                    </button>

                    <button type="button"
                        class="reject"
                        data-action="reject"
                        data-id="${id}">
                        Reject
                    </button>
                </div>
            `
            : `
                <p class="subtitle">
                    ${
                        status === "Rejected"
                            ? "Rejection reason: " +
                              safe(data.rejectionReason || "Not provided")
                            : "Withdrawal completed successfully."
                    }
                </p>
            `;

        return `
        <article class="request">

            <div class="request-top">
                <div>
                    <div class="amount">${money(data.amount)}</div>
                    <div class="subtitle">Request ID: ${id}</div>
                </div>

                <span class="status ${statusClass}">
                    ${safe(status)}
                </span>
            </div>

            <div class="details">

                <div class="detail">
                    <small>Customer Name</small>
                    <strong>${safe(data.username || data.name || "Not provided")}</strong>
                </div>

                <div class="detail">
                    <small>Customer UID</small>
                    <div class="copy-row">
                        <strong>${safe(uid || "Not provided")}</strong>
                        ${copyButton(uid)}
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
                    <strong>${safe(data.paymentMethodLabel || data.paymentMethod || "Not provided")}</strong>
                </div>

                <div class="detail">
                    <small>Wallet Provider / Bank</small>
                    <strong>${safe(payment.bank || "Not provided")}</strong>
                </div>

                <div class="detail">
                    <small>Account / Wallet Number</small>
                    <div class="copy-row">
                        <strong>${safe(payment.account || "Not provided")}</strong>
                        ${copyButton(payment.account)}
                    </div>
                </div>

                <div class="detail">
                    <small>Account Holder</small>
                    <strong>${safe(payment.holder || "Not provided")}</strong>
                </div>

                <div class="detail">
                    <small>Request Date</small>
                    <strong>${safe(dateText(data.createdAt))}</strong>
                </div>

            </div>

            ${actions}

        </article>`;
    }).join("");
}

/* REAL-TIME REQUEST LOADING */
function loadRequests() {
    if (!list || !message) {
        console.error("Withdrawal page elements are missing.");
        return;
    }

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
            list.textContent = "Could not load withdrawal requests.";
            showMessage("Firebase error: " + error.message, true);
        }
    );
}

/*
  BALANCE MODEL:
  users/{uid}.balance
  users/{uid}.reservedWithdrawal

  Approve:
  balance -= amount
  reservedWithdrawal -= amount

  Reject:
  balance unchanged
  reservedWithdrawal -= amount

  If reservedWithdrawal is not present (legacy request),
  calculate pending total from withdrawalRequests.
*/
async function getReservedAmount(transaction, userRef, userData, userId) {
    const saved = Number(userData.reservedWithdrawal);

    if (
        userData.reservedWithdrawal !== undefined &&
        Number.isFinite(saved)
    ) {
        return Math.max(0, saved);
    }

    const pendingQuery = query(
        collection(db, "withdrawalRequests"),
        where("userId", "==", userId)
    );

    const pendingSnapshot = await transaction.get(pendingQuery);

    let total = 0;

    pendingSnapshot.forEach(requestDoc => {
        const request = requestDoc.data();

        if (request.status === "Pending") {
            const amount = Number(request.amount);

            if (Number.isFinite(amount) && amount > 0) {
                total += amount;
            }
        }
    });

    return total;
}

/* APPROVE REQUEST */
async function approveRequest(id) {
    if (actionInProgress) return;

    const item = allRequests.find(x => x.id === id);

    if (!item || item.status !== "Pending") {
        alert("This request is no longer pending.");
        return;
    }

    const amount = Number(item.amount);
    const userId = item.userId || item.uid;

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Invalid withdrawal amount.");
        return;
    }

    if (!userId) {
        alert("Customer UID is missing. Cannot update balance.");
        return;
    }

    if (!confirm(
        "Approve this withdrawal of " + money(amount) +
        "?\n\nThe amount will be deducted from the customer's balance."
    )) return;

    actionInProgress = true;
    showMessage("Processing approval...");

    try {
        const adminEmail = auth.currentUser?.email || ADMIN_EMAIL;

        const requestRef = doc(db, "withdrawalRequests", id);
        const userRef = doc(db, "users", userId);

        await runTransaction(db, async transaction => {
            const requestSnapshot = await transaction.get(requestRef);

            if (!requestSnapshot.exists()) {
                throw new Error("Withdrawal request not found.");
            }

            const currentData = requestSnapshot.data();

            if (currentData.status !== "Pending") {
                throw new Error("This request has already been processed.");
            }

            const currentUserId = currentData.userId || currentData.uid;

            if (!currentUserId || currentUserId !== userId) {
                throw new Error("Customer UID does not match the request.");
            }

            const userSnapshot = await transaction.get(userRef);

            if (!userSnapshot.exists()) {
                throw new Error("Customer profile not found.");
            }

            const userData = userSnapshot.data();
            const balance = Number(userData.balance);

            if (!Number.isFinite(balance) || balance < amount) {
                throw new Error(
                    "Customer balance is insufficient for this withdrawal."
                );
            }

            const reserved = await getReservedAmount(
                transaction,
                userRef,
                userData,
                userId
            );

            const nextReserved = Math.max(0, reserved - amount);

            transaction.update(userRef, {
                balance: Number((balance - amount).toFixed(2)),
                reservedWithdrawal: Number(nextReserved.toFixed(2)),
                updatedAt: serverTimestamp()
            });

            transaction.update(requestRef, {
                status: "Successful",
                approvedAt: serverTimestamp(),
                approvedBy: adminEmail
            });
        });

        showMessage("Withdrawal approved successfully.");
        alert("Withdrawal approved. Customer balance has been updated.");

    } catch (error) {
        console.error("Approval error:", error);
        showMessage(error.message || "Could not approve withdrawal.", true);
        alert("Could not approve request:\n" + error.message);

    } finally {
        actionInProgress = false;
    }
}

/* REJECT REQUEST */
async function rejectRequest(id) {
    if (actionInProgress) return;

    const item = allRequests.find(x => x.id === id);

    if (!item || item.status !== "Pending") {
        alert("This request is no longer pending.");
        return;
    }

    const amount = Number(item.amount);
    const userId = item.userId || item.uid;

    if (!Number.isFinite(amount) || amount <= 0 || !userId) {
        alert("Invalid withdrawal request or missing customer UID.");
        return;
    }

    const reason = prompt("Enter the reason for rejecting this withdrawal:");

    if (reason === null) return;

    if (!reason.trim()) {
        alert("Please enter a rejection reason.");
        return;
    }

    actionInProgress = true;
    showMessage("Processing rejection...");

    try {
        const adminEmail = auth.currentUser?.email || ADMIN_EMAIL;

        const requestRef = doc(db, "withdrawalRequests", id);
        const userRef = doc(db, "users", userId);

        await runTransaction(db, async transaction => {
            const requestSnapshot = await transaction.get(requestRef);

            if (!requestSnapshot.exists()) {
                throw new Error("Withdrawal request not found.");
            }

            const currentData = requestSnapshot.data();

            if (currentData.status !== "Pending") {
                throw new Error("This request has already been processed.");
            }

            const userSnapshot = await transaction.get(userRef);

            if (!userSnapshot.exists()) {
                throw new Error("Customer profile not found.");
            }

            const userData = userSnapshot.data();

            const reserved = await getReservedAmount(
                transaction,
                userRef,
                userData,
                userId
            );

            const nextReserved = Math.max(0, reserved - amount);

            transaction.update(userRef, {
                reservedWithdrawal: Number(nextReserved.toFixed(2)),
                updatedAt: serverTimestamp()
            });

            transaction.update(requestRef, {
                status: "Rejected",
                rejectionReason: reason.trim(),
                rejectedAt: serverTimestamp(),
                rejectedBy: adminEmail
            });
        });

        showMessage("Withdrawal rejected. Reserved amount released.");
        alert("Withdrawal rejected. The reserved amount has been released.");

    } catch (error) {
        console.error("Rejection error:", error);
        showMessage(error.message || "Could not reject withdrawal.", true);
        alert("Could not reject request:\n" + error.message);

    } finally {
        actionInProgress = false;
    }
}

/* FILTER TABS */
document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(tab => {
            tab.classList.remove("active");
        });

        button.classList.add("active");
        currentFilter = button.dataset.filter || "Pending";

        renderRequests();
    });
});

/* COPY + ACTION EVENTS */
if (list) {
    list.addEventListener("click", async event => {
        const copyButtonElement = event.target.closest("[data-copy]");

        if (copyButtonElement) {
            const value = copyButtonElement.dataset.copy || "";
            if (!value) return;

            try {
                await navigator.clipboard.writeText(value);

                const oldText = copyButtonElement.textContent;
                copyButtonElement.textContent = "Copied";

                setTimeout(() => {
                    copyButtonElement.textContent = oldText || "Copy";
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
        } else if (actionButton.dataset.action === "reject") {
            await rejectRequest(id);
        }
    });
}

/* ADMIN AUTHENTICATION */
onAuthStateChanged(auth, async user => {
    const currentEmail = (user?.email || "").trim().toLowerCase();

    const authorized =
        !!user &&
        currentEmail === ADMIN_EMAIL.toLowerCase();

    if (!authorized) {
        if (unsubscribeRequests) {
            unsubscribeRequests();
            unsubscribeRequests = null;
        }

        pageReady = false;

        if (!user) {
            window.location.replace("admin.html");
            return;
        }

        try {
            await signOut(auth);
        } catch (error) {
            console.error("Sign out error:", error);
        }

        window.location.replace("admin.html");
        return;
    }

    if (!pageReady) {
        pageReady = true;
        loadRequests();
    }
});

/* CLEANUP */
window.addEventListener("pagehide", () => {
    if (unsubscribeRequests) {
        unsubscribeRequests();
        unsubscribeRequests = null;
    }
});

console.log("CPTMarkets Withdrawal Admin Loaded.");
