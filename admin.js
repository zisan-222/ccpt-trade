// ১. ফায়ারবেস মডিউলগুলোর সঠিক ও সম্পূর্ণ লিংক
import { initializeApp } from "https://gstatic.com";
import { getDatabase, ref, get, update, query, orderByChild, equalTo } from "https://gstatic.com";

// ২. আপনার নতুন ও সঠিক ফায়ারবেস কনফিগ
const firebaseConfig = {
  apiKey: "AIzaSyAbSup8aEQ7bgSyLeqx6RMpnjoFxYu204M",
  authDomain: "://firebaseapp.com",
  projectId: "cptmarket-5b843",
  storageBucket: "cptmarket-5b843.firebasestorage.app",
  messagingSenderId: "270504953481",
  appId: "1:270504953481:web:a108213c2161fcffa16858",
  databaseURL: "https://firebaseio.com"
};

// ফায়ারবেস ডাটাবেজ চালু করা
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// HTML এলিমেন্টসমূহ
const searchuidInput = document.getElementById('search-uid');
const searchBtn = document.getElementById('search-btn');
const userInfoCard = document.getElementById('user-info-card');
const userNameText = document.getElementById('user-name');
const userEmailText = document.getElementById('user-email');
const currentBalanceText = document.getElementById('current-balance');

const newBalanceInput = document.getElementById('new-balance');
const updateBtn = document.getElementById('update-btn');
const statusMessage = document.getElementById('status-message');

let currentActiveUserKey = ""; 

// ৩. UID দিয়ে ইউজার খোঁজার ফাংশন
searchBtn.addEventListener('click', () => {
    const uidInput = searchuidInput.value.trim();
    if (!uidInput) return alert("Please type a valid User UID");

    statusMessage.innerText = "Searching database by UID...";
    
    // ডাটাবেজের 'users' নোড থেকে uid মিলিয়ে খোঁজা
    const usersRef = ref(db, 'users');
    const uidQuery = query(usersRef, orderByChild('uid'), equalTo(uidInput));

    get(uidQuery).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                currentActiveUserKey = childSnapshot.key; 
                const data = childSnapshot.val();

                userNameText.innerText = data.name || "User Account";
                userEmailText.innerText = data.email || "N/A";
                currentBalanceText.innerText = data.balance !== undefined ? data.balance : 0;
            });

            userInfoCard.style.display = 'block';
            statusMessage.innerText = "User account found!";
        } else {
            userInfoCard.style.display = 'none';
            statusMessage.innerText = "No user found with this UID! Make sure the user is registered in this new Firebase.";
        }
    }).catch((err) => {
        statusMessage.innerText = "Fetch Error: " + err.message;
        console.error(err);
    });
});

// ৪. পাসওয়ার্ড ভেরিফিকেশনসহ ব্যালেন্স আপডেট করার ফাংশন
updateBtn.addEventListener('click', () => {
    const amountInput = newBalanceInput.value.trim();
    if (amountInput === "") return alert("Please enter a new balance amount");

    // 🔒 সিকিউরিটি প্রম্পট: বাটন ক্লিক করলে পাসওয়ার্ড চাইবে
    const adminPassword = prompt("অনুগ্রহ করে আপনার অ্যাডমিন পাসওয়ার্ডটি লিখুন:");
    const CORRECT_PASSWORD = "12@#12@#"; // 👈 এখানে আপনার মনের মতো গোপন পাসওয়ার্ড দিন

    if (adminPassword !== CORRECT_PASSWORD) {
        alert("ভুল পাসওয়ার্ড! আপনি ব্যালেন্স পরিবর্তন করতে পারবেন না।");
        return;
    }

    statusMessage.innerText = "Rewriting user balance...";
    const calculatedAmount = Number(amountInput);
    const userRef = ref(db, 'users/' + currentActiveUserKey);

    update(userRef, {
        balance: calculatedAmount
    })
    .then(() => {
        currentBalanceText.innerText = calculatedAmount;
        newBalanceInput.value = "";
        statusMessage.innerText = "Success! Account balance set to $" + calculatedAmount;
    })
    .catch((err) => {
        statusMessage.innerText = "Update Failed: " + err.message;
    });
});
