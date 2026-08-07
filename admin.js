// ১. ফায়ারবেস মডিউলসমূহ সরাসরি অফিশিয়াল CDN থেকে ইমপোর্ট করা
import { initializeApp } from "https://gstatic.com";
import { getDatabase, ref, get, update } from "https://gstatic.com";

// ⚠️ আপনার স্ক্রিনশট থেকে নেওয়া অরিজিনাল ফায়ারবেস কনফিগ
const firebaseConfig = {
  apiKey: "AIzaSyAbSup8aEQ7bgSyLeqx6RMpnjoFxYu204M",
  authDomain: "://firebaseapp.com",
  projectId: "cptmarket-5b843",
  storageBucket: "cptmarket-5b843.firebasestorage.app",
  messagingSenderId: "270504953481",
  appId: "1:270504953481:web:a108213c2161fcffa16858"
};

// ফায়ারবেস স্টার্ট করা
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔑 আপনার দেওয়া নতুন সিক্রেট পাসওয়ার্ড
const SECRET_ADMIN_PASSWORD = "12@#12@#"; 

// HTML ইন্টারফেসের বাটন ও ইনপুট এলিমেন্টসমূহ
const loginContainer = document.getElementById('login-container');
const adminDashboard = document.getElementById('admin-dashboard');
const adminPasswordInput = document.getElementById('admin-password');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

const searchUidInput = document.getElementById('search-uid');
const searchBtn = document.getElementById('search-btn');
const userInfoCard = document.getElementById('user-info-card');
const userNameText = document.getElementById('user-name');
const userEmailText = document.getElementById('user-email');
const currentBalanceText = document.getElementById('current-balance');

const newBalanceInput = document.getElementById('new-balance');
const updateBtn = document.getElementById('update-btn');
const statusMessage = document.getElementById('status-message');

let currentActiveUID = ""; // সার্চ করা ইউজারের আইডি স্টোর রাখার জন্য গ্লোবাল ভেরিয়েবল

// ==========================================
// লজিক ১: নতুন পাসওয়ার্ড চেক করে প্যানেলে ঢোকা
// ==========================================
loginBtn.addEventListener('click', () => {
    const inputPass = adminPasswordInput.value.trim();
    if(inputPass === SECRET_ADMIN_PASSWORD) {
        loginContainer.style.display = 'none'; // লগইন বক্স গায়েব হবে
        adminDashboard.style.display = 'block'; // কন্ট্রোল প্যানেল ওপেন হবে
    } else {
        loginError.innerText = "Error: Invalid admin credentials!";
    }
});

// ==========================================
// লজিক ২: UID দিয়ে ইউজার সার্চ করে ডাটাবেজ থেকে ডাটা আনা
// ==========================================
searchBtn.addEventListener('click', () => {
    const uid = searchUidInput.value.trim();
    if(!uid) return alert("Please type a valid User UID");

    statusMessage.innerText = "Searching database...";
    const userRef = ref(db, 'users/' + uid);

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            currentActiveUID = uid; // আইডি সেভ করা হলো
            
            // স্ক্রিনে ইউজারের নাম, ইমেইল এবং রিয়েল ব্যালেন্স পুশ করা হচ্ছে
            userNameText.innerText = data.name || "Unknown User";
            userEmailText.innerText = data.email || "No Email";
            
            // যদি ডাটাবেজে ব্যালেন্স ডাটা না থাকে (অথবা ০ থাকে) তবে স্ক্রিনে ০ দেখাবে
            currentBalanceText.innerText = data.balance !== undefined ? data.balance : 0; 
            
            userInfoCard.style.display = 'block'; // ইনফো কার্ড ওপেন
            statusMessage.innerText = "User account found!";
        } else {
            userInfoCard.style.display = 'none';
            statusMessage.innerText = "No user found with this UID!";
        }
    }).catch((err) => {
        statusMessage.innerText = "Fetch Error: " + err.message;
    });
});

// ==========================================
// লজিক ৩: পুরাতন ব্যালেন্স যাই থাকুক, তা পুরোপুরি পরিবর্তন করা
// ==========================================
updateBtn.addEventListener('click', () => {
    const amountInput = newBalanceInput.value.trim();
    if(amountInput === "") return alert("Please enter a new balance amount");
    
    const calculatedAmount = Number(amountInput); // টেক্সট থেকে পিওর নাম্বারে কনভার্ট (যেমন: ০ বা ১০০০)
    const userRef = ref(db, 'users/' + currentActiveUID);

    statusMessage.innerText = "Rewriting user balance...";

    // ফায়ারবেস রিয়েলটাইম ডাটাবেজে ব্যালেন্স আপডেট করার কুয়েরি
    update(userRef, {
        balance: calculatedAmount
    })
    .then(() => {
        currentBalanceText.innerText = calculatedAmount; // স্ক্রিনের ব্যালেন্স ইনস্ট্যান্ট আপডেট
        newBalanceInput.value = ""; // ইনপুট বক্স রিফ্রেশ
        statusMessage.innerText = "Success! Account balance set to $" + calculatedAmount;
    })
    .catch((err) => {
        statusMessage.innerText = "Update Failed: " + err.message;
    });
});
