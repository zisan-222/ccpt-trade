// ==========================
// CPTMarkets Login Script
// Part 1
// ==========================

// Show / Hide Password

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    } else {

        passwordInput.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});
// ==========================
// CPTMarkets Login Script
// Part 2
// ==========================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
        alert("Please enter Username and Password.");
        return;
    }

    // এখানে পরে Backend/API যুক্ত করা হবে
    // আপাতত Home Page-এ পাঠাবে

    window.location.href = "dashboard.html";

});
