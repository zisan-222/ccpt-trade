/* ==========================================
   CPTMARKETS DASHBOARD
   dashboard.js - FIREBASE BALANCE FIX
========================================== */

import { auth, db } from "./firebase/firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* ==========================================
   GLOBAL BALANCE
========================================== */

let currentBalance = 0;
let balanceLoaded = false;


/* ==========================================
   FORMAT USD
========================================== */

window.formatUSD = function (amount) {

    return "$" + Number(amount || 0).toFixed(2);

};


/* ==========================================
   GET CURRENT BALANCE
========================================== */

window.getBalance = function () {

    return Number(currentBalance || 0);

};


/* ==========================================
   UPDATE DASHBOARD BALANCE UI
========================================== */

window.refreshBalanceUI = async function () {

    try {

        const firebaseUser = auth.currentUser;


        if (!firebaseUser) {

            currentBalance = 0;

            updateBalanceElements();

            return;

        }


        const userRef =
            doc(
                db,
                "users",
                firebaseUser.uid
            );


        const userSnap =
            await getDoc(userRef);


        if (!userSnap.exists()) {

            console.error(
                "Dashboard: User document not found."
            );

            currentBalance = 0;

            updateBalanceElements();

            return;

        }


        const userData =
            userSnap.data();


        /* ==================================
           FIRESTORE BALANCE
        ================================== */

        currentBalance =
            Number(
                userData.balance || 0
            );


        balanceLoaded = true;


        /* ==================================
           UPDATE ALL BALANCE ELEMENTS
        ================================== */

        updateBalanceElements();


        /* ==================================
           UPDATE LOCAL STORAGE
           Only as cache
        ================================== */

        try {

            const oldSession =
                JSON.parse(
                    localStorage.getItem(
                        "currentUser"
                    ) || "{}"
                );


            localStorage.setItem(
                "currentUser",
                JSON.stringify({

                    ...oldSession,

                    uid:
                        firebaseUser.uid,

                    userId:
                        userData.userId ||
                        oldSession.userId ||
                        "",

                    username:
                        userData.username ||
                        oldSession.username ||
                        "User",

                    email:
                        userData.email ||
                        firebaseUser.email ||
                        "",

                    balance:
                        currentBalance

                })
            );

        } catch (storageError) {

            console.warn(
                "Local storage update skipped:",
                storageError
            );

        }


        console.log(
            "Dashboard Firestore Balance:",
            currentBalance
        );


    } catch (error) {

        console.error(
            "Failed to load dashboard balance:",
            error
        );

    }

};


/* ==========================================
   UPDATE BALANCE ELEMENTS
========================================== */

function updateBalanceElements() {

    const formattedBalance =
        formatUSD(
            currentBalance
        );


    /* ==================================
       MAIN BALANCE
       id="balance"
    ================================== */

    const balanceElement =
        document.getElementById(
            "balance"
        );


    if (
        balanceElement &&
        balanceVisible
    ) {

        balanceElement.textContent =
            formattedBalance;

    }


    /* ==================================
       OTHER COMMON BALANCE IDs
    ================================== */

    const balanceElements =
        document.querySelectorAll(
            "#balanceAmount, " +
            "#totalBalance, " +
            ".balance-value, " +
            ".user-balance, " +
            ".total-balance"
        );


    balanceElements.forEach(
        function (element) {

            if (
                element.id === "balance"
            ) {
                return;
            }


            if (
                element.dataset.balanceUpdated ===
                "true"
            ) {
                return;
            }


            element.textContent =
                formattedBalance;

        }
    );


    /* ==================================
       EQUITY
    ================================== */

    const equityElements =
        document.querySelectorAll(
            "#equity, .equity-value"
        );


    equityElements.forEach(
        function (element) {

            element.textContent =
                formattedBalance;

        }
    );

}


/* ==========================================
   BALANCE EYE STATE
========================================== */

let balanceVisible = true;


/* ==========================================
   FIREBASE AUTH
========================================== */

