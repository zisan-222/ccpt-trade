// Password Show / Hide

const eye = document.querySelector(".eye");
const password = document.querySelector('input[type="password"]');

eye.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "text";
        eye.classList.remove("fa-eye");
        eye.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        eye.classList.remove("fa-eye-slash");
        eye.classList.add("fa-eye");
    }

});

// Login Button

const loginBtn = document.querySelector(".login-btn");

loginBtn.addEventListener("click", function(e){

    e.preventDefault();

    const username = document.querySelector('input[type="text"]').value;
    const pass = password.value;

    if(username === "" || pass === ""){
        alert("Please enter Username and Password");
        return;
    }

    loginBtn.innerHTML = "Signing In...";

    setTimeout(function(){

        loginBtn.innerHTML = "Go to Sign In";

        // এখানে পরে Dashboard এ পাঠানো হবে
        alert("Login Successful");

    },1500);

});
