/* ==========================================
   CPTMARKETS DASHBOARD
   dashboard.js - Edited Complete Version
========================================== */


/* ==========================================
   TAWK.TO CUSTOMER SERVICE
========================================== */

window.Tawk_API = window.Tawk_API || {};
window.Tawk_LoadStart = new Date();

let tawkLoaded = false;


/* ==========================================
   TAWK.TO LOADED
========================================== */

window.Tawk_API.onLoad = function () {

    tawkLoaded = true;

    console.log("Tawk.to Customer Service Loaded");

    if (typeof window.Tawk_API.hideWidget === "function") {
        window.Tawk_API.hideWidget();
    }

};


/* ==========================================
   OPEN CUSTOMER SERVICE
========================================== */

function openSupportChat() {

    if (!tawkLoaded) {

        if (
            typeof window.Tawk_API !== "undefined" &&
            typeof window.Tawk_API.showWidget === "function"
        ) {

            window.Tawk_API.showWidget();

        } else {

            alert("Customer Service is loading...");

            return;
        }
    }


    if (typeof window.Tawk_API.showWidget === "function") {
        window.Tawk_API.showWidget();
    }


    setTimeout(function () {

        if (typeof window.Tawk_API.maximize === "function") {
            window.Tawk_API.maximize();
        }

    }, 300);

}


/* ==========================================
   BALANCE SHOW / HIDE
========================================== */

const eyeBtn = document.querySelector(".asset-header i");
const balance = document.getElementById("balance");


/*
   Read the balance already displayed
   inside dashboard.html.

   Example:
   $100.00
   $50.00
   $0.00
*/

let balanceText = "$0.00";

if (balance) {

    const currentBalance = balance.textContent.trim();

    if (currentBalance !== "") {
        balanceText = currentBalance;
    }

}


let balanceVisible = true;


if (eyeBtn && balance) {

    eyeBtn.addEventListener("click", function () {

        if (balanceVisible) {

            balance.innerHTML = "••••••";

            eyeBtn.classList.remove("fa-eye");
            eyeBtn.classList.add("fa-eye-slash");

            balanceVisible = false;

        }

        else {

            balance.innerHTML = balanceText;

            eyeBtn.classList.remove("fa-eye-slash");
            eyeBtn.classList.add("fa-eye");

            balanceVisible = true;

        }

    });

}


/* ==========================================
   GET NUMERIC ACCOUNT BALANCE
========================================== */

function getAccountBalance() {

    /*
       Convert:

       "$100.00" -> 100
       "$1,250.50" -> 1250.50
       "$0.00" -> 0
    */

    const numericValue = parseFloat(
        balanceText.replace(/[^0-9.-]+/g, "")
    );

    if (isNaN(numericValue)) {
        return 0;
    }

    return numericValue;

}


/* ==========================================
   REFRESH BUTTON
========================================== */

const refreshBtn = document.querySelector(".fa-rotate-right");


if (refreshBtn) {

    refreshBtn.addEventListener("click", function () {

        refreshBtn.style.transition = "none";
        refreshBtn.style.transform = "rotate(0deg)";


        setTimeout(function () {

            refreshBtn.style.transition = "0.6s";
            refreshBtn.style.transform = "rotate(360deg)";

        }, 10);


        setTimeout(function () {

            refreshBtn.style.transition = "none";
            refreshBtn.style.transform = "rotate(0deg)";

        }, 650);

    });

}


/* ==========================================
   DEPOSIT BUTTON
   TAWK.TO CUSTOMER SERVICE
========================================== */

const depositBtn = document.querySelector(".deposit-btn");


if (depositBtn) {

    depositBtn.addEventListener("click", function (e) {

        e.preventDefault();

        openSupportChat();

    });

}


/* ==========================================
   SUPPORT BUTTON
   TAWK.TO CUSTOMER SERVICE
========================================== */

const supportBtn = document.querySelector(".support-btn");


if (supportBtn) {

    supportBtn.addEventListener("click", function (e) {

        e.preventDefault();

        openSupportChat();

    });

}


/* ==========================================
   LOAN BUTTON
   TAWK.TO CUSTOMER SERVICE
========================================== */

const loanBtn = document.querySelector(".loan-btn");


if (loanBtn) {

    loanBtn.addEventListener("click", function (e) {

        e.preventDefault();

        openSupportChat();

    });

}


/* ==========================================
   WITHDRAW INTERFACE
========================================== */

