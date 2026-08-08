// ১. ফায়ারবেস মডিউলসমূহ সরাসরি অফিশিয়াল CDN থেকে ইমপোর্ট করা
import { initializeApp } from "https://gstatic.com";
import { getDatabase, ref, get, update, query, orderByChild, equalTo } from "https://gstatic.com";

// ⚠️ আপনার নতুন ও সচল ফায়ারবেস কনফিগ
const firebaseConfig = {
  apiKey: "AIzaSyAbSup8aEQ7bgSyLeqx6RMpnjoFxYu204M",
  authDomain: "://firebaseapp.com",
  projectId: "cptmarket-5b843",
  storageBucket: "cptmarket-5b843.firebasestorage.app",
  messagingSenderId: "270504953481",
  appId: "1:270504953481:web:a108213c2161fcffa16858",
  databaseURL: "https://firebaseio.com" // আপনার নতুন রিয়েলটাইম ডাটাবেজ ইউআরএল
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

let currentActiveUserKey = ""; // ডাটাবেজ পাথ/কি সেভ রাখার জন্য

// ==========================================
// লজিক ২: UID দিয়ে নতুন রিয়েলটাইম ডাটাবেজে ইউজার খোঁজা
// ==========================================
searchBtn.addEventListener('click', () => {
    const uidInput = searchUidInput.value.trim();
    if(!uidInput) return alert("Please type a valid User UID");

    statusMessage.innerText = "Searching database by UID...";
    
    // ডাটাবেজের 'users' ফোল্ডার থেকে কুয়েরি করা হচ্ছে
    const usersRef = ref(db, 'users');
    const uidQuery = query(usersRef, orderByChild('uid'), equalTo(uidInput));

    get(uidQuery).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                currentActiveUserKey = childSnapshot.key; // ইউজারের মেইন পুশ কি (Push Key)
                const data = childSnapshot.val();
                
                // স্ক্রিনে ইউজারের নাম, ইমেইল এবং রিয়েল ব্যালেন্স পুশ করা হচ্ছে
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

// ==========================================
// লজিক ৩: পুরাতন ব্যালেন্স যাই থাকুক, তা পুরোপুরি পরিবর্তন করা
// ==========================================
updateBtn.addEventListener('click', () => {
    const amountInput = newBalanceInput.value.trim();
    if(amountInput === "") return alert("Please enter a new balance amount");
    
    const calculatedAmount = Number(amountInput); 
    const userRef = ref(db, 'users/' + currentActiveUserKey);

    statusMessage.innerText = "Rewriting user balance...";

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
