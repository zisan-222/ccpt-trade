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
   WITHDRAWAL INFORMATION INTERFACE
========================================== */

const withdrawBtn =
    document.querySelector(".withdraw-btn");

const withdrawInfoPage =
    document.getElementById("withdrawInfoPage");

const withdrawClose =
    document.getElementById("withdrawClose");

const withdrawMainAccount =
    document.getElementById("withdrawMainAccount");


/* OPEN */

if (withdrawBtn && withdrawInfoPage) {

    withdrawBtn.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            withdrawInfoPage.style.display =
                "flex";

            document.body.style.overflow =
                "hidden";

        }
    );

}


/* CLOSE */

if (withdrawClose && withdrawInfoPage) {

    withdrawClose.addEventListener(
        "click",
        function () {

            withdrawInfoPage.style.display =
                "none";

            document.body.style.overflow =
                "";

        }
    );

}


/* GO TO MAIN ACCOUNT */

if (withdrawMainAccount) {

    withdrawMainAccount.addEventListener(
        "click",
        function () {

            window.location.href =
                "dashboard.html";

        }
    );

}
/* ==========================================
   UPDATE BALANCE
========================================== */

setInterval(function () {

    refreshBalanceUI();

}, 1000);

/* ==========================================
   PROFESSIONAL WITHDRAWAL INFORMATION
========================================== */

.withdraw-info-page {

    position: fixed;

    inset: 0;

    z-index: 999999;

    display: none;

    align-items: center;

    justify-content: center;

    padding: 20px;

    background:
        radial-gradient(
            circle at 50% 20%,
            rgba(0, 183, 255, 0.12),
            transparent 35%
        ),
        radial-gradient(
            circle at 50% 80%,
            rgba(255, 193, 7, 0.08),
            transparent 40%
        ),
        #050b16;

    overflow-y: auto;
}


/* Container */

.withdraw-info-container {

    position: relative;

    width: 100%;

    max-width: 430px;

    padding: 42px 26px 30px;

    border-radius: 30px;

    text-align: center;

    background:
        linear-gradient(
            145deg,
            #101d32,
            #081221
        );

    border: 1px solid
        rgba(255,255,255,0.09);

    box-shadow:
        0 30px 80px
        rgba(0,0,0,0.65),

        inset 0 1px 0
        rgba(255,255,255,0.05);

    animation:
        withdrawInterfaceIn
        .35s ease;
}


/* Close */

.withdraw-close {

    position: absolute;

    top: 16px;

    right: 16px;

    width: 42px;

    height: 42px;

    border: 1px solid
        rgba(255,255,255,0.08);

    border-radius: 50%;

    background:
        rgba(255,255,255,0.06);

    color: #b8c4d8;

    font-size: 18px;

    cursor: pointer;

    transition: .25s;
}

.withdraw-close:hover {

    background:
        rgba(255,255,255,0.12);

    color: #fff;

    transform: rotate(90deg);
}


/* Logo */

.withdraw-logo {

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 10px;

    margin-bottom: 32px;
}


.withdraw-logo-icon {

    width: 40px;

    height: 40px;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 12px;

    background:
        linear-gradient(
            135deg,
            #ffd86a,
            #d89b00
        );

    color: #08101d;

    font-size: 19px;

    box-shadow:
        0 0 22px
        rgba(255,196,50,.28);
}


.withdraw-logo-text {

    font-size: 22px;

    font-weight: 800;

    letter-spacing: .3px;

    color: #f5c542;
}


/* Hero Icon */

.withdraw-hero-icon {

    position: relative;

    width: 110px;

    height: 110px;

    margin: 0 auto 25px;

    display: flex;

    align-items: center;

    justify-content: center;
}


.withdraw-icon-glow {

    position: absolute;

    inset: 5px;

    border-radius: 50%;

    background:
        rgba(245,197,66,.16);

    filter: blur(18px);

    animation:
        withdrawGlow
        2s ease-in-out infinite;
}


.withdraw-icon-circle {

    position: relative;

    width: 86px;

    height: 86px;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 50%;

    background:
        linear-gradient(
            145deg,
            #263d5d,
            #12243c
        );

    border: 1px solid
        rgba(245,197,66,.45);

    color: #f5c542;

    font-size: 34px;

    box-shadow:
        0 0 35px
        rgba(245,197,66,.18),

        inset 0 0 25px
        rgba(245,197,66,.06);
}


/* Title */

.withdraw-info-container h1 {

    margin: 0 0 18px;

    color: #ffffff;

    font-size: 27px;

    line-height: 1.25;

    font-weight: 800;

    letter-spacing: -.3px;
}


/* Description */

.withdraw-description {

    margin: 0 auto 12px;

    max-width: 360px;

    color: #aebbd0;

    font-size: 15px;

    line-height: 1.7;
}


.withdraw-description.secondary {

    color: #8797b0;

    margin-bottom: 27px;
}


.withdraw-description strong {

    color: #f5c542;

}


/* Main Button */

.withdraw-main-btn {

    width: 100%;

    height: 58px;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 12px;

    border: none;

    border-radius: 17px;

    background:
        linear-gradient(
            100deg,
            #ffe88a,
            #f5c542,
            #d89b00
        );

    color: #101722;

    font-size: 17px;

    font-weight: 800;

    cursor: pointer;

    box-shadow:
        0 8px 28px
        rgba(245,197,66,.24),

        inset 0 1px 0
        rgba(255,255,255,.55);

    transition:
        transform .2s,
        box-shadow .2s;
}


.withdraw-main-btn:hover {

    transform: translateY(-2px);

    box-shadow:
        0 12px 35px
        rgba(245,197,66,.38);
}


.withdraw-main-btn:active {

    transform: scale(.97);
}


/* Security */

.withdraw-security {

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 8px;

    margin-top: 22px;

    color: #65758d;

    font-size: 12px;
}


.withdraw-security i {

    color: #7187a4;

}


/* Animations */

@keyframes withdrawInterfaceIn {

    from {

        opacity: 0;

        transform:
            translateY(25px)
            scale(.97);

    }

    to {

        opacity: 1;

        transform:
            translateY(0)
            scale(1);

    }

}


@keyframes withdrawGlow {

    0%,100% {

        transform: scale(.9);

        opacity: .55;

    }

    50% {

        transform: scale(1.12);

        opacity: 1;

    }

}


/* Mobile */

@media (max-width: 380px) {

    .withdraw-info-container {

        padding:
            38px 20px 25px;

    }

    .withdraw-info-container h1 {

        font-size: 24px;

    }

    .withdraw-description {

        font-size: 14px;

    }

}
