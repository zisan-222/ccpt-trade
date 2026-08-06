// ===============================
// CPTMARKETS - MINE PAGE
// mine.js
// ===============================
// Load User Data
const currentUser = JSON.parse(localStorage.getItem("user"));

window.addEventListener("DOMContentLoaded", () => {

    if (currentUser) {

        const name = document.querySelector(".profile-info h3");
        const uid = document.querySelector(".profile-info p");
        const avatar = document.querySelector(".avatar");

        if (name) {
            name.innerText = currentUser.username;
        }

        if (uid) {
            uid.innerText = "UID: " + currentUser.userId;
        }

        if (avatar) {
            avatar.innerText = currentUser.username.charAt(0).toUpperCase();
        }

    }

});
// Open Tawk.to Live Chat
function openSupportChat() {
    if (typeof Tawk_API !== "undefined") {
        Tawk_API.maximize();
    }
}

// Support
const supportBtn = document.querySelector(".support-btn");

if (supportBtn) {
    supportBtn.addEventListener("click", openSupportChat);
}

// Loan
const loanBtn = document.querySelector(".loan-btn");

if (loanBtn) {
    loanBtn.addEventListener("click", openSupportChat);
}

// Menu Click Animation
const menuRows = document.querySelectorAll(".menu-row");

menuRows.forEach(row => {

    row.addEventListener("click", function () {

        this.style.transform = "scale(0.98)";

        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 120);

    });

});

// Sign Out
const signOutBtn = document.querySelector(".signout-btn");

if (signOutBtn) {

    signOutBtn.addEventListener("click", function () {

        if (confirm("Are you sure you want to Sign Out?")) {

            window.location.href = "index.html";

        }

    });

}

// Welcome
window.addEventListener("load", () => {
    console.log("Welcome to CptMarkets Mine Page");
});
