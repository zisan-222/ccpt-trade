/* ==========================================
   CPTMARKETS DASHBOARD
   dashboard.js - FINAL BUTTON + BALANCE FIX
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
            typeof window.Tawk_API.hideWidget ===
            "function"
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
       HIDE TAWK FLOATING ICON
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

        console.log("Opening Customer Service");


        /* ----------------------------------
           TAWK ALREADY LOADED
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
       BALANCE EYE HIDE / SHOW - FIXED
    ========================================== */

    const balanceEye =
        document.getElementById("balanceEye");

    const balanceElement =
        document.getElementById("balance");


    let balanceVisible = true;

    let savedBalanceText = "";


    /*
       Save the original balance text.
       This prevents the balance from being
       permanently lost when hidden.
    */

    if (balanceElement) {

        savedBalanceText =
            balanceElement.textContent.trim();

    }


    /*
       Get current balance safely
    */

    function getCurrentBalanceValue() {

        let currentBalance = null;


        /* ----------------------------------
           Try getBalance()
        ---------------------------------- */

        if (
            typeof window.getBalance ===
            "function"
        ) {

            try {

                const value =
                    window.getBalance();

                if (
                    value !== undefined &&
                    value !== null &&
                    value !== "" &&
                    !isNaN(Number(value))
                ) {

                    currentBalance =
                        Number(value);

                }

            } catch (error) {

                console.warn(
                    "getBalance() failed:",
                    error
                );

            }

        }


        /* ----------------------------------
           Try saved balance
        ---------------------------------- */

        if (
            currentBalance === null &&
            savedBalanceText
        ) {

            const cleaned =
                savedBalanceText
                    .replace(/[^0-9.-]/g, "");

            if (
                cleaned !== "" &&
                !isNaN(Number(cleaned))
            ) {

                currentBalance =
                    Number(cleaned);

            }

        }


        /* ----------------------------------
           Final fallback
        ---------------------------------- */

        if (
            currentBalance === null
        ) {

            currentBalance = 0;

        }


        return currentBalance;

    }


    /*
       Format balance safely
    */

    function formatBalanceValue(value) {

        if (
            typeof window.formatUSD ===
            "function"
        ) {

            try {

                return window.formatUSD(value);

            } catch (error) {

                console.warn(
                    "formatUSD() failed:",
                    error
                );

            }

        }


        return "$" +
            Number(value).toFixed(2);

    }


    /*
       SHOW BALANCE
    */

    function showBalance() {

        if (!balanceElement) {
            return;
        }


        const currentBalance =
            getCurrentBalanceValue();


        balanceElement.textContent =
            formatBalanceValue(
                currentBalance
            );


        savedBalanceText =
            balanceElement.textContent;


        balanceVisible = true;


        if (balanceEye) {

            balanceEye.classList.remove(
                "fa-eye-slash"
            );

            balanceEye.classList.add(
                "fa-eye"
            );

            balanceEye.setAttribute(
                "aria-label",
                "Hide balance"
            );

        }

    }


    /*
       HIDE BALANCE
    */

    function hideBalance() {

        if (!balanceElement) {
            return;
        }


        /*
           Save the real balance before hiding
        */

        if (
            balanceElement.textContent.trim() !==
            "••••••"
        ) {

            savedBalanceText =
                balanceElement.textContent.trim();

        }


        balanceElement.textContent =
            "••••••";


        balanceVisible = false;


        if (balanceEye) {

            balanceEye.classList.remove(
                "fa-eye"
            );

            balanceEye.classList.add(
                "fa-eye-slash"
            );

            balanceEye.setAttribute(
                "aria-label",
                "Show balance"
            );

        }

    }


    /*
       EYE BUTTON
    */

    if (
        balanceEye &&
        balanceElement
    ) {

        balanceEye.style.cursor =
            "pointer";


        balanceEye.addEventListener(
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


        /*
           Make sure the initial state
           starts with the eye icon.
        */

        balanceEye.classList.remove(
            "fa-eye-slash"
        );

        balanceEye.classList.add(
            "fa-eye"
        );


        balanceEye.setAttribute(
            "aria-label",
            "Hide balance"
        );


        console.log(
            "Balance eye toggle ready"
        );

    } else {

        console.warn(
            "Balance eye or balance element not found."
        );

    }


    /* ======================================
       WITHDRAW INTERFACE
    ====================================== */

    function openWithdrawInterface() {

        console.log(
            "Withdraw interface opening"
        );


        /* ----------------------------------
           REMOVE OLD INTERFACE
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
                    aria-label="Back"
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


                    const s =
                        document.getElementById(
                            "cptWithdrawStyle"
                        );


                    if (s) {

                        s.remove();

                    }

                }
            );

        }


        /* ==================================
           SUBMIT WITHDRAW
        ================================== */

        const submitButton =
            document.getElementById(
                "cptSubmitWithdrawal"
            );


        if (submitButton) {

            submitButton.addEventListener(
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
                       VALIDATE AMOUNT
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
                       VALIDATE ADDRESS
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
                        0;


                    if (
                        typeof window.getBalance ===
                        "function"
                    ) {

                        try {

                            currentBalance =
                                Number(
                                    window.getBalance()
                                );

                        } catch (error) {

                            console.warn(
                                "Unable to read balance:",
                                error
                            );

                        }

                    }


                    /*
                       If getBalance() is not
                       available, read from the
                       balance element.
                    */

                    if (
                        !isFinite(currentBalance) ||
                        currentBalance === 0
                    ) {

                        const balanceText =
                            balanceElement
                                ? balanceElement.textContent
                                : "";


                        if (
                            balanceText &&
                            balanceText !== "••••••"
                        ) {

                            const parsedBalance =
                                parseFloat(
                                    balanceText.replace(
                                        /[^0-9.-]/g,
                                        ""
                                    )
                                );


                            if (
                                !isNaN(parsedBalance)
                            ) {

                                currentBalance =
                                    parsedBalance;

                            }

                        }

                    }


                    /* ------------------------
                       CHECK BALANCE
                    ------------------------ */

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
                       SUCCESS MESSAGE
                    ------------------------ */

                    message.style.display =
                        "block";


                    message.innerHTML =
                        "Please contact Customer Service to complete your withdrawal.";


                    setTimeout(
                        function () {

                            if (
                                typeof window.openSupportChat ===
                                "function"
                            ) {

                                window.openSupportChat();

                            }

                        },
                        500
                    );

                }
            );

        }

    }


    /* ======================================
       UNIVERSAL BUTTON CLICK HANDLER
       FIXES DASHBOARD BUTTONS
    ====================================== */

    document.addEventListener(
        "click",
        function (event) {

            const target =
                event.target;


            /* =================================
               WITHDRAW
            ================================= */

            const withdraw =
                target.closest(
                    ".withdraw-btn"
                );


            if (withdraw) {

                event.preventDefault();

                event.stopPropagation();

                console.log(
                    "Withdraw clicked"
                );

                openWithdrawInterface();

                return;

            }


            /* =================================
               LOAN
            ================================= */

            const loan =
                target.closest(
                    ".loan-btn"
                );


            if (loan) {

                event.preventDefault();

                event.stopPropagation();

                console.log(
                    "Loan clicked"
                );

                openSupportChat();

                return;

            }


            /* =================================
               DEPOSIT
            ================================= */

            const deposit =
                target.closest(
                    ".deposit-btn"
                );


            if (deposit) {

                event.preventDefault();

                event.stopPropagation();

                console.log(
                    "Deposit clicked"
                );

                openSupportChat();

                return;

            }


            /* =================================
               SUPPORT
            ================================= */

            const support =
                target.closest(
                    ".support-btn"
                );


            if (support) {

                event.preventDefault();

                event.stopPropagation();

                console.log(
                    "Support clicked"
                );

                openSupportChat();

                return;

            }


            /* =================================
               TRANSFER
            ================================= */

            const transfer =
                target.closest(
                    ".transfer-btn"
                );


            if (transfer) {

                event.preventDefault();

                event.stopPropagation();

                console.log(
                    "Transfer clicked"
                );

                window.location.href =
                    "transfer.html";

                return;

            }

        }
    );


    /* ======================================
       REFRESH BUTTON
    ====================================== */

    const refreshButton =
        document.querySelector(
            ".fa-rotate-right"
        );


    if (refreshButton) {

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


                        /*
                           If balance eye is currently
                           visible, refresh the displayed
                           balance as well.
                        */

                        if (
                            balanceVisible &&
                            balanceElement
                        ) {

                            showBalance();

                        }

                    },
                    650
                );

            }
        );

    }


    /* ======================================
       FINAL READY MESSAGE
    ====================================== */

    console.log(
        "CptMarkets Dashboard Ready"
    );

});
