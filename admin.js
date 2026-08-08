 // ১. ফায়ারবেস মডিউলসমূহ সরাসরি অফিশিয়াল CDN থেকে ইমপোর্ট করা
import { initializeApp } from "https://gstatic.com";
import { getDatabase, ref, get, update, query, orderByChild, equalTo } from "https://gstatic.com";

// ⚠️ আপনার অরিজিনাল ফায়ারবেস কনফিগ
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

// HTML ইন্টারফেসের বাটন ও ইনপুট এলিমেন্টসমূহ
const searchUidInput = document.getElementById('search-uid');
const searchBtn = document.getElementById('search-btn');
const userInfoCard = document.getElementById('user-info-card');
const userNameText = document.getElementById('user-name');
const userEmailText = document.getElementById('user-email');
const currentBalanceText = document.getElementById('current-balance');

const newBalanceInput = document.getElementById('new-balance');
const updateBtn = document.getElementById('update-btn');
const statusMessage = document.getElementById('status-message');

let currentActiveUserKey = ""; // যে ইউজারের অ্যাকাউন্ট পাওয়া যাবে তার ডাটাবেজ কি (Key) বা পাথ রাখার জন্য

// ==========================================
// লজিক ২: UID দিয়ে ডাটাবেজে ইউজার খোঁজা (Query System)
// ==========================================
searchBtn.addEventListener('click', () => {
    const uidInput = searchUidInput.value.trim();
    if(!uidInput) return alert("Please type a valid User UID");

    statusMessage.innerText = "Searching database by UID...";
    
    // মূল রুট ডিরেক্টরিতে কুয়েরি চালানো হচ্ছে যেন ভেতরের 'uid' ফিল্ডের সাথে ইনপুট করা UID মিলে যায়
    const dbRef = ref(db, '/');
    const uidQuery = query(dbRef, orderByChild('uid'), equalTo(uidInput));

    get(uidQuery).then((snapshot) => {
        if (snapshot.exists()) {
            // ফায়ারবেস কুয়েরি অবজেক্ট আকারে ডাটা দেয়, তাই লুপ দিয়ে মেইন ইউজারকে বের করা হচ্ছে
            snapshot.forEach((childSnapshot) => {
                currentActiveUserKey = childSnapshot.key; // ইউজারের ডাটাবেজ পাথ/ইমেল কি (যেমন: zisanemailcom)
                const data = childSnapshot.val();
                
                // স্ক্রিনে ইউজারের নাম, ইমেইল এবং রিয়েল ব্যালেন্স পুশ করা হচ্ছে
                userNameText.innerText = data.name || "User Account";
                userEmailText.innerText = data.email || "N/A";
                
                // ব্যালেন্স ফিল্ডের ডাটা স্ক্রিনে দেখানো
                currentBalanceText.innerText = data.balance !== undefined ? data.balance : 0;
            });
            
            userInfoCard.style.display = 'block'; // ইনফো কার্ড ওপেন 
            statusMessage.innerText = "User account found!";
        } else {
            userInfoCard.style.display = 'none';
            statusMessage.innerText = "No user found with this UID! Make sure it matches exactly.";
        }
    }).catch((err) => {
        statusMessage.innerText = "Fetch Error: " + err.message;
        console.error(err);
    });
});

// ==========================================
// লজিক ৩: পুরাতন ব্যালেন্স যাই থাকুক, তা পুরোপুরি পরিবর্তন করা
// ==========================================
updateBtn.addEventListener('click', () => {
    const amountInput = newBalanceInput.value.trim();
    if(amountInput === "") return alert("Please enter a new balance amount");
    
    const calculatedAmount = Number(amountInput); // টেক্সট থেকে পিওর নাম্বারে কনভার্ট (যেমন: ০ বা ১০০০)
    const userRef = ref(db, currentActiveUserKey);

    statusMessage.innerText = "Rewriting user balance...";

    // ফায়ারবেস রিয়েলটাইম ডাটাবেজে সরাসরি ব্যালেন্স আপডেট করা
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
