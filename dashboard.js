/* ==========================================
   CPTMARKETS DASHBOARD
   dashboard.js - FINAL COMPLETE BUTTON FIX
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("CptMarkets Dashboard JS Loaded");


    /* ======================================
       TAWK.TO
    ====================================== */

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();


    window.Tawk_API.onLoad = function () {

        console.log("Tawk.to loaded");

        if (
            typeof window.Tawk_API.hideWidget === "function"
        ) {
            window.Tawk_API.hideWidget();
        }

    };


    /* ======================================
       LOAD TAWK
    ====================================== */

    function loadTawk() {

        if (
            document.querySelector(
                'script[src*="embed.tawk.to"]'
            )
        ) {

            console.log("Tawk already loaded");
            return;

        }


        const script =
            document.createElement("script");


        script.async = true;


        script.src =
            "https://embed.tawk.to/6a71003c2d507b1d4a9fad4c/1jv4mhrhb";


        script.charset = "UTF-8";


        script.setAttribute(
            "crossorigin",
            "*"
        );


        document.body.appendChild(script);

    }


    loadTawk();


    /* ======================================
       KEEP TAWK HIDDEN INITIALLY
    ====================================== */

    const hideTawk =
        setInterval(function () {

            if (
                window.Tawk_API &&
                typeof window.Tawk_API.hideWidget ===
                "function"
            ) {

                window.Tawk_API.hideWidget();

                clearInterval(hideTawk);

            }

        }, 500);


    /* ======================================
       OPEN CUSTOMER SERVICE
    ====================================== */

    window.openSupportChat = function () {

        console.log(
            "Opening Customer Service"
        );


        /* ----------------------------------
           TAWK ALREADY READY
        ---------------------------------- */

        if (
            window.Tawk_API &&
            typeof window.Tawk_API.showWidget ===
            "function"
        ) {

            window.Tawk_API.showWidget();


            setTimeout(function () {

                if (
                    typeof window.Tawk_API.maximize ===
                    "function"
                ) {

                    window.Tawk_API.maximize();

                }

            }, 300);


            return;

        }


        /* ----------------------------------
           WAIT FOR TAWK
        ---------------------------------- */

        let attempts = 0;


        const waitTawk =
            setInterval(function () {

                attempts++;


                if (
                    window.Tawk_API &&
                    typeof window.Tawk_API.showWidget ===
                    "function"
                ) {

                    clearInterval(waitTawk);


                    window.Tawk_API.showWidget();


                    setTimeout(function () {

                        if (
                            typeof window.Tawk_API.maximize ===
                            "function"
                        ) {

                            window.Tawk_API.maximize();

                        }

                    }, 300);

                }


                if (attempts >= 30) {

                    clearInterval(waitTawk);

                    alert(
                        "Customer Service is loading. Please try again."
                    );

                }

            }, 500);

    };


    /* ==========================================
       BALANCE EYE
       HTML IDs:
       toggleEye
       balanceAmount
    ========================================== */

    const toggleEye =
        document.getElementById("toggleEye");


    const balanceAmount =
        document.getElementById("balanceAmount");


    let balanceVisible = true;


    let originalBalanceText = "";


    if (balanceAmount) {

        originalBalanceText =
            balanceAmount.textContent.trim();

    }


    /* ======================================
       GET CURRENT BALANCE
    ====================================== */

    function getCurrentBalance() {

        let value = null;


        /* ----------------------------------
           Try global getBalance()
        ---------------------------------- */

        if (
            typeof window.getBalance ===
            "function"
        ) {

            try {

                const result =
                    window.getBalance();


                if (
                    result !== undefined &&
                    result !== null &&
                    result !== "" &&
                    !isNaN(Number(result))
                ) {

                    value =
                        Number(result);

                }

            } catch (error) {

                console.warn(
                    "getBalance() error:",
                    error
                );

            }

        }


        /* ----------------------------------
           Try balance.js stored values
        ---------------------------------- */

        if (value === null) {

            const possibleKeys = [
                "balance",
                "userBalance",
                "accountBalance",
                "totalBalance"
            ];


            for (
                let i = 0;
                i < possibleKeys.length;
                i++
            ) {

                const key =
                    possibleKeys[i];


                const stored =
                    localStorage.getItem(key);


                if (
                    stored !== null &&
                    stored !== "" &&
                    !isNaN(Number(stored))
                ) {

                    value =
                        Number(stored);

                    break;

                }

            }

        }


        /* ----------------------------------
           Read visible HTML balance
        ---------------------------------- */

        if (
            value === null &&
            balanceAmount
        ) {

            const text =
                balanceAmount.textContent.trim();


            if (
                text &&
                text !== "••••••"
            ) {

                const cleaned =
                    text.replace(
                        /[^0-9.-]/g,
                        ""
                    );


                if (
                    cleaned !== "" &&
                    !isNaN(Number(cleaned))
                ) {

                    value =
                        Number(cleaned);

                }

            }

        }


        /* ----------------------------------
           Original saved text
        ---------------------------------- */

        if (
            value === null &&
            originalBalanceText
        ) {

            const cleaned =
                originalBalanceText.replace(
                    /[^0-9.-]/g,
                    ""
                );


            if (
                cleaned !== "" &&
                !isNaN(Number(cleaned))
            ) {

                value =
                    Number(cleaned);

            }

        }


        if (
            value === null ||
            !isFinite(value)
        ) {

            value = 0;

        }


        return value;

    }


    /* ======================================
       FORMAT BALANCE
    ====================================== */

    function formatBalance(value) {

        if (
            typeof window.formatUSD ===
            "function"
        ) {

            try {

                return window.formatUSD(value);

            } catch (error) {

                console.warn(
                    "formatUSD() error:",
                    error
                );

            }

        }


        return "$" +
            Number(value).toFixed(2);

    }


    /* ======================================
       SHOW BALANCE
    ====================================== */

    function showBalance() {

        if (!balanceAmount) {
            return;
        }


        const value =
            getCurrentBalance();


        balanceAmount.textContent =
            formatBalance(value);


        originalBalanceText =
            balanceAmount.textContent;


        balanceVisible = true;


        if (toggleEye) {

            toggleEye.classList.remove(
                "fa-eye-slash"
            );


            toggleEye.classList.add(
                "fa-eye"
            );


            toggleEye.setAttribute(
                "aria-label",
                "Hide balance"
            );

        }


        console.log(
            "Balance shown:",
            balanceAmount.textContent
        );

    }


    /* ======================================
       HIDE BALANCE
    ====================================== */

    function hideBalance() {

        if (!balanceAmount) {
            return;
        }


        if (
            balanceAmount.textContent !==
            "••••••"
        ) {

            originalBalanceText =
                balanceAmount.textContent;

        }


        balanceAmount.textContent =
            "••••••";


        balanceVisible = false;


        if (toggleEye) {

            toggleEye.classList.remove(
                "fa-eye"
            );


            toggleEye.classList.add(
                "fa-eye-slash"
            );


            toggleEye.setAttribute(
                "aria-label",
                "Show balance"
            );

        }


        console.log(
            "Balance hidden"
        );

    }


    /* ======================================
       BALANCE EYE CLICK
    ====================================== */

    if (
        toggleEye &&
        balanceAmount
    ) {

        toggleEye.style.cursor =
            "pointer";


        toggleEye.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                if (balanceVisible) {

                    hideBalance();

                } else {

                    showBalance();

                }

            }
        );


        console.log(
            "Balance Eye Toggle Ready"
        );

    } else {

        console.warn(
            "Balance elements not found."
        );

    }


    /* ======================================
       WITHDRAW INTERFACE
    ====================================== */

    function openWithdrawInterface() {

        console.log(
            "Opening Withdraw Interface"
        );


        /* ----------------------------------
           REMOVE OLD PAGE
        ---------------------------------- */

        const oldPage =
            document.getElementById(
                "cptWithdrawPage"
            );


        if (oldPage) {

            oldPage.remove();

        }


        const oldStyle =
            document.getElementById(
                "cptWithdrawStyle"
            );


        if (oldStyle) {

            oldStyle.remove();

        }


        /* ==================================
           CREATE WITHDRAW PAGE
        ================================== */

        const withdrawPage =
            document.createElement("div");


        withdrawPage.id =
            "cptWithdrawPage";


        withdrawPage.innerHTML = `

            <div class="cpt-withdraw-header">

                <button
                    id="cptWithdrawBack"
                    class="cpt-back-button"
                    type="button"
                >
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
                        type="button"
                    >
                        Submit Withdrawal
                    </button>


                    <div
                        id="cptWithdrawMessage"
                        class="cpt-withdraw-message"
                    ></div>

                </div>

            </div>

        `;


        document.body.appendChild(
            withdrawPage
        );


        /* ==================================
           WITHDRAW STYLE
        ================================== */

        const style =
            document.createElement("style");


        style.id =
            "cptWithdrawStyle";


        style.textContent = `

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

                color: white;

                overflow-y: auto;

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

            }


            .cpt-withdraw-header {

                height: 88px;

                display: flex;

                align-items: center;

                justify-content: center;

                position: relative;

                background: #0c152b;

                border-bottom:
                    1px solid
                    rgba(255,255,255,.08);

            }


            .cpt-withdraw-header h1 {

                margin: 0;

                font-size: 28px;

            }


            .cpt-back-button {

                position: absolute;

                left: 18px;

                top: 50%;

                transform:
                    translateY(-50%);

                border: none;

                background: transparent;

                color: white;

                font-size: 42px;

                line-height: 1;

                cursor: pointer;

            }


            .cpt-withdraw-content {

                padding: 30px 28px;

            }


            .cpt-withdraw-card {

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
                    rgba(255,255,255,.12);

                box-shadow:
                    0 15px 45px
                    rgba(0,0,0,.35);

            }


            .cpt-withdraw-card label {

                display: block;

                margin-bottom: 12px;

                color: #aebbd3;

                font-size: 20px;

            }


            .cpt-withdraw-card input {

                width: 100%;

                height: 65px;

                margin-bottom: 25px;

                padding: 0 20px;

                box-sizing: border-box;

                border-radius: 20px;

                border:
                    1px solid
                    rgba(130,160,210,.28);

                outline: none;

                background: #070f22;

                color: white;

                font-size: 20px;

            }


            .cpt-withdraw-card input::placeholder {

                color: #71809d;

            }


            .cpt-submit-withdraw {

                width: 100%;

                height: 68px;

                border: none;

                border-radius: 22px;

                font-size: 21px;

                font-weight: 700;

                color: #171717;

                background:
                    linear-gradient(
                        90deg,
                        #ffe68a,
                        #f5c400,
                        #d99100
                    );

                cursor: pointer;

            }


            .cpt-submit-withdraw:active {

                transform:
                    scale(.99);

            }


            .cpt-withdraw-message {

                display: none;

                margin-top: 25px;

                padding: 20px;

                border-radius: 20px;

                background: #182337;

                text-align: center;

                font-size: 18px;

                line-height: 1.5;

            }

        `;


        document.head.appendChild(
            style
        );


        /* ==================================
           BACK BUTTON
        ================================== */

        const backButton =
            document.getElementById(
                "cptWithdrawBack"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                function () {

                    withdrawPage.remove();


                    const withdrawStyle =
                        document.getElementById(
                            "cptWithdrawStyle"
                        );


                    if (withdrawStyle) {

                        withdrawStyle.remove();

                    }

                }
            );

        }


        /* ==================================
           SUBMIT WITHDRAWAL
        ================================== */

        const submitWithdrawal =
            document.getElementById(
                "cptSubmitWithdrawal"
            );


        if (submitWithdrawal) {

            submitWithdrawal.addEventListener(
                "click",
                function () {

                    const amount =
                        parseFloat(
                            document.getElementById(
                                "cptWithdrawAmount"
                            ).value
                        );


                    const address =
                        document.getElementById(
                            "cptReceivingAddress"
                        ).value.trim();


                    const message =
                        document.getElementById(
                            "cptWithdrawMessage"
                        );


                    /* ------------------------
                       AMOUNT VALIDATION
                    ------------------------ */

                    if (
                        isNaN(amount) ||
                        amount <= 0
                    ) {

                        message.style.display =
                            "block";

                        message.textContent =
                            "Please enter a valid withdrawal amount.";

                        return;

                    }


                    /* ------------------------
                       ADDRESS VALIDATION
                    ------------------------ */

                    if (!address) {

                        message.style.display =
                            "block";

                        message.textContent =
                            "Please enter your receiving address / account.";

                        return;

                    }


                    /* ------------------------
                       GET BALANCE
                    ------------------------ */

                    let currentBalance =
                        getCurrentBalance();


                    if (
                        amount >
                        currentBalance
                    ) {

                        message.style.display =
                            "block";

                        message.textContent =
                            "Insufficient account balance.";

                        return;

                    }


                    /* ------------------------
                       CUSTOMER SERVICE
                    ------------------------ */

                    message.style.display =
                        "block";


                    message.textContent =
                        "Please contact Customer Service to complete your withdrawal.";


                    setTimeout(
                        function () {

                            window.openSupportChat();

                        },
                        500
                    );

                }
            );

        }

    }


    /* ======================================
       MENU ITEMS
    ====================================== */

    const menuItems =
        document.querySelectorAll(
            ".menu-grid .menu-item"
        );


    menuItems.forEach(
        function (item) {

            const label =
                item
                    .querySelector("span");


            if (!label) {
                return;
            }


            const text =
                label.textContent
                    .trim()
                    .toLowerCase();


            /* ----------------------------
               SUPPORT
            ---------------------------- */

            if (text === "support") {

                item.style.cursor =
                    "pointer";


                item.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        window.openSupportChat();

                    }
                );

            }


            /* ----------------------------
               WITHDRAW
            ---------------------------- */

            if (text === "withdraw") {

                item.style.cursor =
                    "pointer";


                item.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        openWithdrawInterface();

                    }
                );

            }


            /* ----------------------------
               LOAN
            ---------------------------- */

            if (text === "loan") {

                item.style.cursor =
                    "pointer";


                item.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        window.location.href = "loan.html";

                    }
                );

            }

        }
    );


    /* ======================================
       DEPOSIT BUTTON (সংশোধিত অংশ)
    ====================================== */

    const depositButton =
        document.querySelector(
            ".deposit-btn"
        );


    if (depositButton) {

        depositButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                // পপআপ বা চ্যাটে না নিয়ে সরাসরি deposit.html এ নিয়ে যাবে
                window.location.href = "deposit.html";

            }
        );

    }


    /* ======================================
       WITHDRAW BUTTON
       ASSET CARD
    ====================================== */

    const withdrawButton =
        document.querySelector(
            ".withdraw-btn"
        );


    if (withdrawButton) {

        withdrawButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                openWithdrawInterface();

            }
        );

    }


    /* ======================================
       TRANSFER BUTTON
       ASSET CARD
    ====================================== */

    const transferButton =
        document.querySelector(
            ".transfer-btn"
        );


    if (transferButton) {

        transferButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                window.location.href =
                    "transfer.html";

            }
        );

    }


    /* ======================================
       REFRESH BUTTON
    ====================================== */

    const refreshButton =
        document.querySelector(
            ".fa-rotate-right"
        );


    if (refreshButton) {

        refreshButton.style.cursor =
            "pointer";


        refreshButton.addEventListener(
            "click",
            function () {

                refreshButton.style.transition =
                    "transform 0.6s";


                refreshButton.style.transform =
                    "rotate(360deg)";


                setTimeout(
                    function () {

                        refreshButton.style.transition =
                            "none";


                        refreshButton.style.transform =
                            "rotate(0deg)";


                        if (
                            typeof window.refreshBalanceUI ===
                            "function"
                        ) {

                            window.refreshBalanceUI();

                        }


                        if (
                            balanceVisible &&
                            balanceAmount
                        ) {

                            showBalance();

                        }

                    },
                    650
                );

            }
        );

    }

    console.log("CptMarkets Dashboard Ready - Fixed");

});
