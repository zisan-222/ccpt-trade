/* ==========================================
   CPTMARKETS DASHBOARD
   dashboard.js - BUTTON FIX
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


        /* Wait for Tawk */

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


    /* ======================================
       BALANCE EYE
    ====================================== */

    let balanceVisible = true;


    document.addEventListener(
        "click",
        function (event) {

            const eye =
                event.target.closest(
                    ".asset-header i, #assetEye"
                );


            if (!eye) {
                return;
            }


            const balanceElement =
                document.getElementById("balance");


            if (!balanceElement) {
                return;
            }

         /* ======================================
   BALANCE HIDE / SHOW
====================================== */

if (balanceVisible) {

    /* Hide balance */
    balanceElement.textContent = "••••••";

    /* Keep Font Awesome icon visible */
    eye.className = "fa-solid fa-eye-slash";

    balanceVisible = false;

    console.log("Balance hidden");

} else {

    /* Show balance */
    let currentBalance = 0;

    if (typeof getBalance === "function") {
        currentBalance = getBalance();
    }

    balanceElement.textContent =
        typeof formatUSD === "function"
            ? formatUSD(currentBalance)
            : "$" + Number(currentBalance).toFixed(2);

    /* Change back to eye icon */
    eye.className = "fa-solid fa-eye";

    balanceVisible = true;

    console.log("Balance shown");
}  


            
    /* ======================================
       WITHDRAW INTERFACE
    ====================================== */

    function openWithdrawInterface() {

        console.log(
            "Withdraw interface opening"
        );


        /* Remove old interface */

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
           CREATE PAGE
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

        document
            .getElementById(
                "cptWithdrawBack"
            )
            .addEventListener(
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


        /* ==================================
           SUBMIT WITHDRAW
        ================================== */

        document
            .getElementById(
                "cptSubmitWithdrawal"
            )
            .addEventListener(
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


                    if (!address) {

                        message.style.display =
                            "block";

                        message.textContent =
                            "Please enter your receiving address / account.";

                        return;

                    }


                    let currentBalance = 0;


                    if (
                        typeof getBalance ===
                        "function"
                    ) {

                        currentBalance =
                            Number(
                                getBalance()
                            );

                    }


                    if (
                        amount >
                        currentBalance
                    ) {

                        message.style.display =
                            "block";

                        message.innerHTML =
                            "Insufficient account balance.";

                        return;

                    }


                    message.style.display =
                        "block";


                    message.innerHTML =
                        "Please contact Customer Service to complete your withdrawal.";


                    setTimeout(
                        function () {

                            openSupportChat();

                        },
                        500
                    );

                }
            );

    }


    /* ======================================
       UNIVERSAL BUTTON CLICK HANDLER
       THIS FIXES THE MARKED BUTTONS
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
                    "0.6s";


                refreshButton.style.transform =
                    "rotate(360deg)";


                setTimeout(
                    function () {

                        refreshButton.style.transition =
                            "none";


                        refreshButton.style.transform =
                            "rotate(0deg)";


                        if (
                            typeof refreshBalanceUI ===
                            "function"
                        ) {

                            refreshBalanceUI();

                        }

                    },
                    650
                );

            }
        );

    }


    console.log(
        "CptMarkets Dashboard Ready"
    );

});
