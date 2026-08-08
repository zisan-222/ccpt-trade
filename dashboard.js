// dashboard.js - Updated for New Firebase Realtime Database
window.WEB_LINK_API = "admin-zisan.html";

// কাস্টমার সাপোর্ট বোতামের লজিক
const askBtnContainer = document.querySelectorAll(".home-header-right-item")[1];
if (askBtnContainer) {
    askBtnContainer.addEventListener("click", function() {
        alert("Customer service is loading...!!");
    });
}

// ব্যালেন্স লুকানোর/দেখানোর লজিক
const eyeIcon = document.querySelector(".balance-amount i");
const balanceText = document.querySelector(".balance-amount span");
let initialBalance = "$0.00";
let isBalanceVisible = true;

if (eyeIcon && balanceText) {
    eyeIcon.addEventListener("click", function() {
        if (isBalanceVisible) {
            balanceText.innerText = "********";
            eyeIcon.className = "fa-eye-slash";
            isBalanceVisible = false;
        } else {
            balanceText.innerText = initialBalance;
            eyeIcon.className = "fa-eye";
            isBalanceVisible = true;
        }
    });
}

// পেজ রিফ্রেশ লজিক
const refreshBtn = document.querySelector(".fa-rotate-right");
if (refreshBtn) {
    refreshBtn.addEventListener("click", function() {
        location.reload();
    });
}

// ডিপোজিট ও অন্যান্য নেভিগেশন বোতামের লজিক
const depositBtn = document.querySelector('[target-href="deposit"]');
if (depositBtn) {
    depositBtn.addEventListener("click", function() {
        // deposit page redirect logic
    });
}

// ট্রেড পেজ ডিরেকশন
const tradeBtn = document.getElementById("trade-btn");
if (tradeBtn) {
    tradeBtn.addEventListener("click", function() {
        window.location.href = "trade.html";
    });
}

// ==========================================================
// 🚀 নতুন ফায়ারবেস থেকে রিয়েল-টাইমে ডাটা ও ব্যালেন্স লোড করার লজিক
// ==========================================================
window.addEventListener("load", function() {
    console.log("CPTMarkets Dashboard loading...");

    // স্থানীয় স্টোরেজ (LocalStorage) থেকে লগইন করা ইউজারের UID খুঁজে বের করা
    const loggedInUID = localStorage.getItem("userUID") || "UID1786089707472"; // ডিফল্ট বা আসল আইডি

    // ⚠️ আপনার নতুন সচল ফায়ারবেস রিয়েলটাইম ডাটাবেজ ইউআরএল
    const databaseURL = "https://firebaseio.com";

    // ডাটাবেজের 'users' ফোল্ডার থেকে সম্পূর্ণ কুয়েরি করে ওই UID-র ডাটা আনা হচ্ছে
    fetch(`${databaseURL}/users.json`)
    .then(response => response.json())
    .then(allUsers => {
        if (allUsers) {
            let userFound = false;

            // ডাটাবেজের সব ইউজারের ভেতর লুপ চালিয়ে UID মিলানো হচ্ছে
            Object.keys(allUsers).forEach(key => {
                const userData = allUsers[key];
                if (userData.uid === loggedInUID) {
                    userFound = true;
                    
                    // স্ক্রিনে ইউজারের নাম ও ব্যালেন্স বসানো হচ্ছে
                    const userNameEl = document.querySelector(".user-name span") || document.querySelector(".admin-zisan");
                    if (userNameEl) userNameEl.innerText = userData.name || "User Account";

                    const userBalance = userData.balance !== undefined ? userData.balance : 0;
                    initialBalance = "$" + Number(userBalance).toFixed(2);
                    
                    if (balanceText && isBalanceVisible) {
                        balanceText.innerText = initialBalance;
                    }
                }
            });

            if (!userFound) {
                console.log("No user found in database with UID: " + loggedInUID);
            }
        }
    })
    .catch(error => {
        console.error("Firebase Fetch Error: ", error);
    });
});
