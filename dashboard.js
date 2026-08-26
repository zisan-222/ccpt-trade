/* ==========================================
   CPTMARKETS DASHBOARD
   dashboard.js - Updated for withdraw.html
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

    }


    /* ======================================
       NAVIGATION TO WITHDRAW.HTML (Redirect Function)
    ====================================== */

    function goToWithdraw(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        window.location.href = "withdraw.html";
    }


    /* ======================================
       MENU ITEMS (Support, Withdraw, Loan)
    ====================================== */

    const menuItems =
        document.querySelectorAll(
            ".menu-grid .menu-item"
        );


    menuItems.forEach(
        function (item) {

            const label =
                item.querySelector("span");


            if (!label) {
                return;
            }


            const text =
                label.textContent
                    .trim()
                    .toLowerCase();


            /* Support */
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


            /* Withdraw (Menu Item) -> withdraw.html */
            if (text === "withdraw") {

                item.style.cursor =
                    "pointer";

                item.addEventListener("click", goToWithdraw);

            }


            /* Loan */
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
       DEPOSIT BUTTON -> deposit.html
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

                window.location.href = "deposit.html";

            }
        );

    }


    /* ======================================
       WITHDRAW BUTTON (Asset Card) -> withdraw.html
    ====================================== */

    const withdrawButton =
        document.querySelector(
            ".withdraw-btn"
        );


    if (withdrawButton) {

        withdrawButton.style.cursor = "pointer";
        withdrawButton.addEventListener("click", goToWithdraw);

    }


    /* ======================================
       TRANSFER BUTTON
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

    console.log("CptMarkets Dashboard Ready - Withdraw Linked");

});
