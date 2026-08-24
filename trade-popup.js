/* =========================================================
   CPT MARKETS
   PROFESSIONAL TRADE POPUP SYSTEM
   trade-popup.js
   FINAL REPLACEMENT
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       POPUP HTML
       ===================================================== */

    const popupHTML = `

        <!-- =================================================
             TRADE CONFIRMATION POPUP
             ================================================= -->

        <div
            id="cptConfirmPopup"
            class="cpt-popup-overlay"
            aria-hidden="true"
        >

            <div
                class="cpt-popup"
                role="dialog"
                aria-modal="true"
            >

                <div class="cpt-popup-icon">
                    ⇅
                </div>

                <div class="cpt-popup-brand">
                    CPT Markets
                </div>

                <h2
                    id="cptConfirmTitle"
                    class="cpt-popup-title"
                >
                    Confirm Trade
                </h2>

                <p
                    id="cptConfirmText"
                    class="cpt-popup-subtitle"
                >
                    Are you sure you want to open this trade?
                </p>


                <div class="cpt-popup-summary">

                    <div class="cpt-popup-row">

                        <span class="cpt-popup-label">
                            Position
                        </span>

                        <span
                            id="cptConfirmSide"
                            class="cpt-popup-value"
                        >
                            LONG
                        </span>

                    </div>


                    <div class="cpt-popup-row">

                        <span class="cpt-popup-label">
                            Market Price
                        </span>

                        <span
                            id="cptConfirmPrice"
                            class="cpt-popup-value"
                        >
                            4269.29
                        </span>

                    </div>


                    <div class="cpt-popup-row">

                        <span class="cpt-popup-label">
                            Leverage
                        </span>

                        <span
                            id="cptConfirmLeverage"
                            class="cpt-popup-value"
                        >
                            100x
                        </span>

                    </div>

                </div>


                <div class="cpt-popup-warning">

                    <span class="cpt-popup-warning-icon">
                        !
                    </span>

                    <span>
                        Trading involves risk. Market prices
                        can move in either direction and may
                        result in profit or loss.
                    </span>

                </div>


                <div class="cpt-popup-actions">

                    <button
                        id="cptConfirmCancel"
                        class="cpt-popup-btn cpt-popup-cancel"
                        type="button"
                    >
                        Cancel
                    </button>


                    <button
                        id="cptConfirmContinue"
                        class="cpt-popup-btn cpt-popup-confirm"
                        type="button"
                    >
                        Continue
                    </button>

                </div>

            </div>

        </div>


        <!-- =================================================
             TRADE OPENED SUCCESS POPUP
             ================================================= -->

        <div
            id="cptOpenSuccessPopup"
            class="cpt-popup-overlay"
            aria-hidden="true"
        >

            <div
                class="cpt-popup cpt-popup-success"
                role="dialog"
                aria-modal="true"
            >

                <div class="cpt-popup-icon">
                    ✓
                </div>

                <div class="cpt-popup-brand">
                    CPT Markets
                </div>

                <h2 class="cpt-popup-title">
                    Trade Opened Successfully
                </h2>

                <p class="cpt-popup-subtitle cpt-popup-success-message">
                    Your position is now active in the market.
                </p>


                <div class="cpt-popup-summary">

                    <div class="cpt-popup-row">

                        <span class="cpt-popup-label">
                            Position
                        </span>

                        <span
                            id="cptSuccessSide"
                            class="cpt-popup-value"
                        >
                            LONG
                        </span>

                    </div>


                    <div class="cpt-popup-row">

                        <span class="cpt-popup-label">
                            Entry Price
                        </span>

                        <span
                            id="cptSuccessEntry"
                            class="cpt-popup-value"
                        >
                            4269.29
                        </span>

                    </div>


                    <div class="cpt-popup-row">

                        <span class="cpt-popup-label">
                            Amount
                        </span>

                        <span
                            id="cptSuccessAmount"
                            class="cpt-popup-value"
                        >
                            $100.00
                        </span>

                    </div>


                    <div class="cpt-popup-row">

                        <span class="cpt-popup-label">
                            Leverage
                        </span>

                        <span
                            id="cptSuccessLeverage"
                            class="cpt-popup-value"
                        >
                            100x
                        </span>

                    </div>

                </div>


                <div class="cpt-popup-actions">

                    <button
                        id="cptOpenSuccessOK"
                        class="cpt-popup-btn cpt-popup-confirm cpt-popup-single-btn"
                        type="button"
                    >
                        Continue
                    </button>

                </div>

            </div>

        </div>


        <!-- =================================================
             TRADE CLOSED SUCCESS POPUP
             ================================================= -->

        <div
            id="cptCloseSuccessPopup"
            class="cpt-popup-overlay"
            aria-hidden="true"
        >

            <div
                class="cpt-popup cpt-popup-success"
                role="dialog"
                aria-modal="true"
            >

                <div class="cpt-popup-icon">
                    ✓
                </div>

                <div class="cpt-popup-brand">
                    CPT Markets
                </div>

                <h2 class="cpt-popup-title">
                    Trade Closed Successfully
                </h2>

                <p class="cpt-popup-subtitle">
                    Your position has been successfully closed.
                </p>


                <div class="cpt-popup-summary">

                    <div class="cpt-popup-row">

                        <span class="cpt-popup-label">
                            Position
                        </span>

                        <span
                            id="cptCloseSide"
                            class="cpt-popup-value"
                        >
                            LONG
                        </span>

                    </div>


                    <div class="cpt-popup-row">

                        <span class="cpt-popup-label">
                            Entry Price
                        </span>

                        <span
                            id="cptCloseEntry"
                            class="cpt-popup-value"
                        >
                            4269.29
                        </span>

                    </div>


                    <div class="cpt-popup-row">

                        <span class="cpt-popup-label">
                            Close Price
                        </span>

                        <span
                            id="cptClosePrice"
                            class="cpt-popup-value"
                        >
                            4271.20
                        </span>

                    </div>


                    <div class="cpt-popup-row">

                        <span class="cpt-popup-label">
                            Total Profit / Loss
                        </span>

                        <span
                            id="cptClosePL"
                            class="cpt-popup-value"
                        >
                            +$1.91
                        </span>

                    </div>

                </div>


                <div class="cpt-popup-actions">

                    <button
                        id="cptCloseSuccessOK"
                        class="cpt-popup-btn cpt-popup-confirm cpt-popup-single-btn"
                        type="button"
                    >
                        Done
                    </button>

                </div>

            </div>

        </div>

    `;


    /* =====================================================
       STATE
       ===================================================== */

    let confirmCallback = null;

    let successCloseTimer = null;


    /* =====================================================
       GET ELEMENT
       ===================================================== */

    function $(id) {

        return document.getElementById(id);

    }


    /* =====================================================
       CREATE POPUPS
       ===================================================== */

    function createPopups() {

        /*
         * Prevent duplicate popup creation.
         */

        if (
            document.getElementById(
                "cptConfirmPopup"
            )
        ) {

            return;

        }


        if (!document.body) {

            return;

        }


        document.body.insertAdjacentHTML(
            "beforeend",
            popupHTML
        );

    }


    /* =====================================================
       OPEN POPUP
       ===================================================== */

    function openPopup(id) {

        createPopups();


        const popup =
            $(id);


        if (!popup) {

            console.error(
                "CPT popup not found:",
                id
            );

            return;

        }


        /*
         * Close other CPT popups first.
         */

        document
            .querySelectorAll(
                ".cpt-popup-overlay.active"
            )
            .forEach(
                function (item) {

                    if (
                        item.id !== id
                    ) {

                        item.classList.remove(
                            "active"
                        );

                        item.setAttribute(
                            "aria-hidden",
                            "true"
                        );

                    }

                }
            );


        popup.classList.add(
            "active"
        );


        popup.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
         * Lock page scrolling.
         */

        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE POPUP
       ===================================================== */

    function closePopup(id) {

        const popup =
            $(id);


        if (!popup) {

            return;

        }


        popup.classList.remove(
            "active"
        );


        popup.setAttribute(
            "aria-hidden",
            "true"
        );


        /*
         * Only unlock scrolling when
         * no CPT popup remains open.
         */

        const activePopup =
            document.querySelector(
                ".cpt-popup-overlay.active"
            );


        if (!activePopup) {

            document.body.style.overflow =
                "";

        }

    }


    /* =====================================================
       CLOSE ALL POPUPS
       ===================================================== */

    function closeAllPopups() {

        document
            .querySelectorAll(
                ".cpt-popup-overlay.active"
            )
            .forEach(
                function (popup) {

                    popup.classList.remove(
                        "active"
                    );

                    popup.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                }
            );


        document.body.style.overflow =
            "";

    }


    /* =====================================================
       CONFIRMATION POPUP
       ===================================================== */

    window.cptShowTradeConfirmation =
        function (
            side,
            marketPrice,
            leverage,
            callback
        ) {

            createPopups();


            /*
             * Safety check.
             */

            const title =
                $("cptConfirmTitle");

            const text =
                $("cptConfirmText");

            const confirmSide =
                $("cptConfirmSide");

            const confirmPrice =
                $("cptConfirmPrice");

            const confirmLeverage =
                $("cptConfirmLeverage");

            const continueButton =
                $("cptConfirmContinue");

            const cancelButton =
                $("cptConfirmCancel");


            if (
                !title ||
                !text ||
                !confirmSide ||
                !confirmPrice ||
                !confirmLeverage ||
                !continueButton ||
                !cancelButton
            ) {

                console.error(
                    "CPT Markets confirmation popup could not be initialized."
                );

                return;

            }


            /*
             * Store callback.
             */

            confirmCallback =
                typeof callback === "function"
                    ? callback
                    : null;


            /*
             * Fill popup.
             */

            const safeSide =
                String(
                    side || "LONG"
                ).toUpperCase();


            const safePrice =
                Number(
                    marketPrice
                );


            const safeLeverage =
                Number(
                    leverage
                );


            title.innerText =
                "Confirm " +
                safeSide +
                " Trade";


            text.innerText =
                "Are you sure you want to open this " +
                safeSide +
                " position?";


            confirmSide.innerText =
                safeSide;


            confirmPrice.innerText =
                Number.isFinite(
                    safePrice
                )
                    ? safePrice.toFixed(2)
                    : "0.00";


            confirmLeverage.innerText =
                Number.isFinite(
                    safeLeverage
                )
                    ? safeLeverage + "x"
                    : "0x";


            /*
             * Reset buttons.
             */

            continueButton.disabled =
                false;

            cancelButton.disabled =
                false;


            continueButton.style.pointerEvents =
                "auto";

            cancelButton.style.pointerEvents =
                "auto";


            /*
             * Continue button.
             *
             * IMPORTANT:
             * The actual trade is opened only
             * after Continue is pressed.
             */

            continueButton.onclick =
                function (event) {

                    if (event) {

                        event.preventDefault();

                        event.stopPropagation();

                    }


                    if (
                        continueButton.disabled
                    ) {

                        return;

                    }


                    continueButton.disabled =
                        true;


                    continueButton.style.pointerEvents =
                        "none";


                    const callbackToRun =
                        confirmCallback;


                    confirmCallback =
                        null;


                    closePopup(
                        "cptConfirmPopup"
                    );


                    if (
                        typeof callbackToRun ===
                        "function"
                    ) {

                        setTimeout(
                            function () {

                                try {

                                    callbackToRun();

                                } catch (error) {

                                    console.error(
                                        "CPT trade confirmation callback error:",
                                        error
                                    );

                                }

                            },
                            50
                        );

                    }

                };


            /*
             * Cancel button.
             */

            cancelButton.onclick =
                function (event) {

                    if (event) {

                        event.preventDefault();

                        event.stopPropagation();

                    }


                    confirmCallback =
                        null;


                    closePopup(
                        "cptConfirmPopup"
                    );

                };


            /*
             * Show popup.
             */

            openPopup(
                "cptConfirmPopup"
            );

        };


    /* =====================================================
       TRADE OPEN SUCCESS POPUP
       ===================================================== */

    window.cptShowTradeOpened =
        function (
            side,
            entryPrice,
            amount,
            leverage
        ) {

            createPopups();


            const successSide =
                $("cptSuccessSide");

            const successEntry =
                $("cptSuccessEntry");

            const successAmount =
                $("cptSuccessAmount");

            const successLeverage =
                $("cptSuccessLeverage");


            if (
                !successSide ||
                !successEntry ||
                !successAmount ||
                !successLeverage
            ) {

                console.error(
                    "CPT Markets open-success popup could not be initialized."
                );

                return;

            }


            successSide.innerText =
                String(
                    side || "LONG"
                ).toUpperCase();


            const safeEntry =
                Number(
                    entryPrice
                );


            const safeAmount =
                Number(
                    amount
                );


            const safeLeverage =
                Number(
                    leverage
                );


            successEntry.innerText =
                Number.isFinite(
                    safeEntry
                )
                    ? safeEntry.toFixed(2)
                    : "0.00";


            successAmount.innerText =
                "$" +
                (
                    Number.isFinite(
                        safeAmount
                    )
                        ? safeAmount.toFixed(2)
                        : "0.00"
                );


            successLeverage.innerText =
                (
                    Number.isFinite(
                        safeLeverage
                    )
                        ? safeLeverage
                        : 0
                ) +
                "x";


            /*
             * Clear previous timer.
             */

            if (
                successCloseTimer
            ) {

                clearTimeout(
                    successCloseTimer
                );

                successCloseTimer =
                    null;

            }


            openPopup(
                "cptOpenSuccessPopup"
            );


            /*
             * Auto close.
             */

            successCloseTimer =
                setTimeout(
                    function () {

                        closePopup(
                            "cptOpenSuccessPopup"
                        );

                        successCloseTimer =
                            null;

                    },
                    1800
                );

        };


    /* =====================================================
       TRADE CLOSE SUCCESS POPUP
       ===================================================== */

    window.cptShowTradeClosed =
        function (
            side,
            entryPrice,
            closePrice,
            profitLoss
        ) {

            createPopups();


            const closeSide =
                $("cptCloseSide");

            const closeEntry =
                $("cptCloseEntry");

            const closePriceBox =
                $("cptClosePrice");

            const closePL =
                $("cptClosePL");


            if (
                !closeSide ||
                !closeEntry ||
                !closePriceBox ||
                !closePL
            ) {

                console.error(
                    "CPT Markets close-success popup could not be initialized."
                );

                return;

            }


            closeSide.innerText =
                String(
                    side || "LONG"
                ).toUpperCase();


            const safeEntry =
                Number(
                    entryPrice
                );


            const safeClosePrice =
                Number(
                    closePrice
                );


            const safePL =
                Number(
                    profitLoss
                );


            closeEntry.innerText =
                Number.isFinite(
                    safeEntry
                )
                    ? safeEntry.toFixed(2)
                    : "0.00";


            closePriceBox.innerText =
                Number.isFinite(
                    safeClosePrice
                )
                    ? safeClosePrice.toFixed(2)
                    : "0.00";


            const finalPL =
                Number.isFinite(
                    safePL
                )
                    ? safePL
                    : 0;


            closePL.innerText =
                (
                    finalPL >= 0
                        ? "+"
                        : "-"
                ) +
                "$" +
                Math.abs(
                    finalPL
                ).toFixed(2);


            /*
             * Remove old result classes.
             */

            closePL.classList.remove(
                "cpt-result-profit",
                "cpt-result-loss"
            );


            closePL.classList.add(
                finalPL >= 0
                    ? "cpt-result-profit"
                    : "cpt-result-loss"
            );


            openPopup(
                "cptCloseSuccessPopup"
            );

        };


    /* =====================================================
       BUTTON EVENTS
       ===================================================== */

    function setupButtonEvents() {

        const openOK =
            $("cptOpenSuccessOK");

        const closeOK =
            $("cptCloseSuccessOK");


        if (openOK) {

            openOK.onclick =
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    closePopup(
                        "cptOpenSuccessPopup"
                    );

                };

        }


        if (closeOK) {

            closeOK.onclick =
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    closePopup(
                        "cptCloseSuccessPopup"
                    );

                };

        }

    }


    /* =====================================================
       BACKDROP CLICK
       ===================================================== */

    function setupBackdropEvents() {

        document.addEventListener(
            "click",
            function (event) {

                const target =
                    event.target;


                if (
                    !target ||
                    !target.classList ||
                    !target.classList.contains(
                        "cpt-popup-overlay"
                    )
                ) {

                    return;

                }


                /*
                 * Do not close confirmation popup
                 * accidentally by tapping outside.
                 *
                 * This keeps the trade confirmation
                 * professional and deliberate.
                 */

                if (
                    target.id ===
                    "cptConfirmPopup"
                ) {

                    return;

                }


                closePopup(
                    target.id
                );

            }
        );

    }


    /* =====================================================
       ESC KEY
       ===================================================== */

    function setupKeyboardEvents() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !==
                    "Escape"
                ) {

                    return;

                }


                const confirmPopup =
                    $("cptConfirmPopup");


                if (
                    confirmPopup &&
                    confirmPopup.classList.contains(
                        "active"
                    )
                ) {

                    confirmCallback =
                        null;

                    closePopup(
                        "cptConfirmPopup"
                    );

                    return;

                }


                closeAllPopups();

            }
        );

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initialize() {

        createPopups();

        setupButtonEvents();

        setupBackdropEvents();

        setupKeyboardEvents();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();

    }


})();
