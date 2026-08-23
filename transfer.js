/* ==========================================
   CPTMARKETS
   transfer.js
   Premium Transfer System
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       ELEMENTS
    ========================================== */

    const amountInput =
        document.getElementById("transferAmount");

    const availableBalance =
        document.getElementById("availableBalance");

    const confirmButton =
        document.getElementById("submitTransfer");

    const switchButton =
        document.getElementById("switchButton");

    const accountsArea =
        document.getElementById("accountsArea");

    const fundingSlot =
        document.querySelector(".funding-slot");

    const tradingSlot =
        document.querySelector(".trading-slot");

    const transferDirection =
        document.getElementById("transferDirection");

    const transferMessage =
        document.getElementById("transferMessage");


    /* ==========================================
       STATE
    ========================================== */

    let isReversed = false;


    /* ==========================================
       UPDATE BALANCE
    ========================================== */

    function updateTransferBalance() {

        if (typeof getBalance !== "function") {

            console.error(
                "balance.js is not connected or getBalance() is missing."
            );

            if (availableBalance) {
                availableBalance.textContent = "$0.00";
            }

            return;
        }


        try {

            const balance = Number(getBalance());


            if (!isNaN(balance) && availableBalance) {

                availableBalance.textContent =
                    "$" + balance.toFixed(2);

            }

        } catch (error) {

            console.error(
                "Unable to read balance:",
                error
            );

        }

    }


    /* ==========================================
       UPDATE DIRECTION TEXT
    ========================================== */

    function updateDirection() {

        if (!transferDirection) {
            return;
        }


        if (isReversed) {

            transferDirection.innerHTML = `
                <span class="direction-dot"></span>

                <span>
                    Trading Account
                </span>

                <span class="direction-arrow">
                    →
                </span>

                <span>
                    Funding Account
                </span>
            `;

        } else {

            transferDirection.innerHTML = `
                <span class="direction-dot"></span>

                <span>
                    Funding Account
                </span>

                <span class="direction-arrow">
                    →
                </span>

                <span>
                    Trading Account
                </span>
            `;

        }

    }


    /* ==========================================
       SWITCH ACCOUNT POSITION
    ========================================== */

    function switchAccounts() {

        if (!accountsArea) {
            return;
        }


        /* Button lighting */

        if (switchButton) {

            switchButton.classList.remove(
                "is-switching"
            );

            /*
             * Force browser reflow so the animation
             * can run every time the button is pressed.
             */

            void switchButton.offsetWidth;

            switchButton.classList.add(
                "is-switching"
            );

        }


        /* Account animation */

        accountsArea.classList.remove(
            "is-swapping"
        );

        void accountsArea.offsetWidth;

        accountsArea.classList.add(
            "is-swapping"
        );


        /*
         * Change actual visual order.
         */

        if (!isReversed) {

            /*
             * Trading goes UP
             * Funding goes DOWN
             */

            tradingSlot.style.order = "1";
            switchButton.parentElement.style.order = "2";
            fundingSlot.style.order = "3";

            isReversed = true;

        } else {

            /*
             * Funding goes UP
             * Trading goes DOWN
             */

            fundingSlot.style.order = "1";
            switchButton.parentElement.style.order = "2";
            tradingSlot.style.order = "3";

            isReversed = false;

        }


        updateDirection();


        /* Remove animation classes */

        setTimeout(function () {

            accountsArea.classList.remove(
                "is-swapping"
            );

        }, 550);


        if (switchButton) {

            setTimeout(function () {

                switchButton.classList.remove(
                    "is-switching"
                );

            }, 700);

        }

    }


    /* ==========================================
       SWITCH BUTTON
    ========================================== */

    if (switchButton) {

        switchButton.addEventListener(
            "click",
            switchAccounts
        );

    }


    /* ==========================================
       AMOUNT INPUT
    ========================================== */

    if (amountInput) {

        amountInput.addEventListener(
            "input",
            function () {

                /*
                 * Prevent negative numbers.
                 */

                if (Number(this.value) < 0) {
                    this.value = "";
                }

            }
        );

    }


    /* ==========================================
       CONFIRM TRANSFER
    ========================================== */

    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            function () {

                const amount =
                    Number(amountInput?.value);


                /* Empty / invalid */

                if (
                    isNaN(amount) ||
                    amount <= 0
                ) {

                    alert(
                        "Please enter a valid transfer amount."
                    );

                    return;
                }


                /* Get current balance */

                if (typeof getBalance !== "function") {

                    alert(
                        "Balance system is not available."
                    );

                    return;
                }


                const balance =
                    Number(getBalance());


                /* Insufficient balance */

                if (balance < amount) {

                    alert(
                        "Insufficient Balance"
                    );

                    return;
                }


                /*
                 * Keep your current transfer behavior.
                 *
                 * No automatic/demo balance is added.
                 */

                alert(
                    "Contact Your Customer Service"
                );

            }
        );

    }


    /* ==========================================
       INITIAL STATE
    ========================================== */

    if (fundingSlot) {
        fundingSlot.style.order = "1";
    }

    if (switchButton?.parentElement) {
        switchButton.parentElement.style.order = "2";
    }

    if (tradingSlot) {
        tradingSlot.style.order = "3";
    }


    updateTransferBalance();

    updateDirection();


    /* ==========================================
       REFRESH BALANCE WHEN PAGE RETURNS
    ========================================== */

    window.addEventListener(
        "focus",
        updateTransferBalance
    );

});