onAuthStateChanged(
    auth,
    async function (firebaseUser) {

        if (!firebaseUser) {

            currentBalance = 0;

            balanceLoaded = false;

            updateBalanceElements();

            console.log(
                "Dashboard: No authenticated user."
            );

            return;

        }


        console.log(
            "Dashboard user:",
            firebaseUser.uid
        );


        /* ==================================
           LOAD REAL FIRESTORE BALANCE
        ================================== */

        await refreshBalanceUI();

    }
);


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ======================================
           TAWK.TO
        ====================================== */

        window.Tawk_API =
            window.Tawk_API || {};

        window.Tawk_LoadStart =
            new Date();


        let tawkLoaded = false;


        window.Tawk_API.onLoad =
            function () {

                tawkLoaded = true;


                if (
                    typeof window.Tawk_API.hideWidget ===
                    "function"
                ) {

                    window.Tawk_API.hideWidget();

                }


                console.log(
                    "Tawk.to loaded"
                );

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

                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.async = true;


            script.src =
                "https://embed.tawk.to/6a71003c2d507b1d4a9fad4c/1jv4mhrhb";


            script.charset =
                "UTF-8";


            script.setAttribute(
                "crossorigin",
                "*"
            );


            document.body.appendChild(
                script
            );

        }


        loadTawk();


        /* ======================================
           OPEN CUSTOMER SERVICE
        ====================================== */

        window.openSupportChat =
            function () {


                if (
                    window.Tawk_API &&
                    typeof window.Tawk_API.hideWidget ===
                    "function"
                ) {

                    window.Tawk_API.hideWidget();

                }


                if (
                    window.Tawk_API &&
                    typeof window.Tawk_API.showWidget ===
                    "function"
                ) {


                    window.Tawk_API.showWidget();


                    setTimeout(
                        function () {

                            if (
                                typeof window.Tawk_API.maximize ===
                                "function"
                            ) {

                                window.Tawk_API.maximize();

                            }

                        },
                        300
                    );


                    return;

                }


                let attempts = 0;


                const waitTawk =
                    setInterval(
                        function () {

                            attempts++;


                            if (
                                window.Tawk_API &&
                                typeof window.Tawk_API.showWidget ===
                                "function"
                            ) {

                                clearInterval(
                                    waitTawk
                                );


                                window.Tawk_API.showWidget();


                                setTimeout(
                                    function () {

                                        if (
                                            typeof window.Tawk_API.maximize ===
                                            "function"
                                        ) {

                                            window.Tawk_API.maximize();

                                        }

                                    },
                                    300
                                );

                            }


                            if (
                                attempts >= 30
                            ) {

                                clearInterval(
                                    waitTawk
                                );


                                alert(
                                    "Customer Service is loading. Please try again."
                                );

                            }

                        },
                        500
                    );

            };


        /* ======================================
           HIDE TAWK FLOATING ICON
        ====================================== */

        const hideTawk =
            setInterval(
                function () {

                    if (
                        window.Tawk_API &&
                        typeof window.Tawk_API.hideWidget ===
                        "function"
                    ) {

                        window.Tawk_API.hideWidget();

                        clearInterval(
                            hideTawk
                        );

                    }

                },
                500
            );


        /* ======================================
           BALANCE EYE
        ====================================== */

        const balanceElement =
            document.getElementById(
                "balance"
            );


        const eyeButton =
            document.querySelector(
                ".asset-card .fa-eye, #assetEye, .fa-eye"
            );


        if (
            balanceElement &&
            eyeButton
        ) {


            eyeButton.addEventListener(
                "click",
                function () {


                    if (
                        balanceVisible
                    ) {

                        balanceElement.textContent =
                            "••••••";


                        eyeButton.classList.remove(
                            "fa-eye"
                        );


                        eyeButton.classList.add(
                            "fa-eye-slash"
                        );


                        balanceVisible =
                            false;

                    }

                    else {

                        balanceElement.textContent =
                            formatUSD(
                                getBalance()
                            );


                        eyeButton.classList.remove(
                            "fa-eye-slash"
                        );


                        eyeButton.classList.add(
                            "fa-eye"
                        );


                        balanceVisible =
                            true;

                    }

                }
            );

        }


        /* ======================================
           SUPPORT BUTTON
        ====================================== */

        const supportButtons =
            document.querySelectorAll(
                ".support-btn"
            );


        supportButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (e) {

                        e.preventDefault();

                        openSupportChat();

                    }
                );

            }
        );


        /* ======================================
           DEPOSIT BUTTON
        ====================================== */

        const depositButtons =
            document.querySelectorAll(
                ".deposit-btn"
            );


        depositButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (e) {

                        e.preventDefault();

                        openSupportChat();

                    }
                );

            }
        );


        /* ======================================
           LOAN BUTTON
        ====================================== */

        const loanButtons =
            document.querySelectorAll(
                ".loan-btn"
            );


        loanButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (e) {

                        e.preventDefault();

                        openSupportChat();

                    }
                );

            }
        );


        /* ======================================
           WITHDRAW INTERFACE
        ====================================== */

        function openWithdrawInterface() {


            const oldPage =
                document.getElementById(
                    "cptWithdrawPage"
                );


            if (oldPage) {

                oldPage.remove();

            }


            const withdrawPage =
                document.createElement(
                    "div"
                );


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
               STYLE
            ================================== */

            const style =
                document.createElement(
                    "style"
                );


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

                    height: 78px;

                    margin-bottom: 28px;

                    padding: 0 24px;

                    box-sizing: border-box;

                    border-radius: 24px;

                    border:
                        1px solid
                        rgba(130,160,210,.28);

                    outline: none;

                    background: #070f22;

                    color: white;

                    font-size: 22px;
                }


                .cpt-withdraw-card input::placeholder {

                    color: #71809d;
                }


                .cpt-submit-withdraw {

                    width: 100%;

                    height: 78px;

                    border: none;

                    border-radius: 25px;

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
                }


                .cpt-withdraw-message {

                    display: none;

                    margin-top: 25px;

                    padding: 20px;

                    border-radius: 20px;

                    background: #182337;

                    text-align: center;

                    font-size: 20px;

                    line-height: 1.5;
                }

            `;


            document.head.appendChild(
                style
            );


            /* ==================================
               BACK
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
               SUBMIT WITHDRAWAL
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
                                document
                                    .getElementById(
                                        "cptWithdrawAmount"
                                    )
                                    .value
                            );


                        const address =
                            document
                                .getElementById(
                                    "cptReceivingAddress"
                                )
                                .value
                                .trim();


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


                            message.innerHTML =
                                "Please enter a valid withdrawal amount.";


                            return;

                        }


                        if (!address) {

                            message.style.display =
                                "block";


                            message.innerHTML =
                                "Please enter your receiving address / account.";


                            return;

                        }


                        const currentBalance =
                            Number(
                                getBalance()
                            );


                        if (
                            amount >
                            currentBalance
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


                        message.style.display =
                            "block";


                        message.innerHTML = `
                            Please contact Customer Service
                            to complete your withdrawal.
                        `;


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
           WITHDRAW BUTTONS
        ====================================== */

        const withdrawButtons =
            document.querySelectorAll(
                ".withdraw-btn"
            );


        withdrawButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (e) {

                        e.preventDefault();

                        openWithdrawInterface();

                    }
                );

            }
        );


        /* ======================================
           TRANSFER
        ====================================== */

        const transferButtons =
            document.querySelectorAll(
                ".transfer-btn"
            );


        transferButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (e) {

                        e.preventDefault();

                    }
                );

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
                async function () {


                    refreshButton.style.transition =
                        "0.6s";


                    refreshButton.style.transform =
                        "rotate(360deg)";


                    /* GET FRESH FIRESTORE BALANCE */

                    await refreshBalanceUI();


                    setTimeout(
                        function () {

                            refreshButton.style.transition =
                                "none";

                            refreshButton.style.transform =
                                "rotate(0deg)";

                        },
                        650
                    );

                }
            );

        }


        console.log(
            "CptMarkets Dashboard Ready"
        );

    }
);
