import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const inviteCode = document.getElementById("inviteCode").value.trim();

  if (!username || !password || !confirmPassword) {
    alert("সব তথ্য পূরণ করুন");
    return;
  }

  if (password !== confirmPassword) {
    alert("Password মিলছে না");
    return;
  }

  const email = username + "@cptmarkets.app";

  try {

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
      username,
      email,
      inviteCode,
      balance: 0,
      demoBalance: 10000,
      role: "user",
      createdAt: new Date()
    });

    alert("Account তৈরি হয়েছে");

    window.location.href = "index.html";

  } catch (error) {
    console.log(error);
    alert(error.message);
  }
});