function openWithdrawInterface() {

    /*
       Create Withdrawal Interface
       without creating a new HTML file.
    */


    const withdrawPage = document.createElement("div");

    withdrawPage.id = "cptWithdrawPage";


    withdrawPage.innerHTML = `

        <div class="cpt-withdraw-header">

            <button id="cptWithdrawBack" class="cpt-back-button">
                ‹
            </button>

            <h1>Withdraw</h1>

        </div>


        <div class="cpt-withdraw-content">

            <div class="cpt-withdraw-card">

                <label>
                    Withdrawal Amount
                </label>

                <input
                    type="number"
                    id="cptWithdrawAmount"
                    placeholder="Withdrawal Amount (USD)"
                    min="0"
                    step="0.01"
                >


                <label>
                    Receiving Address
                </label>

                <input
                    type="text"
                    id="cptReceivingAddress"
                    placeholder="Receiving Address / Account"
                >


                <button
                    id="cptSubmitWithdrawal"
                    class="cpt-submit-withdraw"
                >
                    Submit Withdrawal
                </button>

            </div>


            <div
                id="cptWithdrawMessage"
                class="cpt-withdraw-message"
            ></div>

        </div>

    `;


    document.body.appendChild(withdrawPage);


    /* ======================================
       WITHDRAW PAGE STYLE
    ====================================== */

    const withdrawStyle = document.createElement("style");

    withdrawStyle.id = "cptWithdrawStyle";


    withdrawStyle.innerHTML = `

        #cptWithdrawPage {

            position: fixed;

            inset: 0;

            z-index: 999999;

            background:
                linear-gradient(
                    180deg,
                    #081126 0%,
                    #020817 100%
                );

            color: #ffffff;

            overflow-y: auto;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

        }


        .cpt-withdraw-header {

            height: 90px;

            display: flex;

            align-items: center;

            justify-content: center;

            position: relative;

            background: #0c152b;

            border-bottom:
                1px solid
                rgba(255,255,255,0.08);

        }


        .cpt-withdraw-header h1 {

            margin: 0;

            font-size: 28px;

            font-weight: 700;

        }


        .cpt-back-button {

            position: absolute;

            left: 18px;

            top: 50%;

            transform:
                translateY(-50%);

            border: none;

            background: transparent;

            color: #ffffff;

            font-size: 42px;

            line-height: 1;

            cursor: pointer;

        }


        .cpt-withdraw-content {

            padding:
                30px
                28px;

        }


        .cpt-withdraw-card {

            width: 100%;

            max-width: 650px;

            margin: 0 auto;

            padding: 30px;

            border-radius: 30px;

            background:
                linear-gradient(
                    145deg,
                    #122440,
                    #172844
                );

            border:
                1px solid
                rgba(255,255,255,0.12);

            box-shadow:
                0 15px 45px
                rgba(0,0,0,0.35);

            box-sizing: border-box;

        }


        .cpt-withdraw-card label {

            display: block;

            margin:
                0 0
                12px;

            color: #aebbd3;

            font-size: 20px;

        }


        .cpt-withdraw-card input {

            width: 100%;

            height: 78px;

            margin:
                0 0
                28px;

            padding:
                0 24px;

            box-sizing: border-box;

            border-radius: 24px;

            border:
                1px solid
                rgba(130,160,210,0.28);

            outline: none;

            background: #070f22;

            color: #ffffff;

            font-size: 22px;

        }


        .cpt-withdraw-card input::placeholder {

            color: #71809d;

        }


        .cpt-withdraw-card input:focus {

            border-color: #f5c84c;

            box-shadow:
                0 0 0 2px
                rgba(245,200,76,0.12);

        }


        .cpt-submit-withdraw {

            width: 100%;

            height: 78px;

            border: none;

            border-radius: 25px;

            cursor: pointer;

            font-size: 23px;

            font-weight: 700;

            color: #171717;

            background:
                linear-gradient(
                    90deg,
                    #ffe68a,
                    #f5c400,
                    #d99100
                );

            box-shadow:
                0 5px 25px
                rgba(245,200,76,0.35);

        }


        .cpt-submit-withdraw:active {

            transform: scale(0.98);

        }


        .cpt-withdraw-message {

            display: none;

            width: fit-content;

            max-width: 90%;

            margin:
                55px auto
                0;

            padding:
                22px
                30px;

            box-sizing: border-box;

            text-align: center;

            border-radius: 24px;

            background: #182337;

            color: #ffffff;

            font-size: 21px;

            line-height: 1.45;

            box-shadow:
                0 15px 40px
                rgba(0,0,0,0.25);

        }


        @media (max-width: 480px) {

            .cpt-withdraw-header {

                height: 88px;

            }


            .cpt-withdraw-header h1 {

                font-size: 26px;

            }


            .cpt-withdraw-content {

                padding:
                    30px 28px;

            }


            .cpt-withdraw-card {

                padding: 28px;

                border-radius: 30px;

            }


            .cpt-withdraw-card label {

                font-size: 19px;

            }


            .cpt-withdraw-card input {

                height: 78px;

                font-size: 21px;

            }


            .cpt-submit-withdraw {

                height: 78px;

                font-size: 21px;

            }

        }

    `;


    document.head.appendChild(withdrawStyle);


    /* ======================================
       BACK BUTTON
    ====================================== */

    const backButton =
        document.getElementById(
            "cptWithdrawBack"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                withdrawPage.remove();

                const oldStyle =
                    document.getElementById(
                        "cptWithdrawStyle"
                    );

                if (oldStyle) {
                    oldStyle.remove();
                }

            }
        );

    }


    /* ======================================
       SUBMIT WITHDRAWAL
    ====================================== */

    const submitButton =
        document.getElementById(
            "cptSubmitWithdrawal"
        );


    if (submitButton) {

        submitButton.addEventListener(
            "click",
            function () {

                const amountInput =
                    document.getElementById(
                        "cptWithdrawAmount"
                    );


                const addressInput =
                    document.getElementById(
                        "cptReceivingAddress"
                    );


                const message =
                    document.getElementById(
                        "cptWithdrawMessage"
                    );


                const amount =
                    parseFloat(
                        amountInput.value
                    );


                const receivingAddress =
                    addressInput.value.trim();


                /* ==========================
                   VALIDATE AMOUNT
                ========================== */

                if (
                    isNaN(amount) ||
                    amount <= 0
                ) {

                    message.style.display =
                        "block";

                    message.innerHTML =
                        "Please enter a valid withdrawal amount.";

                    return;

                }


                /* ==========================
                   VALIDATE ADDRESS
                ========================== */

                if (
                    receivingAddress === ""
                ) {

                    message.style.display =
                        "block";

                    message.innerHTML =
                        "Please enter your receiving address / account.";

                    return;

                }


                /* ==========================
                   GET ACCOUNT BALANCE
                ========================== */

                const accountBalance =
                    getAccountBalance();


                console.log(
                    "Account Balance:",
                    accountBalance
                );

                console.log(
                    "Withdrawal Amount:",
                    amount
                );


                /* ==========================
                   AMOUNT GREATER THAN BALANCE
                ========================== */

                if (
                    amount > accountBalance
                ) {

                    message.style.display =
                        "block";

                    message.innerHTML = `
                        Insufficient funding
                        <br>
                        account balance
                    `;

                    return;

                }


                /* ==========================
                   BALANCE IS ENOUGH
                   CUSTOMER SERVICE
                ========================== */

                message.style.display =
                    "block";

                message.innerHTML = `
                    Please contact Customer Service
                    to complete your withdrawal.
                `;


                /*
                   Open Tawk Customer Service
                   after a short delay.
                */

                setTimeout(function () {

                    openSupportChat();

                }, 500);

            }
        );

    }

}


