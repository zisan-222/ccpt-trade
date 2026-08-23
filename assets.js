/* ==========================================
   CPTMARKETS
   assets.js - Part 1
========================================== */

/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    refreshBalanceUI();

});


/* ==========================================
   BALANCE SHOW / HIDE
========================================== */

const eyeButton =
    document.getElementById("assetEye");

const assetBalance =
    document.getElementById("assetBalance");

let balanceVisible = true;

let originalBalance = "";


if (assetBalance) {

    originalBalance =
        assetBalance.textContent;

}


if (eyeButton && assetBalance) {

    eyeButton.addEventListener("click", function () {

        if (balanceVisible) {

            originalBalance =
                assetBalance.textContent;

            assetBalance.textContent =
                "••••••";

            eyeButton.classList.remove(
                "fa-eye"
            );

            eyeButton.classList.add(
                "fa-eye-slash"
            );

            balanceVisible = false;

        }

        else {

            assetBalance.textContent =
                originalBalance;

            eyeButton.classList.remove(
                "fa-eye-slash"
            );

            eyeButton.classList.add(
                "fa-eye"
            );

            balanceVisible = true;

        }

    });

}


/* ==========================================
   REFRESH BUTTON
========================================== */

const refreshButton =
    document.querySelector(
        ".fa-rotate-right"
    );


if (refreshButton) {

    refreshButton.addEventListener(
        "click",

        function () {

            refreshButton.style.transition =
                "0.6s";

            refreshButton.style.transform =
                "rotate(360deg)";

            setTimeout(function () {

                refreshButton.style.transition =
                    "none";

                refreshButton.style.transform =
                    "rotate(0deg)";

                refreshBalanceUI();

            }, 650);

        }

    );

}
/* ==========================================
   CPTMARKETS
   assets.js - Part 2
========================================== */

/* ==========================================
   DEPOSIT BUTTON
========================================== */

const depositBtn = document.querySelector(".deposit-btn");

if (depositBtn) {

    depositBtn.addEventListener("click", function (e) {

        e.preventDefault();

        if (typeof openSupportChat === "function") {

            openSupportChat();

        } else {

            alert("Please contact Customer Service.");

        }

    });

}


/* ==========================================
   UPDATE BALANCE
========================================== */

setInterval(function () {

    refreshBalanceUI();

}, 1000);
