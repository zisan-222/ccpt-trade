/* =========================================================
   CPT MARKETS
   PROFESSIONAL TRADE POPUP SYSTEM
   ========================================================= */


(function () {

    "use strict";


    /* =====================================================
       CREATE POPUP HTML
       ===================================================== */

    const popupHTML = `

        <!-- ================================================
             CONFIRMATION POPUP
             ================================================ -->

        <div
            id="cptConfirmPopup"
            class="cpt-popup-overlay"
        >

            <div class="cpt-popup">

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


        <!-- ================================================
             TRADE OPEN SUCCESS POPUP
             ================================================ -->

        <div
            id="cptOpenSuccessPopup"
            class="cpt-popup-overlay"
        >

            <div class="cpt-popup cpt-popup-success">

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


        <!-- ================================================
             TRADE CLOSE SUCCESS POPUP
             ================================================ -->

        <div
            id="cptCloseSuccessPopup"
            class="cpt-popup-overlay"
        >

            <div class="cpt-popup cpt-popup-success">

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
       INSERT POPUPS
       ===================================================== */

    function createPopups() {

        if (
            document.getElementById(
                "cptConfirmPopup"
            )
        ) {

            return;

        }

        document.body.insertAdjacentHTML(
            "beforeend",
            popupHTML
        );

    }


    /* =====================================================
       GET ELEMENT
       ===================================================== */

    function $(id) {

        return document.getElementById(id);

    }


    /* =====================================================
       OPEN POPUP
       ===================================================== */

    function openPopup(id) {

        const popup = $(id);

        if (!popup) return;

        popup.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    /* =====================================================
       CLOSE POPUP
       ===================================================== */

    function closePopup(id) {

        const popup = $(id);

        if (!popup) return;

        popup.classList.remove("active");

        document.body.style.overflow = "";

    }


    /* =====================================================
       CONFIRM TRADE POPUP
       ===================================================== */

    window.cptShowTradeConfirmation = function (
        side,
        marketPrice,
        leverage,
        callback
    ) {

        createPopups();


        $("cptConfirmTitle").innerText =
            "Confirm " + side + " Trade";


        $("cptConfirmText").innerText =
            "Are you sure you want to open this " +
            side +
            " position?";


        $("cptConfirmSide").innerText =
            side;


        $("cptConfirmPrice").innerText =
            Number(marketPrice).toFixed(2);


        $("cptConfirmLeverage").innerText =
            Number(leverage) + "x";


        const continueButton =
            $("cptConfirmContinue");


        continueButton.onclick = function () {

            closePopup(
                "cptConfirmPopup"
            );


            if (
                typeof callback ===
                "function"
            ) {

                callback();

            }

        };


        $("cptConfirmCancel").onclick =
            function () {

                closePopup(
                    "cptConfirmPopup"
                );

            };


        openPopup(
            "cptConfirmPopup"
        );

    };


    /* =====================================================
       OPEN SUCCESS POPUP
       ===================================================== */

    window.cptShowTradeOpened = function (
        side,
        entryPrice,
        amount,
        leverage
    ) {

        createPopups();


        $("cptSuccessSide").innerText =
            side;


        $("cptSuccessEntry").innerText =
            Number(entryPrice).toFixed(2);


        $("cptSuccessAmount").innerText =
            "$" +
            Number(amount).toFixed(2);


        $("cptSuccessLeverage").innerText =
            Number(leverage) + "x";


        openPopup(
            "cptOpenSuccessPopup"
        );


        /*
         * Automatically close after
         * approximately 1.8 seconds.
         */

        setTimeout(
            function () {

                closePopup(
                    "cptOpenSuccessPopup"
                );

            },
            1800
        );

    };


    /* =====================================================
       CLOSE SUCCESS POPUP
       ===================================================== */

    window.cptShowTradeClosed = function (
        side,
        entryPrice,
        closePrice,
        profitLoss
    ) {

        createPopups();


        $("cptCloseSide").innerText =
            side;


        $("cptCloseEntry").innerText =
            Number(entryPrice).toFixed(2);


        $("cptClosePrice").innerText =
            Number(closePrice).toFixed(2);


        const pl =
            Number(profitLoss);


        $("cptClosePL").innerText =
            (pl >= 0 ? "+" : "-") +
            "$" +
            Math.abs(pl).toFixed(2);


        $("cptClosePL").className =
            "cpt-popup-value " +
            (
                pl >= 0
                    ? "cpt-result-profit"
                    : "cpt-result-loss"
            );


        openPopup(
            "cptCloseSuccessPopup"
        );

    };


    /* =====================================================
       DONE BUTTON
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                event.target &&
                event.target.id ===
                "cptCloseSuccessOK"
            ) {

                closePopup(
                    "cptCloseSuccessPopup"
                );

            }


            if (
                event.target &&
                event.target.id ===
                "cptOpenSuccessOK"
            ) {

                closePopup(
                    "cptOpenSuccessPopup"
                );

            }

        }
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            createPopups
        );

    } else {

        createPopups();

    }


})();
