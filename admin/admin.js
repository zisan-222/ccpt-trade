
document
.getElementById("adminLoginForm")
.addEventListener("submit", function (e) {

e.preventDefault();

const email =
document.getElementById("adminEmail").value;

const password =
document.getElementById("adminPassword").value;

const message =
document.getElementById("loginMessage");

message.innerHTML = "";

if(email === "" || password === ""){

message.innerHTML = "Please fill all fields.";

return;

}

message.style.color="#00ff99";

message.innerHTML="Checking Admin Login...";

});
