// Password Show / Hide
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
    }

});


// Login Form
const form = document.querySelector("form");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const username = document.querySelector("input[type='text']").value.trim();
    const pass = password.value.trim();

    if (username === "") {
        alert("Please enter your Username");
        return;
    }

    if (pass === "") {
        alert("Please enter your Password");
        return;
    }

    const btn = document.querySelector(".login-btn");

    btn.innerHTML = "Signing In...";
    btn.disabled = true;

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 1200);

});
