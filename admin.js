// ১. ফায়ারবেস ফায়ারস্টোর (Firestore) মডিউলসমূহ সরাসরি CDN থেকে ইমপোর্ট করা
import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "https://gstatic.com";

// ⚠️ আপনার অরিজিনাল ফায়ারবেস কনফিগ
const firebaseConfig = {
  apiKey: "AIzaSyAbSup8aEQ7bgSyLeqx6RMpnjoFxYu204M",
  authDomain: "://firebaseapp.com",
  projectId: "cptmarket-5b843",
  storageBucket: "cptmarket-5b843.firebasestorage.app",
  messagingSenderId: "270504953481",
  appId: "1:270504953481:web:a108213c2161fcffa16858"
};

// ফায়ারবেস এবং ফায়ারস্টোর ইনিশিয়ালাইজ করা
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

let targetDocId = ""; // ইউজারের নির্দিষ্ট ডকুমেন্ট আইডি সেভ রাখার জন্য

// ==========================================
// লজিক ২: Firestore থেকে UID দিয়ে ইউজার খোঁজা
// ==========================================
searchBtn.addEventListener('click', async () => {
    const uidInput = searchUidInput.value.trim();
    if(!uidInput) return alert("Please type a valid User UID");

    statusMessage.innerText = "Searching Firestore database...";
    
    try {
        // আপনার সাইটের নিয়ম অনুযায়ী 'users' কালেকশন থেকে খোঁজা হচ্ছে
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", uidInput));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((document) => {
                targetDocId = document.id; // ফায়ারস্টোর ডকুমেন্ট আইডি স্টোর করা হলো
                const data = document.val ? document.val() : document.data();
                
                // স্ক্রিনে ডাটা পুশ করা হচ্ছে
                userNameText.innerText = data.name || "User Account";
                userEmailText.innerText = data.email || "N/A";
                currentBalanceText.innerText = data.balance !== undefined ? data.balance : 0;
            });

            userInfoCard.style.display = 'block'; 
            statusMessage.innerText = "User account found!";
        } else {
            userInfoCard.style.display = 'none';
            statusMessage.innerText = "No user found with this UID in Firestore!";
        }
    } catch (err) {
        statusMessage.innerText = "Fetch Error: " + err.message;
        console.error(err);
    }
});

// ==========================================
// লজিক ৩: ফায়ারস্টোরে ব্যালেন্স আপডেট করা
// ==========================================
updateBtn.addEventListener('click', async () => {
    const amountInput = newBalanceInput.value.trim();
    if(amountInput === "") return alert("Please enter a new balance amount");
    
    const calculatedAmount = Number(amountInput);
    statusMessage.innerText = "Updating Firestore balance...";

    try {
        const userDocRef = doc(db, "users", targetDocId);
        await updateDoc(userDocRef, {
            balance: calculatedAmount
        });

        currentBalanceText.innerText = calculatedAmount; 
        newBalanceInput.value = ""; 
        statusMessage.innerText = "Success! Account balance set to $" + calculatedAmount;
    } catch (err) {
        statusMessage.innerText = "Update Failed: " + err.message;
    }
});
