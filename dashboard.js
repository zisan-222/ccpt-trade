// dashboard.js - Full Fixed with tawk.to Live Chat, Balance Hide, and New Firebase
window.WEB_LINK_API = "admin-zisan.html";

// ==========================================================
// 🛠️ ১. tawk.to লাইভ চ্যাট উইজেট লোড করার অফিশিয়াল কোড
// ==========================================================
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function(){
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://tawk.to'; // আপনার অরিজিনাল চ্যাট আইডি
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
})();

// ==========================================================
// 🎯 ২. ড্যাশবোর্ডের সব বোতামের ডিজাইন ও অ্যাকশন লজিক
// ==========================================================

// কাস্টমার সাপোর্ট বা চ্যাট বোতামে চাপ দিলে tawk.to ওপেন করার লজিক
function openLiveChat() {
    if (typeof Tawk_API !== "undefined" && Tawk_API.maximize) {
        Tawk_API.maximize(); // চ্যাট বক্সটি স্ক্রিনে বড় হয়ে ওপেন হবে
    } else {
        alert("Live chat is initializing, please wait a moment!");
    }
}

// কাস্টমার সাপোর্ট বোতামে ক্লিক লজিক
const supportItem = document.querySelector(".home-header-right-item");
if (supportItem) {
    supportItem.addEventListener("click", openLiveChat);
}

// ডিপোজিট এবং লোন বোতামে ক্লিক করলে চ্যাট ওপেন হওয়ার লজিক
const depositBtn = document.querySelector('[target-href="deposit"]');
if (depositBtn) {
    depositBtn.addEventListener("click", openLiveChat);
}

const loanBtn = document.querySelector('[target-href="loan"]');
if (loanBtn) {
    loanBtn.addEventListener("click", openLiveChat);
}

// ব্যালেন্স লুকানোর/দেখানোর লজিক (চোখের আইকন)
const eyeIcon = document.querySelector(".balance-amount i");
const balanceText = document.querySelector(".balance-amount span");
let initialBalance = "$0.00";
let isBalanceVisible = true;

if (eyeIcon && balanceText) {
    eyeIcon.addEventListener("click", function() {
        if (isBalanceVisible) {
            balanceText.innerText = "********";
            eyeIcon.className = "fa fa-eye-slash"; // আইকন পরিবর্তন
            isBalanceVisible = false;
        } else {
            balanceText.innerText = initialBalance;
            eyeIcon.className = "fa fa-eye"; // আইকন পরিবর্তন
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

// ট্রেড পেজ ডিরেকশন বোতাম
const tradeBtn = document.getElementById("trade-btn");
if (tradeBtn) {
    tradeBtn.addEventListener("click", function() {
        window.location.href = "trade.html";
    });
}

// ==========================================================
// 🚀 ৩. নতুন ফায়ারবেস থেকে রিয়েল-টাইমে ডাটা ও ব্যালেন্স লোড করার লজিক
// ==========================================================
window.addEventListener("load", function() {
    console.log("CPTMarkets Dashboard loading...");

    // স্থানীয় স্টোরেজ (LocalStorage) থেকে লগইন করা ইউজারের UID খুঁজে বের করা
    const loggedInUID = localStorage.getItem("userUID") || "UID1786089707472"; 

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
                    const userNameEl = document.querySelector(".user-name span");
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
