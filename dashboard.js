// dashboard.js - Complete Original Logic Restored with New Firebase & Active Tawk.to
window.WEB_LINK_API = "admin-zisan.html";

// ==========================================================
// 🛠️ ১. আপনার আসল tawk.to লাইভ চ্যাট উইজেট স্ক্রিপ্ট
// ==========================================================
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function(){
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script");
    s1.async = true;
    s1.src = 'https://tawk.to'; // আপনার দেওয়া সচল আইডি
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
})();

// লাইভ চ্যাট বক্স স্ক্রিনে ওপেন করার ফাংশন
function toggleTawkChat() {
    if (typeof Tawk_API !== "undefined" && Tawk_API.maximize) {
        Tawk_API.maximize();
    } else {
        alert("Live chat is loading, please click again in a few seconds!");
    }
}

// ==========================================================
// 🎯 ২. আপনার আগের সব অরিজিনাল বোতামের লজিক (হুবহু অক্ষত রাখা হয়েছে)
// ==========================================================

// কাস্টমার সাপোর্ট বোতামের অরিজিনাল লজিক
const askBtnContainer = document.querySelectorAll(".home-header-right-item");
if (askBtnContainer) {
    askBtnContainer.forEach(btn => {
        btn.addEventListener("click", function() {
            alert("Customer service is loading...!!");
            toggleTawkChat(); // একই সাথে লাইভ চ্যাট ওপেন হবে
        });
    });
}

// ডিপোজিট বোতামের অরিজিনাল লজিক
const depositBtn = document.querySelector('[target-href="deposit"]');
if (depositBtn) {
    depositBtn.addEventListener("click", function() {
        // আপনার আগের ডিপোজিট পেজ রিডাইরেক্ট বা চ্যাট লজিক
        toggleTawkChat();
    });
}

// লোন বোতামের অরিজিনাল লজিক
const loanBtn = document.querySelector('[target-href="loan"]');
if (loanBtn) {
    loanBtn.addEventListener("click", function() {
        toggleTawkChat();
    });
}

// চোখের আইকনে চাপ দিলে ব্যালেন্স লুকানোর/দেখানোর অরিজিনাল লজিক
const eyeIcon = document.querySelector(".balance-amount i");
const balanceText = document.querySelector(".balance-amount span");
let initialBalance = "$0.00";
let isBalanceVisible = true;

if (eyeIcon && balanceText) {
    eyeIcon.addEventListener("click", function() {
        if (isBalanceVisible) {
            balanceText.innerText = "********";
            eyeIcon.className = "fa fa-eye-slash"; // আপনার আগের অরিজিনাল আইকন ক্লাস
            isBalanceVisible = false;
        } else {
            balanceText.innerText = initialBalance;
            eyeIcon.className = "fa fa-eye"; // আপনার আগের অরিজিনাল আইকন ক্লাস
            isBalanceVisible = true;
        }
    });
}

// পেজ রিফ্রেশ বোতামের অরিজিনাল লজিক
const refreshBtn = document.querySelector(".fa-rotate-right");
if (refreshBtn) {
    refreshBtn.addEventListener("click", function() {
        location.reload();
    });
}

// ট্রেড পেজে যাওয়ার অরিজিনাল বোতাম লজিক
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
