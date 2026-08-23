/* =========================================================
   CPTMARKETS TRADE POPUPS
   trade-popups.js
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const overlay =
        document.getElementById("tradePopupOverlay");

    const confirmPopup =
        document.getElementById("tradeConfirmPopup");

    const openedPopup =
        document.getElementById("tradeOpenedPopup");

    const closedPopup =
        document.getElementById("tradeClosedPopup");


    const closeBtn =
        document.getElementById("tradePopupClose");

    const cancelBtn =
        document.getElementById("tradePopupCancel");

    const confirmBtn =
        document.getElementById("tradePopupConfirm");

    const openedOkBtn =
        document.getElementById("tradeOpenedOk");

    const closedOkBtn =
        document.getElementById("tradeClosedOk");


    /* =====================================================
       HIDE ALL POPUPS
       ===================================================== */

    function hideAllPopups() {

        if (overlay) {

            overlay.classList.remove("active");

        }

        if (confirmPopup) {

            confirmPopup.classList.remove("active");

        }

        if (openedPopup) {

            openedPopup.classList.remove("active");

        }

        if (closedPopup) {

            closedPopup.classList.remove("active");

        }

    }


    /* =====================================================
       OPEN CONFIRM POPUP
       ===================================================== */

    function showTradeConfirmPopup(
        side,
        currentPrice,
        amount,
        leverage
    ) {

        if (!overlay || !confirmPopup) {

            return;

        }


        const sideBox =
            document.getElementById(
                "confirmTradeSide"
            );


        const priceBox =
            document.getElementById(
                "confirmTradePrice"
            );


        const amountBox =
            document.getElementById(
                "confirmTradeAmount"
            );


        const leverageBox =
            document.getElementById(
                "confirmTradeLeverage"
            );


        const title =
            document.getElementById(
                "tradeConfirmTitle"
            );


        if (sideBox) {

            sideBox.innerText =
                side || "TRADE";

        }


        if (priceBox) {

            priceBox.innerText =
                Number(
                    currentPrice || 0
                ).toFixed(2);

        }


        if (amountBox) {

            amountBox.innerText =
                "$" +
                Number(
                    amount || 0
                ).toFixed(2);

        }


        if (leverageBox) {

            leverageBox.innerText =
                Number(
                    leverage || 100
                ) +
                "x";

        }


        if (title) {

            title.innerText =
                "Confirm " +
                (side || "Trade");

        }


        overlay.classList.add("active");

        confirmPopup.classList.add("active");

    }


    /* =====================================================
       OPEN SUCCESS POPUP
       ===================================================== */

    function showTradeOpenedPopup(
        side,
        entryPrice,
        amount
    ) {

        if (!overlay || !openedPopup) {

            return;

        }


        const sideBox =
            document.getElementById(
                "openedTradeSide"
            );


        const priceBox =
            document.getElementById(
                "openedTradePrice"
            );


        const amountBox =
            document.getElementById(
                "openedTradeAmount"
            );


        if (sideBox) {

            sideBox.innerText =
                side || "TRADE";

        }


        if (priceBox) {

            priceBox.innerText =
                Number(
                    entryPrice || 0
                ).toFixed(2);

        }


        if (amountBox) {

            amountBox.innerText =
                "$" +
                Number(
                    amount || 0
                ).toFixed(2);

        }


        overlay.classList.add("active");

        openedPopup.classList.add("active");

    }


    /* =====================================================
       OPEN CLOSE SUCCESS POPUP
       ===================================================== */

    function showTradeClosedPopup(
        closePrice,
        totalProfitLoss
    ) {

        if (!overlay || !closedPopup) {

            return;

        }


        const priceBox =
            document.getElementById(
                "closedTradePrice"
            );


        const profitBox =
            document.getElementById(
                "closedTradeProfit"
            );


        const finalPL =
            Number(
                totalProfitLoss || 0
            );


        if (priceBox) {

            priceBox.innerText =
                Number(
                    closePrice || 0
                ).toFixed(2);

        }


        if (profitBox) {

            profitBox.innerText =
                (
                    finalPL >= 0
                        ? "+"
                        : ""
                ) +
                "$" +
                finalPL.toFixed(2);


            profitBox.classList.remove(
                "profit",
                "loss"
            );


            profitBox.classList.add(
                finalPL >= 0
                    ? "profit"
                    : "loss"
            );

        }


        overlay.classList.add("active");

        closedPopup.classList.add("active");

    }


    /* =====================================================
       CLOSE POPUP
       ===================================================== */

    function closePopup() {

        hideAllPopups();

    }


    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closePopup
        );

    }


    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            closePopup
        );

    }


    if (openedOkBtn) {

        openedOkBtn.addEventListener(
            "click",
            closePopup
        );

    }


    if (closedOkBtn) {

        closedOkBtn.addEventListener(
            "click",
            closePopup
        );

    }


    /* =====================================================
       PREVENT BACKGROUND CLICK
       ===================================================== */

    if (overlay) {

        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === overlay
                ) {

                    closePopup();

                }

            }
        );

    }


    /* =====================================================
       ESC KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closePopup();

            }

        }
    );


    /* =====================================================
       GLOBAL API
       ===================================================== */

    window.CptTradePopups = {

        showConfirm:
            showTradeConfirmPopup,

        showOpened:
            showTradeOpenedPopup,

        showClosed:
            showTradeClosedPopup,

        close:
            closePopup

    };


})();
