
import { auth } from "../firebase.js";

import {
signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const form =
document.getElementById("adminLoginForm");

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const email =
document.getElementById("adminEmail").value;

const password =
document.getElementById("adminPassword").value;

const msg =
document.getElementById("loginMessage");

msg.innerHTML="Logging in...";

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

window.location.href="dashboard.html";

}catch(error){

msg.style.color="red";

msg.innerHTML=error.message;

}

});