/* ==========================================
   WITHDRAW BUTTON
========================================== */

const withdrawBtn =
    document.querySelector(
        ".withdraw-btn"
    );


if (withdrawBtn) {

    withdrawBtn.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            /*
               IMPORTANT:

               Withdraw button will ALWAYS
               open the Withdrawal Interface.

               Balance is checked only after
               Submit Withdrawal is pressed.
            */

            openWithdrawInterface();

        }
    );

}


/* ==========================================
   TRANSFER BUTTON
========================================== */

const transferBtn =
    document.querySelector(
        ".transfer-btn"
    );


if (transferBtn) {

    transferBtn.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            alert(
                "Transfer page coming soon."
            );

        }
    );

}


/* ==========================================
   TRADE BUTTON
========================================== */

const tradeBtn =
    document.querySelector(
        ".trade-btn"
    );


if (tradeBtn) {

    tradeBtn.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            window.location.href =
                "trade.html";

        }
    );

}


/* ==========================================
   MENU ITEM ANIMATION
========================================== */

const menuItems =
    document.querySelectorAll(
        ".menu-item"
    );


menuItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function () {

                item.style.transform =
                    "scale(0.95)";


                setTimeout(
                    function () {

                        item.style.transform =
                            "scale(1)";

                    },
                    120
                );

            }
        );

    }
);


/* ==========================================
   MARKET FLASH ANIMATION
========================================== */

const marketPrices =
    document.querySelectorAll(
        ".price"
    );


if (marketPrices.length > 0) {

    setInterval(
        function () {

            marketPrices.forEach(
                function (price) {

                    const originalColor =
                        price.style.color;


                    price.style.color =
                        "#f5c84c";


                    setTimeout(
                        function () {

                            price.style.color =
                                originalColor;

                        },
                        500
                    );

                }
            );

        },
        3000
    );

}


/* ==========================================
   BOTTOM NAVIGATION ACTIVE
========================================== */

const navItems =
    document.querySelectorAll(
        ".bottom-nav a"
    );


navItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function () {

                navItems.forEach(
                    function (nav) {

                        nav.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );

            }
        );

    }
);


/* ==========================================
   DASHBOARD LOADED
========================================== */

window.addEventListener(
    "load",
    function () {

        console.log(
            "CptMarkets Dashboard Loaded"
        );

    }
);


/* ==========================================
   TAWK WIDGET AUTO HIDE
========================================== */

const checkTawk =
    setInterval(
        function () {

            if (
                typeof window.Tawk_API !==
                    "undefined" &&

                typeof window.Tawk_API
                    .hideWidget ===
                    "function"
            ) {

                window.Tawk_API.hideWidget();

                clearInterval(
                    checkTawk
                );

            }

        },
        500
    );


/* ==========================================
   END OF DASHBOARD.JS
========================================== */
