/* ==========================================
   CPTMARKETS
   TRANSFER.JS
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

    const submitButton =
        document.getElementById("submitTransfer");

    const switchButton =
        document.getElementById("switchButton");

    const accountsArea =
        document.getElementById("accountsArea");

    const transferDirection =
        document.getElementById("transferDirection");

    const amountBox =
        document.getElementById("amountBox");


    /* ==========================================
       SUPPORT MODAL
    ========================================== */

    const supportOverlay =
        document.getElementById("supportOverlay");

    const supportClose =
        document.getElementById("supportClose");

    const supportButton =
        document.getElementById("supportButton");


    /* ==========================================
       ACCOUNT STATE
    ========================================== */

    let isReversed = false;


    /* ==========================================
       GET BALANCE
    ========================================== */

    function updateTransferBalance() {

        if (
            typeof getBalance !== "function"
        ) {

            console.error(
                "balance.js is not connected."
            );

            if (availableBalance) {
                availableBalance.textContent =
                    "$0.00";
            }

            return;
        }


        const balance = Number(
            getBalance()
        );


        const safeBalance =
            Number.isFinite(balance)
                ? balance
                : 0;


        if (availableBalance) {

            availableBalance.textContent =
                "$" +
                safeBalance.toFixed(2);

        }

    }


    /* ==========================================
       INITIAL BALANCE
    ========================================== */

    updateTransferBalance();


    /* ==========================================
       SWITCH ACCOUNT UI
    ========================================== */

    function updateDirection() {

        if (!transferDirection) {
            return;
        }


        if (!isReversed) {

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

        } else {

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

        }

    }


    /* ==========================================
       SWAP ACCOUNT POSITIONS
    ========================================== */

    function swapAccounts() {

        if (
            !accountsArea ||
            !switchButton
        ) {
            return;
        }


        isReversed = !isReversed;


        /*
         * Add animation class
         */

        accountsArea.classList.remove(
            "is-swapping"
        );

        switchButton.classList.remove(
            "is-switching"
        );


        /*
         * Force browser reflow
         * so animation can run again.
         */

        void accountsArea.offsetWidth;
        void switchButton.offsetWidth;


        accountsArea.classList.add(
            "is-swapping"
        );

        switchButton.classList.add(
            "is-switching"
        );


        /*
         * Find account blocks
         */

        const fundingSlot =
            accountsArea.querySelector(
                ".funding-slot"
            );

        const tradingSlot =
            accountsArea.querySelector(
                ".trading-slot"
            );


        if (
            !fundingSlot ||
            !tradingSlot
        ) {
            return;
        }


        /*
         * Actually change their positions
         */

        if (isReversed) {

            accountsArea.insertBefore(
                tradingSlot,
                fundingSlot
            );

        } else {

            accountsArea.insertBefore(
                fundingSlot,
                tradingSlot
            );

        }


        /*
         * Update labels
         */

        updateDirection();


        /*
         * Remove animation classes
         */

        setTimeout(function () {

            accountsArea.classList.remove(
                "is-swapping"
            );

            switchButton.classList.remove(
                "is-switching"
            );

        }, 550);

    }


    /* ==========================================
       SWITCH BUTTON
    ========================================== */

    if (switchButton) {

        switchButton.addEventListener(
            "click",
            swapAccounts
        );

    }


    /* ==========================================
       AMOUNT INPUT
    ========================================== */

    if (amountInput) {

        amountInput.addEventListener(
            "input",
            function () {

                let value =
                    amountInput.value;


                /*
                 * Prevent negative value
                 */

                if (
                    value !== "" &&
                    Number(value) < 0
                ) {

                    amountInput.value = "";

                }


                /*
                 * Keep maximum 2 decimal places
                 */

                if (
                    value.includes(".")
                ) {

                    const parts =
                        value.split(".");

                    if (
                        parts[1] &&
                        parts[1].length > 2
                    ) {

                        amountInput.value =
                            parts[0] +
                            "." +
                            parts[1].substring(
                                0,
                                2
                            );

                    }

                }

            }
        );

    }


    /* ==========================================
       OPEN SUPPORT MODAL
    ========================================== */

    function openSupportModal() {

        if (!supportOverlay) {
            return;
        }


        supportOverlay.classList.add(
            "active"
        );


        supportOverlay.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
         * Prevent background scrolling
         */

        document.body.style.overflow =
            "hidden";


        /*
         * Focus close button
         */

        setTimeout(function () {

            if (supportClose) {
                supportClose.focus();
            }

        }, 150);

    }


    /* ==========================================
       CLOSE SUPPORT MODAL
    ========================================== */

    function closeSupportModal() {

        if (!supportOverlay) {
            return;
        }


        supportOverlay.classList.remove(
            "active"
        );


        supportOverlay.setAttribute(
            "aria-hidden",
            "true"
        );


        /*
         * Restore scrolling
         */

        document.body.style.overflow =
            "";

    }


    /* ==========================================
       CLOSE BUTTON
    ========================================== */

    if (supportClose) {

        supportClose.addEventListener(
            "click",
            closeSupportModal
        );

    }


    /* ==========================================
       CLICK OUTSIDE MODAL
    ========================================== */

    if (supportOverlay) {

        supportOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    supportOverlay
                ) {

                    closeSupportModal();

                }

            }
        );

    }


    /* ==========================================
       ESCAPE KEY
    ========================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                supportOverlay &&
                supportOverlay.classList.contains(
                    "active"
                )
            ) {

                closeSupportModal();

            }

        }
    );


    /* ==========================================
       SUPPORT BUTTON
    ========================================== */

    if (supportButton) {

        supportButton.addEventListener(
            "click",
            function () {

                /*
                 * If you later connect
                 * customer service / chat,
                 * put that action here.
                 */

                closeSupportModal();

            }
        );

    }


    /* ==========================================
       CONFIRM TRANSFER
    ========================================== */

    if (submitButton) {

        submitButton.addEventListener(
            "click",
            function () {

                /*
                 * Read amount
                 */

                const amount =
                    Number(
                        amountInput
                            ? amountInput.value
                            : 0
                    );


                /* ==================================
                   INVALID AMOUNT
                ================================== */

                if (
                    !Number.isFinite(amount) ||
                    amount <= 0
                ) {

                    if (amountBox) {

                        amountBox.classList.remove(
                            "input-error"
                        );

                        void amountBox.offsetWidth;

                        amountBox.classList.add(
                            "input-error"
                        );

                    }


                    if (amountInput) {
                        amountInput.focus();
                    }


                    return;

                }


                /* ==================================
                   GET CURRENT BALANCE
                ================================== */

                if (
                    typeof getBalance !==
                    "function"
                ) {

                    console.error(
                        "getBalance() not found."
                    );

                    openSupportModal();

                    return;

                }


                const balance =
                    Number(
                        getBalance()
                    );


                /* ==================================
                   INSUFFICIENT BALANCE
                ================================== */

                if (
                    !Number.isFinite(balance) ||
                    balance < amount
                ) {

                    if (amountBox) {

                        amountBox.classList.remove(
                            "input-error"
                        );

                        void amountBox.offsetWidth;

                        amountBox.classList.add(
                            "input-error"
                        );

                    }


                    /*
                     * Show a small message
                     * instead of browser alert.
                     */

                    showTransferMessage(
                        "Insufficient balance."
                    );


                    return;

                }


                /* ==================================
                   VALID BALANCE
                ================================== */

                /*
                 * Your existing system does NOT
                 * automatically transfer the money.
                 *
                 * Instead we show the professional
                 * Customer Service modal.
                 */

                openSupportModal();

            }
        );

    }


    /* ==========================================
       SMALL TRANSFER MESSAGE
    ========================================== */

    function showTransferMessage(
        message
    ) {

        const messageBox =
            document.getElementById(
                "transferMessage"
            );


        if (!messageBox) {
            return;
        }


        messageBox.textContent =
            message;


        messageBox.style.display =
            "block";


        /*
         * Hide automatically
         */

        clearTimeout(
            showTransferMessage.timer
        );


        showTransferMessage.timer =
            setTimeout(function () {

                messageBox.style.display =
                    "none";

            }, 2800);

    }


    /* ==========================================
       INPUT ERROR ANIMATION
    ========================================== */

    const style =
        document.createElement("style");


    style.textContent = `
        .input-error {
            animation: transferInputError 0.35s ease;
            border-color: rgba(255, 70, 70, 0.65) !important;
            box-shadow:
                0 0 0 3px rgba(255, 70, 70, 0.05),
                0 0 18px rgba(255, 70, 70, 0.08) !important;
        }

        @keyframes transferInputError {

            0% {
                transform: translateX(0);
            }

            25% {
                transform: translateX(-4px);
            }

            50% {
                transform: translateX(4px);
            }

            75% {
                transform: translateX(-3px);
            }

            100% {
                transform: translateX(0);
            }

        }
    `;


    document.head.appendChild(style);


    /* ==========================================
       INITIAL DIRECTION
    ========================================== */

    updateDirection();

});
